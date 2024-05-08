<script lang="ts" setup>
import { useAppStore } from '@/store/app'
import { UISpin } from '@gohighlevel/ghl-ui'
const store = useAppStore()
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  handleClick: {
    type: Object,
    required: true,
  },
})
</script>
<template>
  <button
    :id="props.id"
    :disabled="props.disabled"
    @click="props.handleClick"
    type="button"
    :style="`background: ${
      props.disabled || props.loading
        ? '#8dc2fc'
        : store.branding.brandColor1 || '#323076'
    }`"
    :class="[
      props.disabled || props.loading ? 'cursor-not-allowed' : 'cursor-pointer',
    ]"
    class="my-4 w-full rounded-lg border-none p-3 text-white"
  >
    <div class="flex justify-center align-baseline">
      <UISpin stroke="white" v-if="props.loading" class="h-4 w-2" />
      <div :class="props.loading && 'pl-5'">
        {{ props.title }}
      </div>
    </div>
  </button>
</template>
