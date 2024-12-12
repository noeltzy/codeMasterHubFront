import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/utils/auth'
import HomeView from '../views/home/index.vue'
import courseRoutes from './modules/course'
import userRoutes from './modules/user'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            requiresAuth: true,
            nav: {
                title: '主页',
                icon: 'House',
                order: 1
            }
        }
    },
    ...courseRoutes,
    ...userRoutes,
    {
        path: '/tutorial',
        name: 'tutorial',
        component: () => import('../views/tutorial/index.vue'),
        meta: {
            requiresAuth: true,
            nav: {
                title: '教程',
                icon: 'Document',
                order: 3
            }
        }
    },
    {
        path: '/qa',
        name: 'qa',
        component: () => import('../views/qa/index.vue'),
        meta: {
            requiresAuth: true,
            nav: {
                title: '问答',
                icon: 'QuestionFilled',
                order: 4
            }
        }
    },
    {
        path: '/job',
        name: 'job',
        component: () => import('../views/job/index.vue'),
        meta: {
            requiresAuth: true,
            nav: {
                title: '求职',
                icon: 'Briefcase',
                order: 5
            }
        }
    },
    {
        path: '/live',
        name: 'live',
        component: () => import('../views/live/index.vue'),
        meta: {
            requiresAuth: true,
            nav: {
                title: '直播',
                icon: 'VideoCamera',
                order: 6
            }
        }
    },
    {
        path: '/dict',
        name: 'dict',
        component: () => import('../views/dict/index.vue'),
        meta: {
            requiresAuth: true,
            nav: {
                title: '词典',
                icon: 'Collection',
                order: 7
            }
        }
    },
    {
        path: '/news',
        name: 'news',
        component: () => import('../views/news/index.vue'),
        meta: {
            requiresAuth: true,
            nav: {
                title: '资讯',
                icon: 'Bell',
                order: 8
            }
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notFound',
        component: () => import('../views/error/404.vue'),
        meta: {
            hideNav: true,
            hideHeader: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !auth.isAuthenticated()) {
        next('/login')
    } else {
        next()
    }
})

export default router 