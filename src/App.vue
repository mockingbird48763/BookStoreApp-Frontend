<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useSnackbar } from './composables/useSnackbar'
import { useAuthStore } from '@/stores/auth'
import { onMounted, watchEffect } from 'vue'
import FullScreenLoader from './components/FullScreenLoader.vue'
import { useGlobalLoading } from './composables/useGlobalLoading'

const snackbar = useSnackbar()
const authStore = useAuthStore()
const globalLoading = useGlobalLoading()
onMounted(() => {
  authStore.loadToken()
})
watchEffect(() => {})
</script>

<template>
  <v-app>
    <FullScreenLoader :modelValue="globalLoading.loading.value" />
    <v-snackbar
      v-model="snackbar.isVisible.value"
      :color="snackbar.color.value"
      :timeout="snackbar.timeout.value"
      :location="snackbar.location.value"
      close-on-content-click
    >
      {{ snackbar.text }}
    </v-snackbar>

    <RouterView />
  </v-app>
</template>

<style scoped></style>
