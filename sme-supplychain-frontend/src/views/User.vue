<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">👤 User Management</h2>
  
      <!-- 搜索栏 -->
      <div class="flex justify-between items-center mb-4 gap-4">
        <el-input
          v-model="searchKeyword"
          placeholder="Search by username or email"
          clearable
          style="width: 300px"
        />
      </div>
  
      <!-- 用户表格 -->
      <el-table :data="filteredUsers" border style="width: 100%">
        <el-table-column prop="username" label="Username" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="role" label="Role">
          <template #default="scope">
            <el-tag :type="roleTagType(scope.row.role)">{{ scope.row.role }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="company.name" label="Company" />
        <el-table-column prop="isActive" label="Status">
          <template #default="scope">
            <el-tag :type="scope.row.isActive ? 'success' : 'info'">
              {{ scope.row.isActive ? 'active' : 'inactive' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200">
          <template #default="scope">
            <el-button size="small" @click="editUser(scope.row)">Edit</el-button>
            <el-popconfirm title="Confirm delete?" @confirm="deleteUser(scope.row.id)">
              <template #reference>
                <el-button size="small" type="danger">Delete</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
  
      <UserFormDialog
        v-model:visible="dialogVisible"
        :editingUser="editingUser"
        @submit="handleSubmit"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import UserFormDialog from '@/views/dialogs/UserFormDialog.vue'
  
  interface User {
    id?: number
    username: string
    email: string
    role: string
    company?: { name: string }
    isActive: boolean
    avatarUrl?: string
  }
  
  const users = ref<User[]>([])
  const searchKeyword = ref('')
  const dialogVisible = ref(false)
  const editingUser = ref<User | null>(null)
  
  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users/all')
      users.value = res.data
    } catch (err) {
      ElMessage.error('Failed to fetch user list')
    }
  }
  
  const filteredUsers = computed(() => {
    const keyword = searchKeyword.value.toLowerCase()
    return users.value.filter(user =>
      user.username.toLowerCase().includes(keyword) ||
      user.email.toLowerCase().includes(keyword)
    )
  })
  
  const editUser = (user: User) => {
    editingUser.value = { ...user }
    dialogVisible.value = true
  }
  
  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`/api/users/${id}`)
      ElMessage.success('User deleted')
      fetchUsers()
    } catch (err) {
      ElMessage.error('Delete failed')
    }
  }
  
  const handleSubmit = async () => {
    dialogVisible.value = false
    fetchUsers()
  }
  
  const roleTagType = (role: string) => {
    switch (role) {
      case 'superadmin': return 'danger'
      case 'admin': return 'warning'
      case 'manager': return 'success'
      case 'warehouse': return 'primary'
      case 'staff': return 'info'
      default: return 'default'
    }
  }
  
  onMounted(fetchUsers)
  </script>
  
  <style scoped>
  </style>
  