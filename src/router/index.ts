import { createRouter, createWebHistory } from 'vue-router'
import FrontLayout from '@/layouts/FrontLayout.vue'
import BackLayout from '@/layouts/BackLayout.vue'
import { RouteNames } from './const'

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
        },
        {
          path: 'cart',
          component: () => import('@/views/front/CartView.vue'),
          name: RouteNames.CART,
        },
        {
          path: 'login',
          component: () => import('@/views/front/LoginView.vue'),
          name: RouteNames.LOGIN,
        },
        {
          path: 'orders',
          component: () => import('@/views/front/OrdersView.vue'),
          name: RouteNames.ORDERS,
        },
        {
          path: 'orders/:id',
          component: () => import('@/views/front/OrderDetailView.vue'),
          name: RouteNames.ORDER_DETAIL,
          props: true,
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
        },
        {
          path: 'orders',
          component: () => import('@/views/back/OrderManagementView.vue'),
          name: RouteNames.ORDER_MANAGEMENT,
        },
      ],
    },
  ],
})

export default router
