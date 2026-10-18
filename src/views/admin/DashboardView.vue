<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'
import AuthenticatedLayout from '../../layouts/AuthenticatedLayout.vue'
import MapComponent from '../../components/Map.vue'
import ModalDetail from '../../components/ModalDetail.vue'
import ModalQr from '../../components/ModalQr.vue'
import api, { getImageUrl } from '../../api'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const router = useRouter()

// State
const locations = ref([])
const categories = ref([])
const activities = ref([])
const loading = ref(true)

const selectedLocation = ref(null)
const showDetailModal = ref(false)
const showQrModal = ref(false)
const mapComponentRef = ref(null)

// Stats
const totalLocations = computed(() => activities.value.length)
const approvedLocations = computed(() => activities.value.filter(l => l.approved_at).length)
const pendingLocations = computed(() => activities.value.filter(l => !l.approved_at).length)
const totalCategories = computed(() => categories.value.length)

// ApexCharts
const series = computed(() => [
  {
    name: 'Jumlah Lokasi',
    data: categories.value.map(item => item.locations_count || 0)
  }
])

const chartOptions = computed(() => {
  const isDark = document.documentElement.classList.contains('dark')
  const textColor = isDark ? '#e5e5e5' : '#404040'
  const gridColor = isDark ? '#333333' : '#e5e5e5'

  return {
    chart: {
      type: 'bar',
      height: 280,
      toolbar: { show: false },
      background: 'transparent',
      fontFamily: 'inherit',
      foreColor: textColor
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: '45%',
        distributed: true
      }
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categories.value.map(item => item.name_category || 'Kategori'),
      labels: {
        style: { colors: textColor, fontSize: '11px' },
        rotate: -35
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: textColor },
        formatter: val => Math.floor(val)
      }
    },
    grid: {
      borderColor: gridColor,
      strokeDashArray: 3,
      yaxis: { lines: { show: true } }
    },
    tooltip: {
      theme: isDark ? 'dark' : 'light',
      y: { formatter: val => `${val} titik magang` }
    },
    colors: [
      '#FCDA37', '#38bdf8', '#34d399', '#fb7185', '#a78bfa',
      '#fb923c', '#2dd4bf', '#818cf8', '#f472b6', '#facc15'
    ],
    legend: { show: false }
  }
})

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const [approvedRes, statsRes, allRes] = await Promise.all([
      api.get('/api/locations/approved'),
      api.get('/api/categories/stats'),
      api.get('/api/locations')
    ])

    locations.value = Array.isArray(approvedRes.data) ? approvedRes.data : []
    categories.value = Array.isArray(statsRes.data) ? statsRes.data : []
    activities.value = allRes.data?.data || []
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
    toast.error('Gagal memuat data statistik dashboard')
  } finally {
    loading.value = false
  }
}

const openLocationDetail = async (loc) => {
  try {
    const res = await api.get(`/api/locations/${loc.id_location}`)
    selectedLocation.value = res.data
    showDetailModal.value = true
  } catch (err) {
    selectedLocation.value = loc
    showDetailModal.value = true
  }
}

const handleApprove = async (id) => {
  try {
    await api.patch(`/api/locations/${id}/approve`)
    toast.success('Lokasi magang berhasil disetujui!')
    showDetailModal.value = false
    await fetchDashboardData()
  } catch (err) {
    toast.error('Gagal menyetujui lokasi')
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

onMounted(() => {
  fetchDashboardData()
})
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-neutral-900 dark:text-white">
            Dashboard Utama
          </h1>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Ringkasan data titik persebaran magang mahasiswa
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <router-link
            to="/admin/reports"
            class="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 transition"
          >
            <i class="fas fa-file-circle-check text-amber-600 dark:text-amber-400"></i> Verifikasi Laporan
          </router-link>
          <button
            @click="showQrModal = true"
            class="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-2 transition"
          >
            <i class="fas fa-qrcode text-amber-500"></i> Buat QR Link
          </button>
          <router-link
            to="/admin/locations"
            class="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-neutral-900 text-xs font-bold flex items-center gap-2 shadow-xs transition"
          >
            <i class="fas fa-list-check"></i> Kelola Semua Lokasi
          </router-link>
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <!-- 4 Quick Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Card 1 -->
        <div class="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 shadow-xs flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Total Pengajuan
            </span>
            <span class="text-2xl font-black text-neutral-900 dark:text-white">
              {{ totalLocations }}
            </span>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xl">
            <i class="fas fa-map-pin"></i>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 shadow-xs flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Disetujui
            </span>
            <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {{ approvedLocations }}
            </span>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl">
            <i class="fas fa-circle-check"></i>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 shadow-xs flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Menunggu Approval
            </span>
            <span class="text-2xl font-black text-amber-500">
              {{ pendingLocations }}
            </span>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center text-xl">
            <i class="fas fa-hourglass-half"></i>
          </div>
        </div>

        <!-- Card 4 -->
        <div class="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 shadow-xs flex items-center justify-between">
          <div>
            <span class="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Kategori Bidang
            </span>
            <span class="text-2xl font-black text-neutral-900 dark:text-white">
              {{ totalCategories }}
            </span>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-primary/20 text-neutral-800 dark:text-primary flex items-center justify-center text-xl">
            <i class="fas fa-tags"></i>
          </div>
        </div>
      </div>

      <!-- Center Section: Chart & Map Preview -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Chart -->
        <div class="p-5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 shadow-xs flex flex-col">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-chart-column text-amber-500"></i>
              Distribusi Lokasi per Kategori
            </h3>
            <router-link to="/admin/categories" class="text-xs text-primary font-bold hover:underline">
              Kelola &rarr;
            </router-link>
          </div>

          <div v-if="categories.length > 0" class="flex-1">
            <VueApexCharts
              type="bar"
              height="280"
              :options="chartOptions"
              :series="series"
            />
          </div>
          <div v-else class="flex-1 flex items-center justify-center text-neutral-400 text-xs">
            Belum ada data kategori
          </div>
        </div>

        <!-- Map Preview -->
        <div class="rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 shadow-xs overflow-hidden flex flex-col">
          <div class="px-5 py-4 border-b border-neutral-100 dark:border-neutral-700 flex items-center justify-between">
            <h3 class="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-map-location-dot text-amber-500"></i>
              Persebaran Lokasi Aktif
            </h3>
            <router-link to="/map" target="_blank" class="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              Buka Peta Full <i class="fas fa-arrow-up-right-from-square text-[10px]"></i>
            </router-link>
          </div>

          <div class="h-72 w-full relative z-0">
            <MapComponent
              ref="mapComponentRef"
              :locations="locations"
              @location-selected="openLocationDetail"
            />
          </div>
        </div>
      </div>

      <!-- Recent Submissions Table -->
      <div class="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200/80 dark:border-neutral-700 shadow-xs overflow-hidden">
        <div class="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <i class="fas fa-clock-rotate-left text-amber-500"></i>
              Pengajuan Lokasi Terbaru
            </h3>
          </div>
          <router-link to="/admin/locations" class="text-xs text-primary font-bold hover:underline">
            Lihat Semua ({{ activities.length }})
          </router-link>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-neutral-50 dark:bg-neutral-700/50 text-neutral-500 uppercase font-semibold border-b border-neutral-100 dark:border-neutral-700">
              <tr>
                <th class="px-6 py-3">Nama Mahasiswa</th>
                <th class="px-6 py-3">Lokasi / Instansi</th>
                <th class="px-6 py-3">Kategori</th>
                <th class="px-6 py-3">Jurusan</th>
                <th class="px-6 py-3 text-center">Status</th>
                <th class="px-6 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 dark:divide-neutral-700">
              <tr
                v-for="item in activities.slice(0, 5)"
                :key="item.id_location"
                class="hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition"
              >
                <td class="px-6 py-3.5 font-medium text-neutral-900 dark:text-white">
                  <div>{{ item.student_name }}</div>
                  <div class="text-[10px] text-neutral-400 font-mono">{{ item.nim }}</div>
                </td>
                <td class="px-6 py-3.5 text-neutral-700 dark:text-neutral-300 font-semibold">
                  {{ item.name_location }}
                </td>
                <td class="px-6 py-3.5 text-neutral-600 dark:text-neutral-400">
                  {{ item.category?.name_category || '-' }}
                </td>
                <td class="px-6 py-3.5 text-neutral-600 dark:text-neutral-400">
                  {{ item.department?.name_department || '-' }}
                </td>
                <td class="px-6 py-3.5 text-center">
                  <span
                    v-if="item.approved_at"
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                  >
                    Disetujui
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                  >
                    Pending
                  </span>
                </td>
                <td class="px-6 py-3.5 text-right">
                  <button
                    @click="openLocationDetail(item)"
                    class="px-2.5 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-xs transition"
                  >
                    Detail
                  </button>
                </td>
              </tr>

              <tr v-if="activities.length === 0">
                <td colspan="6" class="px-6 py-8 text-center text-neutral-400">
                  Belum ada data lokasi yang terdaftar
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ModalDetail
      :show="showDetailModal"
      :location="selectedLocation"
      @close="showDetailModal = false"
      @approve="handleApprove"
    />

    <ModalQr
      :show="showQrModal"
      @close="showQrModal = false"
    />
  </AuthenticatedLayout>
</template>
