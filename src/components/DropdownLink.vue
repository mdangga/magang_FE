<script setup>
defineProps({
  to: {
    type: [String, Object],
    default: null,
  },
  as: {
    type: String,
    default: 'a',
  },
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    v-if="as === 'button'"
    type="button"
    @click="emit('click')"
    class="block w-full px-4 py-2.5 text-left text-sm leading-5 text-neutral-700 dark:text-neutral-200 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700/60 focus:bg-neutral-100 dark:focus:bg-neutral-700/60 focus:outline-none cursor-pointer flex items-center gap-2"
  >
    <slot />
  </button>

  <router-link
    v-else-if="to"
    :to="to"
    class="block w-full px-4 py-2.5 text-left text-sm leading-5 text-neutral-700 dark:text-neutral-200 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700/60 focus:bg-neutral-100 dark:focus:bg-neutral-700/60 focus:outline-none flex items-center gap-2"
  >
    <slot />
  </router-link>

  <a
    v-else
    class="block w-full px-4 py-2.5 text-left text-sm leading-5 text-neutral-700 dark:text-neutral-200 transition duration-150 ease-in-out hover:bg-neutral-100 dark:hover:bg-neutral-700/60 focus:bg-neutral-100 dark:focus:bg-neutral-700/60 focus:outline-none cursor-pointer flex items-center gap-2"
  >
    <slot />
  </a>
</template>
