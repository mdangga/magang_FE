<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" @click="closeModal" />

        <!-- Modal Card -->
        <div class="relative w-full max-w-md rounded-2xl bg-white dark:bg-neutral-800 p-6 shadow-2xl border border-neutral-100 dark:border-neutral-700 z-10 transform transition-all">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                <i class="fas fa-trash-can text-lg"></i>
              </div>
              <h3 class="text-lg font-bold text-neutral-900 dark:text-white">
                {{ title }}
              </h3>
            </div>

            <button 
              @click="closeModal" 
              :disabled="loading" 
              class="text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-200 transition-colors p-1 rounded-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="space-y-3 my-4">
            <p class="text-sm text-neutral-600 dark:text-neutral-300">
              {{ message }}
            </p>

            <div v-if="warningMessage" class="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <i class="fas fa-triangle-exclamation text-amber-500 mt-0.5"></i>
              <p class="text-xs text-amber-800 dark:text-amber-300">
                {{ warningMessage }}
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="mt-6 flex justify-end gap-3">
            <button 
              type="button" 
              @click="closeModal" 
              :disabled="loading" 
              class="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-xl transition-colors disabled:opacity-50"
            >
              Batal
            </button>

            <button 
              type="button" 
              @click="confirm" 
              :disabled="loading" 
              class="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              <svg v-if="loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Menghapus...' : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  show: { type: Boolean, required: true },
  title: { type: String, default: 'Konfirmasi Hapus' },
  message: { type: String, required: true },
  warningMessage: { type: String, default: '' },
  confirmText: { type: String, default: 'Hapus' },
  loading: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'confirm'])

const closeModal = () => {
  if (!props.loading) emit('close')
}

const confirm = () => {
  if (!props.loading) emit('confirm')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
