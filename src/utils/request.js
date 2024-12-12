import router from '../router'
import { ElMessage } from 'element-plus'

const BASE_URL = 'http://localhost:9901/api'

// 创建请求工具
export const request = async (url, options = {}) => {
  // 确保 options.credentials 为 'include'
  options.credentials = 'include'
  
  try {
    const response = await fetch(`${BASE_URL}${url}`, options)
    const data = await response.json()
    
    // 统一处理未登录情况
    if (data.code === 40100) {
      // 清除登录状态
      localStorage.removeItem('isLoggedIn')
      // 显示提示
      ElMessage.warning('登录已过期，请重新登录')
      // 跳转到登录页
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
      message: data.message
    }
  } catch (error) {
    console.error('请求错误:', error)
    return {
      success: false,
      message: '网络错误，请稍后重试'
    }
  }
} 