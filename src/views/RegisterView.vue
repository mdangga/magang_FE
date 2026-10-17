<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useAuthStore } from '../stores/auth'
import { useProfileStore } from '../stores/profile'

const router = useRouter()
const authStore = useAuthStore()
const profileStore = useProfileStore()

const name = ref('')
const username = ref('')
const password = ref('')
const passwordConfirm = ref('')
const error = ref('')
const loading = ref(false)

const handleRegister = async () => {
  error.value = ''

  if (!username.value || !password.value || !name.value) {
    error.value = 'Harap isi semua kolom formulir.'
    toast.error(error.value)
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password minimal harus 6 karakter.'
    toast.error(error.value)
    return
  }

  if (password.value !== passwordConfirm.value) {
    error.value = 'Konfirmasi password tidak cocok.'
    toast.error(error.value)
    return
  }

  loading.value = true
  try {
    const result = await authStore.register(username.value, name.value, password.value)
    if (result.success) {
      toast.success('Pendaftaran akun berhasil! Mengalihkan ke dashboard...')
      setTimeout(() => {
        router.push('/user/dashboard')
      }, 600)
    } else {
      error.value = result.message || 'Pendaftaran gagal.'
      toast.error(error.value)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Terjadi kesalahan saat pendaftaran.'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center p-4 font-sans transition-colors">
    <div class="max-w-md w-full bg-white dark:bg-neutral-800 rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <!-- Card Header -->
      <div class="p-8 pb-6 bg-gradient-to-br from-amber-400 via-primary to-yellow-500 text-neutral-900 text-center relative overflow-hidden">
        <div class="w-16 h-16 bg-white/30 rounded-2xl mx-auto flex items-center justify-center mb-4 backdrop-blur-xs shadow-inner">
          <i class="fas fa-user-plus text-2xl text-neutral-900"></i>
        </div>
        <h2 class="text-2xl font-extrabold tracking-tight">Daftar Akun Mahasiswa</h2>
        <p class="text-neutral-800/80 mt-1 text-xs sm:text-sm font-medium">
          Buat akun untuk mengunggah dan memantau laporan magang Anda di {{ profileStore.profile.app_name || 'Peta Magang' }}
        </p>
      </div>

      <!-- Card Body -->
      <div class="p-8 pt-6">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div v-if="error" class="p-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-xs sm:text-sm font-medium border border-red-200 dark:border-red-800 flex items-center gap-2">
            <i class="fas fa-circle-exclamation text-base shrink-0"></i>
            <span>{{ error }}</span>
          </div>

          <div>
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Nama Lengkap
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                <i class="fas fa-id-card text-sm"></i>
              </span>
              <input
                v-model="name"
                type="text"
                required
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700/50 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm transition"
                placeholder="Contoh: Budi Santoso"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Username / NIM
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                <i class="fas fa-user text-sm"></i>
              </span>
              <input
                v-model="username"
                type="text"
                required
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700/50 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm transition"
                placeholder="NIM atau username unik"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                <i class="fas fa-lock text-sm"></i>
              </span>
              <input
                v-model="password"
                type="password"
                required
                minlength="6"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700/50 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm transition"
                placeholder="Minimal 6 karakter"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Konfirmasi Password
            </label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                <i class="fas fa-shield text-sm"></i>
              </span>
              <input
                v-model="passwordConfirm"
                type="password"
                required
                minlength="6"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700/50 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary text-sm transition"
                placeholder="Ketik ulang password"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary hover:bg-primary-dark text-neutral-900 font-bold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm cursor-pointer mt-2"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5 text-neutral-900" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ loading ? 'Mendaftarkan Akun...' : 'Daftar Sekarang' }}</span>
          </button>
        </form>

        <div class="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-700 text-center space-y-3">
          <p class="text-xs text-neutral-600 dark:text-neutral-400">
            Sudah memiliki akun?
            <router-link to="/login" class="font-bold text-amber-600 dark:text-amber-400 hover:underline ml-1">
              Masuk di sini
            </router-link>
          </p>
          <div>
            <router-link to="/" class="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors inline-flex items-center gap-1.5">
              <i class="fas fa-arrow-left"></i> Kembali ke Beranda Peta
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
