<template>
  <FrontNav @search="handleSearch" @clear="handleClear"></FrontNav>
  <v-main>
    <RouterView></RouterView>
  </v-main>
  <FrontFooter></FrontFooter>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import FrontFooter from '@/components/front/FrontFooter.vue'
import FrontNav from '@/components/front/FrontNav.vue'
import { useSearchStore } from '@/stores'
import { useRouter } from 'vue-router'
import { RouteNames } from '@/router/const'

const router = useRouter()
const { setKeyword, getKeyword, clearKeyword } = useSearchStore()

const handleSearch = async (keyword: string) => {
  if (!keyword.trim()) return
  if (keyword === getKeyword()) return
  setKeyword(keyword)
  // 如果當前路徑不是 '/'，才跳轉回首頁
  if (router.currentRoute.value.name !== RouteNames.HOME) {
    await router.push({ name: RouteNames.HOME })
  }
}

const handleClear = async () => {
  clearKeyword()
  // 如果當前路徑不是 '/'，才跳轉回首頁
  if (router.currentRoute.value.name !== RouteNames.HOME) {
    await router.push({ name: RouteNames.HOME })
  }
}
</script>

<style scoped></style>
