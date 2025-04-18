<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Category Overview</h2>

    <el-table :data="categories" border style="width: 100%">
      <el-table-column prop="category" label="Classification name" />
      <el-table-column label="Price range">
        <template #default="{ row }">
          €{{ row.minPrice }} ~ €{{ row.maxPrice }}
        </template>
      </el-table-column>
      <el-table-column prop="totalStock" label="Total inventory" />
      <el-table-column label="Recent sales volume">--</el-table-column>
      <el-table-column label="Recently warehoused">--</el-table-column>
      <el-table-column label="Controls" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="goToCategory(row.category)">
            View the product
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const categories = ref([])

const fetchCategoryOverview = async () => {
  const token = localStorage.getItem('token')
  const res = await axios.get('/api/category-overview', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  categories.value = res.data
}

const goToCategory = (category: string) => {
  sessionStorage.setItem('preselectedCategory', category)
  router.push('/inventory/products')
}

onMounted(fetchCategoryOverview)
</script>

<style scoped>
</style>
