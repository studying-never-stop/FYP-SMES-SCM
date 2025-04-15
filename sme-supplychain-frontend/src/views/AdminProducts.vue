<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">🛠 All Products</h2>
  
      <div class="flex justify-between mb-4">
        <el-input v-model="search" placeholder="Search by name or company" clearable style="width: 250px" />
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
        <el-table-column prop="price" label="Price" />
        <el-table-column prop="unit" label="Unit" />
        <el-table-column prop="company.name" label="Company" />
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
  import { ref, computed, onMounted } from 'vue'
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
    company?: {
      id: number
      name: string
    }
  }
  
  const products = ref<Product[]>([])
  const search = ref('')
  const dialogVisible = ref(false)
  const editingProduct = ref<Product | null>(null)
  
  const fetchProducts = async () => {
    const res = await axios.get('/api/products/all') // 后端需提供该接口
    products.value = res.data
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
  }
  
  const handleSubmit = async () => {
    dialogVisible.value = false
    fetchProducts()
  }
  
  const filteredProducts = computed(() => {
    return products.value.filter(p =>
      p.name.toLowerCase().includes(search.value.toLowerCase()) ||
      (p.company?.name?.toLowerCase().includes(search.value.toLowerCase()) ?? false)
    )
  })
  
  onMounted(fetchProducts)
  </script>
  
  <style scoped>
  </style>
  