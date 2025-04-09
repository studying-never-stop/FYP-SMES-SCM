<template>
    <el-dialog
      :model-value="visible"
      :title="mode === 'edit' ? 'Edit Product' : 'Add New Product'"
      width="400px"
      @close="emit('update:visible', false)"
    >
      <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="Product Name" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="Category" prop="category">
          <el-select v-model="form.category" placeholder="Select Category">
            <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Stock" prop="stock">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
      </el-form>
  
      <template #footer>
        <el-button @click="emit('update:visible', false)">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">{{ mode === 'edit' ? 'Update' : 'Add' }}</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, reactive } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  
  // 类型定义
  interface Product {
    name: string
    category: string
    stock: number
  }
  
  // 接收父组件传参
  const props = defineProps<{
    visible: boolean
    mode: 'create' | 'edit'
    modelValue: Product
  }>()
  
  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'submit', value: Product): void
  }>()
  
  const categories = ['Electronics', 'Furniture', 'Office', 'Clothing']
  
  const form = reactive<Product>({ name: '', category: '', stock: 0 })
  const formRef = ref<FormInstance>()
  
  // 监听 modelValue 的变化用于回显
  watch(() => props.modelValue, (newVal) => {
    Object.assign(form, newVal)
  }, { immediate: true })
  
  const rules = reactive<FormRules>({
    name: [{ required: true, message: 'Please input product name', trigger: 'blur' }],
    category: [{ required: true, message: 'Please select category', trigger: 'change' }],
    stock: [{ required: true, type: 'number', message: 'Please enter stock number', trigger: 'blur' }]
  })
  
  // 提交表单回调
  const handleSubmit = () => {
    formRef.value?.validate((valid) => {
      if (valid) {
        emit('submit', { ...form })
        emit('update:visible', false)
      }
    })
  }
  </script>
  