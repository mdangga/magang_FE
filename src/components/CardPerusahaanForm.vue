<script setup>
import InputLabel from './InputLabel.vue'
import TextInput from './TextInput.vue'
import InputError from './InputError.vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  categories: {
    type: Array,
    default: () => []
  }
})
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
    <div class="px-6 py-4 border-b border-neutral-100 dark:border-neutral-700 text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
      <i class="fas fa-building text-amber-500"></i>
      Informasi Perusahaan / Instansi Lokasi Magang
    </div>

    <div class="p-6 space-y-6">
      <!-- Name Location -->
      <div>
        <InputLabel for="name_location" value="Nama Perusahaan / Instansi *" />
        <TextInput
          id="name_location"
          type="text"
          class="mt-1"
          v-model="form.name_location"
          required
          placeholder="Contoh: PT. Telkom Indonesia / Dinas Kominfo"
        />
        <InputError class="mt-2" :message="form.errors?.name_location" />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Category -->
        <div>
          <InputLabel for="id_category" value="Kategori Bidang *" />
          <select
            id="id_category"
            class="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors mt-1"
            v-model="form.id_category"
            required
          >
            <option value="">Pilih Kategori</option>
            <option v-for="category in categories" :key="category.id_category" :value="category.id_category">
              {{ category.name_category }}
            </option>
          </select>
          <InputError class="mt-2" :message="form.errors?.id_category" />
        </div>

        <!-- Contact -->
        <div>
          <InputLabel for="contact" value="Kontak / No. Telepon / HRD *" />
          <TextInput
            id="contact"
            type="text"
            class="mt-1"
            v-model="form.contact"
            required
            placeholder="Contoh: 081234567890 / info@perusahaan.com"
          />
          <InputError class="mt-2" :message="form.errors?.contact" />
        </div>
      </div>

      <!-- Description -->
      <div>
        <InputLabel for="description" value="Deskripsi Pekerjaan / Divisi / Catatan *" />
        <textarea
          id="description"
          class="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none mt-1"
          v-model="form.description"
          rows="4"
          required
          placeholder="Jelaskan mengenai proyek atau pekerjaan yang dilakukan selama magang di tempat ini..."
        ></textarea>
        <InputError class="mt-2" :message="form.errors?.description" />
      </div>
    </div>
  </div>
</template>
