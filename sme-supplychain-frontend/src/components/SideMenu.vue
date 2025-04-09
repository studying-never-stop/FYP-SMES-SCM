<template>
  <el-menu
    :default-active="activeMenu"
    class="h-full"
    router
    background-color="#f5f7fa"
    text-color="#333"
    active-text-color="#409EFF"
  >
    <el-menu-item index="/dashboard">📊 Dashboard</el-menu-item>

    <el-sub-menu index="/inventory">
      <template #title>
        <span @click.stop="handleParentClick('/inventory')">📦 Inventory</span>
      </template>
      <el-menu-item index="/inventory/products">Products</el-menu-item>
      <el-menu-item index="/inventory/categories">Categories</el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="/orders">
      <template #title>
        <span @click.stop="handleParentClick('/orders')">🧾 Orders</span>
      </template>
      <el-menu-item index="/orders/pending">Pending Orders</el-menu-item>
      <el-menu-item index="/orders/completed">Completed Orders</el-menu-item>
    </el-sub-menu>

    <el-menu-item index="/suppliers">🤝 Suppliers</el-menu-item>
    <el-menu-item index="/analytics">📈 Analytics</el-menu-item>
    <el-menu-item index="/settings">⚙️ Settings</el-menu-item>
    <el-menu-item index="/report-ai">🧠 Report AI</el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()

const handleParentClick = (path: string) => {
  router.push(path)
}

const route = useRoute()
const activeMenu = ref(route.path)

watch(route, () => {
  activeMenu.value = route.path
})
</script>
