<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">📦 Product Management</h2>
  
      <!-- 筛选区域 -->
      <div class="flex flex-wrap gap-4 mb-4 items-center">
        <el-input
          v-model="search"
          placeholder="Search by product name"
          clearable
          style="max-width: 200px"
        />
        <el-select
          v-model="selectedCategory"
          placeholder="Select Category"
          clearable
          style="max-width: 200px"
        >
          <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button type="primary" @click="openCreateDialog">➕ Add Product</el-button>
      </div>
  
      <!-- 表格区域 -->
      <el-table :data="paginatedData" border style="width: 100%">
        <el-table-column prop="name" label="Product Name" />
        <el-table-column prop="category" label="Category" />
        <el-table-column prop="stock" label="Stock" />
        <el-table-column label="Actions" width="160">
          <template #default="scope">
            <el-button size="small" type="primary" @click="openEditDialog(scope.row)">Edit</el-button>
            <el-button size="small" type="danger" @click="deleteProduct(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页器 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          layout="prev, pager, next"
          :total="filteredProducts.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
        />
      </div>
  
      <!-- 新增/编辑产品弹窗 -->
      <ProductFormDialog
        v-model:visible="dialogVisible"
        :mode="dialogMode"
        :model-value="selectedProduct"
        @submit="handleFormSubmit"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import ProductFormDialog from '@/views/dialogs/ProductFormDialog.vue'
  
  interface Product {
    id: number
    name: string
    category: string
    stock: number
  }
  
  const search = ref('')
  const selectedCategory = ref('')
  const currentPage = ref(1)
  const pageSize = 5
  
  const dialogVisible = ref(false)
  const dialogMode = ref<'create' | 'edit'>('create')
  const selectedProduct = ref<Product>({ name: '', category: '', stock: 0, id: -1 })
  
  const categories = ['Electronics', 'Furniture', 'Office', 'Clothing']
  
  const products = ref<Product[]>([
    { id: 1, name: 'Printer', category: 'Office', stock: 50 },
    { id: 2, name: 'Desk', category: 'Furniture', stock: 20 },
    { id: 3, name: 'Monitor', category: 'Electronics', stock: 80 },
    { id: 4, name: 'Notebook', category: 'Office', stock: 120 },
    { id: 5, name: 'Shirt', category: 'Clothing', stock: 35 },
    { id: 6, name: 'Lamp', category: 'Furniture', stock: 65 },
    { id: 7, name: 'Keyboard', category: 'Electronics', stock: 40 },
    { id: 8, name: 'Chair', category: 'Furniture', stock: 15 }
  ])
  
  const filteredProducts = computed(() =>
    products.value.filter(p =>
      p.name.toLowerCase().includes(search.value.toLowerCase()) &&
      (selectedCategory.value ? p.category === selectedCategory.value : true)
    )
  )
  
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return filteredProducts.value.slice(start, start + pageSize)
  })
  
  // 弹窗控制逻辑
  const openCreateDialog = () => {
    dialogMode.value = 'create'
    selectedProduct.value = { id: -1, name: '', category: '', stock: 0 }
    dialogVisible.value = true
  }
  
  const openEditDialog = (product: Product) => {
    dialogMode.value = 'edit'
    selectedProduct.value = { ...product }
    dialogVisible.value = true
  }
  
  const handleFormSubmit = (data: Product) => {
    if (dialogMode.value === 'create') {
      const newId = Math.max(...products.value.map(p => p.id)) + 1
      products.value.push({ ...data, id: newId })
    } else {
      const index = products.value.findIndex(p => p.id === data.id)
      if (index !== -1) products.value[index] = { ...data }
    }
  }
  
  const deleteProduct = (product: Product) => {
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      products.value = products.value.filter(p => p.id !== product.id)
    }
  }
  </script>
  