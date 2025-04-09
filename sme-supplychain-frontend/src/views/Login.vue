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
            show-password
            clearable
          />
        </el-form-item>

        <div class="flex gap-2">
          <el-button type="primary" class="w-full" @click="handleLogin">
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
import { ElMessage } from 'element-plus'

const loginFormRef = ref()

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

const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      ElMessage.success('Login successful!')
      console.log('Logging in with:', form.value)
    } else {
      ElMessage.error('Please fix the errors and try again.')
    }
  })
}

const handleReset = () => {
  loginFormRef.value?.resetFields()
}
</script>
