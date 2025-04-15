import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type OrderRecordDocument = OrderRecord & Document

@Schema({ timestamps: true })
export class OrderRecord {
  // MongoDB ObjectId 类型
  @Prop({ required: true, type: Types.ObjectId })
  orderId: Types.ObjectId

  @Prop({ required: true })
  status: 'created' | 'processing' | 'packing' | 'shipped' | 'completed' | 'cancelled'

  @Prop({ required: true })
  operatorCompanyId: number

  @Prop()
  message?: string
}

export const OrderRecordSchema = SchemaFactory.createForClass(OrderRecord)
