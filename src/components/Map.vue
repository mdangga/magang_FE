<template>
  <div class="relative h-full w-full map-container">
    <div ref="mapContainer" id="map" class="absolute inset-0 z-0"></div>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, inject } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  locations: {
    type: Array,
    required: true,
    default: () => []
  },
  selectedLocation: {
    type: Object,
    default: null
  },
  sidebarOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['location-selected', 'map-initialized'])

// Inject dark mode from parent
const darkMode = inject('darkMode', ref(false))

const mapContainer = ref(null)
let map = null
let tiles = null
let markerLayer = null
const markers = ref({})
const mapInitialized = ref(false)

const createCustomIcon = (isSelected = false) => {
  return L.divIcon({
    html: `
      <div class="relative group cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 640 640"
             class="transition-all duration-300 transform drop-shadow-xl ${isSelected ? 'scale-125 text-amber-500' : 'text-primary hover:scale-110 hover:text-amber-500'}">
          <path stroke="white" stroke-opacity="0.9" stroke-width="24" fill="currentColor" 
                d="M128 252.6C128 148.4 214 64 320 64s192 84.4 192 188.6c0 119.3-120.2 262.3-170.4 316.8c-11.8 12.8-31.5 12.8-43.3 0c-50.2-54.5-170.4-197.5-170.4-316.8zM320 320c35.3 0 64-28.7 64-64s-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64" />
        </svg>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  })
}

const DEFAULT_CENTER = [-8.65, 115.22] // Bali

const addMarkers = () => {
  if (!map || !markerLayer) return

  markerLayer.clearLayers()
  markers.value = {}

  let hasValidLocation = false
  const icon = createCustomIcon()

  props.locations.forEach(location => {
    const lat = parseFloat(location.latitude)
    const lng = parseFloat(location.longitude)
    if (isNaN(lat) || isNaN(lng)) return

    hasValidLocation = true

    const marker = L.marker([lat, lng], {
      icon,
      title: location.name_location,
      zoomAnimation: false,
      fadeAnimation: false,
    })
      .on('click', (e) => {
        e.originalEvent?.stopPropagation()
        emit('location-selected', location)
      })
      .bindPopup(`
        <div class="p-3 min-w-[180px]">
          <h3 class="mb-1 text-sm font-bold text-neutral-900">
            ${location.name_location}
          </h3>
          <p class="mb-1 text-xs text-neutral-600">
            ${location.category?.name_category ?? ''}
          </p>
          <p class="text-xs text-neutral-400">
            ${lat.toFixed(5)}, ${lng.toFixed(5)}
          </p>
        </div>
      `)
      .bindTooltip(`
        <div class="text-sm font-semibold text-neutral-900">
          ${location.name_location}
        </div>
        <div class="text-xs text-neutral-600 mt-0.5">
          ${location.category?.name_category ?? ''}
        </div>
      `, {
        direction: 'top',
        offset: [0, -40],
        opacity: 0.95,
        className: 'custom-tooltip'
      })
      .on('mouseover', function () {
        this.openTooltip()
      })
      .on('mouseout', function () {
        this.closeTooltip()
      })

    markerLayer.addLayer(marker)
    markers.value[location.id_location] = marker
  })

  if (!hasValidLocation) {
    const marker = L.marker(DEFAULT_CENTER, {
      icon,
      title: 'Lokasi Default',
    }).bindPopup(`
      <div class="p-3 min-w-[180px]">
        <h3 class="mb-1 text-sm font-bold text-neutral-900">Lokasi Default</h3>
        <p class="text-xs text-neutral-600">Belum ada titik lokasi yang dipilih</p>
      </div>
    `).openPopup()

    markerLayer.addLayer(marker)
    map.setView(DEFAULT_CENTER, 12, { animate: false })
    return
  }

  const validLocs = props.locations.filter(l => !isNaN(parseFloat(l.latitude)) && !isNaN(parseFloat(l.longitude)))
  if (validLocs.length > 0) {
    const bounds = L.latLngBounds(validLocs.map(l => [parseFloat(l.latitude), parseFloat(l.longitude)]))
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.15), { animate: false })
    }
  }
}

const initMap = async () => {
  try {
    await nextTick()
    if (map) return

    if (!mapContainer.value) {
      setTimeout(initMap, 100)
      return
    }

    map = L.map(mapContainer.value, {
      zoomControl: false,
      preferCanvas: true,
      attributionControl: false,
      maxZoom: 19,
      minZoom: 3,
      maxBounds: [
        [-85, -180],
        [85, 180]
      ],
      maxBoundsViscosity: 0.5
    })

    tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxNativeZoom: 19,
      crossOrigin: true
    }).addTo(map)

    markerLayer = L.layerGroup().addTo(map)

    map.whenReady(() => {
      setTimeout(() => {
        map?.invalidateSize()
        const validLocs = props.locations.filter(l => !isNaN(parseFloat(l.latitude)) && !isNaN(parseFloat(l.longitude)))
        if (validLocs.length > 0) {
          const bounds = L.latLngBounds(validLocs.map(l => [parseFloat(l.latitude), parseFloat(l.longitude)]))
          if (bounds.isValid()) {
            map.fitBounds(bounds.pad(0.1), { animate: false })
          }
        } else {
          map?.setView(DEFAULT_CENTER, 12, { animate: false })
        }
      }, 200)
    })

    L.control.zoom({
      position: 'bottomright',
      zoomInTitle: 'Perbesar',
      zoomOutTitle: 'Perkecil'
    }).addTo(map)

    L.control.attribution({
      position: 'bottomleft',
      prefix: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    addMarkers()

    mapInitialized.value = true
    emit('map-initialized', map)
    applyMapDarkMode()
  } catch (error) {
    console.error('Error initializing map:', error)
  }
}

const applyMapDarkMode = () => {
  if (!mapContainer.value) return
  const leafletPane = mapContainer.value.querySelector('.leaflet-pane')
  if (!leafletPane) return

  if (darkMode.value) {
    leafletPane.style.filter = 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)'
    const markersEls = mapContainer.value.querySelectorAll('.leaflet-marker-pane, .leaflet-shadow-pane')
    markersEls.forEach(marker => {
      marker.style.filter = 'invert(100%) hue-rotate(180deg)'
    })
  } else {
    leafletPane.style.filter = ''
    const markersEls = mapContainer.value.querySelectorAll('.leaflet-marker-pane, .leaflet-shadow-pane')
    markersEls.forEach(marker => {
      marker.style.filter = ''
    })
  }

  setTimeout(() => {
    if (map) map.invalidateSize()
  }, 50)
}

const selectLocationOnMap = (location) => {
  if (!map || !location) return
  const lat = parseFloat(location.latitude)
  const lng = parseFloat(location.longitude)
  if (isNaN(lat) || isNaN(lng)) return

  map.whenReady(() => {
    map.stop()
    map.invalidateSize()
    map.setView([lat, lng], 15, { animate: true })

    const marker = markers.value[location.id_location]
    if (marker) {
      marker.openPopup()
    }
  })
}

const clearSelectionOnMap = () => {
  if (!map) return
  map.closePopup()

  const validLocs = props.locations.filter(l => !isNaN(parseFloat(l.latitude)) && !isNaN(parseFloat(l.longitude)))
  if (validLocs.length > 0) {
    const bounds = L.latLngBounds(validLocs.map(l => [parseFloat(l.latitude), parseFloat(l.longitude)]))
    if (bounds.isValid()) {
      map.fitBounds(bounds.pad(0.15), { animate: true })
    }
  }
}

const invalidateSize = () => {
  if (map) {
    map.invalidateSize()
  }
}

watch(() => props.locations, () => {
  if (mapInitialized.value) {
    addMarkers()
  }
}, { deep: true })

watch(() => props.selectedLocation, (newLocation) => {
  if (newLocation && mapInitialized.value) {
    selectLocationOnMap(newLocation)
  } else if (!newLocation && mapInitialized.value) {
    clearSelectionOnMap()
  }
})

watch(darkMode, () => {
  if (mapInitialized.value) {
    applyMapDarkMode()
  }
})

watch(() => props.sidebarOpen, () => {
  if (mapInitialized.value) {
    setTimeout(() => {
      invalidateSize()
    }, 300)
  }
})

onMounted(() => {
  initMap()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})

defineExpose({
  invalidateSize,
  selectLocationOnMap,
  clearSelectionOnMap
})
</script>

<style scoped>
.map-container {
  transition: margin-left 0.3s ease;
}
#map {
  z-index: 1;
}
</style>
