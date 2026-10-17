<script setup>
import { ref, onMounted, computed, watch, onUnmounted, provide } from 'vue'
import { useRouter } from 'vue-router'
import DarkModeToggle from '../components/DarkModeToggle.vue'
import MapComponent from '../components/Map.vue'
import ApplicationLogo from '../components/ApplicationLogo.vue'
import api, { getImageUrl, getFileUrl } from '../api'
import { useProfileStore } from '../stores/profile'
import { useAuthStore } from '../stores/auth'

const profileStore = useProfileStore()
const authStore = useAuthStore()
const router = useRouter()

// Data state
const locations = ref([])
const categoriesList = ref([])
const selectedLocation = ref(null)
const searchQuery = ref('')
const filteredResults = ref([])
const showAutocomplete = ref(false)
const highlightedIndex = ref(-1)
const darkMode = ref(false)
const sidebarOpen = ref(false)
const isMobile = ref(false)
const mapComponentRef = ref(null)
const currentImageIndex = ref(0)
const autoSlideInterval = ref(null)
const selectedCategoryIds = ref([])
const loading = ref(true)

provide('darkMode', darkMode)
provide('toggleDarkMode', (value) => {
  darkMode.value = value !== undefined ? value : !darkMode.value
  applyDarkMode()
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
})

// Categories computed from locations & categories API
const categories = computed(() => {
  if (categoriesList.value.length > 0) {
    return categoriesList.value
  }
  const map = new Map()
  locations.value.forEach(loc => {
    if (loc.category) {
      map.set(loc.category.id_category, loc.category)
    }
  })
  return Array.from(map.values())
})

const filteredLocations = computed(() => {
  let result = locations.value

  // Category filter
  if (selectedCategoryIds.value.length > 0) {
    result = result.filter(loc =>
      selectedCategoryIds.value.includes(loc.category?.id_category || loc.id_category)
    )
  }

  // Search filter
  const query = searchQuery.value?.trim().toLowerCase()
  if (query) {
    result = result.filter(loc =>
      loc.name_location?.toLowerCase().includes(query) ||
      loc.description?.toLowerCase().includes(query) ||
      loc.category?.name_category?.toLowerCase().includes(query)
    )
  }

  return result
})

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const toggleDarkMode = (newValue) => {
  darkMode.value = newValue
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
  applyDarkMode()
}

const applyDarkMode = () => {
  document.documentElement.classList.toggle('dark', darkMode.value)
}

const selectLocation = async (location) => {
  selectedLocation.value = location
  showAutocomplete.value = false
  highlightedIndex.value = -1
  currentImageIndex.value = 0

  if (isMobile.value) sidebarOpen.value = true

  try {
    const res = await api.get(`/api/locations/${location.id_location}`)
    if (res.data) {
      selectedLocation.value = res.data
      if (res.data.images && res.data.images.length > 1) {
        setTimeout(() => {
          startAutoSlide()
        }, 1000)
      }
    }
  } catch (error) {
    console.error('Error fetching location detail:', error)
  }
}

const clearSelection = () => {
  selectedLocation.value = null
  sidebarOpen.value = false
  if (mapComponentRef.value) {
    mapComponentRef.value.clearSelectionOnMap()
  }
}

const toggleCategory = (id) => {
  const index = selectedCategoryIds.value.indexOf(id)
  if (index === -1) {
    selectedCategoryIds.value.push(id)
  } else {
    selectedCategoryIds.value.splice(index, 1)
  }
}

const clearCategories = () => {
  selectedCategoryIds.value = []
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    filteredResults.value = filteredLocations.value.slice(0, 6)
    showAutocomplete.value = true
    highlightedIndex.value = -1
  } else {
    filteredResults.value = []
    showAutocomplete.value = false
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  filteredResults.value = []
  showAutocomplete.value = false
  highlightedIndex.value = -1
}

const highlightNext = (e) => {
  e.preventDefault()
  if (filteredResults.value.length > 0) {
    highlightedIndex.value = (highlightedIndex.value + 1) % filteredResults.value.length
  }
}

const highlightPrev = (e) => {
  e.preventDefault()
  if (filteredResults.value.length > 0) {
    highlightedIndex.value = highlightedIndex.value <= 0
      ? filteredResults.value.length - 1
      : highlightedIndex.value - 1
  }
}

const selectHighlighted = (e) => {
  e.preventDefault()
  if (highlightedIndex.value >= 0 && filteredResults.value[highlightedIndex.value]) {
    selectLocation(filteredResults.value[highlightedIndex.value])
  }
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
  setTimeout(() => {
    mapComponentRef.value?.invalidateSize()
  }, 300)
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const navigateToLocation = (location) => {
  if (!location.latitude || !location.longitude) return
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`, '_blank')
}

const openInMaps = (lat, lng) => {
  if (!lat || !lng) return
  window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank')
}

const openWhatsApp = (phone, locationName) => {
  if (!phone) return
  const cleanPhone = phone.replace(/[^0-9]/g, '')
  const message = encodeURIComponent(`Halo, saya ingin bertanya tentang lokasi magang ${locationName}.`)
  window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank')
}

const nextImage = () => {
  if (selectedLocation.value?.images?.length) {
    currentImageIndex.value = (currentImageIndex.value + 1) % selectedLocation.value.images.length
  }
}

const prevImage = () => {
  if (selectedLocation.value?.images?.length) {
    currentImageIndex.value = currentImageIndex.value <= 0
      ? selectedLocation.value.images.length - 1
      : currentImageIndex.value - 1
  }
}

const startAutoSlide = () => {
  if (selectedLocation.value?.images?.length > 1) {
    stopAutoSlide()
    autoSlideInterval.value = setInterval(() => {
      nextImage()
    }, 5000)
  }
}

const stopAutoSlide = () => {
  if (autoSlideInterval.value) {
    clearInterval(autoSlideInterval.value)
    autoSlideInterval.value = null
  }
}

const handleResize = () => {
  checkMobile()
  if (mapComponentRef.value) {
    clearTimeout(window.mapResizeTimeout)
    window.mapResizeTimeout = setTimeout(() => {
      mapComponentRef.value.invalidateSize()
    }, 250)
  }
}

const fetchApprovedLocations = async () => {
  loading.value = true
  try {
    const [locRes, catRes] = await Promise.all([
      api.get('/api/locations/approved'),
      api.get('/api/categories').catch(() => ({ data: { data: [] } }))
    ])
    locations.value = Array.isArray(locRes.data) ? locRes.data : []
    if (catRes.data?.data) {
      categoriesList.value = catRes.data.data
    }
  } catch (err) {
    console.error('Error fetching approved locations:', err)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  checkMobile()

  const saved = localStorage.getItem('theme')
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
  if (saved) {
    darkMode.value = saved === 'dark'
  } else {
    darkMode.value = mq.matches
  }
  applyDarkMode()

  profileStore.fetchProfile()
  await fetchApprovedLocations()

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-box')) {
      showAutocomplete.value = false
    }
  })

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  stopAutoSlide()
})

watch(sidebarOpen, () => {
  setTimeout(() => {
    mapComponentRef.value?.invalidateSize()
  }, 300)
})

watch(selectedLocation, (newLocation) => {
  if (!newLocation) {
    currentImageIndex.value = 0
    stopAutoSlide()
  } else if (newLocation?.images?.length > 1) {
    setTimeout(() => {
      startAutoSlide()
    }, 1000)
  }
  if (!newLocation && sidebarOpen.value && isMobile.value) {
    sidebarOpen.value = false
  }
})
</script>

<template>
  <div :class="['h-screen flex flex-col md:flex-row overflow-hidden font-sans', darkMode ? 'dark bg-neutral-900 text-white' : 'bg-neutral-50 text-neutral-900']">
    
    <!-- Mobile overlay -->
    <div
      v-if="isMobile && sidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300 md:hidden"
    ></div>

    <!-- Sidebar / Drawer -->
    <aside
      id="sidebar"
      :class="[
        'fixed md:static z-50 transition-all duration-300 ease-in-out flex flex-col',
        'w-full md:w-96 lg:w-95',
        'bg-white dark:bg-neutral-800',
        'border-t md:border-t-0 md:border-r border-neutral-200 dark:border-neutral-700',
        'shadow-2xl md:shadow-lg',
        isMobile ? [
          'bottom-0 left-0 right-0',
          'rounded-t-3xl md:rounded-none',
          'h-[82vh] md:h-full',
          'max-h-[85vh] md:max-h-none',
          sidebarOpen ? 'translate-y-0' : 'translate-y-full'
        ] : [
          'h-full',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ]
      ]"
    >
      <!-- Header / Brand -->
      <div class="p-4 border-b border-neutral-100 dark:border-neutral-700 shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <ApplicationLogo />
          </div>

          <div class="flex items-center gap-1.5">
            <router-link
              to="/"
              class="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition"
              title="Ke Landing Page"
            >
              <i class="fas fa-home text-sm"></i>
            </router-link>
            <router-link
              to="/docs"
              class="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition"
              title="Dokumentasi Sistem"
            >
              <i class="fas fa-book-open text-sm"></i>
            </router-link>
            <!-- Mobile close button -->
            <button
              v-if="isMobile"
              @click="clearSelection"
              class="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
            >
              <i class="fas fa-xmark text-lg"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Detail Panel Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- Empty State (No Location Selected) -->
        <div v-if="!selectedLocation" class="p-5 space-y-5">
          <div class="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-700/40 border border-neutral-100 dark:border-neutral-700">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-base font-bold text-neutral-900 dark:text-white">Peta Titik Magang</h3>
              <span class="px-2.5 py-1 rounded-full bg-primary/20 text-neutral-900 dark:text-primary text-xs font-bold">
                {{ filteredLocations.length }} Lokasi
              </span>
            </div>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Klik pada pin peta atau pilih dari kolom pencarian untuk melihat rincian lokasi magang, alamat, kontak, dan dokumentasi foto.
            </p>
          </div>

          <!-- Quick Submission Card -->
          <div class="p-5 rounded-2xl bg-linear-to-br from-amber-50 to-yellow-100/50 dark:from-neutral-800 dark:to-neutral-700 border border-primary/30">
            <div class="flex items-start gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-primary text-neutral-900 flex items-center justify-center shrink-0 shadow-sm">
                <i class="fas fa-location-arrow text-lg"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                  Magang di Tempat yang Belum Ada di Peta?
                </h4>
                <p class="text-xs text-neutral-600 dark:text-neutral-300 mb-3">
                  Kabari admin lewat email dan jadikan instansi tempatmu magang sebagai referensi buat adik tingkat selanjutnya.
                </p>
              </div>
            </div>
          </div>

          <!-- List of locations preview -->
          <div>
            <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Daftar Tempat Magang
            </h4>
            <div class="space-y-2.5">
              <div
                v-for="loc in filteredLocations.slice(0, 5)"
                :key="loc.id_location"
                @click="selectLocation(loc)"
                class="p-3 rounded-xl border border-neutral-100 dark:border-neutral-700 hover:border-primary/50 bg-white dark:bg-neutral-800/80 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer transition flex items-center gap-3 shadow-xs"
              >
                <div class="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-700 overflow-hidden shrink-0">
                  <img
                    v-if="loc.images && loc.images.length > 0"
                    :src="getImageUrl(loc.images[0].image_path)"
                    class="w-full h-full object-cover"
                    alt="thumb"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-neutral-400">
                    <i class="fas fa-building text-sm"></i>
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h5 class="text-xs font-bold text-neutral-900 dark:text-white truncate">
                    {{ loc.name_location }}
                  </h5>
                  <p class="text-[11px] text-amber-600 dark:text-amber-400 font-medium truncate">
                    {{ loc.category?.name_category }}
                  </p>
                  <p class="text-[10px] text-neutral-400 truncate">
                    {{ loc.student_name ? 'Oleh: ' + loc.student_name : '' }}
                  </p>
                </div>
                <i class="fas fa-chevron-right text-xs text-neutral-300 dark:text-neutral-600"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Location Detail View -->
        <div v-else class="flex flex-col">
          <!-- Image Carousel -->
          <div class="relative h-56 bg-neutral-900 overflow-hidden group">
            <div
              class="flex h-full transition-transform duration-300 ease-in-out"
              :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
            >
              <div
                v-for="(img, idx) in selectedLocation.images"
                :key="img.id_image || idx"
                class="w-full h-full shrink-0 relative"
              >
                <img
                  :src="getImageUrl(img.image_path)"
                  :alt="img.alt_text || selectedLocation.name_location"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Fallback placeholder -->
              <div
                v-if="!selectedLocation.images || selectedLocation.images.length === 0"
                class="w-full h-full shrink-0 flex items-center justify-center bg-neutral-800 text-neutral-500"
              >
                <div class="text-center">
                  <i class="fas fa-image text-4xl mb-1 opacity-40"></i>
                  <p class="text-xs">Foto tidak tersedia</p>
                </div>
              </div>
            </div>

            <!-- Carousel Controls -->
            <div
              v-if="selectedLocation.images && selectedLocation.images.length > 1"
              class="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <button
                @click.stop="prevImage"
                class="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
              >
                <i class="fas fa-chevron-left text-xs"></i>
              </button>
              <button
                @click.stop="nextImage"
                class="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
              >
                <i class="fas fa-chevron-right text-xs"></i>
              </button>
            </div>

            <!-- Counter Pill -->
            <div
              v-if="selectedLocation.images && selectedLocation.images.length > 1"
              class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/70 text-white text-[11px] font-semibold backdrop-blur-xs"
            >
              {{ currentImageIndex + 1 }} / {{ selectedLocation.images.length }}
            </div>

            <!-- Close selection button -->
            <button
              @click="clearSelection"
              class="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-800/90 text-neutral-700 dark:text-neutral-200 flex items-center justify-center shadow-md hover:scale-105 transition"
            >
              <i class="fas fa-xmark"></i>
            </button>
          </div>

          <!-- Info Details -->
          <div class="p-5 space-y-4">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                  {{ selectedLocation.category?.name_category }}
                </span>
                <span v-if="selectedLocation.department" class="text-xs text-neutral-400">
                  {{ selectedLocation.department.name_department }}
                </span>
              </div>
              <h2 class="text-xl font-extrabold text-neutral-900 dark:text-white leading-tight">
                {{ selectedLocation.name_location }}
              </h2>
            </div>

            <div class="h-px bg-neutral-100 dark:bg-neutral-700"></div>

            <!-- Description -->
            <div>
              <h4 class="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Deskripsi
              </h4>
              <p class="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                {{ selectedLocation.description || 'Tidak ada deskripsi detail.' }}
              </p>
            </div>

            <!-- Coordinates Pill -->
            <div class="flex items-center justify-between p-2.5 bg-neutral-50 dark:bg-neutral-700/40 rounded-xl border border-neutral-100 dark:border-neutral-700 text-xs">
              <div class="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                <i class="fas fa-location-dot text-amber-500"></i>
                <span>Koordinat:</span>
              </div>
              <span class="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                {{ Number(selectedLocation.latitude).toFixed(5) }}, {{ Number(selectedLocation.longitude).toFixed(5) }}
              </span>
            </div>

            <!-- Action Buttons (Chat, Rute, Maps) -->
            <div class="grid grid-cols-3 gap-2 pt-1">
              <button
                @click="openWhatsApp(selectedLocation.contact, selectedLocation.name_location)"
                :disabled="!selectedLocation.contact"
                class="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
              >
                <i class="fab fa-whatsapp text-sm"></i>
                <span>Chat</span>
              </button>

              <button
                @click="navigateToLocation(selectedLocation)"
                class="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <i class="fas fa-diamond-turn-right text-sm"></i>
                <span>Rute</span>
              </button>

              <button
                @click="openInMaps(selectedLocation.latitude, selectedLocation.longitude)"
                class="py-2.5 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
              >
                <i class="fas fa-map-location-dot text-sm"></i>
                <span>Maps</span>
              </button>
            </div>

            <!-- Laporan Magang Terverifikasi (Referensi PKL untuk Adik Tingkat) -->
            <div class="pt-4 border-t border-neutral-100 dark:border-neutral-700 space-y-2.5">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <i class="fas fa-book-bookmark text-amber-500"></i>
                  <span>Laporan Magang Terverifikasi</span>
                </h4>
                <span
                  v-if="selectedLocation.reports && selectedLocation.reports.length > 0"
                  class="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                >
                  {{ selectedLocation.reports.length }} Pedoman
                </span>
              </div>

              <!-- List of reports -->
              <div v-if="selectedLocation.reports && selectedLocation.reports.length > 0" class="space-y-2">
                <div
                  v-for="rep in selectedLocation.reports"
                  :key="rep.id_report"
                  class="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 space-y-2 shadow-2xs"
                >
                  <div class="flex items-start gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-sm shrink-0 mt-0.5">
                      <i class="fas fa-file-pdf"></i>
                    </div>
                    <div class="min-w-0 flex-1">
                      <h5 class="text-xs font-bold text-neutral-900 dark:text-white leading-snug line-clamp-2">
                        {{ rep.title }}
                      </h5>
                      <p v-if="rep.students" class="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                        <i class="fas fa-users text-[10px] text-amber-500 mr-1"></i>
                        {{ rep.students.split('\n')[0] }}
                      </p>
                    </div>
                  </div>

                  <a
                    :href="getFileUrl(rep.file_path)"
                    target="_blank"
                    class="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl font-bold text-xs bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 transition"
                  >
                    <i class="fas fa-arrow-up-right-from-square text-[10px]"></i>
                    <span>Baca Laporan PDF (Referensi)</span>
                  </a>
                </div>
              </div>

              <div v-else class="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-100 dark:border-neutral-700/60 text-center">
                <p class="text-[11px] text-neutral-400">
                  Belum ada berkas laporan terverifikasi untuk tempat magang ini.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer / Dark Mode & User / Admin Portal -->
      <div id="sidebar-footer" class="p-3.5 border-t border-neutral-100 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 flex items-center justify-between gap-2 shrink-0">
        <template v-if="authStore.isAuthenticated">
          <router-link
            :to="authStore.user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'"
            class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1.5 transition truncate max-w-42.5"
          >
            <i class="fas" :class="authStore.user?.role === 'admin' ? 'fa-chart-pie' : 'fa-user-graduate'"></i>
            <span class="truncate">{{ authStore.user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard Saya' }}</span>
          </router-link>
        </template>
        <template v-else>
          <div class="flex items-center gap-2">
            <router-link
              to="/login"
              class="text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 transition"
            >
              <i class="fas fa-right-to-bracket text-[11px]"></i> Masuk
            </router-link>
            <span class="text-neutral-300 dark:text-neutral-600">|</span>
            <router-link
              to="/register"
              class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 transition"
            >
              Daftar Mahasiswa
            </router-link>
          </div>
        </template>

        <DarkModeToggle v-model="darkMode" @toggle="toggleDarkMode" />
      </div>
    </aside>

    <!-- Main Map View Area -->
    <main class="relative flex-1 h-full w-full">
      <MapComponent
        ref="mapComponentRef"
        :locations="filteredLocations"
        :selected-location="selectedLocation"
        :sidebar-open="sidebarOpen"
        @location-selected="selectLocation"
      >
        <!-- Floating Search & Filter Bar -->
        <div class="absolute z-40 top-3 md:top-4 left-3 md:left-4 right-3 md:right-4 flex items-center gap-2 transition-all">
          <!-- Mobile Sidebar Toggle -->
          <button
            v-if="isMobile"
            @click.stop="toggleSidebar"
            class="w-11 h-11 rounded-2xl bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0 hover:bg-neutral-50 transition"
          >
            <i class="fas fa-bars text-base"></i>
          </button>

          <!-- Search Box -->
          <div class="relative flex-1 max-w-xl mx-auto search-box">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-neutral-400">
                <i class="fas fa-magnifying-glass text-sm"></i>
              </div>

              <input
                v-model="searchQuery"
                @input="handleSearch"
                @focus="showAutocomplete = true"
                @keydown.down="highlightNext"
                @keydown.up="highlightPrev"
                @keydown.enter="selectHighlighted"
                @keydown.esc="showAutocomplete = false"
                type="text"
                placeholder="Cari lokasi magang, bidang, atau deskripsi..."
                class="w-full pl-10 pr-24 py-2.5 md:py-3 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-md rounded-2xl border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary shadow-xl text-xs md:text-sm transition-all"
              />

              <!-- Active Filter Badge -->
              <div v-if="selectedCategoryIds.length" class="absolute inset-y-0 right-8 flex items-center">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] rounded-full bg-primary/20 text-neutral-800 dark:text-primary font-bold">
                  {{ selectedCategoryIds.length }} filter
                  <button @click.stop="clearCategories" class="hover:text-red-500">×</button>
                </span>
              </div>

              <!-- Clear Search -->
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                <i class="fas fa-xmark text-sm"></i>
              </button>
            </div>

            <!-- Autocomplete & Filter Dropdown -->
            <div
              v-if="showAutocomplete"
              class="mt-2 overflow-hidden bg-white/95 dark:bg-neutral-800/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 shadow-2xl rounded-2xl animate-fade-in"
            >
              <!-- Category Pills -->
              <div class="p-3 border-b border-neutral-100 dark:border-neutral-700">
                <p class="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                  Kategori Magang
                </p>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    @click="clearCategories"
                    :class="[
                      'px-3 py-1 text-xs rounded-full border transition font-medium',
                      selectedCategoryIds.length === 0
                        ? 'bg-primary border-primary text-neutral-900 font-bold'
                        : 'bg-neutral-50 dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300'
                    ]"
                  >
                    Semua
                  </button>

                  <button
                    v-for="cat in categories"
                    :key="cat.id_category"
                    @click="toggleCategory(cat.id_category)"
                    :class="[
                      'px-3 py-1 text-xs rounded-full border transition font-medium',
                      selectedCategoryIds.includes(cat.id_category)
                        ? 'bg-primary border-primary text-neutral-900 font-bold'
                        : 'bg-neutral-50 dark:bg-neutral-700 border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300'
                    ]"
                  >
                    {{ cat.name_category }}
                  </button>
                </div>
              </div>

              <!-- Autocomplete Results -->
              <div v-if="filteredResults.length > 0" class="overflow-y-auto max-h-60">
                <div
                  v-for="(loc, idx) in filteredResults"
                  :key="loc.id_location"
                  @click="selectLocation(loc)"
                  @mouseenter="highlightedIndex = idx"
                  :class="[
                    'p-3 cursor-pointer flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-700/60 last:border-b-0 transition-colors',
                    highlightedIndex === idx
                      ? 'bg-primary/15'
                      : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
                  ]"
                >
                  <div class="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-700 overflow-hidden shrink-0">
                    <img
                      v-if="loc.images && loc.images.length > 0"
                      :src="getImageUrl(loc.images[0].image_path)"
                      class="w-full h-full object-cover"
                      alt="loc"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-neutral-400">
                      <i class="fas fa-building text-xs"></i>
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h5 class="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {{ loc.name_location }}
                    </h5>
                    <p class="text-[11px] text-amber-600 dark:text-amber-400 truncate">
                      {{ loc.category?.name_category }}
                    </p>
                  </div>
                </div>
              </div>

              <div v-else-if="searchQuery" class="p-6 text-center text-neutral-400 text-xs">
                Tidak ada titik magang yang sesuai dengan "{{ searchQuery }}".
              </div>
            </div>
          </div>

        </div>

        <!-- Mobile Quick Bottom Card when selectedLocation & sidebar closed -->
        <div
          v-if="isMobile && selectedLocation && !sidebarOpen"
          @click.stop="toggleSidebar"
          class="absolute bottom-4 left-4 right-4 z-30 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-between cursor-pointer"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-10 h-10 rounded-xl bg-primary text-neutral-900 flex items-center justify-center shrink-0">
              <i class="fas fa-location-dot"></i>
            </div>
            <div class="min-w-0">
              <h4 class="text-xs font-bold text-neutral-900 dark:text-white truncate">
                {{ selectedLocation.name_location }}
              </h4>
              <p class="text-[11px] text-amber-600 dark:text-amber-400 truncate">
                {{ selectedLocation.category?.name_category }}
              </p>
            </div>
          </div>
          <span class="text-xs text-neutral-400 flex items-center gap-1 font-semibold">
            Buka <i class="fas fa-chevron-up"></i>
          </span>
        </div>
      </MapComponent>
    </main>
  </div>
</template>
