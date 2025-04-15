import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common'
import { OrderRecordService } from './order-record.service'
import { AuthGuard } from '@nestjs/passport'
import { OrderRecord } from '../../mongo/order-record.schema'

@Controller('order-records')
@UseGuards(AuthGuard('jwt'))
export class OrderRecordController {
  constructor(private readonly recordService: OrderRecordService) {}

  // 创建记录（手动创建日志）
  @Post()
  async create(@Body() body: Partial<OrderRecord>) {
    return this.recordService.create(body)
  }

  // 获取某个订单的所有日志记录
  @Get(':orderId')
  async findByOrderId(@Param('orderId') orderId: string) {
    return this.recordService.findByOrderId(orderId)
  }

  // 获取全部日志记录（管理员用途）
  @Get()
  async findAll() {
    return this.recordService.findAll()
  }
}