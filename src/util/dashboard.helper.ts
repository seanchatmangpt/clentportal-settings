import { useAppStore } from '@/store/app'
export const getProgress = () => {
  const store = useAppStore()
  const { fullName, avatar, bio, title, timeZone, location, socials } =
    store.profileDetails
  const SOCIAL_PERCENTAGE = 5
  const PROFILE_PERCENTAGE = 10
  const {
    email,
    phoneNumber,
    instagram,
    facebook,
    linkedin,
    youtube,
    twitter,
  } = socials
  let percentage = 0
  if (fullName) {
    percentage += PROFILE_PERCENTAGE
  }
  if (avatar) {
    percentage += PROFILE_PERCENTAGE
  }
  if (bio) {
    percentage += PROFILE_PERCENTAGE
  }
  if (title) {
    percentage += PROFILE_PERCENTAGE
  }
  if (location) {
    percentage += PROFILE_PERCENTAGE
  }
  if (timeZone) {
    percentage += SOCIAL_PERCENTAGE
  }
  if (email) {
    percentage += PROFILE_PERCENTAGE
  }
  if (phoneNumber) {
    percentage += PROFILE_PERCENTAGE
  }
  if (instagram) {
    percentage += SOCIAL_PERCENTAGE
  }
  if (facebook) {
    percentage += SOCIAL_PERCENTAGE
  }
  if (linkedin) {
    percentage += SOCIAL_PERCENTAGE
  }
  if (twitter) {
    percentage += SOCIAL_PERCENTAGE
  }
  if (youtube) {
    percentage += SOCIAL_PERCENTAGE
  }
  return percentage
}

export const getShortenedURL = (url: string) => {
  if (url.includes('https')) {
    return url.slice(8, url.length)
  } else if (url.includes('http')) {
    return url.slice(7, url.length)
  } else {
    return url
  }
}

export const updateScreenSize = isWideScreen => {
  isWideScreen.value = window.innerWidth > 768 // Adjust the width as needed
}
