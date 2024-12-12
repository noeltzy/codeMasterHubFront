import { STORAGE_KEYS } from '../config/constants'

export const auth = {
  isAuthenticated() {
    return !!localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN)
  },

  setAuthenticated(status) {
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, status)
  },

  getUserInfo() {
    const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO)
    return userInfo ? JSON.parse(userInfo) : null
  },

  setUserInfo(userInfo) {
    localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo))
  },

  clearAuth() {
    localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN)
    localStorage.removeItem(STORAGE_KEYS.USER_INFO)
  }
} 