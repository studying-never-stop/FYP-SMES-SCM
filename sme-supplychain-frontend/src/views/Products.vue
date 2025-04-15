<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">📦 Product Management</h2>

    <div class="flex justify-between mb-4 items-center gap-4 flex-wrap">
      <el-input
        v-model="search"
        placeholder="Search by name"
        clearable
        style="width: 250px"
      />

      <el-select
        v-model="selectedCategory"
        placeholder="Filter by category"
        clearable
        style="width: 200px"
      >
        <el-option label="All Categories" value="all" />
        <el-option
          v-for="cat in categories"
          :key="cat"
          :label="cat"
          :value="cat"
        />
      </el-select>
      <el-button type="primary" @click="openDialog">➕ Add Product</el-button>
    </div>

    <el-table :data="filteredProducts" border style="width: 100%">
      <el-table-column prop="name" label="Product Name" />

      <el-table-column label="Image" width="120">
        <template #default="scope">
          <img
            v-if="scope.row.imageUrl"
            :src="scope.row.imageUrl"
            class="w-12 h-12 object-cover rounded border"
            alt="product image"
          />
          <span v-else class="text-gray-400">No Image</span>
        </template>
      </el-table-column>

      <el-table-column prop="category" label="Category" />
      <el-table-column prop="price" label="Price €" />
      <el-table-column prop="unit" label="Unit" />
      <el-table-column prop="description" label="Description" />
      <el-table-column prop="isInProvide" label="isInProvide" />

      <el-table-column label="Actions" width="180">
        <template #default="scope">
          <el-button size="small" @click="editProduct(scope.row)">Edit</el-button>
          <el-popconfirm title="Confirm delete?" @confirm="deleteProduct(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger">Delete</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <ProductFormDialog
      v-model:visible="dialogVisible"
      :editingProduct="editingProduct"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
import ProductFormDialog from '@/views/dialogs/ProductFormDialog.vue'

interface Product {
  id?: number
  name: string
  category: string
  price: number
  unit: string
  description?: string
  imageUrl?: string
  isInProvide: boolean
}

const products = ref<Product[]>([])
const categories = ref<string[]>([])
const selectedCategory = ref('all')
const search = ref('')

const dialogVisible = ref(false)
const editingProduct = ref<Product | null>(null)

// 获取分类列表
const fetchCategories = async () => {
  const token = localStorage.getItem('token') 
  const res = await axios.get('/api/products/categories', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  categories.value = res.data
}

// 获取产品列表
const fetchProducts = async () => {
  try {
    if (selectedCategory.value === 'all') {
      const res = await axios.get('/api/products')
      products.value = res.data
    } else {
      const res = await axios.get(`/api/products/categories/${selectedCategory.value}`)
      products.value = res.data
    }
  } catch (err) {
    ElMessage.error('Failed to load products')
  }
}

const openDialog = () => {
  editingProduct.value = null
  dialogVisible.value = true
}

const editProduct = (product: Product) => {
  editingProduct.value = { ...product }
  dialogVisible.value = true
}

const deleteProduct = async (id: number) => {
  await axios.delete(`/api/products/${id}`)
  ElMessage.success('Product deleted')
  fetchProducts()
  fetchCategories()
}

const handleSubmit = async (payload: Product) => {
  try {
    if (payload.id) {
      await axios.put(`/api/products/${payload.id}`, payload)
    } else {
      await axios.post('/api/products', payload)
    }
    ElMessage.success('Product saved')
    dialogVisible.value = false
    fetchProducts()
    fetchCategories()
  } catch (err) {
    ElMessage.error('Failed to save product')
  }
}

// 搜索 + 分类过滤
const filteredProducts = computed(() => {
  return products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})

// 分类变化时自动刷新
watch(selectedCategory, fetchProducts)

onMounted(() => {
  // 读取预设分类
  const preselected = sessionStorage.getItem('preselectedCategory')
  if (preselected) {
    selectedCategory.value = preselected
    sessionStorage.removeItem('preselectedCategory') // 清理
  }

  fetchCategories()
  fetchProducts()
})
</script>

<style scoped>
</style>
