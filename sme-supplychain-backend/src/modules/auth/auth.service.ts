// src/modules/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 登录验证逻辑
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid email or password')
    }
    return user
  }

  // 登录成功后签发 token 并更新状态
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password)

    // 更新为在线状态
    await this.usersService.update(user.id, { isActive: true })

    const payload = { sub: user.id, username: user.username, role: user.role }
    const token = this.jwtService.sign(payload)

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token,
    }
  }

  // 登出：将状态设置为 offline
  async logout(userId: number) {
    await this.usersService.update(userId, { isActive: false })
    return { message: 'User logged out' }
  }
}
