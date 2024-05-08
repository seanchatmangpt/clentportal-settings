import MediaServiceCls from './MediaService'
import { UserService } from './UserService'

let MediaService: MediaServiceCls
export default function initializeServices(locationId: string) {
  MediaService = new MediaServiceCls(locationId)
}

export { UserService, MediaService }
