import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from '@/entities/product.entity'
import { Company } from '@/entities/company.entity'
import { SupplierService } from './supplier.service'
import { SupplierController } from './supplier.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Product, Company])], // 注册使用的实体
  providers: [SupplierService], // 注册服务
  controllers: [SupplierController], // 注册控制器
  exports: [SupplierService], // 如果其他模块需要用到推荐逻辑，可导出
})
export class SupplierModule {}