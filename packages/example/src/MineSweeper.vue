<script lang="ts">
import { defineComponent, ref } from 'vue'
import { generateBoard, onClick } from './logic'
import MyFooter from './component/MyFooter.vue'
import MMineBlock from './component/MMineBlock.vue'

export default defineComponent({
  setup() {
    const myBoard = ref(generateBoard(10, 10))
    return {
      myBoard,
      onClick,
    }
  },
  components: { MyFooter, MMineBlock },
})
</script>

<template>
  <div
    class="flex flex-col dark:bg-gray-900 dark:text-white min-h-screen items-center py-4"
  >
    <h1>Minesweeper</h1>
    <div class="flex flex-col py-3">
      <div v-for="(row, y) in myBoard" :key="y">
        <MMineBlock v-for="(block, x) in row" :key="x" :block="block" />
      </div>
    </div>
    <MyFooter />
  </div>
</template>
