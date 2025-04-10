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

const props = defineProps<{
  visible: boolean
  editingUser: Partial<User> | null
}>()

const emit = defineEmits(['update:visible', 'submit'])

const formRef = ref()
const form = ref<Partial<User>>({
  username: '',
  email: '',
  role: '',
  password: '',
})

// ✅ 校验规则：新增时密码必填，编辑时可选
const rules = {
  username: [{ required: true, message: 'Username is required', trigger: 'blur' }],
  email: [{ required: true, message: 'Email is required', trigger: 'blur' }],
  role: [{ required: true, message: 'Role is required', trigger: 'change' }],
  password: [
    {
      required: false, // 编辑时可不填
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

// 🔁 编辑时预填数据
watch(
  () => props.editingUser,
  (user) => {
    form.value = user
      ? { ...user, password: '' } // 清空密码避免误提交旧密码
      : { username: '', email: '', role: '', password: '' }
  },
  { immediate: true }
)

// 📤 提交处理
const handleSubmit = () => {
  formRef.value.validate((valid: boolean) => {
    if (!valid) return

    const payload = { ...form.value }

    // ✅ 如果是编辑模式且密码为空，移除 password 字段
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
</style>
