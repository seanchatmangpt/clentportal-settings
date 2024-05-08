<script lang="ts" setup>
import { useAppStore } from '@/store/app'
import { Mail01Icon } from '@gohighlevel/ghl-icons/24/outline'

const store = useAppStore()

</script>
<template>
  <div class="footer flex w-full justify-between">
    <div
      v-if="store.branding.copyRight && store.branding.copyRight.length > 1"
      class="m-2 flex items-center"
    >
      <span class="copyright mr-1 mt-0.5">&#169;</span>
      <div>
        {{
          store.branding.copyRight.substring(1, store.branding.copyRight.length)
        }}
      </div>
    </div>
    <div
      v-if="
        store.branding.supportEmail && store.branding.supportEmail.length > 1
      "
      class="m-2 flex items-center"
    >
      <Mail01Icon class="mr-2 h-4 w-4" />{{ store.branding.supportEmail }}
    </div>
  </div>
</template>
