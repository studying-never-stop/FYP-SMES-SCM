export interface User {
    id?: number
    username: string
    email: string
    password?: string
    role: 'admin' | 'manager' | 'warehouseman' | 'staff'
    avatarUrl?: string
    isActive?: boolean
    createdAt?: string
    updatedAt?: string
  }