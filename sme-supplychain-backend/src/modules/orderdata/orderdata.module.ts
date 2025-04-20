import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../../mongo/order.schema';
import { OrderDataController } from './orderdata.controller';
import { OrderDataService } from './orderdata.service';
import { ProductsModule } from '@/modules/products/products.module';
import { CompanyModule } from '@/modules/company/company.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ProductsModule,
    CompanyModule,
  ],
  controllers: [OrderDataController],
  providers: [OrderDataService],
  exports: [OrderDataService],
})
export class OrderDataModule {}
