<script lang="ts">
import { defineComponent, ref } from 'vue'
import { generateGameState, onClick, onRightClick, dbClick } from './logic'
import MyFooter from './component/MyFooter.vue'
import MMineBlock from './component/MMineBlock.vue'

export default defineComponent({
  setup() {
    const gameState = ref(generateGameState(10, 10, 10))
    return {
      gameState,
      onClick,
      onRightClick,
      dbClick,
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
      <div
        v-for="(row, y) in gameState.board"
        :key="y"
        class="flex justify-center items-center"
      >
        <MMineBlock
          v-for="(block, x) in row"
          :key="x"
          :block="block"
          @click="onClick(gameState, block)"
          @contextmenu.prevent="onRightClick(block)"
          @dblclick="dbClick(gameState.board, block)"
        />
      </div>
    </div>
    <MyFooter />
  </div>
</template>
