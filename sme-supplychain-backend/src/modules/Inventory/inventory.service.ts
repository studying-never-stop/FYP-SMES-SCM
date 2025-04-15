import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { Inventory } from '../../entities/inventory.entity';
import { InventoryRecord, InventoryRecordDocument } from '../../mongo/inventory-record.schema';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,

    @InjectModel(InventoryRecord.name)
    private readonly recordModel: Model<InventoryRecordDocument>,

    private readonly usersService: UsersService
  ) {}

  // 获取公司所有库存（不区分类型）
  findAllByCompany(companyId: number): Promise<Inventory[]> {
    return this.inventoryRepo.find({
      where: { companyId },
      relations: ['product'],
    });
  }

  // 获取公司产品库存，支持模糊搜索和状态筛选
  async findProductsByCompany(companyId: number, search?: string, status?: string): Promise<Inventory[]> {
    const where: any = {
      companyId,
      type: 'product',
    };

    if (status === 'active') where.isActive = true;
    else if (status === 'inactive') where.isActive = false;

    if (search) {
      where.product = { name: ILike(`%${search}%`) };
    }

    return this.inventoryRepo.find({ where, relations: ['product'] });
  }

  // 获取公司原料库存，支持模糊搜索和状态筛选
  async findRawMaterialsByCompany(companyId: number, search?: string, status?: string): Promise<Inventory[]> {
    const where: any = {
      companyId,
      type: 'raw',
    };

    if (status === 'active') where.isActive = true;
    else if (status === 'inactive') where.isActive = false;

    if (search) {
      where.product = { name: ILike(`%${search}%`) };
    }

    return this.inventoryRepo.find({ where, relations: ['product'] });
  }

  // 获取单条库存信息
  findOne(id: number, companyId: number): Promise<Inventory | null> {
    return this.inventoryRepo.findOne({ where: { id, companyId }, relations: ['product'] });
  }

  // 更新库存信息
  update(id: number, data: Partial<Inventory>, companyId: number) {
    return this.inventoryRepo.update({ id, companyId }, data);
  }

  // 删除库存记录
  remove(id: number, companyId: number) {
    return this.inventoryRepo.delete({ id, companyId });
  }

  // 增加库存数量并记录入库
  async increaseQuantity(productId: number, companyId: number, amount: number, orderId?: string, operatorId?: number, note?: string) {
    const inventory = await this.inventoryRepo.findOne({ where: { productId, companyId } });
    if (!inventory) throw new NotFoundException('Inventory record does not exist');

    inventory.quantity += amount;
    
    await this.inventoryRepo.save(inventory);

    await this.recordModel.create({
      productId,
      companyId,
      quantity: amount,
      type: 'in',
      orderId,
      operatorId,
      note,
    });

    return inventory;
  }

  // 减少库存数量并记录出库
  async decreaseQuantity(productId: number, companyId: number, amount: number, orderId?: string, operatorId?: number, note?: string) {
    const inventory = await this.inventoryRepo.findOne({ where: { productId, companyId } });
    if (!inventory) throw new NotFoundException('Inventory record does not exist');

    inventory.quantity -= amount;
    if (inventory.quantity < 0) inventory.quantity = 0;
    await this.inventoryRepo.save(inventory);

    await this.recordModel.create({
      productId,
      companyId,
      quantity: amount,
      type: 'out',
      orderId,
      operatorId,
      note,
    });

    return inventory;
  }

  // 判断公司是否存在该产品库存（用于自动入库判断）
  async hasInventory(productId: number, companyId: number): Promise<boolean> {
    const inventory = await this.inventoryRepo.findOne({ where: { productId, companyId } });
    return !!inventory;
  }

  // 检查库存是否足够（用于发货校验）
  async checkStockEnough(productId: number, companyId: number, requiredAmount: number): Promise<boolean> {
    const inventory = await this.inventoryRepo.findOne({ where: { productId, companyId } });
    return inventory ? inventory.quantity >= requiredAmount : false;
  }

  // 查询某公司全部出入库记录（带产品名 + 操作人名）
async getCompanyRecords(companyId: number) {
    // 从 MongoDB 拿到原始记录（没有 productName / operatorName）
    const records = await this.recordModel.find({ companyId }).sort({ createdAt: -1 }).lean()
  
    // productId => productName 的缓存映射
    const productMap = new Map<number, string>()
  
    // operatorId => operatorName 的缓存映射
    const operatorMap = new Map<number, string>()
  
    for (const record of records) {
      // 补充 productName
      if (!productMap.has(record.productId)) {
        const inventory = await this.inventoryRepo.findOne({
          where: { productId: record.productId, companyId },
          relations: ['product'],
        })
        const name = inventory?.product?.name || 'Unnamed'
        productMap.set(record.productId, name)
      }
  
      // 补充 operatorName
      if (record.operatorId && !operatorMap.has(record.operatorId)) {
        // 你可能有一个 User 实体或 service，示例假设有 userService.findNameById()
        const user = await this.usersService.findById(record.operatorId)  // 你需要提供这个方法
        const name = user?.username || 'Unknown'
        operatorMap.set(record.operatorId, name)
      }
  
      // 写入字段到记录中
      (record as any).productName = productMap.get(record.productId) || 'Unnamed',
      (record as any).operatorName = record.operatorId ? operatorMap.get(record.operatorId) : 'System'
    }
  
    return records
  }
  
}