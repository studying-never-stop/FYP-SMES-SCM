<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">🏢 Company Management</h2>
  
      <!-- 新建公司按钮 -->
      <div class="flex justify-end mb-4">
        <el-button type="primary" @click="openAddDialog">➕ Create Company</el-button>
      </div>
  
      <!-- 公司表格 -->
      <el-table :data="companies" border style="width: 100%">
        <el-table-column prop="name" label="Company Name" />
        <el-table-column prop="email" label="Email" />
        <el-table-column prop="phone" label="Phone" />
        <el-table-column prop="contact" label="Contact" />
        <el-table-column prop="address" label="Address" />
        <el-table-column label="Logo">
          <template #default="scope">
            <img
              :src="scope.row.logoUrl"
              alt="Logo"
              class="w-12 h-12 object-contain rounded border"
            />
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="180">
          <template #default="scope">
            <el-button size="small" @click="editCompany(scope.row)">Edit</el-button>
            <el-popconfirm title="Confirm delete?" @confirm="deleteCompany(scope.row.id)">
              <template #reference>
                <el-button size="small" type="danger">Delete</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 公司弹窗表单（复用） -->
      <CompanyFormDialog
        v-model:visible="dialogVisible"
        :editingCompany="editingCompany"
        @submit="handleSubmit"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import CompanyFormDialog from './dialogs/CompanyFormDialog.vue'
  
  interface Company {
    id?: number
    name: string
    email: string
    phone: string
    contact: string
    address: string
    logoUrl?: string
  }
  
  const companies = ref<Company[]>([])
  const dialogVisible = ref(false)
  const editingCompany = ref<Company | null>(null)
  
  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/api/companies/')
      companies.value = res.data
    } catch (err) {
      ElMessage.error('Failed to fetch company list')
    }
  }
  
  const openAddDialog = () => {
    editingCompany.value = null
    dialogVisible.value = true
  }
  
  const editCompany = (company: Company) => {
    editingCompany.value = { ...company }
    dialogVisible.value = true
  }
  
  const deleteCompany = async (id: number) => {
    try {
      await axios.delete(`/api/companies/${id}`)
      ElMessage.success('Company deleted')
      fetchCompanies()
    } catch (err) {
      ElMessage.error('Delete failed')
    }
  }
  
  const handleSubmit = async (company: Company) => {
  try {
    if (editingCompany.value?.id) {
      // 编辑模式
      await axios.put(`/api/companies/${editingCompany.value.id}`, company)
      ElMessage.success('Company updated')
    } else {
      // 创建模式
      await axios.post('/api/companies', company)
      ElMessage.success('Company created')
    }

    dialogVisible.value = false
    await fetchCompanies()
  } catch (err) {
    ElMessage.error('Failed to save company')
  }
}

  
  onMounted(fetchCompanies)
  </script>
  
  <style scoped>
  </style>
  