import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StudyView from '../views/StudyView.vue'
import TutorialView from '../views/TutorialView.vue'
import QAView from '../views/QAView.vue'
import JobView from '../views/JobView.vue'
import LiveView from '../views/LiveView.vue'
import DictView from '../views/DictView.vue'
import NewsView from '../views/NewsView.vue'
import ProfileView from '../views/ProfileView.vue'

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/LoginView.vue'),
        meta: {
            hideHeader: true
        }
    },
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
    {
        path: '/study',
        name: 'study',
        component: StudyView,
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
        path: '/tutorial',
        name: 'tutorial',
        component: TutorialView,
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
        component: QAView,
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
        component: JobView,
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
        component: LiveView,
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
        component: DictView,
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
        component: NewsView,
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
        path: '/profile',
        name: 'profile',
        component: ProfileView,
        meta: {
            requiresAuth: true,
            hideNav: true
        }
    },
    {
        path: '/course/:id',
        name: 'courseDetail',
        component: () => import('../views/CourseDetailView.vue'),
        meta: {
            requiresAuth: true,
            hideNav: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('isLoggedIn')

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login')
    } else {
        next()
    }
})

export default router 