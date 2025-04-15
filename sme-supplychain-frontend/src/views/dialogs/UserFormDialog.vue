<template>
  <el-dialog
    :model-value="visible"
    title="User Form"
    width="500px"
    @close="emit('update:visible', false)"
  >
    <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
      <el-form-item label="Username" prop="username">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>

      <el-form-item label="Avatar">
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :action="uploadAvatarUrl"
          name="file"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :headers="uploadHeaders"
        >
          <img v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar" />
          <el-icon v-else><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="Email" prop="email">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>

      <el-form-item label="Role" prop="role">
        <el-select v-model="form.role" placeholder="Select role">
          <el-option label="Admin" value="admin" />
          <el-option label="Manager" value="manager" />
          <el-option label="Warehouseman" value="warehouseman" />
          <el-option label="Staff" value="staff" />
        </el-select>
      </el-form-item>

      <el-form-item label="Password" prop="password">
        <el-input
          v-model="form.password"
          type="password"
          autocomplete="new-password"
          placeholder="Set or change password"
        />
        <small v-if="form.id" class="text-gray-500">Leave blank to keep current password</small>
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
import type { User } from '@/types/user'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const props = defineProps<{
  visible: boolean
  editingUser: Partial<User> | null
}>()

const emit = defineEmits(['update:visible', 'submit'])

const formRef = ref()
const form = ref<Partial<User>>({
  username: '',
  email: '',
  role: undefined,
  password: '',
  avatarUrl: ''
})

const uploadAvatarUrl = '/api/users/upload-avatar'

const uploadHeaders = {
  Authorization: `Bearer ${localStorage.getItem('token')}` // 加上 token，支持 JWT 守卫
}

const handleAvatarSuccess = (res: any) => {
  form.value.avatarUrl = res.url
  ElMessage.success('Avatar uploaded successfully')
}

const beforeAvatarUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) ElMessage.error('Only image files are allowed')
  if (!isLt2M) ElMessage.error('Image size should be less than 2MB')
  return isImage && isLt2M
}

const rules = {
  username: [{ required: true, message: 'Username is required', trigger: 'blur' }],
  email: [{ required: true, message: 'Email is required', trigger: 'blur' }],
  role: [{ required: true, message: 'Role is required', trigger: 'change' }],
  password: [
    {
      required: false,
      validator: (rule: any, value: string, callback: any) => {
        if (!form.value.id && !value) {
          callback(new Error('Password is required'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

watch(
  () => props.editingUser,
  (user) => {
    form.value = user
      ? { ...user, password: '' }
      : { username: '', email: '', role: undefined, password: '', avatarUrl: '' }
  },
  { immediate: true }
)

const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return

    const payload = { ...form.value }
    if (form.value.id && !form.value.password) {
      delete payload.password
    }

    emit('submit', payload)
    emit('update:visible', false)
  })
}
</script>

<style scoped>
.text-gray-500 {
  font-size: 12px;
  color: #999;
}
.avatar-uploader .avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #dcdfe6;
}
</style>
