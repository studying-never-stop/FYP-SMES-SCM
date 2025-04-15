<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">Inventory Management</h2>
  
      <!-- Filter Section -->
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <!-- Product Filter -->
        <div class="flex gap-2 items-center">
          <span class="font-medium">Product Inventory</span>
          <el-input v-model="productSearch" placeholder="Search product name" clearable style="width: 200px" />
          <el-select v-model="productStatus" placeholder="Status" clearable style="width: 140px">
            <el-option label="All" value="all" />
            <el-option label="Active" value="active" />
            <el-option label="Inactive" value="inactive" />
          </el-select>
        </div>
  
        <!-- Raw Filter -->
        <div class="flex gap-2 items-center">
          <span class="font-medium">Raw Material Inventory</span>
          <el-input v-model="rawSearch" placeholder="Search raw material name" clearable style="width: 200px" />
          <el-select v-model="rawStatus" placeholder="Status" clearable style="width: 140px">
            <el-option label="All" value="all" />
            <el-option label="Active" value="active" />
            <el-option label="Inactive" value="inactive" />
          </el-select>
        </div>
      </div>
  
      <!-- Product Inventory Table -->
      <el-card class="mb-6" shadow="hover">
        <template #header>📦 Product Inventory</template>
        <el-table :data="filteredProductList" border>
          <el-table-column prop="product.name" label="Name" />
          <el-table-column label="Quantity">
            <template #default="{ row }">
              <span :style="{ color: getColor(row) }">{{ row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="product.unit" label="Unit" />
          <el-table-column prop="location" label="Location" />
          <el-table-column prop="minLevel" label="Min" />
          <el-table-column prop="warnLevel" label="Warn" />
          <el-table-column prop="maxLevel" label="Max" />
          <el-table-column label="Actions" width="120">
            <template #default="{ row }">
              <el-button size="small" @click="openEditDialog(row)">Edit</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  
      <!-- Raw Material Table -->
      <el-card shadow="hover">
        <template #header> Raw Material Inventory</template>
        <el-table :data="filteredRawList" border>
          <el-table-column prop="product.name" label="Name" />
          <el-table-column label="Quantity">
            <template #default="{ row }">
              <span :style="{ color: getColor(row) }">{{ row.quantity }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="product.unit" label="Unit" />
          <el-table-column prop="location" label="Location" />
          <el-table-column prop="minLevel" label="Min" />
          <el-table-column prop="warnLevel" label="Warn" />
          <el-table-column prop="maxLevel" label="Max" />
          <el-table-column label="Actions" width="120">
            <template #default="{ row }">
              <el-button size="small" @click="openEditDialog(row)">Edit</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
  
      <!-- Dialog -->
      <InventoryFormDialog
        v-model:visible="dialogVisible"
        :inventory="currentInventory"
        @updated="fetchData"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed, watch } from 'vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import InventoryFormDialog from '@/views/dialogs/InventoryFormDialog.vue'
  
  const productList = ref([])
  const rawList = ref([])
  const productSearch = ref('')
  const productStatus = ref('active')
  const rawSearch = ref('')
  const rawStatus = ref('active')
  const dialogVisible = ref(false)
  const currentInventory = ref(null)
  
  const fetchData = async () => {
    try {
      const [products, raws] = await Promise.all([
        axios.get('/api/inventories/products', { params: { search: productSearch.value, status: productStatus.value } }),
        axios.get('/api/inventories/raws', { params: { search: rawSearch.value, status: rawStatus.value } }),
      ])
      productList.value = products.data
      rawList.value = raws.data
    } catch (err) {
      ElMessage.error('Inventory load failed')
    }
  }
  
  onMounted(fetchData)
  watch([productSearch, productStatus, rawSearch, rawStatus], fetchData)
  
  const getColor = (item: any) => {
    if (!item.isActive) return 'black'
    if (item.quantity <= item.minLevel) return 'red'
    if (item.quantity <= item.warnLevel) return 'orange'
    if (item.quantity <= item.maxLevel) return 'green'
    if (item.quantity > item.maxLevel) return 'red'
    return ''
  }
  
  const filteredProductList = computed(() => productList.value)
  const filteredRawList = computed(() => rawList.value)
  
  const openEditDialog = (row: any) => {
    currentInventory.value = { ...row }
    dialogVisible.value = true
  }
  </script>
  
  <style scoped></style>
  