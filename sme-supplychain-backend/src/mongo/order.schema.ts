import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

// Mongoose文档类型
export type OrderDocument = Order & Document

@Schema({ timestamps: true })
export class Order {
  // 多商品项（每项包括 productId, quantity, price）
  @Prop({
    type: [
      {
        productId: Number,
        quantity: Number,
        price: Number,
      },
    ],
    required: true,
  })
  items: {
    productId: number
    quantity: number
    price: number
  }[]

  // 买方公司 ID
  @Prop({ required: true })
  buyerCompanyId: number

  // 卖方公司 ID
  @Prop({ required: true })
  sellerCompanyId: number

  //订单总价
  @Prop({ required: true })
  totalPrice: number

  // 订单状态（默认 created）
  @Prop({ default: 'created' })
  status: 'created' | 'processing' | 'packing' | 'shipped' | 'completed' | 'cancelled'

  // 付款状态（默认 unpaid）
  @Prop({ default: 'unpaid' })
  paymentStatus: 'unpaid' | 'paid' | 'refunded'

  // 备注信息（可选）
  @Prop()
  note: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)