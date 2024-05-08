import config from '@/config'
import { requests } from './HttpService'

const http = requests(config?.INTERNAL_URL)

export default class MediaService {
  protected subdomain = ''
  private locationId = ''

  constructor(locationId: string) {
    this.locationId = locationId
    this.subdomain = `${locationId}/medias`
  }

  async generateSignedUrl(data: any) {
    return http.post(`${this.subdomain}/signed-url`, data)
  }

  async compressImage(imageCloudUrl: string, resolution: number) {
    return http.post(`${this.subdomain}/compress-image`, {
      imageUrl: imageCloudUrl,
      resolution: resolution,
    })
  }
}
