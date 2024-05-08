import config from '@/config'
import { useAppStore } from '@/store/app'
import { deviceId, isMobileTablet } from '../util/deviceInfo'
import { requests } from './HttpService'

export const UserService = {
  signUp: payload =>
    requests().post(
      `${config.REST_API_URLS}/clientclub/${payload.locationId}/users`,
      {
        email: payload.email,
        password: payload.password,
        fullName: payload.username, //username,
        locationId: payload.locationId,
      }
    ),

  login: payload =>
    requests().post(`${config.REST_API_URLS}/clientclub/auth/login/email`, {
      email: payload.email,
      password: payload.password,
      userId: payload.userId || '',
      deviceName: navigator.userAgent,
      deviceId: deviceId,
      deviceType: isMobileTablet() ? 'mobile' : 'desktop',
      domainName: `${window.location.host}`,
      locationId: payload.locationId,
      ipAddress: '0.0.0.1', //not required
      redirectUrl: payload.redirectUrl || null,
    }),
  portalSetting: domain =>
    requests().get(
      `${config.REST_API_URLS}/clientclub/portal-settings?domain=${domain}`
    ),

  loginWithSecureEmail: payload =>
    requests().post(`${config.REST_API_URLS}/clientclub/auth/login/otp`, {
      email: payload.email,
      userId: payload.userId || '',
      token: payload.token || '',
      otp: payload.otp || null,
      deviceName: navigator.userAgent,
      deviceId: deviceId,
      deviceType: isMobileTablet() ? 'mobile' : 'desktop',
      domainName: `${window.location.host}`,
      locationId: payload.locationId,
      ipAddress: '0.0.0.1', //not required
      redirectUrl: payload.redirectUrl || null,
      action: payload?.action || null,
    }),

  loginWithLoginCode: payload => {
    return requests().post(
      `${config.REST_API_URLS}/clientclub/auth/login/loginCode`,
      {
        email: payload.email,
        loginCode: payload.loginCode,
        deviceName: navigator.userAgent,
        deviceId: deviceId,
        deviceType: isMobileTablet() ? 'mobile' : 'desktop',
        domainName: payload.domainName,
        locationId: payload.locationId,
        ipAddress: '0.0.0.1', //not required
        redirectUrl: payload.redirectUrl || null,
      }
    )
  },
  loginWithSessionKey: payload => {
    return requests().post(
      `${config.REST_API_URLS}/clientclub/auth/login/sessionKey`,
      {
        sessionKey: payload.sessionKey,
        deviceName: navigator.userAgent,
        deviceId: deviceId,
        deviceType: isMobileTablet() ? 'mobile' : 'desktop',
        domainName: payload.domainName,
        locationId: payload.locationId,
        ipAddress: '0.0.0.1', //not required
        redirectUrl: payload.redirectUrl || null,
      }
    )
  },

  changePassword: payload =>
    requests().post(
      `${config.REST_API_URLS}/clientclub/${payload.locationId}/users/change-password`,
      {
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
        confirmPassword: payload.confirmPassword,
      }
    ),

  //reset password APIS

  resetPassword: payload =>
    requests().post(
      `${config.REST_API_URLS}/clientclub/${payload.locationId}/users/reset-password`,
      {
        userId: payload.userId,
        token: payload.token,
        password: payload.password,
        locationId: payload.locationId,
      }
    ),

  forgotPassword: payload =>
    requests().post(
      `${config.REST_API_URLS}/clientclub/${payload.locationId}/users/forgot-password`,
      {
        locationId: payload.locationId,
        email: payload.email,
        userId: payload.userId || '',
      }
    ),

  validateResetLink: payload =>
    requests().post(
      `${config.REST_API_URLS}/clientclub/${payload.locationId}/users/validate-link`,
      {
        token: payload.token,
        userId: payload.userId,
        locationId: payload.locationId,
      }
    ),

  updateUser: async payload => {
    const appStore = useAppStore()
    const response = await requests().put(
      `${config.REST_API_URLS}/clientclub/${payload.locationId}/users/${payload.userId}`,
      {
        email: payload.email,
        fullName: payload.fullName,
        title: payload.title,
        bio: payload.bio,
        avatar: payload.avatar,
        profileCover: payload.profileCover,
        timeZone: payload.timeZone,
        password: payload.password,
        newPassword: payload.newPassword,
        confirmPassword: payload.confirmPassword,
        location: payload.location,
        socials: payload.socials,
      }
    )
    appStore.setProfileDetails(response.data)
    return response.data
  },

  fetchUserDetails: payload =>
    requests().get(
      `${config.REST_API_URLS}/clientclub/${payload.locationId}/users/${payload.userId}`
    ),

  getUserAnalytics: payload =>
    requests().get(
      `${config.REST_API_URLS}/clientclub/${payload.locationId}/users-analytics/${payload.contactId}`
    ),
}
