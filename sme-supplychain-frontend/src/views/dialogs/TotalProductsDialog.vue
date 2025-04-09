<template>
    <el-dialog
      v-model="visible"
      title="🧾 Total Products Overview"
      width="80%"
      top="5vh"
      align-center
      @close="emit('update:visible', false)"
    >
      <!-- 产品汇总卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <el-card shadow="hover">
          <div class="text-sm text-gray-500 mb-1">Total SKUs</div>
          <div class="text-2xl font-bold text-blue-600">{{ totalSkus }}</div>
        </el-card>
        <el-card shadow="hover">
          <div class="text-sm text-gray-500 mb-1">Out of Stock</div>
          <div class="text-2xl font-bold text-red-500">{{ outOfStock }}</div>
        </el-card>
        <el-card shadow="hover">
          <div class="text-sm text-gray-500 mb-1">Low Inventory</div>
          <div class="text-2xl font-bold text-yellow-500">{{ lowStock }}</div>
        </el-card>
      </div>
  
      <!-- 图表展示 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <el-card>
          <template #header>📊 Inventory Distribution</template>
          <v-chart class="chart" :option="productBarOption" autoresize />
        </el-card>
        <el-card>
          <template #header>🧮 Category Breakdown</template>
          <v-chart class="chart" :option="productRadarOption" autoresize />
        </el-card>
        <el-card>
          <template #header>🔄 Turnover Rate</template>
          <v-chart class="chart" :option="productLineOption" autoresize />
        </el-card>
      </div>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue'
  import VChart from 'vue-echarts'
  import * as echarts from 'echarts/core'
  import {
    BarChart,
    LineChart,
    RadarChart
  } from 'echarts/charts'
  import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    RadarComponent
  } from 'echarts/components'
  import { CanvasRenderer } from 'echarts/renderers'
  
  echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    RadarComponent,
    BarChart,
    LineChart,
    RadarChart,
    CanvasRenderer
  ])
  
  const props = defineProps<{ visible: boolean }>()
  const emit = defineEmits(['update:visible'])
  
  const visible = ref(props.visible)
  watch(() => props.visible, val => visible.value = val)
  
  const totalSkus = 980
  const outOfStock = 42
  const lowStock = 112
  
  const productBarOption = ref({
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['A', 'B', 'C', 'D', 'E']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Inventory',
        type: 'bar',
        data: [150, 80, 200, 120, 90]
      }
    ]
  })
  
  const productRadarOption = ref({
    tooltip: {},
    radar: {
      indicator: [
        { name: 'Electronics', max: 500 },
        { name: 'Furniture', max: 500 },
        { name: 'Grocery', max: 500 },
        { name: 'Clothing', max: 500 },
        { name: 'Office', max: 500 }
      ]
    },
    series: [
      {
        name: 'Category',
        type: 'radar',
        data: [
          {
            value: [430, 300, 200, 350, 300],
            name: 'Categories'
          }
        ]
      }
    ]
  })
  
  const productLineOption = ref({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Turnover Rate',
        type: 'line',
        data: [65, 70, 80, 75, 90]
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
  