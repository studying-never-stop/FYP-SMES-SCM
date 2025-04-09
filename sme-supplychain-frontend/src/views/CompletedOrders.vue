<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">✅ Completed Orders</h2>
  
      <!-- 表格展示已完成订单 -->
      <el-table :data="orders" border style="width: 100%">
        <el-table-column prop="orderId" label="Order ID" />
        <el-table-column prop="customer" label="Customer" />
        <el-table-column prop="completedAt" label="Completed At" />
        <el-table-column prop="status" label="Status">
          <template #default>
            <el-tag type="success">Completed</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="120">
          <template #default="scope">
            <el-button size="small" @click="viewOrder(scope.row)">View</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页器 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          layout="prev, pager, next"
          :total="orders.length"
          :page-size="5"
          v-model:current-page="currentPage"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  interface Order {
    orderId: string
    customer: string
    completedAt: string
  }
  
  const currentPage = ref(1)
  
  const orders = ref<Order[]>([
    { orderId: '#ORD-2001', customer: 'Star Inc.', completedAt: '2025-04-05 16:30' },
    { orderId: '#ORD-2002', customer: 'Tech Ltd.', completedAt: '2025-04-05 17:45' },
    { orderId: '#ORD-2003', customer: 'Alpha Co.', completedAt: '2025-04-06 10:20' },
    { orderId: '#ORD-2004', customer: 'Nova Group', completedAt: '2025-04-06 11:05' },
    { orderId: '#ORD-2005', customer: 'Beta Ltd.', completedAt: '2025-04-06 13:10' }
  ])
  
  const viewOrder = (order: Order) => {
    alert(`Viewing order ${order.orderId}`)
  }
  </script>
  