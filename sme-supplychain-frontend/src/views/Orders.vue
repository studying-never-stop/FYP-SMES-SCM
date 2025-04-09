<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">🕒 Pending Orders</h2>
      <el-button type="primary" @click="openDialog">➕ Add Order</el-button>
    </div>

    <!-- 订单表格 -->
    <el-table :data="orders" border style="width: 100%">
      <el-table-column prop="orderId" label="Order ID" />
      <el-table-column prop="customer" label="Customer" />
      <el-table-column prop="createdAt" label="Created At" />
      <el-table-column prop="status" label="Status">
        <template #default="scope">
          <el-tag :type="statusColor(scope.row.status)">
            {{ scope.row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Actions" width="240">
        <template #default="scope">
          <el-button size="small" type="primary" @click="viewOrder(scope.row)">View</el-button>
          <el-button size="small" type="success" @click="markAsCompleted(scope.row)">Complete</el-button>
          <el-popconfirm
            title="Are you sure to cancel this order?"
            @confirm="cancelOrder(scope.row)"
          >
            <template #reference>
              <el-button size="small" type="danger">Cancel</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <div class="flex justify-end mt-4">
      <el-pagination
        layout="prev, pager, next"
        :total="orders.length"
        :page-size="5"
        v-model:current-page="currentPage"
      />
    </div>

    <!-- 新增订单弹窗 -->
    <OrderFormDialog
      v-model:visible="dialogVisible"
      title="Add New Order"
      @submit="handleAddOrder"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import OrderFormDialog from '@/views/dialogs/OrderFormDialog.vue'

interface Order {
  orderId: string
  customer: string
  createdAt: string
  status: string
}

const currentPage = ref(1)
const dialogVisible = ref(false)

const orders = ref<Order[]>([
  { orderId: '#ORD-2023', customer: 'Star Inc.', createdAt: '2025-04-06 14:32', status: 'Processing' },
  { orderId: '#ORD-2024', customer: 'Tech Ltd.', createdAt: '2025-04-06 15:10', status: 'Pending Confirmation' },
  { orderId: '#ORD-2025', customer: 'Alpha Co.', createdAt: '2025-04-06 16:00', status: 'Packing' },
  { orderId: '#ORD-2026', customer: 'Nova Group', createdAt: '2025-04-07 10:15', status: 'Pending Confirmation' },
  { orderId: '#ORD-2027', customer: 'Beta Ltd.', createdAt: '2025-04-07 11:45', status: 'Processing' }
])

const openDialog = () => {
  dialogVisible.value = true
}

const handleAddOrder = (newOrder: Order) => {
  orders.value.unshift(newOrder)
}

const viewOrder = (order: Order) => {
  alert(`Viewing order ${order.orderId}`)
}

const markAsCompleted = (order: Order) => {
  alert(`Marking ${order.orderId} as completed`)
}

const cancelOrder = (order: Order) => {
  alert(`Cancelled order ${order.orderId}`)
}

const statusColor = (status: string) => {
  switch (status) {
    case 'Pending Confirmation':
      return 'warning'
    case 'Packing':
      return 'info'
    case 'Processing':
      return 'primary'
    default:
      return 'default'
  }
}
</script>
