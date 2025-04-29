<script setup lang="ts">
defineProps<{
  icon: string
  color: string
  label: string
}>()
</script>

<template>
  <v-tooltip location="top">
    <template #activator="{ props }">
      <v-icon v-bind="props" :icon="icon" :color="color" />
    </template>
    <span>{{ label }}</span>
  </v-tooltip>
</template>
