import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { SupplierMaterial } from './supplier-material.entity'

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  companyName: string

  @Column()
  contact: string

  @Column()
  email: string

  @Column()
  phone: string

  @Column({ nullable: false }) 
  address: string

  @OneToMany(() => SupplierMaterial, sm => sm.supplier)
  supplierMaterials: SupplierMaterial[]
}
