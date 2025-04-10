import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductsModule } from './modules/products/products.module'
import { UsersModule } from './modules/users/users.module'
import { AuthModule } from './modules/auth/auth.module'
import { SuppliersModule } from './modules/suppliers/suppliers.moudule'
import { RawMaterialsModule } from './modules/raw-materials/raw-materials.module'
import { SupplierMaterialsModule } from './modules/supplier-materials/supplier-materials.module'
import { PurchaseOrdersModule } from './modules/purchase-orders/purchase-orders.module'

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
    ProductsModule,
    UsersModule,              // 注册模块
    AuthModule,
    SuppliersModule,
    RawMaterialsModule,
    SupplierMaterialsModule,
    PurchaseOrdersModule,
  ],
})
export class AppModule {}
