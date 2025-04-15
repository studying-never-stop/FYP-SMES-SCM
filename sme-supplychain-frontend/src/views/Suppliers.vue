<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">🔍 Supplier Search</h2>

    <!-- 搜索区域 -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <el-input v-model="keyword" placeholder="Search product keyword or category" clearable style="width: 240px" />
      <el-input v-model="industry" placeholder="Search industry (e.g. automotive)" clearable style="width: 240px" />
      <el-button type="primary" @click="fetchSuppliers">Search</el-button>
    </div>

    <!-- 公司卡片列表 -->
    <div class="grid grid-cols-1 gap-4">
      <CompanyCard
        v-for="company in paginatedSuppliers"
        :key="company.id"
        :company="company"
        @click="goToCompanyDetail(company.id)"
      />
    </div>

    <!-- 分页器 -->
    <div class="mt-6 text-right">
      <el-pagination
        v-if="suppliers.length > pageSize"
        layout="prev, pager, next"
        :total="suppliers.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        background
      />
    </div>

    <!-- 空状态 -->
    <el-empty v-if="suppliers.length === 0" description="No suppliers found" class="mt-10" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import CompanyCard from '@/components/CompanyCard.vue'

const router = useRouter()
const keyword = ref('')
const industry = ref('')
const suppliers = ref<any[]>([])
const currentPage = ref(1)
const pageSize = 6

// 当前页供应商数据
const paginatedSuppliers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return suppliers.value.slice(start, end)
})

// 查询供应商公司列表
const fetchSuppliers = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('/api/suppliers/search', {
      params: { keyword: keyword.value, industry: industry.value },
      headers: { Authorization: `Bearer ${token}` },
    })
    suppliers.value = res.data
    currentPage.value = 1 // 重置分页
  } catch (err) {
    ElMessage.error('Failed to fetch suppliers')
  }
}

// 页面加载时默认请求一次
onMounted(() => {
  fetchSuppliers()
})

// 行业字段变化时自动刷新（可选增强）
watch(industry, () => {
  if (!keyword.value) fetchSuppliers()
})

// 跳转到公司详情页
const goToCompanyDetail = (id: number) => {
  router.push(`/suppliers/${id}`)
}
</script>

<style scoped></style>
