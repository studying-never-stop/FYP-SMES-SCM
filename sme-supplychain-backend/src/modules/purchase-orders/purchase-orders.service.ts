import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PurchaseOrder } from '@/entities/purchase-order.entity'
import { RawMaterial } from '@/entities/raw-material.entity'
import { Supplier } from '@/entities/supplier.entity'

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private orderRepo: Repository<PurchaseOrder>,
    @InjectRepository(Supplier)
    private supplierRepo: Repository<Supplier>,
    @InjectRepository(RawMaterial)
    private materialRepo: Repository<RawMaterial>
  ) {}

  findAll() {
    return this.orderRepo.find({
      relations: ['supplier', 'material'],
      order: { createdAt: 'DESC' },
    })
  }

  findOne(id: number) {
    return this.orderRepo.findOne({
      where: { id },
      relations: ['supplier', 'material'],
    })
  }

  async create(data: {
    supplierId: number
    materialId: number
    quantity: number
    unitPrice: number
  }) {
    const { supplierId, materialId, quantity, unitPrice } = data
  
    // 查找关联实体
    const supplier = await this.supplierRepo.findOne({ where: { id: supplierId } })
    const material = await this.materialRepo.findOne({ where: { id: materialId } })
  
    // 校验实体是否存在
    if (!supplier || !material) {
      throw new Error('Invalid supplier or material')
    }
  
    // 创建订单对象（create 支持关联实体）
    const order = this.orderRepo.create({
      supplier: supplier,
      material: material,
      quantity,
      unitPrice,
      totalPrice: quantity * unitPrice,
      status: 'pending',
    })
  
    return this.orderRepo.save(order)
  }
  
  remove(id: number) {
    return this.orderRepo.delete(id)
  }

  // 可扩展：确认收货、变更状态等
}