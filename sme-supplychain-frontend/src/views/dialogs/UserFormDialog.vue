<template>
    <el-dialog
      :model-value="visible"
      :title="editingUser ? 'Edit User' : 'Add User'"
      width="500px"
      @close="emit('update:visible', false)"
    >
      <el-form :model="form" label-width="100px" @submit.prevent>
        <el-form-item label="Username">
          <el-input v-model="form.username" :disabled="!!editingUser" required />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="form.email" type="email" required />
        </el-form-item>
        <el-form-item label="Role">
          <el-select v-model="form.role" placeholder="Select Role">
            <el-option label="Admin" value="admin" />
            <el-option label="Manager" value="manager" />
            <el-option label="Warehouseman" value="warehouseman" />
            <el-option label="Staff" value="staff" />
          </el-select>
        </el-form-item>
        <el-form-item label="Status">
          <el-radio-group v-model="form.status">
            <el-radio label="active">Active</el-radio>
            <el-radio label="inactive">Inactive</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
  
      <template #footer>
        <el-button @click="emit('update:visible', false)">Cancel</el-button>
        <el-button type="primary" @click="submitForm">Submit</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch, defineProps, defineEmits } from 'vue'
  
  interface User {
    username: string
    email: string
    role: string
    status: 'active' | 'inactive'
  }
  
  const props = defineProps<{
    visible: boolean
    editingUser: User | null
  }>()
  
  const emit = defineEmits(['update:visible', 'submit'])
  
  const form = ref<User>({
    username: '',
    email: '',
    role: 'Staff',
    status: 'active'
  })
  
  // 如果传入了编辑用户，表单初始化为该值；否则初始化为空
  watch(() => props.editingUser, (newVal) => {
    form.value = newVal
      ? { ...newVal }
      : { username: '', email: '', role: 'Staff', status: 'active' }
  }, { immediate: true })
  
  const submitForm = () => {
    if (!form.value.username || !form.value.email || !form.value.role) {
      return alert('Please complete the form.')
    }
    emit('submit', { ...form.value })
    emit('update:visible', false)
  }
  </script>
  