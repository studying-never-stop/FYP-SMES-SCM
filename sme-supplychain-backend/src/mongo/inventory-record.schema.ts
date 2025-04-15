import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type InventoryRecordDocument = InventoryRecord & Document

@Schema({ timestamps: true })
export class InventoryRecord {
  @Prop({ required: true })
  companyId: number // 公司 ID

  @Prop({ required: true })
  productId: number // 产品 ID（关联库存/产品）

  @Prop({ required: true, enum: ['in', 'out'] })
  type: 'in' | 'out' // 操作类型：入库 / 出库

  @Prop({ required: true })
  quantity: number // 数量

  @Prop()
  operatorId: number // 操作人（员工 ID）

  @Prop()
  note?: string // 备注

  @Prop()
  orderId?: string // 来源订单 ID（如通过订单入库）

  @Prop({ default: true })
  isActive: boolean // 记录是否有效（支持逻辑删除）

  // createdAt / updatedAt 会自动由 timestamps 提供
}

export const InventoryRecordSchema = SchemaFactory.createForClass(InventoryRecord)
