<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs" @click="close"></div>

      <div class="relative bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-neutral-100 dark:border-neutral-700 z-10 animate-fade-in">
        <div class="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-800/50">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-primary/20 text-neutral-800 dark:text-neutral-100 flex items-center justify-center">
              <i class="fas fa-qrcode text-amber-500"></i>
            </div>
            <h3 class="text-base font-bold text-neutral-900 dark:text-white">
              QR Code Form Pengajuan Lokasi
            </h3>
          </div>
          <button
            @click="close"
            class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-1 rounded-lg"
          >
            <i class="fas fa-xmark text-lg"></i>
          </button>
        </div>

        <div class="p-6">
          <!-- Loading State -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-10">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-3"></div>
            <p class="text-sm text-neutral-500 dark:text-neutral-400">Membuat QR Code...</p>
          </div>

          <!-- Success State -->
          <div v-else-if="qrData" class="space-y-5">
            <div class="flex justify-center">
              <div class="p-3 bg-white rounded-2xl shadow-md border border-neutral-200 dark:border-neutral-700">
                <img :src="qrData.qrCode" alt="QR Code" class="w-56 h-56 rounded-xl" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                Link Pengajuan Lokasi
              </label>
              <div class="flex gap-2">
                <input
                  type="text"
                  :value="qrData.link"
                  readonly
                  class="flex-1 border border-neutral-300 dark:border-neutral-600 rounded-xl px-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none"
                />
                <button
                  @click="copyLink"
                  class="bg-primary hover:bg-primary-dark text-neutral-900 font-semibold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  <i class="fas" :class="copied ? 'fa-check' : 'fa-copy'"></i>
                  {{ copied ? 'Disalin' : 'Salin' }}
                </button>
              </div>
              <p class="text-[11px] text-neutral-400 mt-1">
                Mahasiswa dapat memindai QR code ini atau menggunakan tautan di atas untuk mengajukan titik magang baru.
              </p>
            </div>

            <!-- Share Buttons -->
            <div>
              <label class="block text-xs font-semibold text-neutral-600 dark:text-neutral-300 uppercase tracking-wider mb-2">
                Bagikan Tautan
              </label>
              <div class="flex gap-2">
                <button
                  @click="shareViaWhatsApp"
                  class="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition"
                >
                  <i class="fab fa-whatsapp text-sm"></i> WhatsApp
                </button>
                <button
                  @click="shareViaTelegram"
                  class="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-semibold transition"
                >
                  <i class="fab fa-telegram text-sm"></i> Telegram
                </button>
              </div>
            </div>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="py-6 text-center">
            <p class="text-red-500 text-sm mb-3">{{ error }}</p>
            <button
              @click="generateQRCode"
              class="px-4 py-2 bg-primary hover:bg-primary-dark text-neutral-900 text-xs font-semibold rounded-xl"
            >
              Coba Lagi
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-neutral-100 dark:border-neutral-700 flex justify-between bg-neutral-50/50 dark:bg-neutral-800/50">
          <button
            @click="close"
            class="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            Tutup
          </button>
          <button
            @click="downloadQRCode"
            :disabled="!qrData?.qrCode || loading"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
          >
            <i class="fas fa-download"></i> Unduh Gambar QR
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import QRCode from 'qrcode'
import api, { getAppUrl } from '../api'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  apiUrl: {
    type: String,
    default: '/api/locations/generate-link'
  }
})

const emit = defineEmits(['close'])

const loading = ref(false)
const qrData = ref(null)
const error = ref(null)
const copied = ref(false)

const close = () => {
  emit('close')
}

const copyLink = async () => {
  if (!qrData.value?.link) return
  try {
    await navigator.clipboard.writeText(qrData.value.link)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch (e) {
    console.error(e)
  }
}

const downloadQRCode = () => {
  if (!qrData.value?.qrCode) return
  const a = document.createElement('a')
  a.href = qrData.value.qrCode
  a.download = `qr-code-pengajuan-magang-${new Date().toISOString().slice(0, 10)}.png`
  a.click()
}

const shareViaWhatsApp = () => {
  if (!qrData.value?.link) return
  const text = encodeURIComponent(`Silakan mengisi formulir pengajuan titik magang melalui tautan berikut:\n${qrData.value.link}`)
  window.open(`https://wa.me/?text=${text}`, '_blank')
}

const shareViaTelegram = () => {
  if (!qrData.value?.link) return
  const text = encodeURIComponent(`Pengajuan Lokasi Magang`)
  const url = encodeURIComponent(qrData.value.link)
  window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
}

const generateQRCode = async () => {
  loading.value = true
  error.value = null

  try {
    const appOrigin = getAppUrl()
    const res = await api.post(props.apiUrl, { app_url: appOrigin })
    let link = res.data?.link

    // Normalisasi origin jika backend mengembalikan localhost tetapi appOrigin berbeda
    if (link && appOrigin) {
      try {
        const urlObj = new URL(link)
        const targetOrigin = new URL(appOrigin).origin
        link = `${targetOrigin}${urlObj.pathname}${urlObj.search}${urlObj.hash}`
      } catch (e) {
        // biarkan link apa adanya jika bukan full URL
      }
    }
    if (!link) {
      link = `${appOrigin}/locations/add`
    }

    const qrCode = await QRCode.toDataURL(link, {
      width: 250,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#171717',
        light: '#FFFFFF'
      }
    })

    qrData.value = {
      link,
      qrCode,
      timestamp: new Date().toLocaleDateString('id-ID')
    }
  } catch (err) {
    console.error('Error generating QR:', err)
    // Fallback if backend generate-link endpoint fails
    const appOrigin = getAppUrl()
    const fallbackLink = `${appOrigin}/locations/add`
    const qrCode = await QRCode.toDataURL(fallbackLink, {
      width: 250,
      margin: 2,
      color: { dark: '#171717', light: '#FFFFFF' }
    })
    qrData.value = { link: fallbackLink, qrCode, timestamp: new Date().toLocaleDateString('id-ID') }
  } finally {
    loading.value = false
  }
}

watch(() => props.show, (newVal) => {
  if (newVal && !qrData.value) {
    generateQRCode()
  }
})
</script>
