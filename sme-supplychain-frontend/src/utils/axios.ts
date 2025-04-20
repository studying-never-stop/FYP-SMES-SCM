// src/utils/axios.ts
import axios from 'axios'

// 创建 axios 实例
const instance = axios.create({
  baseURL: 'http://localhost:3000', // 你的 NestJS 后端地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器：加 token（如果你使用了 JWT）
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：处理错误
instance.interceptors.response.use(
  response => response.data,
  error => {
    console.error('[Axios Error]', error)
    return Promise.reject(error)
  }
)

export default instance
