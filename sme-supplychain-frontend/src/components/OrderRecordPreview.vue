<template>
    <div class="border rounded-xl p-4 shadow-sm">
      <h3 class="text-lg font-semibold mb-4">Operation Record</h3>
      <el-timeline>
        <el-timeline-item
          v-for="(record, index) in latestRecords"
          :key="index"
          :timestamp="record.createdAt"
          :type="record.type"
        >
          {{ record.message }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import axios from 'axios'
  
  interface RecordEntry {
    createdAt: string
    message: string
    type: 'success' | 'info' | 'warning' | 'danger'
  }
  
  const latestRecords = ref<RecordEntry[]>([])
  
  onMounted(async () => {
    try {
      const token = localStorage.getItem('token')
      const orderId = window.location.pathname.split('/').pop()
      const res = await axios.get(`/api/order-records/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      latestRecords.value = res.data.slice(-2).reverse()
    } catch (err) {
      console.error('Failed to fetch order records:', err)
    }
  })
  </script>
  
  <style scoped>
  </style>
  