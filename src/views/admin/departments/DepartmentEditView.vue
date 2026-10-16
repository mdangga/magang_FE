<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AuthenticatedLayout from '../../../layouts/AuthenticatedLayout.vue'
import InputLabel from '../../../components/InputLabel.vue'
import TextInput from '../../../components/TextInput.vue'
import InputError from '../../../components/InputError.vue'
import PrimaryButton from '../../../components/PrimaryButton.vue'
import SecondaryButton from '../../../components/SecondaryButton.vue'
import api from '../../../api'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const router = useRouter()
const route = useRoute()
const departmentId = route.params.id

const faculties = ref([])
const name_department = ref('')
const degree_level = ref('S1')
const id_faculty = ref('')
const errors = ref({})
const loading = ref(true)
const processing = ref(false)

const fetchData = async () => {
  loading.value = true
  try {
    const [facRes, depRes] = await Promise.all([
      api.get('/api/faculties'),
      api.get(`/api/departments/${departmentId}`)
    ])
    faculties.value = facRes.data?.data || []
    if (depRes.data) {
      name_department.value = depRes.data.name_department || ''
      degree_level.value = depRes.data.degree_level || 'S1'
      id_faculty.value = depRes.data.id_faculty || ''
    }
  } catch (err) {
    toast.error('Jurusan tidak ditemukan')
    router.push('/admin/departments')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const submit = async () => {
  errors.value = {}
  if (!name_department.value.trim()) errors.value.name_department = 'Nama jurusan wajib diisi'
  if (!id_faculty.value) errors.value.id_faculty = 'Fakultas wajib dipilih'

  if (Object.keys(errors.value).length > 0) return

  processing.value = true
  try {
    await api.patch(`/api/departments/${departmentId}`, {
      name_department: name_department.value.trim(),
      degree_level: degree_level.value,
      id_faculty: parseInt(id_faculty.value)
    })
    toast.success('Jurusan berhasil diperbarui!')
    router.push('/admin/departments')
  } catch (err) {
    toast.error(err.response?.data?.message || 'Gagal memperbarui jurusan')
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="flex items-center gap-2">
        <router-link to="/admin/departments" class="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
          Jurusan
        </router-link>
        <span class="text-xs text-neutral-400">/</span>
        <h1 class="text-xl font-bold text-neutral-900 dark:text-white">
          Edit Jurusan
        </h1>
      </div>
    </template>

    <div class="max-w-xl">
      <div class="p-6 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200/80 dark:border-neutral-700 shadow-xs">
        <div v-if="loading" class="py-8 text-center text-neutral-400 text-sm">
          Memuat data jurusan...
        </div>

        <form v-else @submit.prevent="submit" class="space-y-5">
          <div>
            <InputLabel for="name_department" value="Nama Jurusan / Program Studi *" />
            <TextInput
              id="name_department"
              v-model="name_department"
              required
              autofocus
            />
            <InputError :message="errors.name_department" />
          </div>

          <div>
            <InputLabel for="degree_level" value="Jenjang Pendidikan *" />
            <select
              id="degree_level"
              v-model="degree_level"
              required
              class="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
            >
              <option value="D3">D3 (Diploma 3)</option>
              <option value="D4">D4 (Sarjana Terapan)</option>
              <option value="S1">S1 (Sarjana)</option>
              <option value="S2">S2 (Magister)</option>
            </select>
          </div>

          <div>
            <InputLabel for="id_faculty" value="Fakultas Terkait *" />
            <select
              id="id_faculty"
              v-model="id_faculty"
              required
              class="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors text-sm"
            >
              <option value="">Pilih Fakultas</option>
              <option v-for="fac in faculties" :key="fac.id_faculty" :value="fac.id_faculty">
                {{ fac.name_faculty }}
              </option>
            </select>
            <InputError :message="errors.id_faculty" />
          </div>

          <div class="pt-3 flex items-center gap-3">
            <SecondaryButton @click="router.push('/admin/departments')">
              Batal
            </SecondaryButton>
            <PrimaryButton :disabled="processing">
              {{ processing ? 'Menyimpan...' : 'Perbarui Jurusan' }}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
