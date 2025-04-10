<template>
    <el-dialog
      v-model="visible"
      title="Confirm Purchase Order"
      width="50%"
      destroy-on-close
    >
      <el-table :data="items" border style="width: 100%">
        <el-table-column prop="material.name" label="Material" />
        <el-table-column prop="unitPrice" label="Unit Price (￥)" />
        <el-table-column prop="quantity" label="Quantity" />
        <el-table-column label="Subtotal (￥)">
          <template #default="scope">
            {{ scope.row.unitPrice * scope.row.quantity }}
          </template>
        </el-table-column>
      </el-table>
  
      <div class="mt-4 text-right text-lg font-semibold">
        Total: ￥{{ totalPrice }}
      </div>
  
      <template #footer>
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="submitOrders">Place Order</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  
  interface SupplierMaterial {
    material: {
      id: number
      name: string
    }
    unitPrice: number
    quantity: number
  }
  
  const props = defineProps<{
    items: SupplierMaterial[]
    supplierId: number
  }>()
  
  const emit = defineEmits(['close'])
  
  const visible = ref(true)
  
  const closeDialog = () => {
    visible.value = false
    emit('close')
  }
  
  // 计算总价
  const totalPrice = computed(() =>
    props.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  )
  
  // 提交订单：循环发送 POST /orders
  const submitOrders = async () => {
    try {
      await Promise.all(
        props.items.map(item =>
          axios.post('/orders', {
            supplierId: props.supplierId,
            materialId: item.material.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })
        )
      )
      ElMessage.success('Orders placed successfully!')
      closeDialog()
    } catch (err) {
      ElMessage.error('Failed to place orders.')
      console.error(err)
    }
  }
  </script>
  