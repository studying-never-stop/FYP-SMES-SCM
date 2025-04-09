<template>
    <el-dialog
      :model-value="visible"
      :title="title"
      width="500px"
      @close="emit('update:visible', false)"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="Order ID" prop="orderId">
          <el-input v-model="form.orderId" />
        </el-form-item>
  
        <el-form-item label="Customer" prop="customer">
          <el-input v-model="form.customer" />
        </el-form-item>
  
        <el-form-item label="Created At" prop="createdAt">
          <el-date-picker
            v-model="form.createdAt"
            type="datetime"
            placeholder="Select date and time"
            style="width: 100%"
          />
        </el-form-item>
  
        <el-form-item label="Status" prop="status">
          <el-select v-model="form.status" placeholder="Select status">
            <el-option label="Pending Confirmation" value="Pending Confirmation" />
            <el-option label="Processing" value="Processing" />
            <el-option label="Packing" value="Packing" />
          </el-select>
        </el-form-item>
      </el-form>
  
      <template #footer>
        <el-button @click="emit('update:visible', false)">Cancel</el-button>
        <el-button type="primary" @click="submitForm">Add</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  
  interface Order {
    orderId: string
    customer: string
    createdAt: string
    status: string
  }
  
  const props = defineProps<{
    visible: boolean
    title?: string
  }>()
  
  const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void
    (e: 'submit', data: Order): void
  }>()
  
  const formRef = ref<FormInstance>()
  const form = reactive<Order>({
    orderId: '',
    customer: '',
    createdAt: '',
    status: ''
  })
  
  const rules: FormRules = {
    orderId: [{ required: true, message: 'Order ID is required', trigger: 'blur' }],
    customer: [{ required: true, message: 'Customer name is required', trigger: 'blur' }],
    createdAt: [{ required: true, message: 'Date is required', trigger: 'change' }],
    status: [{ required: true, message: 'Status is required', trigger: 'change' }]
  }
  
  const submitForm = () => {
    formRef.value?.validate((valid) => {
      if (valid) {
        emit('submit', { ...form })
        emit('update:visible', false)
  
        // 重置表单
        form.orderId = ''
        form.customer = ''
        form.createdAt = ''
        form.status = ''
      }
    })
  }
  </script>
  