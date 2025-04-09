<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">📈 Analytics Dashboard</h2>
  
      <!-- 顶部卡片 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <el-card><div class="text-sm text-gray-500">Orders This Month</div><div class="text-2xl font-bold text-blue-600">1,254</div></el-card>
        <el-card><div class="text-sm text-gray-500">Completion Rate</div><div class="text-2xl font-bold text-green-600">92%</div></el-card>
        <el-card><div class="text-sm text-gray-500">Peak Order Day</div><div class="text-2xl font-bold text-purple-600">Thursday</div></el-card>
        <el-card><div class="text-sm text-gray-500">Top Product</div><div class="text-2xl font-bold text-yellow-600">SSD 512GB</div></el-card>
      </div>
  
      <!-- 图表区 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- 折线图 -->
        <el-card>
          <template #header>📅 Daily Order Trend</template>
          <v-chart class="h-72" :option="lineChartOption" autoresize />
        </el-card>
  
        <!-- 饼图 -->
        <el-card>
          <template #header>📊 Order Status Ratio</template>
          <v-chart class="h-72" :option="pieChartOption" autoresize />
        </el-card>
  
        <!-- 柱状图 -->
        <el-card>
          <template #header>🔥 Top 5 Products</template>
          <v-chart class="h-72" :option="barChartOption" autoresize />
        </el-card>
      </div>
  
      <!-- 客户与供应商分析 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 客户活跃度 -->
        <el-card>
          <template #header>👥 Top 5 Active Customers</template>
          <v-chart class="h-72" :option="customerChartOption" autoresize />
        </el-card>
  
        <!-- 供应商供货表现 -->
        <el-card>
          <template #header>🏭 Top 5 Suppliers by Orders</template>
          <v-chart class="h-72" :option="supplierChartOption" autoresize />
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
  
  const lineChartOption = ref({
    xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    yAxis: { type: 'value' },
    series: [{ name: 'Orders', type: 'line', data: [100, 180, 160, 220, 300, 250, 200] }]
  })
  
  const pieChartOption = ref({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0 },
    series: [{
      type: 'pie',
      radius: '60%',
      center: ['50%', '50%'],
      data: [
        { value: 800, name: 'Completed' },
        { value: 200, name: 'Processing' },
        { value: 50, name: 'Pending' },
        { value: 20, name: 'Cancelled' }
      ]
    }]
  })
  
  const barChartOption = ref({
    xAxis: { type: 'category', data: ['SSD 512GB', 'LCD Panel', 'Battery', 'Motherboard', 'Fan'] },
    yAxis: { type: 'value' },
    series: [{ name: 'Sales', type: 'bar', data: [420, 320, 280, 260, 180] }]
  })
  
  const customerChartOption = ref({
    xAxis: { type: 'category', data: ['Alpha Inc.', 'Beta Ltd.', 'Gamma Co.', 'Delta Corp.', 'Epsilon LLC'] },
    yAxis: { type: 'value' },
    series: [{ name: 'Orders', type: 'bar', data: [150, 130, 110, 90, 85] }]
  })
  
  const supplierChartOption = ref({
    xAxis: { type: 'category', data: ['Zhejiang Tech', 'Shanghai Elec', 'Nova Supply', 'Canton Parts', 'Beijing Gears'] },
    yAxis: { type: 'value' },
    series: [{ name: 'Supplies', type: 'bar', data: [180, 160, 150, 130, 120] }]
  })
  </script>
  