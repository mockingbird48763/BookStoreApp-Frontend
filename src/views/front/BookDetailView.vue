<template>
  <template>
    <v-container>
      <v-row>
        <v-col cols="12" md="4">
          <!-- 書籍圖片 -->
          <v-img :src="book.imagePath" alt="Book Image" height="200px" contain></v-img>
        </v-col>
        <v-col cols="12" md="8">
          <!-- 書籍詳情 -->
          <v-card>
            <v-card-title>
              <span class="headline">{{ book.title }}</span>
            </v-card-title>
            <v-card-subtitle>
              <span class="caption">作者: {{ book.authorName }}</span>
            </v-card-subtitle>
            <v-card-text>
              <p>{{ book.description }}</p>
              <v-divider></v-divider>
              <div>
                定價: ${{ book.listPrice }}
                <span v-if="book.discount > 0">折扣: {{ book.discount }}%</span>
              </div>
              <div>庫存: {{ book.stock }} 本</div>
              <div>出版日期: {{ book.publicationDate }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="orderBook">訂購</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
</template>

<script setup lang="ts">
// route.id
defineProps<{ id: string }>()
const book = {
  id: 1,
  isbn: '978-1-234567-910',
  title: '我不想改善程式效能',
  description:
    '本書介紹開放原始碼軟體的基本概念與優勢，並探討常見的開放原始碼工具，如 Git、Linux、Apache 等，適合對開放原始碼有興趣的讀者。',
  listPrice: 0,
  discount: 0,
  stock: 0,
  publicationDate: '0001-01-01',
  imagePath: 'example/20000000_000000_0001.png',
  authorId: 1,
  authorName: '張天宇',
  publisherId: 1,
  publisherName: '智慧之光',
}
const orderBook = () => {
  // 訂購邏輯暫時未實作
  console.log('訂購按鈕被點擊')
}
</script>

<style scoped></style>
