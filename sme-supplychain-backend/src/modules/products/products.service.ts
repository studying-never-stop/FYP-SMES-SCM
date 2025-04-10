import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Product } from '../../entities/product.entity'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  create(dto: CreateProductDto) {
    const product = this.repo.create(dto)
    return this.repo.save(product)
  }

  findAll() {
    return this.repo.find()
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id })
  }

  update(id: number, dto: UpdateProductDto) {
    return this.repo.update(id, dto)
  }

  remove(id: number) {
    return this.repo.delete(id)
  }
}