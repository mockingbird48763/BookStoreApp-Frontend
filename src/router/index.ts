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
      ],
    },
    {
      path: '/admin',
      component: BackLayout,
      meta: { requiresAdmin: true },
      children: [
        {
          path: '',
          component: () => import('@/views/back/DashBoardView.vue'),
          name: RouteNames.DASH_BOARD,
        },
      ],
    },
  ],
})

export default router
