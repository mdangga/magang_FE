<script setup>
import { onMounted } from 'vue'
import { useProfileStore } from '../stores/profile'

const profileStore = useProfileStore()

onMounted(() => {
  profileStore.fetchProfile()
})
</script>

<template>
  <div
    class="bg-neutral-50 text-neutral-900 font-sans antialiased selection:bg-primary selection:text-neutral-950 overflow-x-hidden min-h-screen">

    <!-- Navbar -->
    <nav class="fixed top-0 w-full z-50 border-b border-neutral-200/70 bg-white/85 backdrop-blur-md transition-all">
      <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-8">
          <router-link to="/" class="text-xl font-extrabold tracking-tight flex items-center gap-2 group">
            <img v-if="profileStore.logoUrl" :src="profileStore.logoUrl" :alt="profileStore.profile.app_name || 'Logo'"
              class="h-9 w-auto max-w-30 object-contain rounded" />
            <div v-else
              class="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-neutral-900 shadow-sm group-hover:rotate-6 transition-transform">
              <iconify-icon icon="lucide:map-pin" width="20" class="stroke-[2.5]"></iconify-icon>
            </div>
            <span class="text-neutral-900">
              {{ profileStore.profile.app_name || 'Titik' }}
            </span>
          </router-link>

          <div class="hidden md:flex items-center gap-7 text-sm font-semibold text-neutral-600">
            <a href="#features" class="hover:text-amber-600 transition-colors">Fitur Unggulan</a>
            <a href="#workflow" class="hover:text-amber-600 transition-colors">Alur PKL</a>
            <a href="#target-users" class="hover:text-amber-600 transition-colors">Ekosistem</a>
            <a href="#faq" class="hover:text-amber-600 transition-colors">FAQ</a>
            <router-link to="/docs" class="hover:text-amber-600 transition-colors flex items-center gap-1.5">
              <span>Dokumentasi</span>
              <span class="text-[10px] bg-primary/30 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">Docs</span>
            </router-link>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <router-link to="/login"
            class="text-sm font-semibold text-neutral-700 hover:text-neutral-950 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors hidden sm:inline-flex items-center gap-1.5">
            <iconify-icon icon="lucide:log-in" width="16"></iconify-icon>
            Masuk
          </router-link>
          <router-link to="/map"
            class="text-sm font-bold bg-primary text-neutral-900 hover:bg-amber-400 px-4 py-2.5 rounded-xl transition-all shadow-sm shadow-primary/20 flex items-center gap-2 hover:scale-[1.02]">
            <iconify-icon icon="lucide:map" width="18"></iconify-icon>
            Buka Peta Interaktif
          </router-link>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
      <!-- Background Ambient Glow -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-212.5 h-130 bg-primary/25 blur-[130px] rounded-full z-0 pointer-events-none">
      </div>

      <div class="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <!-- Badge -->
        <div
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/80 shadow-xs mb-8">
          <span class="text-xs font-bold text-neutral-800 tracking-wide uppercase">Sistem Informasi Geografis PKL &amp;
            Magang Mahasiswa</span>
        </div>

        <!-- Headline -->
        <h1
          class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-8 text-neutral-900 max-w-5xl mx-auto">
          Temukan Tempat Magang Impian &amp; Referensi PKL dalam <span class="relative inline-block">Satu Peta<svg
              class="absolute w-full h-3.5 bottom-1.5 left-0 text-primary -z-10" viewBox="0 0 100 10"
              preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" stroke-width="8" fill="none"></path>
            </svg></span>.
        </h1>

        <!-- Subtitle -->
        <p class="text-base sm:text-lg lg:text-xl text-neutral-600 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
          Platform Web GIS terpadu untuk mahasiswa menelusuri lokasi magang terverifikasi, menghubungkan langsung ke
          WhatsApp pembimbing/HRD, dan mengakses arsip laporan magang adik tingkat secara transparan.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link to="/map"
            class="w-full sm:w-auto px-8 py-4 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-neutral-900/15">
            <span>Jelajahi Peta Magang</span>
            <iconify-icon icon="lucide:arrow-right" class="group-hover:translate-x-1 transition-transform"
              width="18"></iconify-icon>
          </router-link>
          <router-link to="/docs"
            class="w-full sm:w-auto px-8 py-4 bg-white text-neutral-900 font-semibold rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 shadow-xs">
            <iconify-icon icon="lucide:book-open" width="18" class="text-amber-600"></iconify-icon>
            <span>Baca Panduan Sistem</span>
          </router-link>
        </div>

        <!-- Stats Pill Summary -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 font-medium">
          <div class="flex items-center gap-2">
            <iconify-icon icon="lucide:check-circle-2" class="text-amber-600" width="16"></iconify-icon>
            <span>100% Terverifikasi Kampus</span>
          </div>
          <div class="flex items-center gap-2">
            <iconify-icon icon="lucide:compass" class="text-amber-600" width="16"></iconify-icon>
            <span>Navigasi Koordinat GPS Presisi</span>
          </div>
          <div class="flex items-center gap-2">
            <iconify-icon icon="lucide:file-check" class="text-amber-600" width="16"></iconify-icon>
            <span>Arsip Laporan Magang Resmi</span>
          </div>
        </div>
      </div>

      <!-- Floating Mockup Area -->
      <div class="mt-16 sm:mt-20 relative max-w-5xl mx-auto h-120 md:h-135 px-4">
        <!-- Phone Mockup -->
        <div
          class="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-85 bg-white rounded-[40px] border-8 border-neutral-900 shadow-2xl overflow-hidden z-20 h-145 hover:translate-y-2 transition-transform duration-500">
          <div
            class="h-6 w-32 bg-neutral-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl z-30 flex items-center justify-center">
            <div class="w-12 h-1 bg-neutral-700 rounded-full"></div>
          </div>

          <div class="pt-8 flex flex-col h-full relative bg-neutral-50">
            <div class="px-5 py-3 bg-white border-b border-neutral-100 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div
                  class="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-neutral-900 text-xs font-bold">
                  <iconify-icon icon="lucide:map-pin"></iconify-icon>
                </div>
                <span class="text-xs font-bold text-neutral-900">Detail Titik Magang</span>
              </div>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Disetujui
              </span>
            </div>

            <div class="p-4 space-y-3 overflow-y-auto">
              <div class="relative h-36 w-full rounded-2xl overflow-hidden border border-neutral-200 shadow-xs">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
                  class="w-full h-full object-cover" alt="Kantor Perusahaan">
                <div
                  class="absolute top-2 left-2 bg-neutral-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1">
                  <iconify-icon icon="lucide:tag" width="12" class="text-primary"></iconify-icon>
                  Software Engineering
                </div>
              </div>

              <div>
                <h3 class="font-bold text-base text-neutral-900 leading-tight">PT Telkom Indonesia (Witel)</h3>
                <p class="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-1">
                  <iconify-icon icon="lucide:map-pin" class="text-amber-600"></iconify-icon>
                  Jl. Pahlawan No. 12, Area Perkantoran
                </p>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <router-link to="/map"
                  class="p-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs">
                  <iconify-icon icon="lucide:message-circle" width="14"></iconify-icon>
                  Chat WA HRD
                </router-link>
                <router-link to="/map"
                  class="p-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs">
                  <iconify-icon icon="lucide:navigation" width="14"></iconify-icon>
                  Rute Maps
                </router-link>
              </div>

              <div class="p-3 bg-white rounded-xl border border-neutral-200/90 shadow-2xs space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                    <iconify-icon icon="lucide:file-text" class="text-amber-600"></iconify-icon>
                    Laporan PKL Alumni
                  </span>
                  <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary/30 text-amber-900">PDF</span>
                </div>
                <p class="text-xs font-semibold text-neutral-800 line-clamp-1">
                  Pengembangan Portal Dashboard Monitoring Jaringan
                </p>
                <div
                  class="flex items-center justify-between pt-1 border-t border-neutral-100 text-[10px] text-neutral-400">
                  <span>Oleh: Ahmad Fauzi (TI-22)</span>
                  <span class="text-amber-700 font-bold flex items-center gap-0.5">
                    Unduh <iconify-icon icon="lucide:download" width="11"></iconify-icon>
                  </span>
                </div>
              </div>
            </div>

            <div
              class="mt-auto w-full py-2.5 px-6 border-t border-neutral-200 bg-white flex justify-between items-center text-neutral-400">
              <div class="flex flex-col items-center text-amber-600">
                <iconify-icon icon="lucide:map" width="18"></iconify-icon>
                <span class="text-[9px] font-bold">Peta</span>
              </div>
              <div class="flex flex-col items-center">
                <iconify-icon icon="lucide:plus-circle" width="18"></iconify-icon>
                <span class="text-[9px]">Ajukan</span>
              </div>
              <div class="flex flex-col items-center">
                <iconify-icon icon="lucide:folder-check" width="18"></iconify-icon>
                <span class="text-[9px]">Laporan</span>
              </div>
              <div class="flex flex-col items-center">
                <iconify-icon icon="lucide:user" width="18"></iconify-icon>
                <span class="text-[9px]">Profil</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Left Stats Card -->
        <div
          class="absolute left-2 md:left-[8%] top-[18%] w-64 p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-neutral-200/80 shadow-xl hidden md:block">
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 bg-primary/40 rounded-xl text-neutral-900 font-bold">
              <iconify-icon icon="lucide:map-pin" width="18"></iconify-icon>
            </div>
            <div>
              <p class="text-xs text-neutral-500 font-medium">Titik Magang Aktif</p>
              <p class="text-lg font-extrabold tracking-tight text-neutral-900">250+ Lokasi <span
                  class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">+18
                  baru</span></p>
            </div>
          </div>
          <div class="h-14 flex items-end justify-between gap-1.5 pt-2 border-t border-neutral-100">
            <div class="w-full bg-neutral-200 rounded-t-sm h-[35%]"></div>
            <div class="w-full bg-neutral-200 rounded-t-sm h-[55%]"></div>
            <div class="w-full bg-primary rounded-t-sm h-[85%] shadow-xs"></div>
            <div class="w-full bg-neutral-200 rounded-t-sm h-[50%]"></div>
            <div class="w-full bg-amber-500 rounded-t-sm h-[70%]"></div>
            <div class="w-full bg-neutral-200 rounded-t-sm h-[60%]"></div>
          </div>
          <div class="flex justify-between text-[10px] text-neutral-400 mt-1 font-medium">
            <span>Informatika</span>
            <span>Sistem Info</span>
            <span>Elektro</span>
          </div>
        </div>

        <!-- Right Verification Card -->
        <div
          class="absolute right-2 md:right-[8%] top-[25%] w-60 p-4 rounded-2xl bg-white/85 backdrop-blur-md border border-neutral-200/80 shadow-xl hidden md:block">
          <div class="flex items-start gap-3 mb-3">
            <div class="p-2 bg-primary/30 rounded-xl text-amber-800">
              <iconify-icon icon="lucide:shield-check" width="20"></iconify-icon>
            </div>
            <div>
              <p class="text-xs font-bold text-neutral-900">Verifikasi Resmi</p>
              <p class="text-[10px] text-neutral-500">Koordinat GPS &amp; Approval PKL</p>
            </div>
          </div>

          <div
            class="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 text-[11px] font-mono space-y-1 mb-2.5">
            <div class="flex justify-between text-neutral-500">
              <span>Lat:</span>
              <span class="text-neutral-900 font-bold">-7.250445</span>
            </div>
            <div class="flex justify-between text-neutral-500">
              <span>Lng:</span>
              <span class="text-neutral-900 font-bold">112.768845</span>
            </div>
          </div>
          <div
            class="flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg font-medium">
            <iconify-icon icon="lucide:check-circle" width="12"></iconify-icon>
            <span>Laporan Teruji Pembimbing</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Marquee -->
    <section class="py-10 border-y border-neutral-200/80 bg-white">
      <p class="text-center text-xs font-bold text-neutral-400 uppercase tracking-widest mb-6">Mencakup Beragam Bidang
        Industri &amp; Program Studi</p>
      <div class="relative flex overflow-x-hidden">
        <div class="marquee-track text-neutral-400 font-bold text-sm tracking-wide">
          <div class="marquee-group" aria-hidden="false">
            <span class="flex items-center gap-2 hover:text-neutral-900 transition-colors"><iconify-icon
                icon="lucide:code-2" class="text-amber-600"></iconify-icon> SOFTWARE ENGINEERING</span>
            <span class="flex items-center gap-2 hover:text-neutral-900 transition-colors"><iconify-icon
                icon="lucide:network" class="text-amber-600"></iconify-icon> JARINGAN &amp; INFRASTRUKTUR</span>
            <span class="flex items-center gap-2 hover:text-neutral-900 transition-colors"><iconify-icon
                icon="lucide:database" class="text-amber-600"></iconify-icon> DATA &amp; ARTIFICIAL INTELLIGENCE</span>
            <span class="flex items-center gap-2 hover:text-neutral-900 transition-colors"><iconify-icon
                icon="lucide:palette" class="text-amber-600"></iconify-icon> UI/UX &amp; DESAIN GRAFIS</span>
            <span class="flex items-center gap-2 hover:text-neutral-900 transition-colors"><iconify-icon
                icon="lucide:landmark" class="text-amber-600"></iconify-icon> BUMN &amp; INSTANSI PEMERINTAH</span>
            <span class="flex items-center gap-2 hover:text-neutral-900 transition-colors"><iconify-icon
                icon="lucide:rocket" class="text-amber-600"></iconify-icon> STARTUP TEKNOLOGI</span>
          </div>
          <div class="marquee-group" aria-hidden="true">
            <span class="flex items-center gap-2 hover:text-neutral-900 transition-colors"><iconify-icon
                icon="lucide:code-2" class="text-amber-600"></iconify-icon> SOFTWARE ENGINEERING</span>
            <span class="flex items-center gap-2 hover:text-neutral-900 transition-colors"><iconify-icon
                icon="lucide:network" class="text-amber-600"></iconify-icon> JARINGAN &amp; INFRASTRUKTUR</span>
            <span class="flex items-center gap-2 hover:text-neutral-900 transition-colors"><iconify-icon
                icon="lucide:database" class="text-amber-600"></iconify-icon> DATA &amp; ARTIFICIAL INTELLIGENCE</span>
            <span class="flex items-center gap-2 hover:text-neutral-900 transition-colors"><iconify-icon
                icon="lucide:palette" class="text-amber-600"></iconify-icon> UI/UX &amp; DESAIN GRAFIS</span>
            <span class="flex items-center gap-2 hover:text-neutral-900 transition-colors"><iconify-icon
                icon="lucide:landmark" class="text-amber-600"></iconify-icon> BUMN &amp; INSTANSI PEMERINTAH</span>
            <span class="flex items-center gap-2 hover:text-neutral-900 transition-colors"><iconify-icon
                icon="lucide:rocket" class="text-amber-600"></iconify-icon> STARTUP TEKNOLOGI</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Bento Grid -->
    <section id="features" class="py-24 max-w-7xl mx-auto px-6">
      <div class="mb-16 max-w-3xl">
        <span
          class="text-xs font-bold text-amber-700 uppercase tracking-widest bg-primary/30 px-3 py-1 rounded-full mb-3 inline-block">Fitur
          Lengkap Platform</span>
        <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-6 text-neutral-900 leading-tight">
          Semua yang Dibutuhkan untuk <br>Kelancaran Magang Mahasiswa.
        </h2>
        <p class="text-neutral-600 text-base md:text-lg">
          Tidak perlu lagi bingung mencari tempat magang atau kebingungan menyusun laporan. Titik Magang menyajikan data
          spasial terpadu, kontak langsung, dan arsip terpercaya.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
        <!-- Feature 1: GIS Map -->
        <div class="md:col-span-6 lg:col-span-8 bg-neutral-900 rounded-4xl p-8 md:p-12 relative overflow-hidden group">
          <div class="relative z-10 max-w-md">
            <div
              class="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center mb-6 text-primary border border-neutral-700">
              <iconify-icon icon="lucide:map-pin" width="24"></iconify-icon>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4 tracking-tight">Peta Spasial GIS Interaktif</h3>
            <p class="text-neutral-400 leading-relaxed mb-8">
              Didukung OpenStreetMap &amp; Leaflet Engine. Cari instansi magang di sekitarmu, filter berdasarkan jurusan
              dan kategori industri, serta amati titik sebaran secara visual.
            </p>
            <div class="flex flex-wrap items-center gap-3">
              <span
                class="px-3.5 py-1.5 rounded-full bg-neutral-800 text-neutral-300 text-xs border border-neutral-700">Multi
                Kategori</span>
              <span
                class="px-3.5 py-1.5 rounded-full bg-neutral-800 text-neutral-300 text-xs border border-neutral-700">Titik
                Koordinat Presisi</span>
              <router-link to="/map"
                class="px-3.5 py-1.5 rounded-full bg-primary text-neutral-950 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-400 transition">
                <iconify-icon icon="lucide:route"></iconify-icon> Navigasi Rute
              </router-link>
            </div>
          </div>
          <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/6 opacity-15 pointer-events-none">
            <iconify-icon icon="lucide:map" width="360" class="text-white"></iconify-icon>
          </div>
        </div>

        <!-- Feature 2: WhatsApp Direct -->
        <div
          class="md:col-span-6 lg:col-span-4 bg-white border border-neutral-200 rounded-4xl p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
          <div class="relative z-10 h-full flex flex-col">
            <div
              class="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 text-emerald-600 border border-emerald-100">
              <iconify-icon icon="lucide:message-circle" width="24"></iconify-icon>
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-2 tracking-tight">Direct WhatsApp Contact</h3>
            <p class="text-neutral-500 text-sm leading-relaxed mb-6">
              Hubungi nomor kontak HRD atau pembimbing magang instansi dengan satu klik melalui template pesan WhatsApp
              otomatis.
            </p>
            <div class="mt-auto bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 space-y-2">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span class="text-xs font-bold text-neutral-800">Pesan Siap Terkirim</span>
              </div>
              <p class="text-[11px] text-neutral-500 italic bg-white p-2.5 rounded-lg border border-neutral-100">
                "Halo, saya mahasiswa ingin bertanya mengenai lowongan magang..."
              </p>
            </div>
          </div>
        </div>

        <!-- Feature 3: Archive Reports -->
        <div
          class="md:col-span-6 lg:col-span-4 bg-primary-50/70 border border-primary-200/60 rounded-4xl p-8 relative overflow-hidden group hover:shadow-lg transition-all">
          <div class="relative z-10">
            <div
              class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center mb-6 text-neutral-900 shadow-sm border border-primary-100">
              <iconify-icon icon="lucide:book-marked" width="24" class="text-amber-700"></iconify-icon>
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-2 tracking-tight">Arsip Laporan Magang Resmi</h3>
            <p class="text-neutral-600 text-sm leading-relaxed mb-6">
              Dapatkan pedoman penulisan dan tinjauan laporan magang alumni yang telah diverifikasi dosen pembimbing.
            </p>
            <div class="p-3 bg-white rounded-xl border border-primary-200 shadow-xs flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <iconify-icon icon="lucide:file-text" class="text-red-500" width="22"></iconify-icon>
                <div>
                  <p class="text-xs font-bold text-neutral-800">Laporan_PKL_Final.pdf</p>
                  <p class="text-[10px] text-neutral-400">Verifikasi Koordinator</p>
                </div>
              </div>
              <span class="text-xs font-bold text-amber-800 bg-primary/30 px-2 py-0.5 rounded">Download</span>
            </div>
          </div>
        </div>

        <!-- Feature 4: Submissions -->
        <div
          class="md:col-span-6 lg:col-span-4 bg-white border border-neutral-200 rounded-4xl p-8 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div class="relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center mb-6 text-neutral-900">
              <iconify-icon icon="lucide:map-pin-plus" width="24" class="text-amber-600"></iconify-icon>
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-2 tracking-tight">Pengajuan Titik Mandiri</h3>
            <p class="text-neutral-500 text-sm leading-relaxed mb-4">
              Pernah magang di tempat baru? Mahasiswa dapat mengusulkan lokasi baru dengan pemilih titik Leaflet dan
              upload foto kantor.
            </p>
            <router-link to="/locations/add"
              class="flex items-center gap-2 text-xs font-bold text-neutral-800 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100 hover:bg-neutral-100 transition">
              <iconify-icon icon="lucide:camera" class="text-neutral-500"></iconify-icon>
              <span>Ajukan Titik Magang Baru</span>
            </router-link>
          </div>
        </div>

        <!-- Feature 5: Admin Moderation -->
        <div
          class="md:col-span-6 lg:col-span-4 bg-linear-to-br from-white to-neutral-50 border border-neutral-200 rounded-4xl p-8 relative overflow-hidden group hover:shadow-lg transition-all">
          <div class="relative z-10">
            <div class="w-12 h-12 rounded-2xl bg-neutral-900 flex items-center justify-center mb-6 text-primary">
              <iconify-icon icon="lucide:shield-alert" width="24"></iconify-icon>
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-2 tracking-tight">Moderasi &amp; Approval Admin</h3>
            <p class="text-neutral-500 text-sm leading-relaxed mb-4">
              Setiap titik dan laporan ditinjau oleh koordinator magang sebelum tayang ke publik, menjaga keaslian data
              kampus.
            </p>
            <ul class="space-y-1.5 text-xs text-neutral-600 font-medium">
              <li class="flex items-center gap-2"><iconify-icon icon="lucide:check"
                  class="text-amber-600"></iconify-icon> Filter pengajuan duplikat</li>
              <li class="flex items-center gap-2"><iconify-icon icon="lucide:check"
                  class="text-amber-600"></iconify-icon> Catatan revisi laporan mahasiswa</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Workflow Section -->
    <section id="workflow" class="py-24 bg-neutral-900 text-white relative overflow-hidden">
      <div class="absolute top-0 right-0 w-137.5 h-137.5 bg-primary/10 rounded-full blur-[110px] pointer-events-none">
      </div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span class="text-primary font-bold tracking-wider text-xs uppercase mb-2 block">Panduan Langkah
              Mudah</span>
            <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight">Alur Pelaksanaan PKL Digital.</h2>
          </div>
          <p class="text-neutral-400 max-w-md text-sm md:text-base leading-relaxed">
            Mulai dari eksplorasi instansi, koordinasi langsung dengan pembimbing, hingga upload laporan akhir
            terverifikasi.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="p-6 rounded-2xl bg-neutral-800/60 border border-neutral-700/80">
            <div
              class="w-10 h-10 rounded-xl bg-primary text-neutral-900 flex items-center justify-center font-extrabold text-sm mb-4">
              01
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Eksplorasi &amp; Filter</h3>
            <p class="text-xs text-neutral-400 leading-relaxed">
              Pilih program studi dan bidang minat. Amati sebaran titik magang di peta serta ulasan profil instansi.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-neutral-800/60 border border-neutral-700/80">
            <div
              class="w-10 h-10 rounded-xl bg-neutral-700 text-white flex items-center justify-center font-extrabold text-sm mb-4">
              02
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Hubungi Pembimbing</h3>
            <p class="text-xs text-neutral-400 leading-relaxed">
              Gunakan tombol WhatsApp langsung untuk menanyakan ketersediaan kuota magang dan persyaratan instansi.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-neutral-800/60 border border-neutral-700/80">
            <div
              class="w-10 h-10 rounded-xl bg-neutral-700 text-white flex items-center justify-center font-extrabold text-sm mb-4">
              03
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Ajukan Lokasi Magang</h3>
            <p class="text-xs text-neutral-400 leading-relaxed">
              Daftarkan tempat magang Anda ke sistem agar disetujui koordinator kampus dan tercatat secara legal.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-neutral-800/60 border border-neutral-700/80">
            <div
              class="w-10 h-10 rounded-xl bg-primary text-neutral-900 flex items-center justify-center font-extrabold text-sm mb-4">
              04
            </div>
            <h3 class="text-lg font-bold text-white mb-2">Unggah Laporan PKL</h3>
            <p class="text-xs text-neutral-400 leading-relaxed">
              Selesai magang? Unggah berkas laporan akhir Anda untuk verifikasi nilai dan menjadi referensi adik
              tingkat.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Target Users -->
    <section id="target-users" class="py-24 max-w-7xl mx-auto px-6">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span
          class="text-xs font-bold text-amber-700 uppercase tracking-widest bg-primary/30 px-3 py-1 rounded-full mb-3 inline-block">Ekosistem
          Pengguna</span>
        <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight text-neutral-900 mb-4">
          Satu Platform untuk Semua Kebutuhan.
        </h2>
        <p class="text-neutral-500 text-base">
          Menghubungkan mahasiswa, tim koordinator magang fakultas, serta instansi mitra industri secara harmonis.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Mahasiswa -->
        <div
          class="rounded-3xl border border-neutral-200 bg-white p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div>
            <div class="w-14 h-14 rounded-2xl bg-primary/30 flex items-center justify-center text-neutral-900 mb-6">
              <iconify-icon icon="lucide:graduation-cap" width="28"></iconify-icon>
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-2">Mahasiswa</h3>
            <p class="text-sm text-neutral-500 leading-relaxed mb-6">
              Mencari lokasi PKL yang sesuai minat, mengunduh contoh laporan, dan memantau status persetujuan tempat
              magang.
            </p>
            <ul class="space-y-3 text-xs text-neutral-600">
              <li class="flex items-center gap-2"><iconify-icon icon="lucide:check-circle"
                  class="text-amber-600"></iconify-icon> Akses peta dan filter bidang keahlian</li>
              <li class="flex items-center gap-2"><iconify-icon icon="lucide:check-circle"
                  class="text-amber-600"></iconify-icon> Submit pengajuan titik magang baru</li>
              <li class="flex items-center gap-2"><iconify-icon icon="lucide:check-circle"
                  class="text-amber-600"></iconify-icon> Unggah file laporan PKL akhir</li>
            </ul>
          </div>
          <div class="mt-8 pt-6 border-t border-neutral-100">
            <router-link to="/register"
              class="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-colors">
              Daftar Akun Mahasiswa
            </router-link>
          </div>
        </div>

        <!-- Admin -->
        <div
          class="rounded-3xl border-2 border-primary bg-neutral-950 p-8 shadow-2xl relative text-white flex flex-col justify-between">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2">
            <span
              class="inline-flex items-center gap-1.5 text-[11px] font-bold text-neutral-900 bg-primary rounded-full px-3 py-1 shadow-md">
              <iconify-icon icon="lucide:shield-check"></iconify-icon>
              Koordinator Kampus
            </span>
          </div>

          <div>
            <div class="w-14 h-14 rounded-2xl bg-primary text-neutral-900 flex items-center justify-center mb-6 mt-2">
              <iconify-icon icon="lucide:sliders-horizontal" width="28"></iconify-icon>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Admin &amp; Koordinator</h3>
            <p class="text-sm text-neutral-400 leading-relaxed mb-6">
              Mengelola data fakultas, jurusan, verifikasi pengajuan titik baru, serta menyetujui laporan magang
              mahasiswa dengan catatan revisi.
            </p>
            <ul class="space-y-3 text-xs text-neutral-300">
              <li class="flex items-center gap-2"><iconify-icon icon="lucide:check-circle"
                  class="text-primary"></iconify-icon> Verifikasi kelayakan titik magang</li>
              <li class="flex items-center gap-2"><iconify-icon icon="lucide:check-circle"
                  class="text-primary"></iconify-icon> Moderasi &amp; evaluasi laporan mahasiswa</li>
              <li class="flex items-center gap-2"><iconify-icon icon="lucide:check-circle"
                  class="text-primary"></iconify-icon> Pengaturan profil website &amp; logo kampus</li>
            </ul>
          </div>
          <div class="mt-8 pt-6 border-t border-neutral-800">
            <router-link to="/login"
              class="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-primary text-neutral-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-lg shadow-primary/20">
              Portal Admin Magang
            </router-link>
          </div>
        </div>

        <!-- Mitra Perusahaan -->
        <div
          class="rounded-3xl border border-neutral-200 bg-white p-8 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div>
            <div class="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-800 mb-6">
              <iconify-icon icon="lucide:building-2" width="28"></iconify-icon>
            </div>
            <h3 class="text-xl font-bold text-neutral-900 mb-2">Mitra Perusahaan &amp; Instansi</h3>
            <p class="text-sm text-neutral-500 leading-relaxed mb-6">
              Menjadi destinasi magang yang dikenal mahasiswa, mempermudah perekrutan talenta muda sesuai kompetensi
              program studi.
            </p>
            <ul class="space-y-3 text-xs text-neutral-600">
              <li class="flex items-center gap-2"><iconify-icon icon="lucide:check-circle"
                  class="text-amber-600"></iconify-icon> Terhubung langsung dengan mahasiswa</li>
              <li class="flex items-center gap-2"><iconify-icon icon="lucide:check-circle"
                  class="text-amber-600"></iconify-icon> Profil lokasi dan fasilitas terdokumentasi</li>
              <li class="flex items-center gap-2"><iconify-icon icon="lucide:check-circle"
                  class="text-amber-600"></iconify-icon> Kolaborasi akademik berkelanjutan</li>
            </ul>
          </div>
          <div class="mt-8 pt-6 border-t border-neutral-100">
            <router-link to="/map"
              class="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-800 font-bold text-xs hover:bg-neutral-50 transition-colors">
              Lihat Profil Instansi di Peta
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section id="faq" class="py-20 bg-neutral-100/60 border-t border-neutral-200">
      <div class="max-w-4xl mx-auto px-6">
        <div class="text-center mb-12">
          <span
            class="text-xs font-bold text-amber-700 uppercase tracking-widest bg-primary/30 px-3 py-1 rounded-full mb-3 inline-block">Tanya
            Jawab</span>
          <h2 class="text-3xl font-extrabold tracking-tight text-neutral-900">Pertanyaan yang Sering Diajukan</h2>
        </div>

        <div class="space-y-4">

          <details name="faq" class="faq-item group rounded-2xl border border-neutral-200/80
         bg-white shadow-2xs open:ring-1 open:ring-primary/50">

            <summary class="flex w-full cursor-pointer list-none items-center
           justify-between gap-3 p-6 font-bold text-neutral-900
           text-sm md:text-base">

              <span>Bagaimana cara mengajukan titik magang baru?</span>

              <iconify-icon icon="lucide:chevron-down" class="shrink-0 text-neutral-500 transition-transform
             duration-300 ease-in-out group-open:rotate-180">
              </iconify-icon>
            </summary>

            <div class="faq-answer">
              <div class="faq-answer-inner">
                <p class="mx-6 border-t border-neutral-100 py-4
                text-xs leading-relaxed text-neutral-600
                md:text-sm">
                  Masuk ke akun mahasiswa, klik menu "Ajukan Titik Baru", isi data lengkap instansi, pilih titik lokasi
                  secara presisi melalui peta interaktif, unggah foto bukti dokumentasi kantor, lalu klik Simpan.
                  Pengajuan Anda akan masuk ke daftar review admin kampus.
                </p>
              </div>
            </div>

          </details>

          <details name="faq" class="faq-item group rounded-2xl border border-neutral-200/80
         bg-white shadow-2xs open:ring-1 open:ring-primary/50">

            <summary class="flex w-full cursor-pointer list-none items-center
           justify-between gap-3 p-6 font-bold text-neutral-900
           text-sm md:text-base">

              <span>Apakah laporan magang kakak tingkat bisa diunduh secara gratis?</span>

              <iconify-icon icon="lucide:chevron-down" class="shrink-0 text-neutral-500 transition-transform
             duration-300 ease-in-out group-open:rotate-180">
              </iconify-icon>
            </summary>

            <div class="faq-answer">
              <div class="faq-answer-inner">
                <p class="mx-6 border-t border-neutral-100 py-4
                text-xs leading-relaxed text-neutral-600
                md:text-sm">
                  Ya! Setiap lokasi yang memiliki laporan terverifikasi menyediakan tombol unduh berkas PDF yang dapat
                  diakses oleh seluruh mahasiswa sebagai referensi penulisan dan penyusunan tugas akhir PKL.
                </p>
              </div>
            </div>

          </details>

          <details name="faq" class="faq-item group rounded-2xl border border-neutral-200/80
         bg-white shadow-2xs open:ring-1 open:ring-primary/50">

            <summary class="flex w-full cursor-pointer list-none items-center
           justify-between gap-3 p-6 font-bold text-neutral-900
           text-sm md:text-base">

              <span>Bagaimana cara menemukan lokasi magang yang sesuai??</span>

              <iconify-icon icon="lucide:chevron-down" class="shrink-0 text-neutral-500 transition-transform
             duration-300 ease-in-out group-open:rotate-180">
              </iconify-icon>
            </summary>

            <div class="faq-answer">
              <div class="faq-answer-inner">
                <p class="mx-6 border-t border-neutral-100 py-4
                text-xs leading-relaxed text-neutral-600
                md:text-sm">
                  Buka peta interaktif untuk melihat sebaran lokasi magang. Gunakan pencarian dan filter kategori atau
                  bidang keahlian untuk menemukan instansi yang sesuai, lalu buka detail titik untuk melihat informasi
                  lokasi, kontak, dan laporan yang tersedia.
                </p>
              </div>
            </div>

          </details>

          <details name="faq" class="faq-item group rounded-2xl border border-neutral-200/80
         bg-white shadow-2xs open:ring-1 open:ring-primary/50">

            <summary class="flex w-full cursor-pointer list-none items-center
           justify-between gap-3 p-6 font-bold text-neutral-900
           text-sm md:text-base">

              <span>Informasi apa yang perlu disiapkan untuk mengajukan titik magang?</span>

              <iconify-icon icon="lucide:chevron-down" class="shrink-0 text-neutral-500 transition-transform
             duration-300 ease-in-out group-open:rotate-180">
              </iconify-icon>
            </summary>

            <div class="faq-answer">
              <div class="faq-answer-inner">
                <p class="mx-6 border-t border-neutral-100 py-4
                text-xs leading-relaxed text-neutral-600
                md:text-sm">
                  Siapkan data mahasiswa, program studi, nama dan kategori instansi, kontak, serta deskripsi lokasi.
                  Tentukan koordinat lokasi melalui pemilih peta agar titik yang diajukan dapat ditemukan dengan tepat.
                  Foto dokumentasi juga dapat disertakan sebagai informasi pendukung.
                </p>
              </div>
            </div>

          </details>

          <details name="faq" class="faq-item group rounded-2xl border border-neutral-200/80
         bg-white shadow-2xs open:ring-1 open:ring-primary/50">

            <summary class="flex w-full cursor-pointer list-none items-center
           justify-between gap-3 p-6 font-bold text-neutral-900
           text-sm md:text-base">

              <span>Apa yang terjadi setelah saya mengajukan lokasi?</span>

              <iconify-icon icon="lucide:chevron-down" class="shrink-0 text-neutral-500 transition-transform
             duration-300 ease-in-out group-open:rotate-180">
              </iconify-icon>
            </summary>

            <div class="faq-answer">
              <div class="faq-answer-inner">
                <p class="mx-6 border-t border-neutral-100 py-4
                text-xs leading-relaxed text-neutral-600
                md:text-sm">
                  Pengajuan akan ditinjau oleh admin atau koordinator kampus sebelum ditampilkan sebagai titik yang
                  terverifikasi. Jika diperlukan perbaikan, koordinator dapat memberikan catatan revisi untuk
                  ditindaklanjuti.
                </p>
              </div>
            </div>

          </details>

          <details name="faq" class="faq-item group rounded-2xl border border-neutral-200/80
         bg-white shadow-2xs open:ring-1 open:ring-primary/50">

            <summary class="flex w-full cursor-pointer list-none items-center
           justify-between gap-3 p-6 font-bold text-neutral-900
           text-sm md:text-base">

              <span>Apa format dan batas ukuran berkas laporan yang dapat diunggah?</span>

              <iconify-icon icon="lucide:chevron-down" class="shrink-0 text-neutral-500 transition-transform
             duration-300 ease-in-out group-open:rotate-180">
              </iconify-icon>
            </summary>

            <div class="faq-answer">
              <div class="faq-answer-inner">
                <p class="mx-6 border-t border-neutral-100 py-4
                text-xs leading-relaxed text-neutral-600
                md:text-sm">
                  Laporan diunggah dalam format PDF dengan ukuran maksimal 25 MB. Setelah diunggah, laporan akan melalui
                  proses verifikasi sebelum dapat menjadi referensi bagi mahasiswa lain.
                </p>
              </div>
            </div>

          </details>
        </div>
      </div>
    </section>

    <!-- Call to Action Banner -->
    <section class="py-20 bg-neutral-950 text-white relative overflow-hidden">
      <div
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-175 h-75 bg-primary/20 blur-[100px] rounded-full pointer-events-none">
      </div>

      <div class="max-w-5xl mx-auto px-6 text-center relative z-10">
        <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
          Siap Menemukan Tempat Magang Terbaikmu?
        </h2>
        <p class="text-neutral-400 max-w-2xl mx-auto mb-8 text-base md:text-lg">
          Buka peta interaktif sekarang dan jelajahi ratusan tempat magang yang telah terbukti dan terverifikasi oleh
          kampus.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link to="/map"
            class="w-full sm:w-auto px-8 py-4 bg-primary text-neutral-950 font-extrabold rounded-xl hover:bg-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02]">
            <iconify-icon icon="lucide:map" width="18"></iconify-icon>
            Buka Peta Interaktif
          </router-link>
          <router-link to="/register"
            class="w-full sm:w-auto px-8 py-4 bg-neutral-800 text-white font-semibold rounded-xl border border-neutral-700 hover:bg-neutral-700 transition-all flex items-center justify-center gap-2">
            <iconify-icon icon="lucide:user-plus" width="18"></iconify-icon>
            Daftar Akun Mahasiswa
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-neutral-200 pt-16 pb-10">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div class="md:col-span-1">
            <router-link to="/" class="text-2xl font-extrabold tracking-tight flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-neutral-900 text-sm">
                <iconify-icon icon="lucide:map-pin"></iconify-icon>
              </div>
              <span>Titik<span class="text-amber-600">Magang</span></span>
            </router-link>
            <p class="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-2">Fakultas Sains dan Teknologi
            </p>
            <p class="text-xs text-neutral-500 leading-relaxed mb-6">
              Sistem Informasi Pemetaan Titik Magang &amp; Repositori Laporan Praktik Kerja Lapangan (PKL) Mahasiswa,
              dikembangkan sebagai pusat keunggulan pendidikan tinggi sains, rekayasa perangkat lunak, dan desain
              komunikasi visual yang menjunjung tinggi etika Tri Kaya Parisudha.
            </p>
          </div>
          <!-- navigasi -->
          <div>
            <h4 class="font-bold text-sm text-neutral-900 mb-4">Navigasi Utama</h4>
            <ul class="space-y-2.5 text-xs text-neutral-500 font-medium">
              <li><router-link to="/map"
                  class="hover:text-amber-600 transition-colors flex items-center gap-1.5"><iconify-icon
                    icon="lucide:map"></iconify-icon> Peta Titik Magang</router-link></li>
              <li><router-link to="/docs"
                  class="hover:text-amber-600 transition-colors flex items-center gap-1.5"><iconify-icon
                    icon="lucide:book-open"></iconify-icon> Dokumentasi Sistem</router-link></li>
              <li><a href="#features" class="hover:text-amber-600 transition-colors">Fitur Unggulan</a></li>
              <li><a href="#workflow" class="hover:text-amber-600 transition-colors">Alur Pengajuan PKL</a></li>
            </ul>
          </div>
          <!-- Portal Pengguna -->
          <div>
            <h4 class="font-bold text-sm text-neutral-900 mb-4">Portal Pengguna</h4>
            <ul class="space-y-2.5 text-xs text-neutral-500 font-medium">
              <li><router-link to="/login" class="hover:text-amber-600 transition-colors">Masuk Portal</router-link>
              </li>
              <li><router-link to="/register" class="hover:text-amber-600 transition-colors">Daftar Akun
                  Mahasiswa</router-link></li>
              <li><router-link to="/locations/add" class="hover:text-amber-600 transition-colors">Pengajuan Tempat
                  Baru</router-link></li>
              <li><router-link to="/admin/dashboard" class="hover:text-amber-600 transition-colors">Dashboard
                  Admin</router-link></li>
            </ul>
          </div>
          <!-- Kontak & Informasi -->
          <div>
            <h4 class="font-bold text-sm text-neutral-900">Kontak &amp; Informasi</h4>
            <p class="text-xs text-neutral-500 mb-3">Pusat Karir &amp; Kerjasama PKL Kampus</p>

            <div class="space-y-2.5 mb-4">
              <div class="flex items-start gap-2 text-xs text-neutral-500">
                <iconify-icon icon="lucide:map-pin" class="text-amber-600 mt-0.5 shrink-0" width="14"></iconify-icon>
                <span><strong class="text-neutral-700">Kampus Bangli:</strong> Jl. Nusantara, Kubu, Kec. Bangli,
                  Kabupaten Bangli, Bali 80614</span>
              </div>
              <div class="flex items-start gap-2 text-xs text-neutral-500">
                <iconify-icon icon="lucide:map-pin" class="text-amber-600 mt-0.5 shrink-0" width="14"></iconify-icon>
                <span><strong class="text-neutral-700">Kampus Denpasar:</strong> Jl. Ratna No.51, Tonja, Kec. Denpasar
                  Utara, Bali 80239</span>
              </div>
            </div>

            <p class="flex items-center gap-2 mb-4 text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              <iconify-icon icon="lucide:clock" width="14"></iconify-icon>
              <span>Jam Operasional</span>
            </p>
            <div class="mb-4 rounded-lg border border-neutral-100 bg-neutral-50/70 p-3 space-y-2">
              <div class="flex items-center justify-between gap-3 text-xs">
                <span class="flex items-center gap-2 text-neutral-600">
                  Senin - Kamis
                </span>
                <span class="font-medium text-neutral-800">07:30 - 16:00 WITA</span>
              </div>
              <div class="flex items-center justify-between gap-3 text-xs">
                <span class="flex items-center gap-2 text-neutral-600">
                  Jumat
                </span>
                <span class="font-medium text-neutral-800">07:30 - 16:30 WITA</span>
              </div>
              <div class="flex items-center justify-between gap-3 text-xs">
                <span class="flex items-center gap-2 text-neutral-600">
                  Sabtu - Minggu
                </span>
                <span class="font-medium text-neutral-800">Libur</span>
              </div>
            </div>
            <a href="mailto:magang@kampus.ac.id"
              class="mb-4 text-xs text-neutral-900 font-bold hover:text-amber-600 transition-colors flex items-center gap-2">
              <iconify-icon icon="lucide:mail" class="text-amber-600" width="14"></iconify-icon>
              magang@kampus.ac.id
            </a>
            <div class="border-t border-neutral-100 pt-4 mb-8">
              <p class="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-4">Media Sosial Resmi</p>
              <div class="flex items-center w-full space-between gap-3">
                <a href="https://instagram.com/fakultas.saintek" target="_blank" rel="noopener"
                  class="flex items-center gap-2 p-3 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-500 hover:text-black hover:border-amber-300 hover:bg-white transition-colors">
                  <iconify-icon icon="mdi:instagram" width="18"></iconify-icon>
                </a>
                <a href="https://youtube.com/@fakultassaintek" target="_blank" rel="noopener"
                  class="flex items-center gap-2 p-3 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-500 hover:text-black hover:border-amber-300 hover:bg-white transition-colors">
                  <iconify-icon icon="mdi:youtube" width="18"></iconify-icon>
                </a>
                <a href="https://tiktok.com/@fakultas.saintek" target="_blank" rel="noopener"
                  class="flex items-center gap-2 p-3 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-500 hover:text-black hover:border-amber-300 hover:bg-white transition-colors">
                  <iconify-icon icon="simple-icons:tiktok" width="16"></iconify-icon>
                </a>
                <a href="https://facebook.com/fakultassaintek" target="_blank" rel="noopener"
                  class="flex items-center gap-2 p-3 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-500 hover:text-black hover:border-amber-300 hover:bg-white transition-colors">
                  <iconify-icon icon="mdi:facebook" width="18"></iconify-icon>
                </a>
              </div>
            </div>
          </div>
        </div>
        <!-- copyright -->
        <div
          class="border-t border-neutral-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-400">
          <p>&copy; 2026 Titik Magang &mdash; Fakultas Sains dan Teknologi. All rights reserved.</p>
          <div class="flex gap-6">
            <span>Sistem Informasi Geografis</span>
            <span>Praktik Kerja Lapangan (PKL)</span>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<style scoped>
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll 35s linear infinite;
}

.marquee-group {
  display: flex;
  flex: none;
  align-items: center;
  gap: 3.5rem;
  padding: 0 2rem;
  white-space: nowrap;
}

@keyframes marquee-scroll {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
  }
}
</style>