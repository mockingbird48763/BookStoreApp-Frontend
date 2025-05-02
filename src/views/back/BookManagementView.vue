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
    <BookFormDialog v-model:visible="showModel" :is-edit="isEdit"></BookFormDialog>
  </v-container>
</template>

<script setup lang="ts">
import type { BookForManagementSummary } from '@/api/types'
import noDataUrl from '@/assets/no-data.svg'
import BookFormDialog from '@/components/back/BookFormDialog.vue'
import { useBookStore } from '@/stores'
import { scrollToTop } from '@/utils/ScrollUtils'
import { computed, onMounted, ref } from 'vue'
import { useSnackbar } from '@/composables/useSnackbar'
const theads = ['書籍編號', '商品圖片', '商品名稱', '售價', '折扣', '優惠價', '庫存', '顯示狀態']

const bookStore = useBookStore()
const snackbar = useSnackbar()
const { getAuthors, getPublishers, getBooksForManagement, updateVisibilityBatch } = bookStore
const authors = computed(() => bookStore.authors)
const publishers = computed(() => bookStore.publishers)
const items = computed(() => bookStore.booksForManagement)
const currentPage = computed(() => bookStore.pagination.page)
const totalPages = computed(() => bookStore.pagination.totalPages)

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
  isEdit.value = false // 新增時，isEdit 設定為 false 可以用 slectedBook 判斷
  // selectedBook.value = null // 新增時，選擇的書籍為 null
  showModel.value = true
}

// 開啟編輯書籍的 dialog
async function openEditDialog(id: number) {
  isEdit.value = true // 編輯時，isEdit 設定為 true
  // const res = await fetch(`/api/books/${book.id}`)
  // const fullBook = await res.json()
  // selectedBook.value = fullBook // 設定為選中的書籍資料
  showModel.value = true
}

// 提交表單（新增或更新）
async function handleSubmit(bookData) {
  // const formData = new FormData()
  // // 將所有表單欄位資料加入 FormData
  // for (const key in bookData) {
  //   if (bookData[key] !== null && key !== 'uploadedImage') {
  //     formData.append(key, bookData[key])
  //   }
  // }
  // // 如果有上傳圖片，將圖片附加到 FormData
  // if (bookData.uploadedImage) {
  //   formData.append('UploadedImage', bookData.uploadedImage)
  // }
  // // 新增書籍（POST）或編輯書籍（PUT）
  // if (bookData.id) {
  //   await fetch(`/api/books/${bookData.id}`, {
  //     method: 'PUT',
  //     body: formData,
  //   })
  // } else {
  //   await fetch(`/api/books`, {
  //     method: 'POST',
  //     body: formData,
  //   })
  // }
  // // 關閉 dialog 並更新書籍列表
  // dialogVisible.value = false
  // // 可在這裡重新獲取書籍列表，或者更新現有的 books 陣列
}

const getDiscountColor = (discount: number): string => {
  const discountPercent = 100 - discount
  if (discountPercent >= 35) return 'red darken-2' // 65折以下
  if (discountPercent >= 25) return 'orange darken-2' // 75~66折
  if (discountPercent >= 15) return 'yellow darken-2' // 85~76折
  return 'green darken-2' // 86折以上
}

const handleReset = () => {
  bookFilter.value = {
    authorId: undefined,
    publisherId: undefined,
    keyword: undefined,
  }
}

const handleSerach = async () => {
  await getBooksForManagement({
    page: 1,
    ...bookFilter.value,
  })
  scrollToTop()
}

const handlePageChange = async (newPage: number) => {
  await getBooksForManagement({ page: newPage })
  scrollToTop()
}

const handleBatchVisibilityChange = async () => {
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
}

onMounted(async () => {
  await getAuthors()
  await getPublishers()
  await getBooksForManagement()
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
