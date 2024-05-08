import BaseService, { TypesModels } from '@/service/BaseService'

export default class Model {
  private _id: string
  private _createdAt: string
  private _updatedAt: string
  private _deleted: boolean

  protected service!: BaseService<TypesModels>

  protected _data: any

  constructor(
    payload: { [key: string]: any },
    _service: BaseService<TypesModels>
  ) {
    const { _id, createdAt, updatedAt, deleted, ...data } = payload
    this._id = _id
    this._createdAt = createdAt
    this._updatedAt = updatedAt
    this._deleted = deleted
    this._data = data
    this.service = _service
  }

  get id(): string {
    return this._id
  }

  set id(id: string) {
    this._id = id
  }

  get createdAt(): string {
    return this._createdAt
  }

  get updatedAt(): string {
    return this._updatedAt
  }

  get data(): any {
    return this._data
  }

  async save() {
    if (this._id) {
      await this.service.update(this._id, this._data)
    } else {
      this._id = await this.service.create(this._data)
    }
  }
}
