<template>
    <!-- 卡片组件 -->
    <el-card
      class="supplier-card hover:shadow-md transition cursor-pointer"
      @click="goToCompanyDetail"
      body-style="padding: 12px 20px"
    >
      <!-- 横向排列所有信息 -->
      <div class="flex items-center gap-6 whitespace-nowrap overflow-x-auto">
        <!-- 公司 LOGO -->
        <img
          :src="company.logoUrl"
          alt="Logo"
          class="w-16 h-16 object-cover rounded"
        />
  
        <!-- 公司名称 -->
        <div class="font-bold text-base min-w-[150px]">{{ company.name }}</div>
  
        <!-- 所属行业 -->
        <div class="text-gray-600 min-w-[120px]">
          Industry: {{ company.industry || 'N/A' }}
        </div>
  
        <!-- 联系人和电话 -->
        <div class="text-gray-600 min-w-[250px]">
          Contact: {{ company.contact }} ｜ {{ company.phone }}
        </div>
  
        <!-- 公司地址 -->
        <div class="text-gray-600 min-w-[300px]">
          Address: {{ company.address }}
        </div>
  
        <!-- 产品名称（限制为 1 行） -->
        <div class="text-gray-600 min-w-[280px] truncate-products">
          Products:
          <span v-if="company.products?.length">{{ productNames }}</span>
          <span v-else>N/A</span>
        </div>
      </div>
    </el-card>
  </template>
  
  <script setup lang="ts">
  import { defineProps } from 'vue'
  import { useRouter } from 'vue-router'
  
  const props = defineProps<{ company: any }>()
  const router = useRouter()
  
  // 提取前 3 个产品名，拼接为字符串
  const productNames = props.company.products
    .slice(0, 3)
    .map((p: any) => p.name)
    .join(', ')
  
  // 点击卡片跳转至公司详情页
  const goToCompanyDetail = () => {
    router.push(`/suppliers/${props.company.id}`)
  }
  </script>
  
  <style scoped>
  .supplier-card {
    margin-bottom: 12px;
  }
  
  /* 限制产品名称为一行，超出显示省略号 */
  .truncate-products {
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  </style>
  