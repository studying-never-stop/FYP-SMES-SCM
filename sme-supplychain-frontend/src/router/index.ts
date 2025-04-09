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

const routes = [
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'inventory', name: 'Inventory', component: Inventory},
      { path: '/inventory/products', name: 'Products', component: Products},
      { path: '/inventory/categories', name: 'Categories', component: Categories},
      { path: 'orders', name: 'Orders', component: Orders },
      { path: '/orders/pending', name: 'Pending', component: PendingOrders },
      { path: '/orders/completed', name: 'Completed', component: CompletedOrders },
      { path: 'suppliers', name: 'Suppliers', component: Suppliers },
      { path: 'analytics', name: 'Analytics', component: Analytics },
      { path: 'settings', name: 'Settings', component: Settings },
      { path: 'report-ai', name: 'ReportAI', component: ReportAI },
    ]
  },
  { path: '/login', name: 'Login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
