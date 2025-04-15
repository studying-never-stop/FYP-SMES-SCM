import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from '../../entities/product.entity'
import { Inventory } from '../../entities/inventory.entity'

@Injectable()
export class CategoryOverviewService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async getCategoryStats(companyId: number) {
    const categories = await this.productRepo
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .where('product.companyId = :companyId', { companyId })
      .getRawMany()

    const result = await Promise.all(
      categories.map(async (item) => {
        const category = item.category

        const priceStats = await this.productRepo
          .createQueryBuilder('product')
          .select('MIN(product.price)', 'minPrice')
          .addSelect('MAX(product.price)', 'maxPrice')
          .where('product.companyId = :companyId', { companyId })
          .andWhere('product.category = :category', { category })
          .getRawOne()

        const stockStats = await this.inventoryRepo
          .createQueryBuilder('inventory')
          .leftJoin('inventory.product', 'product')
          .select('SUM(inventory.quantity)', 'totalStock')
          .where('inventory.companyId = :companyId', { companyId })
          .andWhere('product.category = :category', { category })
          .getRawOne()

        return {
          category,
          minPrice: +priceStats.minPrice || 0,
          maxPrice: +priceStats.maxPrice || 0,
          totalStock: +stockStats.totalStock || 0,
          recentSales: null,
          recentInbound: null
        }
      })
    )

    return result
  }
}
