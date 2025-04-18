import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { InventoryDataService } from './inventorydata.service'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

@UseGuards(AuthGuard('jwt'))
@Controller('inventorydata')
export class InventoryDataController {
  constructor(private readonly inventoryDataService: InventoryDataService) {}

  /** 顶部汇总卡片数据 */
  @Get('summary')
  async getInventorySummary(@Req() req) {
    const companyId = req.user.companyId
    return this.inventoryDataService.getInventorySummary(companyId)
  }

  /** 库存结构饼图（分类） */
  @Get('structure')
  async getStructure(@Req() req) {
    const companyId = req.user.companyId
    return this.inventoryDataService.getStructureByCategory(companyId)
  }

  /** 出入库趋势图 */
  @Get('trend')
  async getFlowTrend(@Req() req) {
    const companyId = req.user.companyId
    return this.inventoryDataService.getFlowTrend(companyId)
  }

  /** 当前预警库存产品 */
  @Get('warning')
  async getWarningProducts(@Req() req) {
    const companyId = req.user.companyId
    return this.inventoryDataService.getWarningProducts(companyId)
  }
}
