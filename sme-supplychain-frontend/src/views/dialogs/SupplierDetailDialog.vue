<template>
    <el-dialog
      :model-value="visible"
      width="700px"
      :title="`Supplier: ${supplier.name}`"
      @close="emit('update:visible', false)"
    >
      <!-- 基本信息 -->
      <div class="mb-4 text-sm text-gray-600">
        <p><strong>Contact:</strong> {{ supplier.contact }} | {{ supplier.phone }}</p>
        <p><strong>Region:</strong> {{ supplier.region }} | <strong>Category:</strong> {{ supplier.category }}</p>
      </div>
  
      <!-- 合作记录表格 -->
      <el-table :data="supplier.products" border>
        <el-table-column prop="name" label="Product Name" />
        <el-table-column prop="price" label="Current Price" width="120">
          <template #default="scope">¥{{ scope.row.price.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="lastPurchased" label="Last Purchased" width="150" />
        <el-table-column label="Order" width="200">
          <template #default="scope">
            <el-input-number
              v-model="scope.row.quantity"
              :min="1"
              placeholder="Qty"
              style="width: 100px"
            />
            <el-button
              type="primary"
              size="small"
              class="ml-2"
              @click="placeOrder(scope.row)"
            >Order</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits } from 'vue'
  
  interface Product {
    name: string
    price: number
    lastPurchased: string
    quantity?: number
  }
  
  interface Supplier {
    name: string
    contact: string
    phone: string
    region: string
    category: string
    products: Product[]
  }
  
  const props = defineProps<{
    visible: boolean
    supplier: Supplier
  }>()
  
  const emit = defineEmits(['update:visible', 'order'])
  
  const placeOrder = (product: Product) => {
    if (!product.quantity || product.quantity <= 0) {
      return alert('Please enter a valid quantity.')
    }
    emit('order', { product, quantity: product.quantity })
    product.quantity = 0 // 清空数量
  }
  </script>
  