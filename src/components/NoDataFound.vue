<template>
  <v-container fluid class="d-flex flex-column align-center justify-center" style="height: 100vh">
    <v-img :src="noDataUrl" width="100%"></v-img>
  </v-container>
</template>

<script setup lang="ts">
import noDataUrl from '@/assets/no-data.svg'
</script>

<style scoped></style>
