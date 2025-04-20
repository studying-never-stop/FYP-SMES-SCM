import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Order, OrderSchema } from '@/mongo/order.schema'
import { PredictionService } from './prediction.service'
import { PredictionController } from './prediction.controller'
import { ProductsModule } from '../products/products.module'
import { InventoryRecord, InventoryRecordSchema } from '@/mongo/inventory-record.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([
        { name: InventoryRecord.name, schema: InventoryRecordSchema }
      ]),
    ProductsModule,
  ],
  providers: [PredictionService],
  controllers: [PredictionController],
  exports: [PredictionService],
})
export class PredictionModule {}
