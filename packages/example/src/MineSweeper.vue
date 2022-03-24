<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import MyMineBlock from './component/MyMineBlock.vue'
import Footer from './component/Footer.vue'
import {
  onRightClick,
  onClick,
  onDbClick,
  gennerateGameState,
  checkGameStatus,
} from './logic'

export default defineComponent({
  setup() {
    const gameState = ref(gennerateGameState(10, 10, 3))

    const gameStatus = computed(() => {
      return checkGameStatus(gameState.value)
    })

    return {
      gameState,
      onRightClick,
      onClick,
      onDbClick,
      gameStatus,
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
          @contextmenu.prevent="
            () => {
              if (gameStatus === 'play') {
                onRightClick(gameState, block)
              }
            }
          "
          @click="
            () => {
              if (gameStatus === 'play') {
                onClick(gameState, block)
              }
            }
          "
          @dblclick="
            () => {
              if (gameStatus === 'play') {
                onDbClick(gameState, block)
              }
            }
          "
        />
      </div>
    </div>
    {{ gameStatus }}
    <Footer />
  </div>
</template>
