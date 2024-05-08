import axios from 'axios'
import config from '../config'

const responseBody = (res: any) => res.data

const DEFAULT_HEADERS: any = {
  channel: 'INTERNAL_API',
  source: 'PORTAL',
  'source-id': 'NA',
  version: '2023-02-21',
}

const requests = {
  get: (
    url: string,
    headers: { [key: string]: string },
    params?: { [key: string]: any },
    baseDomain: string = config.REST_API_URLS
  ) =>
    axios({
      url: baseDomain + url,
      method: 'GET',
      headers: headers,
      params: params,
    }).then(responseBody),
  post: (
    url: string,
    body: any,
    headers: { [key: string]: string },
    baseDomain: string = config.REST_API_URLS
  ) =>
    axios({
      url: baseDomain + url,
      method: 'POST',
      headers: headers,
      data: body,
    }).then(responseBody),
  put: (
    url: string,
    body: any,
    headers: { [key: string]: string },
    baseDomain: string = config.REST_API_URLS
  ) =>
    axios({
      url: baseDomain + url,
      method: 'PUT',
      headers: headers,
      data: body,
    }).then(responseBody),
  delete: (
    url: string,
    headers: { [key: string]: string },
    baseDomain: string = config.REST_API_URLS
  ) =>
    axios({
      url: baseDomain + url,
      method: 'DELETE',
      headers: headers,
    }).then(responseBody),
}

const Certificates = {
  getBaseRoute: function () {
    return `/certificates`
  },
  getIssuedCertificateById: async function (certificateId: string) {
    const headers = {
      ...DEFAULT_HEADERS,
    }
    return requests.get(
      `${this.getBaseRoute()}/registry/public/${certificateId}`,
      headers,
      {},
      config.REST_API_URLS
    )
  },
  getCertificateTemplateById: async function (certificateId: string) {
    const headers = {
      ...DEFAULT_HEADERS,
    }
    return requests.get(
      `${this.getBaseRoute()}/templates/public/${certificateId}`,
      headers,
      {},
      config.REST_API_URLS
    )
  },
  getCertificateHtml: (downloadUrl: string) => {
    return requests.get('', {}, {}, downloadUrl)
  },
}

export default { Certificates }
