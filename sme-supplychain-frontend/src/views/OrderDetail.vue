<template>
    <div class="p-6 space-y-6">
      <!-- 返回按钮 -->
      <el-button
        type="default"
        size="small"
        @click="goBack"
        class="mb-2"
      >
        ← Back to Orders
      </el-button>

      <!-- 标题 -->
      <h2 class="text-2xl font-bold">🧾 Order Detail - #{{ orderId }}</h2>

      <!-- 步骤条 -->
      <el-steps :active="statusIndex" finish-status="success" align-center>
        <el-step title="Created" />
        <el-step title="Processing" />
        <el-step title="Packing" />
        <el-step title="Shipped" />
        <el-step title="Completed" />
      </el-steps>

      <!-- 主体区域：左右结构 -->
      <div class="flex flex-col md:flex-row gap-6">
        <!-- 左侧主要区域 -->
        <div class="flex-1 space-y-4">
          <!-- 产品明细列表 -->
          <div class="border rounded-xl p-4 shadow-sm">
            <h3 class="text-lg font-semibold mb-4">🧾 Products</h3>
            <div v-for="(item, index) in products" :key="index" class="flex justify-between py-2 border-b last:border-none">
              <div>
                <div class="font-medium">{{ item.name }}</div>
              </div>
              <div class="text-right">
                <div>€{{ item.price }}</div>
                <div class="text-sm text-gray-500">x {{ item.quantity }}</div>
              </div>
            </div>
          </div>

          <!-- 四个卡片布局 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border rounded-xl p-4 shadow-sm">
              <h3 class="text-lg font-semibold mb-2">📍 Shipping Address</h3>
              <p class="text-sm text-gray-600">Building 5, Industrial Park, Shenzhen, China</p>
            </div>

            <LogisticsInfo />

            <div class="border rounded-xl p-4 shadow-sm">
              <h3 class="text-lg font-semibold mb-2">💳 Payment</h3>
              <p class="text-sm text-gray-600">
                Status: <el-tag :type="paymentStatusColor">{{ paymentStatus }}</el-tag>
              </p>
            </div>

            <OrderRecordPreview />
          </div>
        </div>

        <!-- 右侧汇总卡片 -->
        <div class="w-full md:w-1/3">
          <OrderSummary
            :subtotal="subtotal"
            :shipping="shipping"
            :tax="tax"
            :payment-status="paymentStatus"
          />
        </div>
      </div>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import axios from 'axios'
  import LogisticsInfo from '@/components/LogisticsInfo.vue'
  import OrderRecordPreview from '@/components/OrderRecordPreview.vue'
  import OrderSummary from '@/components/OrderSummary.vue'

  const route = useRoute()
  const router = useRouter()

  const orderId = route.params.id as string
  const products = ref<any[]>([])
  const status = ref<'created' | 'processing' | 'packing' | 'shipped' | 'completed'>('created')
  const paymentStatus = ref<'unpaid' | 'paid' | 'refunded'>('unpaid')

  // 小计金额
  const subtotal = computed(() =>
    products.value.reduce((acc, p) => acc + p.price * p.quantity, 0)
  )

  // 运费与税（模拟）
  const shipping = ref(10)
  const tax = computed(() => subtotal.value * 0.1) // 10% 税

  // 当前订单状态对应步骤条索引
  const statusIndex = computed(() => {
    return ['created', 'processing', 'packing', 'shipped', 'completed'].indexOf(status.value)
  })

  // 支付状态对应颜色
  const paymentStatusColor = computed(() => {
    switch (paymentStatus.value) {
      case 'paid': return 'success'
      case 'unpaid': return 'warning'
      case 'refunded': return 'info'
      default: return ''
    }
  })

  // 返回上一页
  const goBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/orders')
    }
  }

  // 加载订单详情
  onMounted(async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const order = res.data
      products.value = order.items || []
      status.value = order.status
      paymentStatus.value = order.paymentStatus
    } catch (err) {
      console.error('Failed to fetch order details', err)
    }
  })
  </script>

  <style scoped></style>
