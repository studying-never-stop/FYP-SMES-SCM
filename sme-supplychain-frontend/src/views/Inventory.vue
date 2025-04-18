<template>
  <div class="p-4 space-y-6">
    <!-- 顶部卡片区域 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="card in cards" :key="card.title" class="bg-white shadow-md rounded-xl p-4">
        <div class="text-gray-500 text-sm">{{ card.title }}</div>
        <div class="text-2xl font-semibold mt-1">{{ card.value }}</div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 库存结构饼图（按分类） -->
      <div class="bg-white p-4 shadow-md rounded-xl">
        <div class="text-lg mb-2">Inventory Structure Diagram</div>
        <v-chart class="h-72" :option="structureOption" autoresize />
      </div>

      <!-- 出入库趋势折线图 -->
      <div class="bg-white p-4 shadow-md rounded-xl">
        <div class="text-lg mb-2">Trend chart of inbound and outbound operations</div>
        <v-chart class="h-72" :option="flowTrendOption" autoresize />
      </div>
    </div>

    <!-- 库存预警产品柱状图 -->
    <div class="bg-white p-4 shadow-md rounded-xl min-h-[300px]">
      <div class="text-lg mb-2">Inventory warning product image</div>
      <div v-if="!warningData.length" class="text-center text-gray-400 py-12">
        There are no products in a warning state at present!
      </div>
      <v-chart v-else class="h-72" :option="warningChartOption" autoresize />
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

interface CardItem {
  title: string
  value: string | number
}

interface TrendItem {
  date: string
  in: number
  out: number
}

interface WarningItem {
  product: {
    name: string
  }
  quantity: number
}

const cards = ref<CardItem[]>([])
const structureOption = ref({})
const flowTrendOption = ref({})
const warningChartOption = ref({})
const warningData = ref<WarningItem[]>([])

onMounted(async () => {
  const token = localStorage.getItem('token')

  try {
    // 请求库存汇总数据
    const { data } = await axios.get('/api/inventorydata/summary', {
      headers: { Authorization: `Bearer ${token}` }
    })
    cards.value = [
      { title: 'Total Stock', value: data.totalStock },
      { title: 'Total In', value: data.totalIn },
      { title: 'Total Out', value: data.totalOut },
      { title: 'Warning Products', value: data.warningCount }
    ]

    // 请求库存结构饼图数据（分类 category）
    const { data: structure } = await axios.get('/api/inventorydata/structure', {
      headers: { Authorization: `Bearer ${token}` }
    })
    structureOption.value = {
      tooltip: { trigger: 'item' },
      legend: { top: 'bottom' },
      series: [
        {
          name: 'Inventory Category',
          type: 'pie',
          radius: '65%',
          data: structure
        }
      ]
    }

    // 请求出入库趋势图数据
    const { data: trend } = await axios.get('/api/inventorydata/trend', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const xData = trend.map((t: TrendItem) => t.date)
    const inData = trend.map((t: TrendItem) => t.in)
    const outData = trend.map((t: TrendItem) => t.out)
    flowTrendOption.value = {
      tooltip: { trigger: 'axis' },
      legend: { data: ['In', 'Out'] },
      xAxis: { type: 'category', data: xData },
      yAxis: { type: 'value' },
      series: [
        { name: 'In', type: 'line', data: inData },
        { name: 'Out', type: 'line', data: outData }
      ]
    }

    // 请求库存预警产品数据
    const { data: warning } = await axios.get('/api/inventorydata/warning', {
      headers: { Authorization: `Bearer ${token}` }
    })
    warningData.value = warning
    if (warning.length) {
      warningChartOption.value = {
        tooltip: {},
        xAxis: { type: 'value' },
        yAxis: {
          type: 'category',
          data: warning.map((w: WarningItem) => w.product.name),
          inverse: true
        },
        series: [
          {
            name: 'Quantity',
            type: 'bar',
            data: warning.map((w: WarningItem) => w.quantity)
          }
        ]
      }
    }
  } catch (err) {
    console.error('Failed to fetch inventory data:', err)
  }
})
</script>

<style scoped>
</style>
