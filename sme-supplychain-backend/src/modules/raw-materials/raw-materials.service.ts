import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RawMaterial } from '@/entities/raw-material.entity'

@Injectable()
export class RawMaterialsService {
  constructor(
    @InjectRepository(RawMaterial)
    private readonly rawRepo: Repository<RawMaterial>,
  ) {}

  findAll() {
    return this.rawRepo.find()
  }

  findOne(id: number) {
    return this.rawRepo.findOne({ where: { id } })
  }

  create(data: Partial<RawMaterial>) {
    const newMaterial = this.rawRepo.create(data)
    return this.rawRepo.save(newMaterial)
  }

  update(id: number, data: Partial<RawMaterial>) {
    return this.rawRepo.update(id, data)
  }

  remove(id: number) {
    return this.rawRepo.delete(id)
  }
}