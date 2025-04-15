import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { CategoryOverviewService } from './category-overview.service'
import { AuthGuard } from '@nestjs/passport'


@UseGuards(AuthGuard('jwt'))
@Controller('category-overview')
export class CategoryOverviewController {
  constructor(private readonly service: CategoryOverviewService) {}

  @Get()
  async getOverview(@Req() req) {
    const companyId = req.user['companyId']
    return this.service.getCategoryStats(companyId)
  }
}
