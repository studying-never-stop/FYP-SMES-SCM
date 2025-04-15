import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { OrderRecord, OrderRecordDocument } from '../../mongo/order-record.schema'

@Injectable()
export class OrderRecordService {
  constructor(
    @InjectModel(OrderRecord.name)
    private readonly recordModel: Model<OrderRecordDocument>,
  ) {}

  /**
   * 创建操作记录
   * @param record 部分记录字段
   * @returns 创建好的记录
   */
  async create(record: Partial<OrderRecord>): Promise<OrderRecord> {
    return this.recordModel.create(record)
  }

  /**
   * 查询指定订单的所有记录（按创建时间升序）
   * @param orderId 订单 ID（字符串形式）
   * @returns 对应订单的所有记录
   */
  async findByOrderId(orderId: string): Promise<OrderRecord[]> {
    return this.recordModel
      .find({ orderId: new Types.ObjectId(orderId) }) // 注意转成 ObjectId 类型
      .sort({ createdAt: 1 })
      .exec()
  }

  /**
   * 查询所有订单记录（一般用于调试）
   * @returns 所有记录数组
   */
  async findAll(): Promise<OrderRecord[]> {
    return this.recordModel.find().exec()
  }
}
