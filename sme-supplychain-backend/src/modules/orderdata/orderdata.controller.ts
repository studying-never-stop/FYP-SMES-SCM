import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { OrderDataService } from './orderdata.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('orderdata')
export class OrderDataController {
  constructor(private readonly orderdataService: OrderDataService) {}

  // 1. Summary cards
  @Get('summary')
  @UseGuards(AuthGuard('jwt'))
  async getOrderSummary(@Req() req) {
    const companyId = req.user.companyId
    return this.orderdataService.getOrderSummary(companyId);
  }

  // 2. Pie chart - Order status
  @Get('status-summary')
  @UseGuards(AuthGuard('jwt'))
  async getStatusSummary(@Req() req) {
    const companyId = req.user.companyId
    return this.orderdataService.getStatusSummary(companyId);
  }

  // 3. Line chart - Order trend
  @Get('trend')
  @UseGuards(AuthGuard('jwt'))
  async getOrderTrend(@Req() req) {
    const companyId = req.user.companyId
    return this.orderdataService.getOrderTrend(companyId);
  }

  // 4. Line chart - Revenue trend
  @Get('revenue-trend')
  @UseGuards(AuthGuard('jwt'))
  async getRevenueTrend(@Req() req) {
    const companyId = req.user.companyId
    return this.orderdataService.getRevenueTrend(companyId);
  }

  // 5. Bar chart - Top products
  @Get('top-products')
  @UseGuards(AuthGuard('jwt'))
  async getTopProducts(@Req() req) {
    const companyId = req.user.companyId
    return this.orderdataService.getTopProducts(companyId);
  }

  // 6. Bar chart - Top buyers
  @Get('top-buyers')
  @UseGuards(AuthGuard('jwt'))
  async getTopBuyers(@Req() req) {
    const companyId = req.user.companyId
    return this.orderdataService.getTopBuyers(companyId);
  }
}
