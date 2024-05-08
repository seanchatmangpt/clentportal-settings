<script lang="ts" setup>
import { UIMenu, UITextLgMedium } from '@gohighlevel/ghl-ui'
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '../../store/app'
import ChangePassword from './ChangePassword.vue'
import ProfileSetting from './ProfileSettings.vue'
import SocialMedia from './SocialMedia.vue'
import { NavBar } from '@gohighlevel/clientportal-core'
import { logoutUser } from '@/util/logout'
import { CLIENT_PORTAL_MENU_ITEM } from '../../helper/const'
const store = useAppStore()
const route = useRoute()
const activeMenuItem = ref(CLIENT_PORTAL_MENU_ITEM.PROFILE)
const tabs = new Set(Object.values(CLIENT_PORTAL_MENU_ITEM))
const emit = defineEmits(['logout'])
onMounted(async () => {
  if (route.query?.activeTab && tabs.has(route.query.activeTab.toString())) {
    activeMenuItem.value = route.query.activeTab.toString()
  }
})

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
  <div v-if="!store.profileDetails.fullName">
    <UISpin size="large" class="flex h-[80vh] min-w-48 items-center" />
  </div>
  <div
    v-else
    class="top-20 h-[80vh] max-w-[1440px] gap-4 lg:grid lg:w-[80vw] lg:grid-cols-5"
  >
    <NavBar :store="store" @logout="receiveLogoutUser"> </NavBar>

    <div class="top-2 col-span-1 hidden lg:block">
      <div id="side-bar" class="sticky top-20 rounded">
        <div class="flex w-full flex-col">
          <n-config-provider :theme-overrides="themeOverrides">
            <div>
              <UITextLgMedium class="px-6">Account Settings</UITextLgMedium>
            </div>
            <UIMenu
              :options="menuOptions"
              @update:value="handleMenuItemClick"
              :value="activeMenuItem"
            >
            </UIMenu>
          </n-config-provider>
        </div>
      </div>
    </div>
    <div class="lg:col-span-4">
      <div v-if="activeMenuItem === CLIENT_PORTAL_MENU_ITEM.PROFILE">
        <ProfileSetting />
      </div>
      <div v-if="activeMenuItem === CLIENT_PORTAL_MENU_ITEM.ACCOUNT">
        <ChangePassword />
      </div>
      <div v-if="activeMenuItem === CLIENT_PORTAL_MENU_ITEM.SOCIAL_MEDIA">
        <SocialMedia />
      </div>
     
    </div>
  </div>
</template>
<style>
.n-upload-dragger > div {
  display: flex;
  justify-content: center;
}
</style>
