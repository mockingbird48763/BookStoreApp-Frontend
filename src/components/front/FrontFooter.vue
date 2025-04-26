<template>
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
      <v-col class="text-center mt-4" cols="12">
        "no data" illustration by
        <a href="https://www.freepik.com" target="_blank" rel="noopener">slidesgo / Freepik</a>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
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
</script>
