import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import AuthLayout from '../layouts/AuthLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import UsersView from '../views/UsersView.vue'
import ReportView from '../views/ReportView.vue'
import ProfileView from '../views/ProfileView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: AuthLayout,
      meta: { requiresGuest: true },
      children: [
        {
          path: '',
          name: 'login',
          component: LoginView
        }
      ]
    },

    {
      path: '/',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView
        },

        {
          path: 'users',
          name: 'users',
          component: UsersView
        },

        {
          path: 'reports',
          name: 'reports',
          component: ReportView
        },

        {
          path: 'profile',
          name: 'profile',
          component: ProfileView
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
