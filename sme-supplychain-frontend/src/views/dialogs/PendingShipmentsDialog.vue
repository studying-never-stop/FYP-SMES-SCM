<template>
    <el-dialog
      v-model="visible"
      title="🚚 Pending Shipments Overview"
      width="80%"
      top="5vh"
      align-center
      @close="emit('update:visible', false)"
    >
      <!-- 数据统计卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <el-card shadow="hover">
          <div class="text-sm text-gray-500 mb-1">Today Pending</div>
          <div class="text-2xl font-bold text-yellow-600">{{ todayPending }}</div>
        </el-card>
        <el-card shadow="hover">
          <div class="text-sm text-gray-500 mb-1">Shipped Today</div>
          <div class="text-2xl font-bold text-green-600">{{ shippedToday }}</div>
        </el-card>
        <el-card shadow="hover">
          <div class="text-sm text-gray-500 mb-1">Overdue Shipments</div>
          <div class="text-2xl font-bold text-red-500">{{ overdueShipments }}</div>
        </el-card>
      </div>
  
      <!-- 图表卡片 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <el-card>
          <template #header>🥧 Shipment Status</template>
          <v-chart class="chart" :option="shipmentPieOption" autoresize />
        </el-card>
        <el-card>
          <template #header>🚚 By Shipment Method</template>
          <v-chart class="chart" :option="shipmentBarOption" autoresize />
        </el-card>
        <el-card>
          <template #header>📈 Shipment Trend</template>
          <v-chart class="chart" :option="shipmentLineOption" autoresize />
        </el-card>
      </div>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue'
  import VChart from 'vue-echarts'
  import * as echarts from 'echarts/core'
  import {
    PieChart,
    BarChart,
    LineChart
  } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
  } from 'echarts/components'
  import { CanvasRenderer } from 'echarts/renderers'
  
  echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    PieChart,
    BarChart,
    LineChart,
    CanvasRenderer
  ])
  
  const props = defineProps<{ visible: boolean }>()
  const emit = defineEmits(['update:visible'])
  
  const visible = ref(props.visible)
  watch(() => props.visible, val => visible.value = val)
  
  // 模拟数据
  const todayPending = 45
  const shippedToday = 38
  const overdueShipments = 6
  
  const shipmentPieOption = ref({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: [
          { value: shippedToday, name: 'Shipped' },
          { value: todayPending - shippedToday, name: 'Unshipped' }
        ]
      }
    ]
  })
  
  const shipmentBarOption = ref({
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['Courier', 'Self-pickup', '3rd Party']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Shipments',
        type: 'bar',
        data: [26, 8, 11]
      }
    ]
  })
  
  const shipmentLineOption = ref({
    tooltip: { trigger: 'axis' },
    legend: { data: ['Shipped', 'Unshipped'] },
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Shipped',
        type: 'line',
        data: [20, 30, 24, 28, 35, 40, 36]
      },
      {
        name: 'Unshipped',
        type: 'line',
        data: [10, 8, 6, 5, 7, 6, 9]
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
  