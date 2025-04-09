<template>
    <el-dialog
      v-model="visible"
      title="📦 Total Orders Overview"
      width="80%"
      top="5vh"
      align-center
      @close="emit('update:visible', false)"
    >
      <!-- 数据统计卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <el-card shadow="hover">
          <div class="text-sm text-gray-500 mb-1">Today New</div>
          <div class="text-2xl font-bold text-blue-600">{{ todayOrders }}</div>
        </el-card>
        <el-card shadow="hover">
          <div class="text-sm text-gray-500 mb-1">Completed</div>
          <div class="text-2xl font-bold text-green-600">{{ completedOrders }}</div>
        </el-card>
        <el-card shadow="hover">
          <div class="text-sm text-gray-500 mb-1">Near Deadline (Unfinished)</div>
          <div class="text-2xl font-bold text-red-500">{{ urgentUnfinished }}</div>
        </el-card>
      </div>
  
      <!-- 图表卡片 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <el-card>
          <template #header>🥧 Completion Rate</template>
          <v-chart class="chart" :option="orderPieOption" autoresize />
        </el-card>
        <el-card>
          <template #header>📦 Product Demand</template>
          <v-chart class="chart" :option="orderBarOption" autoresize />
        </el-card>
        <el-card>
          <template #header>📈 Completion Trend</template>
          <v-chart class="chart" :option="orderLineOption" autoresize />
        </el-card>
      </div>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue'
  import VChart from 'vue-echarts'
  import {
  PieChart
} from 'echarts/charts'

import {
  TitleComponent,
  TooltipComponent,
  LegendComponent
} from 'echarts/components'

import { CanvasRenderer } from 'echarts/renderers'

import * as echarts from 'echarts/core'

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer
])

  
  const props = defineProps<{
    visible: boolean
  }>()
  
  const emit = defineEmits(['update:visible'])
  const visible = ref(props.visible)
  
  watch(() => props.visible, (val) => {
    visible.value = val
  })
  
  // 模拟数据
  const todayOrders = 32
  const completedOrders = 26
  const urgentUnfinished = 4
  
  const orderPieOption = ref({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        name: 'Order Status',
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: [
          { value: completedOrders, name: 'Completed' },
          { value: todayOrders - completedOrders, name: 'Unfinished' }
        ]
      }
    ]
  })
  
  const orderBarOption = ref({
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['Product A', 'Product B', 'Product C', 'Product D']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Orders',
        type: 'bar',
        data: [120, 80, 150, 100]
      }
    ]
  })
  
  const orderLineOption = ref({
    tooltip: { trigger: 'axis' },
    legend: { data: ['Completed', 'Unfinished'] },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'Completed',
        type: 'line',
        data: [20, 28, 30, 24, 22, 26, 31]
      },
      {
        name: 'Unfinished',
        type: 'line',
        data: [5, 4, 6, 3, 2, 5, 3]
      }
    ]
  })
  </script>
  
  <style scoped>
  .chart {
    width: 100%;
    height: 250px;
  }
  </style>
  