import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common'
import { AiAssistantService } from './ai-assistant.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('ai-assistant')
@UseGuards(AuthGuard('jwt'))
export class AiAssistantController {
  constructor(private readonly aiAssistantService: AiAssistantService) {}

  @Post('chat')
  async chat(@Body() body: { messages: { role: string; content: string }[] }, @Req() req) {
    const companyId = req.user.companyId

    // ✅ 类型断言：将 role 限定为 union 类型
    const messages = body.messages as { role: 'user' | 'assistant' | 'system'; content: string }[]

    return this.aiAssistantService.chat(companyId, messages)
  }
}