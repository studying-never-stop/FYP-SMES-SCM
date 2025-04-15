<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">🧾 My Orders</h2>
  
      <!-- 状态筛选器 -->
      <el-select v-model="statusFilter" placeholder="Filter by status" clearable class="mb-4">
        <el-option label="All" value="all" />
        <el-option label="Created" value="created" />
        <el-option label="Processing" value="processing" />
        <el-option label="Packing" value="packing" />
        <el-option label="Shipped" value="shipped" />
        <el-option label="Completed" value="completed" />
        <el-option label="Cancelled" value="cancelled" />
      </el-select>
  
      <!-- 我的订单列表（带分页） -->
      <div v-if="paginatedOrders.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <OrderCard
          v-for="order in paginatedOrders"
          :key="order._id"
          :order="order"
          :currentUserRole="'buyer'"
          @updated="fetchOrders"
        />
      </div>
  
      <!-- 无数据提示 -->
      <el-empty v-else description="No orders found" />
  
      <!-- 分页器：当过滤后订单数量超过每页限制才显示 -->
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
  
  // 全部订单数据
  const orders = ref<any[]>([])
  // 当前筛选的状态值
  const statusFilter = ref('all')
  // 当前分页页码与每页数量
  const currentPage = ref(1)
  const pageSize = 6
  
  // 获取当前登录公司作为买家的所有订单
  const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/orders/my', {
      headers: { Authorization: `Bearer ${token}` }
    })

    console.log(res.data)
    // 对结果进行按创建时间倒序排列
    orders.value = res.data.sort(
        (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    console.log(res.data[0].createdAt < res.data[2].createdAt)
    currentPage.value = 1 // 重置分页
  } catch (err) {
    console.error('Failed to load my orders:', err)
  }
}
  
  // 根据筛选状态过滤展示订单
  const filteredOrders = computed(() => {
    if (statusFilter.value === 'all') return orders.value
    return orders.value.filter(order => order.status === statusFilter.value)
  })
  
  // 计算分页后的订单子集
  const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return filteredOrders.value.slice(start, end)
  })
  
  // 页面加载时自动请求
  onMounted(async () => {
  const token = localStorage.getItem('token')
  const res = await axios.get('/api/orders/my', {
    headers: { Authorization: `Bearer ${token}` }
  })

  // 排序后赋值
  orders.value = res.data.sort(
    (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
 })
  // 当筛选状态变动时自动刷新
  watch(statusFilter, fetchOrders)

  </script>
  
  <style scoped></style>
  