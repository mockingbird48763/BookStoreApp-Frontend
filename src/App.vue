<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useSnackbar } from './composables/useSnackbar'
const snackbar = useSnackbar()
</script>

<template>
  <v-app>
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
