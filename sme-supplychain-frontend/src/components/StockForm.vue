<template>
    <el-card>
      <div class="text-lg font-bold mb-4">
        {{ type === 'in' ? 'Manual Stock-In' : 'Manual Stock-Out' }}
      </div>
  
      <el-form :model="form" label-width="120px" @submit.prevent>
        <!-- 产品选择 -->
        <el-form-item label="Product">
          <el-select v-model="form.productId" placeholder="Select Product">
            <el-option
              v-for="product in products"
              :key="product.id"
              :label="product.name"
              :value="product.id"
            />
          </el-select>
        </el-form-item>
  
        <!-- 数量输入 -->
        <el-form-item label="Quantity">
          <el-input-number v-model="form.quantity" :min="1" />
        </el-form-item>
  
        <!-- 备注输入 -->
        <el-form-item label="Note">
          <el-input v-model="form.note" placeholder="Optional note..." />
        </el-form-item>
  
        <!-- 提交按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">Submit</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, defineProps, defineEmits } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  
  const props = defineProps<{ type: 'in' | 'out' }>()
  const emits = defineEmits(['success'])
  
  const form = ref({
    productId: null,
    quantity: 1,
    note: '',
  })
  
  const products = ref<any[]>([])
  
  onMounted(async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('/api/inventories/products', {
        headers: { Authorization: `Bearer ${token}` },
      })
      products.value = res.data.map((inv: any) => inv.product)
    } catch (err) {
      ElMessage.error('Failed to load product list')
    }
  })
  
  const handleSubmit = async () => {
    if (!form.value.productId || form.value.quantity <= 0) {
      ElMessage.warning('Please complete the form')
      return
    }
  
    try {
      const token = localStorage.getItem('token')
      await axios.post(`/api/inventories/manual-${props.type}`, form.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      ElMessage.success('Operation successful')
      emits('success')
      form.value = { productId: null, quantity: 1, note: '' }
    } catch (err) {
      ElMessage.error('Operation failed')
    }
  }
  </script>
  
  <style scoped></style>
  