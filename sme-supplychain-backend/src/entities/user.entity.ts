export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  WAREHOUSE = 'warehouse',
  STAFF = 'staff',
  SUPERADMIN = 'superadmin',
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Company } from './company.entity'

// 用户表，包含所有系统登录用户（员工、管理员等）
@Entity('users')
export class User {
  // 主键，自增长，标识用户唯一身份
  @PrimaryGeneratedColumn()
  id: number

  // 用户名，用于登录或显示（可设置唯一性）
  @Column()
  username: string

  // 用户邮箱（可用于找回密码、发送通知等）
  @Column()
  email: string

  // 登录密码（应为加密后的哈希值）
  @Column()
  password: string

  // 所属公司 ID（关键字段，标识该用户属于哪家公司）
  @Column()
  companyId: number

  //
  @Column({ default: 'http://localhost:3000/upload/users/default_avatar.png' })
  avatarUrl: string


  // 多对一：每个用户属于一个公司
  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' }) // 指定连接字段
  company: Company

  // 角色字段：用于控制前端页面显示权限（如 admin / manager / warehouseman）
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STAFF,
  })
  role: UserRole


  // 是否启用/禁用该账号（用于状态控制）
  @Column({ default: true })
  isActive: boolean

  // 创建时间
  @CreateDateColumn()
  createdAt: Date

  // 更新时间
  @UpdateDateColumn()
  updatedAt: Date
}
