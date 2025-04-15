<template>
  <el-dialog :model-value="visible" title="Product Form" width="500px" @close="emit('update:visible', false)">
    <el-form :model="form" label-width="100px" ref="formRef" :rules="rules">
      <el-form-item label="Name" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Category" prop="category">
        <el-input v-model="form.category" />
      </el-form-item>
      <el-form-item label="Price" prop="price">
        <el-input v-model="form.price" type="number" />
      </el-form-item>
      <el-form-item label="Unit" prop="unit">
        <el-input v-model="form.unit" />
      </el-form-item>
      <el-form-item label="isInProvide" prop="isInProvide">
        <el-select v-model="form.isInProvide" >
              <el-option label="InProvide" :value="true" />
              <el-option label="NotInprovide" :value="false" />
            </el-select>
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="form.description" type="textarea" rows="3" />
      </el-form-item>

      <el-form-item label="Image">
        <el-upload
          class="image-uploader"
          :action="uploadUrl"
          name="file"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"
        >
          <img v-if="form.imageUrl" :src="form.imageUrl" class="w-24 h-24 object-cover rounded border" />
          <el-button v-else>Upload Image</el-button>
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

const props = defineProps<{
  visible: boolean
  editingProduct: any
}>()
const emit = defineEmits(['update:visible', 'submit'])

const formRef = ref()
const form = ref({
  name: '',
  category: '',
  price: 0,
  unit: '',
  description: '',
  imageUrl: '',
  isInProvide: true
})

const uploadUrl = '/api/products/upload-image'

const rules = {
  name: [{ required: true, message: 'Name required', trigger: 'blur' }],
  category: [{ required: true, message: 'Category required', trigger: 'blur' }],
  price: [{ required: true, message: 'Price required', trigger: 'blur' }],
  unit: [{ required: true, message: 'Unit required', trigger: 'blur' }],
}

watch(() => props.editingProduct, (product) => {
  form.value = product ? { ...product } : {
    name: '', category: '', price: 0, unit: '', description: '', imageUrl: ''
  }
}, { immediate: true })

const handleUploadSuccess = (res: any) => {
  form.value.imageUrl = res.url
  ElMessage.success('Image uploaded')
}

const beforeUpload = (file: File) => {
  const isImg = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImg) ElMessage.error('Only images allowed')
  if (!isLt2M) ElMessage.error('Image must < 2MB')
  return isImg && isLt2M
}

const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return
    emit('submit', { ...form.value })
    emit('update:visible', false)
  })
}
</script>

<style scoped>
.image-uploader .el-button {
  margin-top: 8px;
}
</style>
