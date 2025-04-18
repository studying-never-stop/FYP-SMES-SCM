import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { PredictionService } from './prediction.service'

@Controller('prediction')
@UseGuards(AuthGuard('jwt'))
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) {}

  /** 订单预测 */
  @Get('order-trend')
  async getOrderTrend(@Query('days') days?: string) {
    return this.predictionService.predictOrderTrend(parseInt(days || '7'))
  }

  /** 销售额预测 */
  @Get('revenue-trend')
  async getRevenueTrend(@Query('days') days?: string) {
    return this.predictionService.predictRevenueTrend(parseInt(days || '7'))
  }

  /** 库存变动预测 */
  @Get('stock-trend')
  async getStockTrend(@Query('days') days?: string) {
    return this.predictionService.predictStockTrend(parseInt(days || '7'))
  }

  /** 热门产品预测 */
  @Get('top-products')
  async getTopPredictedProducts(@Query('days') days?: string) {
    return this.predictionService.predictTopProducts(parseInt(days || '7'))
  }

  //数据卡
  @Get('summary')
@UseGuards(AuthGuard('jwt'))
async getSummary(@Req() req) {
  return this.predictionService.getPredictionSummary(req.user.companyId);
}
}
