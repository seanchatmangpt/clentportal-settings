<script lang="ts" setup>
import { UISpace } from '@gohighlevel/ghl-ui'
const props = defineProps({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
})
</script>
<template>
  <UISpace class="pb-4" align="center" justify="space-between">
    <div class="max-w-xs">
      <div class="text-gray-800">{{ props.title }}</div>
      <div class="text-gray-600">{{ props.description }}</div>
    </div>
    <slot name="space-slot"></slot>
  </UISpace>
</template>
