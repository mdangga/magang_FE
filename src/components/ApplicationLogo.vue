<script setup>
import { useProfileStore } from '../stores/profile'

const profileStore = useProfileStore()
</script>

<template>
  <div class="flex items-center gap-2">
    <img 
      v-if="profileStore.logoUrl" 
      :src="profileStore.logoUrl" 
      :alt="profileStore.profile.app_name || 'Logo'" 
      class="h-9 w-auto max-w-30 object-contain rounded"
    />
    <div 
      v-else 
      class="h-9 w-9 rounded-lg bg-primary flex items-center justify-center font-bold text-neutral-900 shadow-sm"
    >
      <i class="fas fa-map-location-dot text-lg"></i>
    </div>
    <span class="font-bold text-lg text-neutral-900 dark:text-white tracking-tight hidden sm:inline">
      {{ profileStore.profile.app_name || 'Peta Magang' }}
    </span>
  </div>
</template>
