<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue'
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

    watchEffect(() => {
      if (gameStatus.value !== 'play') {
        gameState.value.time.end = Date.now()
      }
    })

    const now = ref(0)

    function updateNow() {
      console.log(gameStatus.value)
      now.value++
      setTimeout(() => {
        updateNow()
      }, 1000)
    }

    // watch(gameStatus, (newValue, oldValue) => {
    //   if (gameStatus.value === 'play') {
    //     }
    // })
    updateNow()

    const deltaTime = computed(() => {
      if (Number.isNaN(gameState.value.time.end)) {
        now.value
        return Math.round((Date.now() - gameState.value.time.start || 0) / 1000)
      } else {
        return Math.round(
          (gameState.value.time.end - gameState.value.time.start) / 1000,
        )
      }
    })

    return {
      gameState,
      onRightClick,
      onClick,
      onDbClick,
      gameStatus,
      deltaTime,
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
    <div>
      {{ deltaTime }}
    </div>
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
