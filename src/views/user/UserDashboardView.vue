<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout.vue'
import Modal from '../../components/Modal.vue'
import DangerButton from '../../components/DangerButton.vue'
import SecondaryButton from '../../components/SecondaryButton.vue'
import api, { getFileUrl } from '../../api'
import { useAuthStore } from '../../stores/auth'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const authStore = useAuthStore()

// State
const activeTab = ref('my_report') // 'my_report' | 'catalog'
const reports = ref([])
const locations = ref([])
const approvedReports = ref([])
const loading = ref(true)
const submitting = ref(false)

// Catalog filters
const catalogSearch = ref('')
const catalogLocationFilter = ref('all')

// Modals
const showModal = ref(false)
const isEditMode = ref(false)
const showDeleteModal = ref(false)
const reportToDelete = ref(null)

// Form State
const form = ref({
  id_report: null,
  id_location: '',
  title: '',
  description: '',
  studentsList: [
    { name: '', nim: '', isLeader: true }
  ],
  file: null,
  fileName: '',
  fileSize: 0,
  existingFileName: '',
  existingFileSize: 0
})
const fileError = ref('')

// Searchable Location Selector State
const locationSearchQuery = ref('')
const isLocationDropdownOpen = ref(false)
const locationSelectorRef = ref(null)

const selectedLocationObj = computed(() => {
  if (!form.value.id_location) return null
  return locations.value.find(loc => loc.id_location === parseInt(form.value.id_location)) || null
})

const filteredLocationsList = computed(() => {
  const q = locationSearchQuery.value.trim().toLowerCase()
  if (!q) return locations.value
  return locations.value.filter(loc => {
    const nameMatch = loc.name_location?.toLowerCase().includes(q)
    const catMatch = loc.category?.name_category?.toLowerCase().includes(q)
    const deptMatch = loc.department?.name_department?.toLowerCase().includes(q)
    const descMatch = loc.description?.toLowerCase().includes(q)
    return nameMatch || catMatch || deptMatch || descMatch
  })
})

const selectLocationItem = (loc) => {
  form.value.id_location = loc.id_location
  locationSearchQuery.value = ''
  isLocationDropdownOpen.value = false
}

const clearSelectedLocation = () => {
  form.value.id_location = ''
  locationSearchQuery.value = ''
  isLocationDropdownOpen.value = true
}

const handleDocumentClick = (e) => {
  if (locationSelectorRef.value && !locationSelectorRef.value.contains(e.target)) {
    isLocationDropdownOpen.value = false
  }
}

// Fetch reports & locations
const fetchData = async () => {
  loading.value = true
  try {
    const [reportsRes, locationsRes, approvedRes] = await Promise.all([
      api.get('/api/reports'),
      api.get('/api/locations/approved'),
      api.get('/api/reports/approved')
    ])
    reports.value = reportsRes.data.data || []
    locations.value = locationsRes.data || []
    approvedReports.value = approvedRes.data.data || []
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    toast.error('Gagal memuat data laporan magang.')
  } finally {
    loading.value = false
  }
}

// User has report? (1 user = 1 report rule)
const hasReport = computed(() => reports.value.length > 0)
const myReport = computed(() => reports.value[0] || null)

// Filtered catalog of approved reports
const filteredCatalog = computed(() => {
  return approvedReports.value.filter(rep => {
    // Filter location
    if (catalogLocationFilter.value !== 'all' && rep.id_location !== parseInt(catalogLocationFilter.value)) {
      return false
    }
    // Search query
    if (catalogSearch.value.trim()) {
      const q = catalogSearch.value.toLowerCase()
      const titleMatch = rep.title?.toLowerCase().includes(q)
      const locMatch = rep.location?.name_location?.toLowerCase().includes(q)
      const studentMatch = rep.students?.toLowerCase().includes(q)
      const descMatch = rep.description?.toLowerCase().includes(q)
      if (!titleMatch && !locMatch && !studentMatch && !descMatch) return false
    }
    return true
  })
})

// Manage student rows in form
const addStudentRow = () => {
  form.value.studentsList.push({ name: '', nim: '', isLeader: false })
}

const removeStudentRow = (index) => {
  if (form.value.studentsList.length > 1) {
    form.value.studentsList.splice(index, 1)
  }
}

// File handling
const handleFileChange = (e) => {
  const file = e.target.files?.[0]
  fileError.value = ''
  if (!file) return

  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
    fileError.value = 'Hanya dokumen berkas PDF yang diperbolehkan (.pdf)'
    form.value.file = null
    form.value.fileName = ''
    form.value.fileSize = 0
    return
  }

  if (file.size > 25 * 1024 * 1024) {
    fileError.value = 'Ukuran file tidak boleh melebihi 25 MB'
    form.value.file = null
    form.value.fileName = ''
    form.value.fileSize = 0
    return
  }

  form.value.file = file
  form.value.fileName = file.name
  form.value.fileSize = file.size
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Open modal for new upload (only if user does not have a report)
const openUploadModal = () => {
  if (hasReport.value) {
    toast.warning('Anda sudah memiliki laporan magang. Gunakan tombol perbarui / revisi laporan.')
    return
  }
  isEditMode.value = false
  form.value = {
    id_report: null,
    id_location: '',
    title: '',
    description: '',
    studentsList: [
      { name: authStore.user?.name || '', nim: authStore.user?.username || '', isLeader: true }
    ],
    file: null,
    fileName: '',
    fileSize: 0,
    existingFileName: '',
    existingFileSize: 0
  }
  fileError.value = ''
  locationSearchQuery.value = ''
  isLocationDropdownOpen.value = false
  showModal.value = true
}

// Open modal for editing / revising existing report
const openEditModal = (report) => {
  isEditMode.value = true
  
  // Parse existing students string back to array
  const lines = (report.students || '').split('\n').filter(l => l.trim())
  const parsed = []
  for (const line of lines) {
    // line format: "1. Budi - NIM: 12345 (Mahasiswa Utama / Ketua)"
    const clean = line.replace(/^\d+\.\s*/, '').trim()
    const parts = clean.split('- NIM:')
    if (parts.length >= 2) {
      const name = parts[0].trim()
      const nim = parts[1].replace(/\(Mahasiswa Utama \/ Ketua\)/i, '').trim()
      parsed.push({ name, nim, isLeader: parsed.length === 0 })
    } else {
      parsed.push({ name: clean, nim: '', isLeader: parsed.length === 0 })
    }
  }

  if (parsed.length === 0) {
    parsed.push({ name: authStore.user?.name || '', nim: authStore.user?.username || '', isLeader: true })
  }

  form.value = {
    id_report: report.id_report,
    id_location: report.id_location,
    title: report.title,
    description: report.description || '',
    studentsList: parsed,
    file: null,
    fileName: '',
    fileSize: 0,
    existingFileName: report.file_name || 'Dokumen PDF Laporan',
    existingFileSize: report.file_size || 0
  }
  fileError.value = ''
  locationSearchQuery.value = ''
  isLocationDropdownOpen.value = false
  showModal.value = true
}

// Submit Form (Create or Update)
const submitForm = async () => {
  if (!form.value.id_location) {
    toast.error('Silakan pilih tempat magang terlebih dahulu.')
    return
  }
  if (!form.value.title.trim()) {
    toast.error('Judul laporan magang wajib diisi.')
    return
  }

  // Validate student entries
  const validStudents = form.value.studentsList.filter(s => s.name.trim() && s.nim.trim())
  if (validStudents.length === 0) {
    toast.error('Wajib mencantumkan minimal 1 nama mahasiswa (paling atas) beserta NIM-nya.')
    return
  }

  // If new report, file is required
  if (!isEditMode.value && !form.value.file) {
    toast.error('Silakan unggah dokumen PDF laporan magang.')
    return
  }

  // Build students string
  const studentsFormatted = validStudents.map((s, idx) => {
    const roleTag = idx === 0 ? ' (Mahasiswa Utama / Ketua)' : ''
    return `${idx + 1}. ${s.name.trim()} - NIM: ${s.nim.trim()}${roleTag}`
  }).join('\n')

  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('id_location', form.value.id_location)
    formData.append('title', form.value.title.trim())
    formData.append('description', form.value.description.trim())
    formData.append('students', studentsFormatted)
    if (form.value.file) {
      formData.append('file', form.value.file)
    }

    if (isEditMode.value) {
      // Update / Revisi Laporan
      await api.put(`/api/reports/${form.value.id_report}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Laporan magang berhasil diperbarui dan diajukan ulang ke admin!')
    } else {
      // Upload Laporan Baru
      await api.post('/api/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Laporan magang berhasil diunggah! Menunggu verifikasi admin.')
    }

    showModal.value = false
    await fetchData()
  } catch (error) {
    console.error('Error saving report:', error)
    const msg = error.response?.data?.message || 'Gagal menyimpan laporan magang.'
    toast.error(msg)
  } finally {
    submitting.value = false
  }
}

// Delete Report
const confirmDelete = (report) => {
  reportToDelete.value = report
  showDeleteModal.value = true
}

const deleteReport = async () => {
  if (!reportToDelete.value) return
  submitting.value = true
  try {
    await api.delete(`/api/reports/${reportToDelete.value.id_report}`)
    toast.success('Laporan magang berhasil dihapus. Sekarang Anda dapat mengunggah laporan baru.')
    showDeleteModal.value = false
    reportToDelete.value = null
    await fetchData()
  } catch (error) {
    console.error('Error deleting report:', error)
    const msg = error.response?.data?.message || 'Gagal menghapus laporan.'
    toast.error(msg)
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchData()
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', handleDocumentClick)
})
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              Portal Mahasiswa
            </span>
          </div>
          <h1 class="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mt-1">
            Dashboard Laporan Magang
          </h1>
          <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Selamat datang, <span class="font-semibold text-neutral-800 dark:text-neutral-200">{{ authStore.user?.name || authStore.user?.username }}</span>. Kelola laporan Anda dan jelajahi referensi laporan magang adik tingkat.
          </p>
        </div>

        <!-- Tombol Aksi Header -->
        <div class="shrink-0 flex items-center gap-2.5">
          <!-- Tombol Unggah (Hanya jika belum punya laporan) -->
          <button
            v-if="!hasReport"
            @click="openUploadModal"
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-linear-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-neutral-900 shadow-md shadow-amber-500/10 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <i class="fas fa-file-arrow-up text-base"></i>
            <span>Unggah Laporan Magang</span>
          </button>

          <!-- Tombol Revisi (Jika sudah punya laporan dan belum approved) -->
          <button
            v-else-if="myReport && myReport.status !== 'approved'"
            @click="openEditModal(myReport)"
            class="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-linear-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-neutral-900 shadow-md shadow-amber-500/10 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            <i class="fas fa-pen-to-square text-base"></i>
            <span>Perbarui / Revisi Laporan</span>
          </button>

          <!-- Status Selesai jika Disetujui -->
          <div
            v-else-if="myReport && myReport.status === 'approved'"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
          >
            <i class="fas fa-circle-check text-sm"></i>
            <span>Laporan Telah Disetujui</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Content Area -->
    <div class="space-y-6">
      <!-- Tab Navigation Switcher -->
      <div class="flex flex-wrap items-center gap-2 border-b border-neutral-200 dark:border-neutral-700 pb-3">
        <button
          @click="activeTab = 'my_report'"
          class="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
          :class="activeTab === 'my_report' ? 'bg-primary text-neutral-900 shadow-sm' : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'"
        >
          <i class="fas fa-file-lines"></i>
          <span>Laporan Magang Saya</span>
          <span v-if="hasReport" class="ml-1 w-2.5 h-2.5 rounded-full" :class="myReport.status === 'approved' ? 'bg-emerald-500' : myReport.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'"></span>
        </button>

        <button
          @click="activeTab = 'catalog'"
          class="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
          :class="activeTab === 'catalog' ? 'bg-primary text-neutral-900 shadow-sm' : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700'"
        >
          <i class="fas fa-book-bookmark text-amber-500"></i>
          <span>Katalog Referensi Laporan (Pedoman PKL)</span>
          <span class="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
            {{ approvedReports.length }}
          </span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-16 text-center">
        <svg class="animate-spin h-8 w-8 text-primary mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-xs font-medium text-neutral-500">Memuat data laporan magang...</p>
      </div>

      <!-- ================= TAB 1: LAPORAN SAYA ================= -->
      <div v-else-if="activeTab === 'my_report'" class="space-y-6">
        <!-- Info Ketentuan Laporan -->
        <div class="bg-linear-to-r from-amber-500/10 via-amber-400/5 to-transparent border-l-4 border-amber-500 dark:border-amber-400 p-4 rounded-r-2xl flex items-start gap-3.5">
          <i class="fas fa-circle-info text-amber-600 dark:text-amber-400 text-lg mt-0.5 shrink-0"></i>
          <div class="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
            <p class="font-bold text-neutral-900 dark:text-white">Ketentuan 1 Mahasiswa 1 Laporan Magang:</p>
            <p class="mt-0.5 text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Setiap akun mahasiswa mengunggah 1 laporan magang. Jika admin meminta revisi, gunakan fitur <b>Perbarui / Revisi Laporan</b>. Pastikan dokumen PDF <b>mencantumkan nama mahasiswa paling atas beserta NIM</b> dari seluruh anggota magang untuk menghindari redundansi pengiriman berkas. Setelah disetujui, laporan Anda akan tampil di katalog referensi bagi adik tingkat.
            </p>
          </div>
        </div>

        <!-- Empty State: Belum Ada Laporan (Tampilkan tombol unggah) -->
        <div
          v-if="!hasReport"
          class="bg-white dark:bg-neutral-800 rounded-3xl p-10 sm:p-14 text-center border border-neutral-200 dark:border-neutral-700 shadow-xs"
        >
          <div class="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center text-2xl mb-4">
            <i class="fas fa-file-arrow-up"></i>
          </div>
          <h3 class="text-lg font-bold text-neutral-900 dark:text-white">Anda Belum Mengunggah Laporan Magang</h3>
          <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1.5 max-w-md mx-auto leading-relaxed">
            Silakan pilih tempat magang Anda dan unggah berkas PDF laporan magang resmi untuk dicek dan diverifikasi oleh admin.
          </p>
          <button
            @click="openUploadModal"
            class="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-primary hover:bg-primary-dark text-neutral-900 shadow-md cursor-pointer transition"
          >
            <i class="fas fa-file-arrow-up"></i> Unggah Laporan Sekarang
          </button>
        </div>

        <!-- Detail Laporan Magang Aktif (1 User = 1 Laporan) -->
        <div v-else class="space-y-6">
          <div class="bg-white dark:bg-neutral-800 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-700 shadow-xs">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-700">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-neutral-400">Status Laporan Magang Anda</span>
                <h2 class="text-base sm:text-lg font-black text-neutral-900 dark:text-white mt-0.5">
                  {{ myReport.title }}
                </h2>
              </div>

              <!-- Status Pill -->
              <div>
                <span
                  v-if="myReport.status === 'approved'"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                >
                  <i class="fas fa-check-circle"></i> Sesuai Syarat (Disetujui)
                </span>
                <span
                  v-else-if="myReport.status === 'rejected'"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
                >
                  <i class="fas fa-triangle-exclamation"></i> Belum Sesuai (Perlu Revisi)
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                >
                  <span class="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span> Sedang Diverifikasi Admin
                </span>
              </div>
            </div>

            <!-- Feedback Alert -->
            <div
              v-if="myReport.status === 'rejected'"
              class="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-3.5"
            >
              <div class="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <i class="fas fa-circle-exclamation text-base"></i>
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-bold text-red-800 dark:text-red-300">
                  Laporan Perlu Direvisi
                </h4>
                <p class="text-xs text-red-700 dark:text-red-300/90 mt-1 leading-relaxed">
                  <b>Catatan Admin:</b> {{ myReport.feedback || 'Silakan sesuaikan dokumen laporan Anda dengan syarat yang berlaku.' }}
                </p>
                <div class="mt-3">
                  <button
                    @click="openEditModal(myReport)"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs cursor-pointer transition"
                  >
                    <i class="fas fa-pen-to-square"></i> Perbarui / Revisi Laporan Sekarang
                  </button>
                </div>
              </div>
            </div>

            <div
              v-else-if="myReport.status === 'approved'"
              class="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3.5"
            >
              <div class="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <i class="fas fa-circle-check text-base"></i>
              </div>
              <div>
                <h4 class="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  Laporan Magang Anda Telah Disetujui & Menjadi Referensi
                </h4>
                <p class="text-xs text-emerald-700 dark:text-emerald-300/90 mt-0.5">
                  Laporan Anda kini dapat dibaca oleh rekan dan adik tingkat sebagai pedoman magang di instansi terkait.
                  <span v-if="myReport.feedback"> Catatan: "{{ myReport.feedback }}"</span>
                </p>
              </div>
            </div>

            <div
              v-else
              class="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-3.5"
            >
              <div class="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <i class="fas fa-hourglass-half text-base"></i>
              </div>
              <div class="flex-1">
                <h4 class="text-sm font-bold text-amber-800 dark:text-amber-300">
                  Laporan Sedang Dalam Antrean Verifikasi
                </h4>
                <p class="text-xs text-amber-700 dark:text-amber-300/90 mt-0.5 leading-relaxed">
                  Admin akan memeriksa nama mahasiswa paling atas, NIM, dan isi dokumen PDF Anda. Anda masih dapat memperbarui data jika terdapat kesalahan.
                </p>
              </div>
            </div>

            <!-- Rincian Informasi Laporan Card -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <!-- Left: Tempat Magang & Mahasiswa -->
              <div class="space-y-4">
                <!-- Tempat Magang -->
                <div class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-700/60">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Tempat Magang Terpilih
                  </span>
                  <div class="flex items-center gap-2">
                    <i class="fas fa-location-dot text-amber-500 text-sm"></i>
                    <span class="text-sm font-bold text-neutral-900 dark:text-white">
                      {{ myReport.location?.name_location || 'Lokasi Magang' }}
                    </span>
                  </div>
                  <div class="mt-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <span v-if="myReport.location?.category?.name_category" class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                      {{ myReport.location.category.name_category }}
                    </span>
                    <span>Diajukan: {{ formatDate(myReport.createdAt) }}</span>
                  </div>
                </div>

                <!-- Deskripsi Ringkasan -->
                <div v-if="myReport.description" class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-700/60">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Ringkasan / Keterangan
                  </span>
                  <p class="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    {{ myReport.description }}
                  </p>
                </div>

                <!-- Mahasiswa Penyusun -->
                <div class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-700/60">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 mb-2">
                    <i class="fas fa-users text-primary text-xs"></i> Mahasiswa Penyusun (Sesuai PDF):
                  </span>
                  <pre class="text-xs font-sans whitespace-pre-line text-neutral-800 dark:text-neutral-200 leading-relaxed">{{ myReport.students }}</pre>
                </div>
              </div>

              <!-- Right: Berkas PDF & Aksi Perbarui / Hapus -->
              <div class="space-y-4 flex flex-col justify-between">
                <div class="p-5 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3">
                  <span class="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                    Dokumen Berkas Laporan
                  </span>
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-xl shrink-0">
                      <i class="fas fa-file-pdf"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                      <h5 class="text-xs sm:text-sm font-bold text-neutral-900 dark:text-white truncate">
                        {{ myReport.file_name || 'Dokumen Laporan.pdf' }}
                      </h5>
                      <p class="text-xs text-neutral-400">{{ formatFileSize(myReport.file_size) }}</p>
                    </div>
                  </div>

                  <div class="pt-2">
                    <a
                      :href="getFileUrl(myReport.file_path)"
                      target="_blank"
                      class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-700 text-white shadow-xs transition"
                    >
                      <i class="fas fa-arrow-up-right-from-square"></i>
                      <span>Buka / Unduh Dokumen PDF</span>
                    </a>
                  </div>
                </div>

                <!-- Action Bar Bawah -->
                <div class="flex items-center justify-end gap-3 pt-2">
                  <!-- Tombol Hapus (hanya jika pending) -->
                  <button
                    v-if="myReport.status === 'pending'"
                    @click="confirmDelete(myReport)"
                    class="px-4 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition cursor-pointer"
                  >
                    <i class="fas fa-trash-can mr-1"></i> Batalkan & Hapus Laporan
                  </button>

                  <!-- Tombol Perbarui / Revisi -->
                  <button
                    v-if="myReport.status !== 'approved'"
                    @click="openEditModal(myReport)"
                    class="px-5 py-2.5 rounded-xl text-xs font-bold bg-primary hover:bg-primary-dark text-neutral-900 transition flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <i class="fas fa-pen-to-square"></i>
                    <span>{{ myReport.status === 'rejected' ? 'Revisi Laporan Sekarang' : 'Perbarui Data Laporan' }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= TAB 2: KATALOG REFERENSI LAPORAN (DISETUJUI) ================= -->
      <div v-else-if="activeTab === 'catalog'" class="space-y-6">
        <!-- Banner Katalog -->
        <div class="p-6 rounded-3xl bg-linear-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-primary/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <h3 class="text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-book-bookmark text-amber-500"></i>
              Katalog Referensi & Pedoman Laporan Magang
            </h3>
            <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
              Kumpulan laporan magang mahasiswa yang telah diverifikasi dan disetujui oleh admin. Gunakan laporan ini sebagai pedoman struktur, format, dan referensi penyusunan laporan PKL Anda.
            </p>
          </div>
          <div class="text-right shrink-0">
            <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-extrabold text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              <i class="fas fa-circle-check"></i> {{ approvedReports.length }} Laporan Tersedia
            </span>
          </div>
        </div>

        <!-- Filter & Pencarian Katalog -->
        <div class="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <!-- Search Input -->
          <div class="relative w-full sm:flex-1">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
              <i class="fas fa-search text-xs"></i>
            </span>
            <input
              v-model="catalogSearch"
              type="text"
              placeholder="Cari berdasarkan judul laporan, instansi tempat magang, nama mahasiswa, atau NIM..."
              class="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700/50 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>

          <!-- Filter Lokasi -->
          <div class="w-full sm:w-64">
            <select
              v-model="catalogLocationFilter"
              class="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
            >
              <option value="all">Semua Tempat Magang</option>
              <option v-for="loc in locations" :key="loc.id_location" :value="loc.id_location">
                {{ loc.name_location }}
              </option>
            </select>
          </div>
        </div>

        <!-- Empty State Katalog -->
        <div
          v-if="filteredCatalog.length === 0"
          class="bg-white dark:bg-neutral-800 rounded-3xl p-12 text-center border border-neutral-200 dark:border-neutral-700 shadow-xs"
        >
          <div class="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center text-xl mb-3">
            <i class="fas fa-folder-open"></i>
          </div>
          <h4 class="text-base font-bold text-neutral-900 dark:text-white">Tidak Ada Laporan Ditemukan</h4>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
            {{ catalogSearch || catalogLocationFilter !== 'all' ? 'Tidak ada laporan referensi yang cocok dengan kriteria pencarian.' : 'Belum ada laporan magang yang berstatus disetujui saat ini.' }}
          </p>
        </div>

        <!-- Grid Katalog Laporan Disetujui -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div
            v-for="item in filteredCatalog"
            :key="item.id_report"
            class="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
          >
            <!-- Header Card -->
            <div class="space-y-2.5">
              <div class="flex items-start justify-between gap-3">
                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200">
                  <i class="fas fa-building text-amber-500 text-xs"></i>
                  {{ item.location?.name_location || 'Tempat Magang' }}
                </span>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <i class="fas fa-circle-check text-[10px]"></i> Terverifikasi
                </span>
              </div>

              <!-- Title -->
              <h4 class="text-sm font-extrabold text-neutral-900 dark:text-white leading-snug line-clamp-2">
                {{ item.title }}
              </h4>

              <p v-if="item.description" class="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                {{ item.description }}
              </p>

              <!-- Penyusun -->
              <div class="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-700/60">
                <div class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1 flex items-center gap-1.5">
                  <i class="fas fa-users text-primary text-[10px]"></i> Mahasiswa Penyusun:
                </div>
                <pre class="text-xs font-sans whitespace-pre-line text-neutral-800 dark:text-neutral-200 leading-relaxed">{{ item.students }}</pre>
              </div>
            </div>

            <!-- Card Bottom: Link Download PDF -->
            <div class="pt-3 border-t border-neutral-100 dark:border-neutral-700/60 flex items-center justify-between gap-3">
              <span class="text-[11px] text-neutral-400">
                Diverifikasi: {{ formatDate(item.verified_at || item.createdAt) }}
              </span>

              <a
                :href="getFileUrl(item.file_path)"
                target="_blank"
                class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 transition shadow-2xs"
              >
                <i class="fas fa-file-pdf"></i>
                <span>Baca Laporan PDF</span>
                <i class="fas fa-arrow-up-right-from-square text-[10px]"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form (Upload Baru atau Perbarui / Revisi) -->
    <Modal :show="showModal" @close="showModal = false" max-width="2xl">
      <div class="flex flex-col max-h-[90vh]">
        <!-- Sticky Modal Header -->
        <div class="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700 flex items-center justify-between shrink-0 bg-white dark:bg-neutral-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg shrink-0">
              <i :class="isEditMode ? 'fas fa-pen-to-square' : 'fas fa-file-arrow-up'"></i>
            </div>
            <div>
              <h2 class="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white leading-tight">
                {{ isEditMode ? 'Perbarui / Revisi Laporan Magang' : 'Unggah Laporan Magang' }}
              </h2>
              <p class="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {{ isEditMode ? 'Perbarui data atau unggah dokumen PDF perbaikan untuk diverifikasi ulang' : 'Pilih tempat magang dan unggah dokumen PDF resmi' }}
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="showModal = false"
            class="w-9 h-9 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center justify-center transition cursor-pointer shrink-0"
            title="Tutup Modal"
          >
            <i class="fas fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Form with scrollable body -->
        <form @submit.prevent="submitForm" class="flex flex-col flex-1 min-h-0">
          <div class="px-6 py-5 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
            <!-- Step 1: Searchable Tempat Magang -->
            <div ref="locationSelectorRef" class="space-y-1.5 relative">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  1. Pilih Tempat Magang <span class="text-red-500">*</span>
                </label>
                <span v-if="!selectedLocationObj" class="text-[11px] text-neutral-400">
                  Tersedia {{ locations.length }} tempat magang
                </span>
              </div>

              <!-- State 1: Tempat magang terpilih (Card Tampilan Terpilih) -->
              <div
                v-if="selectedLocationObj"
                class="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border-2 border-primary/60 dark:border-primary/40 flex items-center justify-between gap-3 shadow-2xs"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-xl bg-primary text-neutral-900 flex items-center justify-center font-bold shrink-0 shadow-xs">
                    <i class="fas fa-building text-sm"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <h4 class="text-xs sm:text-sm font-extrabold text-neutral-900 dark:text-white truncate">
                        {{ selectedLocationObj.name_location }}
                      </h4>
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200">
                        {{ selectedLocationObj.category?.name_category || 'Umum' }}
                      </span>
                    </div>
                    <p class="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5 flex items-center gap-1">
                      <i class="fas fa-location-dot text-amber-500 text-[10px]"></i>
                      <span class="truncate">{{ selectedLocationObj.description || 'Lokasi PKL Terverifikasi' }}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  @click="clearSelectedLocation"
                  class="px-3 py-1.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-200 shrink-0 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Cari tempat magang lain"
                >
                  <i class="fas fa-magnifying-glass text-[11px] text-amber-600"></i>
                  <span>Ganti / Cari</span>
                </button>
              </div>

              <!-- State 2: Search Input & Autocomplete Dropdown -->
              <div v-else class="relative">
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <i class="fas fa-magnifying-glass text-xs"></i>
                  </div>
                  <input
                    v-model="locationSearchQuery"
                    @focus="isLocationDropdownOpen = true"
                    type="text"
                    placeholder="Ketik untuk mencari tempat magang (contoh: Telkom, Pertamina, Bank, Software)..."
                    class="w-full pl-9 pr-8 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-xs sm:text-sm placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/70 transition"
                  />
                  <button
                    v-if="locationSearchQuery"
                    @click="locationSearchQuery = ''"
                    type="button"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <i class="fas fa-xmark text-xs"></i>
                  </button>
                </div>

                <!-- Dropdown List -->
                <div
                  v-if="isLocationDropdownOpen"
                  class="absolute z-30 left-0 right-0 mt-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-2xl max-h-56 overflow-y-auto"
                >
                  <div class="p-2.5 border-b border-neutral-100 dark:border-neutral-700/60 text-[11px] font-semibold text-neutral-400 flex items-center justify-between">
                    <span>{{ filteredLocationsList.length }} tempat ditemukan</span>
                    <span v-if="locationSearchQuery" class="text-amber-600 font-bold">Filter aktif</span>
                  </div>

                  <div v-if="filteredLocationsList.length > 0">
                    <button
                      v-for="loc in filteredLocationsList"
                      :key="loc.id_location"
                      type="button"
                      @click="selectLocationItem(loc)"
                      class="w-full text-left p-3 hover:bg-amber-50/70 dark:hover:bg-neutral-700/60 border-b border-neutral-100 dark:border-neutral-700/40 last:border-b-0 transition flex items-start gap-3 cursor-pointer group"
                    >
                      <div class="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-700 group-hover:bg-primary text-neutral-600 group-hover:text-neutral-900 flex items-center justify-center text-xs shrink-0 transition">
                        <i class="fas fa-building"></i>
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2">
                          <p class="text-xs font-bold text-neutral-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                            {{ loc.name_location }}
                          </p>
                          <span class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 shrink-0">
                            {{ loc.category?.name_category || 'Umum' }}
                          </span>
                        </div>
                        <p class="text-[11px] text-neutral-400 truncate mt-0.5">
                          <span v-if="loc.department" class="mr-1.5 text-neutral-500 font-medium">[{{ loc.department.name_department }}]</span>
                          {{ loc.description || 'Tidak ada deskripsi' }}
                        </p>
                      </div>
                    </button>
                  </div>

                  <div v-else class="p-6 text-center text-xs text-neutral-400">
                    <i class="fas fa-building-circle-xmark text-2xl mb-1.5 text-neutral-300 dark:text-neutral-600 block"></i>
                    <span>Tidak ada tempat magang dengan kata kunci "{{ locationSearchQuery }}".</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Judul Laporan -->
            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                2. Judul Laporan Magang <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="Contoh: Laporan Akhir Praktik Kerja Lapangan Divisi IT PT Telkom"
                class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              />
            </div>

            <!-- Step 3: Mahasiswa & NIM (Wajib Nama Paling Atas) -->
            <div class="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <label class="block text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    3. Mahasiswa Penyusun Laporan (Wajib Sesuai PDF) <span class="text-red-500">*</span>
                  </label>
                  <p class="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Wajib mencantumkan nama mahasiswa paling atas beserta NIM-nya persis dari PDF laporan.
                  </p>
                </div>
                <button
                  type="button"
                  @click="addStudentRow"
                  class="px-2.5 py-1 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/40 rounded-lg hover:bg-amber-200 transition cursor-pointer shrink-0"
                >
                  <i class="fas fa-plus mr-1"></i> Tambah Anggota
                </button>
              </div>

              <!-- Student inputs list -->
              <div class="space-y-2 mt-2">
                <div
                  v-for="(student, idx) in form.studentsList"
                  :key="idx"
                  class="flex items-center gap-2"
                >
                  <div class="w-6 text-center text-xs font-bold text-neutral-400 shrink-0">
                    {{ idx + 1 }}.
                  </div>
                  <input
                    v-model="student.name"
                    type="text"
                    required
                    :placeholder="idx === 0 ? 'Nama Mahasiswa Paling Atas (Ketua)' : 'Nama Anggota'"
                    class="flex-1 px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/60"
                  />
                  <input
                    v-model="student.nim"
                    type="text"
                    required
                    placeholder="NIM"
                    class="w-28 sm:w-36 px-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/60"
                  />
                  <button
                    v-if="form.studentsList.length > 1"
                    type="button"
                    @click="removeStudentRow(idx)"
                    class="p-2 text-neutral-400 hover:text-red-500 transition cursor-pointer"
                    title="Hapus baris"
                  >
                    <i class="fas fa-trash-can text-xs"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Step 4: Ringkasan / Keterangan -->
            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                4. Ringkasan / Catatan Laporan (Opsional)
              </label>
              <textarea
                v-model="form.description"
                rows="2"
                placeholder="Tuliskan ringkasan singkat kegiatan atau topik laporan magang..."
                class="w-full px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
              ></textarea>
            </div>

            <!-- Step 5: Dokumen PDF Laporan -->
            <div>
              <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                5. Dokumen Laporan Magang (Format PDF)
                <span v-if="!isEditMode" class="text-red-500">*</span>
                <span v-else class="text-neutral-400 font-normal">(Opsional jika tidak mengganti berkas PDF)</span>
              </label>

              <!-- Tampilkan info file lama jika dalam mode edit -->
              <div v-if="isEditMode && form.existingFileName && !form.fileName" class="mb-2 p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-700/60 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2 truncate">
                  <i class="fas fa-file-pdf text-red-500 text-sm"></i>
                  <span class="truncate font-semibold text-neutral-800 dark:text-neutral-200">Berkas saat ini: {{ form.existingFileName }}</span>
                  <span class="text-neutral-400">({{ formatFileSize(form.existingFileSize) }})</span>
                </div>
                <span class="text-[11px] text-amber-600 dark:text-amber-400 font-bold shrink-0">Tetap digunakan</span>
              </div>

              <div class="border-2 border-dashed border-neutral-300 dark:border-neutral-600 hover:border-amber-400 dark:hover:border-amber-400 rounded-2xl p-5 text-center transition bg-neutral-50/50 dark:bg-neutral-900/30 relative">
                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  :required="!isEditMode && !form.existingFileName"
                  @change="handleFileChange"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div v-if="!form.fileName">
                  <i class="fas fa-file-pdf text-3xl text-red-500 mb-2"></i>
                  <p class="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {{ isEditMode ? 'Klik atau seret file PDF baru jika ingin mengganti berkas laporan' : 'Klik atau seret file PDF laporan ke sini' }}
                  </p>
                  <p class="text-[11px] text-neutral-400 mt-0.5">Maksimal ukuran file 25 MB (.pdf)</p>
                </div>
                <div v-else class="flex items-center justify-center gap-3">
                  <i class="fas fa-file-pdf text-2xl text-red-500"></i>
                  <div class="text-left">
                    <p class="text-xs font-bold text-neutral-900 dark:text-white truncate max-w-70">
                      {{ form.fileName }}
                    </p>
                    <p class="text-[11px] text-neutral-400">{{ formatFileSize(form.fileSize) }} (Berkas Baru)</p>
                  </div>
                  <span class="text-xs text-amber-600 dark:text-amber-400 font-semibold underline ml-2">Ganti File</span>
                </div>
              </div>
              <p v-if="fileError" class="text-xs text-red-500 mt-1 font-medium">{{ fileError }}</p>
            </div>

            <!-- Notice Revisi -->
            <div v-if="isEditMode" class="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
              <i class="fas fa-triangle-exclamation text-amber-500 shrink-0"></i>
              <span>Menyimpan perbaikan revisi akan mengajukan ulang status laporan ke <b>Menunggu Verifikasi Admin</b>.</span>
            </div>
          </div>

          <!-- Sticky Modal Action Buttons Footer -->
          <div class="px-6 py-4 border-t border-neutral-100 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-800/80 flex items-center justify-end gap-3 shrink-0">
            <SecondaryButton @click="showModal = false" type="button" :disabled="submitting">
              Batal
            </SecondaryButton>
            <button
              type="submit"
              :disabled="submitting"
              class="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-primary hover:bg-primary-dark text-neutral-900 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <svg v-if="submitting" class="animate-spin h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ submitting ? 'Menyimpan...' : (isEditMode ? 'Simpan & Ajukan Ulang' : 'Kirim Laporan') }}</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Modal Konfirmasi Hapus Laporan -->
    <Modal :show="showDeleteModal" @close="showDeleteModal = false" max-width="md">
      <div class="p-6">
        <div class="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center text-xl mb-3">
          <i class="fas fa-trash-can"></i>
        </div>
        <h3 class="text-base font-extrabold text-center text-neutral-900 dark:text-white">Batalkan & Hapus Laporan?</h3>
        <p class="text-xs text-center text-neutral-500 dark:text-neutral-400 mt-1">
          Laporan <b>{{ reportToDelete?.title }}</b> akan dibatalkan dan dihapus permanen. Setelah dihapus, Anda dapat mengunggah laporan baru.
        </p>

        <div class="mt-6 flex items-center justify-end gap-3">
          <SecondaryButton @click="showDeleteModal = false" :disabled="submitting">
            Kembali
          </SecondaryButton>
          <DangerButton @click="deleteReport" :disabled="submitting">
            {{ submitting ? 'Menghapus...' : 'Ya, Batalkan & Hapus' }}
          </DangerButton>
        </div>
      </div>
    </Modal>
  </AuthenticatedLayout>
</template>
