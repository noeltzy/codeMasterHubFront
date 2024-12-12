import router from '../router'
import { ElMessage } from 'element-plus'
import { auth } from './auth'

const BASE_URL = 'http://localhost:9901/api'

// 创建请求工具
export const request = async (url, options = {}) => {
  // 设置跨域请求携带 cookie
  options.credentials = 'include'
  
  // 设置默认 headers
  options.headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  try {
    const response = await fetch(`${BASE_URL}${url}`, options)
    
    // 如果响应状态不是 2xx，抛出错误
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // 处理未登录情况
    if (data.code === 401) {
      auth.clearAuth()
      ElMessage.warning('登录已过期，请重新登录')
      router.push('/login')
      return {
        success: false,
        message: '未登录'
      }
    }
    
    // 统一处理返回格式
    return {
      success: data.code === 0,
      data: data.data,
      message: data.message || '操作失败'
    }
  } catch (error) {
    console.error('请求错误:', error)
    return {
      success: false,
      message: '网络错误，请稍后重试'
    }
  }
} 