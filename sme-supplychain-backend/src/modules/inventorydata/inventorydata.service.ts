import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { LessThan, Repository } from 'typeorm'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Inventory } from '@/entities/inventory.entity'
import { InventoryRecord, InventoryRecordDocument } from '@/mongo/inventory-record.schema'

@Injectable()
export class InventoryDataService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,

    @InjectModel(InventoryRecord.name)
    private readonly recordModel: Model<InventoryRecordDocument>
  ) {}

  /** 获取库存卡片汇总数据 */
  async getInventorySummary(companyId: number) {
    const [totalStock, warningCount] = await Promise.all([
      this.inventoryRepo.createQueryBuilder('inv')
        .select('SUM(inv.quantity)', 'total')
        .where('inv.companyId = :companyId', { companyId })
        .getRawOne(),

      this.inventoryRepo.count({
        where: {
          companyId,
          quantity: 0 // 可改成 < warnLevel 实现动态预警
        }
      })
    ])

    const [inResult, outResult] = await Promise.all([
      this.recordModel.aggregate([
        { $match: { companyId, type: 'in' } },
        { $group: { _id: null, total: { $sum: '$quantity' } } }
      ]),
      this.recordModel.aggregate([
        { $match: { companyId, type: 'out' } },
        { $group: { _id: null, total: { $sum: '$quantity' } } }
      ])
    ])

    return {
      totalStock: +totalStock.total || 0,
      totalIn: inResult[0]?.total || 0,
      totalOut: outResult[0]?.total || 0,
      warningCount
    }
  }

  /** 获取库存结构（按产品分类） */
  async getStructureByCategory(companyId: number) {
    const raw = await this.inventoryRepo.createQueryBuilder('inv')
      .leftJoin('inv.product', 'product')
      .select('product.category', 'name')
      .addSelect('SUM(inv.quantity)', 'value')
      .where('inv.companyId = :companyId', { companyId })
      .groupBy('product.category')
      .getRawMany()

    return raw.map(r => ({ name: r.name, value: +r.value }))
  }

  /** 出入库趋势 */
  async getFlowTrend(companyId: number) {
    const raw = await this.recordModel.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            type: '$type'
          },
          total: { $sum: '$quantity' }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          in: {
            $sum: { $cond: [{ $eq: ['$_id.type', 'in'] }, '$total', 0] }
          },
          out: {
            $sum: { $cond: [{ $eq: ['$_id.type', 'out'] }, '$total', 0] }
          }
        }
      },
      {
        $project: {
          date: '$_id', in: 1, out: 1, _id: 0
        }
      },
      { $sort: { date: 1 } }
    ])

    return raw
  }

  /** 库存预警产品 */
  async getWarningProducts(companyId: number) {
    return this.inventoryRepo.createQueryBuilder('inv')
      .leftJoinAndSelect('inv.product', 'product')
      .where('inv.companyId = :companyId', { companyId })
      .andWhere('inv.quantity < inv.warnLevel')
      .getMany()
  }
}
