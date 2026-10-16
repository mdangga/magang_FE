<script setup>
import { ref } from 'vue'
import InputLabel from './InputLabel.vue'
import InputError from './InputError.vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFiles = (event) => {
  const files = Array.from(event.target.files || event.dataTransfer?.files || [])
  if (files.length === 0) return

  // Filter image files only
  const validFiles = files.filter(f => f.type.startsWith('image/'))

  if (!Array.isArray(props.form.images)) {
    props.form.images = []
  }

  props.form.images.push(...validFiles)

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeFile = (index) => {
  if (Array.isArray(props.form.images)) {
    props.form.images.splice(index, 1)
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
    <div class="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700 text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
      <i class="fas fa-image text-amber-500"></i>
      Dokumentasi / Foto Lokasi
    </div>

    <div class="p-6 space-y-4">
      <div>
        <InputLabel for="image-upload" value="Unggah Foto Tempat Magang" />

        <div
          class="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all bg-neutral-50 dark:bg-neutral-900/40 mt-2"
          @click="triggerFileInput"
          @dragover.prevent
          @drop.prevent="handleFiles"
        >
          <div class="flex flex-col items-center justify-center">
            <div class="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
              <i class="fas fa-cloud-arrow-up text-2xl"></i>
            </div>
            <p class="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              Klik atau seret foto ke area ini
            </p>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              Format: JPG, PNG, WEBP. Maksimal 5MB per foto.
            </p>
          </div>

          <input
            id="image-upload"
            ref="fileInput"
            type="file"
            multiple
            class="hidden"
            accept="image/jpeg,image/png,image/webp,image/gif"
            @change="handleFiles"
          />
        </div>

        <!-- Selected Files List -->
        <div v-if="form.images && form.images.length > 0" class="mt-4 space-y-2">
          <p class="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            File Terpilih ({{ form.images.length }})
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="(file, index) in form.images"
              :key="index"
              class="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl border border-neutral-200 dark:border-neutral-600"
            >
              <div class="flex items-center gap-2.5 min-w-0">
                <i class="fas fa-file-image text-amber-500 text-lg flex-shrink-0"></i>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                    {{ file.name }}
                  </p>
                  <p class="text-xs text-neutral-400">
                    {{ formatFileSize(file.size) }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="removeFile(index)"
                class="p-1.5 text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0"
                title="Hapus foto"
              >
                <i class="fas fa-trash-can text-sm"></i>
              </button>
            </div>
          </div>
        </div>

        <InputError v-if="form.errors && form.errors.images" class="mt-2" :message="form.errors.images" />
      </div>
    </div>
  </div>
</template>
