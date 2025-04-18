<template>
  <div class="p-4 space-y-6">
    <!-- 顶部卡片区 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="card in cards" :key="card.title" class="bg-white shadow-md rounded-xl p-4">
        <div class="text-gray-500 text-sm">{{ card.title }}</div>
        <div class="text-2xl font-semibold mt-1">{{ card.value }}</div>
      </div>
    </div>

    <!-- 状态 + 趋势图区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 订单状态饼图 -->
      <div class="bg-white p-4 shadow-md rounded-xl">
        <div class="text-lg mb-2">Order status diagram</div>
        <v-chart class="h-72" :option="statusOption" autoresize />
      </div>

      <!-- 订单趋势 + 销售额趋势（双折线） -->
      <div class="bg-white p-4 shadow-md rounded-xl">
        <div class="text-lg mb-2">Order and sales trends</div>
        <v-chart class="h-72" :option="trendOption" autoresize />
      </div>
    </div>

    <!-- 底部两张柱状图 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 热门产品销量 -->
      <div class="bg-white p-4 shadow-md rounded-xl">
        <div class="text-lg mb-2">Sales volume of popular products</div>
        <v-chart class="h-72" :option="productOption" autoresize />
      </div>
      <!-- 顶部客户公司 -->
      <div class="bg-white p-4 shadow-md rounded-xl">
        <div class="text-lg mb-2">Top customer Company</div>
        <v-chart class="h-72" :option="buyerOption" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import VChart from 'vue-echarts'
import 'echarts/core'
import 'echarts/charts'
import 'echarts/components'
import 'echarts/renderers'

// 卡片类型
interface CardItem {
  title: string
  value: string | number
}

const cards = ref<CardItem[]>([])
const statusOption = ref({})
const trendOption = ref({})
const productOption = ref({})
const buyerOption = ref({})

onMounted(async () => {
  const token = localStorage.getItem('token')

  try {
    // 卡片数据
    const { data: summary } = await axios.get('/api/orderdata/summary', {
      headers: { Authorization: `Bearer ${token}` }
    })
    cards.value = [
      { title: "Today's Orders", value: summary.todayOrderCount },
      { title: 'Monthly Orders', value: summary.monthlyOrderCount },
      { title: 'Completion Rate', value: summary.completedRate },
      { title: 'Monthly Revenue', value: '€' + summary.monthlyRevenue.toLocaleString() }
    ]

    // 状态饼图
    const { data: statusRes } = await axios.get('/api/orderdata/status-summary', {
      headers: { Authorization: `Bearer ${token}` }
    })
    statusOption.value = {
      tooltip: { trigger: 'item' },
      series: [
        {
          name: 'Order Status',
          type: 'pie',
          radius: '65%',
          data: statusRes.statusCounts.map((s: any) => ({ name: s.status, value: s.count }))
        }
      ]
    }

    // 订单 & 收入趋势图
    const [trendRes, revenueRes] = await Promise.all([
      axios.get('/api/orderdata/trend', { headers: { Authorization: `Bearer ${token}` } }),
      axios.get('/api/orderdata/revenue-trend', { headers: { Authorization: `Bearer ${token}` } })
    ])
    const xData = trendRes.data.trend.map((t: any) => t.date)
    trendOption.value = {
      tooltip: { trigger: 'axis' },
      legend: { data: ['Orders', 'Revenue'] },
      xAxis: { type: 'category', data: xData },
      yAxis: { type: 'value' },
      series: [
        { name: 'Orders', type: 'line', data: trendRes.data.trend.map((t: any) => t.count) },
        { name: 'Revenue', type: 'line', data: revenueRes.data.revenue.map((r: any) => r.total) }
      ]
    }

    // 热门产品销量
    const { data: topProducts } = await axios.get('/api/orderdata/top-products', {
      headers: { Authorization: `Bearer ${token}` }
    })
    productOption.value = {
      tooltip: {},
      xAxis: { type: 'value' },
      yAxis: {
        type: 'category',
        data: topProducts.map((p: any) => p.name),
        inverse: true
      },
      series: [
        {
          type: 'bar',
          data: topProducts.map((p: any) => p.quantity)
        }
      ]
    }

    // 顶部客户公司
    const { data: topBuyers } = await axios.get('/api/orderdata/top-buyers', {
      headers: { Authorization: `Bearer ${token}` }
    })
    buyerOption.value = {
      tooltip: {},
      xAxis: { type: 'value' },
      yAxis: {
        type: 'category',
        data: topBuyers.map((b: any) => b.name),
        inverse: true
      },
      series: [
        {
          type: 'bar',
          data: topBuyers.map((b: any) => b.count)
        }
      ]
    }
  } catch (err) {
    console.error('Dashboard load error:', err)
  }
})
</script>

<style scoped>
</style>
