<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">🧠 AI-Powered Report</h2>
  
      <!-- 时间选择与操作 -->
      <div class="flex items-center gap-4 mb-6">
        <el-date-picker v-model="dateRange" type="daterange" start-placeholder="Start date" end-placeholder="End date" />
        <el-button type="primary" @click="generateReport">📄 Generate Report</el-button>
      </div>
  
      <!-- 智能总结段 -->
      <el-card class="mb-6">
        <template #header>📌 Summary</template>
        <p>
          本月共生成订单 <strong>1,254</strong> 单，较上月增长 <strong>12%</strong>。最活跃地区为 <strong>Dublin</strong>。
          完成率达 <strong>92%</strong>，客户满意度保持稳定。预计下周订单仍将保持增长。
        </p>
        <p class="mt-2 text-gray-500 italic">* 本段内容由 AI 自动生成，使用静态模拟占位，后期可接入模型 API *</p>
      </el-card>
  
      <!-- 图表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 订单趋势 -->
        <el-card>
          <template #header>📈 Order Forecast Trend</template>
          <v-chart class="h-72" :option="orderTrendOption" autoresize />
        </el-card>
  
        <!-- 客户增长 -->
        <el-card>
          <template #header>👥 Customer Growth</template>
          <v-chart class="h-72" :option="customerGrowthOption" autoresize />
        </el-card>
  
        <!-- 热门产品 -->
        <el-card>
          <template #header>🔥 Predicted Hot Products</template>
          <v-chart class="h-72" :option="productPieOption" autoresize />
        </el-card>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import VChart from 'vue-echarts'
  import * as echarts from 'echarts/core'
  import {
    LineChart,
    PieChart,
    BarChart
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
    LineChart,
    PieChart,
    BarChart,
    CanvasRenderer
  ])
  
  const dateRange = ref<[Date, Date] | null>(null)
  const generateReport = () => {
    // 模拟生成报告过程
    console.log('Report generated for:', dateRange.value)
  }
  
  // 图表配置
  const orderTrendOption = ref({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Orders',
        type: 'line',
        smooth: true,
        data: [120, 160, 190, 210, 250, 300, 280]
      }
    ]
  })
  
  const customerGrowthOption = ref({
    tooltip: {},
    xAxis: {
      type: 'category',
      data: ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    },
    yAxis: { type: 'value' },
    series: [{
      name: 'New Customers',
      type: 'bar',
      data: [25, 45, 60, 85]
    }]
  })
  
  const productPieOption = ref({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      name: 'Product Share',
      type: 'pie',
      radius: '65%',
      center: ['50%', '50%'],
      data: [
        { value: 420, name: 'SSD 512GB' },
        { value: 320, name: 'LCD Panel' },
        { value: 280, name: 'Battery' },
        { value: 180, name: 'Motherboard' }
      ]
    }]
  })
  </script>
  