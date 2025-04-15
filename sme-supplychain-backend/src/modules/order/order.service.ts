import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Order, OrderDocument } from '../../mongo/order.schema'
import { OrderRecordService } from '../order-record/order-record.service'
import { CompanyService } from '../company/company.service'
import { ProductService } from '../products/products.service'
import { InventoryService } from '../Inventory/inventory.service'

// Define order and payment status types
export type OrderStatus = 'created' | 'processing' | 'packing' | 'shipped' | 'completed' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded'

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly recordService: OrderRecordService,
    private readonly companyService: CompanyService,
    private readonly productService: ProductService,
    private readonly inventoryService: InventoryService,
  ) {}

  /**
   * 创建订单（多商品）并写入操作记录
   */
  async create(orderData: Partial<Order>): Promise<Order> {
    const totalPrice = (orderData.items || []).reduce((sum, item) => {
      return sum + (item.price || 0) * (item.quantity || 0)
    }, 0)

    const order = await this.orderModel.create({
      ...orderData,
      totalPrice,
    })

    await this.recordService.create({
      orderId: order._id as Types.ObjectId,
      status: 'created',
      operatorCompanyId: order.buyerCompanyId,
      message: 'order has created',
    })

    return order
  }

  /** 查询所有订单（管理员专用） */
  async findAll(): Promise<any[]> {
    const orders = await this.orderModel.find().lean()
    const withCompany = await this.attachCompanyInfo(orders)
    return this.attachProductInfo(withCompany)
  }

  /** 查询公司相关订单 */
  async findAllByCompany(companyId: number): Promise<any[]> {
    const orders = await this.orderModel.find({
      $or: [{ buyerCompanyId: companyId }, { sellerCompanyId: companyId }],
    }).lean()
    const withCompany = await this.attachCompanyInfo(orders)
    return this.attachProductInfo(withCompany)
  }

  /** 查询公司作为买方发起的订单 */
  async findByBuyer(companyId: number): Promise<any[]> {
    const orders = await this.orderModel.find({ buyerCompanyId: companyId }).lean()
    const withCompany = await this.attachCompanyInfo(orders)
    return this.attachProductInfo(withCompany)
  }

  /** 查询公司作为卖方的指定状态订单 */
  async findByCompanyAndStatus(companyId: number, status: OrderStatus): Promise<any[]> {
    const orders = await this.orderModel.find({
      sellerCompanyId: companyId,
      status,
    }).lean()
    const withCompany = await this.attachCompanyInfo(orders)
    return this.attachProductInfo(withCompany)
  }

  /** 查询订单详情 */
  async findById(id: string): Promise<any> {
    const order = await this.orderModel.findById(id).lean()
    if (!order) return null
    const withCompany = await this.attachCompanyInfo([order])
    const withProducts = await this.attachProductInfo(withCompany)
    return withProducts[0]
  }

  /** 查询订单记录（带筛选） */
  async queryOrders(
    companyId: number,
    role: 'all' | 'buyer' | 'seller',
    targetCompanyName: string = '',
    startDate?: Date,
    endDate?: Date
  ): Promise<any[]> {
    const query: any = {}
    if (role === 'buyer') query.buyerCompanyId = companyId
    else if (role === 'seller') query.sellerCompanyId = companyId
    else query.$or = [{ buyerCompanyId: companyId }, { sellerCompanyId: companyId }]

    if (startDate && endDate) {
      query.createdAt = { $gte: startDate, $lte: endDate }
    }

    const orders = await this.orderModel.find(query).lean()
    const withCompany = await this.attachCompanyInfo(orders)
    const withProducts = await this.attachProductInfo(withCompany)

    return withProducts.filter(order => {
      if (!targetCompanyName) return true
      const lower = targetCompanyName.toLowerCase()
      return (
        order.buyerCompany?.name?.toLowerCase().includes(lower) ||
        order.sellerCompany?.name?.toLowerCase().includes(lower)
      )
    })
  }

  /** 更新订单状态（新增出库校验） */
  async updateStatus(id: string, status: OrderStatus, userId: number): Promise<Order | null> {
    const order = await this.orderModel.findById(id)
    if (!order) return null

    if (order.status === 'cancelled') throw new Error('Cancelled orders cannot be modified')
    if (status === 'completed' && order.paymentStatus !== 'paid') throw new Error('Unpaid orders cannot be marked as completed')
    if (status === 'cancelled' && order.paymentStatus === 'paid') throw new Error('Paid order, please refund before cancellation')

    // 发货前校验库存是否足够
    if (status === 'shipped') {
      for (const item of order.items || []) {
        const enough = await this.inventoryService.checkStockEnough(item.productId, order.sellerCompanyId, item.quantity)
        if (!enough) throw new Error(`There is not enough stock to ship: Product #${item.productId}`)
      }
    }

    order.status = status
    await order.save()

    await this.recordService.create({
      orderId: order._id as Types.ObjectId,
      status,
      operatorCompanyId: order.sellerCompanyId,
      message: `Order status changed to ${status}`,
    })

    // 发货时执行扣减库存
    if (status === 'shipped') {
      for (const item of order.items || []) {
        await this.inventoryService.decreaseQuantity(
          item.productId,
          order.sellerCompanyId,
          item.quantity,
          String(order._id),
          userId,
          'Order shipped, stock decreased'
        )
      }
    }

    return order
  }

  /** 更新付款状态（新增自动入库） */
  async updatePaymentStatus(id: string, paymentStatus: PaymentStatus, userId: number): Promise<Order | null> {
    const order = await this.orderModel.findById(id)
    if (!order) return null

    order.paymentStatus = paymentStatus
    await order.save()

    await this.recordService.create({
      orderId: order._id as Types.ObjectId,
      status: order.status,
      operatorCompanyId: order.buyerCompanyId,
      message: `Payment status changed to ${paymentStatus}`,
    })

    // 如果支付完成，自动为买方入库
    if (paymentStatus === 'paid') {
      for (const item of order.items || []) {
        let targetProductId = item.productId

        // 如果库存不存在，新建产品并设为不提供状态
        const hasInventory = await this.inventoryService.hasInventory(item.productId, order.buyerCompanyId)
        if (!hasInventory) {
          const baseProduct = await this.productService.findOne(item.productId, order.sellerCompanyId)
          if (!baseProduct) throw new Error(`Product #${item.productId} not found under seller company`)
          const { id, createdAt, updatedAt, ...baseFields } = baseProduct
            const newProduct = await this.productService.create({
            ...baseFields,
            companyId: order.buyerCompanyId,
            isInProvide: false,
            })
          targetProductId = newProduct.id
        }

        await this.inventoryService.increaseQuantity(
          targetProductId,
          order.buyerCompanyId,
          item.quantity,
          String(order._id),
          userId,
          'Order paid, stock increased'
        )
      }
    }

    return order
  }

  /** 删除订单 */
  async remove(id: string): Promise<Order | null> {
    return this.orderModel.findByIdAndDelete(id).exec()
  }

  /** 获取订单操作记录 */
  async getOperationRecords(orderId: string) {
    return this.recordService.findByOrderId(orderId)
  }

  /** 附加公司信息 */
  private async attachCompanyInfo(orders: any[]): Promise<any[]> {
    const companies = await this.companyService.findAll()
    const companyMap = new Map(companies.map(c => [c.id, c]))
    return orders.map(order => ({
      ...order,
      buyerCompany: companyMap.get(order.buyerCompanyId),
      sellerCompany: companyMap.get(order.sellerCompanyId),
    }))
  }

  /** 附加产品名称信息 */
  private async attachProductInfo(orders: any[]): Promise<any[]> {
    const allItems = orders.flatMap(order => order.items || [])
    const productIds = [...new Set(allItems.map(i => i.productId))]
    const products = await this.productService.findByIds(productIds)
    const productMap = new Map(products.map(p => [p.id, p.name]))

    return orders.map(order => ({
      ...order,
      items: (order.items || []).map(item => ({
        ...item,
        name: productMap.get(item.productId) || `#${item.productId}`,
      }))
    }))
  }
}
