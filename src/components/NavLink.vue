<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  to: {
    type: [String, Object],
    required: true,
  },
  active: {
    type: Boolean,
    default: undefined,
  },
})

const route = useRoute()

const isActive = computed(() => {
  if (props.active !== undefined) return props.active
  if (typeof props.to === 'string') {
    return route.path === props.to || route.path.startsWith(props.to + '/')
  }
  return false
})

const classes = computed(() =>
  isActive.value
    ? 'inline-flex items-center px-1 pt-1 border-b-2 border-primary text-sm font-semibold leading-5 text-neutral-900 dark:text-neutral-50 focus:outline-none transition duration-150 ease-in-out'
    : 'inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600 focus:outline-none transition duration-150 ease-in-out'
)
</script>

<template>
  <router-link :to="to" :class="classes">
    <slot />
  </router-link>
</template>
