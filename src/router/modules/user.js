import { ROUTE_NAMES } from '@/config/constants'

export default [
  {
    path: '/login',
    name: ROUTE_NAMES.LOGIN,
    component: () => import('@/views/user/login.vue'),
    meta: {
      hideHeader: true
    }
  },
  {
    path: '/profile',
    name: ROUTE_NAMES.PROFILE,
    component: () => import('@/views/user/profile.vue'),
    meta: {
      requiresAuth: true,
      hideNav: true
    }
  }
] 