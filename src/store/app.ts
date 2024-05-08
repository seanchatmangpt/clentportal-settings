import { defineStore } from 'pinia'

export interface AppStore {
  locationId: string
  userEmail: string
  userId: string
  token: string
  companyId: string
  timezone: string
  appType: 'STANDALONE' | 'EMBED'
  redirectUrl: string | null
  requestRetryCount: number
  branding: {
    portalBannerText: string | null
    portalDescription: string | null
    brandColor2: string | null
    brandColor1: string | null
    portalIcon: string | null
    portalBackgroundImage: string | null
    portalBannerImage: string | null
    logo: string | null
    favicon: string | null
    copyRight: string | null
    supportEmail: string | null
    customJs: string | null
    customCss: string | null
    headerCode: string | null
    footerCode: string | null
  }
  currencySymbol: string
  locationPermissions: {
    membershipEnabled: boolean
    affiliateManagerEnabled: boolean
    communitiesEnabled: boolean
  }
  profileDetails: {
    email: string
    userId: string
    role: string
    fullName: string
    title: string
    bio: string
    avatar: string
    profileCover: string
    timeZone: string
    location: string
    slug: string
    permissions: {
      affiliates: boolean
      courses: boolean
      communities: boolean
    }
    socials: {
      email: string
      phoneNumber: string
      facebook: string
      twitter: string
      instagram: string
      linkedin: string
      youtube: string
      emailVisibility: string
      phoneVisibility: string
    }
  }
}

export const useAppStore = defineStore('app', {
  state: (): AppStore => ({
    locationId: (import.meta.env.VITE_LOCATION_ID as string) || '',
    userId: (import.meta.env.VITE_USER_ID as string) || '',
    userEmail: (import.meta.env.VITE_USER_EMAIL as string) || '',
    token: (import.meta.env.VITE_TOKEN_ID as string) || '',
    appType: import.meta.env.VITE_APP_TYPE || 'STANDALONE',
    companyId: '',
    timezone: '',
    redirectUrl: null,
    requestRetryCount: 0,
    branding: {
      brandColor2: null,
      brandColor1: null,
      portalBannerText: null,
      customJs: null,
      customCss: null,
      headerCode: null,
      footerCode: null,
      portalDescription: null,
      portalBackgroundImage: null,
      portalBannerImage: null,
      logo: null,
      portalIcon: null,
      favicon: null,
      copyRight: null,
      supportEmail: null,
    },
    currencySymbol: '',
    locationPermissions: {
      membershipEnabled: false,
      affiliateManagerEnabled: false,
      communitiesEnabled: false,
    },
    profileDetails: {
      email: '',
      userId: '',
      fullName: '',
      title: '',
      bio: '',
      avatar: '',
      profileCover: '',
      role: '',
      timeZone: '',
      location: '',
      slug: '',
      permissions: {
        affiliates: false,
        courses: false,
        communities: false,
      },
      socials: {
        email: '',
        phoneNumber: '',
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        emailVisibility: '',
        phoneVisibility: '',
      },
    },
  }),
  actions: {
    updateRequestRetryCount(count: number) {
      this.requestRetryCount = count
    },
    initialize(payload: AppStore) {
      this.locationId = payload.locationId
      this.userId = payload.userId
      this.userEmail = payload.userEmail
      this.token = payload.token
      this.companyId = payload.companyId
      this.timezone = payload.timezone
      this.appType = payload.appType
      this.branding = {
        brandColor1: null,
        brandColor2: null,
        portalBannerText: null,
        customJs: null,
        customCss: null,
        headerCode: null,
        footerCode: null,
        portalIcon: null,
        portalDescription: null,
        portalBackgroundImage: null,
        portalBannerImage: null,
        logo: null,
        favicon: null,
        copyRight: null,
        supportEmail: null,
      }
    },
    refreshToken(newToken: string) {
      this.token = newToken
    },

    setBrandingValue(value) {
      this.branding.portalBannerText = value.portalBannerText
      this.branding.portalDescription = value.portalDescription
      this.branding.brandColor1 = value.brandColor1
      this.branding.brandColor2 = value.brandColor2
      this.branding.portalIcon = value.portalIcon
      this.branding.favicon = value.favicon
      this.branding.copyRight = value.copyRight
      this.branding.supportEmail = value.supportEmail
      this.locationId = value.locationId
      this.branding.portalBackgroundImage = value.portalBackgroundImage
      this.branding.portalBannerImage = value.portalBannerImage
      this.branding.logo = value.logo
      this.branding.customJs = value.customJs
      this.branding.customCss = value.customCss
      this.branding.headerCode = value.headerCode
      this.branding.footerCode = value.footerCode
    },
    setPermissions(payload) {
      this.locationPermissions.membershipEnabled =
        payload.locationPermissions?.membershipEnabled
      this.locationPermissions.affiliateManagerEnabled =
        payload.locationPermissions?.affiliateManagerEnabled
      this.locationPermissions.communitiesEnabled =
        payload.locationPermissions?.communitiesEnabled
      this.currencySymbol = payload.currencySymbol
    },
    setProfileDetails(value) {
      this.userId = value.contactId
      this.profileDetails.email = value.email
      this.profileDetails.userId = value.contactId
      this.profileDetails.fullName = value.fullName
      this.profileDetails.title = value?.title
      this.profileDetails.bio = value?.bio
      this.profileDetails.avatar = value?.avatar
      this.profileDetails.profileCover = value?.profileCover
      this.profileDetails.timeZone = value?.timeZone
      this.profileDetails.location = value?.location
      this.profileDetails.slug = value?.slug
      this.profileDetails.permissions.affiliates =
        value?.permissions?.affiliates || false
      this.profileDetails.permissions.courses =
        value?.permissions?.courses || false
      this.profileDetails.permissions.communities =
        value?.permissions?.communities || false
      this.profileDetails.socials.phoneNumber = value?.socials?.phoneNumber
      this.profileDetails.socials.facebook = value?.socials?.facebook
      this.profileDetails.socials.twitter = value?.socials?.twitter
      this.profileDetails.socials.instagram = value?.socials?.instagram
      this.profileDetails.socials.youtube = value?.socials?.youtube
      this.profileDetails.socials.linkedin = value?.socials?.linkedin
      this.profileDetails.socials.email = value?.socials?.email
      this.profileDetails.socials.emailVisibility =
        value?.socials?.emailVisibility
      this.profileDetails.socials.phoneVisibility =
        value?.socials?.phoneVisibility
    },
    setRedirectUrl(redirectUrl: string) {
      this.redirectUrl = redirectUrl
    },
  },
})
