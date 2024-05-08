import { getQueryString, postLogin } from '@/helper'
import { UserService } from '@/service'
import { useAppStore } from '@/store/app'
export async function handleLoginWithLoginCode(to, router) {
  const store = useAppStore()
  try {
    const email = getQueryString(window.location.search, 'email')
    const urlParams = new URLSearchParams(window.location.search)
    const redirectUrl = urlParams.get('redirectUrl')
    if (redirectUrl) {
      store.setRedirectUrl(redirectUrl)
    }
    const { data } = await UserService.loginWithLoginCode({
      email,
      loginCode: to.query.loginCode,
      locationId: store.locationId,
      domainName: to.query.domain || window.location.hostname,
    })
    if (data.token) {
      postLogin(data)
    }
  } catch (e) {
    console.error('Error ---->', e)
    router.push({
      name: 'Login',
      query: {
        redirectUrl: to.query.redirectUrl,
      },
    })
  }
}

export async function handleLoginWithSessionKey(to, router) {
  const store = useAppStore()
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const redirectUrl = urlParams.get('redirectUrl')
    if (redirectUrl) {
      store.setRedirectUrl(redirectUrl)
    }
    const { data } = await UserService.loginWithSessionKey({
      sessionKey: to.query.sessionKey,
      locationId: store.locationId,
      domainName: to.query.domain || window.location.hostname,
    })
    if (data.token) {
      postLogin(data)
    }
  } catch (e) {
    console.error('Error ---->', e)
    router.push({
      name: 'Login',
      query: {
        redirectUrl: to.query.redirectUrl,
      },
    })
  }
}
