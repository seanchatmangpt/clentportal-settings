import FillBellVue from '@/components/common/icons/FillBellIcon.vue'
import FillHomeSmileIcon from '@/components/common/icons/FillHomeSmileIcon.vue'
import FillUsers02Icon from '@/components/common/icons/FillUsers02Icon.vue'
import { NavigationItemType } from '@gohighlevel/clientportal-core'
import {
  Bell02Icon,
  Home05Icon,
  User02Icon,
} from '@gohighlevel/ghl-icons/24/outline'
import { h, reactive } from 'vue'

class Navigation {
  state = reactive({
    navigationItems: [
      {
        name: 'Home',
        routeName: [`LandingPage`],
        current: true,
        type: NavigationItemType.APP_ROUTE,
        showOnMobile: true,
        showOnWeb: false,
        icon: () => h(Home05Icon),
        selectedIcon: () => h(Home05Icon),
      },
      {
        name: 'Notifications',
        routeName: [`NotificationMobileView`],
        type: NavigationItemType.APP_ROUTE,
        showOnMobile: true,
        showOnWeb: false,
        icon: () => h(Bell02Icon),
        selectedIcon: () => h(Home05Icon),
      },
      {
        name: 'Profile',
        routeName: [`ProfileContainer`],
        type: NavigationItemType.APP_ROUTE,
        showOnMobile: true,
        showOnWeb: false,
        icon: () => h(User02Icon),
        selectedIcon: () => h(User02Icon),
      },
    ],
  })
}

export const navigation = new Navigation()
