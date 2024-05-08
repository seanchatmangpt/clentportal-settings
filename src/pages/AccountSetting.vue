<script lang="ts" setup>

import AccountSettings from '@/components/account/AccountSettings.vue';
import { UIContentWrap } from '@gohighlevel/ghl-ui'
import '@gohighlevel/ghl-ui/dist/style.css'
import { provide } from 'vue'
const props = defineProps({
  route: Object,
  router: Object,
  emitter: Object,
  store: Object,
})

provide('route', props.route)
provide('router', props.router)
provide('emitter', props.emitter)
provide('store', props.store)

/* DON't write any direct logics here because if we use 
composition here it won't be able to access providers
*/
</script>
<template>
  <UIContentWrap style="padding-top: 0">
    <!-- <div class="flex justify-center bg-white px-8"> -->
    <AccountSettings />
    <!-- </div> -->
  </UIContentWrap>
</template>
