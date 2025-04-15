import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm'
import { Product } from './product.entity'

//  用于定义一个 "companies" 数据表（租户表）
@Entity('companies')
export class Company {
  // 主键，自增长，代表每个公司唯一的编号
  @PrimaryGeneratedColumn()
  id: number

  // 公司名称，例如“XXX制造有限公司”
  @Column()
  name: string

  // 公司邮箱，主要用于系统通知、管理员通信
  @Column()
  email: string

  // 公司联系电话，用于联系信息展示
  @Column()
  phone: string

  // 公司注册地址，或办公地点
  @Column()
  address: string

  // 公司 logo 图片的 URL 路径（前端用 <img> 显示）
  @Column({ default: 'http://localhost:3000/upload/companies/logo_example.png' })
  logoUrl: string

  // 公司简介或介绍，支持多行文字（可选）
  @Column({ type: 'text', nullable: true })
  description: string

  // 行业类型（可选），比如“汽车”、“物流”、“零售”等
  @Column({ nullable: true })
  industry: string

  //公司联系人
  @Column()
  contact:string

  @OneToMany(() => Product, product => product.company)
  products: Product[]

  // 公司创建时间（自动生成）
  @CreateDateColumn()
  createdAt: Date

  // 公司信息最后更新时间（自动更新）
  @UpdateDateColumn()
  updatedAt: Date
}
