<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">📦 Pending Orders</h2>

    <!-- 状态筛选器 -->
    <el-select v-model="statusFilter" placeholder="Filter by status" clearable class="mb-4">
      <el-option label="All" value="all" />
      <el-option label="Created" value="created" />
      <el-option label="Processing" value="processing" />
      <el-option label="Packing" value="packing" />
      <el-option label="Shipped" value="shipped" />
    </el-select>

    <!-- 订单列表 -->
    <div v-if="paginatedOrders.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <OrderCard
        v-for="order in paginatedOrders"
        :key="order._id"
        :order="order"
        :currentUserRole="'seller'"
        @updated="fetchOrders"
      />
    </div>

    <!-- 空状态 -->
    <el-empty v-else description="No pending orders found" />

    <!-- 分页器 -->
    <div class="mt-6 text-center" v-if="filteredOrders.length > pageSize">
      <el-pagination
        layout="prev, pager, next"
        :total="filteredOrders.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        background
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import OrderCard from '@/components/OrderCard.vue'

const orders = ref<any[]>([])           // 全部订单
const statusFilter = ref('all')         // 当前选中的状态筛选器
const currentPage = ref(1)              // 当前页码
const pageSize = 6                      // 每页显示数量
const userRaw: any = localStorage.getItem('user')// 获取本地存储的公司 ID
const user = userRaw ? JSON.parse(userRaw) : null // 解析为对象
const currentCompanyId = user?.companyId


// 获取订单数据
const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token')
    const baseUrl = '/api/orders'
    const url = statusFilter.value === 'all'
      ? baseUrl
      : `${baseUrl}/status/${statusFilter.value}`

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
    orders.value = res.data
    currentPage.value = 1
  } catch (err) {
    console.error('Failed to fetch orders:', err)
  }
}

// 筛选结果（不包含 completed 和 cancelled）
const filteredOrders = computed(() => {
  const allowedStatuses = ['created', 'processing', 'packing', 'shipped']
  if (statusFilter.value === 'all') {
    return orders.value.filter(order => allowedStatuses.includes(order.status) && order.sellerCompanyId === currentCompanyId )
  }
  return orders.value.filter(order => order.status === statusFilter.value && order.sellerCompanyId === currentCompanyId )
})

// 当前页的订单
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredOrders.value.slice(start, start + pageSize)
})

onMounted(fetchOrders)
watch(statusFilter, fetchOrders)
</script>

<style scoped></style>
