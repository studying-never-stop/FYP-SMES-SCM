import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Inventory } from '../../entities/inventory.entity'
import { InventoryService } from './inventory.service'
import { InventoryController } from './inventory.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { InventoryRecord, InventoryRecordSchema } from '@/mongo/inventory-record.schema'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [TypeOrmModule.forFeature([Inventory]),
  MongooseModule.forFeature([
    { name: InventoryRecord.name, schema: InventoryRecordSchema }
  ]),
  UsersModule,
],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
