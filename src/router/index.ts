import { createRouter, createWebHistory } from 'vue-router'
import FrontLayout from '@/layouts/FrontLayout.vue'
import BackLayout from '@/layouts/BackLayout.vue'
import { RouteNames } from './const'
import { UserRole } from '@/constants'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: FrontLayout,
      children: [
        { path: '', component: () => import('@/views/front/HomeView.vue'), name: RouteNames.HOME },
        {
          path: 'books/:id',
          component: () => import('@/views/front/BookDetailView.vue'),
          name: RouteNames.BOOK_DETAIL,
          // 這樣可以把 id，自動當作 props 傳進 component
          props: true,
          meta: { requiredRoles: [] },
        },
        {
          path: 'cart',
          component: () => import('@/views/front/CartView.vue'),
          name: RouteNames.CART,
          meta: { requiredRoles: [UserRole.USER] },
        },
        {
          path: 'login',
          component: () => import('@/views/front/LoginView.vue'),
          name: RouteNames.LOGIN,
          meta: { requiredRoles: [] },
        },
        {
          path: 'orders',
          component: () => import('@/views/front/OrdersView.vue'),
          name: RouteNames.ORDERS,
          meta: { requiredRoles: [UserRole.USER] },
        },
        {
          // 多餘的路由
          path: 'orders/:id',
          component: () => import('@/views/front/OrderDetailView.vue'),
          name: RouteNames.ORDER_DETAIL,
          props: true,
          meta: { requiredRoles: [UserRole.USER] },
        },
        {
          path: '/404',
          name: RouteNames.NOT_FOUND,
          component: () => import('@/views/NotFound.vue'),
        },
        {
          path: '/:pathMatch(.*)*',
          redirect: '/404',
        },
      ],
    },
    {
      path: '/dashboard',
      component: BackLayout,
      meta: { requiresAdmin: true },
      redirect: { name: RouteNames.BOOK_MANAGEMENT },
      children: [
        // {
        //   path: '',
        //   component: () => import('@/views/back/DashBoardView.vue'),
        //   name: RouteNames.DASH_BOARD,
        // },
        {
          path: 'books',
          component: () => import('@/views/back/BookManagementView.vue'),
          name: RouteNames.BOOK_MANAGEMENT,
          meta: { requiredRoles: [UserRole.ADMIN] },
        },
        {
          path: 'orders',
          component: () => import('@/views/back/OrderManagementView.vue'),
          name: RouteNames.ORDER_MANAGEMENT,
          meta: { requiredRoles: [UserRole.ADMIN] },
        },
      ],
    },
  ],
})

// 設置 router 守衛
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const requiredRoles = to.meta.requiredRoles as string[] | undefined

  // 注意順序，是有差別的
  // 如果已經登入並嘗試訪問 login 頁面，直接跳到首頁或其他頁面
  if (authStore.isLoggedIn && to.path === '/login') {
    // 重定向頁首
    return next('/')
  }

  if (requiredRoles && requiredRoles.length === 0) {
    return next()
  }

  // 如果沒登入，且頁面需要權限，導去 login（避免無限跳轉）
  if (!authStore.isLoggedIn && requiredRoles) {
    if (to.path !== '/login') {
      return next('/login')
    } else {
      return next() // 已經在 login 頁面，不再重導
    }
  }

  // 如果有登入但沒權限
  if (requiredRoles && !authStore.hasRole(requiredRoles)) {
    return next('/404')
  }

  next()
})

export default router
