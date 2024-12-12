import { ROUTE_NAMES } from '@/config/constants'
import CourseList from '@/views/course/list.vue'
import CourseDetail from '@/views/course/detail.vue'

export default [
  {
    path: '/study',
    name: ROUTE_NAMES.STUDY,
    component: CourseList,
    meta: {
      requiresAuth: true,
      nav: {
        title: '学习',
        icon: 'Reading',
        order: 2
      }
    }
  },
  {
    path: '/course/:id',
    name: ROUTE_NAMES.COURSE_DETAIL,
    component: CourseDetail,
    meta: {
      requiresAuth: true,
      hideNav: true
    }
  }
] 