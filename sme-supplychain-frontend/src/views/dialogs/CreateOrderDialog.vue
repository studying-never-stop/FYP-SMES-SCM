<template>
    <el-dialog
      :model-value="visible"
      @update:modelValue="(val: any) => emits('update:visible', val)"
      title="Create Order"
      width="600px"
    >
      <!-- 公司信息 -->
      <div class="mb-4 space-y-2">
        <p><strong>Buyer:</strong> {{ buyerName }}</p>
        <p><strong>Seller:</strong> {{ sellerName }}</p>
      </div>
  
      <!-- 产品列表 -->
      <el-table :data="products" border>
        <el-table-column prop="name" label="Product" />
        <el-table-column prop="quantity" label="Quantity" />
        <el-table-column prop="price" label="Unit Price (€)" />
        <el-table-column label="Subtotal">
          <template #default="{ row }">
            €{{ row.price * row.quantity }}
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 备注输入框 -->
      <div class="mt-4">
        <p class="font-semibold mb-1">Note (optional)</p>
        <el-input
          type="textarea"
          v-model="noteValue"
          :rows="3"
          placeholder="Any remarks for this order..."
          resize="vertical"
        />
      </div>
  
      <!-- 总价显示 -->
      <div class="mt-4 text-right text-lg">
        Total: <strong>€{{ totalPrice }}</strong>
      </div>
  
      <!-- 按钮区域 -->
      <template #footer>
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, computed, ref, watch } from 'vue'
  
  // 接收来自父组件的 props
  const props = defineProps<{
    visible: boolean
    note: string        // 父组件传入的备注内容
    buyerName: string   // 买方公司名
    sellerName: string  // 卖方公司名
    products: { name: string; quantity: number; price: number }[] // 产品列表
  }>()
  
  // 本地副本：用于输入框绑定，不直接修改 props
  const noteValue = ref(props.note)
  
  // 同步修改时将内容通知父组件，实现双向绑定效果
  watch(noteValue, val => {
    emits('update:note', val)
  })
  
  // 定义可发出的事件
  const emits = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'update:note', value: string): void
    (e: 'submit'): void
  }>()
  
  // 总价计算
  const totalPrice = computed(() =>
    props.products.reduce((sum, p) => sum + p.price * p.quantity, 0)
  )
  
  // 取消操作（关闭弹窗）
  const handleCancel = () => {
    emits('update:visible', false)
  }
  
  // 提交操作：触发 submit 事件（note 通过双向绑定已同步）
  const handleSubmit = () => {
    emits('submit')
    emits('update:visible', false)
  }
  </script>
  
  <style scoped></style>