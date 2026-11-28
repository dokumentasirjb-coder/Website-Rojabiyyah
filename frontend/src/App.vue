<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'
import GlobalUiFeedback from '@/components/GlobalUiFeedback.vue'
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()

watch(
  () => [
    settingsStore.settings.site_favicon_url,
    settingsStore.settings.favicon_url,
    settingsStore.settings.logo_image_url,
  ],
  ([siteFav, fav, logo]) => {
    const target = siteFav || fav || logo
    if (target) {
      settingsStore.applyFavicon(target)
    }
  },
  { immediate: true }
)

onMounted(() => {
  settingsStore.fetchSettings()
})
</script>

<template>
  <RouterView />
  <GlobalUiFeedback />
</template>
