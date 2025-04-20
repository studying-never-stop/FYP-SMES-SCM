import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MongooseModule } from '@nestjs/mongoose'
import { Inventory } from '@/entities/inventory.entity'
import { InventoryRecord, InventoryRecordSchema } from '@/mongo/inventory-record.schema'
import { InventoryDataService } from './inventorydata.service'
import { InventoryDataController } from './inventorydata.controller'

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory]),
    MongooseModule.forFeature([{ name: InventoryRecord.name, schema: InventoryRecordSchema }])
  ],
  providers: [InventoryDataService],
  controllers: [InventoryDataController],
  exports: [InventoryDataService],
})
export class InventoryDataModule {}
