import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './modules/products/products.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { CompanyModule } from './modules/company/company.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { ConfigModule } from '@nestjs/config'
import { InventoryModule } from './modules/Inventory/inventory.module'
import { CategoryOverviewModule } from './modules/category-overview/category-overview.module'
import { OrderModule } from './modules/order/order.module';
import { OrderRecordModule } from './modules/order-record/order-record.module';
import { SupplierModule } from './modules/supplier/supplier.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,       
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,         // 开发阶段可以开启，生产建议关闭
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/supplychain'),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'), // 你存 logo 的文件夹
      serveRoot: '/upload', // 路径前缀：http://localhost/upload/xxx.png
    }),
    ProductsModule,
    UsersModule,              // 注册模块
    AuthModule,
    CompanyModule,
    InventoryModule,
    CategoryOverviewModule,
    OrderModule,
    OrderRecordModule,
    SupplierModule,
  ],
})

export class AppModule {}
