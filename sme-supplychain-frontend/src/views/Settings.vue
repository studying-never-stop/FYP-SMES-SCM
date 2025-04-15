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
            <el-table-column label="Avatar" width="100">
        <template #default="scope">
          <img
            :src="scope.row.avatarUrl || '/default-avatar.png'"
            alt="avatar"
            class="w-10 h-10 object-cover rounded-full border"
          />
        </template>
      </el-table-column>
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

     <!-- 公司信息管理区域 -->
     <el-card class="mt-8" shadow="always">
      <template #header>
        <div class="flex justify-between items-center">
          <span class="text-xl font-semibold">🏢 Company Management</span>
          <el-button v-if="!isEditingCompany" type="primary" @click="startEditCompany">Edit</el-button>
          <div v-else class="flex gap-2">
            <el-popconfirm title="Confirm update company info?" @confirm="saveCompanyInfo">
              <template #reference>
                <el-button type="success">Confirm</el-button>
              </template>
            </el-popconfirm>
            <el-button @click="cancelEditCompany">Cancel</el-button>
          </div>
        </div>
      </template>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <!-- 左侧：公司基础信息 -->
        <el-form :model="companyInfo" label-width="120px" label-position="left">
          <el-form-item label="Company Name">
            <el-input v-model="companyInfo.name" :disabled="!isEditingCompany" />
          </el-form-item>
          <el-form-item label="Contact Phone">
            <el-input v-model="companyInfo.phone" :disabled="!isEditingCompany" />
          </el-form-item>
          <el-form-item label="Email">
            <el-input v-model="companyInfo.email" :disabled="!isEditingCompany" />
          </el-form-item>
          <el-form-item label="Address">
            <el-input v-model="companyInfo.address" :disabled="!isEditingCompany" />
          </el-form-item>
          <el-form-item label="Contact">
            <el-input v-model="companyInfo.contact" :disabled="!isEditingCompany" />
          </el-form-item>
          <el-form-item label="Industry">
            <el-input v-model="companyInfo.industry" :disabled="!isEditingCompany" />
          </el-form-item>
        </el-form>

        <!-- 右侧：Logo 和描述 -->
        <div class="space-y-4">
          <div>
            <label class="block mb-2 font-medium text-gray-700">Company Logo</label>
            <div v-if="companyInfo.logoUrl" class="mb-2">
              <img :src="companyInfo.logoUrl" alt="Logo" class="w-48 h-48 object-contain border rounded shadow" />
            </div>
            <el-upload
              v-if="isEditingCompany"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :before-upload="beforeUpload"
              name="file"
            >
              <el-button type="primary">Upload New Logo</el-button>
            </el-upload>
          </div>

          <div>
            <label class="block mb-2 font-medium text-gray-700">Company Description</label>
            <el-input
              type="textarea"
              v-model="companyInfo.description"
              :disabled="!isEditingCompany"
              :autosize="{ minRows: 4, maxRows: 6 }"
            />
          </div>
        </div>
      </div>
    </el-card>

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
import { ElMessage } from 'element-plus'

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
    case 'superadmin': return 'danger'
    case 'admin': return 'warning'
    case 'manager': return 'success'
    case 'warehouse': return 'primary'
    case 'staff': return 'info'
    default: return 'default'
  }
}

onMounted(() => {
  fetchUsers()
})

/** 公司信息状态 */
const companyInfo = ref({
  name: '',
  address: '',
  phone: '',
  email: '',
  description: '',
  logoUrl: '',
  contact: '',
  industry: ''
})

const isEditingCompany = ref(false)

const uploadUrl = '/api/companies/upload-logo' // 上传路径

const handleUploadSuccess = (response: any) => {
  ElMessage.success('Logo uploaded successfully')
  companyInfo.value.logoUrl = response.url
}

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) ElMessage.error('Only image files are allowed')
  if (!isLt2M) ElMessage.error('Image size should be less than 2MB')

  return isImage && isLt2M
}

const fetchCompanyInfo = async () => {
  try {
    const userRaw = localStorage.getItem('user')
    const user = userRaw ? JSON.parse(userRaw) : null

    if (!user?.companyId) {
      ElMessage.error('No company information found.')
      return
    }

    const res = await axios.get(`/api/companies/${user.companyId}`)
    companyInfo.value = res.data
  } catch (err) {
    console.error('Error fetching company info:', err)
    ElMessage.error('Failed to fetch company info')
  }
}


const startEditCompany = () => {
  isEditingCompany.value = true
}

const cancelEditCompany = () => {
  isEditingCompany.value = false
  fetchCompanyInfo()
}

const saveCompanyInfo = async () => {
  try {
    await axios.put('/api/companies/me', companyInfo.value)
    isEditingCompany.value = false
    await fetchCompanyInfo()
    ElMessage.success('Company information updated successfully')
  } catch (err) {
    console.error('Failed to update company info:', err)
    ElMessage.error('Failed to update company info')
  }
}

onMounted(() => {
  fetchCompanyInfo()
})
</script>

<style scoped>
.el-pagination .is-disabled {
  cursor: default !important;
}
</style>
