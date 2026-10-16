<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout.vue'
import InputLabel from '../../../components/InputLabel.vue'
import TextInput from '../../../components/TextInput.vue'
import InputError from '../../../components/InputError.vue'
import PrimaryButton from '../../../components/PrimaryButton.vue'
import { useProfileStore } from '../../../stores/profile'
import { getImageUrl } from '../../../api'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const profileStore = useProfileStore()

const app_name = ref('')
const description = ref('')
const selectedFile = ref(null)
const previewUrl = ref(null)
const fileInput = ref(null)
const errorLogo = ref('')
const processing = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFile = (e) => {
  const files = e.target.files || e.dataTransfer?.files
  if (!files?.length) return

  const file = files[0]
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    errorLogo.value = 'File harus berformat JPG, PNG, GIF, atau WEBP'
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    errorLogo.value = 'Ukuran file logo maksimal 2MB'
    return
  }

  if (previewUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  errorLogo.value = ''
}

const removeFile = () => {
  if (previewUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
  selectedFile.value = null
  previewUrl.value = profileStore.profile.logo_path ? getImageUrl(profileStore.profile.logo_path) : null
  if (fileInput.value) fileInput.value.value = ''
  errorLogo.value = ''
}

onUnmounted(() => {
  if (previewUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(previewUrl.value)
  }
})

onMounted(async () => {
  await profileStore.fetchProfile()
  app_name.value = profileStore.profile.app_name || ''
  description.value = profileStore.profile.description || ''
  if (profileStore.profile.logo_path) {
    previewUrl.value = getImageUrl(profileStore.profile.logo_path)
  }
})

const submit = async () => {
  processing.value = true
  try {
    const formData = new FormData()
    formData.append('app_name', app_name.value)
    formData.append('description', description.value)
    if (selectedFile.value) {
      formData.append('logo', selectedFile.value)
    }

    const res = await profileStore.updateProfile(formData)
    if (res.success) {
      toast.success('Pengaturan profil website berhasil diperbarui!')
      selectedFile.value = null
      if (profileStore.profile.logo_path) {
        previewUrl.value = getImageUrl(profileStore.profile.logo_path)
      }
    } else {
      toast.error(res.message || 'Gagal menyimpan perubahan')
    }
  } catch (err) {
    toast.error('Terjadi kesalahan saat memperbarui profil')
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <h1 class="text-xl font-bold text-neutral-900 dark:text-white">
        Pengaturan Profil Website
      </h1>
      <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
        Kelola identitas, nama aplikasi, deskripsi publik, dan logo sistem
      </p>
    </template>

    <div class="max-w-3xl">
      <div class="p-6 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200/80 dark:border-neutral-700 shadow-xs">
        <form @submit.prevent="submit" class="space-y-6">
          <!-- Application Name -->
          <div>
            <InputLabel for="app_name" value="Nama Aplikasi / Sistem *" />
            <TextInput
              id="app_name"
              v-model="app_name"
              required
              placeholder="Contoh: Peta Magang IF"
            />
          </div>

          <!-- Description -->
          <div>
            <InputLabel for="description" value="Deskripsi Singkat Website *" />
            <textarea
              id="description"
              v-model="description"
              rows="3"
              required
              class="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm resize-none"
              placeholder="Jelaskan mengenai tujuan platform pemetaan titik magang ini..."
            ></textarea>
          </div>

          <!-- Logo Upload Section -->
          <div>
            <InputLabel value="Logo Website" />

            <div class="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <!-- Current/Preview Box -->
              <div class="w-24 h-24 rounded-2xl bg-neutral-100 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 flex items-center justify-center overflow-hidden p-2 relative shrink-0 shadow-inner">
                <img
                  v-if="previewUrl"
                  :src="previewUrl"
                  alt="Logo Preview"
                  class="w-full h-full object-contain"
                />
                <div v-else class="text-center text-neutral-400">
                  <i class="fas fa-image text-2xl"></i>
                  <p class="text-[10px] mt-1">Tanpa Logo</p>
                </div>
              </div>

              <!-- Upload Actions -->
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    @click="triggerFileInput"
                    class="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-xl text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
                  >
                    <i class="fas fa-upload mr-1.5 text-amber-500"></i> Pilih File Logo
                  </button>
                  <button
                    v-if="selectedFile"
                    type="button"
                    @click="removeFile"
                    class="px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition"
                  >
                    Batal
                  </button>
                </div>
                <p class="text-xs text-neutral-500 dark:text-neutral-400">
                  Format: PNG, JPG, WEBP, atau SVG. Ukuran file maksimal 2MB.
                </p>
                <InputError :message="errorLogo" />

                <input
                  ref="fileInput"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  class="hidden"
                  @change="handleFile"
                />
              </div>
            </div>
          </div>

          <div class="pt-4 border-t border-neutral-100 dark:border-neutral-700 flex justify-end">
            <PrimaryButton :disabled="processing">
              {{ processing ? 'Menyimpan Perubahan...' : 'Simpan Pengaturan' }}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
