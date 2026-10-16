<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout.vue'
import ModalDelete from '../../../components/ModalDelete.vue'
import ModalDetail from '../../../components/ModalDetail.vue'
import ModalQr from '../../../components/ModalQr.vue'
import api from '../../../api'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { AgGridVue } from 'ag-grid-vue3'
import { ModuleRegistry, AllCommunityModule, colorSchemeDarkBlue, themeQuartz } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])

const gridApi = ref(null)
const rowData = ref([])
const quickFilterText = ref('')
const theme = ref(null)
const loading = ref(false)

// Modals
const showDeleteModal = ref(false)
const showDetailModal = ref(false)
const showQrModal = ref(false)
const deleteTargetId = ref(null)
const deleteTargetName = ref('')
const deleting = ref(false)
const selectedLocation = ref(null)

const columnDefs = ref([
  {
    headerName: 'No',
    valueGetter: params => params.node.rowIndex + 1,
    sortable: false,
    width: 65,
    cellClass: 'cell-center'
  },
  {
    field: 'student_name',
    headerName: 'Nama Mahasiswa',
    sortable: true,
    flex: 1,
    cellClass: 'cell-center'
  },
  {
    field: 'nim',
    headerName: 'NIM',
    sortable: true,
    width: 120,
    cellClass: 'cell-center'
  },
  {
    field: 'name_location',
    headerName: 'Perusahaan / Lokasi',
    sortable: true,
    flex: 1.5,
    cellClass: 'cell-center font-semibold'
  },
  {
    field: 'contact',
    headerName: 'Kontak',
    sortable: false,
    width: 130,
    cellClass: 'cell-center'
  },
  {
    field: 'department.name_department',
    headerName: 'Jurusan',
    sortable: true,
    flex: 1,
    cellClass: 'cell-center'
  },
  {
    field: 'category.name_category',
    headerName: 'Kategori',
    sortable: true,
    width: 130,
    cellClass: 'cell-center'
  },
  {
    headerName: 'Status',
    width: 130,
    cellRenderer: (params) => {
      const isApproved = !!params.data.approved_at
      const span = document.createElement('span')
      span.className = isApproved
        ? 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
        : 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
      span.textContent = isApproved ? 'Disetujui' : 'Pending'
      return span
    },
    cellClass: 'cell-center'
  },
  {
    headerName: 'Aksi',
    width: 160,
    cellRenderer: (params) => {
      const wrapper = document.createElement('div')
      wrapper.className = 'flex h-full items-center justify-center gap-1.5'

      const detailBtn = document.createElement('button')
      detailBtn.className = 'px-2.5 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition'
      detailBtn.textContent = 'Detail'
      detailBtn.onclick = () => openDetail(params.data)

      const delBtn = document.createElement('button')
      delBtn.className = 'px-2.5 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition'
      delBtn.textContent = 'Hapus'
      delBtn.onclick = () => openDelete(params.data.id_location, params.data.name_location)

      wrapper.appendChild(detailBtn)
      wrapper.appendChild(delBtn)
      return wrapper
    },
    sortable: false
  }
])

const gridOptions = ref({
  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: [5, 10, 20, 50, 100],
  domLayout: 'autoHeight',
  animateRows: false,
})

const getTheme = (isDark) => {
  return isDark
    ? themeQuartz.withPart(colorSchemeDarkBlue).withParams({
        spacing: 12,
        accentColor: '#FCDA37',
        backgroundColor: '#1f2937',
        foregroundColor: '#f3f4f6',
        headerBackgroundColor: '#111827',
      })
    : themeQuartz.withParams({
        spacing: 12,
        accentColor: '#CA8A04',
      })
}

const updateGridTheme = () => {
  const isDark = document.documentElement.classList.contains('dark')
  theme.value = getTheme(isDark)
}

let themeObserver = null

const fetchLocations = async () => {
  loading.value = true
  try {
    const res = await api.get('/api/locations')
    rowData.value = res.data?.data || []
  } catch (err) {
    console.error('Error fetching locations:', err)
    toast.error('Gagal memuat data lokasi')
  } finally {
    loading.value = false
  }
}

const onGridReady = (params) => {
  gridApi.value = params.api
  fetchLocations()
}

const onFilterTextBoxChanged = () => {
  gridApi.value?.setGridOption('quickFilterText', quickFilterText.value)
}

const exportCsv = () => {
  gridApi.value?.exportDataAsCsv({
    fileName: `lokasi-magang-${new Date().toISOString().slice(0, 10)}.csv`
  })
}

const openDetail = async (loc) => {
  try {
    const res = await api.get(`/api/locations/${loc.id_location}`)
    selectedLocation.value = res.data
  } catch (e) {
    selectedLocation.value = loc
  }
  showDetailModal.value = true
}

const handleApprove = async (id) => {
  try {
    await api.patch(`/api/locations/${id}/approve`)
    toast.success('Lokasi magang berhasil disetujui!')
    showDetailModal.value = false
    await fetchLocations()
  } catch (err) {
    toast.error('Gagal menyetujui lokasi')
  }
}

const openDelete = (id, name) => {
  deleteTargetId.value = id
  deleteTargetName.value = name
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await api.delete(`/api/locations/${deleteTargetId.value}`)
    toast.success('Lokasi magang berhasil dihapus')
    showDeleteModal.value = false
    await fetchLocations()
  } catch (err) {
    toast.error('Gagal menghapus lokasi')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  updateGridTheme()
  themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      if (m.attributeName === 'class') {
        updateGridTheme()
      }
    })
  })
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

onUnmounted(() => {
  if (themeObserver) themeObserver.disconnect()
})
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-xl font-bold text-neutral-900 dark:text-white">
            Kelola Lokasi Magang
          </h1>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Daftar lengkap titik magang mahasiswa dan status verifikasinya
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5">
          <button
            @click="showQrModal = true"
            class="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-neutral-900 font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
          >
            <i class="fas fa-qrcode"></i> QR Link Mahasiswa
          </button>
          <router-link
            to="/admin/locations/add"
            target="_blank"
            class="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-200 font-semibold text-xs flex items-center gap-1.5 transition"
          >
            <i class="fas fa-plus"></i> Tambah Lokasi
          </router-link>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Toolbar (Search & Export) -->
      <div class="p-4 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200/80 dark:border-neutral-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="relative w-full sm:w-80">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
            <i class="fas fa-search text-xs"></i>
          </span>
          <input
            v-model="quickFilterText"
            @input="onFilterTextBoxChanged"
            type="text"
            placeholder="Cari mahasiswa, NIM, lokasi..."
            class="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700/50 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            @click="exportCsv"
            class="px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 transition"
          >
            <i class="fas fa-file-csv text-emerald-600"></i> Ekspor CSV
          </button>
          <button
            @click="fetchLocations"
            class="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-500 transition"
            title="Muat Ulang Data"
          >
            <i class="fas fa-rotate" :class="{ 'fa-spin': loading }"></i>
          </button>
        </div>
      </div>

      <!-- AG Grid Table Card -->
      <div class="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200/80 dark:border-neutral-700 shadow-xs p-4 overflow-hidden">
        <AgGridVue
          class="ag-theme-quartz w-full"
          :theme="theme"
          :rowData="rowData"
          :columnDefs="columnDefs"
          :gridOptions="gridOptions"
          @grid-ready="onGridReady"
        />
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

    <ModalDelete
      :show="showDeleteModal"
      title="Hapus Lokasi Magang"
      :message="`Apakah Anda yakin ingin menghapus data lokasi '${deleteTargetName}'? Seluruh data dan gambar terkait akan dihapus secara permanen.`"
      :loading="deleting"
      @close="showDeleteModal = false"
      @confirm="confirmDelete"
    />
  </AuthenticatedLayout>
</template>
