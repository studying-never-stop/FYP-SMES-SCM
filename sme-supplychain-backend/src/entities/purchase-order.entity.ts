import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm'
  import { Supplier } from './supplier.entity'
  import { RawMaterial } from './raw-material.entity'
  
  @Entity()
  export class PurchaseOrder {
    @PrimaryGeneratedColumn()
    id: number
  
    @ManyToOne(() => Supplier, supplier => supplier.purchaseOrders)
    supplier: Supplier
  
    @ManyToOne(() => RawMaterial, material => material.purchaseOrders)
    material: RawMaterial
  
    @Column()
    quantity: number
  
    @Column()
    unitPrice: number
  
    @Column()
    totalPrice: number
  
    @Column({ default: 'pending' }) // pending / completed
    status: string
  
    @CreateDateColumn()
    createdAt: Date
  }