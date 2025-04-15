import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layout/MainLayout.vue'
import Login from '@/views/Login.vue'
import Dashboard from '@/views/Dashboard.vue'
import Inventory from '@/views/Inventory.vue'
import Orders from '@/views/Orders.vue'
import Suppliers from '@/views/Suppliers.vue'
import Analytics from '@/views/Analytics.vue'
import Settings from '@/views/Settings.vue'
import ReportAI from '@/views/ReportAI.vue'
import Categories from '@/views/Categories.vue'
import Products from '@/views/Products.vue'
import PendingOrders from '@/views/PendingOrders.vue'
import CompletedOrders from '@/views/CompletedOrders.vue'
import Campany from '@/views/Campany.vue'
import { ElMessage } from 'element-plus'
import User from '@/views/User.vue'
import AdminProducts from '@/views/AdminProducts.vue'
import InventoryList from '@/views/InventoryList.vue'
import MyOrders from '@/views/MyOrders.vue'
import OrderDetail from '@/views/OrderDetail.vue'
import OrderRecord from '@/views/OrderRecord.vue'
import CompanyDetail from '@/views/CompanyDetail.vue'
import StockManager from '@/views/StockManager.vue'
import StockRecord from '@/views/StockRecord.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'inventory', name: 'Inventory', component: Inventory },
      { path: 'inventory/products', name: 'Products', component: Products },
      { path: 'inventory/categories', name: 'Categories', component: Categories },
      { path: 'inventory/inventoryList', name: 'InventoryList', component: InventoryList},
      { path: 'inventory/stockManagement', name: 'StockManagement', component: StockManager},
      { path: 'inventory/stockRecord', name: 'StockRecord', component: StockRecord},      
      { path: 'orders', name: 'Orders', component: Orders },
      { path: 'orders/pending', name: 'PendingOrders', component: PendingOrders },
      { path: 'orders/completed', name: 'CompletedOrders', component: CompletedOrders },
      { path: 'orders/myOrder', name: 'MyOrders', component: MyOrders },
      { path: 'orders/orderRecord', name: 'OrdersRecord', component: OrderRecord },
      { path: 'orders/:id', name: 'OrderDetail', component: OrderDetail, props: true, },// 动态路由：订单详情 props: true,将 route.params 作为 props 传递
      { path: 'suppliers', name: 'Suppliers', component: Suppliers },
      { path: 'suppliers/:id', name: 'CompanyDetail', component: CompanyDetail },
      { path: 'analytics', name: 'Analytics', component: Analytics },
      { path: 'settings', name: 'Settings', component: Settings },
      { path: 'report-ai', name: 'ReportAI', component: ReportAI },
      {
        path: 'admin',
        meta: { requiresAuth: true, requiresRole: 'superadmin' },
        children: [
          {
            path: 'users',
            name: 'AdminUsers',
            component: User
          },
          {
            path: 'companies',
            name: 'AdminCompanies',
            component: Campany
          },
          {
            path: 'products',
            name: 'AdminProducts',
            component: AdminProducts
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

//  封装登录状态判断函数
function isLoggedIn(): boolean {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  return !!token && !!user
}

//  全局路由守卫
router.beforeEach((to, from, next) => {
  const loggedIn = isLoggedIn()

  // 如果已登录但尝试访问登录页 → 跳转 Dashboard
  if (to.path === '/login' && loggedIn) {
    return next('/dashboard')
  }

  // 如果访问需要登录的页面但未登录 → 强制跳转登录页
  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    ElMessage.warning('Please log in first.')
    return next('/login')
  }

  // 其他情况放行
  next()
})

export default router
