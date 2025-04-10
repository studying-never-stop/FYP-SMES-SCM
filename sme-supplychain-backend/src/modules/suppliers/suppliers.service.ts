import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Supplier } from '@/entities/supplier.entity'
import { SupplierMaterial } from '@/entities/supplier-material.entity'

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepo: Repository<Supplier>,
    @InjectRepository(SupplierMaterial)
    private supplierMaterialRepo: Repository<SupplierMaterial>
  ) {}

  findAll() {
    return this.supplierRepo.find()
  }

  findOne(id: number) {
    return this.supplierRepo.findOne({ where: { id } })
  }

  create(data: Partial<Supplier>) {
    const newSupplier = this.supplierRepo.create(data)
    return this.supplierRepo.save(newSupplier)
  }

  update(id: number, data: Partial<Supplier>) {
    return this.supplierRepo.update(id, data)
  }

  remove(id: number) {
    return this.supplierRepo.delete(id)
  }

  //  获取该供应商提供的所有原材料
  findMaterialsBySupplier(supplierId: number) {
    return this.supplierMaterialRepo.find({
      where: { supplier: { id: supplierId } },
      relations: ['material'],
    })
  }
}