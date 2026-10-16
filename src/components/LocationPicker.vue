<script setup>
import { ref, onMounted, nextTick, watch, computed } from "vue"
import InputLabel from "./InputLabel.vue"
import InputError from "./InputError.vue"
import TextInput from "./TextInput.vue"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const props = defineProps({
  latitude: { type: [String, Number], default: "" },
  longitude: { type: [String, Number], default: "" },
  errorLatitude: { type: String, default: "" },
  errorLongitude: { type: String, default: "" }
})

const emit = defineEmits(["update:latitude", "update:longitude"])

const darkMode = computed(() => {
  return document.documentElement.classList.contains('dark')
})

const updateLat = (val) => {
  const num = parseFloat(val)
  emit("update:latitude", !isNaN(num) ? num.toFixed(6) : val)
}
const updateLng = (val) => {
  const num = parseFloat(val)
  emit("update:longitude", !isNaN(num) ? num.toFixed(6) : val)
}

const mapEl = ref(null)
let map = null
let marker = null
let tiles = null

const createCustomIcon = () => {
  return L.divIcon({
    html: `
      <div class="flex items-center justify-center transform transition-all duration-300 hover:scale-110 drop-shadow-lg text-amber-500">
        <i class="fas fa-location-dot text-3xl"></i>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  })
}

const createMarker = (lat, lng) => {
  if (isNaN(lat) || isNaN(lng)) return
  if (marker) {
    marker.setLatLng([lat, lng])
  } else {
    marker = L.marker([lat, lng], {
      icon: createCustomIcon(),
      draggable: true
    }).addTo(map)

    marker.on('dragend', (event) => {
      const position = event.target.getLatLng()
      updateLat(position.lat)
      updateLng(position.lng)
    })
  }
}

const initMap = () => {
  if (map || !mapEl.value) return

  const lat = props.latitude ? parseFloat(props.latitude) : -8.65
  const lng = props.longitude ? parseFloat(props.longitude) : 115.2167

  map = L.map(mapEl.value, {
    zoomControl: false,
    preferCanvas: true,
    attributionControl: false,
    maxBounds: [
      [-85, -180],
      [85, 180]
    ],
    maxBoundsViscosity: 0.5
  }).setView([lat, lng], 12)

  tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxNativeZoom: 19,
    crossOrigin: true,
  }).addTo(map)

  L.control.zoom({ position: "topright" }).addTo(map)
  L.control.attribution({ position: "bottomleft" }).addTo(map)

  if (props.latitude && props.longitude) {
    createMarker(parseFloat(props.latitude), parseFloat(props.longitude))
    map.setView([parseFloat(props.latitude), parseFloat(props.longitude)], 15)
  }

  setTimeout(() => map?.invalidateSize(), 150)

  map.on("click", ({ latlng }) => {
    updateLat(latlng.lat)
    updateLng(latlng.lng)
    createMarker(latlng.lat, latlng.lng)
  })
}

onMounted(() => {
  nextTick(() => {
    if (mapEl.value) {
      initMap()
    }
  })
})

watch(() => [props.latitude, props.longitude], ([lat, lng]) => {
  if (!map || !lat || !lng) return
  const pLat = parseFloat(lat)
  const pLng = parseFloat(lng)
  if (!isNaN(pLat) && !isNaN(pLng)) {
    createMarker(pLat, pLng)
  }
})

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation tidak didukung browser Anda.")
    return
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      updateLat(coords.latitude)
      updateLng(coords.longitude)
      if (map) {
        map.setView([coords.latitude, coords.longitude], 15)
        createMarker(coords.latitude, coords.longitude)
      }
    },
    (err) => alert("Gagal mendapatkan lokasi: " + err.message),
    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  )
}
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700 text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
      <i class="fas fa-map-pin text-amber-500"></i>
      Koordinat Lokasi
    </div>

    <div class="p-6 space-y-6">
      <!-- Input Lat / Lng -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <InputLabel for="latitude" value="Latitude *" />
          <TextInput
            id="latitude"
            type="number"
            step="any"
            :modelValue="props.latitude"
            @update:modelValue="updateLat"
            required
            placeholder="-8.650000"
          />
          <InputError class="mt-2" :message="props.errorLatitude" />
        </div>

        <div>
          <InputLabel for="longitude" value="Longitude *" />
          <TextInput
            id="longitude"
            type="number"
            step="any"
            :modelValue="props.longitude"
            @update:modelValue="updateLng"
            required
            placeholder="115.220000"
          />
          <InputError class="mt-2" :message="props.errorLongitude" />
        </div>
      </div>

      <!-- Action Button -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          @click="getCurrentLocation"
          class="px-4 py-2 border border-primary text-neutral-800 dark:text-white hover:bg-primary/20 font-medium rounded-xl transition-colors duration-200 inline-flex items-center gap-2 text-sm w-fit"
        >
          <i class="fas fa-location-crosshairs text-amber-500"></i>
          Dapatkan Lokasi Saat Ini (GPS)
        </button>

        <p class="text-xs text-neutral-500 dark:text-neutral-400">
          Atau klik pada peta di bawah untuk menandai lokasi
        </p>
      </div>

      <!-- Map -->
      <div class="space-y-2">
        <div
          ref="mapEl"
          class="w-full h-72 rounded-xl border border-neutral-300 dark:border-neutral-600 overflow-hidden shadow-inner relative z-0"
        ></div>
        <p class="text-xs text-neutral-500 dark:text-neutral-400">
          Tips: Klik peta untuk menempatkan pin, atau geser pin langsung untuk penyesuaian yang akurat.
        </p>
      </div>
    </div>
  </div>
</template>
