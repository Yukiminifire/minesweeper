import { createRouter, createWebHistory } from 'vue-router'
import { useInfo } from './userInfo'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./Home.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./Login.vue'),
    },
  ],
})

function calcuWay() {
  if (useInfo.value.name) {
    return 'home'
  } else {
    return 'login'
  }
}

router.beforeEach(async (to, from, next) => {
  const way = calcuWay()
  switch (way) {
    case 'login':
      if (to.name === 'login') {
        next()
      } else {
        next({
          path: '/login',
        })
      }
      break
    case 'home':
      if (to.name === 'home') {
        next()
      } else {
        next({
          path: '/home',
        })
      }
      break

    default:
      console.error('error')
      break
  }
})
