import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PurchaseOrder } from '@/entities/purchase-order.entity'
import { RawMaterial } from '@/entities/raw-material.entity'
import { Supplier } from '@/entities/supplier.entity'
import { PurchaseOrdersService } from './purchase-orders.service'
import { PurchaseOrdersController } from './purchase-orders.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PurchaseOrder, RawMaterial, Supplier])],
  providers: [PurchaseOrdersService],
  controllers: [PurchaseOrdersController],
  exports: [PurchaseOrdersService],
})
export class PurchaseOrdersModule {}