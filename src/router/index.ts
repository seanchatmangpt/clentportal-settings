import AccountSetting from '@/pages/AccountSetting.vue'

import Cookies from 'js-cookie'
import {
  handleLoginWithLoginCode,
  handleLoginWithSessionKey,
} from './router.helper'

export const nonProtectedRoutes = [
  'Login',
  'LoginBase',
]

export const certificatesRoutes = [
  'CertificatesPreview',
  'CertificatesTemplate',
]


import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

// please add name props for the routes for route protection to work
const routes: Readonly<RouteRecordRaw[]> = [

  {
    // profile setting
    path: '/account',
    name: 'AccountSetting',
    component: AccountSetting,
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
router.beforeEach(async (to, from) => {
  const data = Cookies.get('cat')
  if (to.query.sessionKey) {
    handleLoginWithSessionKey(to, router)
  } else if (to.query.loginCode && to.query.email) {
    await handleLoginWithLoginCode(to, router)
  } else if (
    // check if user auth from cookies data set during login
    !data &&
    to.name &&
    !nonProtectedRoutes.includes(to.name.toString())
  ) {
    // redirect the user to the login page
    router.push({ name: 'Login' })
  }
})

export { router }
