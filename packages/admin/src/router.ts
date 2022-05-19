import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
} from 'vue-router'
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

    {
      path: '/ranklist',
      component: () => import('./RankList.vue'),
    },
  ],
})

function calcuWay(to: RouteLocationNormalized) {
  if (!useInfo.value.name) {
    return 'login'
  } else {
    return to
  }
}

router.beforeEach(async (to, from, next) => {
  const way = calcuWay(to)
  if (way === to) {
    next()
    return
  }
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
          path: '/',
        })
      }
      break

    default:
      console.error('error')
      break
  }
})
