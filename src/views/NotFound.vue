<template>
  <v-container fluid class="d-flex flex-column align-center justify-center" style="height: 100vh">
    <div class="text-center">
      <h1 class="text-h2 mb-4">404</h1>
      <p class="text-subtitle-1 mb-6">您所尋找的頁面不存在</p>
      <v-btn color="primary" @click="$router.push('/')">回首頁</v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
// 無需特別邏輯
</script>
