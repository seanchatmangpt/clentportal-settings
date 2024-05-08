import config from '@/config'

import Model from '@/models/Model'
import { requests } from './HttpService'

export type TypesModels = Model

const http = requests(config?.INTERNAL_URL)

export default abstract class BaseService<K extends TypesModels> {
  protected subdomain = ''
  readonly locationId: string

  abstract model(): typeof Model

  constructor(locationId: string) {
    this.locationId = locationId
  }

  get endpoint() {
    return `${this.subdomain}`
  }

  findById(id: string, params?: any): Promise<K> {
    return http.get(`${this.endpoint}/${id}`, { params }).then(res => {
      return new (this.model())(res.data, this) as K
    })
  }

  create(data: { [key: string]: any }) {
    return http.post(`${this.endpoint}`, data).then(res => {
      return res.data.id
    })
  }

  update(id: string, data: { [key: string]: any }) {
    return http.put(`${this.endpoint}/${id}`, data)
  }

  delete(id) {
    return http.delete(`${this.endpoint}/${id}`)
  }

  findAll(): Promise<K> {
    return http.get(`${this.endpoint}`)
  }
}
