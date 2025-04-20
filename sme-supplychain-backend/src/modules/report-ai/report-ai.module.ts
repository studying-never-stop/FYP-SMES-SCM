import { Module } from '@nestjs/common';
import { ReportAiController } from './report-ai.controller';
import { ReportAiService } from './report-ai.service';
import { OrderDataModule } from '../orderdata/orderdata.module';
import { InventoryDataModule } from '../inventorydata/inventorydata.module';
import { PredictionModule } from '../prediction/prediction.module';

@Module({
  imports: [OrderDataModule, InventoryDataModule, PredictionModule],
  controllers: [ReportAiController],
  providers: [ReportAiService],
})
export class ReportAiModule {}
