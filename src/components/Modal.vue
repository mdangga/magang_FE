<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  maxWidth: {
    type: String,
    default: '2xl',
  },
  closeable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])
const showSlot = ref(props.show)

watch(
  () => props.show,
  (val) => {
    if (val) {
      document.body.style.overflow = 'hidden'
      showSlot.value = true
    } else {
      document.body.style.overflow = ''
      setTimeout(() => {
        showSlot.value = false
      }, 200)
    }
  }
)

const close = () => {
  if (props.closeable) {
    emit('close')
  }
}

const closeOnEscape = (e) => {
  if (e.key === 'Escape' && props.show) {
    e.preventDefault()
    close()
  }
}

onMounted(() => document.addEventListener('keydown', closeOnEscape))
onUnmounted(() => {
  document.removeEventListener('keydown', closeOnEscape)
  document.body.style.overflow = ''
})

const maxWidthClass = computed(() => {
  return {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
  }[props.maxWidth] || 'sm:max-w-2xl'
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto px-4 py-6 sm:px-0 flex items-center justify-center"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
          @click="close"
        ></div>

        <!-- Dialog Box -->
        <div
          class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 shadow-2xl transition-all sm:w-full z-10 p-6 border border-neutral-100 dark:border-neutral-700"
          :class="maxWidthClass"
        >
          <slot v-if="showSlot" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
