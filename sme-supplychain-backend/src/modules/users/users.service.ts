import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../../entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  // 根据邮箱查找用户（用于登录）
  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } })
  }

    // 获取全部用户
    async findAll(): Promise<User[]> {
      return this.repo.find({
        relations: ['company'],
      })
    }

  // 获取某公司所有用户（可支持分页/筛选）
  async findAllByCompany(companyId: number): Promise<User[]> {
    return this.repo.find({ where: { companyId } })
  }

  // 获取单个用户（并校验是否属于该公司）
  async findOneByCompany(id: number, companyId: number): Promise<User> {
    const user = await this.repo.findOne({ where: { id, companyId } })
    if (!user) {
      throw new NotFoundException('用户不存在或无权访问')
    }
    return user
  }

  // 创建用户（强制绑定公司 ID）
  async create(user: Partial<User>, companyId: number): Promise<User> {
    const defaultAvatar = 'http://localhost:3000/upload/users/default_avatar.png'
  
    const newUser = this.repo.create({
      ...user,
      companyId,
      avatarUrl: user.avatarUrl?.trim() || defaultAvatar,
    })
  
    return this.repo.save(newUser)
  }

  // 更新用户（仅限本公司）
  async update(id: number, user: Partial<User>, companyId: number): Promise<void> {
    const existing = await this.findOneByCompany(id, companyId)
    await this.repo.update(existing.id, user)
  }

  // 删除用户（仅限本公司）
  async remove(id: number, companyId: number): Promise<void> {
    const user = await this.findOneByCompany(id, companyId)
    await this.repo.delete(user.id)
  }

  //通过Id找用户
  findById(id: number) {
    return this.repo.findOne({ where: { id } })
  }
}
