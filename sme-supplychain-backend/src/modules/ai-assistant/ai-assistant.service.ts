import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { buildCompanyReportData } from '../report-ai/report-data.helper'
import { OrderDataService } from '../orderdata/orderdata.service'
import { InventoryDataService } from '../inventorydata/inventorydata.service'
import { PredictionService } from '../prediction/prediction.service'

// 定义消息格式和返回结构类型
interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatResponse {
  message?: {
    content: string
  }
}

@Injectable()
export class AiAssistantService {
  constructor(
    private readonly orderDataService: OrderDataService,
    private readonly inventoryDataService: InventoryDataService,
    private readonly predictionService: PredictionService
  ) {}

  async chat(companyId: number, messages: ChatMessage[]): Promise<string> {
    // 获取该公司完整的数据结构（订单、库存、预测）
    const data = await buildCompanyReportData(
      companyId,
      this.orderDataService,
      this.inventoryDataService,
      this.predictionService
    )

    // 拼接系统提示（上下文注入）
    const systemPrompt = `
You are a smart AI assistant specialized in business operations. The following is the company's real-time data:

Order Summary:
${JSON.stringify(data.orderSummary, null, 2)}

Inventory Summary:
${JSON.stringify(data.inventorySummary, null, 2)}

Forecasts:
${JSON.stringify(data.forecast, null, 2)}

Use this data to answer user questions. Be clear, helpful, and concise. Offer insights and suggestions when applicable.
    `.trim()

    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ]

    try {
      const response = await axios.post<ChatResponse>('http://localhost:11434/api/chat', {
        model: 'llama3',
        messages: fullMessages,
        stream: false
      })

      return response.data.message?.content || 'Sorry, I could not generate a response.'
    } catch (error) {
      console.error('[AI Assistant Error]', error)
      return 'There was an error communicating with the AI model.'
    }
  }
}
