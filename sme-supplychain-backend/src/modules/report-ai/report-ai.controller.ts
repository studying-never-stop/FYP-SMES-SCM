import { Controller, Post, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { ReportAiService } from './report-ai.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('report-ai')
@UseGuards(AuthGuard('jwt'))
export class ReportAiController {
  constructor(private readonly reportAiService: ReportAiService) {}

  @Post('generate')
  async generate(@Req() req) {
    const companyId = (req.user as any).companyId;
    return this.reportAiService.generateUnifiedReport(companyId);
  }
}

