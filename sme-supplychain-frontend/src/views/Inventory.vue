<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">📦 Inventory Overview</h1>

    <!-- 筛选区域 -->
    <div class="flex flex-wrap gap-4 mb-4">
      <el-input v-model="searchKeyword" placeholder="Search product name" clearable />
      <el-select v-model="selectedCategory" placeholder="Select category" clearable>
        <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
      </el-select>
    </div>

    <!-- 库存表格 -->
    <el-table :data="filteredProducts" border style="width: 100%">
      <el-table-column prop="name" label="Product Name" />
      <el-table-column prop="category" label="Category" />
      <el-table-column prop="stock" label="Stock">
        <template #default="scope">
          <span
            :style="{
              color: scope.row.stock < 50 ? 'red' : scope.row.stock < 100 ? '#e6a23c' : '#409EFF',
              fontWeight: 'bold'
            }"
          >
            {{ scope.row.stock }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="120">
        <template #default="scope">
          <el-button size="small" type="primary" @click="viewProduct(scope.row)">View</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const searchKeyword = ref('')
const selectedCategory = ref('')

const categories = ['Electronics', 'Office', 'Clothing', 'Furniture']

const products = ref([
  { id: 1, name: 'Printer A', category: 'Office', stock: 40 },
  { id: 2, name: 'Desk Chair', category: 'Furniture', stock: 90 },
  { id: 3, name: 'Monitor X', category: 'Electronics', stock: 120 },
  { id: 4, name: 'Notebook', category: 'Office', stock: 75 },
  { id: 5, name: 'Winter Jacket', category: 'Clothing', stock: 30 }
])

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchName = p.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchCategory = selectedCategory.value ? p.category === selectedCategory.value : true
    return matchName && matchCategory
  })
})

const viewProduct = (product: any) => {
  alert(`Viewing details for ${product.name}`)
}
</script>
