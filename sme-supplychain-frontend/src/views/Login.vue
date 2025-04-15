<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-bold text-center mb-6">SME SCM Login</h2>
      <el-form
        :model="form"
        :rules="rules"
        ref="loginFormRef"
        label-position="top"
        @submit.prevent
      >
        <el-form-item label="Email" prop="email">
          <el-input
            v-model="form.email"
            placeholder="you@example.com"
            clearable
          />
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input
            v-model="form.password"
            placeholder="••••••••"
            type="password"
            show-password
            clearable
          />
        </el-form-item>

        <div class="flex gap-2">
          <el-button type="primary" class="w-full" @click="handleLogin" :loading="loading">
            Login
          </el-button>
          <el-button class="w-full" @click="handleReset">
            Reset
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const loginFormRef = ref()
const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    {
      type: 'email',
      message: 'Please enter a valid email address',
      trigger: ['blur', 'change']
    }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' }
  ]
}

const loading = ref(false)

const handleLogin = () => {
  loginFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return

    loading.value = true
    try {
      const res = await axios.post('/api/auth/login', form.value)

      const { token, user } = res.data

      //  1. 分开保存 token 和用户信息
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      //  2. 设置 axios 默认请求头（带上 Bearer Token）
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      //  3. 跳转 + 提示
      ElMessage.success(`Welcome back, ${user.username}!`)
      router.push('/dashboard')
    } catch (err: any) {
      ElMessage.error(err.response?.data?.message || 'Login failed')
    } finally {
      loading.value = false
    }
  })
}


const handleReset = () => {
  loginFormRef.value?.resetFields()
}
</script>

