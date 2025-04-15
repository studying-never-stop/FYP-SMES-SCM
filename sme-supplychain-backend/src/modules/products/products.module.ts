import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Product } from '../../entities/product.entity'
import { Inventory } from '../../entities/inventory.entity'
import { ProductService } from './products.service'
import { ProductController } from './products.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Product, Inventory])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductsModule {}