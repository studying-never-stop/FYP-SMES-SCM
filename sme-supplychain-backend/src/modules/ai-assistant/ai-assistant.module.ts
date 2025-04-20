import { Module } from '@nestjs/common';
import { AiAssistantController } from './ai-assistant.controller';
import { AiAssistantService } from './ai-assistant.service';
import { OrderDataModule } from '../orderdata/orderdata.module';
import { InventoryDataModule } from '../inventorydata/inventorydata.module';
import { PredictionModule } from '../prediction/prediction.module';

@Module({
  imports: [OrderDataModule, InventoryDataModule, PredictionModule],
  controllers: [AiAssistantController],
  providers: [AiAssistantService],
})
export class AiAssistantModule {}
