import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('searchStore', () => {
  const keyword = ref('')

  const getKeyword = () => keyword.value

  const setKeyword = (val: string) => {
    keyword.value = val
  }

  const clearKeyword = () => {
    keyword.value = ''
  }

  return {
    keyword,
    getKeyword,
    setKeyword,
    clearKeyword,
  }
})
