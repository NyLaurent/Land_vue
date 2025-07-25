import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/my-land',
    },
    {
      path: '/my-land',
      name: 'my-land',
      component: () => import('../views/MyLandView.vue'),
    },
    {
      path: '/transfers',
      name: 'transfers',
      // Lazy load this component
      component: () => import('../views/TransfersView.vue'),
    },
    {
      path: '/map',
      name: 'map',
      // Lazy load this component
      component: () => import('../views/MapView.vue'),
    },
  ],
})

export default router
