<script setup>
import { getImageUrl } from '../api'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  location: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'approve'])

const close = () => {
  emit('close')
}

const approve = (id) => {
  emit('approve', id)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show && location" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" @click="close"></div>

      <!-- Modal Container -->
      <div class="relative bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-neutral-100 dark:border-neutral-700 z-10 animate-fade-in">
        <!-- Modal Header -->
        <div class="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/50">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-primary/20 text-neutral-800 dark:text-neutral-100 flex items-center justify-center">
              <i class="fas fa-location-dot text-amber-500"></i>
            </div>
            <h3 class="text-lg font-bold text-neutral-900 dark:text-white">
              Detail Titik Magang
            </h3>
          </div>
          <button
            @click="close"
            class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition"
          >
            <i class="fas fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="overflow-y-auto p-6 space-y-6 flex-grow">
          <!-- Image Gallery -->
          <div class="bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl p-4 border border-neutral-100 dark:border-neutral-700">
            <h4 class="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-3 flex items-center gap-2">
              <i class="fas fa-images text-amber-500"></i>
              Dokumentasi Foto Lokasi
            </h4>

            <div v-if="location.images && location.images.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div
                v-for="img in location.images"
                :key="img.id_image || img.image_path"
                class="group relative aspect-video sm:aspect-4/3 rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-700 shadow-sm"
              >
                <img
                  :src="getImageUrl(img.image_path)"
                  :alt="img.alt_text || location.name_location"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <a
                  :href="getImageUrl(img.image_path)"
                  target="_blank"
                  class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium gap-1"
                >
                  <i class="fas fa-arrow-up-right-from-square"></i> Lihat
                </a>
              </div>
            </div>

            <div v-else class="py-8 text-center text-neutral-400 text-sm">
              <i class="fas fa-image text-3xl mb-2 opacity-50 block"></i>
              Belum ada foto dokumentasi yang diunggah
            </div>
          </div>

          <!-- Information Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Left: Student & Verification Info -->
            <div class="space-y-4">
              <div class="bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 space-y-3">
                <h4 class="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                  <i class="fas fa-user-graduate text-amber-500"></i>
                  Data Mahasiswa
                </h4>
                <div>
                  <span class="text-xs text-neutral-400">Nama Mahasiswa:</span>
                  <p class="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
                    {{ location.student_name || '-' }}
                  </p>
                </div>
                <div>
                  <span class="text-xs text-neutral-400">NIM:</span>
                  <p class="text-sm font-mono text-neutral-800 dark:text-neutral-100">
                    {{ location.nim || '-' }}
                  </p>
                </div>
                <div>
                  <span class="text-xs text-neutral-400">Fakultas:</span>
                  <p class="text-sm text-neutral-800 dark:text-neutral-100">
                    {{ location.department?.faculty?.name_faculty || '-' }}
                  </p>
                </div>
                <div>
                  <span class="text-xs text-neutral-400">Jurusan:</span>
                  <p class="text-sm text-neutral-800 dark:text-neutral-100">
                    {{ location.department?.name_department || '-' }}
                    <span v-if="location.department?.degree_level" class="text-xs bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded-full ml-1">
                      {{ location.department.degree_level }}
                    </span>
                  </p>
                </div>
              </div>

              <!-- Status Info -->
              <div class="bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 space-y-2">
                <h4 class="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                  <i class="fas fa-shield-halved text-amber-500"></i>
                  Status Persetujuan
                </h4>
                <div class="pt-1">
                  <span
                    v-if="location.approved_at"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                  >
                    <i class="fas fa-check-circle"></i> Disetujui
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                  >
                    <i class="fas fa-clock"></i> Menunggu Persetujuan
                  </span>
                </div>
                <div v-if="location.approved_at" class="text-xs text-neutral-500 dark:text-neutral-400 pt-1">
                  Disetujui pada: {{ new Date(location.approved_at).toLocaleString('id-ID') }}
                </div>
              </div>
            </div>

            <!-- Right: Location Details -->
            <div class="space-y-4">
              <div class="bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 space-y-3">
                <h4 class="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                  <i class="fas fa-building text-amber-500"></i>
                  Detail Perusahaan / Tempat
                </h4>
                <div>
                  <span class="text-xs text-neutral-400">Nama Tempat:</span>
                  <p class="text-sm font-bold text-neutral-900 dark:text-white">
                    {{ location.name_location }}
                  </p>
                </div>
                <div>
                  <span class="text-xs text-neutral-400">Kategori:</span>
                  <p class="text-sm font-medium text-amber-600 dark:text-amber-400">
                    {{ location.category?.name_category || '-' }}
                  </p>
                </div>
                <div>
                  <span class="text-xs text-neutral-400">Kontak:</span>
                  <p class="text-sm text-neutral-800 dark:text-neutral-200">
                    {{ location.contact || '-' }}
                  </p>
                </div>
                <div>
                  <span class="text-xs text-neutral-400">Deskripsi:</span>
                  <p class="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed max-h-32 overflow-y-auto">
                    {{ location.description || 'Tidak ada deskripsi' }}
                  </p>
                </div>
              </div>

              <!-- Coordinates & Map Link -->
              <div class="bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700 space-y-3">
                <h4 class="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-700">
                  <i class="fas fa-map text-amber-500"></i>
                  Titik Koordinat
                </h4>
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div class="bg-white dark:bg-neutral-800 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <span class="text-xs text-neutral-400 block mb-0.5">Latitude:</span>
                    <span class="font-mono font-medium">{{ location.latitude }}</span>
                  </div>
                  <div class="bg-white dark:bg-neutral-800 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <span class="text-xs text-neutral-400 block mb-0.5">Longitude:</span>
                    <span class="font-mono font-medium">{{ location.longitude }}</span>
                  </div>
                </div>

                <a
                  :href="`https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`"
                  target="_blank"
                  class="mt-2 inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                >
                  <i class="fas fa-map-location-dot"></i> Buka di Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="px-6 py-4 border-t border-neutral-100 dark:border-neutral-700 flex justify-end gap-3 bg-neutral-50/50 dark:bg-neutral-800/50">
          <button
            type="button"
            @click="close"
            class="px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-sm font-medium transition"
          >
            Tutup
          </button>
          <button
            v-if="!location.approved_at"
            type="button"
            @click="approve(location.id_location)"
            class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition flex items-center gap-2 shadow-sm"
          >
            <i class="fas fa-check"></i> Setujui Pengajuan
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
