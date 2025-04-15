<template>
    <div class="p-6 space-y-6">
      <!-- 页面标题 -->
      <h2 class="text-2xl font-bold">📦 Manual Stock Management</h2>
  
      <!-- 切换操作类型 -->
      <div class="flex gap-4">
        <el-button
          type="primary"
          :plain="formType !== 'in'"
          @click="formType = 'in'"
        >
          Manual Inbound
        </el-button>
        <el-button
          type="danger"
          :plain="formType !== 'out'"
          @click="formType = 'out'"
        >
          Manual Outbound
        </el-button>
      </div>
  
      <!-- 表单组件 -->
      <StockForm :type="formType" @success="handleSuccess" />
  
      <!-- 库存列表 -->
      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-2">📊 Current Inventory</h3>
        <el-table :data="inventoryList" border style="width: 100%">
          <el-table-column prop="product.name" label="Product" />
          <el-table-column prop="quantity" label="Quantity" />
          <el-table-column prop="location" label="Location" />
          <el-table-column prop="type" label="Type" />
        </el-table>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import StockForm from '@/components/StockForm.vue'
  
  // 当前操作类型：'in' or 'out'
  const formType = ref<'in' | 'out'>('in')
  
  // 当前库存列表
  const inventoryList = ref<any[]>([])
  
  // 加载库存
  const loadInventory = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/inventories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      inventoryList.value = res.data
    } catch (err) {
      ElMessage.error('Failed to load inventory')
    }
  }
  
  // 提交成功后刷新库存
  const handleSuccess = () => {
    loadInventory()
  }
  
  onMounted(loadInventory)
  </script>
  
  <style scoped>
  </style>
  