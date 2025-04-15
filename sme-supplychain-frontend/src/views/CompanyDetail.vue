<template>
    <div class="p-6">
      <!-- 公司信息区域 -->
      <div class="flex gap-6 mb-6">
        <img :src="company.logoUrl" class="w-24 h-24 rounded object-cover border" />
        <div class="flex-1 space-y-1">
          <h2 class="text-2xl font-bold">{{ company.name }}</h2>
          <p class="text-gray-600">Industry: {{ company.industry || 'N/A' }}</p>
          <p class="text-gray-600">Contact: {{ company.contact }}</p>
          <p class="text-gray-600">Phone: {{ company.phone }}</p>
          <p class="text-gray-600">Email: {{ company.email }}</p>
          <p class="text-gray-600">Address: {{ company.address }}</p>
          <p class="text-gray-600">Created At: {{ formatDate(company.createdAt) }}</p>
        </div>
      </div>
  
      <!-- 公司简介区域 -->
      <div class="mb-6">
        <h3 class="text-lg font-semibold mb-2">📝 Description</h3>
        <p class="text-gray-700 whitespace-pre-line">{{ company.description || 'No description available.' }}</p>
      </div>
  
      <!-- 产品搜索和清单按钮 -->
      <div class="flex justify-between items-center mb-4">
        <el-input v-model="search" placeholder="Search product..." clearable style="width: 250px" />
        <el-button type="primary" :disabled="selectedProducts.length === 0" @click="dialogVisible = true">
          View Order List ({{ selectedProducts.length }})
        </el-button>
      </div>
  
      <!-- 产品列表 -->
      <el-table :data="paginatedProducts" border>
        <el-table-column prop="name" label="Product" />
        <el-table-column prop="category" label="Category" />
        <el-table-column prop="price" label="Price (€)" />
        <el-table-column label="Quantity" width="130">
          <template #default="{ row }">
            <el-input-number v-model="row.tempQty" :min="1" :max="999" size="small" style="width: 80px" />
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="180">
          <template #default="{ row }">
            <template v-if="selectedProducts.find(p => p.productId === row.id)">
              <el-button size="small" type="warning" @click="updateQuantity(row)">Update</el-button>
              <el-button size="small" type="danger" @click="removeFromOrder(row.id)">Delete</el-button>
            </template>
            <el-button v-else size="small" type="success" @click="addToOrder(row)">Add</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页器 -->
      <div class="mt-4 text-right">
        <el-pagination
          layout="prev, pager, next"
          :total="filteredProducts.length"
          :page-size="pageSize"
          v-model:current-page="currentPage"
          background
        />
      </div>
  
      <!-- 创建订单弹窗 -->
      <CreateOrderDialog
        v-model:visible="dialogVisible"
        v-model:note="note"
        :buyerName="buyerCompany.name"
        :sellerName="company.name"
        :products="selectedProducts"
        @submit="submitOrder"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  import CreateOrderDialog from './dialogs/CreateOrderDialog.vue'
  import { ElMessage } from 'element-plus'
  
  const route = useRoute()
  const companyId = route.params.id
  
  const company = ref<any>({})
  const products = ref<any[]>([])
  const search = ref('')
  const dialogVisible = ref(false)
  const selectedProducts = ref<any[]>([])
  const buyerCompany = ref<any>({})
  const note = ref('')
  
  const currentPage = ref(1)
  const pageSize = 6
  
  onMounted(async () => {
    const token = localStorage.getItem('token')
    if (!token) return ElMessage.error('You are not logged in')
  
    try {
      const companyRes = await axios.get(`/api/companies/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      company.value = companyRes.data
      products.value = companyRes.data.products.map((p: any) => ({ ...p, tempQty: 1 }))
  
      const buyerRes = await axios.get('/api/companies/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      buyerCompany.value = buyerRes.data
    } catch (err) {
      console.error(err)
      ElMessage.error('Failed to load company or buyer info')
    }
  })
  
  const filteredProducts = computed(() => {
    return products.value.filter(p =>
      p.isInProvide && 
      p.name.toLowerCase().includes(search.value.toLowerCase())
    )
  })
  
  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return filteredProducts.value.slice(start, end)
  })
  
  const addToOrder = (product: any) => {
    const exists = selectedProducts.value.find(p => p.productId === product.id)
    if (!exists) {
      selectedProducts.value.push({
        name: product.name,
        price: product.price,
        quantity: product.tempQty,
        productId: product.id,
      })
      ElMessage.success('Added to order list')
    } else {
      ElMessage.warning('This product is already in the list. Use Update to change quantity.')
    }
  }
  
  const updateQuantity = (product: any) => {
    const target = selectedProducts.value.find(p => p.productId === product.id)
    if (target) {
      target.quantity = product.tempQty
      ElMessage.success('Quantity updated')
    }
  }
  
  const removeFromOrder = (productId: number) => {
    selectedProducts.value = selectedProducts.value.filter(p => p.productId !== productId)
    ElMessage.success('Removed from order list')
  }
  
  const submitOrder = async () => {
    console.log("note",note)
    try {
      const token = localStorage.getItem('token')
      const payload = {
        sellerCompanyId: company.value.id,
        items: selectedProducts.value.map(p => ({
          productId: p.productId,
          quantity: p.quantity,
          price: p.price,
        })),
        totalPrice: selectedProducts.value.reduce((sum, p) => sum + p.price * p.quantity, 0),
        note: note.value,
      }
      await axios.post('/api/orders', payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      ElMessage.success('Order created')
      selectedProducts.value = []
    } catch (err) {
      ElMessage.error('Failed to create order')
    }
  }
  
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString()
  }
  </script>
  
  <style scoped></style>
  