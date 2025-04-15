import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
  } from 'typeorm'
  import { Product } from './product.entity'
  import { Company } from './company.entity'
  
  @Entity('inventories')
  export class Inventory {
    @PrimaryGeneratedColumn()
    id: number
  
    @Column({ default: 0 })
    quantity: number
  
    @Column({ nullable: true })
    location: string
  
    @Column({ default: 0 })
    minLevel: number
  
    @Column({ default: 1 })
    warnLevel: number
  
    @Column({ default: 9999 })
    maxLevel: number

    @Column({ type: 'enum', enum: ['product', 'raw'], default: 'product' })
    type: 'product' | 'raw'

    @Column({ default: true })
    isActive: boolean
  
    @Column()
    productId: number
  
    @Column()
    companyId: number
  
    @ManyToOne(() => Product, { eager: false })
    @JoinColumn({ name: 'productId' })
    product: Product
    
    @ManyToOne(() => Company, { eager: false })
    @JoinColumn({ name: 'companyId' })
    company: Company
  
    @CreateDateColumn()
    createdAt: Date
  
    @UpdateDateColumn()
    updatedAt: Date
  }