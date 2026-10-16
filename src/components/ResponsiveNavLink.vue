<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  to: {
    type: [String, Object],
    default: null,
  },
  active: {
    type: Boolean,
    default: undefined,
  },
  as: {
    type: String,
    default: 'a',
  },
})

const emit = defineEmits(['click'])
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
    ? 'block w-full ps-3 pe-4 py-2 border-l-4 border-primary text-start text-base font-semibold text-neutral-900 dark:text-neutral-50 bg-primary/10 dark:bg-primary/20 focus:outline-none transition duration-150 ease-in-out'
    : 'block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 focus:outline-none transition duration-150 ease-in-out'
)
</script>

<template>
  <button
    v-if="as === 'button'"
    type="button"
    @click="emit('click')"
    :class="classes"
    class="text-left cursor-pointer"
  >
    <slot />
  </button>

  <router-link
    v-else-if="to"
    :to="to"
    :class="classes"
  >
    <slot />
  </router-link>

  <a
    v-else
    :class="classes"
    class="cursor-pointer"
  >
    <slot />
  </a>
</template>
