import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
  } from 'typeorm'
  import { Supplier } from './supplier.entity'
  import { RawMaterial } from './raw-material.entity'
  
  @Entity()
  export class SupplierMaterial {
    @PrimaryGeneratedColumn()
    id: number
  
    @ManyToOne(() => Supplier, supplier => supplier.supplierMaterials)
    supplier: Supplier
  
    @ManyToOne(() => RawMaterial, material => material.supplierMaterials)
    material: RawMaterial
  
    @Column()
    unitPrice: number
  }