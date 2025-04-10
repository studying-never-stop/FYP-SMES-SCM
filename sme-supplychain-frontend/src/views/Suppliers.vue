<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">🤝 Supplier Management</h2>

    <!-- 搜索 -->
    <div class="flex items-center gap-4 mb-4">
      <el-input v-model="searchKeyword" placeholder="Search by name" clearable />
    </div>

    <!-- 表格 -->
    <el-table :data="filteredSuppliers" border style="width: 100%">
      <el-table-column prop="companyName" label="Supplier Name" />
      <el-table-column prop="contact" label="Contact" />
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="phone" label="Phone" />
      <el-table-column prop="address" label="Address" />
      <el-table-column label="Actions" width="160">
        <template #default="scope">
          <el-button size="small" @click="viewSupplier(scope.row)">View</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹窗组件（始终挂载，避免销毁报错） -->
    <SupplierDetailDialog
      v-model:visible="dialogVisible"
      :supplier="selectedSupplier"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import SupplierDetailDialog from '@/views/dialogs/SupplierDetailDialog.vue'

interface Supplier {
  id: number
  companyName: string
  contact: string
  email: string
  phone: string
  address?: string
}

const suppliers = ref<Supplier[]>([
  {
    id: 1,
    companyName: 'Shanghai Tech Co.',
    contact: 'Liu Wei',
    email: 'liuwei@shtech.com',
    phone: '13800000000',
    address: 'No.88 Science Park, Shanghai'
  },
  {
    id: 2,
    companyName: 'Guangdong Supply Ltd.',
    contact: 'Zhao Min',
    email: 'zhaomin@gdsupply.com',
    phone: '13711112222',
    address: 'Industrial Ave, Guangzhou'
  }
])

const searchKeyword = ref('')
const selectedSupplier = ref<Supplier | null>(null)
const dialogVisible = ref(false)

const filteredSuppliers = computed(() => {
  return suppliers.value.filter(s =>
    s.companyName.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const viewSupplier = (supplier: Supplier) => {
  console.log('Selected supplier:', supplier)
  selectedSupplier.value = supplier
  dialogVisible.value = true
}
</script>
