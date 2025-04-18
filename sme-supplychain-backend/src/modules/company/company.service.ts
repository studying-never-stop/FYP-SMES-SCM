import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, In, Repository } from 'typeorm'
import { Company } from '@/entities/company.entity'
import { User, UserRole } from '@/entities/user.entity'


@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ) {}

  //  创建公司信息
  async create(data: Partial<Company>): Promise<Company> {
    const defaultLogo = 'http://localhost:3000/upload/companies/logo_example.png'
    const logo = data.logoUrl?.trim()
    const company = this.companyRepo.create({
    ...data,
    logoUrl: logo || defaultLogo, 
  })// 实例化实体
    const newCompany = await this.companyRepo.save(company)
  const cleanName = data.name?.toLowerCase().replace(/\s+/g, '') || 'company'
  const adminEmail = `admin@${cleanName}.com`
  const existing = await this.userRepo.findOne({ where: { email: adminEmail } })
  if (existing) {
    throw new BadRequestException(`Admin email already exists: ${adminEmail}`)
  }
  const adminUser = this.userRepo.create({
      username: 'admin',
      email: adminEmail,
      password: 'admin',
      role: UserRole.ADMIN,
      companyId: newCompany.id,
      isActive: true,
      avatarUrl: 'http://localhost:3000/upload/users/default_avatar.png', // 默认头像
    })

    await this.userRepo.save(adminUser)
    return newCompany // 保存入数据库
  }

  //  获取所有公司（可限制为超级管理员调用）
  async findAll(): Promise<Company[]> {
    return this.companyRepo.find()
  }

  //  根据 ID 获取公司详情
  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepo.findOne({ where: { id }, relations: ['products'], },)
    if (!company) throw new NotFoundException('Company not exist')
    return company
  }

  //  更新公司信息（支持局部更新）
  async update(id: number, data: Partial<Company>): Promise<Company> {
    await this.findOne(id) // 验证是否存在
    // 移除不能直接 update 的关系字段
  const { products, ...safeData } = data;
    await this.companyRepo.update(id, safeData) // 执行更新操作
    return this.findOne(id) // 返回最新数据
  }

  //  删除公司（可扩展为软删除）
  async remove(id: number): Promise<void> {
    await this.findOne(id)
    await this.companyRepo.delete(id)
  }

  // 根据产业类别获取公司列表
    async findByIndustry(industry: string): Promise<Company[]> {
        return this.companyRepo.find({ where: { industry } })
    }

  // 查询公司名称
    async findByNameKeyword(keyword: string): Promise<Company[]> {
      return this.companyRepo.find({
        where: { name: ILike(`%${keyword}%`) },
        take: 10,
      })
    }
    //通过Id查公司信息
    async findByIds(ids: number[]): Promise<Company[]> {
      return this.companyRepo.find({
        where: { id: In(ids) }
      });
    }
}
