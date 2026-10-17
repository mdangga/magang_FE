import { createRouter, createWebHistory } from 'vue-router'
import LandingPageView from '../views/LandingPageView.vue'
import DocumentationView from '../views/DocumentationView.vue'
import HomeView from '../views/HomeView.vue'
import LocationAddView from '../views/LocationAddView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

// User Views
import UserDashboardView from '../views/user/UserDashboardView.vue'

// Admin Views
import DashboardView from '../views/admin/DashboardView.vue'
import LocationsIndexView from '../views/admin/locations/LocationsIndexView.vue'
import ReportsIndexView from '../views/admin/reports/ReportsIndexView.vue'
import CategoriesIndexView from '../views/admin/categories/CategoriesIndexView.vue'
import CategoryAddView from '../views/admin/categories/CategoryAddView.vue'
import CategoryEditView from '../views/admin/categories/CategoryEditView.vue'
import FacultiesIndexView from '../views/admin/faculties/FacultiesIndexView.vue'
import FacultyAddView from '../views/admin/faculties/FacultyAddView.vue'
import FacultyEditView from '../views/admin/faculties/FacultyEditView.vue'
import DepartmentsIndexView from '../views/admin/departments/DepartmentsIndexView.vue'
import DepartmentAddView from '../views/admin/departments/DepartmentAddView.vue'
import DepartmentEditView from '../views/admin/departments/DepartmentEditView.vue'
import ProfileEditView from '../views/admin/profile/ProfileEditView.vue'

import { useAuthStore } from '../stores/auth'

const routes = [
  // Public Routes
  {
    path: '/',
    name: 'landing',
    component: LandingPageView,
    meta: { title: 'Titik Magang - Platform GIS Pemetaan Tempat Magang' }
  },
  {
    path: '/landing',
    redirect: '/'
  },
  {
    path: '/map',
    name: 'map',
    component: HomeView,
    meta: { title: 'Peta Interaktif - Titik Magang' }
  },
  {
    path: '/peta',
    redirect: '/map'
  },
  {
    path: '/docs',
    name: 'documentation',
    component: DocumentationView,
    meta: { title: 'Dokumentasi Sistem - Titik Magang' }
  },
  {
    path: '/documentation',
    redirect: '/docs'
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Portal Masuk' }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { title: 'Daftar Akun Mahasiswa' }
  },
  {
    path: '/locations/add',
    name: 'locations.add',
    component: LocationAddView,
    meta: { title: 'Pengajuan Titik Magang' }
  },
  {
    path: '/locations/create',
    redirect: '/locations/add'
  },

  // User / Mahasiswa Routes (Protected)
  {
    path: '/user',
    redirect: '/user/dashboard'
  },
  {
    path: '/user/dashboard',
    name: 'user.dashboard',
    component: UserDashboardView,
    meta: { requiresAuth: true, title: 'Dashboard Mahasiswa' }
  },

  // Admin Routes (Protected - Role Admin)
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    name: 'admin.dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, role: 'admin', title: 'Dashboard Admin' }
  },
  {
    path: '/admin/locations',
    name: 'admin.locations',
    component: LocationsIndexView,
    meta: { requiresAuth: true, role: 'admin', title: 'Kelola Lokasi Magang' }
  },
  {
    path: '/admin/locations/add',
    name: 'admin.locations.add',
    component: LocationAddView,
    meta: { requiresAuth: true, role: 'admin', title: 'Pengajuan Titik Magang' }
  },
  {
    path: '/admin/locations/create',
    redirect: '/admin/locations/add'
  },
  {
    path: '/admin/reports',
    name: 'admin.reports',
    component: ReportsIndexView,
    meta: { requiresAuth: true, role: 'admin', title: 'Verifikasi Laporan Magang' }
  },
  {
    path: '/admin/categories',
    name: 'admin.categories',
    component: CategoriesIndexView,
    meta: { requiresAuth: true, role: 'admin', title: 'Kelola Kategori' }
  },
  {
    path: '/admin/categories/add',
    name: 'admin.categories.add',
    component: CategoryAddView,
    meta: { requiresAuth: true, role: 'admin', title: 'Tambah Kategori' }
  },
  {
    path: '/admin/categories/edit/:id',
    name: 'admin.categories.edit',
    component: CategoryEditView,
    meta: { requiresAuth: true, role: 'admin', title: 'Edit Kategori' }
  },
  {
    path: '/admin/faculties',
    name: 'admin.faculties',
    component: FacultiesIndexView,
    meta: { requiresAuth: true, role: 'admin', title: 'Kelola Fakultas' }
  },
  {
    path: '/admin/faculties/add',
    name: 'admin.faculties.add',
    component: FacultyAddView,
    meta: { requiresAuth: true, role: 'admin', title: 'Tambah Fakultas' }
  },
  {
    path: '/admin/faculties/edit/:id',
    name: 'admin.faculties.edit',
    component: FacultyEditView,
    meta: { requiresAuth: true, role: 'admin', title: 'Edit Fakultas' }
  },
  {
    path: '/admin/departments',
    name: 'admin.departments',
    component: DepartmentsIndexView,
    meta: { requiresAuth: true, role: 'admin', title: 'Kelola Jurusan' }
  },
  {
    path: '/admin/departments/add',
    name: 'admin.departments.add',
    component: DepartmentAddView,
    meta: { requiresAuth: true, role: 'admin', title: 'Tambah Jurusan' }
  },
  {
    path: '/admin/departments/edit/:id',
    name: 'admin.departments.edit',
    component: DepartmentEditView,
    meta: { requiresAuth: true, role: 'admin', title: 'Edit Jurusan' }
  },
  {
    path: '/admin/profile',
    name: 'admin.profile',
    component: ProfileEditView,
    meta: { requiresAuth: true, role: 'admin', title: 'Pengaturan Profil Website' }
  },

  // Fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  const authStore = useAuthStore()

  // Ensure user data is fetched if token exists
  if (token && !authStore.user) {
    await authStore.fetchUser()
  }

  const user = authStore.user
  const userRole = user?.role || 'user'

  if (to.meta.requiresAuth) {
    if (!token) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    // Role admin guard
    if (to.meta.role === 'admin' && userRole !== 'admin') {
      return next({ name: 'user.dashboard' })
    }

    return next()
  }

  // Already logged in trying to access login/register
  if ((to.name === 'login' || to.name === 'register') && token) {
    if (userRole === 'admin') {
      return next({ name: 'admin.dashboard' })
    } else {
      return next({ name: 'user.dashboard' })
    }
  }

  next()
})

export default router
