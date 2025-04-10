<template>
  <el-dialog
    v-model="visible"
    :title="`Supplier: ${supplier?.companyName}`"
    width="60%"
    destroy-on-close
  >
    <!-- 供应商基本信息 -->
    <div class="mb-4">
      <p><strong>Contact:</strong> {{ supplier?.contact }}</p>
      <p><strong>Email:</strong> {{ supplier?.email }}</p>
      <p><strong>Phone:</strong> {{ supplier?.phone }}</p>
      <p><strong>Address:</strong> {{ supplier?.address || 'N/A' }}</p>
    </div>

    <!-- 原材料列表 -->
    <el-table :data="materials" border style="width: 100%" v-loading="loading">
      <el-table-column prop="material.name" label="Material" />
      <el-table-column prop="unitPrice" label="Unit Price (￥)" />
      <el-table-column label="Quantity to Order">
        <template #default="scope">
          <el-input-number
            v-model="scope.row.quantity"
            :min="0"
            placeholder="0"
            size="small"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部按钮 -->
    <template #footer>
      <el-button @click="visible = false">Cancel</el-button>
      <el-button type="primary" @click="openConfirmDialog">Confirm Order</el-button>
    </template>

    <!-- 二级弹窗 -->
    <OrderConfirmDialog
      v-if="confirmVisible"
      :items="selectedItems"
      :supplier-id="supplier?.id"
      @close="confirmVisible = false"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue' //  computed
import { ElMessage } from 'element-plus' //  ElMessage
import axios from 'axios'
import OrderConfirmDialog from './OrderConfirmDialog.vue'

interface Supplier {
  id: number
  companyName: string
  contact: string
  email: string
  phone: string
  address?: string
}

interface SupplierMaterial {
  id: number
  unitPrice: number
  material: {
    id: number
    name: string
  }
  quantity?: number
}

const props = defineProps<{
  visible: boolean
  supplier: Supplier | null
}>()

const emit = defineEmits(['update:visible'])

const visible = ref(props.visible)
watch(() => props.visible, val => (visible.value = val))
watch(visible, val => emit('update:visible', val))

const materials = ref<SupplierMaterial[]>([])
const loading = ref(false)
const confirmVisible = ref(false)

const fetchMaterials = async () => {
  if (!props.supplier) return
  loading.value = true
  try {
    const res = await axios.get(`/supplier-materials/supplier/${props.supplier.id}`)
    materials.value = res.data.map((m: any) => ({ ...m, quantity: 0 }))
  } catch (err) {
    console.error('Failed to load materials:', err)
    ElMessage.error('Failed to fetch materials')
  } finally {
    loading.value = false
  }
}

const selectedItems = computed(() =>
  materials.value.filter(item => item.quantity && item.quantity > 0)
)

const openConfirmDialog = () => {
  if (!selectedItems.value.length) {
    ElMessage.warning('Please select at least one material to order.')
    return
  }
  confirmVisible.value = true
}

onMounted(fetchMaterials)
watch(() => props.supplier?.id, fetchMaterials)
</script>
