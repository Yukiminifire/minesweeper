<script lang="ts">
import { defineComponent, ref } from 'vue'
import { generateBoard } from './logic'
import MyFooter from './component/MyFooter.vue'
import MyMineBlock from './component/MyMineBlock.vue'

export default defineComponent({
  setup() {
    const myBoard = ref(generateBoard(10, 10))
    return {
      myBoard,
    }
  },
  components: { MyFooter, MyMineBlock },
})
</script>

<template>
  <div
    class="flex flex-col items-center dark:bg-gray-900 dark:text-white min-h-screen"
  >
    <h1>Minesweeper</h1>
    <div class="flex py-3">
      <div v-for="(row, y) in myBoard" :key="y">
        <MyMineBlock v-for="(block, x) in row" :key="x" :block="block" />
      </div>
    </div>
    <MyFooter />
  </div>
</template>
