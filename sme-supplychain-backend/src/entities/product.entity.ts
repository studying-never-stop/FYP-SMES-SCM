import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne
} from 'typeorm'
import { Company } from './company.entity'

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column('text', { nullable: true })
  description: string

  @Column()
  category: string

  @Column({ default: 0 })
  price: number

  @Column({ default: 0 })
  unit: string // 单位，如件、箱、吨等

  @Column({ default: true })
  isInProvide: boolean

  @Column({ default: 'http://localhost:3000/upload/products/default.png' })
  imageUrl: string

  @Column()
  companyId: number

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}