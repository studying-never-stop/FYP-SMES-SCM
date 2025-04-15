<template>
    <div class="flex gap-2 mt-2">
      <!-- 卖方：可执行下一步状态推进 -->
      <el-button
        v-if="canProceed"
        type="primary"
        size="small"
        @click="advanceStatus"
      >
        {{ nextStatusLabel }}
      </el-button>
  
      <!-- 任意方：取消订单（未完成、未取消前） -->
      <el-button
        v-if="canCancel"
        type="danger"
        size="small"
        @click="cancelOrder"
      >
        Cancel Order
      </el-button>
  
      <!-- 买方：确认收货并付款 -->
      <el-button
        v-if="canPay"
        type="success"
        size="small"
        @click="payAndConfirm"
      >
        Pay & Confirm
      </el-button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ElMessage } from 'element-plus'
  import axios from 'axios'
  import { computed, defineProps, defineEmits } from 'vue'
  
  // 接收父组件传入的订单对象与当前用户角色
  const props = defineProps<{ order: any; currentUserRole: 'buyer' | 'seller' }>()
  const emits = defineEmits(['updated'])
  
  // 映射：当前状态 → 下一个状态
  const nextStatusMap: Record<string, string> = {
    created: 'processing',
    processing: 'packing',
    packing: 'shipped',
  }
  
  // 映射：状态 → 按钮显示文案
  const nextStatusLabelMap: Record<string, string> = {
    created: 'Confirm Processing',
    processing: 'Mark Packing',
    packing: 'Mark Shipped',
  }
  
  // 是否显示状态推进按钮（仅限 seller 且在指定状态下）
  const canProceed = computed(() =>
    props.currentUserRole === 'seller' &&
    ['created', 'processing', 'packing'].includes(props.order.status)
  )
  
  // 状态推进按钮的显示文本
  const nextStatusLabel = computed(() =>
    nextStatusLabelMap[props.order.status as keyof typeof nextStatusLabelMap]
  )
  
  // 是否显示取消按钮（不能已取消或已完成）
  const canCancel = computed(() =>
    props.order.status !== 'cancelled' && props.order.status !== 'completed'
  )
  
  // 是否显示付款+完成按钮（仅 buyer，且状态为 shipped 且未付款）
  const canPay = computed(() =>
    props.currentUserRole === 'buyer' &&
    props.order.status === 'shipped' &&
    props.order.paymentStatus === 'unpaid'
  )
  
  // 公共方法：调用后端状态更新接口
  const updateStatus = async (status: string) => {
    try {
      const token = localStorage.getItem('token')
      await axios.patch(`/api/orders/${props.order._id}/status/${status}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      })
      ElMessage.success('Order status updated')
      emits('updated')
    } catch (err) {
      ElMessage.error('Failed to update status')
    }
  }
  
  // 处理：点击“下一步”
  const advanceStatus = async () => {
  const next = nextStatusMap[props.order.status as keyof typeof nextStatusMap]
  if (!next) return

  // 只有在准备发货时校验库存（即 packing → shipped）
  if (props.order.status === 'packing' && next === 'shipped') {
    const token = localStorage.getItem('token')
    try {
      const res = await axios.get('/api/inventories', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const inventoryMap = new Map(res.data.map((inv: any) => [inv.product.id, inv.quantity]))

      for (const item of props.order.items) {
        const stock = inventoryMap.get(item.productId) || 0
        if (stock < item.quantity) {
          ElMessage.error(`Insufficient stock for product: ${item.name}`)
          return
        }
      }
    } catch (err) {
      ElMessage.error('Failed to verify inventory')
      return
    }
  }

  // 一切无误后提交状态更新
  await updateStatus(next)
}
  
  // 处理：点击“取消订单”
  const cancelOrder = async () => {
    await updateStatus('cancelled')
  }
  
  // 处理：点击“付款并确认收货”
  const payAndConfirm = async () => {
  try {
    const token = localStorage.getItem('token')

    // 第一步：更新付款状态为 paid
    await axios.patch(`/api/orders/${props.order._id}/payment/paid`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })

    // 第二步：尝试完成订单（此时后端会触发入库逻辑）
    await axios.patch(`/api/orders/${props.order._id}/status/completed`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })

    ElMessage.success('Order completed and inventory updated')
    emits('updated')
  } catch (err: any) {
    const message = err?.response?.data?.message || 'Failed to complete order'
    ElMessage.error(message)
  }
}

  </script>
  
  <style scoped></style>
  