<template>
  <div class="grid grid-cols-4 gap-4 p-4">
    <!-- Top 4 summary cards -->
    <el-card v-for="card in cards" :key="card.title" class="col-span-1">
      <div class="text-xl font-semibold">{{ card.value }}</div>
      <div class="text-sm text-gray-500">{{ card.title }}</div>
    </el-card>

    <!-- Left: Order Status Pie Chart -->
    <el-card class="col-span-2">
      <div class="text-lg mb-2">Order Status Distribution</div>
      <v-chart :option="statusChartOption" style="height:300px" />
    </el-card>

    <!-- Center: Order Trend Line Chart -->
    <el-card class="col-span-2">
      <div class="text-lg mb-2">Order Trend (Last 30 Days)</div>
      <v-chart :option="orderTrendOption" style="height:300px" />
    </el-card>

    <!-- Center: Revenue Trend Line Chart -->
    <el-card class="col-span-4">
      <div class="text-lg mb-2">Revenue Trend (Last 30 Days)</div>
      <v-chart :option="revenueTrendOption" style="height:300px" />
    </el-card>

    <!-- Bottom: Top Products Bar Chart -->
    <el-card class="col-span-2">
      <div class="text-lg mb-2">Top Products by Sales</div>
      <v-chart :option="topProductsOption" style="height:300px" />
    </el-card>

    <!-- Bottom: Top Buyers Bar Chart -->
    <el-card class="col-span-2">
      <div class="text-lg mb-2">Top Buyer Companies</div>
      <v-chart :option="topBuyersOption" style="height:300px" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 中文注释：引入所需模块
import { ref, onMounted } from 'vue'
import axios from 'axios'
import VChart from 'vue-echarts'
import 'echarts'

// 类型定义
interface CardItem {
  title: string
  value: string | number
}

interface StatusCount {
  status: string
  count: number
}

interface TrendPoint {
  date: string
  count: number
}

interface RevenuePoint {
  date: string
  total: number
}

interface ProductStat {
  name: string
  quantity: number
}

interface BuyerStat {
  name: string
  count: number
}

// 所有图表绑定数据
const cards = ref<CardItem[]>([])
const statusChartOption = ref<Record<string, any>>({})
const orderTrendOption = ref<Record<string, any>>({})
const revenueTrendOption = ref<Record<string, any>>({})
const topProductsOption = ref<Record<string, any>>({})
const topBuyersOption = ref<Record<string, any>>({})

onMounted(async () => {
  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  try {
    // 1. Summary 卡片
    const { data: summary } = await axios.get('/api/orderdata/summary', { headers })
    cards.value = [
      { title: "Today's Orders", value: summary.todayOrderCount },
      { title: 'Monthly Orders', value: summary.monthlyOrderCount },
      { title: 'Completion Rate', value: summary.completedRate },
      { title: 'Monthly Revenue', value: '€' + summary.monthlyRevenue.toLocaleString() }
    ]

    // 2. 状态饼图
    const { data: statusRes }: { data: { statusCounts: StatusCount[] } } = await axios.get('/api/orderdata/status-summary', { headers })
    statusChartOption.value = {
      tooltip: { trigger: 'item' },
      series: [{
        name: 'Order Status',
        type: 'pie',
        radius: '65%',
        data: statusRes.statusCounts.map((s: StatusCount) => ({ name: s.status, value: s.count }))
      }]
    }

    // 3. 订单趋势折线图
    const { data: trendRes }: { data: { trend: TrendPoint[] } } = await axios.get('/api/orderdata/trend', { headers })
    orderTrendOption.value = {
      xAxis: { type: 'category', data: trendRes.trend.map((t: TrendPoint) => t.date) },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: trendRes.trend.map((t: TrendPoint) => t.count) }]
    }

    // 4. 收入趋势图
    const { data: revenueRes }: { data: { revenue: RevenuePoint[] } } = await axios.get('/api/orderdata/revenue-trend', { headers })
    revenueTrendOption.value = {
      xAxis: { type: 'category', data: revenueRes.revenue.map((r: RevenuePoint) => r.date) },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: revenueRes.revenue.map((r: RevenuePoint) => r.total) }]
    }

    // 5. 热门产品图表
    const { data: topProducts }: { data: ProductStat[] } = await axios.get('/api/orderdata/top-products', { headers })
    topProductsOption.value = {
      tooltip: {},
      xAxis: { type: 'value' },
      yAxis: {
        type: 'category',
        data: topProducts.map((p: ProductStat) => p.name),
        inverse: true
      },
      series: [{
        type: 'bar',
        data: topProducts.map((p: ProductStat) => p.quantity)
      }]
    }

    // 6. 客户公司排行图表
    const { data: topBuyers }: { data: BuyerStat[] } = await axios.get('/api/orderdata/top-buyers', { headers })
    topBuyersOption.value = {
      tooltip: {},
      xAxis: { type: 'value' },
      yAxis: {
        type: 'category',
        data: topBuyers.map((b: BuyerStat) => b.name),
        inverse: true
      },
      series: [{
        type: 'bar',
        data: topBuyers.map((b: BuyerStat) => b.count)
      }]
    }

  } catch (err) {
    console.error('Dashboard data fetch failed:', err)
  }
})
</script>


<style scoped>
.el-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
</style>