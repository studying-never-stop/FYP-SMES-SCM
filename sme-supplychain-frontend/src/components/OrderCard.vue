<template>
    <el-card class="order-card cursor-pointer hover:shadow-lg transition" @click="goToDetail">
      <!-- 顶部信息 -->
      <div class="flex justify-between items-center mb-2">
        <div>
          <span class="font-bold text-base">Order #{{ order._id }}</span>
          <span class="text-gray-500 text-sm ml-2">{{ formatDate(order.createdAt) }}</span>
        </div>
        <el-tag :type="statusColor" size="small" effect="dark">{{ order.status }}</el-tag>
      </div>
  
      <!-- 中部内容 -->
      <div class="flex flex-col md:flex-row gap-4 mb-2">
        <!-- 商品项 -->
        <div class="flex-1 space-y-2">
          <div
            v-for="(item, index) in order.items"
            :key="index"
            class="flex justify-between text-sm"
          >
            <div>
              <div class="font-medium">{{ item.name }}</div>
              <div class="text-gray-500 text-xs">x{{ item.quantity }}</div>
            </div>
            <div class="text-right text-gray-700 font-semibold">
              €{{ item.price * item.quantity }}
            </div>
          </div>
        </div>
  
        <!-- 公司信息 -->
        <div class="w-full md:w-1/3 text-sm space-y-1">
          <div><span class="text-gray-500 font-medium">Buyer:</span> {{ order.buyerCompany?.name || order.buyerCompanyId }}</div>
          <div><span class="text-gray-500 font-medium">Seller:</span> {{ order.sellerCompany?.name || order.sellerCompanyId }}</div>
          <div><span class="text-gray-500 font-medium">Payment:</span>
            <el-tag :type="paymentColor" size="small">{{ order.paymentStatus }}</el-tag>
          </div>
        </div>
      </div>
  
      <!-- 操作按钮 -->
      <div class="mt-4" @click.stop>
        <OrderActions
          :order="order"
          :currentUserRole="currentUserRole"
          @updated="$emit('updated')"
        />
      </div>
    </el-card>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { computed, defineProps, defineEmits } from 'vue'
  import OrderActions from './OrderActions.vue'
  
  const props = defineProps<{ order: any; currentUserRole: 'buyer' | 'seller' }>()
  const emits = defineEmits(['updated'])
  
  const router = useRouter()
  
  const goToDetail = () => {
    router.push(`/orders/${props.order._id}`)
  }
  
  const statusColor = computed(() => {
    switch (props.order.status) {
      case 'created': return 'info'
      case 'processing': return 'primary'
      case 'packing': return 'warning'
      case 'shipped': return 'success'
      case 'completed': return 'success'
      case 'cancelled': return 'danger'
      default: return ''
    }
  })
  
  const paymentColor = computed(() => {
    switch (props.order.paymentStatus) {
      case 'paid': return 'success'
      case 'unpaid': return 'warning'
      case 'refunded': return 'info'
      default: return ''
    }
  })
  
  const formatDate = (date: string) => new Date(date).toLocaleString()
  </script>
  
  <style scoped>
  .order-card {
    padding: 16px;
    border-radius: 12px;
    transition: 0.2s ease;
  }
  
  .order-card:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
  </style>
  