<template>
    <div class="p-6 space-y-6">
      <h2 class="text-2xl font-bold">📜 Inventory Records</h2>
  
      <!-- 筛选栏 -->
      <div class="flex gap-4 items-center">
        <el-select v-model="typeFilter" placeholder="Type" clearable>
          <el-option label="All" value="" />
          <el-option label="Inbound" value="in" />
          <el-option label="Outbound" value="out" />
        </el-select>
  
        <el-input
          v-model="search"
          placeholder="Search product or operator..."
          clearable
          style="width: 250px"
        />
  
        <el-button type="primary" @click="loadRecords">Search</el-button>
      </div>
  
      <!-- 表格展示出入库记录 -->
      <el-table :data="filteredRecords" border style="width: 100%">
        <el-table-column prop="productName" label="Product" />
        <el-table-column prop="type" label="Type" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'in' ? 'success' : 'danger'">
              {{ row.type === 'in' ? 'Inbound' : 'Outbound' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="Quantity" width="100" />
        <el-table-column prop="operatorName" label="Operator" width="120" />
        <el-table-column prop="note" label="Note" />
        <el-table-column prop="orderId" label="Order ID" width="160" />
        <el-table-column prop="createdAt" label="Date" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  
  const records = ref<any[]>([])
  const typeFilter = ref('')
  const search = ref('')
  
  // 加载记录数据
  const loadRecords = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/inventories/records', {
        headers: { Authorization: `Bearer ${token}` },
      })
      records.value = res.data
    } catch (err) {
      ElMessage.error('Failed to load records')
    }
  }
  
  // 筛选记录
  const filteredRecords = computed(() => {
    return records.value.filter(r => {
      const matchesType = !typeFilter.value || r.type === typeFilter.value
      const keyword = search.value.toLowerCase()
      const matchesSearch =
        r.productName?.toLowerCase().includes(keyword) ||
        r.operator?.toLowerCase().includes(keyword)
      return matchesType && matchesSearch
    })
  })
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString()
  }
  
  onMounted(loadRecords)
  </script>
  
  <style scoped>
  </style>
  