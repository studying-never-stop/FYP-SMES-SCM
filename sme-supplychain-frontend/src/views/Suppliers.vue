<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">🤝 Supplier Management</h2>
  
      <!-- 供应商表格 -->
      <el-table :data="suppliers" border style="width: 100%">
        <el-table-column prop="name" label="Supplier Name" />
        <el-table-column prop="contact" label="Contact Person" />
        <el-table-column prop="phone" label="Phone" />
        <el-table-column prop="region" label="Region" />
        <el-table-column prop="category" label="Category" />
        <el-table-column prop="status" label="Status">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'Active' ? 'success' : 'info'">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="160">
          <template #default="scope">
            <el-button size="small" @click="viewSupplier(scope.row)">View</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 弹出供应商详情 -->
      <SupplierDetailDialog
        v-if="selectedSupplier"
        v-model:visible="dialogVisible"
        :supplier="selectedSupplier"
        @order="handleOrder"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import SupplierDetailDialog from '@/views/dialogs/SupplierDetailDialog.vue'
  
  interface Product {
    name: string
    price: number
    lastPurchased: string
    quantity?: number
  }
  
  interface Supplier {
    name: string
    contact: string
    phone: string
    region: string
    category: string
    status: string
    products: Product[]
  }
  
  const dialogVisible = ref(false)
  const selectedSupplier = ref<Supplier | null>(null)
  
  const suppliers = ref<Supplier[]>([
    {
      name: 'Shanghai Tech Co.',
      contact: 'Liu Wei',
      phone: '13800000000',
      region: 'Shanghai, China',
      category: 'Electronics',
      status: 'Active',
      products: [
        { name: 'LCD Panel', price: 320.0, lastPurchased: '2025-03-10' },
        { name: 'Battery Pack', price: 150.5, lastPurchased: '2025-03-12' }
      ]
    },
    {
      name: 'Guangdong Supply Ltd.',
      contact: 'Zhao Min',
      phone: '13711112222',
      region: 'Guangdong, China',
      category: 'Hardware',
      status: 'Active',
      products: [
        { name: 'Motherboard', price: 800.0, lastPurchased: '2025-03-08' },
        { name: 'SSD 512GB', price: 420.0, lastPurchased: '2025-03-05' }
      ]
    }
  ])
  
  const viewSupplier = (supplier: Supplier) => {
    selectedSupplier.value = supplier
    dialogVisible.value = true
  }
  
  const handleOrder = ({ product, quantity }: { product: Product; quantity: number }) => {
    alert(`Order placed: ${product.name} x ${quantity}`)
  }
  </script>
  