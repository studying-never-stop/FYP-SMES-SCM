import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  customerName: string

  @Column({ default: 'pending' })
  status: string

  @Column()
  createdBy: string

  @CreateDateColumn()
  createdAt: Date

  @Column({ nullable: true })
  deadline: Date

  @Column({ default: false })
  isUrgent: boolean
}