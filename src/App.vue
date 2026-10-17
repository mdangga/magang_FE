<script setup>
import { onMounted, watch } from 'vue'
import { useProfileStore } from './stores/profile'

const profileStore = useProfileStore()

const updateFavicon = (url) => {
  let link = document.querySelector("link[rel~='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.href = url || '/favicon.svg'
}

onMounted(async () => {
  await profileStore.fetchProfile()
  updateFavicon(profileStore.logoUrl)
})

watch(() => profileStore.logoUrl, (newUrl) => {
  updateFavicon(newUrl)
})
</script>

<template>
  <router-view></router-view>
</template>
