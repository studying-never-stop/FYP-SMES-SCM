<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-6">📈 Analytics Dashboard</h2>

    <!-- 顶部统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <el-card v-for="card in cards" :key="card.title">
        <div class="text-sm text-gray-500">{{ card.title }}</div>
        <div :class="card.color + ' text-2xl font-bold'">{{ card.value }}</div>
      </el-card>
    </div>

    <!-- 图表第一行：销售额 + 库存预测 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <el-card>
        <template #header>📈 Revenue Prediction</template>
        <v-chart class="h-72" :option="revenueChartOption" autoresize v-if="Object.keys(revenueChartOption).length" />
      </el-card>

      <el-card>
        <template #header>📦 Stock Flow Prediction</template>
        <v-chart class="h-72" :option="stockChartOption" autoresize v-if="Object.keys(stockChartOption).length" />
      </el-card>
    </div>

    <!-- 图表第二行：订单趋势 + 热门产品 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <el-card>
        <template #header>📊 Order Trend Prediction</template>
        <v-chart class="h-72" :option="orderChartOption" autoresize v-if="Object.keys(orderChartOption).length" />
      </el-card>

      <el-card>
        <template #header>🔥 Top 5 Predicted Products</template>
        <v-chart class="h-72" :option="productChartOption" autoresize v-if="Object.keys(productChartOption).length" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import VChart from 'vue-echarts'

const token = localStorage.getItem('token')

const cards = ref([
  { title: 'Monthly Orders', value: '-', color: 'text-blue-600' },
  { title: 'Completion Rate', value: '-', color: 'text-green-600' },
  { title: 'Revenue Growth', value: '-', color: 'text-purple-600' },
  { title: 'Top Product', value: '-', color: 'text-yellow-600' }
])

const orderChartOption = ref<Record<string, any>>({})
const revenueChartOption = ref<Record<string, any>>({})
const stockChartOption = ref<Record<string, any>>({})
const productChartOption = ref<Record<string, any>>({})

onMounted(async () => {
  const headers = { Authorization: `Bearer ${token}` }

  // 顶部卡片数据
  const { data: summary } = await axios.get('/api/prediction/summary', { headers })
  cards.value = [
    { title: 'Monthly Orders', value: summary.monthlyOrderCount, color: 'text-blue-600' },
    { title: 'Completion Rate', value: `${Math.round(summary.completionRate * 100)}%`, color: 'text-green-600' },
    { title: 'Revenue Growth', value: `${Math.round(summary.revenueGrowth * 100)}%`, color: 'text-purple-600' },
    { title: 'Top Product', value: summary.topProductName || '-', color: 'text-yellow-600' }
  ]

  // 订单预测图
  const { data: order } = await axios.get('/api/prediction/order-trend', { headers })
  orderChartOption.value = {
    title: { text: 'Order Trend' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Actual', 'Predicted'] },
    xAxis: { type: 'category', data: order.map((o: any) => o.date) },
    yAxis: { type: 'value' },
    series: [
      { name: 'Actual', type: 'line', data: order.map((o: any) => o.actual ?? null) },
      { name: 'Predicted', type: 'line', data: order.map((o: any) => o.predicted) }
    ]
  }

  // 销售额预测图
  const { data: revenue } = await axios.get('/api/prediction/revenue-trend', { headers })
  revenueChartOption.value = {
    title: { text: 'Revenue Trend' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['Actual', 'Predicted'] },
    xAxis: { type: 'category', data: revenue.map((o: any) => o.date) },
    yAxis: { type: 'value' },
    series: [
      { name: 'Actual', type: 'line', data: revenue.map((o: any) => o.actual ?? null) },
      { name: 'Predicted', type: 'line', data: revenue.map((o: any) => o.predicted) }
    ]
  }

  // 库存变动预测图
  const { data: stock } = await axios.get('/api/prediction/stock-trend', { headers })
  stockChartOption.value = {
    title: { text: 'Stock Flow' },
    tooltip: { trigger: 'axis' },
    legend: { data: ['In', 'Out'] },
    xAxis: { type: 'category', data: stock.map((s: any) => s.date) },
    yAxis: { type: 'value' },
    series: [
      { name: 'In', type: 'line', data: stock.map((s: any) => s.in) },
      { name: 'Out', type: 'line', data: stock.map((s: any) => s.out) }
    ]
  }

  // 热门产品图
  const { data: products } = await axios.get('/api/prediction/top-products', { headers })
  const productNames = await Promise.all(products.map(async (p: any) => {
    const res = await axios.get(`/api/products/${p.productId}`, { headers })
    return res.data?.name || `#${p.productId}`
  }))

  productChartOption.value = {
    title: { text: 'Top Products by Quantity' },
    tooltip: {},
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: productNames, inverse: true },
    series: [
      { type: 'bar', data: products.map((p: any) => p.quantity) }
    ]
  }
})
</script>

<style scoped>
</style>