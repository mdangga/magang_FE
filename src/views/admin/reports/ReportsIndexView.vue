<script setup>
import { ref, computed, onMounted } from 'vue'
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout.vue'
import Modal from '../../../components/Modal.vue'
import DangerButton from '../../../components/DangerButton.vue'
import SecondaryButton from '../../../components/SecondaryButton.vue'
import PrimaryButton from '../../../components/PrimaryButton.vue'
import api, { getFileUrl } from '../../../api'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// State
const reports = ref([])
const locations = ref([])
const loading = ref(true)
const submitting = ref(false)

// Filters
const filterStatus = ref('all')
const filterLocation = ref('all')
const searchQuery = ref('')

// Modals
const showVerifyModal = ref(false)
const showDeleteModal = ref(false)
const activeReport = ref(null)

// Verify Form State
const verifyForm = ref({
  status: 'approved',
  feedback: ''
})

// Fetch all reports & locations
const fetchData = async () => {
  loading.value = true
  try {
    const [reportsRes, locationsRes] = await Promise.all([
      api.get('/api/reports'),
      api.get('/api/locations')
    ])
    reports.value = reportsRes.data.data || []
    locations.value = locationsRes.data.data || []
  } catch (error) {
    console.error('Error fetching admin reports:', error)
    toast.error('Gagal mengambil data laporan magang.')
  } finally {
    loading.value = false
  }
}

// Stats
const totalReports = computed(() => reports.value.length)
const pendingReports = computed(() => reports.value.filter(r => r.status === 'pending').length)
const approvedReports = computed(() => reports.value.filter(r => r.status === 'approved').length)
const rejectedReports = computed(() => reports.value.filter(r => r.status === 'rejected').length)

// Filtered reports
const filteredReports = computed(() => {
  return reports.value.filter(report => {
    // Status filter
    if (filterStatus.value !== 'all' && report.status !== filterStatus.value) {
      return false
    }
    // Location filter
    if (filterLocation.value !== 'all' && report.id_location !== parseInt(filterLocation.value)) {
      return false
    }
    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase()
      const titleMatch = report.title?.toLowerCase().includes(q)
      const locMatch = report.location?.name_location?.toLowerCase().includes(q)
      const studentMatch = report.students?.toLowerCase().includes(q)
      const userMatch = report.user?.username?.toLowerCase().includes(q) || report.user?.name?.toLowerCase().includes(q)
      if (!titleMatch && !locMatch && !studentMatch && !userMatch) return false
    }
    return true
  })
})

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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Open verification modal
const openVerifyModal = (report) => {
  activeReport.value = report
  verifyForm.value = {
    status: report.status === 'pending' ? 'approved' : report.status,
    feedback: report.feedback || ''
  }
  showVerifyModal.value = true
}

// Submit verification
const submitVerification = async () => {
  if (!activeReport.value) return
  if (verifyForm.value.status === 'rejected' && !verifyForm.value.feedback.trim()) {
    toast.error('Wajib memberikan alasan atau catatan revisi jika laporan ditolak.')
    return
  }

  submitting.value = true
  try {
    await api.patch(`/api/reports/${activeReport.value.id_report}/verify`, {
      status: verifyForm.value.status,
      feedback: verifyForm.value.feedback.trim()
    })

    toast.success('Status verifikasi laporan berhasil diperbarui.')
    showVerifyModal.value = false
    activeReport.value = null
    await fetchData()
  } catch (error) {
    console.error('Error verifying report:', error)
    const msg = error.response?.data?.message || 'Gagal memperbarui verifikasi laporan.'
    toast.error(msg)
  } finally {
    submitting.value = false
  }
}

// Confirm Delete
const confirmDelete = (report) => {
  activeReport.value = report
  showDeleteModal.value = true
}

// Delete Report
const deleteReport = async () => {
  if (!activeReport.value) return
  submitting.value = true
  try {
    await api.delete(`/api/reports/${activeReport.value.id_report}`)
    toast.success('Laporan berhasil dihapus.')
    showDeleteModal.value = false
    activeReport.value = null
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
})
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
              Admin Verifikasi
            </span>
          </div>
          <h1 class="text-2xl font-black tracking-tight text-neutral-900 dark:text-white mt-1">
            Verifikasi Laporan Magang
          </h1>
          <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Periksa kelengkapan syarat laporan magang mahasiswa (Nama paling atas, NIM, dan isi dokumen PDF).
          </p>
        </div>

        <button
          @click="fetchData"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition cursor-pointer self-start sm:self-auto"
        >
          <i class="fas fa-arrows-rotate text-xs"></i>
          <span>Muat Ulang</span>
        </button>
      </div>
    </template>

    <!-- Main Content -->
    <div class="space-y-6">
      <!-- Stats Overview -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total -->
        <div class="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl shrink-0">
            <i class="fas fa-folder-open"></i>
          </div>
          <div>
            <div class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Total Laporan Masuk</div>
            <div class="text-2xl font-extrabold text-neutral-900 dark:text-white">{{ totalReports }}</div>
          </div>
        </div>

        <!-- Pending -->
        <div class="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xl shrink-0">
            <i class="fas fa-hourglass-half"></i>
          </div>
          <div>
            <div class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Perlu Verifikasi</div>
            <div class="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{{ pendingReports }}</div>
          </div>
        </div>

        <!-- Approved -->
        <div class="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0">
            <i class="fas fa-circle-check"></i>
          </div>
          <div>
            <div class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Sesuai Syarat</div>
            <div class="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{{ approvedReports }}</div>
          </div>
        </div>

        <!-- Rejected -->
        <div class="bg-white dark:bg-neutral-800 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center text-xl shrink-0">
            <i class="fas fa-circle-xmark"></i>
          </div>
          <div>
            <div class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Belum Sesuai / Ditolak</div>
            <div class="text-2xl font-extrabold text-red-600 dark:text-red-400">{{ rejectedReports }}</div>
          </div>
        </div>
      </div>

      <!-- Filters & Controls -->
      <div class="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-2">
          <!-- Filter Tabs -->
          <button
            @click="filterStatus = 'all'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer"
            :class="filterStatus === 'all' ? 'bg-primary text-neutral-900' : 'bg-neutral-100 dark:bg-neutral-700/60 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'"
          >
            Semua ({{ totalReports }})
          </button>
          <button
            @click="filterStatus = 'pending'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer"
            :class="filterStatus === 'pending' ? 'bg-amber-400 text-neutral-900' : 'bg-neutral-100 dark:bg-neutral-700/60 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'"
          >
            Menunggu ({{ pendingReports }})
          </button>
          <button
            @click="filterStatus = 'approved'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer"
            :class="filterStatus === 'approved' ? 'bg-emerald-500 text-white' : 'bg-neutral-100 dark:bg-neutral-700/60 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'"
          >
            Disetujui ({{ approvedReports }})
          </button>
          <button
            @click="filterStatus = 'rejected'"
            class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer"
            :class="filterStatus === 'rejected' ? 'bg-red-500 text-white' : 'bg-neutral-100 dark:bg-neutral-700/60 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'"
          >
            Ditolak ({{ rejectedReports }})
          </button>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-2">
          <!-- Filter Location -->
          <select
            v-model="filterLocation"
            class="w-full sm:w-48 px-3 py-1.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
          >
            <option value="all">Semua Lokasi</option>
            <option v-for="loc in locations" :key="loc.id_location" :value="loc.id_location">
              {{ loc.name_location }}
            </option>
          </select>

          <!-- Search Box -->
          <div class="relative w-full sm:w-56">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
              <i class="fas fa-search text-xs"></i>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari judul/mhs/NIM..."
              class="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-16 text-center">
        <svg class="animate-spin h-8 w-8 text-primary mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-xs font-medium text-neutral-500">Memuat data laporan magang...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredReports.length === 0"
        class="bg-white dark:bg-neutral-800 rounded-3xl p-12 text-center border border-neutral-200 dark:border-neutral-700 shadow-xs"
      >
        <div class="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center text-2xl mb-4">
          <i class="fas fa-inbox"></i>
        </div>
        <h3 class="text-base font-bold text-neutral-900 dark:text-white">Tidak Ada Laporan Ditemukan</h3>
        <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Belum ada laporan magang yang cocok dengan kriteria filter atau pencarian Anda.
        </p>
      </div>

      <!-- Table / Reports List -->
      <div v-else class="space-y-4">
        <div
          v-for="report in filteredReports"
          :key="report.id_report"
          class="bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-xs hover:shadow-md transition p-5 flex flex-col md:flex-row md:items-start justify-between gap-5"
        >
          <!-- Left Details -->
          <div class="space-y-3 flex-1 min-w-0">
            <!-- Badges Bar -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                <i class="fas fa-building text-amber-500"></i>
                {{ report.location?.name_location || 'Lokasi Magang' }}
              </span>
              <span v-if="report.location?.category?.name_category" class="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
                {{ report.location.category.name_category }}
              </span>
              <!-- Status Pill -->
              <span
                v-if="report.status === 'approved'"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
              >
                <i class="fas fa-check-circle"></i> Sesuai Syarat (Disetujui)
              </span>
              <span
                v-else-if="report.status === 'rejected'"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300"
              >
                <i class="fas fa-triangle-exclamation"></i> Belum Sesuai (Ditolak)
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
              >
                <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Menunggu Verifikasi
              </span>
            </div>

            <!-- Title & User Info -->
            <div>
              <h3 class="text-base font-extrabold text-neutral-900 dark:text-white">
                {{ report.title }}
              </h3>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Diunggah oleh: <b class="text-neutral-700 dark:text-neutral-300">{{ report.user?.name || report.user?.username }}</b> ({{ report.user?.username }}) pada {{ formatDate(report.createdAt) }}
              </p>
            </div>

            <!-- Students List -->
            <div class="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-700/60">
              <div class="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1 flex items-center gap-1.5">
                <i class="fas fa-id-card text-xs text-primary"></i> Mahasiswa Penyusun (Sesuai PDF):
              </div>
              <pre class="text-xs font-sans whitespace-pre-line text-neutral-800 dark:text-neutral-200 leading-relaxed">{{ report.students }}</pre>
            </div>

            <!-- Admin Feedback Display -->
            <div
              v-if="report.feedback"
              class="p-3 rounded-2xl text-xs flex items-start gap-2"
              :class="report.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'"
            >
              <i class="fas text-sm shrink-0 mt-0.5" :class="report.status === 'rejected' ? 'fa-circle-exclamation text-red-500' : 'fa-circle-check text-emerald-500'"></i>
              <div>
                <span class="font-bold">Catatan Verifikasi:</span>
                <p class="mt-0.5">{{ report.feedback }}</p>
              </div>
            </div>

            <!-- File PDF Link -->
            <div class="flex items-center gap-3 pt-1">
              <a
                :href="getFileUrl(report.file_path)"
                target="_blank"
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
              >
                <i class="fas fa-file-pdf text-sm"></i>
                <span>Buka Dokumen PDF</span>
                <span class="text-[10px] opacity-75">({{ formatFileSize(report.file_size) }})</span>
                <i class="fas fa-arrow-up-right-from-square text-[10px] ml-1"></i>
              </a>
            </div>
          </div>

          <!-- Right Actions -->
          <div class="flex md:flex-col items-center gap-2 shrink-0 border-t md:border-t-0 md:border-l border-neutral-100 dark:border-neutral-700/60 pt-3 md:pt-0 md:pl-5">
            <button
              @click="openVerifyModal(report)"
              class="w-full md:w-36 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary hover:bg-primary-dark text-neutral-900 shadow-xs cursor-pointer transition"
            >
              <i class="fas fa-signature text-xs"></i>
              <span>Verifikasi</span>
            </button>
            <button
              @click="confirmDelete(report)"
              class="w-full md:w-36 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 transition cursor-pointer"
            >
              <i class="fas fa-trash-can text-xs"></i>
              <span>Hapus</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Verifikasi Admin -->
    <Modal :show="showVerifyModal" @close="showVerifyModal = false" max-width="lg">
      <div class="p-6">
        <div class="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700 mb-4">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-primary text-neutral-900 flex items-center justify-center text-sm font-bold">
              <i class="fas fa-clipboard-check"></i>
            </div>
            <div>
              <h2 class="text-base font-extrabold text-neutral-900 dark:text-white">Form Verifikasi Laporan</h2>
              <p class="text-xs text-neutral-500 dark:text-neutral-400">Tentukan apakah laporan telah memenuhi syarat</p>
            </div>
          </div>
          <button @click="showVerifyModal = false" class="text-neutral-400 hover:text-neutral-600 p-1">
            <i class="fas fa-xmark text-lg"></i>
          </button>
        </div>

        <form @submit.prevent="submitVerification" class="space-y-4 text-xs sm:text-sm">
          <!-- Report Summary Box -->
          <div class="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-700 space-y-1.5">
            <div class="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Laporan yang diverifikasi:</div>
            <div class="font-bold text-neutral-900 dark:text-white">{{ activeReport?.title }}</div>
            <div class="text-xs text-neutral-600 dark:text-neutral-300">
              Tempat Magang: <span class="font-semibold">{{ activeReport?.location?.name_location }}</span>
            </div>
            <!-- PDF Link Button -->
            <div class="pt-2">
              <a
                :href="getFileUrl(activeReport?.file_path)"
                target="_blank"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
              >
                <i class="fas fa-file-pdf text-red-500"></i>
                <span>Buka Dokumen PDF Laporan untuk Dicek</span>
                <i class="fas fa-external-link-alt text-[10px]"></i>
              </a>
            </div>
          </div>

          <!-- Status Choice -->
          <div>
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
              Keputusan Verifikasi <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label
                class="border-2 rounded-2xl p-3 flex items-center gap-2.5 cursor-pointer transition"
                :class="verifyForm.status === 'approved' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300' : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'"
              >
                <input
                  type="radio"
                  name="verify_status"
                  value="approved"
                  v-model="verifyForm.status"
                  class="text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <div class="font-bold text-xs">Sesuai Syarat</div>
                  <div class="text-[10px] opacity-75">Laporan disetujui</div>
                </div>
              </label>

              <label
                class="border-2 rounded-2xl p-3 flex items-center gap-2.5 cursor-pointer transition"
                :class="verifyForm.status === 'rejected' ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-800 dark:text-red-300' : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'"
              >
                <input
                  type="radio"
                  name="verify_status"
                  value="rejected"
                  v-model="verifyForm.status"
                  class="text-red-600 focus:ring-red-500"
                />
                <div>
                  <div class="font-bold text-xs">Belum Sesuai</div>
                  <div class="text-[10px] opacity-75">Tolak / butuh revisi</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Feedback / Note -->
          <div>
            <label class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
              Catatan / Alasan Verifikasi
              <span v-if="verifyForm.status === 'rejected'" class="text-red-500">* (Wajib diisi jika ditolak)</span>
              <span v-else class="text-neutral-400 font-normal">(Opsional)</span>
            </label>
            <textarea
              v-model="verifyForm.feedback"
              rows="3"
              :required="verifyForm.status === 'rejected'"
              :placeholder="verifyForm.status === 'rejected' ? 'Jelaskan syarat apa yang belum terpenuhi (contoh: Nama paling atas pada cover PDF belum sesuai dengan pelapor, halaman pengesahan kurang, dll)...' : 'Catatan apresiasi atau instruksi tambahan jika ada...'"
              class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="pt-3 border-t border-neutral-100 dark:border-neutral-700 flex items-center justify-end gap-3">
            <SecondaryButton @click="showVerifyModal = false" type="button" :disabled="submitting">
              Batal
            </SecondaryButton>
            <button
              type="submit"
              :disabled="submitting"
              class="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-primary hover:bg-primary-dark text-neutral-900 transition disabled:opacity-50 flex items-center gap-2 cursor-pointer"
            >
              <svg v-if="submitting" class="animate-spin h-4 w-4 text-neutral-900" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ submitting ? 'Menyimpan...' : 'Simpan Keputusan' }}</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>

    <!-- Modal Konfirmasi Hapus -->
    <Modal :show="showDeleteModal" @close="showDeleteModal = false" max-width="md">
      <div class="p-6">
        <div class="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center text-xl mb-3">
          <i class="fas fa-trash-can"></i>
        </div>
        <h3 class="text-base font-extrabold text-center text-neutral-900 dark:text-white">Hapus Laporan?</h3>
        <p class="text-xs text-center text-neutral-500 dark:text-neutral-400 mt-1">
          Laporan <b>{{ activeReport?.title }}</b> beserta berkas dokumen PDF akan dihapus secara permanen.
        </p>

        <div class="mt-6 flex items-center justify-end gap-3">
          <SecondaryButton @click="showDeleteModal = false" :disabled="submitting">
            Batal
          </SecondaryButton>
          <DangerButton @click="deleteReport" :disabled="submitting">
            {{ submitting ? 'Menghapus...' : 'Ya, Hapus' }}
          </DangerButton>
        </div>
      </div>
    </Modal>
  </AuthenticatedLayout>
</template>
