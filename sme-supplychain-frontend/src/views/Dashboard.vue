<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">📊 Dashboard</h1>

    <!-- 四个统计卡片区域 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- 点击弹出订单详情 -->
      <el-card shadow="hover" @click="orderDialogVisible = true">
        <div class="text-sm text-gray-500 cursor-pointer" >Total Orders</div>
        <div class="text-2xl font-bold">1,254</div>
      </el-card>

      <!-- 点击弹出发货详情 -->
      <el-card shadow="hover" @click="pendingDialogVisible = true">
        <div class="text-sm text-gray-500 cursor-pointer" >Pending Shipments</div>
        <div class="text-2xl font-bold">328</div>
      </el-card>

      <!-- 点击弹出产品详情 -->
      <el-card shadow="hover" @click="productDialogVisible = true">
        <div class="text-sm text-gray-500 cursor-pointer" >Total Products</div>
        <div class="text-2xl font-bold">980</div>
      </el-card>

      <!-- 点击弹出供应商详情 -->
      <el-card shadow="hover" @click="supplierDialogVisible = true">
        <div class="text-sm text-gray-500 cursor-pointer" >Suppliers</div>
        <div class="text-2xl font-bold">24</div>
      </el-card>
    </div>

    <!-- 首页概览图表 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <el-card>
        <template #header>📈 Order Trends</template>
        <v-chart class="h-72" :option="orderChartOption" autoresize />
      </el-card>
      <el-card>
        <template #header>📦 Inventory Levels</template>
        <v-chart class="h-72" :option="stockChartOption" autoresize />
      </el-card>
    </div>

    <!-- 引入四个弹窗组件 -->
    <OrderOverviewDialog v-model:visible="orderDialogVisible" />
    <PendingShipmentsDialog v-model:visible="pendingDialogVisible" />
    <TotalProductsDialog v-model:visible="productDialogVisible" />
    <SuppliersDialog v-model:visible="supplierDialogVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VChart from 'vue-echarts'
import * as echarts from 'echarts/core'
import {
  LineChart,
  BarChart
} from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 引入四个弹窗分析组件
import OrderOverviewDialog from '@/views/dialogs/OrderOverviewDialog.vue'
import PendingShipmentsDialog from '@/views/dialogs/PendingShipmentsDialog.vue'
import TotalProductsDialog from '@/views/dialogs/TotalProductsDialog.vue'
import SuppliersDialog from '@/views/dialogs/SuppliersDialog.vue'

// 注册 ECharts 组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  LineChart,
  BarChart,
  CanvasRenderer
])

// 控制四个弹窗显示
const orderDialogVisible = ref(false)
const pendingDialogVisible = ref(false)
const productDialogVisible = ref(false)
const supplierDialogVisible = ref(false)

// 仪表盘主图：订单趋势折线图
const orderChartOption = ref({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Orders',
      type: 'line',
      data: [120, 200, 150, 80, 70, 110, 130]
    }
  ]
})

// 仓库库存水平图（带颜色判断）
const stockData = [
  { name: 'Product A', value: 40 },
  { name: 'Product B', value: 75 },
  { name: 'Product C', value: 120 },
  { name: 'Product D', value: 95 }
]

const stockChartOption = ref({
  tooltip: {},
  xAxis: {
    type: 'category',
    data: stockData.map(item => item.name)
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: 'Stock',
      type: 'bar',
      data: stockData.map(item => ({
        value: item.value,
        itemStyle: {
          color:
            item.value < 50
              ? '#f56c6c' // 红色：库存紧张
              : item.value < 100
              ? '#e6a23c' // 黄色：库存预警
              : '#409EFF' // 蓝色：库存充足
        }
      }))
    }
  ]
})
</script>

<style scoped>
.v-chart {
  width: 100%;
}
</style>
