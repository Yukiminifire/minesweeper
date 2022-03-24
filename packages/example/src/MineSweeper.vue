<script lang="ts">
import { defineComponent, ref } from 'vue'
import { generateBoard } from './logic'
import MineBlock from './component/MineBlock.vue'
import Footer from './component/Footer.vue'
import { onRightClick } from './logic'
import { onClick } from './logic'

export default defineComponent({
  setup() {
    const board = ref(generateBoard(10, 10))
    return {
      board,
      onRightClick,
      onClick,
    }
  },
  components: { MineBlock, Footer },
})
</script>

<template>
  <div
    class="flex flex-col dark:bg-gray-900 h-screen items-center dark:text-white py-4"
  >
    <h1>Minesweeper</h1>

    <div class="flex py-3">
      <div v-for="(row, y) in board" :key="y">
        <MineBlock
          v-for="(block, x) in row"
          :key="x"
          :block="block"
          @contextmenu.prevent="onRightClick(board, block)"
          @click="onClick(board, block)"
        />
      </div>
    </div>
    <Footer />
  </div>
</template>
