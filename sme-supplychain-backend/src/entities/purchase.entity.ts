import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Purchase {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  supplierId: number

  @Column()
  productId: number

  @Column()
  quantity: number

  @Column('decimal', { precision: 10, scale: 2 })
  price: number

  @Column()
  purchaseDate: Date
}