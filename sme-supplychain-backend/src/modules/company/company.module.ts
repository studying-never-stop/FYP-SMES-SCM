import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Company } from '@/entities/company.entity'
import { CompanyService } from './company.service'
import { CompanyController } from './company.controller'
import { User } from '../../entities/user.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Company, User])], // 注册 Company 实体到当前模块
  providers: [CompanyService], // 注册服务
  controllers: [CompanyController], // 注册控制器
  exports: [CompanyService], // 其他模块可注入使用
})
export class CompanyModule {}
