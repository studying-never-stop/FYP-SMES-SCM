<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">⚙️ User Management</h2>

    <!-- 搜索与筛选栏 -->
    <div class="flex items-center justify-between mb-4 gap-4">
      <el-input
        v-model="searchKeyword"
        placeholder="Search by username"
        clearable
        style="width: 250px"
      />
      <el-select v-model="selectedRole" placeholder="Filter by role" clearable style="width: 200px">
        <el-option label="All Roles" value="" />
        <el-option label="Admin" value="admin" />
        <el-option label="Manager" value="manager" />
        <el-option label="Warehouseman" value="warehouseman" />
        <el-option label="Staff" value="staff" />
      </el-select>

      <!-- 添加用户按钮 -->
      <el-button type="primary" @click="openAddDialog">➕ Add User</el-button>
    </div>

    <!-- 用户表格 -->
    <el-table :data="paginatedUsers" border style="width: 100%">
      <el-table-column prop="username" label="Username" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="role" label="Role">
        <template #default="scope">
          <el-tag :type="roleTagType(scope.row.role)">
            {{ scope.row.role }}
          </el-tag>
        </template>
      </el-table-column>
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
          <el-popconfirm title="Confirm delete?" @confirm="deleteUser(scope.row)">
            <template #reference>
              <el-button size="small" type="danger">Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="filteredUsers.length"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handlePageChange"
      class="mt-4 text-right"
    />

    <!-- 用户新增/编辑弹窗 -->
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
import UserFormDialog from '@/views/dialogs/UserFormDialog.vue'

/** 用户数据类型（需包含 id） */
interface User {
  id?: number
  username: string
  email: string
  password?: string
  role: string
  isActive: boolean
}

/** 所有用户列表（从后端获取） */
const users = ref<User[]>([])

/** 搜索关键字 + 筛选角色 */
const searchKeyword = ref('')
const selectedRole = ref('')

/** 当前分页控制 */
const currentPage = ref(1)
const pageSize = 10

/** 当前编辑用户 & 弹窗显示控制 */
const editingUser = ref<User | null>(null)
const dialogVisible = ref(false)

/** 从后端加载用户列表 */
const fetchUsers = async () => {
  const res = await axios.get('/api/users')
  users.value = res.data
  currentPage.value = 1
}

/** 提交表单（新增或编辑） */
const handleSubmit = async (user: User) => {
  try {
    if (user.id) {
      await axios.put(`/api/users/${user.id}`, user)
    } else {
      await axios.post('/api/users', user)
    }
    await fetchUsers()
  } catch (err) {
    console.error('Error saving user:', err)
  }
}

/** 删除用户 */
const deleteUser = async (user: User) => {
  try {
    await axios.delete(`/api/users/${user.id}`)
    await fetchUsers()
  } catch (err) {
    console.error('Error deleting user:', err)
  }
}

/** 打开新增用户弹窗 */
const openAddDialog = () => {
  editingUser.value = null
  dialogVisible.value = true
}

/** 打开编辑用户弹窗 */
const editUser = (user: User) => {
  editingUser.value = { ...user }
  dialogVisible.value = true
}

/** 按用户名 & 角色筛选用户 */
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesKeyword = user.username.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesRole = selectedRole.value ? user.role === selectedRole.value : true
    return matchesKeyword && matchesRole
  })
})

/** 当前分页结果 */
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

/** 页码跳转 */
const handlePageChange = (page: number) => {
  currentPage.value = page
}

/** 设置角色标签样式 */
const roleTagType = (role: string) => {
  switch (role) {
    case 'admin': return 'danger'
    case 'manager': return 'warning'
    case 'warehouseman': return 'primary'
    case 'staff': return 'success'
    default: return 'default'
  }
}

// 页面加载完成自动拉取用户数据
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
/* 优化分页禁用态鼠标样式 */
.el-pagination .is-disabled {
  cursor: default !important;
}
</style>
