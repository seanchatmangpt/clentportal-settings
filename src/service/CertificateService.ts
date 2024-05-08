import { requests } from './HttpService'

export const CertificateService = {
  getCertficatesByContact: (locationId, userId, skip, pageNumber, limit) =>
    requests().get(
      `/certificates/locations/${locationId}/registry?contactId=${userId}&skip=${skip}&limit=${limit}&pageNumber=${pageNumber}`
    ),
}
