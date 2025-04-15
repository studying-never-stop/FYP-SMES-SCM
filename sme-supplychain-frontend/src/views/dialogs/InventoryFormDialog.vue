<template>
    <el-dialog :model-value="visible" title="Edit Inventory" width="500px" @close="emit('update:visible', false)">
      <el-form :model="form" label-width="120px" ref="formRef">
        <el-form-item label="Quantity">
          <el-input-number v-model="form.quantity" :min="0" />
        </el-form-item>
        <el-form-item label="Location">
          <el-input v-model="form.location" />
        </el-form-item>
        <el-form-item label="Min Level">
          <el-input-number v-model="form.minLevel" :min="0" />
        </el-form-item>
        <el-form-item label="Warn Level">
          <el-input-number v-model="form.warnLevel" :min="0" />
        </el-form-item>
        <el-form-item label="Max Level">
          <el-input-number v-model="form.maxLevel" :min="0" />
        </el-form-item>
        <el-form-item label="Type">
          <el-select v-model="form.type" >
              <el-option label="Product" value="product" />
              <el-option label="RawMaterial" value="raw" />
            </el-select>
        </el-form-item>
        <el-form-item label="IsActive">
            <el-select v-model="form.isActive" >
              <el-option label="Active" :value="true" />
              <el-option label="InActive" :value="false" /> <!--布尔值是需要在value前加:的否则后端收到的是字符串-->
            </el-select>
        </el-form-item>
      </el-form>
  
      <template #footer>
        <el-button @click="emit('update:visible', false)">Cancel</el-button>
        <el-button type="primary" @click="submitForm">Save</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import axios from 'axios'
  
  const props = defineProps<{
    visible: boolean
    inventory: any | null
  }>()
  
  const emit = defineEmits(['update:visible', 'updated'])
  const formRef = ref()
  
  // 包含 id 的字段类型
  const form = ref<{
    id?: number
    quantity: number
    location: string
    minLevel: number
    warnLevel: number
    maxLevel: number
    isActive: boolean
    type: 'product' | 'raw'
  }>({
    id: undefined,
    quantity: 0,
    location: '',
    minLevel: 0,
    warnLevel: 1,
    maxLevel: 9999,
    isActive: true,
    type: 'product'
  })
  
  watch(
    () => props.inventory,
    (val) => {
      if (val) {
        form.value = { ...val }
      } else {
        form.value = {
          id: undefined,
          quantity: 0,
          location: '',
          minLevel: 0,
          warnLevel: 1,
          maxLevel: 9999,
          isActive: true,
          type: 'product'
        }
      }
    },
    { immediate: true, deep: true }
  )
  
  const submitForm = async () => {
    try {
      await axios.put(`/api/inventories/${form.value.id}`, form.value)
      ElMessage.success('Inventory updated successfully')
      emit('updated')
      emit('update:visible', false)
    } catch (err) {
      ElMessage.error('Update failed')
    }
  }
  </script>
  
  <style scoped></style>
  