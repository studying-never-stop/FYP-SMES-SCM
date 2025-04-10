import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SupplierMaterial } from '@/entities/supplier-material.entity'
import { SupplierMaterialsService } from './supplier-materials.service'
import { SupplierMaterialsController } from './supplier-materials.controller'

@Module({
  imports: [TypeOrmModule.forFeature([SupplierMaterial])],
  controllers: [SupplierMaterialsController],
  providers: [SupplierMaterialsService],
  exports: [SupplierMaterialsService],
})
export class SupplierMaterialsModule {}
