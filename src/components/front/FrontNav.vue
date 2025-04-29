<template>
  <v-app-bar class="px-1">
    <v-app-bar-nav-icon icon="mdi-home" @click="goHome()"></v-app-bar-nav-icon>
    <v-app-bar-title @click="goHome()" class="clickable">BookStore</v-app-bar-title>

    <!-- search -->
    <div class="d-flex align-center" style="flex: 1; justify-content: center">
      <v-text-field
        v-model="keyword"
        prepend-icon="mdi-magnify"
        density="compact"
        single-line
        hide-details
        flat
        variant="solo-filled"
        style="max-width: 800px; width: 100%"
        placeholder="搜索關鍵字"
        @keyup.enter="emitSearch"
        clearable
        @click:clear="emitClear"
      />
    </div>

    <v-spacer></v-spacer>
    <template v-if="isLoggedIn">
      <v-btn class="mx-3" icon="mdi-cart-outline" @click="goCart()"></v-btn>
      <v-menu min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-menu" v-bind="props"> </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn rounded variant="text" @click="goDashboard()"> 後台管理 </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn rounded variant="text" @click="goOrders()"> 訂單記錄 </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn rounded variant="text" @click="handleLogout()"> 登出 </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
    <template v-else>
      <v-btn class="mx-3" @click="goLogin()"> 登入 </v-btn>
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import { RouteNames } from '@/router/const'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSnackbar } from '@/composables/useSnackbar'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const snackbar = useSnackbar()
const authStore = useAuthStore()
const { logout } = authStore
const isLoggedIn = computed(() => authStore.isLoggedIn)

const user = {
  initials: 'JD',
  fullName: 'John Doe',
  email: 'john.doe@doe.com',
}

const keyword = ref('')
const emit = defineEmits<{
  search: [keyword: string]
  clear: []
}>()

const emitSearch = () => {
  emit('search', keyword.value)
}

const emitClear = () => {
  if (keyword.value !== '') {
    keyword.value = ''
    emit('clear')
  }
}

const goHome = async () => {
  await router.push({ name: RouteNames.HOME })
}

const goCart = async () => {
  await router.push({ name: RouteNames.CART })
}

const goLogin = async () => {
  await router.push({ name: RouteNames.LOGIN })
}

const goOrders = async () => {
  await router.push({ name: RouteNames.ORDERS })
}

const goDashboard = async () => {
  await router.push({ name: RouteNames.DASH_BOARD })
}

function handleLogout() {
  logout()
  router.push({ name: RouteNames.HOME })
  snackbar.show('你已成功登出', 'success', 3000)
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
