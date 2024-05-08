<script lang="ts" setup>
import { UICard } from '@gohighlevel/ghl-ui'
defineProps({
  title: {
    type: String,
  },
})
</script>
<template>
  <UICard class="mb-4 w-full">
    <div class="mb-2 text-base font-medium text-gray-800">{{ title }}</div>
    <slot name="card-slot"></slot>
  </UICard>
</template>
