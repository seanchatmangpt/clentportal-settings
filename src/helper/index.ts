import config from '@/config'
import { useAppStore } from '@/store/app'
import { externalPathRedirect } from '@/util/redirect'
import { enableAnalytics } from '@gohighlevel/clientportal-core'
import dayjs, { Dayjs } from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import Cookies from 'js-cookie'
import { router } from '../router'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(localizedFormat)

export function postLogin(data) {
  const store = useAppStore()
  Cookies.set('cat', window.btoa(JSON.stringify(data)), {
    expires: 31560000,
    sameSite: 'None',
    secure: true,
  })
  enableAnalytics(data.contactId)
  if (store.redirectUrl) {
    window.location.href = store.redirectUrl
  } else if (data.redirectUrl) {
    externalPathRedirect(data.redirectUrl, '')
  } else {
    router.push({ name: 'AccountSetting' })
  }
}

export function getQueryString(search, key) {
  const query = search.slice(search.indexOf('?') + 1, search.length)
  const queryArray = query.split('&')
  for (let i = 0; i < queryArray.length; i++) {
    const pair = queryArray[i].split('=')
    if (pair[0] === key) {
      return decodeURIComponent(pair[1])
    }
  }
  return null
}

export function addAllHtmlEle(this: any) {
  let result = ''
  this.forEach((ele: { outerHTML: string }) => {
    result += ele.outerHTML
  })
  return result
}

export function printCertificate({
  content,
  links,
  styles,
}: {
  content: string
  links: string
  styles: string
}) {
  const printWindow = window.open('', 'PRINT', '')
  printWindow?.document?.write('<html><head><title>Certificate</title>')
  printWindow?.document?.write(`${links}${styles}</head><body >`)
  printWindow?.document?.write(content)
  printWindow?.document?.write('</body></html>')
  printWindow?.document.close()
  setTimeout(() => {
    printWindow?.print()
    printWindow?.close()
  }, 10)
}

export function sanitizeJavaScriptCode(jsCode: string) {
  // Remove HTML tags and leading/trailing white spaces
  return jsCode.replace(/<\/?[^>]+(>|$)/g, '').trim()
}

export function getPreviewUrl(templateId: string): string {
  return `https://${config.certificatesRegistryDomain}/certificates/${templateId}`
}

export const convertDateToCurrentTimeZone = (
  newDate: Dayjs | number | string | Date,
  currentTimeZone?: string
) => {
  return dayjs(newDate)
    .tz(currentTimeZone || dayjs.tz.guess())
    .format('lll')
}
export function createElement(
  type: string,
  attributes: Array<any>,
  innerHTML = ''
) {
  const element = document.createElement(type)
  attributes.forEach((attr: { type: string; value: any }) => {
    element.setAttribute(attr.type, attr.value)
  })
  element.innerHTML = innerHTML
  return element
}
