<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import GlobalUiFeedback from '@/components/GlobalUiFeedback.vue'
import { useSettingsStore } from '@/stores/settingsStore'

const settingsStore = useSettingsStore()

onMounted(() => {
  settingsStore.fetchSettings()
})
</script>

<template>
  <RouterView />
  <GlobalUiFeedback />
</template>
