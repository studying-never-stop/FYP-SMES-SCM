<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">📄 Order Operation Records</h2>
  
      <!-- Filter Section -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <!-- Company Keyword Filter -->
        <div class="flex gap-2 items-center">
          <span class="font-medium">Company Name</span>
          <el-input
            v-model="companyKeyword"
            placeholder="Enter company name keyword"
            clearable
            style="width: 200px"
          />
        </div>
  
        <!-- View Mode Selector -->
        <div class="flex gap-2 items-center">
          <span class="font-medium">View Mode</span>
          <el-select v-model="recordViewMode" placeholder="View Mode" style="width: 160px">
            <el-option label="All Records" value="all" />
            <el-option label="As Buyer" value="buyer" />
            <el-option label="As Seller" value="seller" />
          </el-select>
        </div>
  
        <!-- Date Filter -->
        <div class="flex gap-2 items-center">
          <span class="font-medium">Order Date</span>
          <el-date-picker v-model="dateRange" type="daterange" start-placeholder="Start" end-placeholder="End" />
        </div>
      </div>
  
      <!-- Record Table -->
      <el-table :data="paginatedRecords" border>
        <el-table-column prop="_id" label="Order ID" width="200" />
        <el-table-column prop="status" label="Status" />
        <el-table-column prop="buyerCompany.name" label="Buyer Company" />
        <el-table-column prop="sellerCompany.name" label="Seller Company" />
        <el-table-column prop="paymentStatus" label="Payment Status" />
        <el-table-column prop="note" label="Note" />
        <el-table-column prop="createdAt" label="Created At" />
        <el-table-column label="Actions" width="180">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row._id)">View</el-button>
            <el-button size="small" type="info" @click="openRecordDialog(row._id)">Records</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- Pagination -->
      <div class="mt-4 text-right">
        <el-pagination
          layout="prev, pager, next"
          :total="records.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
          background
        />
      </div>
  
      <!-- OrderRecord Dialog -->
      <OrderRecordDialog v-model:visible="recordDialogVisible" :order-id="selectedOrderId" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import OrderRecordDialog from '@/views/dialogs/OrderRecordDialog.vue' // 请根据实际路径调整
  
  const router = useRouter()
  
  // 数据状态
  const records = ref<any[]>([])
  const companyKeyword = ref('')
  const dateRange = ref<any[]>([])
  const currentPage = ref(1)
  const pageSize = 6
  const recordViewMode = ref<'all' | 'buyer' | 'seller'>('all')
  const currentCompanyId = Number(localStorage.getItem('companyId')) || 0
  
  // 弹窗控制
  const recordDialogVisible = ref(false)
  const selectedOrderId = ref('')
  
  // 发送请求获取数据
  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post(
        '/api/orders/query-records',
        {
          role: recordViewMode.value,
          targetCompanyName: companyKeyword.value,
          startDate: dateRange.value?.[0],
          endDate: dateRange.value?.[1],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      records.value = res.data
    } catch (err) {
      ElMessage.error('Failed to fetch records')
    }
  }
  
  onMounted(fetchRecords)
  watch([companyKeyword, dateRange, recordViewMode], fetchRecords)
  
  // 分页
  const paginatedRecords = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return records.value.slice(start, end)
  })
  
  // 查看订单详情
  const viewDetail = (orderId: string) => {
    router.push(`/orders/${orderId}`)
  }
  
  // 打开记录弹窗
  const openRecordDialog = (orderId: string) => {
    selectedOrderId.value = orderId
    recordDialogVisible.value = true
  }
  </script>
  
  <style scoped></style>
  