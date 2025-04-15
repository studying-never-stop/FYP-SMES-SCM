import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { OrderRecord, OrderRecordSchema } from '../../mongo/order-record.schema'
import { OrderRecordService } from './order-record.service'
import { OrderRecordController } from './order-record.controller'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OrderRecord.name, schema: OrderRecordSchema }]),
  ],
  providers: [OrderRecordService],
  controllers: [OrderRecordController],
  exports: [OrderRecordService],
})
export class OrderRecordModule {}