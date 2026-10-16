<script setup>
import { ref, onMounted, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ApplicationLogo from '../components/ApplicationLogo.vue'
import Dropdown from '../components/Dropdown.vue'
import DropdownLink from '../components/DropdownLink.vue'
import NavLink from '../components/NavLink.vue'
import ResponsiveNavLink from '../components/ResponsiveNavLink.vue'
import DarkModeToggle from '../components/DarkModeToggle.vue'
import { useAuthStore } from '../stores/auth'
import { useProfileStore } from '../stores/profile'

const authStore = useAuthStore()
const profileStore = useProfileStore()
const router = useRouter()
const route = useRoute()

const showingNavigationDropdown = ref(false)
const darkMode = ref(false)

provide('darkMode', darkMode)
provide('toggleDarkMode', (value) => {
  darkMode.value = value !== undefined ? value : !darkMode.value
  applyDarkMode()
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
})

const toggleDarkMode = (newValue) => {
  darkMode.value = newValue
  localStorage.setItem('theme', darkMode.value ? 'dark' : 'light')
  applyDarkMode()
}

const applyDarkMode = () => {
  document.documentElement.classList.toggle('dark', darkMode.value)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  const saved = localStorage.getItem('theme')
  const mq = window.matchMedia('(prefers-color-scheme: dark)')

  if (saved) {
    darkMode.value = saved === 'dark'
  } else {
    darkMode.value = mq.matches
  }
  applyDarkMode()

  if (!authStore.user) {
    await authStore.fetchUser()
  }
  if (!profileStore.profile?.app_name) {
    await profileStore.fetchProfile()
  }
})
</script>

<template>
  <div class="min-h-screen bg-neutral-100 dark:bg-neutral-900 transition-colors">
    <nav class="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 sticky top-0 z-40">
      <!-- Primary Navigation Menu -->
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 justify-between items-center">
          <div class="flex items-center gap-8">
            <!-- Logo -->
            <router-link to="/admin/dashboard" class="flex shrink-0 items-center">
              <ApplicationLogo />
            </router-link>

            <!-- Navigation Links -->
            <div class="hidden md:flex space-x-6">
              <NavLink to="/admin/dashboard">
                <i class="fas fa-chart-pie mr-1.5 text-xs"></i> Dashboard
              </NavLink>
              <NavLink to="/admin/locations">
                <i class="fas fa-map-location-dot mr-1.5 text-xs"></i> Lokasi
              </NavLink>
              <NavLink to="/admin/categories">
                <i class="fas fa-tags mr-1.5 text-xs"></i> Kategori
              </NavLink>
              <NavLink to="/admin/faculties">
                <i class="fas fa-building-columns mr-1.5 text-xs"></i> Fakultas
              </NavLink>
              <NavLink to="/admin/departments">
                <i class="fas fa-graduation-cap mr-1.5 text-xs"></i> Jurusan
              </NavLink>
            </div>
          </div>

          <!-- Right side: Dark Mode & User Profile -->
          <div class="hidden md:flex items-center gap-4">
            <DarkModeToggle v-model="darkMode" @toggle="toggleDarkMode" />

            <!-- Website link -->
            <router-link
              to="/"
              target="_blank"
              class="p-2 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg transition"
              title="Lihat Website Publik"
            >
              <i class="fas fa-globe text-base"></i>
            </router-link>

            <!-- Settings Dropdown -->
            <Dropdown align="right" width="56">
              <template #trigger>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none transition"
                >
                  <div class="w-7 h-7 rounded-lg bg-primary text-neutral-900 flex items-center justify-center font-bold text-xs">
                    {{ authStore.user?.username?.charAt(0).toUpperCase() || 'A' }}
                  </div>
                  <span>{{ authStore.user?.username || 'Administrator' }}</span>
                  <i class="fas fa-chevron-down text-xs text-neutral-400"></i>
                </button>
              </template>

              <template #content>
                <div class="px-4 py-2 text-xs border-b border-neutral-100 dark:border-neutral-700 text-neutral-400">
                  Signed in as <b class="text-neutral-800 dark:text-neutral-200">{{ authStore.user?.username }}</b>
                </div>
                <DropdownLink to="/admin/profile">
                  <i class="fas fa-gear text-neutral-400 w-4"></i> Pengaturan Website
                </DropdownLink>
                <DropdownLink to="/" target="_blank">
                  <i class="fas fa-external-link-alt text-neutral-400 w-4"></i> Beranda Publik
                </DropdownLink>
                <div class="border-t border-neutral-100 dark:border-neutral-700 my-1"></div>
                <DropdownLink as="button" @click="handleLogout" class="text-red-600 dark:text-red-400">
                  <i class="fas fa-right-from-bracket w-4"></i> Keluar
                </DropdownLink>
              </template>
            </Dropdown>
          </div>

          <!-- Hamburger for Mobile -->
          <div class="flex items-center gap-2 md:hidden">
            <DarkModeToggle v-model="darkMode" @toggle="toggleDarkMode" />
            <button
              @click="showingNavigationDropdown = !showingNavigationDropdown"
              class="inline-flex items-center justify-center p-2 rounded-xl text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700 transition"
            >
              <i class="fas" :class="showingNavigationDropdown ? 'fa-xmark' : 'fa-bars'"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Responsive Navigation Menu -->
      <div v-show="showingNavigationDropdown" class="md:hidden border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 pb-3">
        <div class="space-y-1 pt-2">
          <ResponsiveNavLink to="/admin/dashboard">
            Dashboard
          </ResponsiveNavLink>
          <ResponsiveNavLink to="/admin/locations">
            Lokasi Magang
          </ResponsiveNavLink>
          <ResponsiveNavLink to="/admin/categories">
            Kategori
          </ResponsiveNavLink>
          <ResponsiveNavLink to="/admin/faculties">
            Fakultas
          </ResponsiveNavLink>
          <ResponsiveNavLink to="/admin/departments">
            Jurusan
          </ResponsiveNavLink>
          <ResponsiveNavLink to="/admin/profile">
            Pengaturan Profil
          </ResponsiveNavLink>
          <ResponsiveNavLink to="/">
            Beranda Publik
          </ResponsiveNavLink>
        </div>

        <!-- Responsive User Info -->
        <div class="border-t border-neutral-200 dark:border-neutral-700 pt-4 pb-1 px-4">
          <div class="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
            {{ authStore.user?.username || 'Administrator' }}
          </div>
          <button
            type="button"
            @click="handleLogout"
            class="mt-2 text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1.5"
          >
            <i class="fas fa-right-from-bracket"></i> Keluar
          </button>
        </div>
      </div>
    </nav>

    <!-- Page Heading -->
    <header v-if="$slots.header" class="bg-white dark:bg-neutral-800 shadow-xs border-b border-neutral-200/80 dark:border-neutral-800">
      <div class="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <slot name="header" />
      </div>
    </header>

    <!-- Page Content -->
    <main class="py-6">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>
