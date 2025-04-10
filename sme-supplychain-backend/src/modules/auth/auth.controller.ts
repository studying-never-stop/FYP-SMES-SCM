import {
    Controller,
    Post,
    Body,
    Param,
  } from '@nestjs/common'
  import { AuthService } from './auth.service'
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}
  
    /** 登录接口：验证账号密码，生成 token，并更新为 active 状态 */
    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
      return this.authService.login(body.email, body.password)
    }
  
    /** 登出接口：更新为 inactive 状态 */
    @Post('logout/:id')
    async logout(@Param('id') id: number) {
      return this.authService.logout(id)
    }
  }
  