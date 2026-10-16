<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout.vue'
import ModalDelete from '../../../components/ModalDelete.vue'
import api from '../../../api'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import { AgGridVue } from 'ag-grid-vue3'
import { ModuleRegistry, AllCommunityModule, colorSchemeDarkBlue, themeQuartz } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])

const router = useRouter()
const gridApi = ref(null)
const rowData = ref([])
const quickFilterText = ref('')
const theme = ref(null)
const loading = ref(false)

// Delete state
const showDeleteModal = ref(false)
const deleteTargetId = ref(null)
const deleteTargetName = ref('')
const deleting = ref(false)

const columnDefs = ref([
  {
    headerName: 'No',
    valueGetter: params => params.node.rowIndex + 1,
    sortable: false,
    width: 80,
    cellClass: 'cell-center'
  },
  {
    field: 'name_category',
    headerName: 'Nama Kategori',
    sortable: true,
    flex: 2,
    cellClass: 'cell-center font-semibold'
  },
  {
    field: 'locations_count',
    headerName: 'Total Titik Lokasi',
    sortable: true,
    flex: 1,
    cellClass: 'cell-center'
  },
  {
    headerName: 'Aksi',
    width: 180,
    cellRenderer: (params) => {
      const wrapper = document.createElement('div')
      wrapper.className = 'flex h-full items-center justify-center gap-2'

      const editBtn = document.createElement('button')
      editBtn.className = 'px-3 py-1 text-xs bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition font-medium'
      editBtn.textContent = 'Edit'
      editBtn.onclick = () => router.push(`/admin/categories/edit/${params.data.id_category}`)

      const delBtn = document.createElement('button')
      delBtn.className = 'px-3 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition font-medium'
      delBtn.textContent = 'Hapus'
      delBtn.onclick = () => openDeleteModal(params.data.id_category, params.data.name_category)

      wrapper.appendChild(editBtn)
      wrapper.appendChild(delBtn)
      return wrapper
    },
    sortable: false
  }
])

const gridOptions = ref({
  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: [5, 10, 20, 50],
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

const fetchCategories = async () => {
  loading.value = true
  try {
    const res = await api.get('/api/categories')
    rowData.value = res.data?.data || []
  } catch (e) {
    console.error('Error fetching categories:', e)
    toast.error('Gagal memuat data kategori')
  } finally {
    loading.value = false
  }
}

const onGridReady = (params) => {
  gridApi.value = params.api
  fetchCategories()
}

const onFilterTextBoxChanged = () => {
  gridApi.value?.setGridOption('quickFilterText', quickFilterText.value)
}

const exportCsv = () => {
  gridApi.value?.exportDataAsCsv({
    fileName: `kategori-magang-${new Date().toISOString().slice(0, 10)}.csv`
  })
}

const openDeleteModal = (id, name) => {
  deleteTargetId.value = id
  deleteTargetName.value = name
  showDeleteModal.value = true
}

const deleteCategory = async () => {
  if (!deleteTargetId.value) return
  deleting.value = true
  try {
    await api.delete(`/api/categories/${deleteTargetId.value}`)
    toast.success('Kategori berhasil dihapus')
    showDeleteModal.value = false
    await fetchCategories()
  } catch (err) {
    toast.error('Gagal menghapus kategori')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  updateGridTheme()
  themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      if (m.attributeName === 'class') updateGridTheme()
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
            Daftar Kategori
          </h1>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Kelola kategori bidang industri dan tempat magang
          </p>
        </div>

        <router-link
          to="/admin/categories/add"
          class="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-neutral-900 font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
        >
          <i class="fas fa-plus"></i> Tambah Kategori
        </router-link>
      </div>
    </template>

    <div class="space-y-4">
      <!-- Toolbar -->
      <div class="p-4 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200/80 dark:border-neutral-700 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="relative w-full sm:w-80">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
            <i class="fas fa-search text-xs"></i>
          </span>
          <input
            v-model="quickFilterText"
            @input="onFilterTextBoxChanged"
            type="text"
            placeholder="Cari nama kategori..."
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
            @click="fetchCategories"
            class="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-500 transition"
            title="Muat Ulang Data"
          >
            <i class="fas fa-rotate" :class="{ 'fa-spin': loading }"></i>
          </button>
        </div>
      </div>

      <!-- AG Grid Card -->
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

    <!-- Delete Modal -->
    <ModalDelete
      :show="showDeleteModal"
      title="Hapus Kategori"
      :message="`Apakah Anda yakin ingin menghapus kategori '${deleteTargetName}'?`"
      warningMessage="Kategori yang dihapus mungkin mempengaruhi tempat magang yang terhubung dengan kategori ini."
      :loading="deleting"
      @close="showDeleteModal = false"
      @confirm="deleteCategory"
    />
  </AuthenticatedLayout>
</template>
