<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from 'vue'
import MyMineBlock from './component/MyMineBlock.vue'
import Footer from './component/Footer.vue'
import {
  onRightClick,
  onClick,
  onDbClick,
  gennerateGameState,
  checkGameStatus,
  useNow,
  getArounds,
  fireWork,
  saveToCloud,
  getRankList,
  RankInfo,
  cloudbase,
} from './logic'
import Timer from './component/Timer.vue'
import Mmines from './component/Mmines.vue'
import { BlockState } from './component/type'

export default defineComponent({
  setup() {
    const gameState = ref(gennerateGameState(9, 9, 3))
    const mineRet = computed(() => {
      if (!gameState.value.mineGenerated) return gameState.value.mineCount
      let flags = 0
      gameState.value.board.forEach((row) => {
        row.forEach((block) => {
          flags += block.flagged ? 1 : 0
        })
      })
      return gameState.value.mineCount - flags
    })

    const centerBlock = ref<null | BlockState>(null)

    const arounds = computed(() => {
      if (centerBlock.value) {
        return getArounds(gameState.value.board, centerBlock.value)
      } else {
        return []
      }
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

    const name = ref('yby')
    const rankList: Ref<RankInfo[]> = ref([])

    watch(cloudbase.status, async () => {
      rankList.value = await getRankList()
    })

    watch(gameStatus, async (newValue, oldValue) => {
      if (gameStatus.value === 'play') {
        now.run()
      } else {
        now.stop()
      }

      if (gameStatus.value === 'won') {
        fireWork()
        await saveToCloud(name.value, deltaTime.value)
        rankList.value = await getRankList()
      }
    })

    const deltaTime = computed(() => {
      now.now.value
      if (Number.isNaN(gameState.value.time.end)) {
        return Math.round((Date.now() - gameState.value.time.start || 0) / 1000)
      } else {
        return Math.round(
          (gameState.value.time.end - gameState.value.time.start) / 1000,
        )
      }
    })

    const barClass = computed(() => {
      switch (gameStatus.value) {
        case 'notReady':
          return 'text-gray-500'
          break
        case 'lost':
          return 'text-red-500'
          break
        case 'play':
          return ''

          break
        case 'won':
          return 'text-green-500'
        default:
          break
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
      barClass,
      centerBlock,
      arounds,
      rankList,
    }
  },
  components: { MyMineBlock, Footer, Timer, Mmines },
})
</script>

<template>
  <div
    class="flex flex-col dark:bg-gray-900 min-h-screen items-center dark:text-white py-4"
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
      <!-- <button
        @click="
          () => {
            gameState = gennerateGameState(30, 16, 99)
          }
        "
        class="flex border-teal-400 px-3 rounded bg-teal-400 py-2 justify-center items-center"
      >
        Hard
      </button> -->
    </div>
    <div class="flex gap-6 justify-center items-center text-xl">
      <div :class="`flex gap-2 justify-center items-center ${barClass}`">
        <Timer />
        {{ deltaTime }}
      </div>
      <div :class="`flex gap-2 justify-center items-center ${barClass}`">
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
          @mousedown="
            () => {
              if (gameStatus === 'play') {
                centerBlock = block
              }
            }
          "
          @mouseup="
            () => {
              if (gameStatus === 'play') {
                centerBlock = null
              }
            }
          "
          @mouseleave="
            () => {
              if (gameStatus === 'play') {
                centerBlock = null
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
          :is-in-arounds="arounds.includes(block)"
        />
      </div>
    </div>
    {{ gameStatus }}
    <Footer />
    <div v-for="(rank, index) in rankList" :key="rank.id">
      {{ index + 1 }}. {{ rank.name }}: {{ rank.time }}
    </div>
  </div>
</template>
