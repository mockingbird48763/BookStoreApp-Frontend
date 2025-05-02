<template>
  <!-- persistent 無法手動關掉 -->
  <v-overlay :model-value="overlay" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
  </v-overlay>
</template>

<script setup lang="ts">
// 不傳遞參數，就是指定 modelValue
const overlay = defineModel<boolean>()
</script>
