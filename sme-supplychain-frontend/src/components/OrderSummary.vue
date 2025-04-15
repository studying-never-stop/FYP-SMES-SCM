<template>
    <div class="border rounded-xl p-4 shadow-sm w-full">
      <h3 class="text-lg font-semibold mb-4">Order Summary</h3>
  
      <div class="text-sm text-gray-700 space-y-2">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>€{{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Shipping</span>
          <span>€{{ shipping.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between">
          <span>Tax</span>
          <span>€{{ tax.toFixed(2) }}</span>
        </div>
        <hr />
        <div class="flex justify-between font-semibold text-base mt-2">
          <span>Total</span>
          <span>€{{ total.toFixed(2) }}</span>
        </div>
        <div class="mt-2 text-sm">
          <span class="font-medium">Payment Status:</span>
          <el-tag
            :type="paymentStatus === 'paid' ? 'success' : paymentStatus === 'unpaid' ? 'warning' : 'info'"
            class="ml-2"
          >
            {{ paymentStatus }}
          </el-tag>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  
  interface Props {
    subtotal: number
    shipping: number
    tax: number
    paymentStatus: 'paid' | 'unpaid' | 'refunded'
  }
  
  const props = defineProps<Props>()
  
  const total = computed(() => props.subtotal + props.shipping + props.tax)
  </script>
  
  <style scoped>
  </style>
  