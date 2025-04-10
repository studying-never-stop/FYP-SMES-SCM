import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { SupplierMaterial } from '@/entities/supplier-material.entity'

@Injectable()
export class SupplierMaterialsService {
  constructor(
    @InjectRepository(SupplierMaterial)
    private readonly repo: Repository<SupplierMaterial>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['supplier', 'material'] })
  }

  findBySupplier(supplierId: number) {
    return this.repo.find({
      where: { supplier: { id: supplierId } },
      relations: ['material'],
    })
  }

  create(data: {
    supplierId: number
    materialId: number
    unitPrice: number
  }) {
    return this.repo.save({
      supplier: { id: data.supplierId },
      material: { id: data.materialId },
      unitPrice: data.unitPrice,
    })
  }

  update(id: number, unitPrice: number) {
    return this.repo.update(id, { unitPrice })
  }

  remove(id: number) {
    return this.repo.delete(id)
  }
}