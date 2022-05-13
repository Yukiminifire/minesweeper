import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'HomeVue',
      component: () => import('./Home.vue'),
    },
    {
      path: '/Login',
      name: 'Login',
      component: () => import('./Login.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.path !== '/login') {
    next({
      path: '/login',
    })
  } else {
    next()
  }
})
