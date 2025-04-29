<template>
  <v-container fluid fill-height>
    <!-- 使用 v-row 和 v-col 來實現垂直置中並且有上邊距 -->
    <v-row justify="center" align="center" class="fill-height mt-10">
      <v-col cols="12" md="6" lg="4">
        <v-card
          class="mx-auto pa-12 pb-8 pt-8"
          elevation="8"
          max-width="448"
          rounded="lg"
          height="500px"
        >
          <!-- Tab 切換 -->
          <v-tabs v-model="tab" align-tabs="center" background-color="deep-purple accent-4" dark>
            <v-tab value="login">登入</v-tab>
            <v-tab value="register">註冊</v-tab>
          </v-tabs>

          <!-- Tab 內容 -->
          <v-tabs-window v-model="tab" class="pt-12">
            <!-- 登入頁面 -->
            <v-tabs-window-item value="login">
              <v-form ref="loginForm" v-model="loginFormValid">
                <v-row justify="center" align="center" class="fill-height">
                  <v-col cols="12" sm="10">
                    <div class="text-subtitle-1 text-medium-emphasis">Account</div>

                    <v-text-field
                      density="compact"
                      placeholder="Email address"
                      prepend-inner-icon="mdi-email-outline"
                      variant="outlined"
                      v-model="loginFormData.email"
                      :rules="emailRules"
                    ></v-text-field>

                    <div
                      class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between mt-4"
                    >
                      Password
                    </div>

                    <v-text-field
                      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="visible ? 'text' : 'password'"
                      density="compact"
                      placeholder="Enter your password"
                      prepend-inner-icon="mdi-lock-outline"
                      variant="outlined"
                      @click:append-inner="visible = !visible"
                      v-model="loginFormData.password"
                      :rules="passwordRules"
                    ></v-text-field>

                    <v-btn
                      class="mb-8 mt-4"
                      color="blue"
                      size="large"
                      variant="tonal"
                      block
                      @click="handleLogin"
                    >
                      登入
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-tabs-window-item>
            <!-- 註冊頁面 -->
            <v-tabs-window-item value="register">
              <v-form ref="registerForm" v-model="registerFormValid">
                <v-row justify="center" align="center" class="fill-height">
                  <v-col cols="12" sm="10">
                    <div class="text-subtitle-1 text-medium-emphasis">Account</div>

                    <v-text-field
                      density="compact"
                      placeholder="Email address"
                      prepend-inner-icon="mdi-email-outline"
                      variant="outlined"
                      v-model="registerFormData.email"
                      :rules="emailRules"
                    ></v-text-field>

                    <div
                      class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between mt-4"
                    >
                      Password
                    </div>

                    <v-text-field
                      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="visible ? 'text' : 'password'"
                      density="compact"
                      placeholder="Enter your password"
                      prepend-inner-icon="mdi-lock-outline"
                      variant="outlined"
                      @click:append-inner="visible = !visible"
                      v-model="registerFormData.password"
                      :rules="passwordRules"
                    ></v-text-field>

                    <v-text-field
                      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                      :type="visible ? 'text' : 'password'"
                      density="compact"
                      placeholder="Confirm your password"
                      prepend-inner-icon="mdi-lock-outline"
                      variant="outlined"
                      @click:append-inner="visible = !visible"
                      v-model="registerFormData.confirmPassword"
                      :rules="confirmPasswordRules"
                      class="mt-4"
                    ></v-text-field>

                    <v-btn
                      class="mb-8 mt-4"
                      color="blue"
                      size="large"
                      variant="tonal"
                      block
                      @click="handleRegister"
                    >
                      註冊
                    </v-btn>
                  </v-col>
                </v-row>
              </v-form>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { fetchLogin, fetchRegister } from '@/api'
import { useSnackbar } from '@/composables/useSnackbar'
import router from '@/router'
import { RouteNames } from '@/router/const'
import { useAuthStore } from '@/stores/auth'
import { reactive, ref } from 'vue'
import type { VForm } from 'vuetify/components'

const snackbar = useSnackbar()
const authStore = useAuthStore()
const { login } = authStore

const tab = ref('login')
const visible = ref(false)
const loginFormValid = ref(false)
const loginFormData = reactive({
  email: '',
  password: '',
})
const loginForm = ref<VForm | null>(null)

const registerFormValid = ref(false)
const registerForm = ref<VForm | null>(null)
const registerFormData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
})
const emailRules = [
  (v: string) => !!v || 'Email 是必填的',
  (v: string) => /.+@.+\..+/.test(v) || '請輸入有效的 Email',
]
const passwordRules = [
  (v: string) => !!v || '密碼是必填的',
  (v: string) => (v && v.length >= 8 && v.length <= 16) || '密碼長度必須在 8 到 16 字符之間',
  (v: string) => /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(v) || '密碼必須包含字母和數字',
]
const confirmPasswordRules = [
  (v: string) => v === registerFormData.password || '密碼與確認密碼不匹配',
]

const handleLogin = async () => {
  const { valid } = await loginForm.value!.validate()
  if (!valid) {
    snackbar.show('請檢查表單是否正確', 'error', 1000, 'top center')
  } else {
    await fetchLogin({
      email: loginFormData.email,
      password: loginFormData.password,
    })
      .then((res) => {
        snackbar.show('登入成功', 'success', 1000, 'top center')
        const token = (res as unknown as { token: string }).token
        login(token)
        router.push({ name: RouteNames.HOME })
      })
      .catch(() => {
        snackbar.show('登入失敗', 'error', 1000, 'top center')
      })
  }
}

const handleRegister = async () => {
  const { valid } = await registerForm.value!.validate()
  if (!valid) {
    snackbar.show('請檢查表單是否正確', 'error', 1000, 'top center')
  } else {
    await fetchRegister({ ...registerFormData })
      .then(() => {
        tab.value = 'login'
        snackbar.show('註冊成功', 'success', 1000, 'top center')
      })
      .catch((error) => {
        const message = error.response.data.errors[0]
        snackbar.show(`註冊失敗: ${message}`, 'error', 1000, 'top center')
      })
  }
}
</script>

<style scoped></style>
