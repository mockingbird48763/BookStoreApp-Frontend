<script setup lang="ts">
import { onMounted, ref } from 'vue'
interface Book {
  id: number
  title: string
  listPrice: number
  discount: number
  imagePath: string
}
const books = ref<Book[]>([])
const responseData = {
  items: [
    {
      id: 1,
      title: '我不想改善程式效能',
      listPrice: 0,
      discount: 0,
      imagePath: 'example/20000000_000000_0001.png',
    },
    {
      id: 3,
      title: '人工智慧應用實務',
      listPrice: 780,
      discount: 20,
      imagePath: 'example/20000000_000000_0003.png',
    },
    {
      id: 4,
      title: '大數據與雲端運算',
      listPrice: 850,
      discount: 18,
      imagePath: 'example/20000000_000000_0004.png',
    },
    {
      id: 5,
      title: '深度學習基礎',
      listPrice: 950,
      discount: 10,
      imagePath: 'example/20000000_000000_0005.png',
    },
    {
      id: 6,
      title: '資料結構與演算法實務',
      listPrice: 720,
      discount: 25,
      imagePath: 'example/20000000_000000_0006.png',
    },
    {
      id: 7,
      title: '軟體開發流程管理',
      listPrice: 620,
      discount: 30,
      imagePath: 'example/20000000_000000_0007.png',
    },
    {
      id: 8,
      title: '設計模式入門',
      listPrice: 680,
      discount: 22,
      imagePath: 'example/20000000_000000_0008.png',
    },
    {
      id: 9,
      title: '資料庫設計實務',
      listPrice: 590,
      discount: 18,
      imagePath: 'example/20000000_000000_0009.png',
    },
    {
      id: 10,
      title: 'C# 入門教學',
      listPrice: 520,
      discount: 10,
      imagePath: 'example/20000000_000000_0010.png',
    },
    {
      id: 11,
      title: '網頁前端開發實戰',
      listPrice: 750,
      discount: 27,
      imagePath: 'example/20000000_000000_0011.png',
    },
  ],
  totalCount: 22,
  page: 1,
  pageSize: 10,
  totalPages: 3,
}
const loading = ref(false)

const fetchBooks = async () => {
  loading.value = true
  books.value = responseData.items
  loading.value = false
}

onMounted(() => {
  fetchBooks()
})
</script>

<template>
  <template v-for="book in books" :key="book.id">
    <li>
      <p>{{ book.id }}</p>
      <p>{{ book.title }}</p>
      <p>{{ book.discount }}</p>
      <p>{{ book.listPrice }}</p>
      <p>{{ book.imagePath }}</p>
    </li>
  </template>
</template>
