<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import MyMineBlock from './component/MyMineBlock.vue'
import Footer from './component/Footer.vue'
import {
  onRightClick,
  onClick,
  onDbClick,
  gennerateGameState,
  checkGameStatus,
  useNow,
} from './logic'
import Timer from './component/Timer.vue'
import Mmines from './component/Mmines.vue'

export default defineComponent({
  setup() {
    const gameState = ref(gennerateGameState(10, 10, 3))
    const mineRet = computed(() => {
      if (!gameState.value.mineGenerated) return gameState.value.mineCount

      const flags = gameState.value.board.reduce((rSum, i) => {
        return (
          rSum +
          i.reduce((bsum, i) => {
            return bsum + (i.flagged ? 1 : 0)
          }, 0)
        )
      }, 0)

      return gameState.value.mineCount - flags
    })

    const gameStatus = computed(() => {
      return gameState.value.mineGenerated
        ? checkGameStatus(gameState.value)
        : 'notReady'
    })

    const isGameOver = computed(() => {
      if (gameStatus.value === 'lost' || gameStatus.value === 'won') {
        return true
      }
    })

    watch(isGameOver, () => {
      if (isGameOver.value && !gameState.value.time.end) {
        gameState.value.time.end = Date.now()
      }
    })

    const now = useNow()

    watch(gameStatus, (newValue, oldValue) => {
      if (gameStatus.value === 'play') {
        now.run()
      } else {
        now.stop()
      }
    })

    const deltaTime = computed(() => {
      console.log('deltaTime')
      now.now.value
      if (Number.isNaN(gameState.value.time.end)) {
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
      gennerateGameState,
      mineRet,
    }
  },
  components: { MyMineBlock, Footer, Timer, Mmines },
})
</script>

<template>
  <div
    class="flex flex-col dark:bg-gray-900 h-screen items-center dark:text-white py-4"
  >
    <h1>Minesweeper</h1>
    <div class="flex gap-2 my-3 justify-center items-center">
      <button
        @click="
          () => {
            gameState = gennerateGameState(9, 9, 10)
          }
        "
        class="flex border-teal-400 px-3 rounded bg-teal-400 py-2 justify-center items-center"
      >
        Easy
      </button>
      <button
        @click="
          () => {
            gameState = gennerateGameState(16, 16, 40)
          }
        "
        class="flex border-teal-400 px-3 rounded bg-teal-400 py-2 justify-center items-center"
      >
        Medium
      </button>
      <button
        @click="
          () => {
            gameState = gennerateGameState(30, 16, 99)
          }
        "
        class="flex border-teal-400 px-3 rounded bg-teal-400 py-2 justify-center items-center"
      >
        Hard
      </button>
    </div>
    <div class="flex gap-6 justify-center items-center text-xl">
      <div
        :class="`flex gap-2 justify-center items-center ${
          gameStatus === 'notReady' ? 'text-gray-500' : ''
        }`"
      >
        <Timer />
        {{ deltaTime }}
      </div>
      <div class="flex gap-1 justify-center items-center">
        <Mmines />
        {{ mineRet }}
      </div>
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
              if (gameStatus === 'play' || gameStatus === 'notReady') {
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
