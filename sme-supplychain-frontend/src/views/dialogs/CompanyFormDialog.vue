<template>
    <el-dialog
      :model-value="visible"
      :title="editingCompany ? 'Edit Company' : 'Create Company'"
      width="600px"
      @close="emit('update:visible', false)"
    >
      <el-form :model="form" label-width="120px" :rules="rules" ref="formRef" label-position="top" >
        <el-form-item label="Company Name" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
  
        <el-form-item label="Industry" prop="industry">
          <el-input v-model="form.industry" autocomplete="off" />
        </el-form-item>
  
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" autocomplete="off" />
        </el-form-item>
  
        <el-form-item label="Phone" prop="phone">
          <el-input v-model="form.phone" autocomplete="off" />
        </el-form-item>
  
        <el-form-item label="Contact Person" prop="contact">
          <el-input v-model="form.contact" autocomplete="off" />
        </el-form-item>
  
        <el-form-item label="Address" prop="address">
          <el-input v-model="form.address" autocomplete="off" />
        </el-form-item>
  
        <el-form-item label="Logo">
          <el-upload
            :action="uploadUrl"
            name="file"
            :show-file-list="false"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="w-24 h-24 object-contain border" />
            <el-button v-else>Upload Logo</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
  
      <template #footer>
        <el-button @click="emit('update:visible', false)">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
      </template>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import type { Company } from '@/types/company'
  
  const props = defineProps<{
    visible: boolean
    editingCompany: Partial<Company> | null
  }>()
  
  const emit = defineEmits(['update:visible', 'submit'])
  
  const formRef = ref()
  const form = ref<Partial<Company>>({
    name: '',
    industry: '',
    email: '',
    phone: '',
    contact: '',
    address: '',
    logoUrl: ''
  })
  
  const uploadUrl = '/api/companies/upload-logo'
  
  const handleUploadSuccess = (res: any) => {
    form.value.logoUrl = res.url
    ElMessage.success('Logo uploaded')
  }
  
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/')
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isImage) ElMessage.error('Only image files are allowed')
    if (!isLt2M) ElMessage.error('Image size should be less than 2MB')
    return isImage && isLt2M
  }
  
  const rules = {
    name: [{ required: true, message: 'Company name is required', trigger: 'blur' }],
    industry: [{ required: true, message: 'Industry is required', trigger: 'blur' }],
    email: [{ required: true, message: 'Email is required', trigger: 'blur' }],
    phone: [{ required: true, message: 'Phone is required', trigger: 'blur' }],
    contact: [{ required: true, message: 'Contact person is required', trigger: 'blur' }],
    address: [{ required: true, message: 'Address is required', trigger: 'blur' }],
  }
  
  watch(
    () => props.editingCompany,
    (company) => {
      form.value = company
        ? { ...company }
        : { name: '', industry: '', email: '', phone: '', contact: '', address: '', logoUrl: '' }
    },
    { immediate: true }
  )
  
  const handleSubmit = () => {
    formRef.value.validate((valid: boolean) => {
      if (!valid) return
      emit('submit', { ...form.value })
      emit('update:visible', false)
    })
  }
  </script>
  
  <style scoped>
  </style>
  