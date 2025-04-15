<template>
  <div class="flex justify-between items-center text-white h-full" style="background-color: rgb(16, 38, 87);">
    <div class="text-xl font-bold">SME Supply Chain System</div>

    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link cursor-pointer text-white">
        👤 {{ username || 'Guest' }} <el-icon class="ml-1"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">Profile</el-dropdown-item>
          <el-dropdown-item command="logout">Logout</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const username = ref('') // 用户名动态绑定

// 在导航栏组件挂载时从 localStorage 读取用户名
onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser)
      username.value = user.username || 'Guest'
    } catch {
      username.value = 'Guest'
    }
  } else {
    username.value = 'Guest'
  }
})

// 菜单操作：登出 / 进入个人中心
interface User {
  id: number
  companyId: number
  [key: string]: any
}

const getCurrentUser = (): User | null => {
  const raw = localStorage.getItem('user')
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  delete axios.defaults.headers.common['Authorization']
}

const handleCommand = async (command: string) => {
  if (command === 'logout') {
    const user = getCurrentUser()

    if (!user || !user.id || !user.companyId) {
      ElMessage.warning('No user logged in.')
      router.push('/login')
      return
    }

    try {
      await axios.post(`/api/auth/logout/${user.id}`, {
        companyId: user.companyId,
      })

      logout()
      ElMessage.success('You have been logged out.')
      router.push('/login')
    } catch (err) {
      ElMessage.error('Logout failed. Please try again.')
    }

  } else if (command === 'profile') {
    ElMessage.info('Profile feature coming soon!')
  }
}
</script>
