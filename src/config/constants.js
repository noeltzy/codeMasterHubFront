// API 基础配置
export const API_BASE_URL = 'http://localhost:9901/api'

// 路由配置
export const ROUTE_NAMES = {
  HOME: 'home',
  LOGIN: 'login',
  STUDY: 'study',
  COURSE_DETAIL: 'courseDetail',
  PROFILE: 'profile'
}

// 导航配置
export const NAV_ITEMS = [
  { title: '主页', icon: 'House', order: 1 },
  { title: '学习', icon: 'Reading', order: 2 },
  { title: '教程', icon: 'Document', order: 3 },
  { title: '问答', icon: 'QuestionFilled', order: 4 },
  { title: '求职', icon: 'Briefcase', order: 5 },
  { title: '直播', icon: 'VideoCamera', order: 6 },
  { title: '词典', icon: 'Collection', order: 7 },
  { title: '资讯', icon: 'Bell', order: 8 }
]

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER_INFO: 'userInfo',
  IS_LOGGED_IN: 'isLoggedIn'
}

// 响应状态码
export const RESPONSE_CODE = {
  SUCCESS: 0,
  ERROR: 1,
  UNAUTHORIZED: 401
} 