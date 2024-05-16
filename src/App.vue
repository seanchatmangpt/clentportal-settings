<script setup lang="ts">
import {
  createElement,
  sanitizeJavaScriptCode
} from '@/helper'
import { UserService } from '@/service/UserService'
import {
  AppLoader,
  BottomNavBar,
  enableAnalytics,
  isAppLoading,
  isMobileOs,
  isPwa,
  setAppLoading
} from '@gohighlevel/clientportal-core'
import { UIContentWrap } from '@gohighlevel/ghl-ui'
import { useFavicon } from '@vueuse/core'
import Cookies from 'js-cookie'
import postscribe from 'postscribe'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { navigation } from './composition/Navigation'
import config from './config'
import { certificatesRoutes, nonProtectedRoutes } from './router'
import initializeServices from './service'
import { useAppStore } from './store/app'
import { updateScreenSize } from './util/dashboard.helper'

declare const window: Window & {
  webkit?: any
}

const store = useAppStore()
const router = useRouter()
const route = useRoute()
const currentFavicon = useFavicon()
const isWideScreen = ref(window.innerWidth > 768) // Adjust the width as needed
const cookie = ref()
const page: any = JSON.parse(localStorage.getItem('event') as any)
// NOTE: For Localhost please set a query param domain
// EXAMPLE  http://localhost:3030/login?domain=jvfixsmy19d94nosioeo.staging.clientclub.net
onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const redirectUrl = urlParams.get('redirectUrl')

  if (isMobileOs()) {
    // Select the body element
    var bodyElement = document.body
    // Apply user-select: none; to the body
    bodyElement.style.userSelect = 'none'

    // If the screen is considered mobile, apply the viewport meta tag to prevent zooming
    var viewportMeta = document.createElement('meta')
    viewportMeta.name = 'viewport'
    viewportMeta.content =
      'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
    document.head.appendChild(viewportMeta)
  }

  if (redirectUrl) {
    store.setRedirectUrl(redirectUrl)
  }
  // Certificates are accessible on public routes, so there's no requirement for authentication.
  if (window.location.hostname.includes(config.certificatesRegistryDomain)) {
    setAppLoading(false)
    return
  }
  window.addEventListener('resize', () => updateScreenSize(isWideScreen))
  cookie.value = await Cookies.get('cat')
  await getBrandingAndUserDetails()
})

const initiateCustomTags = data => {
  const cpCustomCss = createElement(
    'style',
    [
      { type: 'type', value: 'text/css' },
      { type: 'vmid', value: 'client-portal-custom-css' },
    ],
    data?.customCss
  )
  const cpCustomJs = createElement(
    'script',
    [
      { type: 'type', value: 'text/javascript' },
      { type: 'vmid', value: 'client-portal-custom-js' },
    ],
    sanitizeJavaScriptCode(data?.customJs || '')
  )
  document.head.appendChild(cpCustomJs)
  document.head.appendChild(cpCustomCss)
  if (data.headerCode) {
    postscribe(
      `#clientportal-siteCustomHeader`,
      createElement('script', [], data.headerCode).outerHTML
    )
  }
  if (data.footerCode) {
    postscribe(
      `#clientportal-siteCustomFooter`,
      createElement('script', [], data.footerCode).outerHTML
    )
  }
}

const getBrandingAndUserDetails = async () => {
  try {
    let domain: string = page?.domain || window.location.hostname

    if (domain === 'localhost') {
      const urlParams = new URLSearchParams(window.location.search)
      const domainname = urlParams.get('domain')
      domain = domainname || (config.domain as string)
    }

    if (!domain)
      throw Error('Domain not found, please setup in config for local setup')

    await UserService.portalSetting(domain)
      .then(({ data }) => {
        if (data.branding?.favicon) {
          currentFavicon.value = data.branding?.favicon
        }
        if (data?.portalBannerText) {
          window.document.title = data?.portalBannerText
        }
        initializeServices(data.locationId)
        store.setBrandingValue({
          brandColor1: data?.branding?.brandColor1 || null,
          brandColor2: data?.branding?.brandColor2 || null,
          portalBannerText: data?.portalBannerText || null,
          portalDescription: data?.portalDescription || null,
          portalIcon: data?.branding?.logo,
          favicon: data?.branding?.favicon,
          copyRight: data?.copyRight,
          supportEmail: data?.supportEmail,
          locationId: data.locationId,
          portalBackgroundImage: data?.branding?.portalImage || null,
          portalBannerImage: data?.branding.bannerImage || null,
          logo: data?.branding.logo || null,
          customJs: data.customJs,
          customCss: data.customCss,
          headerCode: data.headerCode,
          footerCode: data.footerCode,
        })
        !isPwa() && initiateCustomTags(data)
        store.setPermissions(data)
      })
      .catch(err => {
        console.error(err)
        setAppLoading(false)
        router.push({ name: 'notFound' })
      })
    const cookie = await Cookies.get('cat')
    //TODO: fix below issue/Commented due to delay in loading userdetails on accounts and nav bar , maybe store issue
    // //Fetch user details if user is loggedIn
    if (cookie) {
      const cat = cookie || window.localStorage.getItem('cat')
      const cookieData = cat ? JSON.parse(window.atob(cat)) : null
      const userData = await UserService.fetchUserDetails({
        userId: cookieData.contactId,
        locationId: cookieData.locationId,
      })
      enableAnalytics(cookieData.contactId)
      store.setProfileDetails({
        ...userData.data,
      })
    }


    //Redirection should happen only when user is logged in and he is trying to access login or signup page
    if (
      cookie &&
      nonProtectedRoutes.includes(route?.name?.toString() || route.path) &&
      !certificatesRoutes.includes(route?.name?.toString() || route.path)
    ) {
      const userData = JSON.parse(window.atob(cookie))
      window.open(store.redirectUrl || userData.redirectUrl, '_self')
      return
    } else {
      //Redirection to Login Page should happen only when user is not logged in and he is trying to access any page other than login or signup page
      if (
        (!Cookies.get('cat') &&
          route?.name &&
          !nonProtectedRoutes.includes(route?.name?.toString())) ||
        route.path === '/'
      ) {
        
        if (!store.locationId) {
          router.push({ name: 'notFound' })
        } else if (!route.query?.email || !route.query?.loginCode) {
          router.push({ name: 'Login' })
        }
      }
      if (route?.name === 'notFound' && store?.locationId) {
        router.push({ name: 'Login' })
      }
      setAppLoading(false)
    }
  } catch (error: any) { 
    setAppLoading(false)
    if (!store.locationId) {
      router.push({ name: 'notFound' })
    } else {
      router.push({ name: 'Login' })
    }
  }
}
</script>

<template>
  <div>
  test
  </div>
</template>

<style scoped>
.page {
  color: #465567;
}
.hl-wrapper-container {
  padding: 0px 0px !important;
}
.n-config-provider {
  width: 100% !important;
}
</style>
