import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } })
  }

  findAll() {
    return this.repo.find()
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id })
  }

  create(user: Partial<User>) {
    const newUser = this.repo.create(user)
    return this.repo.save(newUser)
  }

  update(id: number, user: Partial<User>) {
    return this.repo.update(id, user)
  }

  remove(id: number) {
    return this.repo.delete(id)
  }
}
