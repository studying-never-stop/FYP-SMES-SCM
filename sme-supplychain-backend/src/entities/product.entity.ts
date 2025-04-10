import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  category: string

  @Column()
  quantity: number

  @Column({ default: true })
  isActive: boolean
}