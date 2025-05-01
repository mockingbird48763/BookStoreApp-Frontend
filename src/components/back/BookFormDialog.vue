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
          <v-form lazy-validation ref="formRef" v-model="formIsValid" @submit.prevent="submitForm">
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
              <v-col cols="12" sm="6" md="4">
                <v-number-input
                  label="售價"
                  :max="999999"
                  :min="0"
                  v-model="selectedBook.listPrice"
                  inset
                  :rules="[rules.required]"
                ></v-number-input>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-number-input
                  label="折扣(折)"
                  :max="99"
                  :min="0"
                  v-model="selectedBook.discount"
                  inset
                  :rules="[rules.required]"
                ></v-number-input>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-number-input
                  label="庫存"
                  :max="999999"
                  :min="0"
                  v-model="selectedBook.stock"
                  inset
                  :rules="[rules.required]"
                ></v-number-input>
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
                  v-model="selectedBook.publishedId"
                  :items="publisheds"
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
          <v-btn color="primary" @click="submitForm">
            {{ isEdit ? '更新' : '新增' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useDisplay } from 'vuetify'
import defaultImage from '@/assets/default-image.png'
import type { VForm } from 'vuetify/components'

const display = useDisplay()

const visible = defineModel<boolean>('visible', { required: true })
const isEdit = defineModel<boolean>('isEdit', { required: true })
const formRef = ref<VForm | null>(null)
const formIsValid = ref(false)
// const selectedBook = reactive({
//   isbn: '123-4-567890-000',
//   title: 'Test Title',
//   description: 'Test Description',
//   listPrice: 100,
//   discount: 79,
//   stock: 10,
//   publicationDate: '2023-10-01',
//   authorId: 1,
//   publishedId: 1,
//   imagePath: '/example/20000000_000000_0001.png',
//   newImagePath: null,
//   uploadedFile: null,
// })

const selectedBook = reactive({
  isbn: '',
  title: '',
  description: '',
  listPrice: 0,
  discount: 0,
  stock: 0,
  publicationDate: '',
  authorId: 0,
  publishedId: 0,
  imagePath: '/example/20000000_000000_0001.png',
  newImagePath: '',
  uploadedFile: null,
})
const fileError = ref('')
const rules = {
  required: (value: string | number | null | undefined) => !!value || '此欄位為必填',
  isValidISBN: (v: string) =>
    /^\d{3}-\d-\d{6}-\d{3}$/.test(v) || 'ISBN 格式錯誤，請輸入 123-4-567890-000',
  fileSize: (file: File) => {
    // 當檔案不存在時，不進行大小驗證
    if (!file) return true
    // 如果檔案存在，則檢查大小
    return !(file.size > 2 * 1024 * 1024) || '檔案大小超過 2MB'
  },
}

const authors = [
  { id: 0, name: '請選擇作者' },
  { id: 1, name: 'Author 1' },
  { id: 2, name: 'Author 2' },
  { id: 3, name: 'Author 3' },
  { id: 4, name: 'Author 4' },
  { id: 5, name: 'Author 5' },
]
const publisheds = [
  { id: 0, name: '請選擇出版社' },
  { id: 1, name: 'published 1' },
  { id: 2, name: 'published 2' },
  { id: 3, name: 'published 3' },
  { id: 4, name: 'published 4' },
  { id: 5, name: 'published 5' },
]

const fileInputRules = computed(() => {
  // 如果 imagePath 存在，則不需要 required 規則
  return selectedBook.imagePath ? [rules.fileSize] : [rules.required, rules.fileSize]
})

const previewImage = computed(() => {
  if (selectedBook.uploadedFile) {
    return selectedBook.newImagePath || defaultImage
  } else {
    if (selectedBook.imagePath) {
      return `/images/${selectedBook.imagePath}`
    } else {
      return defaultImage
    }
  }
})
function clearFile() {
  selectedBook.uploadedFile = null
  selectedBook.newImagePath = null
}

function uploadFile(file: File) {
  // 檢查檔案大小
  selectedBook.uploadedFile = file
  selectedBook.newImagePath = URL.createObjectURL(file)
}

const onFileClearOrChange = (file) => {
  if (!file) {
    // 使用者按了 X 清除
    clearFile()
    return
  } else {
    // 使用者選擇了新檔案
    uploadFile(file)
  }
}

const submitForm = async () => {
  const { valid } = await formRef.value!.validate()
  if (!valid) {
    console.log('表單驗證失敗')
    return
  } else {
    console.log('表單驗證成功')
  }
}

console.log(
  selectedBook.uploadedFile
    ? selectedBook.newImagePath || defaultImage
    : `/images/${selectedBook.imagePath}`,
)
console.log('uploadedFile', !!selectedBook.uploadedFile)
console.log('newImagePath', !!selectedBook.newImagePath)
console.log('newImagePath|| defaultImage', selectedBook.newImagePath || defaultImage)
</script>
