<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
    <v-list-item :prepend-avatar="fakeAvatar" title="John Leider" nav>
      <template v-slot:append>
        <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <!-- nav 自動高亮模式 -->
    <v-list nav density="default" :items="items" item-title="title" item-value="to" item-props />

    <template #append>
      <v-list-item class="ma-2" link nav prepend-icon="mdi-home-outline" to="/" title="首頁" />
    </template>
  </v-navigation-drawer>

  <v-main>
    <v-container fluid>
      <RouterView></RouterView>
      <!--
      <v-data-table :items="tableData"></v-data-table>
      -->
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import fakeAvatar from '@/assets/fake-avatar.png'

const drawer = ref(true)
const rail = ref(true)

const items = [
  {
    title: '書籍管理',
    prependIcon: 'mdi-book-open-page-variant',
    to: '/dashboard/books',
  },
  {
    title: '訂單管理',
    prependIcon: 'mdi-receipt-text-outline',
    to: '/dashboard/orders',
  },
]
</script>

<style scoped></style>
