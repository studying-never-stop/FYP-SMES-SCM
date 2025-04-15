import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, In } from 'typeorm';
import { Product } from '@/entities/product.entity';
import { Company } from '@/entities/company.entity';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  /**
   * 根据关键词、行业类型等搜索推荐供应商
   * 支持搜索公司名称 / 产品名称 / 产品分类
   * @param keyword 搜索关键词（产品名 / 公司名 / 分类）
   * @param industry 行业筛选（可选）
   */
  async searchSuppliers(keyword?: string, industry?: string) {
    let companyIdsByProduct: number[] = []   // 根据产品关键词匹配的公司ID
    let companyIdsByName: number[] = []      // 根据公司名称匹配的公司ID

    //  如果有关键词，先从产品中找匹配（按名称或分类）
    if (keyword) {
      const matchingProducts = await this.productRepo.find({
        where: [
          { name: ILike(`%${keyword}%`) },
          { category: ILike(`%${keyword}%`) },
        ],
      });
      companyIdsByProduct = matchingProducts.map(p => p.companyId);
    }

    //  同时也从公司名中模糊匹配
    if (keyword) {
      const matchingCompanies = await this.companyRepo.find({
        where: { name: ILike(`%${keyword}%`) },
      });
      companyIdsByName = matchingCompanies.map(c => c.id);
    }

    //  合并所有匹配到的公司ID（去重）
    const allMatchedCompanyIds = Array.from(new Set([
      ...companyIdsByProduct,
      ...companyIdsByName
    ]));

    //  构造查询条件
    const companyWhere: any = {};
    if (industry) {
      companyWhere.industry = ILike(`%${industry}%`);
    }
    if (keyword) {
      if (allMatchedCompanyIds.length === 0) {
        return []; // 关键词存在但无匹配，直接返回空
      }
      companyWhere.id = In(allMatchedCompanyIds);
    }

    // 最终查询公司及其产品信息
    return this.companyRepo.find({
      where: Object.keys(companyWhere).length ? companyWhere : undefined,
      relations: ['products'], // 加载关联的产品信息
      order: { createdAt: 'DESC' }, // 可选：根据创建时间倒序
    });
  }
}
