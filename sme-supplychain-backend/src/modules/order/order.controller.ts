import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    UseGuards,
    Req,
  } from '@nestjs/common'
  import { OrderService, OrderStatus, PaymentStatus } from './order.service'
  import { Order } from '../../mongo/order.schema'
  import { AuthGuard } from '@nestjs/passport'
  
  @Controller('orders')
  @UseGuards(AuthGuard('jwt')) // 启用 JWT 鉴权
  export class OrderController {
    constructor(private readonly orderService: OrderService) {}
  
    /**
     * 创建新订单（自动附加 buyerCompanyId）
     */
    @Post()
    async create(@Body() body: Partial<Order>, @Req() req) {
      return this.orderService.create({
        ...body,
        buyerCompanyId: req.user.companyId,
      })
    }
  
    /**
     * 获取当前公司相关的所有订单（买卖双方均可）
     */
    @Get()
    async findAll(@Req() req) {
      return this.orderService.findAllByCompany(req.user.companyId)
    }
  
    /**
     * 获取当前公司作为买方创建的订单
     */
    @Get('my')
    async findMyOrders(@Req() req) {
      return this.orderService.findByBuyer(req.user.companyId)
    }
  
    /**
     * 获取当前公司作为卖方且处于指定状态的订单
     */
    @Get('status/:status')
    async findByStatus(@Param('status') status: OrderStatus, @Req() req) {
      return this.orderService.findByCompanyAndStatus(req.user.companyId, status)
    }
  
    /**
     * 获取订单详细信息
     */
    @Get(':id')
    async findById(@Param('id') id: string) {
      return this.orderService.findById(id)
    }
  
    /**
     * 获取指定订单的所有操作记录
     */
    @Get(':id/records')
    async getRecords(@Param('id') id: string) {
      return this.orderService.getOperationRecords(id)
    }
  
    /**
     * 更新订单状态（如 processing → packing）
     */
    @Patch(':id/status/:status')
    async updateStatus(
      @Req() req,
      @Param('id') id: string,
      @Param('status') status: OrderStatus,
    ) {
      return this.orderService.updateStatus(id, status, req.user.userId)
    }
  
    /**
     * 更新订单付款状态（如 unpaid → paid）
     */
    @Patch(':id/payment/:status')
    async updatePaymentStatus(
      @Req() req,
      @Param('id') id: string,
      @Param('status') paymentStatus: PaymentStatus,
    ) {
      return this.orderService.updatePaymentStatus(id, paymentStatus, req.user.userId)
    }
  
    /**
     * 删除订单（用于测试）
     */
    @Delete(':id')
    async delete(@Param('id') id: string) {
      return this.orderService.remove(id)
    }
  
    /**
     * 查询订单记录（支持角色筛选、公司名称、日期范围）
     */
    @Post('query-records')
    async queryRecords(
      @Req() req,
      @Body()
      body: {
        role: 'all' | 'buyer' | 'seller'
        targetCompanyName?: string
        startDate?: string
        endDate?: string
      },
    ) {
      const companyId = req.user.companyId
      const { role, targetCompanyName = '', startDate, endDate } = body
  
      const parsedStart = startDate ? new Date(startDate) : undefined
      const parsedEnd = endDate ? new Date(endDate) : undefined
  
      return this.orderService.queryOrders(
        companyId,
        role,
        targetCompanyName,
        parsedStart,
        parsedEnd,
      )
    }
  }
  