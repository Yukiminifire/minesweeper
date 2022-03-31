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
} from './logic'
import MyFooter from './component/MyFooter.vue'
import MMineBlock from './component/MMineBlock.vue'
import { BlockState } from './component/type'

export default defineComponent({
  setup() {
    const gameState = ref(generateGameState(10, 10, 10))

    const gameStatus = computed(() => {
      return gameState.value.isMineGenerated
        ? checkGameState(gameState.value)
        : 'notReady'
    })

    watch(gameStatus, async (newValue, oldValue) => {
      if (gameStatus.value === 'won') {
        fireWork()
      }
    })

    const centerBlock = ref<null | BlockState>(null)

    const arounds = computed(() => {
      if (centerBlock.value) {
        return getArounds(gameState.value.board, centerBlock.value)
      } else {
        return []
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
    {{ gameStatus }}
    <MyFooter />
  </div>
</template>
