import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Order, OrderDocument } from '@/mongo/order.schema'
import { InventoryRecord, InventoryRecordDocument } from '@/mongo/inventory-record.schema'
import { ProductService } from '../products/products.service'

@Injectable()
export class PredictionService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly productService: ProductService,

    @InjectModel(InventoryRecord.name)
    private readonly inventoryRecordModel: Model<InventoryRecordDocument>
  ) {}

  /** 订单数量预测（7天） */
  async predictOrderTrend(days = 7): Promise<{ date: string, actual?: number, predicted: number }[]> {
    const recentDays = 14
    const now = new Date()
    const start = new Date()
    start.setDate(now.getDate() - recentDays)

    const raw = await this.orderModel.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ])

    const history = raw.map((r, i) => ({ x: i, y: r.count, date: r._id }))
    const X = history.map(p => p.x)
    const Y = history.map(p => p.y)

    const n = X.length
    const xMean = X.reduce((a, b) => a + b, 0) / n
    const yMean = Y.reduce((a, b) => a + b, 0) / n
    const slope = X.reduce((sum, x, i) => sum + (x - xMean) * (Y[i] - yMean), 0) /
                  X.reduce((sum, x) => sum + (x - xMean) ** 2, 0)
    const intercept = yMean - slope * xMean

    const result = [...history.map(h => ({ date: h.date, actual: h.y, predicted: h.y }))]
    const lastIndex = X[X.length - 1] + 1
    for (let i = 0; i < days; i++) {
      const index = lastIndex + i
      const date = new Date()
      date.setDate(now.getDate() + i + 1)
      result.push({
        date: date.toISOString().split('T')[0],
        actual: undefined,
        predicted: Math.max(Math.round(intercept + slope * index), 0)
      })
    }
    return result
  }

  /** 销售额预测（7天） */
  async predictRevenueTrend(days = 7): Promise<{ date: string, actual?: number, predicted: number }[]> {
    const recentDays = 14
    const now = new Date()
    const start = new Date()
    start.setDate(now.getDate() - recentDays)

    const raw = await this.orderModel.aggregate([
      { $match: { createdAt: { $gte: start }, status: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ])

    const history = raw.map((r, i) => ({ x: i, y: r.total, date: r._id }))
    const X = history.map(p => p.x)
    const Y = history.map(p => p.y)

    const n = X.length
    const xMean = X.reduce((a, b) => a + b, 0) / n
    const yMean = Y.reduce((a, b) => a + b, 0) / n
    const slope = X.reduce((sum, x, i) => sum + (x - xMean) * (Y[i] - yMean), 0) /
                  X.reduce((sum, x) => sum + (x - xMean) ** 2, 0)
    const intercept = yMean - slope * xMean

    const result = [...history.map(h => ({ date: h.date, actual: h.y, predicted: h.y }))]
    const lastIndex = X[X.length - 1] + 1
    for (let i = 0; i < days; i++) {
      const index = lastIndex + i
      const date = new Date()
      date.setDate(now.getDate() + i + 1)
      result.push({
        date: date.toISOString().split('T')[0],
        actual: undefined,
        predicted: Math.max(Math.round(intercept + slope * index), 0)
      })
    }
    return result
  }

  /** 热门产品销量预测（默认取销量前5） */
  async predictTopProducts(days = 7) {
    const recentDays = 14
    const start = new Date()
    start.setDate(start.getDate() - recentDays)

    const raw = await this.orderModel.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          total: { $sum: '$items.quantity' }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 5 }
    ])

    const result = raw.map(r => ({ productId: r._id, quantity: r.total }))
    return result
  }

  /** 库存变化趋势预测 */
  async predictStockTrend(days = 7): Promise<{ date: string, in: number, out: number }[]> {
    const recentDays = 14
    const now = new Date()
    const start = new Date()
    start.setDate(now.getDate() - recentDays)

    const raw = await this.inventoryRecordModel.aggregate([
      { $match: { createdAt: { $gte: start } } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$type'
          },
          total: { $sum: '$quantity' }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          in: {
            $sum: { $cond: [{ $eq: ['$_id.type', 'in'] }, '$total', 0] }
          },
          out: {
            $sum: { $cond: [{ $eq: ['$_id.type', 'out'] }, '$total', 0] }
          }
        }
      },
      {
        $project: { date: '$_id', in: 1, out: 1, _id: 0 }
      },
      { $sort: { date: 1 } }
    ])

    return raw
  }

 //
 async getPredictionSummary(companyId: number) {
    // 1. 本月订单数 & 完成率
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  
    const [monthlyOrders, completedOrders] = await Promise.all([
      this.orderModel.countDocuments({
        buyerCompanyId: companyId,
        createdAt: { $gte: firstDay }
      }),
      this.orderModel.countDocuments({
        buyerCompanyId: companyId,
        createdAt: { $gte: firstDay },
        status: 'completed'
      }),
    ]);
  
    // 2. 销售额增长率（本月 vs 上月）
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const firstDayThisMonth = firstDay;
  
    const [lastMonthRevenue, thisMonthRevenue] = await Promise.all([
      this.orderModel.aggregate([
        { $match: { buyerCompanyId: companyId, createdAt: { $gte: firstDayLastMonth, $lt: firstDayThisMonth }, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
      this.orderModel.aggregate([
        { $match: { buyerCompanyId: companyId, createdAt: { $gte: firstDayThisMonth }, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
      ]),
    ]);
  
    const revenueGrowth = lastMonthRevenue[0]?.total
      ? (thisMonthRevenue[0]?.total || 0) / lastMonthRevenue[0].total - 1
      : 0;
  
    // 3. 最热商品名称
    const top = await this.orderModel.aggregate([
      { $match: { buyerCompanyId: companyId } },
      { $unwind: '$items' },
      { $group: { _id: '$items.productId', quantity: { $sum: '$items.quantity' } } },
      { $sort: { quantity: -1 } },
      { $limit: 1 }
    ]);
  
    let topProductName = '';
    if (top.length > 0) {
      const product = await this.productService.findById(top[0]._id);
      topProductName = product?.name || '';
    }
  
    return {
      monthlyOrderCount: monthlyOrders,
      completionRate: monthlyOrders ? completedOrders / monthlyOrders : 0,
      revenueGrowth,
      topProductName
    };
  }

}
