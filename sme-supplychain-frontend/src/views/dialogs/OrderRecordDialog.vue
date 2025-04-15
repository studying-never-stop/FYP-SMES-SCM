<template>
    <el-dialog
      v-model="visible"
      :title="`Operation Records for Order #${orderId}`"
      width="600px"
      destroy-on-close
    >
      <el-timeline>
        <el-timeline-item
          v-for="(record, index) in records"
          :key="index"
          :timestamp="formatDate(record.createdAt)"
          :type="statusColor(record.status)"
        >
          {{ record.message }}
        </el-timeline-item>
      </el-timeline>
  
      <template #footer>
        <el-button type="primary" @click="visible = false">Close</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, defineProps, watch } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  
  // 接收父组件传入的 orderId 和 visible（是否显示）
  const props = defineProps<{
    orderId: string
    visible: boolean
  }>()
  
  const emit = defineEmits(['update:visible'])
  
  const visible = ref(props.visible)
  watch(() => props.visible, val => (visible.value = val))
  watch(visible, val => emit('update:visible', val))
  
  const records = ref<any[]>([])
  
  // 根据状态返回颜色（可自定义）
  const statusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'info'
      case 'processing':
        return 'primary'
      case 'packing':
        return 'warning'
      case 'shipped':
        return 'success'
      case 'completed':
        return 'success'
      case 'cancelled':
        return 'danger'
      default:
        return ''
    }
  }
  
  // 时间格式化
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString()
  }
  
  // 请求该订单的记录
  onMounted(async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get(`/api/order-records/${props.orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      records.value = res.data
    } catch (err) {
      ElMessage.error('Failed to load operation records')
    }
  })
  </script>
  
  <style scoped>
  </style>
  