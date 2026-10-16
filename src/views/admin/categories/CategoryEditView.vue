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

const categoryId = route.params.id
const name_category = ref('')
const error = ref('')
const loading = ref(true)
const processing = ref(false)

const fetchCategory = async () => {
  loading.value = true
  try {
    const res = await api.get(`/api/categories/${categoryId}`)
    name_category.value = res.data?.name_category || ''
  } catch (err) {
    toast.error('Kategori tidak ditemukan')
    router.push('/admin/categories')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategory()
})

const submit = async () => {
  error.value = ''
  if (!name_category.value.trim()) {
    error.value = 'Nama kategori wajib diisi'
    return
  }

  processing.value = true
  try {
    await api.patch(`/api/categories/${categoryId}`, {
      name_category: name_category.value.trim()
    })
    toast.success('Kategori berhasil diperbarui!')
    router.push('/admin/categories')
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal memperbarui kategori'
    toast.error(error.value)
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <AuthenticatedLayout>
    <template #header>
      <div class="flex items-center gap-2">
        <router-link to="/admin/categories" class="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
          Kategori
        </router-link>
        <span class="text-xs text-neutral-400">/</span>
        <h1 class="text-xl font-bold text-neutral-900 dark:text-white">
          Edit Kategori
        </h1>
      </div>
    </template>

    <div class="max-w-xl">
      <div class="p-6 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200/80 dark:border-neutral-700 shadow-xs">
        <div v-if="loading" class="py-8 text-center text-neutral-400 text-sm">
          Memuat data kategori...
        </div>

        <form v-else @submit.prevent="submit" class="space-y-5">
          <div>
            <InputLabel for="name_category" value="Nama Kategori *" />
            <TextInput
              id="name_category"
              v-model="name_category"
              required
              autofocus
            />
            <InputError :message="error" />
          </div>

          <div class="pt-3 flex items-center gap-3">
            <SecondaryButton @click="router.push('/admin/categories')">
              Batal
            </SecondaryButton>
            <PrimaryButton :disabled="processing">
              {{ processing ? 'Menyimpan...' : 'Perbarui Kategori' }}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  </AuthenticatedLayout>
</template>
