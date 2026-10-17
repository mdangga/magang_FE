<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import InputLabel from '../components/InputLabel.vue'
import TextInput from '../components/TextInput.vue'
import InputError from '../components/InputError.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import SecondaryButton from '../components/SecondaryButton.vue'
import LocationPicker from '../components/LocationPicker.vue'
import CardPerusahaanForm from '../components/CardPerusahaanForm.vue'
import ImageUpload from '../components/ImageUpload.vue'
import ApplicationLogo from '../components/ApplicationLogo.vue'
import DarkModeToggle from '../components/DarkModeToggle.vue'
import api from '../api'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const categories = ref([])
const faculties = ref([])
const selectedFaculty = ref('')
const loadingData = ref(false)
const darkMode = ref(false)

const form = ref({
  student_name: '',
  nim: '',
  name_location: '',
  description: '',
  contact: '',
  latitude: '',
  longitude: '',
  images: [],
  id_category: '',
  id_department: '',
  errors: {},
  processing: false
})

const filteredDepartments = computed(() => {
  if (!selectedFaculty.value) return []
  const faculty = faculties.value.find(f => f.id_faculty === parseInt(selectedFaculty.value))
  return faculty?.departments || []
})

watch(selectedFaculty, () => {
  form.value.id_department = ''
})

const applyDarkMode = () => {
  document.documentElement.classList.toggle('dark', darkMode.value)
}

const toggleDarkMode = (val) => {
  darkMode.value = val
  localStorage.setItem('theme', val ? 'dark' : 'light')
  applyDarkMode()
}

const fetchData = async () => {
  loadingData.value = true
  try {
    const [catRes, facRes] = await Promise.all([
      api.get('/api/categories'),
      api.get('/api/faculties')
    ])
    categories.value = catRes.data?.data || []
    faculties.value = facRes.data?.data || []
  } catch (err) {
    console.error('Error loading dropdown options:', err)
    toast.error('Gagal memuat data kategori atau fakultas')
  } finally {
    loadingData.value = false
  }
}

onMounted(async () => {
  const saved = localStorage.getItem('theme')
  if (saved) {
    darkMode.value = saved === 'dark'
  } else {
    darkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  applyDarkMode()

  // Auto-fill student info from logged-in user
  let currentUser = authStore.user
  if (!currentUser && authStore.token) {
    currentUser = await authStore.fetchUser()
  }
  if (currentUser) {
    form.value.student_name = currentUser.name || ''
    form.value.nim = currentUser.username || ''
  }

  fetchData()
})

const submit = async () => {
  form.value.errors = {}
  
  // Validation
  if (!form.value.student_name) form.value.errors.student_name = 'Nama mahasiswa wajib diisi'
  if (!form.value.nim) form.value.errors.nim = 'NIM wajib diisi'
  if (!form.value.id_department) form.value.errors.id_department = 'Jurusan wajib dipilih'
  if (!form.value.name_location) form.value.errors.name_location = 'Nama perusahaan/lokasi wajib diisi'
  if (!form.value.id_category) form.value.errors.id_category = 'Kategori wajib dipilih'
  if (!form.value.contact) form.value.errors.contact = 'Kontak wajib diisi'
  if (!form.value.description) form.value.errors.description = 'Deskripsi wajib diisi'
  if (!form.value.latitude) form.value.errors.latitude = 'Titik latitude wajib diisi'
  if (!form.value.longitude) form.value.errors.longitude = 'Titik longitude wajib diisi'

  if (Object.keys(form.value.errors).length > 0) {
    toast.error('Mohon lengkapi semua kolom bertanda bintang (*)')
    return
  }

  form.value.processing = true

  try {
    const formData = new FormData()
    formData.append('student_name', form.value.student_name)
    formData.append('nim', form.value.nim)
    formData.append('id_department', form.value.id_department)
    formData.append('name_location', form.value.name_location)
    formData.append('id_category', form.value.id_category)
    formData.append('contact', form.value.contact)
    formData.append('description', form.value.description)
    formData.append('latitude', form.value.latitude)
    formData.append('longitude', form.value.longitude)

    if (form.value.images && form.value.images.length > 0) {
      form.value.images.forEach((file) => {
        formData.append('images[]', file)
      })
    }

    const res = await api.post('/api/locations', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    toast.success(res.data?.message || 'Permintaan lokasi magang berhasil diajukan!')

    // Reset form (keep student info from auth)
    form.value = {
      student_name: authStore.user?.name || '',
      nim: authStore.user?.username || '',
      name_location: '',
      description: '',
      contact: '',
      latitude: '',
      longitude: '',
      images: [],
      id_category: '',
      id_department: '',
      errors: {},
      processing: false
    }
    selectedFaculty.value = ''

    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (err) {
    console.error('Error submitting location:', err)
    const errMsg = err.response?.data?.message || 'Gagal mengirim pengajuan lokasi. Silakan coba lagi.'
    toast.error(errMsg)
  } finally {
    form.value.processing = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors">
    <!-- Top Bar -->
    <div class="max-w-4xl mx-auto mb-8 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2 group">
        <ApplicationLogo />
      </router-link>

      <div class="flex items-center gap-3">
        <DarkModeToggle v-model="darkMode" @toggle="toggleDarkMode" />
        <router-link
          to="/"
          class="px-3.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 transition flex items-center gap-1.5 shadow-xs"
        >
          <i class="fas fa-arrow-left"></i> Kembali ke Peta
        </router-link>
      </div>
    </div>

    <div class="max-w-4xl mx-auto">
      <!-- Title Header -->
      <div class="mb-8">
        <div class="flex items-center gap-3.5 mb-2">
          <div class="w-12 h-12 rounded-2xl bg-primary text-neutral-900 flex items-center justify-center font-bold text-xl shadow-sm">
            <i class="fas fa-map-location-dot"></i>
          </div>
          <div>
            <h1 class="text-2xl font-extrabold text-neutral-900 dark:text-white">
              Formulir Pengajuan Lokasi Magang
            </h1>
            <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              Bagikan tempat magang Anda. Data yang diajukan akan diverifikasi oleh admin sebelum muncul di peta.
            </p>
          </div>
        </div>
      </div>

      <!-- FORM -->
      <form @submit.prevent="submit" class="space-y-6">
        <!-- Student Information Card -->
        <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700 text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <i class="fas fa-user-graduate text-amber-500"></i>
            Informasi Mahasiswa
          </div>

          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nama -->
            <div>
              <InputLabel for="student_name" value="Nama Lengkap Mahasiswa" />
              <div class="relative">
                <TextInput
                  id="student_name"
                  v-model="form.student_name"
                  disabled
                  placeholder="Terisi otomatis dari akun Anda"
                />
                <span class="absolute inset-y-0 right-3 flex items-center text-neutral-400 pointer-events-none">
                  <i class="fas fa-lock text-xs"></i>
                </span>
              </div>
              <p class="mt-1 text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                <i class="fas fa-circle-info text-[10px]"></i>
                Terisi otomatis sesuai akun login Anda
              </p>
              <InputError :message="form.errors.student_name" />
            </div>

            <!-- NIM -->
            <div>
              <InputLabel for="nim" value="NIM" />
              <div class="relative">
                <TextInput
                  id="nim"
                  v-model="form.nim"
                  disabled
                  placeholder="Terisi otomatis dari akun Anda"
                />
                <span class="absolute inset-y-0 right-3 flex items-center text-neutral-400 pointer-events-none">
                  <i class="fas fa-lock text-xs"></i>
                </span>
              </div>
              <p class="mt-1 text-xs text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
                <i class="fas fa-circle-info text-[10px]"></i>
                Terisi otomatis sesuai akun login Anda
              </p>
              <InputError :message="form.errors.nim" />
            </div>

            <!-- Fakultas Dropdown -->
            <div>
              <InputLabel for="faculty" value="Fakultas *" />
              <select
                id="faculty"
                v-model="selectedFaculty"
                required
                class="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              >
                <option value="">Pilih Fakultas</option>
                <option v-for="fac in faculties" :key="fac.id_faculty" :value="fac.id_faculty">
                  {{ fac.name_faculty }}
                </option>
              </select>
            </div>

            <!-- Jurusan Dropdown -->
            <div>
              <InputLabel for="id_department" value="Jurusan / Program Studi *" />
              <select
                id="id_department"
                v-model="form.id_department"
                :disabled="!selectedFaculty"
                required
                class="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{{ selectedFaculty ? 'Pilih Jurusan' : 'Pilih Fakultas terlebih dahulu' }}</option>
                <option v-for="dept in filteredDepartments" :key="dept.id_department" :value="dept.id_department">
                  {{ dept.name_department }} {{ dept.degree_level ? `(${dept.degree_level})` : '' }}
                </option>
              </select>
              <InputError :message="form.errors.id_department" />
            </div>
          </div>
        </div>

        <!-- Company Details Card -->
        <CardPerusahaanForm :categories="categories" :form="form" />

        <!-- Coordinates Picker -->
        <LocationPicker
          v-model:latitude="form.latitude"
          v-model:longitude="form.longitude"
          :errorLatitude="form.errors.latitude"
          :errorLongitude="form.errors.longitude"
        />

        <!-- Image Upload Dropzone -->
        <ImageUpload :form="form" />

        <!-- Submit Buttons -->
        <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            <span class="text-amber-500 font-bold">*</span> Menandakan kolom wajib diisi.
          </p>

          <div class="flex items-center gap-3 w-full sm:w-auto">
            <SecondaryButton @click="router.push('/')" class="w-full sm:w-auto">
              Batal
            </SecondaryButton>

            <PrimaryButton :disabled="form.processing" class="w-full sm:w-auto">
              <svg v-if="form.processing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ form.processing ? 'Mengirim Data...' : 'Kirim Pengajuan Lokasi' }}
            </PrimaryButton>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
