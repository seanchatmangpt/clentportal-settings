<script lang="ts" setup>
import { UIMenu, UISpin, UITextLgMedium } from '@gohighlevel/ghl-ui'
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui'
import { onMounted, ref, createApp, onBeforeMount, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '../../store/app'
import ChangePassword from './ChangePassword.vue'
import ProfileSetting from './ProfileSettings.vue'
import SocialMedia from './SocialMedia.vue'
import Cookies from 'js-cookie'
import { router } from '../../router'
import { NavBar } from '@gohighlevel/clientportal-core'
import { logoutUser } from '@/util/logout'
import { CLIENT_PORTAL_MENU_ITEM } from '../../helper/const'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import { inject } from 'vue'
import { UserService } from '@/service'
import { watch } from 'vue'

const app = createApp(App);
const route = inject<any>('route')
const pinia = createPinia();
app.use(router);
app.use(pinia);
const store = useAppStore()
const profileData = ref()
const isLoading = ref(false)
const activeMenuItem = ref(CLIENT_PORTAL_MENU_ITEM.PROFILE)
const tabs = new Set(Object.values(CLIENT_PORTAL_MENU_ITEM))
const emit = defineEmits(['logout'])
// onMounted(async () => {
  
//   if (route.query?.activeTab && tabs.has(route.query.activeTab.toString())) {
//     activeMenuItem.value = route.query.activeTab.toString()
//   }
// })



onMounted(async ()=>{
  isLoading.value = true
 await getDataSettings()
 isLoading.value = false
})

async function getDataSettings() {
  const cookie = await Cookies.get('cat')
    //TODO: fix below issue/Commented due to delay in loading userdetails on accounts and nav bar , maybe store issue
    // //Fetch user details if user is loggedIn
    if (cookie) {
      const cat = cookie || window.localStorage.getItem('cat')
      const cookieData = cat ? JSON.parse(window.atob(cat)) : null
      const userData = await UserService.fetchUserDetails({
        userId: cookieData.contactId,
        locationId: cookieData.locationId,
      })
      store.setProfileDetails({
        ...userData.data,
      })

      console.log('store>>>>>>>>+++', store.profileDetails)
      profileData.value = store.profileDetails;
      console.log('profileData+++',profileData.value,profileData.value.fullName)
      return
}
}
async function handleMenuItemClick(key: string) {
  activeMenuItem.value = key
}
//#f3f4f7
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#3a455a',
  },
}

const menuOptions = [
  {
    label: CLIENT_PORTAL_MENU_ITEM.PROFILE,
    key: CLIENT_PORTAL_MENU_ITEM.PROFILE,
  },
  {
    label: CLIENT_PORTAL_MENU_ITEM.ACCOUNT,
    key: CLIENT_PORTAL_MENU_ITEM.ACCOUNT,
  },
  {
    label: 'Social Media',
    key: CLIENT_PORTAL_MENU_ITEM.SOCIAL_MEDIA,
  },
  {
    label: CLIENT_PORTAL_MENU_ITEM.CERTIFICATES,
    key: CLIENT_PORTAL_MENU_ITEM.CERTIFICATES,
  },
]



function receiveLogoutUser() {
  emit('logout', logoutUser())
}
</script>
<template>
  <div v-if="isLoading">
    <UISpin size="large" class="flex h-[80vh] min-w-48 items-center" />
  </div>
  <div
    v-else
    class="top-20 h-[80vh] max-w-[1440px] gap-4 lg:grid lg:w-[80vw] lg:grid-cols-5"
  >
    <!-- <NavBar :store="store" @logout="receiveLogoutUser"> </NavBar> -->

    <div class="top-2 col-span-1 hidden lg:block">
      <div id="side-bar" class="sticky top-20 rounded">
        <div class="flex w-full flex-col">
          
            <div>
              <UITextLgMedium class="px-6">Account Settings</UITextLgMedium>
            </div>
            <UIMenu
              :options="menuOptions"
              @update:value="handleMenuItemClick"
              :value="activeMenuItem"
            >
            </UIMenu>
         
        </div>
      </div>
    </div>
    <!-- <div class="lg:col-span-4">
      <div v-if="activeMenuItem === CLIENT_PORTAL_MENU_ITEM.PROFILE">
        <ProfileSetting />
      </div>
      <div v-if="activeMenuItem === CLIENT_PORTAL_MENU_ITEM.ACCOUNT">
        <ChangePassword />
      </div>
      <div v-if="activeMenuItem === CLIENT_PORTAL_MENU_ITEM.SOCIAL_MEDIA">
        <SocialMedia />
      </div>
     
    </div> -->
  </div>
</template>
<style>
.n-upload-dragger > div {
  display: flex;
  justify-content: center;
}
</style>
