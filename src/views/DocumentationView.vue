<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '../stores/profile'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const profileStore = useProfileStore()
const router = useRouter()

const searchQuery = ref('')
const mobileSidebarOpen = ref(false)
const activeSection = ref('pengantar')

const toggleSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

const scrollToSection = (id) => {
  activeSection.value = id
  mobileSidebarOpen.value = false
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const sendFeedback = (isHelpful) => {
  toast.success(isHelpful ? 'Terima kasih atas masukannya!' : 'Terima kasih, kami akan terus menyempurnakan dokumentasi ini.')
}

onMounted(() => {
  profileStore.fetchProfile()
})
</script>

<template>
  <div
    class="bg-white text-neutral-800 antialiased selection:bg-primary selection:text-neutral-950 font-sans min-h-screen">
    <div class="flex min-h-screen">

      <!-- Mobile Backdrop -->
      <div v-if="mobileSidebarOpen" @click="mobileSidebarOpen = false"
        class="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"></div>

      <!-- Left Sidebar Navigation -->
      <aside :class="[
        'fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-neutral-200 p-6 overflow-y-auto transition-transform duration-300 ease-in-out shrink-0',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:sticky md:top-0 md:h-screen'
      ]">
        <!-- Logo -->
        <div class="mb-8 flex items-center justify-between">
          <router-link to="/" class="flex items-center gap-2.5 group">
            <img v-if="profileStore.logoUrl" :src="profileStore.logoUrl" :alt="profileStore.profile.app_name || 'Logo'"
              class="h-9 w-auto max-w-30 object-contain rounded" />
            <div v-else
              class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-neutral-900 shadow-sm group-hover:rotate-6 transition-transform">
              <iconify-icon icon="lucide:map-pin" width="20" class="stroke-[2.5]"></iconify-icon>
            </div>
            <div>
              <span class="text-lg font-extrabold tracking-tight text-neutral-900">
                {{ profileStore.profile.app_name || 'Titik' }}
              </span>
              <span class="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Docs v1.0</span>
            </div>
          </router-link>
          <button @click="mobileSidebarOpen = false" class="md:hidden text-neutral-400 hover:text-neutral-800 p-1">
            <iconify-icon icon="lucide:x" width="20"></iconify-icon>
          </button>
        </div>

        <!-- Navigation Links -->
        <nav class="space-y-7">
          <!-- Category 1 -->
          <div>
            <div class="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5 px-3">
              Memulai (Getting Started)
            </div>
            <ul class="space-y-1 text-xs">
              <li>
                <button @click="scrollToSection('pengantar')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'pengantar' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  Pengenalan Platform
                </button>
              </li>
              <li>
                <button @click="scrollToSection('registrasi')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'registrasi' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  Registrasi &amp; Akses Akun
                </button>
              </li>
              <li>
                <button @click="scrollToSection('peta-interaktif')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'peta-interaktif' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  Navigasi Peta GIS
                </button>
              </li>
            </ul>
          </div>

          <!-- Category 2 -->
          <div>
            <div class="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5 px-3">
              Panduan Mahasiswa
            </div>
            <ul class="space-y-1 text-xs">
              <li>
                <button @click="scrollToSection('pencarian-filter')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'pencarian-filter' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  Cari &amp; Filter Kategori
                </button>
              </li>
              <li>
                <button @click="scrollToSection('hubungi-mitra')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'hubungi-mitra' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  Kontak WhatsApp &amp; Rute
                </button>
              </li>
              <li>
                <button @click="scrollToSection('pengajuan-titik')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'pengajuan-titik' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  Pengajuan Titik Baru
                </button>
              </li>
              <li>
                <button @click="scrollToSection('unggah-laporan')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'unggah-laporan' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  Unggah Laporan Akhir
                </button>
              </li>
              <li>
                <button @click="scrollToSection('unduh-laporan')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'unduh-laporan' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  Referensi Laporan Alumni
                </button>
              </li>
            </ul>
          </div>

          <!-- Category 3 -->
          <div>
            <div class="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5 px-3">
              Panduan Admin &amp; Koordinator
            </div>
            <ul class="space-y-1 text-xs">
              <li>
                <button @click="scrollToSection('verifikasi-titik')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'verifikasi-titik' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  Verifikasi Pengajuan Lokasi
                </button>
              </li>
              <li>
                <button @click="scrollToSection('validasi-laporan')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'validasi-laporan' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  Validasi Laporan &amp; Revisi
                </button>
              </li>
              <li>
                <button @click="scrollToSection('kelola-master-data')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'kelola-master-data' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  Master Data Fakultas &amp; Jurusan
                </button>
              </li>
              <li>
                <button @click="scrollToSection('profil-website')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'profil-website' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  Pengaturan Profil &amp; Logo
                </button>
              </li>
            </ul>
          </div>

          <!-- Category 4 -->
          <div>
            <div class="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5 px-3">
              Teknis &amp; Bantuan
            </div>
            <ul class="space-y-1 text-xs">
              <li>
                <button @click="scrollToSection('arsitektur')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'arsitektur' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  Arsitektur &amp; Teknologi
                </button>
              </li>
              <li>
                <button @click="scrollToSection('api-endpoints')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'api-endpoints' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  REST API Reference
                </button>
              </li>
              <li>
                <button @click="scrollToSection('faq')"
                  :class="['w-full text-left pl-3 py-2 rounded-r-lg font-medium transition border-l-2', activeSection === 'faq' ? 'border-amber-600 text-amber-900 bg-amber-50 font-bold' : 'border-transparent text-neutral-600 hover:bg-neutral-50']">
                  FAQ &amp; Solusi Kendala
                </button>
              </li>
            </ul>
          </div>
        </nav>

        <!-- Bottom Button -->
        <div class="mt-10 pt-6 border-t border-neutral-200">
          <router-link to="/map"
            class="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition shadow-xs">
            <iconify-icon icon="lucide:map" width="16" class="text-primary"></iconify-icon>
            <span>Buka Peta Interaktif</span>
          </router-link>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 min-w-0">
        <div class="max-w-4xl mx-auto px-6 lg:px-10 py-8 lg:py-12">

          <!-- Top Header & Search -->
          <div class="flex items-center justify-between gap-4 mb-10 pb-6 border-b border-neutral-100">
            <div class="flex items-center gap-3">
              <button @click="toggleSidebar" type="button"
                class="md:hidden p-2 text-neutral-600 hover:text-neutral-900 rounded-lg border border-neutral-200">
                <iconify-icon icon="lucide:menu" width="20"></iconify-icon>
              </button>

              <div class="relative w-full max-w-sm">
                <input v-model="searchQuery" type="text" placeholder="Cari dokumentasi atau fitur..."
                  class="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-amber-500 transition" />
                <iconify-icon icon="lucide:search"
                  class="text-neutral-400 absolute left-3 top-2.5 text-base"></iconify-icon>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <router-link to="/"
                class="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
                title="Ke Beranda">
                <iconify-icon icon="lucide:home" width="18"></iconify-icon>
              </router-link>
              <router-link to="/map"
                class="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition"
                title="Ke Peta Magang">
                <iconify-icon icon="lucide:map" width="18"></iconify-icon>
              </router-link>
              <router-link to="/login"
                class="px-3 py-1.5 text-xs font-bold text-neutral-900 bg-primary hover:bg-amber-400 rounded-lg transition flex items-center gap-1">
                <iconify-icon icon="lucide:log-in"></iconify-icon>
                <span>Masuk</span>
              </router-link>
            </div>
          </div>

          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-xs text-neutral-400 mb-6 font-medium">
            <router-link to="/" class="hover:text-neutral-700">Beranda</router-link>
            <span>/</span>
            <span class="text-amber-700 font-bold">Dokumentasi Panduan</span>
          </div>

          <!-- Document Articles -->
          <article class="prose max-w-none text-neutral-700">
            <!-- Section 1 -->
            <section id="pengantar" class="mb-14 scroll-mt-20">
              <div
                class="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-primary-100 text-amber-900 text-[11px] font-bold mb-3">
                <iconify-icon icon="lucide:info"></iconify-icon>
                <span>Overview Sistem</span>
              </div>
              <h1 class="text-3xl lg:text-4xl font-extrabold mb-4 text-neutral-900 tracking-tight">
                Pengenalan Titik Magang
              </h1>
              <p class="text-base text-neutral-600 leading-relaxed mb-6">
                <strong>Titik Magang</strong> adalah platform Sistem Informasi Geografis (Web GIS) terpadu yang
                dirancang untuk memetakan, mengelola, dan memfasilitasi kegiatan Praktik Kerja Lapangan (PKL) serta
                magang mahasiswa. Platform ini menghubungkan mahasiswa dengan instansi mitra, dosen koordinator, dan
                arsip laporan magang terverifikasi secara transparan.
              </p>

              <div class="flex p-4 bg-primary-50 border border-primary-200 rounded-2xl mb-8">
                <div class="shrink-0 text-amber-700 mt-0.5">
                  <iconify-icon icon="lucide:lightbulb" width="22"></iconify-icon>
                </div>
                <div class="ml-3.5">
                  <h3 class="text-xs font-bold text-amber-900 uppercase tracking-wide">Tujuan Utama Platform</h3>
                  <div class="mt-1 text-xs text-amber-950/80 leading-relaxed">
                    Memudahkan mahasiswa menemukan tempat PKL yang relevan dengan program studi, meminimalisir penolakan
                    permohonan magang melalui kontak instansi yang teruji, serta menyediakan bank referensi laporan PKL
                    yang sah.
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
                <div class="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70">
                  <div
                    class="w-8 h-8 rounded-lg bg-primary/40 flex items-center justify-center text-neutral-900 mb-2 font-bold">
                    <iconify-icon icon="lucide:map-pin"></iconify-icon>
                  </div>
                  <h4 class="font-bold text-sm text-neutral-900">Spasial &amp; Presisi</h4>
                  <p class="text-xs text-neutral-500 mt-1">Koordinat GPS aktual dengan peta interaktif Leaflet.</p>
                </div>
                <div class="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70">
                  <div
                    class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2 font-bold">
                    <iconify-icon icon="lucide:message-circle"></iconify-icon>
                  </div>
                  <h4 class="font-bold text-sm text-neutral-900">Direct WhatsApp</h4>
                  <p class="text-xs text-neutral-500 mt-1">Menghubungi pembimbing instansi tanpa perantara.</p>
                </div>
                <div class="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70">
                  <div
                    class="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-2 font-bold">
                    <iconify-icon icon="lucide:file-check-2"></iconify-icon>
                  </div>
                  <h4 class="font-bold text-sm text-neutral-900">Arsip PDF Laporan</h4>
                  <p class="text-xs text-neutral-500 mt-1">Laporan magang resmi yang telah disetujui koordinator.</p>
                </div>
              </div>

              <p class="text-sm text-neutral-600 leading-relaxed mb-2">
                Platform ini digunakan oleh tiga peran utama: <strong>Mahasiswa</strong> yang mencari dan mengajukan
                lokasi PKL, <strong>Instansi Mitra</strong> yang datanya dipetakan secara akurat, serta
                <strong>Admin/Koordinator Kampus</strong> yang bertugas memverifikasi setiap pengajuan sebelum tampil ke
                publik. Dengan alur kerja yang terintegrasi ini, proses pencarian tempat magang menjadi lebih cepat,
                transparan, dan minim kesalahan data.
              </p>
            </section>

            <!-- Section 2 -->
            <section id="registrasi" class="mb-14 scroll-mt-20">
              <h2 class="text-2xl font-bold mt-10 mb-4 text-neutral-900 flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-lg bg-neutral-900 text-white text-xs flex items-center justify-center">2</span>
                Registrasi &amp; Akses Akun
              </h2>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Aplikasi Titik Magang memiliki dua jenis peran (role): <strong>Mahasiswa (User)</strong> dan
                <strong>Administrator Kampus (Admin)</strong>.
              </p>

              <div class="space-y-3 my-4">
                <div class="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs">
                  <h4 class="font-bold text-sm text-neutral-900 mb-1">1. Mendaftar Akun Mahasiswa</h4>
                  <p class="text-xs text-neutral-600">
                    Buka halaman <router-link to="/register"
                      class="text-amber-700 font-bold hover:underline">/register</router-link>, masukkan Username (NIM)
                    dan Password yang aman. Setelah berhasil terdaftar, Anda akan langsung dialihkan ke dashboard
                    mahasiswa.
                  </p>
                </div>
                <div class="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs">
                  <h4 class="font-bold text-sm text-neutral-900 mb-1">2. Masuk Portal (Login)</h4>
                  <p class="text-xs text-neutral-600">
                    Kunjungi halaman <router-link to="/login"
                      class="text-amber-700 font-bold hover:underline">/login</router-link>. Sistem menggunakan
                    otentikasi berbasis JSON Web Token (JWT) yang disimpan secara aman di LocalStorage browser.
                  </p>
                </div>
                <div class="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs">
                  <h4 class="font-bold text-sm text-neutral-900 mb-1">3. Mengelola Sesi &amp; Profil</h4>
                  <p class="text-xs text-neutral-600">
                    Setelah login, token sesi akan otomatis diperbarui selama Anda aktif. Data profil seperti nama,
                    fakultas, dan program studi dapat diperbarui kapan saja melalui menu akun pada dashboard.
                  </p>
                </div>
              </div>

              <p class="text-sm text-neutral-600 leading-relaxed">
                Akun dengan peran <strong>Admin</strong> tidak dapat didaftarkan secara mandiri melalui halaman publik;
                akun tersebut hanya dapat dibuat atau ditingkatkan hak aksesnya oleh Super Admin melalui sistem backend
                demi menjaga keamanan data instansi.
              </p>
            </section>

            <!-- Section 3 -->
            <section id="peta-interaktif" class="mb-14 scroll-mt-20">
              <h2 class="text-2xl font-bold mt-10 mb-4 text-neutral-900 flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-lg bg-neutral-900 text-white text-xs flex items-center justify-center">3</span>
                Navigasi Peta Interaktif GIS
              </h2>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Halaman peta interaktif (<router-link to="/map"
                  class="text-amber-700 font-bold hover:underline">/map</router-link>) merupakan pusat pencarian utama
                titik magang:
              </p>

              <ul class="space-y-2.5 text-xs text-neutral-600 pl-4 list-disc mb-6">
                <li><strong>Marker Khusus:</strong> Setiap instansi magang ditandai pin lokasi pada peta. Klik pin untuk
                  membuka drawer informasi lengkap di sisi samping (atau layar bawah pada ponsel).</li>
                <li><strong>Zoom &amp; Pan:</strong> Gunakan gestur pinch atau tombol kontrol zoom (+/-) untuk melihat
                  kawasan instansi lebih dekat.</li>
                <li><strong>Dark Mode:</strong> Tersedia tombol toggle tema gelap/terang di pojok panel untuk kenyamanan
                  visual saat malam hari.</li>
                <li><strong>Cluster Marker:</strong> Saat tampilan di-zoom keluar, titik-titik yang berdekatan akan
                  otomatis dikelompokkan menjadi satu angka agar peta tidak terlihat penuh sesak.</li>
                <li><strong>Lokasi Saya:</strong> Tombol geolocation memusatkan peta ke posisi Anda saat ini sehingga
                  mudah menemukan instansi magang terdekat dari lokasi Anda berada.</li>
              </ul>
            </section>

            <!-- Section 4 -->
            <section id="pencarian-filter" class="mb-14 scroll-mt-20">
              <h2 class="text-2xl font-bold mt-10 mb-4 text-neutral-900 flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-lg bg-neutral-900 text-white text-xs flex items-center justify-center">4</span>
                Mencari &amp; Memfilter Lokasi Magang
              </h2>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Di bagian atas peta terdapat search bar cerdas yang dilengkapi autocomplete dan badge filter kategori
                industri:
              </p>

              <div class="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 mb-4 space-y-2">
                <div class="flex items-center gap-2 text-xs font-bold text-neutral-800">
                  <iconify-icon icon="lucide:filter" class="text-amber-600"></iconify-icon>
                  <span>Filter Multi-Kategori:</span>
                </div>
                <p class="text-xs text-neutral-500">
                  Anda dapat mengklik pill kategori (seperti <em>Software Engineering</em>, <em>Networking</em>, atau
                  <em>Desain Komunikasi Visual</em>) untuk menyaring hanya instansi yang relevan dengan peminatan Anda.
                </p>
              </div>

              <div class="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-2">
                <div class="flex items-center gap-2 text-xs font-bold text-neutral-800">
                  <iconify-icon icon="lucide:search" class="text-amber-600"></iconify-icon>
                  <span>Pencarian Berdasarkan Nama:</span>
                </div>
                <p class="text-xs text-neutral-500">
                  Ketik nama instansi, alamat, atau kecamatan pada kolom pencarian untuk melihat saran otomatis
                  (autocomplete). Hasil pencarian akan langsung memusatkan peta ke lokasi yang dipilih beserta
                  informasi ringkasnya.
                </p>
              </div>
            </section>

            <!-- Section 5 -->
            <section id="hubungi-mitra" class="mb-14 scroll-mt-20">
              <h2 class="text-2xl font-bold mt-10 mb-4 text-neutral-900 flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-lg bg-neutral-900 text-white text-xs flex items-center justify-center">5</span>
                Kontak WhatsApp &amp; Navigasi Rute
              </h2>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Setelah memilih salah satu instansi, tersedia 3 tombol aksi cepat di drawer detail:
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <div class="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <iconify-icon icon="lucide:message-circle"></iconify-icon>
                    Chat WhatsApp
                  </div>
                  <p class="text-emerald-800 text-[11px]">Membuka WhatsApp dengan template teks sapaan otomatis ke nomor
                    HRD.</p>
                </div>
                <div class="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs">
                  <div class="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                    <iconify-icon icon="lucide:navigation"></iconify-icon>
                    Rute Google Maps
                  </div>
                  <p class="text-blue-800 text-[11px]">Membuka petunjuk arah navigasi dari posisi Anda menuju lokasi
                    instansi magang.</p>
                </div>
                <div class="p-3 bg-neutral-100 rounded-xl border border-neutral-200 text-xs">
                  <div class="font-bold text-neutral-900 flex items-center gap-1.5 mb-1">
                    <iconify-icon icon="lucide:map-pin"></iconify-icon>
                    Maps View
                  </div>
                  <p class="text-neutral-700 text-[11px]">Melihat titik koordinat instansi di aplikasi Google Maps
                    eksternal.</p>
                </div>
              </div>

              <p class="text-sm text-neutral-600 leading-relaxed">
                Nomor kontak dan alamat yang ditampilkan bersumber langsung dari data yang diverifikasi oleh
                Admin/Koordinator, sehingga Anda tidak perlu khawatir menghubungi nomor yang sudah tidak aktif.
              </p>
            </section>

            <!-- Section 6 -->
            <section id="pengajuan-titik" class="mb-14 scroll-mt-20">
              <h2 class="text-2xl font-bold mt-10 mb-4 text-neutral-900 flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-lg bg-neutral-900 text-white text-xs flex items-center justify-center">6</span>
                Pengajuan Titik Magang Baru
              </h2>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Jika Anda magang di tempat baru yang belum terdaftar di peta, Anda dapat mengusulkannya melalui formulir
                pengajuan di <router-link to="/locations/add"
                  class="text-amber-700 font-bold hover:underline">/locations/add</router-link>.
              </p>

              <ul class="space-y-2.5 text-xs text-neutral-600 pl-4 list-disc mb-4">
                <li><strong>Nama &amp; Alamat Instansi:</strong> Nama resmi perusahaan/instansi beserta alamat lengkap.
                </li>
                <li><strong>Titik Koordinat:</strong> Pilih langsung pada peta mini di formulir untuk menandai lokasi
                  secara presisi.</li>
                <li><strong>Kategori Bidang:</strong> Pilih kategori industri yang paling sesuai agar mudah ditemukan
                  mahasiswa lain.</li>
                <li><strong>Kontak &amp; Foto:</strong> Nomor WhatsApp pembimbing lapangan serta foto gedung/kantor
                  sebagai bukti keberadaan instansi.</li>
              </ul>

              <div class="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <strong>Catatan:</strong> Titik magang baru tidak akan langsung tampil di peta publik sebelum disetujui
                oleh Administrator / Koordinator Magang.
              </div>
            </section>

            <!-- Section 7 -->
            <section id="unggah-laporan" class="mb-14 scroll-mt-20">
              <h2 class="text-2xl font-bold mt-10 mb-4 text-neutral-900 flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-lg bg-neutral-900 text-white text-xs flex items-center justify-center">7</span>
                Unggah Laporan Akhir PKL
              </h2>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Setelah masa magang selesai, mahasiswa dapat mengunggah berkas laporan akhir melalui <strong>Dashboard
                  Mahasiswa (/user/dashboard)</strong> dalam format berkas PDF (maksimal 25 MB).
              </p>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Setelah diunggah, laporan akan berstatus <code>pending</code> dan masuk ke antrean pemeriksaan
                koordinator. Anda dapat memantau perubahan status (<em>pending</em>, <em>perlu revisi</em>, atau
                <em>verified</em>) langsung dari dashboard tanpa perlu menghubungi admin secara manual.
              </p>
              <div class="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                <strong>Tips:</strong> Gunakan nama berkas yang jelas, misalnya
                <code>Laporan_PKL_NamaMahasiswa_NIM.pdf</code>, agar memudahkan proses pemeriksaan oleh koordinator.
              </div>
            </section>

            <!-- Section 8 -->
            <section id="unduh-laporan" class="mb-14 scroll-mt-20">
              <h2 class="text-2xl font-bold mt-10 mb-4 text-neutral-900 flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-lg bg-neutral-900 text-white text-xs flex items-center justify-center">8</span>
                Referensi Laporan Terverifikasi
              </h2>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Setiap laporan yang berstatus <code>verified</code> dapat diunduh oleh sesama mahasiswa sebagai bahan
                rujukan dan pedoman penulisan laporan PKL.
              </p>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Arsip laporan dapat disaring berdasarkan fakultas, program studi, atau nama instansi tempat magang,
                sehingga mahasiswa dapat dengan mudah menemukan contoh laporan dari jurusan dan bidang industri yang
                serupa dengan rencana PKL mereka.
              </p>
            </section>

            <!-- Section 9: Admin -->
            <section id="verifikasi-titik" class="mb-14 scroll-mt-20">
              <h2 class="text-2xl font-bold mt-10 mb-4 text-neutral-900 flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-lg bg-primary text-neutral-950 text-xs font-bold flex items-center justify-center">9</span>
                Verifikasi Pengajuan Lokasi (Admin)
              </h2>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Admin kampus dapat memvalidasi pengajuan lokasi magang baru melalui menu <router-link
                  to="/admin/locations" class="text-amber-700 font-bold hover:underline">/admin/locations</router-link>.
              </p>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Pada halaman ini, admin dapat meninjau detail pengajuan — termasuk koordinat, foto, dan kontak
                instansi — lalu memilih tindakan <strong>Setujui</strong> agar titik tampil di peta publik, atau
                <strong>Tolak</strong> disertai alasan apabila data dianggap tidak valid atau tidak lengkap.
              </p>
            </section>

            <!-- Section 10 -->
            <section id="validasi-laporan" class="mb-14 scroll-mt-20">
              <h2 class="text-2xl font-bold mt-10 mb-4 text-neutral-900 flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-lg bg-primary text-neutral-950 text-xs font-bold flex items-center justify-center">10</span>
                Validasi Laporan &amp; Revisi
              </h2>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Di menu <router-link to="/admin/reports"
                  class="text-amber-700 font-bold hover:underline">/admin/reports</router-link>, koordinator magang
                dapat menyetujui laporan atau memberikan catatan revisi jika berkas belum lengkap.
              </p>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Apabila berkas ditandai perlu revisi, mahasiswa akan menerima catatan spesifik mengenai bagian yang
                perlu diperbaiki dan dapat mengunggah ulang berkas melalui dashboard mereka hingga laporan berstatus
                <code>verified</code>.
              </p>
            </section>

            <!-- Section 11 -->
            <section id="kelola-master-data" class="mb-14 scroll-mt-20">
              <h2 class="text-2xl font-bold mt-10 mb-4 text-neutral-900 flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-lg bg-neutral-900 text-white text-xs flex items-center justify-center">11</span>
                Kelola Master Data (Fakultas &amp; Jurusan)
              </h2>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Kelola data fakultas di <code>/admin/faculties</code>, program studi di <code>/admin/departments</code>,
                dan kategori magang di <code>/admin/categories</code>.
              </p>

              <div class="space-y-3 my-4">
                <div class="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs">
                  <h4 class="font-bold text-sm text-neutral-900 mb-1">Fakultas &amp; Program Studi</h4>
                  <p class="text-xs text-neutral-600">
                    Data ini menjadi acuan saat mahasiswa mengisi profil akun dan memengaruhi hasil filter pada
                    arsip referensi laporan.
                  </p>
                </div>
                <div class="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs">
                  <h4 class="font-bold text-sm text-neutral-900 mb-1">Kategori Magang</h4>
                  <p class="text-xs text-neutral-600">
                    Daftar bidang industri (misalnya Software Engineering, Networking, Desain Komunikasi Visual) yang
                    digunakan sebagai pill filter pada halaman peta interaktif.
                  </p>
                </div>
              </div>
            </section>

            <!-- Section 12 -->
            <section id="profil-website" class="mb-14 scroll-mt-20">
              <h2 class="text-2xl font-bold mt-10 mb-4 text-neutral-900 flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-lg bg-neutral-900 text-white text-xs flex items-center justify-center">12</span>
                Pengaturan Profil &amp; Logo Website
              </h2>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Melalui <router-link to="/admin/profile"
                  class="text-amber-700 font-bold hover:underline">/admin/profile</router-link>, admin dapat mengubah
                identitas aplikasi dan mengunggah logo resmi kampus.
              </p>
              <ul class="space-y-2.5 text-xs text-neutral-600 pl-4 list-disc mb-4">
                <li><strong>Nama Aplikasi &amp; Logo:</strong> Tampil otomatis di sidebar, halaman landing, dan favicon
                  browser.</li>
                <li><strong>Informasi Kontak Kampus:</strong> Alamat, email, dan nomor telepon Pusat Karir &amp;
                  Magang yang ditampilkan pada footer landing page.</li>
                <li><strong>Deskripsi Singkat:</strong> Teks pengantar yang muncul pada bagian hero halaman beranda
                  publik.</li>
              </ul>
            </section>

            <!-- Section 13 -->
            <section id="arsitektur" class="mb-14 scroll-mt-20">
              <h2 class="text-2xl font-bold mt-10 mb-4 text-neutral-900 flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-lg bg-neutral-900 text-white text-xs flex items-center justify-center">13</span>
                Arsitektur &amp; Teknologi
              </h2>
              <p class="text-sm text-neutral-600 mb-4 leading-relaxed">
                Frontend dibangun menggunakan <strong>Vue 3, Vite, Tailwind CSS</strong>, Leaflet, dan AG Grid. Backend
                didukung oleh <strong>Hono API, Bun, Prisma ORM, dan MySQL</strong>.
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                <div class="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70">
                  <h4 class="font-bold text-sm text-neutral-900 mb-2 flex items-center gap-1.5">
                    <iconify-icon icon="lucide:monitor" class="text-amber-600"></iconify-icon> Frontend
                  </h4>
                  <ul class="space-y-1 text-xs text-neutral-500 list-disc pl-4">
                    <li><strong>Vue 3 (Composition API)</strong> — reaktivitas komponen dan logika halaman.</li>
                    <li><strong>Vite</strong> — build tool cepat dengan Hot Module Replacement.</li>
                    <li><strong>Tailwind CSS</strong> — utility-first styling yang konsisten.</li>
                    <li><strong>Leaflet</strong> — rendering peta interaktif berbasis OpenStreetMap.</li>
                    <li><strong>AG Grid</strong> — tabel data admin dengan sorting dan pagination.</li>
                  </ul>
                </div>
                <div class="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70">
                  <h4 class="font-bold text-sm text-neutral-900 mb-2 flex items-center gap-1.5">
                    <iconify-icon icon="lucide:server" class="text-amber-600"></iconify-icon> Backend
                  </h4>
                  <ul class="space-y-1 text-xs text-neutral-500 list-disc pl-4">
                    <li><strong>Hono</strong> — framework API yang ringan dan cepat.</li>
                    <li><strong>Bun</strong> — runtime JavaScript berperforma tinggi.</li>
                    <li><strong>Prisma ORM</strong> — akses database yang type-safe.</li>
                    <li><strong>MySQL</strong> — penyimpanan data relasional utama aplikasi.</li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- Section 14 -->
            <section id="api-endpoints" class="mb-14 scroll-mt-20">
              <h2 class="text-2xl font-bold mt-10 mb-4 text-neutral-900 flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-lg bg-neutral-900 text-white text-xs flex items-center justify-center">14</span>
                REST API Reference
              </h2>
              <div class="space-y-3 font-mono text-xs">
                <div class="p-3 bg-neutral-900 text-neutral-100 rounded-xl">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
                    <span>/api/locations/approved</span>
                  </div>
                  <p class="font-sans text-[11px] text-neutral-400 mt-1">Mengambil seluruh lokasi magang yang telah
                    disetujui untuk ditampilkan pada peta publik.</p>
                </div>
                <div class="p-3 bg-neutral-900 text-neutral-100 rounded-xl">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">POST</span>
                    <span>/api/locations</span>
                  </div>
                  <p class="font-sans text-[11px] text-neutral-400 mt-1">Mengajukan titik magang baru beserta data
                    koordinat spasial dan foto.</p>
                </div>
                <div class="p-3 bg-neutral-900 text-neutral-100 rounded-xl">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">POST</span>
                    <span>/api/auth/login</span>
                  </div>
                  <p class="font-sans text-[11px] text-neutral-400 mt-1">Otentikasi pengguna dan mengembalikan JSON Web
                    Token (JWT) untuk sesi aktif.</p>
                </div>
                <div class="p-3 bg-neutral-900 text-neutral-100 rounded-xl">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">POST</span>
                    <span>/api/auth/register</span>
                  </div>
                  <p class="font-sans text-[11px] text-neutral-400 mt-1">Mendaftarkan akun mahasiswa baru dengan
                    Username (NIM) dan password.</p>
                </div>
                <div class="p-3 bg-neutral-900 text-neutral-100 rounded-xl">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">PUT</span>
                    <span>/api/locations/:id/verify</span>
                  </div>
                  <p class="font-sans text-[11px] text-neutral-400 mt-1">Menyetujui atau menolak pengajuan titik lokasi
                    magang (khusus Admin).</p>
                </div>
                <div class="p-3 bg-neutral-900 text-neutral-100 rounded-xl">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">POST</span>
                    <span>/api/reports</span>
                  </div>
                  <p class="font-sans text-[11px] text-neutral-400 mt-1">Mengunggah berkas laporan akhir PKL mahasiswa
                    dalam format PDF.</p>
                </div>
                <div class="p-3 bg-neutral-900 text-neutral-100 rounded-xl">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
                    <span>/api/reports/verified</span>
                  </div>
                  <p class="font-sans text-[11px] text-neutral-400 mt-1">Mengambil daftar laporan PKL yang telah
                    terverifikasi sebagai bahan referensi.</p>
                </div>
                <div class="p-3 bg-neutral-900 text-neutral-100 rounded-xl">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">PUT</span>
                    <span>/api/reports/:id/validate</span>
                  </div>
                  <p class="font-sans text-[11px] text-neutral-400 mt-1">Menyetujui laporan atau mengembalikannya
                    dengan catatan revisi (khusus Admin/Koordinator).</p>
                </div>
                <div class="p-3 bg-neutral-900 text-neutral-100 rounded-xl">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
                    <span>/api/categories</span>
                  </div>
                  <p class="font-sans text-[11px] text-neutral-400 mt-1">Mengambil daftar kategori bidang magang untuk
                    kebutuhan filter pada peta.</p>
                </div>
                <div class="p-3 bg-neutral-900 text-neutral-100 rounded-xl">
                  <div class="flex items-center gap-2">
                    <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">PUT</span>
                    <span>/admin/profile</span>
                  </div>
                  <p class="font-sans text-[11px] text-neutral-400 mt-1">Memperbarui identitas aplikasi, logo, dan
                    informasi kontak kampus (khusus Admin).</p>
                </div>
              </div>
            </section>

            <!-- Section 15 -->
            <section id="faq" class="mb-14 scroll-mt-20">
              <h2 class="text-2xl font-bold mt-10 mb-4 text-neutral-900 flex items-center gap-2">
                <span
                  class="w-7 h-7 rounded-lg bg-neutral-900 text-white text-xs flex items-center justify-center">15</span>
                FAQ &amp; Solusi Kendala
              </h2>
              <div class="space-y-3 text-xs">
                <div class="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <h4 class="font-bold text-neutral-900 mb-1">Peta tidak menampilkan marker instansi?</h4>
                  <p class="text-neutral-600">Pastikan filter kategori tidak sedang menyaring kategori yang tidak
                    memiliki lokasi, atau tekan tombol reset filter.</p>
                </div>
                <div class="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <h4 class="font-bold text-neutral-900 mb-1">Pengajuan titik magang saya belum muncul di peta?</h4>
                  <p class="text-neutral-600">Setiap pengajuan baru wajib melalui proses verifikasi Admin/Koordinator
                    terlebih dahulu. Proses ini biasanya memakan waktu 1&ndash;3 hari kerja.</p>
                </div>
                <div class="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <h4 class="font-bold text-neutral-900 mb-1">Lupa password, bagaimana cara mengatasinya?</h4>
                  <p class="text-neutral-600">Hubungi Admin Pusat Karir &amp; Magang untuk mengatur ulang kata sandi
                    akun Anda, karena fitur reset password mandiri belum tersedia pada versi saat ini.</p>
                </div>
                <div class="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <h4 class="font-bold text-neutral-900 mb-1">Berkas laporan gagal diunggah?</h4>
                  <p class="text-neutral-600">Periksa kembali ukuran berkas (maksimal 25 MB) dan pastikan format
                    berkas adalah PDF, bukan DOC/DOCX atau format lainnya.</p>
                </div>
                <div class="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <h4 class="font-bold text-neutral-900 mb-1">Tombol WhatsApp tidak membuka aplikasi?</h4>
                  <p class="text-neutral-600">Pastikan perangkat Anda memiliki WhatsApp terpasang (mobile) atau
                    WhatsApp Web aktif di browser (desktop), lalu coba klik tombol kembali.</p>
                </div>
              </div>
            </section>
          </article>

          <!-- Footer Navigation -->
          <div
            class="mt-14 pt-8 border-t border-neutral-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <router-link to="/"
              class="inline-flex items-center text-xs font-bold text-amber-700 hover:text-amber-800 transition">
              <iconify-icon icon="lucide:arrow-left" class="mr-1.5"></iconify-icon>
              Kembali ke Landing Page
            </router-link>
            <router-link to="/map"
              class="inline-flex items-center text-xs font-bold px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition shadow-xs">
              Buka Peta Interaktif
              <iconify-icon icon="lucide:arrow-right" class="ml-1.5"></iconify-icon>
            </router-link>
          </div>

          <!-- Bottom Footer -->
          <footer
            class="mt-16 pt-8 border-t border-neutral-200 text-xs text-neutral-400 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              &copy; 2026 Titik Magang Documentation. Hak Cipta Dilindungi.
            </div>
            <div class="flex items-center space-x-3 text-neutral-500">
              <span>Pusat Karir &amp; Magang Mahasiswa</span>
            </div>
          </footer>
        </div>
      </main>

      <!-- Right TOC -->
      <aside
        class="hidden xl:block w-64 border-l border-neutral-200 p-6 xl:sticky xl:top-0 xl:h-screen xl:overflow-y-auto shrink-0">
        <div class="sticky top-6">
          <h3 class="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-4">
            Daftar Isi Halaman
          </h3>
          <nav class="space-y-1.5 text-xs">
            <button @click="scrollToSection('pengantar')"
              :class="['block text-left transition', activeSection === 'pengantar' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">1. Pengenalan Platform</button>
            <button @click="scrollToSection('registrasi')"
              :class="['block text-left transition', activeSection === 'registrasi' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">2. Registrasi &amp; Akun</button>
            <button @click="scrollToSection('peta-interaktif')"
              :class="['block text-left transition', activeSection === 'peta-interaktif' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">3. Navigasi Peta GIS</button>
            <button @click="scrollToSection('pencarian-filter')"
              :class="['block text-left transition', activeSection === 'pencarian-filter' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">4. Cari &amp; Filter Kategori</button>
            <button @click="scrollToSection('hubungi-mitra')"
              :class="['block text-left transition', activeSection === 'hubungi-mitra' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">5. Kontak WhatsApp &amp; Rute</button>
            <button @click="scrollToSection('pengajuan-titik')"
              :class="['block text-left transition', activeSection === 'pengajuan-titik' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">6. Pengajuan Titik Magang</button>
            <button @click="scrollToSection('unggah-laporan')"
              :class="['block text-left transition', activeSection === 'unggah-laporan' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">7. Unggah Laporan PKL</button>
            <button @click="scrollToSection('unduh-laporan')"
              :class="['block text-left transition', activeSection === 'unduh-laporan' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">8. Referensi Laporan</button>
            <button @click="scrollToSection('verifikasi-titik')"
              :class="['block text-left transition', activeSection === 'verifikasi-titik' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">9. Approval Titik Admin</button>
            <button @click="scrollToSection('validasi-laporan')"
              :class="['block text-left transition', activeSection === 'validasi-laporan' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">10. Validasi Laporan</button>
            <button @click="scrollToSection('kelola-master-data')"
              :class="['block text-left transition', activeSection === 'kelola-master-data' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">11. Master Data</button>
            <button @click="scrollToSection('profil-website')"
              :class="['block text-left transition', activeSection === 'profil-website' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">12. Profil &amp; Logo</button>
            <button @click="scrollToSection('arsitektur')"
              :class="['block text-left transition', activeSection === 'arsitektur' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">13. Arsitektur Teknis</button>
            <button @click="scrollToSection('api-endpoints')"
              :class="['block text-left transition', activeSection === 'api-endpoints' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">14. REST API Endpoints</button>
            <button @click="scrollToSection('faq')"
              :class="['block text-left transition', activeSection === 'faq' ? 'text-amber-700 font-bold' : 'text-neutral-500 hover:text-neutral-900']">15. FAQ &amp; Bantuan</button>
          </nav>

          <div class="mt-10 pt-6 border-t border-neutral-200">
            <h3 class="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Bermanfaat?</h3>
            <div class="flex space-x-2">
              <button type="button" @click="sendFeedback(true)"
                class="inline-flex items-center text-xs px-3 py-1.5 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50">
                <iconify-icon icon="lucide:thumbs-up" class="mr-1"></iconify-icon> Ya
              </button>
              <button type="button" @click="sendFeedback(false)"
                class="inline-flex items-center text-xs px-3 py-1.5 border border-neutral-200 rounded-lg text-neutral-600 hover:bg-neutral-50">
                <iconify-icon icon="lucide:thumbs-down" class="mr-1"></iconify-icon> Tidak
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>