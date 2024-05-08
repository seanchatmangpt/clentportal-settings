import config from '@/config'
import { logoutUser } from '@/util/logout'
import { getToken } from '@gohighlevel/clientportal-core'
import axios from 'axios'
import 'firebase/auth'
const wait = (ms: number) => new Promise(res => setTimeout(res, ms))

const getHeader = () => {
  const headers = {
    channel: 'APP',
    source: 'PORTAL_USER',
    version: '2023-02-21',
  }
  return headers
}
declare global {
  interface Window {
    $cookies: any
  }
}

export const requests = (host?: string) => {
  const baseUrl = host || config.REST_API_URLS
  const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: getHeader(),
  })

  axiosInstance.interceptors.request.use(async (requestConfig: any) => {
    try {
      if (requestConfig && requestConfig.headers) {
        const keyToken = await getToken()
        if (keyToken) {
          requestConfig.headers['token-id'] = keyToken
        }
      }
    } catch (e) {
      console.error(e)
    }
    return requestConfig
  })
  axiosInstance.interceptors.response.use(
    function handleSuccess(res) {
      return res
    },
    async function handleError(error) {
      if (error.config && error.response && error.response.status === 401) {
        await logoutUser()
      }

      return Promise.reject(error)
    }
  )
  return axiosInstance
}
