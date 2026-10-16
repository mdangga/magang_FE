import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LocationAddView from '../views/LocationAddView.vue'
import LoginView from '../views/LoginView.vue'

// Admin Views
import DashboardView from '../views/admin/DashboardView.vue'
import LocationsIndexView from '../views/admin/locations/LocationsIndexView.vue'
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

const routes = [
  // Public Routes
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Beranda - Peta Magang' }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Masuk Administrator' }
  },

  // Admin Routes (Protected)
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    name: 'admin.dashboard',
    component: DashboardView,
    meta: { requiresAuth: true, title: 'Dashboard Admin' }
  },
  {
    path: '/admin/locations',
    name: 'admin.locations',
    component: LocationsIndexView,
    meta: { requiresAuth: true, title: 'Kelola Lokasi Magang' }
  },
  {
    path: '/admin/locations/add',
    name: 'admin.locations.add',
    component: LocationAddView,
    meta: { requiresAuth: true, title: 'Pengajuan Titik Magang' }
  },
  {
    path: '/admin/locations/create',
    redirect: '/admin/locations/add'
  },
  {
    path: '/admin/categories',
    name: 'admin.categories',
    component: CategoriesIndexView,
    meta: { requiresAuth: true, title: 'Kelola Kategori' }
  },
  {
    path: '/admin/categories/add',
    name: 'admin.categories.add',
    component: CategoryAddView,
    meta: { requiresAuth: true, title: 'Tambah Kategori' }
  },
  {
    path: '/admin/categories/edit/:id',
    name: 'admin.categories.edit',
    component: CategoryEditView,
    meta: { requiresAuth: true, title: 'Edit Kategori' }
  },
  {
    path: '/admin/faculties',
    name: 'admin.faculties',
    component: FacultiesIndexView,
    meta: { requiresAuth: true, title: 'Kelola Fakultas' }
  },
  {
    path: '/admin/faculties/add',
    name: 'admin.faculties.add',
    component: FacultyAddView,
    meta: { requiresAuth: true, title: 'Tambah Fakultas' }
  },
  {
    path: '/admin/faculties/edit/:id',
    name: 'admin.faculties.edit',
    component: FacultyEditView,
    meta: { requiresAuth: true, title: 'Edit Fakultas' }
  },
  {
    path: '/admin/departments',
    name: 'admin.departments',
    component: DepartmentsIndexView,
    meta: { requiresAuth: true, title: 'Kelola Jurusan' }
  },
  {
    path: '/admin/departments/add',
    name: 'admin.departments.add',
    component: DepartmentAddView,
    meta: { requiresAuth: true, title: 'Tambah Jurusan' }
  },
  {
    path: '/admin/departments/edit/:id',
    name: 'admin.departments.edit',
    component: DepartmentEditView,
    meta: { requiresAuth: true, title: 'Edit Jurusan' }
  },
  {
    path: '/admin/profile',
    name: 'admin.profile',
    component: ProfileEditView,
    meta: { requiresAuth: true, title: 'Pengaturan Profil Website' }
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
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth && !token) {
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && token) {
    next({ name: 'admin.dashboard' })
  } else {
    next()
  }
})

export default router
