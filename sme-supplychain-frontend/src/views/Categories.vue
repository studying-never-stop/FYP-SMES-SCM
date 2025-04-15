<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Category Overview</h2>

    <el-table :data="categories" border style="width: 100%">
      <el-table-column prop="category" label="分类名称" />
      <el-table-column label="价格区间">
        <template #default="{ row }">
          €{{ row.minPrice }} ~ €{{ row.maxPrice }}
        </template>
      </el-table-column>
      <el-table-column prop="totalStock" label="库存总量" />
      <el-table-column label="近期销量">--</el-table-column>
      <el-table-column label="近期入库">--</el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="goToCategory(row.category)">
            查看产品
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
