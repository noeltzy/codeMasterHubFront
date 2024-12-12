import { request } from '../../utils/request'

export const userApi = {
  // 获取验证码
  async getVerificationCode(phone) {
    return request(`/user/code?phone=${phone}`)
  },

  // 用户登录
  async login(phone, code) {
    return request('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone, code })
    })
  },

  // 退出登录
  async logout() {
    return request('/user/logout', {
      method: 'POST'
    })
  },

  // 获取当前用户信息
  async getCurrentUser() {
    return request('/user/current')
  },

  // 更新用户信息
  async updateUserInfo(data) {
    return request('/user/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
  },

  // 上传头像
  async uploadAvatar(file) {
    const formData = new FormData()
    formData.append('file', file)

    return request('/upload/avatar', {
      method: 'POST',
      body: formData
    })
  }
} 