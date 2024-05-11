import en from '@/locales/en.json'
import {
  SwipeDirective,
  initializeApp,
  isPwa,
  isWebKit,
} from '@gohighlevel/clientportal-core'
import '@gohighlevel/clientportal-core/dist/style.css'
import '@gohighlevel/ghl-ui/dist/style.css'
import Cookies from 'js-cookie'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import VueGtag from 'vue-gtag'
import { createI18n } from 'vue-i18n'
import VOtpInput from 'vue3-otp-input'
import App from './App.vue'
import { downloadApp } from './helper/downloadApp'
import { router } from './router'
import './style.css'
export const i18n = createI18n({
  locale: 'en',
  globalInjection: true,
  legacy: false,
  runtimeOnly: true,
  messages: {
    en,
  },
})
;(async () => {
  const cookie = await Cookies.get('cat')
  const cat = cookie || window.localStorage.getItem('cat')
  const cookieData = cat ? JSON.parse(window.atob(cat)) : null
  if (
    isPwa() &&
    cookieData?.redirectUrl &&
    !cookieData.redirectUrl.includes('home') &&
    !cookieData.redirectUrl.includes('affiliate')
  ) {
    window.open(cookieData.redirectUrl, '_self')
  }
  await initializeApp(process.env.NODE_ENV, router)
  const app = createApp(App)

  app.use(createPinia())
  app.use(VueGtag, { bootstrap: false }, router)
  app.use(i18n)
  app.use(router)
  app.directive('swipe', SwipeDirective)
  app.component('v-otp-input', VOtpInput)
  app.mount('#app')

})()
