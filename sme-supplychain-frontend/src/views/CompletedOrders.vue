<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">✅ Completed Orders</h2>

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

    <!-- 空状态提示 -->
    <el-empty v-else description="No completed orders found" />

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
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import OrderCard from '@/components/OrderCard.vue'

const orders = ref<any[]>([])
const currentPage = ref(1)
const pageSize = 6

// 加载所有订单，再筛选状态为 completed 的
const fetchOrders = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/orders', {
      headers: { Authorization: `Bearer ${token}` }
    })
    orders.value = res.data
    currentPage.value = 1
  } catch (err) {
    console.error('Failed to load orders:', err)
  }
}

// 筛选出已完成订单
const filteredOrders = computed(() =>
  orders.value.filter(order => order.status === 'completed')
)

// 当前页订单
const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredOrders.value.slice(start, start + pageSize)
})

onMounted(fetchOrders)
</script>

<style scoped></style>
