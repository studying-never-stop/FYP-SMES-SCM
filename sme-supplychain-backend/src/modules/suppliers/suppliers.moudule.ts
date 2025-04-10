import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Supplier } from '@/entities/supplier.entity'
import { SupplierMaterial } from '@/entities/supplier-material.entity'
import { SuppliersService } from './suppliers.service'
import { SuppliersController } from './suppliers.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, SupplierMaterial])],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService],
})
export class SuppliersModule {}

