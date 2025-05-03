<template>
  <v-container class="pa-4">
    <v-dialog
      v-model="visible"
      transition="dialog-bottom-transition"
      :fullscreen="display.smAndDown.value"
      :style="{ width: display.smAndDown.value ? '100%' : '960px' }"
    >
      <v-card>
        <v-toolbar>
          <v-btn icon="mdi-close" @click="visible = false"></v-btn>
          <v-toolbar-title>{{ isEdit ? '編輯書籍' : '新增書籍' }}</v-toolbar-title>
        </v-toolbar>
        <!-- 需要 v-card-text 才能讓表單元素集中 -->
        <v-card-text>
          <v-form lazy-validation ref="formRef" v-model="formIsValid">
            <v-row dense>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="ISBN"
                  v-model="selectedBook.isbn"
                  :rules="[rules.required, rules.isValidISBN]"
                />
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field label="書名" v-model="selectedBook.title" :rules="[rules.required]" />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  label="描述"
                  v-model="selectedBook.description"
                  :rules="[rules.required]"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-row dense>
              <v-col cols="12" sm="6" md="3">
                <v-number-input
                  label="售價"
                  :max="999999"
                  :min="0"
                  v-model="selectedBook.listPrice"
                  inset
                  :rules="[rules.required]"
                ></v-number-input>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-number-input
                  label="折扣(折)"
                  :max="99"
                  :min="0"
                  v-model="selectedBook.discount"
                  inset
                  :rules="[rules.required]"
                ></v-number-input>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-number-input
                  label="庫存"
                  :max="999999"
                  :min="0"
                  v-model="selectedBook.stock"
                  inset
                  :rules="[rules.requiredForStock]"
                ></v-number-input>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-text-field label="預期優惠價" disabled v-model="expectedDiscountPrice" />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="selectedBook.authorId"
                  :items="authors"
                  item-title="name"
                  item-value="id"
                  label="作者"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="selectedBook.publisherId"
                  :items="publishers"
                  item-title="name"
                  item-value="id"
                  label="出版社"
                  :rules="[rules.required]"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="出版日期"
                  v-model="selectedBook.publicationDate"
                  type="date"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-file-input
                  v-model="selectedBook.uploadedFile"
                  label="上傳封面（格式：JPG、PNG；大小限制：2MB）"
                  accept="image/*"
                  prepend-icon=""
                  prepend-inner-icon="mdi-file-image"
                  @update:modelValue="onFileClearOrChange"
                  :rules="fileInputRules"
                  :error="fileError !== ''"
                  :error-messages="fileError"
                />
              </v-col>
              <v-col cols="12" sm="6" md="6" style="margin-left: auto">
                <v-img :src="previewImage" max-height="200" contain />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn text @click="visible = false">取消</v-btn>
          <v-btn color="primary" @click="handleSubmitForm()">
            {{ isEdit ? '更新' : '新增' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'
import defaultImage from '@/assets/default-image.png'
import type { VForm } from 'vuetify/components'
import type { SelectedBook } from '@/views/back/BookManagementView.vue'

const display = useDisplay()
const visible = defineModel<boolean>('visible', { required: true })
const isEdit = defineModel<boolean>('isEdit', { required: true })
const authors = defineModel<{ id: number; name: string }[]>('authors', { required: true })
const publishers = defineModel<{ id: number; name: string }[]>('publishers', { required: true })
const selectedBook = defineModel<SelectedBook>('selectedBook', {
  required: true,
})
const emit = defineEmits<{
  (event: 'submitForm'): void
}>()
const formRef = ref<VForm | null>(null)
const formIsValid = ref(false)
const fileError = ref('')
const rules = {
  required: (value: string | number | null | undefined) => !!value || '此欄位為必填',
  requiredForStock: (value: number) => value > -1 || '庫存必須大於等於 0',
  isValidISBN: (v: string) =>
    /^\d{3}-\d-\d{6}-\d{3}$/.test(v) || 'ISBN 格式錯誤，請輸入 123-4-567890-000',
  fileSize: (file: File) => {
    // 當檔案不存在時，不進行大小驗證
    if (!file) return true
    // 如果檔案存在，則檢查大小
    return !(file.size > 2 * 1024 * 1024) || '檔案大小超過 2MB'
  },
}

const fileInputRules = computed(() => {
  // 如果 imagePath 存在，則不需要 required 規則
  return selectedBook.value.imagePath ? [rules.fileSize] : [rules.required, rules.fileSize]
})

const previewImage = computed(() => {
  if (selectedBook.value.uploadedFile) {
    return selectedBook.value.newImagePath || defaultImage
  } else {
    if (selectedBook.value.imagePath) {
      return `/images/${selectedBook.value.imagePath}`
    } else {
      return defaultImage
    }
  }
})

const expectedDiscountPrice = computed(() => {
  const price = selectedBook.value?.listPrice ?? 0
  const discount = selectedBook.value?.discount ?? 1
  return (price * (discount / 100)).toFixed(0)
})

function clearFile() {
  selectedBook.value.uploadedFile = null
  selectedBook.value.newImagePath = ''
}

function uploadFile(file: File) {
  selectedBook.value.uploadedFile = file
  selectedBook.value.newImagePath = URL.createObjectURL(file)
}

const onFileClearOrChange = (file: File | File[]) => {
  if (!file) {
    // 使用者按 X 清除
    clearFile()
    return
  } else if (!Array.isArray(file)) {
    // 使用者選擇了新檔案
    uploadFile(file)
  } else {
    // 使用者選擇了多個檔案
    fileError.value = '只能上傳一個檔案'
  }
}

const handleSubmitForm = async () => {
  const { valid } = await formRef.value!.validate()
  if (!valid) {
    console.log('表單驗證失敗')
    return
  } else {
    console.log('表單驗證成功')
    emit('submitForm')
  }
}
</script>
