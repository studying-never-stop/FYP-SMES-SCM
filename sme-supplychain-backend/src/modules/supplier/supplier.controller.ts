import { Controller, Get, Query } from '@nestjs/common';
import { SupplierService } from './supplier.service';

@Controller('suppliers')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  /**
   * 搜索供应商（支持按产品关键词或行业）
   * @param keyword 产品关键词（名称、类别等）
   * @param industry 行业类型（如汽车、化工）
   */
  @Get('search')
  async searchSuppliers(
    @Query('keyword') keyword?: string,
    @Query('industry') industry?: string,
  ) {
    return this.supplierService.searchSuppliers(keyword, industry);
  }
}
