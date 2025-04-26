<template>
  <FrontNav @search="handleSearch" @clear="handleClear"></FrontNav>
  <v-main>
    <HomeView></HomeView>
  </v-main>
  <FrontFooter></FrontFooter>
</template>

<script setup lang="ts">
import FrontFooter from '@/components/front/FrontFooter.vue'
import FrontNav from '@/components/front/FrontNav.vue'
import { useSearchStore } from '@/stores'
import HomeView from '@/views/front/HomeView.vue'

const { setKeyword, getKeyword, clearKeyword } = useSearchStore()

const handleSearch = (keyword: string) => {
  if (!keyword.trim()) return
  if (keyword === getKeyword()) return
  setKeyword(keyword)
}

const handleClear = () => {
  clearKeyword()
}
</script>

<style scoped></style>
