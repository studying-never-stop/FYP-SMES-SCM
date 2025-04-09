import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

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

  @Column({ nullable: true })
  address: string
}