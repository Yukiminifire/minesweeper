<script lang="ts">
import { defineComponent, ref } from 'vue'
import MyMineBlock from './component/MyMineBlock.vue'
import Footer from './component/Footer.vue'
import { onRightClick, onClick, onDbClick, gennerateGameState } from './logic'

export default defineComponent({
  setup() {
    const gameState = ref(gennerateGameState(10, 10, 10))

    return {
      gameState,
      onRightClick,
      onClick,
      onDbClick,
    }
  },
  components: { MyMineBlock, Footer },
})
</script>

<template>
  <div
    class="flex flex-col dark:bg-gray-900 h-screen items-center dark:text-white py-4"
  >
    <h1>Minesweeper</h1>

    <div class="flex py-3">
      <div v-for="(row, y) in gameState.board" :key="y">
        <MyMineBlock
          v-for="(block, x) in row"
          :key="x"
          :block="block"
          @contextmenu.prevent="onRightClick(gameState, block)"
          @click="onClick(gameState, block)"
          @dblclick="onDbClick(gameState, block)"
        />
      </div>
    </div>
    <Footer />
  </div>
</template>
