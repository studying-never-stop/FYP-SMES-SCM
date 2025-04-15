import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { JwtService } from '@nestjs/jwt'
import { User } from '../../entities/user.entity'
import * as bcrypt from 'bcrypt' //  加密库（比对加密密码）

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   *  验证用户凭据（email + password）
   * - 使用 bcrypt 安全地对比密码
   */
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email)

    // 1. 用户是否存在
    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    // 2. 密码比对（使用 bcrypt 解密验证）
    const passwordValid = await bcrypt.compare(password, user.password) || password == user.password
    if (!passwordValid) {
      throw new UnauthorizedException('密码错误')
    } 
    return user
  }

  /**
   *  登录逻辑
   * - 验证身份 → 设置为在线 → 生成 JWT → 返回用户信息和 token
   */
  async login(email: string, password: string) {
    const user = await this.validateUser(email, password)

    // 登录后更新用户为“在线”状态
    await this.usersService.update(user.id, { isActive: true }, user.companyId)

    // 构造 JWT payload
    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      companyId: user.companyId,
    }

    // 签发 JWT，配置过期时间使用 `.env`
    const token = this.jwtService.sign(payload)

    // 返回 token + 基本用户信息（供前端使用）
    return {
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        companyId: user.companyId,
      },
      token,
    }
  }

  /**
   *  登出逻辑（设置 isActive 为 false）
   */
  async logout(userId: number, companyId: number) {
    const user = await this.usersService.findOneByCompany(userId, companyId)
    if (!user) {
      throw new UnauthorizedException('用户不存在')
    }

    await this.usersService.update(userId, { isActive: false }, user.companyId)

    return { message: 'User logged out successfully' }
  }
}
