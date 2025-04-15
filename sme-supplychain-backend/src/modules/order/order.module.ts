import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Order, OrderSchema } from '../../mongo/order.schema'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'
import { OrderRecordModule } from '../order-record/order-record.module'
import { CompanyModule } from '../company/company.module'
import { ProductsModule } from '../products/products.module'
import { InventoryModule } from '../Inventory/inventory.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    OrderRecordModule,
    InventoryModule,
    forwardRef(() => CompanyModule),
    forwardRef(() => ProductsModule),
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}