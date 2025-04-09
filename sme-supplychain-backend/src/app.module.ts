import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductsModule } from './modules/products/products.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'wsy021031',       
      database: 'supplychain',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,         // 开发阶段可以开启，生产建议关闭
    }),
    ProductsModule,              // 注册模块
  ],
})
export class AppModule {}
