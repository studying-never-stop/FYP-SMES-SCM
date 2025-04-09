<template>
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">📂 Category Management</h2>
  
      <!-- 添加按钮 -->
      <el-button type="primary" @click="openCreateDialog">➕ Add Category</el-button>
  
      <!-- 分类表格 -->
      <el-table :data="categories" style="width: 100%" class="mt-4" border>
        <el-table-column prop="name" label="Category Name" />
        <el-table-column label="Actions" width="160">
          <template #default="scope">
            <el-button size="small" type="primary" @click="openEditDialog(scope.row)">Edit</el-button>
            <el-popconfirm
              title="Are you sure to delete this category?"
              @confirm="deleteCategory(scope.row.id)"
              confirm-button-text="Yes"
              cancel-button-text="No"
            >
              <template #reference>
                <el-button size="small" type="danger">Delete</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 添加 / 编辑分类弹窗 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogMode === 'edit' ? 'Edit Category' : 'Add New Category'"
        width="400px"
      >
        <el-form :model="form" :rules="rules" ref="formRef" label-width="120px">
          <el-form-item label="Category Name" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-form>
  
        <template #footer>
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="handleSubmit">Confirm</el-button>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive } from 'vue'
  import type { FormInstance, FormRules } from 'element-plus'
  
  // 分类类型
  interface Category {
    id: number
    name: string
  }
  
  // 本地 mock 数据
  const categories = ref<Category[]>([
    { id: 1, name: 'Electronics' },
    { id: 2, name: 'Furniture' },
    { id: 3, name: 'Office' },
    { id: 4, name: 'Clothing' }
  ])
  
  // 弹窗控制与表单数据
  const dialogVisible = ref(false)
  const dialogMode = ref<'create' | 'edit'>('create')
  const formRef = ref<FormInstance>()
  
  const form = reactive<Category>({
    id: -1,
    name: ''
  })
  
  const rules: FormRules = {
    name: [{ required: true, message: 'Category name is required', trigger: 'blur' }]
  }
  
  // 打开新增弹窗
  const openCreateDialog = () => {
    dialogMode.value = 'create'
    form.name = ''
    form.id = -1
    dialogVisible.value = true
  }
  
  // 打开编辑弹窗
  const openEditDialog = (category: Category) => {
    dialogMode.value = 'edit'
    form.name = category.name
    form.id = category.id
    dialogVisible.value = true
  }
  
  // 提交表单处理
  const handleSubmit = () => {
    formRef.value?.validate((valid) => {
      if (!valid) return
  
      if (dialogMode.value === 'create') {
        const newId = Math.max(...categories.value.map(c => c.id)) + 1
        categories.value.push({ id: newId, name: form.name })
      } else {
        const index = categories.value.findIndex(c => c.id === form.id)
        if (index !== -1) {
          categories.value[index].name = form.name
        }
      }
  
      dialogVisible.value = false
    })
  }
  
  // 删除分类
  const deleteCategory = (id: number) => {
    categories.value = categories.value.filter(c => c.id !== id)
  }
  </script>
  