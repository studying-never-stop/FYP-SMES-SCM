import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Product } from '../../entities/product.entity'
import { Inventory } from '../../entities/inventory.entity'

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async create(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepo.create(productData)
    const savedProduct = await this.productRepo.save(product)

    // 创建初始库存记录（0 数量）
    const inventory = this.inventoryRepo.create({
      product: savedProduct,
      companyId: savedProduct.companyId,
      quantity: 0,
    })
    await this.inventoryRepo.save(inventory)

    return savedProduct
  }

  findAllByCompany(companyId: number): Promise<Product[]> {
    return this.productRepo.find({ where: { companyId } })
  }

  findAll(): Promise<Product[]> {
    return this.productRepo.find({relations:['company'],})
  }

  findOne(id: number, companyId: number): Promise<Product | null> {
    return this.productRepo.findOne({ where: { id, companyId } })
  }

  /**
   * 根据一组 ID 查询产品（用于订单中显示产品名称）
   */
  async findByIds(ids: number[]): Promise<Product[]> {
    if (!ids || ids.length === 0) return []
    return this.productRepo.find({ where: { id: In(ids) } })
  }

  async update(id: number, data: Partial<Product>, companyId: number) {
    return this.productRepo.update({ id, companyId }, data)
  }

  async remove(id: number, companyId: number) {
    return this.productRepo.delete({ id, companyId })
  }

  //返回category表
  async findAllCategoriesByCompany(companyId: number): Promise<string[]> {
    const result = await this.productRepo.createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .where('product.companyId = :companyId', { companyId })
      .getRawMany()
  
    return result.map(row => row.category)
  }

  //返回根据公司和分类的产品信息
  async findAllByCompanyAndCategory(companyId: number, category?: string): Promise<Product[]> {
    const query = this.productRepo.createQueryBuilder('product')
      .where('product.companyId = :companyId', { companyId })
  
    if (category && category !== 'all') {
      query.andWhere('product.category = :category', { category })
    }
  
    return await query.getMany()
  }
}
