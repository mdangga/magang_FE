<script setup>
import { computed } from 'vue'

const emit = defineEmits(['update:checked', 'update:modelValue'])

const props = defineProps({
  checked: {
    type: [Array, Boolean],
    default: false,
  },
  modelValue: {
    type: [Array, Boolean],
    default: undefined,
  },
  value: {
    default: null,
  },
})

const proxyChecked = computed({
  get() {
    return props.modelValue !== undefined ? props.modelValue : props.checked
  },
  set(val) {
    emit('update:checked', val)
    emit('update:modelValue', val)
  },
})
</script>

<template>
  <input
    type="checkbox"
    :value="value"
    v-model="proxyChecked"
    class="rounded border-neutral-300 text-primary focus:ring-primary dark:border-neutral-700 dark:bg-neutral-900 dark:focus:ring-primary transition"
  />
</template>
