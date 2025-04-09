<template>
    <el-dialog
      v-model="visible"
      title="🤝 Suppliers Overview"
      width="80%"
      top="5vh"
      align-center
      @close="emit('update:visible', false)"
    >
      <!-- 数据统计卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <el-card shadow="hover">
          <div class="text-sm text-gray-500 mb-1">Total Suppliers</div>
          <div class="text-2xl font-bold text-blue-600">{{ totalSuppliers }}</div>
        </el-card>
        <el-card shadow="hover">
          <div class="text-sm text-gray-500 mb-1">Active Contracts</div>
          <div class="text-2xl font-bold text-green-600">{{ activeContracts }}</div>
        </el-card>
        <el-card shadow="hover">
          <div class="text-sm text-gray-500 mb-1">Avg. Delivery Time (days)</div>
          <div class="text-2xl font-bold text-yellow-600">{{ avgDelivery }}</div>
        </el-card>
      </div>
  
      <!-- 图表展示 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <el-card>
          <template #header>🌍 Supplier Regions</template>
          <v-chart class="chart" :option="regionPieOption" autoresize />
        </el-card>
        <el-card>
          <template #header>📦 Deliveries by Supplier</template>
          <v-chart class="chart" :option="deliveryBarOption" autoresize />
        </el-card>
        <el-card>
          <template #header>📈 Contract Trends</template>
          <v-chart class="chart" :option="contractLineOption" autoresize />
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
  
  const totalSuppliers = 24
  const activeContracts = 18
  const avgDelivery = 4.2
  
  const regionPieOption = ref({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [
      {
        type: 'pie',
        radius: '60%',
        center: ['50%', '50%'],
        data: [
          { value: 10, name: 'Asia' },
          { value: 6, name: 'Europe' },
          { value: 5, name: 'North America' },
          { value: 3, name: 'Other' }
        ]
      }
    ]
  })
  
  const deliveryBarOption = ref({
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Deliveries',
        type: 'bar',
        data: [320, 180, 240, 150]
      }
    ]
  })
  
  const contractLineOption = ref({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'New Contracts',
        type: 'line',
        data: [2, 3, 4, 5, 3]
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
  