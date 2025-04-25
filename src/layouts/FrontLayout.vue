<template>
  <v-app-bar class="px-1">
    <v-app-bar-nav-icon icon="mdi-home"></v-app-bar-nav-icon>
    <v-app-bar-title>BookStore</v-app-bar-title>

    <!-- 縱軸置中 -->
    <div class="d-flex align-center" style="flex: 1; justify-content: center">
      <v-text-field
        prepend-icon="mdi-magnify"
        density="compact"
        single-line
        hide-details
        flat
        variant="solo-filled"
        style="max-width: 800px; width: 100%"
      />
    </div>

    <v-spacer></v-spacer>

    <v-btn class="mx-3" icon="mdi-cart-outline"></v-btn>
    <v-menu min-width="200px" rounded>
      <template v-slot:activator="{ props }">
        <v-btn icon v-bind="props">
          <v-avatar color="brown" size="large">
            <span class="text-h5">{{ user.initials }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avatar color="brown">
              <span class="text-h5">{{ user.initials }}</span>
            </v-avatar>
            <h3>{{ user.fullName }}</h3>
            <p class="text-caption mt-1">
              {{ user.email }}
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn rounded variant="text"> Edit Account </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn rounded variant="text"> Disconnect </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-app-bar>
  <v-main>
    <v-container fluid>
      <v-row>
        <v-col v-for="book in books.items" :key="book.id" cols="12" sm="4" md="3" lg="2">
          <v-card class="mx-auto" max-width="300">
            <div class="position-relative">
              <v-img :src="`/images/${book.imagePath}`" height="400" class="rounded-t" cover />

              <!-- 🔖 斜角標籤 -->
              <div class="discount-ribbon">{{ Math.round(book.discount) }} 折</div>
            </div>

            <v-card-text>
              <div class="text-subtitle-1 font-weight-medium">
                {{ book.title }}
              </div>
              <div class="text-caption text-grey mt-1">
                原價：<s>{{ book.listPrice }} 元</s>
              </div>
              <div class="text-body-1 text-primary font-weight-bold">
                售價：{{ Math.round(book.listPrice * book.discount) }} 元
              </div>
            </v-card-text>

            <!-- 調整 v-card-actions 使按鈕靠右 -->
            <v-card-actions class="d-flex justify-end">
              <v-btn color="primary" @click="buyBook(book)" small> 購買 </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <!-- 分頁 -->
      <v-pagination
        v-model="page"
        :length="totalPages"
        circle
        class="mt-4"
        @input="fetchPaginatedBooks"
        :total-visible="10"
      ></v-pagination>
    </v-container>
  </v-main>
  <v-footer rounded class="bg-grey-lighten-1">
    <v-row justify="center" no-gutters>
      <v-btn color="white" variant="text" class="mx-2" rounded="xl" to="/index">Home</v-btn>
      <v-btn color="white" variant="text" class="mx-2" rounded="xl" to="/resume">Resume</v-btn>
      <v-btn color="white" variant="text" class="mx-2" rounded="xl" to="/about">About Me</v-btn>
      <v-btn color="white" variant="text" class="mx-2" rounded="xl" to="/contact">Contact Me</v-btn>

      <v-col class="text-center mt-4" cols="12">
        <v-btn
          v-for="media in socialMedias"
          :key="media.link"
          class="mx-4"
          :icon="media.icon"
          :href="media.link"
          variant="text"
        ></v-btn>
      </v-col>

      <v-col class="text-center mt-4" cols="12">
        <strong>版權聲明</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { reactive } from 'vue'
const user = {
  initials: 'JD',
  fullName: 'John Doe',
  email: 'john.doe@doe.com',
}

const page = 1 // 當前頁碼
const totalPages = 1000 // 總頁數

const socialMedias = reactive([
  {
    icon: 'mdi-facebook',
    link: 'https://www.facebook.com/',
  },
  {
    icon: 'mdi-twitter',
    link: 'https://twitter.com/',
  },
  {
    icon: 'mdi-linkedin',
    link: 'https://www.linkedin.com/',
  },
  {
    icon: 'mdi-instagram',
    link: 'https://www.instagram.com/',
  },
])

const books = {
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
</script>

<style scoped>
.discount-ribbon {
  position: absolute;
  top: 12px;
  left: -40px;
  background-color: #e53935; /* 紅色 */
  color: white;
  padding: 4px 50px;
  font-weight: bold;
  font-size: 0.75rem;
  transform: rotate(-45deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  z-index: 1;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;
  cursor: pointer;
}

/* 👇 Hover 效果來啦！ */
.discount-ribbon:hover {
  transform: rotate(-45deg) scale(1.1);
  filter: brightness(1.2);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}

.v-card:hover {
  transform: scale(1.05); /* 放大卡片 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); /* 添加陰影 */
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
</style>
