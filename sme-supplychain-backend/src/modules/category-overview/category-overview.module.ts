import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CategoryOverviewService } from './category-overview.service'
import { CategoryOverviewController } from './category-overview.controller'
import { Product } from '../../entities/product.entity'
import { Inventory } from '../../entities/inventory.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Product, Inventory])],
  controllers: [CategoryOverviewController],
  providers: [CategoryOverviewService],
})
export class CategoryOverviewModule {}
