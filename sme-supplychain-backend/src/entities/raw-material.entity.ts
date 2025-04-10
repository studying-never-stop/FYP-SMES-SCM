import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
  } from 'typeorm'
  import { SupplierMaterial } from './supplier-material.entity'
  import { PurchaseOrder } from './purchase-order.entity'
  
  @Entity()
  export class RawMaterial {
    @PrimaryGeneratedColumn()
    id: number
  
    @Column()
    name: string
  
    @Column()
    unit: string
  
    @Column()
    quantity: number // 当前库存数量
  
    @Column({ default: 50 })
    warningLevel: number
  
    @Column({ default: 20 })
    criticalLevel: number
  
    @CreateDateColumn()
    createdAt: Date
  
    @UpdateDateColumn()
    updatedAt: Date
  
    @OneToMany(() => SupplierMaterial, sm => sm.material)
    supplierMaterials: SupplierMaterial[]
  
    @OneToMany(() => PurchaseOrder, po => po.material)
    purchaseOrders: PurchaseOrder[]
  }