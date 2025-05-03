<template>
  <v-container class="pa-0">
    <v-card class="pa-4">
      <!-- 卡片標題 -->
      <v-card-title class="text-h6">過濾器</v-card-title>
      <!-- 分隔線 -->
      <v-divider class="mb-4" />
      <!-- 表單欄位 -->
      <!-- dense 讓 v-col 上下間距縮小 -->
      <v-row dense>
        <v-col cols="6" sm="4">
          <v-select
            v-model="bookFilter.authorId"
            :items="authors"
            item-title="name"
            item-value="id"
            label="作者"
          ></v-select>
        </v-col>

        <v-col cols="6" sm="4">
          <v-select
            v-model="bookFilter.publisherId"
            :items="publishers"
            item-title="name"
            item-value="id"
            label="出版社"
          ></v-select>
        </v-col>

        <v-col cols="6" sm="4">
          <v-text-field label="關鍵字" v-model="bookFilter.keyword" />
        </v-col>
      </v-row>

      <v-row class="mt-2">
        <!-- 左側按鈕 -->
        <v-col cols="12" sm="6">
          <v-btn color="primary" class="mr-2" @click="handleSerach()">搜尋</v-btn>
          <v-btn color="error" @click="handleReset()">重置</v-btn>
        </v-col>

        <!-- 右側按鈕 -->
        <v-col cols="12" sm="6" class="d-flex justify-end">
          <v-btn color="blue" class="mr-2" @click="handleBatchVisibilityChange()"
            >批量修改可見度</v-btn
          >
          <v-btn color="success" @click="openCreateDialog()">新增書籍</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
  <v-container
    class="d-flex flex-column align-center justify-start pa-0 pt-4"
    style="min-height: 100vh"
  >
    <v-table
      height="auto"
      fixed-header
      class="elevation-1"
      style="width: 100%; background-color: white; border-radius: 12px; overflow: hidden"
    >
      <thead class="orders-table-header">
        <tr>
          <th
            v-for="(thead, index) in theads"
            :key="index"
            class="text-center"
            :style="index === 0 ? 'width: 120px' : ''"
          >
            {{ thead }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- 如果為空，顯示一張圖片，並合併所有欄位 -->
        <tr v-if="items.length === 0">
          <td :colspan="theads.length" class="text-center">
            <v-img :src="noDataUrl" width="300" height="300" contain class="mx-auto"></v-img>
            <div class="mb-4">查無結果</div>
          </td>
        </tr>
        <!-- 如果有內容，顯示正常內容 -->
        <tr
          v-for="(item, id) in items"
          :key="id"
          class="text-center cursor-pointer"
          @click="openEditDialog(item.id)"
        >
          <td>{{ item.id }}</td>
          <td style="width: 232px">
            <v-img
              v-if="item.imagePath"
              :src="`/images/${item.imagePath}`"
              width="128"
              height="128"
              contain
              class="mx-auto"
            ></v-img>
          </td>
          <td style="width: 232px">{{ item.title }}</td>
          <td class="font-weight-medium">${{ item.listPrice.toLocaleString() }}</td>
          <td>
            <v-chip
              :color="getDiscountColor(item.discount)"
              class="text-white font-weight-bold"
              small
              label
            >
              {{ item.discount }}折
            </v-chip>
          </td>
          <td>
            <v-chip color="pink lighten-4" text-color="red darken-2" small>
              {{ item.unitPrice }}
            </v-chip>
          </td>
          <td>
            <v-chip :color="item.stock > 0 ? 'success' : 'error'" text-color="white">
              {{ item.stock > 0 ? `有貨 (${item.stock})` : '無貨' }}
            </v-chip>
          </td>
          <td @click.stop="toggleVisibility(item)" class="text-xl">
            <v-icon :color="item.isVisible ? 'green' : 'grey'" size="28">
              {{ item.isVisible ? 'mdi-eye' : 'mdi-eye-off' }}
            </v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-pagination
      v-model="currentPage"
      :length="totalPages"
      circle
      class="mt-4"
      @update:model-value="handlePageChange"
      :total-visible="10"
    ></v-pagination>
    <!-- vue 3.4 語法糖，可以省略與鍵名相同的值 :authors="authors" => :authors -->
    <BookFormDialog
      v-model:visible="showModel"
      :is-edit="isEdit"
      :authors
      :publishers
      :selected-book
      @submit-form="handleSubmit"
    ></BookFormDialog>
  </v-container>
</template>

<script setup lang="ts">
import type { BookForManagementSummary } from '@/api/types'
import noDataUrl from '@/assets/no-data.svg'
import BookFormDialog from '@/components/back/BookFormDialog.vue'
import { useBookStore } from '@/stores'
import { scrollToTop } from '@/utils/ScrollUtils'
import { computed, onMounted, reactive, ref } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
import { useGlobalLoading } from '@/composables/useGlobalLoading'
export interface SelectedBook {
  isbn: string
  title: string
  description: string
  listPrice: number
  discount: number
  stock: number
  publicationDate: string
  authorId: number | undefined
  publisherId: number | undefined
  imagePath: string
  newImagePath: string
  uploadedFile: File | null
}

const theads = ['書籍編號', '商品圖片', '商品名稱', '售價', '折扣', '優惠價', '庫存', '顯示狀態']
const bookStore = useBookStore()
const snackbar = useSnackbar()
const { startLoading, stopLoading } = useGlobalLoading()
const {
  getAuthors,
  getPublishers,
  getBooksForManagement,
  updateVisibilityBatch,
  getBookDetail,
  createBook,
  updateBook,
  setKeyword,
} = bookStore
const authors = computed(() => bookStore.authors)
const publishers = computed(() => bookStore.publishers)
const items = computed(() => bookStore.booksForManagement)
const currentPage = ref(bookStore.pagination.page)
const totalPages = computed(() => bookStore.pagination.totalPages)
const newBook = {
  isbn: '',
  title: '',
  description: '',
  listPrice: 0,
  discount: 0,
  stock: 0,
  publicationDate: '',
  authorId: undefined,
  publisherId: undefined,
  imagePath: '',
  newImagePath: '',
  uploadedFile: null,
}
const selectedBook = reactive<SelectedBook>({ ...newBook })
const bookDetail = computed(() => bookStore.bookDetail)

// 過濾器
const bookFilter = ref({
  authorId: undefined,
  publisherId: undefined,
  keyword: undefined,
})

// dialog
const showModel = ref(false)
const isEdit = ref(false)

// 可見度匹量修改追蹤
const modifiedItems = ref<{ bookId: number; isVisible: boolean }[]>([])

// 眼睛圖示的顯示狀態
const toggleVisibility = (item: BookForManagementSummary) => {
  item.isVisible = !item.isVisible
  trackChange(item.id, item.isVisible)
}

// 追蹤修改的項目
const trackChange = (id: number, isVisible: boolean) => {
  const index = modifiedItems.value.findIndex((item) => item.bookId === id)
  if (index === -1) {
    // 不存在就加入
    modifiedItems.value.push({ bookId: id, isVisible: isVisible })
  } else {
    // 存在就移除
    modifiedItems.value.splice(index, 1)
  }
}

// 開啟新增書籍的 dialog
function openCreateDialog() {
  isEdit.value = false
  Object.assign(selectedBook, newBook)
  showModel.value = true
}

// 開啟編輯書籍的 dialog
async function openEditDialog(id: number) {
  startLoading()
  isEdit.value = true
  Object.assign(selectedBook, newBook)
  await getBookDetail(id)
  assignExistingKeys(selectedBook, bookDetail.value!)
  showModel.value = true
  stopLoading()
}

// 提交表單（新增或更新）
async function handleSubmit() {
  startLoading()
  const formData = new FormData()
  if (!isEdit.value) {
    createBookFormData(formData)
    try {
      await createBook(formData)
      snackbar.show('新增書籍成功', 'success', 3000)
      showModel.value = false
      await getBooksForManagement({ page: 1 })
    } catch (err) {
      const error = err as { response?: { data?: { errors?: string[] } } }
      const reason = error.response?.data?.errors?.[0]
      if ('ISBN already exists.' == reason) {
        snackbar.show('新增書籍失敗: ISBN 已存在', 'error', 3000)
      } else {
        snackbar.show('新增書籍失敗: 未知原因', 'error', 3000)
      }
    }
  } else {
    const originalBook = { ...bookDetail.value }
    let hasBeenModified = false
    Object.entries(selectedBook).forEach(([key, value]) => {
      if (value !== originalBook[key as keyof typeof originalBook] && value != null) {
        if (key !== 'newImagePath') {
          hasBeenModified = true
          formData.append(key, String(value))
          console.log(key, value)
        }
      }
    })

    if (selectedBook.uploadedFile) {
      formData.append('uploadedImage', selectedBook.uploadedFile)
    }

    try {
      if (!hasBeenModified) {
        snackbar.show('沒有任何變更', 'info', 3000)
        return
      }
      await updateBook(bookDetail.value!.id, formData)
      snackbar.show('編輯書籍成功', 'success', 3000)
      showModel.value = false
      await getBooksForManagement({ page: 1 })
    } catch (err) {
      const error = err as { response?: { data?: { errors?: string[] } } }
      const reason = error.response?.data?.errors?.[0]
      if ('ISBN already exists.' == reason) {
        snackbar.show('編輯書籍失敗: ISBN 已存在', 'error', 3000)
      } else {
        snackbar.show('編輯書籍失敗: 未知原因', 'error', 3000)
      }
    }
  }
  stopLoading()
}
const createBookFormData = (formData: FormData) => {
  formData.append('isbn', selectedBook.isbn)
  formData.append('title', selectedBook.title)
  formData.append('description', selectedBook.description)
  formData.append('listPrice', selectedBook.listPrice.toString())
  formData.append('discount', selectedBook.discount.toString())
  formData.append('stock', selectedBook.stock.toString())
  formData.append('publicationDate', selectedBook.publicationDate)
  formData.append('authorId', selectedBook.authorId!.toString())
  formData.append('publisherId', selectedBook.publisherId!.toString())
  formData.append('uploadedImage', selectedBook.uploadedFile as Blob)
}

const getDiscountColor = (discount: number): string => {
  const discountPercent = 100 - discount
  if (discountPercent >= 35) return 'red darken-2' // 65折以下
  if (discountPercent >= 25) return 'orange darken-2' // 75~66折
  if (discountPercent >= 15) return 'green darken-2' // 85~76折
  return 'blue darken-2' // 86折以上
}

const handleReset = () => {
  bookFilter.value = {
    authorId: undefined,
    publisherId: undefined,
    keyword: undefined,
  }
}

const handleSerach = async () => {
  startLoading()
  await getBooksForManagement({
    page: 1,
    ...bookFilter.value,
  })
  scrollToTop()
  stopLoading()
}

const handlePageChange = async (newPage: number) => {
  startLoading()
  await getBooksForManagement({ page: newPage })
  scrollToTop()
  stopLoading()
}

const handleBatchVisibilityChange = async () => {
  startLoading()
  const length = modifiedItems.value.length
  if (length <= 0) {
    snackbar.show('請選擇要修改的書籍', 'error')
    return
  }
  try {
    await updateVisibilityBatch(modifiedItems.value)
    modifiedItems.value = []
    snackbar.show(`修改 ${length} 筆成功`, 'success', 1000)
  } catch {
    snackbar.show('修改失敗', 'error', 1000)
  }
  stopLoading()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function assignExistingKeys<T extends object>(target: T, source: Record<string, any>) {
  Object.keys(target).forEach((key) => {
    if (key in source) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(target as any)[key] = source[key]
    }
  })
}

onMounted(async () => {
  startLoading()
  await getAuthors()
  await getPublishers()
  currentPage.value = 1
  setKeyword('')
  await getBooksForManagement({ page: 1 })
  stopLoading()
})
</script>

<style scoped>
.v-table thead {
  background-color: #bbdefb;
}

.v-table th,
.v-table td {
  border-bottom: 1px solid #dbe4f0;
  padding: 12px;
  color: #1e3a8a;
  font-weight: 500;
  font-size: 15px;
}

.v-table th {
  font-weight: 700;
  font-size: 16px;
}

.v-table tbody tr:hover {
  background-color: #eef6fc;
}

.v-table.v-table--fixed-header > .v-table__wrapper > table > thead.orders-table-header > tr > th {
  background-color: #e4e4e4;
  color: #2a2a2a;
}
</style>
