import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [
    UsersModule, // 依赖用户模块
    JwtModule.register({
      secret: 'your_jwt_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],      // ✅ 确保 AuthService 被声明为 provider
})
export class AuthModule {}
