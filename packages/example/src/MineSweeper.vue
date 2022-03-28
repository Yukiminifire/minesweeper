<script lang="ts">
import { defineComponent, ref } from 'vue'
import { generateBoard } from './logic'

export default defineComponent({
  setup() {
    const myBoard = ref(generateBoard(10, 10))

    return {
      myBoard,
    }
  },
})
</script>

<template>
  <div class="flex flex-col items-center bg-gray-900 text-white min-h-screen">
    <h1>Minesweeper</h1>
    <div class="flex py-3">
      <div v-for="(row, y) in myBoard" :key="y">
        <div v-for="(block, x) in row" :key="x">
          <button class="w-10 h-10 border dark: bg-gray-500 m-0.2">
            {{ 0 }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
