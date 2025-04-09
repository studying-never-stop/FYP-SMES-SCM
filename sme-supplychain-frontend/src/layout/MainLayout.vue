<template>
  <el-container style="min-height: 100vh">
    <!-- 顶部导航 -->
    <el-header style="padding: 0;">
      <TopNavbar />
    </el-header>

    <el-container>
      <!-- 左侧菜单 -->
      <el-aside width="200px" class="bg-gray-100">
        <SideMenu />
      </el-aside>

      <!-- 主内容区域 -->
      <el-main class="bg-white">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'
import TopNavbar from '../components/TopNavbar.vue'
import SideMenu from '../components/SideMenu.vue'

const router = useRouter()
const route = useRoute()
const activeMenu = ref(route.path)

watch(route, () => {
  activeMenu.value = route.path
})

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn')
  router.push('/login')
}
</script>

<style scoped>
.el-header {
  height: 60px;
  line-height: 60px;
}
</style>
