import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { OrderDataService } from '../orderdata/orderdata.service';
import { InventoryDataService } from '../inventorydata/inventorydata.service';
import { PredictionService } from '../prediction/prediction.service';
import { buildCompanyReportData } from './report-data.helper';

@Injectable()
export class ReportAiService {
  constructor(
    private readonly orderDataService: OrderDataService,
    private readonly inventoryDataService: InventoryDataService,
    private readonly predictionService: PredictionService
  ) {}

  async generateUnifiedReport(companyId: number): Promise<string> {
    const reportData = await buildCompanyReportData(
      companyId,
      this.orderDataService,
      this.inventoryDataService,
      this.predictionService
    );

    const prompt = this.buildPrompt(reportData);

    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3',
      prompt,
      stream: false
    });

    const result = response.data as { response: string };
    return result.response;
  }

  private buildPrompt(data: any): string {
    return `
You are an expert business analyst. Based on the following operational data, generate a comprehensive monthly report in English. The report should include:

1. Current operational summary
2. Inventory and order performance
3. Sales and stock predictions
4. Actionable insights and recommendations
5. Final conclusion

Please write in a clear and professional tone, structured for executive review.

Here is the data:
${JSON.stringify(data, null, 2)}
    `;
  }
}
