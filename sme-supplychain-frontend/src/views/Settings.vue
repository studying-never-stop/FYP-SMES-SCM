<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">⚙️ User Management</h2>
  
      <!-- 新增用户按钮 -->
      <div class="flex justify-end mb-4">
        <el-button type="primary" @click="openAddDialog">➕ Add User</el-button>
      </div>
  
      <!-- 用户列表表格 -->
      <el-table :data="users" border style="width: 100%">
        <el-table-column prop="username" label="Username" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="role" label="Role">
          <template #default="scope">
            <el-tag :type="roleTagType(scope.row.role)">
              {{ scope.row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200">
          <template #default="scope">
            <el-button size="small" @click="editUser(scope.row)">Edit</el-button>
            <el-popconfirm title="Confirm delete?" @confirm="deleteUser(scope.row)">
              <template #reference>
                <el-button size="small" type="danger">Delete</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 添加/编辑弹窗 -->
      <UserFormDialog
        v-model:visible="dialogVisible"
        :editing-user="editingUser"
        @submit="handleSubmit"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import UserFormDialog from '@/views/dialogs/UserFormDialog.vue'
  
  interface User {
    username: string
    email: string
    role: string
    status: 'active' | 'inactive'
  }
  
  const users = ref<User[]>([
    { username: 'admin', email: 'admin@example.com', role: 'admin', status: 'active' },
    { username: 'manager1', email: 'manager@example.com', role: 'manager', status: 'active' },
    { username: 'warehouse1', email: 'wh@example.com', role: 'warehouseman', status: 'active' },
    { username: 'staff1', email: 'staff@example.com', role: 'staff', status: 'inactive' }
  ])
  
  const dialogVisible = ref(false)
  const editingUser = ref<User | null>(null)
  
  // 打开新增弹窗
  const openAddDialog = () => {
    editingUser.value = null
    dialogVisible.value = true
  }
  
  // 编辑用户
  const editUser = (user: User) => {
    editingUser.value = { ...user }
    dialogVisible.value = true
  }
  
  // 删除用户
  const deleteUser = (user: User) => {
    users.value = users.value.filter(u => u !== user)
  }
  
  // 新增或更新用户
  const handleSubmit = (newUser: User) => {
    const index = users.value.findIndex(u => u.username === newUser.username)
    if (index !== -1) {
      users.value[index] = newUser
    } else {
      users.value.push(newUser)
    }
  }
  
  // 根据角色设置 tag 样式
  const roleTagType = (role: string) => {
    switch (role) {
      case 'admin': return 'danger'
      case 'manager': return 'warning'
      case 'warehouseman': return 'info'
      case 'staff': return 'success'
      default: return 'default'
    }
  }
  </script>
  