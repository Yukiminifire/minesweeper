<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import {
  generateGameState,
  onClick,
  onRightClick,
  dbClick,
  checkGameState,
  fireWork,
  getArounds,
  useNow,
} from './logic'
import MyFooter from './component/MyFooter.vue'
import MMineBlock from './component/MMineBlock.vue'
import { BlockState } from './component/type'
import MyMine from './component/MyMine.vue'
import MyTimer from './component/MyTimer.vue'

export default defineComponent({
  setup() {
    const gameState = ref(generateGameState(10, 10, 10))

    const gameStatus = computed(() => {
      return gameState.value.isMineGenerated
        ? checkGameState(gameState.value)
        : 'notReady'
    })

    const centerBlock = ref<null | BlockState>(null)

    const arounds = computed(() => {
      if (centerBlock.value) {
        return getArounds(gameState.value.board, centerBlock.value)
      } else {
        return []
      }
    })

    const mineRet = computed(() => {
      if (!gameState.value.isMineGenerated) return gameState.value.mineCount
      let flags = 0
      gameState.value.board.forEach((row) => {
        row.forEach((block) => {
          flags += block.flagged ? 1 : 0
        })
      })
      return gameState.value.mineCount - flags
    })

    const now = useNow()
    watch(gameStatus, async (newValue, oldValue) => {
      if (gameStatus.value === 'play') {
        now.run()
      } else {
        now.stop()
      }
      if (gameStatus.value === 'won') {
        fireWork()
      }
    })

    const deltaTime = computed(() => {
      now.now.value
      if (Number.isNaN(gameState.value.time.end)) {
        return Math.round((Date.now() - gameState.value.time.start || 0) / 1000)
      } else {
        return Math.round(
          (gameState.value.time.start - gameState.value.time.end) / 1000,
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
          break
        default:
          break
      }
    })

    return {
      gameState,
      onClick,
      onRightClick,
      dbClick,
      gameStatus,
      arounds,
      centerBlock,
      mineRet,
      deltaTime,
      barClass,
    }
  },
  components: { MyFooter, MMineBlock, MyMine, MyTimer },
})
</script>

<template>
  <div
    class="flex flex-col dark:bg-gray-900 dark:text-white min-h-screen items-center py-4"
  >
    <h1>Minesweeper</h1>
    <div class="flex gap-4 justify-center items-center py-2">
      <div :class="`flex justify-center items-center gap-1 ${barClass}`">
        <MyTimer />
        {{ deltaTime }}
      </div>
      <div :class="`flex justify-center items-center gap-1 ${barClass}`">
        <MyMine />
        {{ mineRet }}
      </div>
    </div>
    <div class="flex flex-col py-2">
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
          @mousedown="
            () => {
              centerBlock = block
            }
          "
          @mouseout="
            () => {
              centerBlock = null
            }
          "
          @mouseup="
            () => {
              centerBlock = null
            }
          "
          @contextmenu.prevent="onRightClick(block)"
          @dblclick="dbClick(gameState.board, block)"
          :gameStaus="gameStatus"
          :isInArounds="arounds.includes(block)"
        />
      </div>
    </div>
    <div :class="`flex justify-center items-center py-2 ${barClass}`">
      {{ gameStatus }}
    </div>
    <MyFooter />
  </div>
</template>
