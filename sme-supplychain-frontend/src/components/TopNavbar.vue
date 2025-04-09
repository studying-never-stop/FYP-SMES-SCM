<template>
  <div class="flex justify-between items-center text-white h-full" style="background-color: rgb(16, 38, 87);">
    <div class="text-xl font-bold">SME Supply Chain System</div>
    
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link cursor-pointer text-white">
        👤 {{ username }} <el-icon class="ml-1"><arrow-down /></el-icon>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'

const router = useRouter()
const username = ref('Admin') // 可替换为 Pinia 中的用户昵称

const handleCommand = (command: string) => {
  if (command === 'logout') {
    localStorage.removeItem('isLoggedIn')
    router.push('/login')
  } else if (command === 'profile') {
    alert('Profile feature coming soon!')
  }
}
</script>
