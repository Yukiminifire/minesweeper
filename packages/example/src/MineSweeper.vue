<script lang="ts">
import { computed, defineComponent, Ref, ref, watch } from 'vue'
import {
  generateGameState,
  onClick,
  onRightClick,
  dbClick,
  checkGameState,
  fireWork,
  getArounds,
  useNow,
  RankInfo,
  cloudbase,
  getRankList,
  saveCloud,
} from './logic'
import MyFooter from './component/MyFooter.vue'
import MMineBlock from './component/MMineBlock.vue'
import { BlockState } from './component/type'
import MyMine from './component/MineICON.vue'
import MyTimer from './component/TimerICON.vue'
import { useLocalStorage } from '@vueuse/core'
import packageJSON from '../package.json'
export default defineComponent({
  setup() {
    const gameState = ref(generateGameState(9, 9, 10))

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

    const name = ref('yby')
    useLocalStorage('player-name', name)
    const rankList: Ref<RankInfo[]> = ref([])

    watch(cloudbase.status, async () => {
      rankList.value = await getRankList()
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
        await saveCloud(name.value, deltaTime.value, 'won')
        rankList.value = await getRankList()
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
      generateGameState,
      rankList,
      name,
      package: packageJSON,
    }
  },
  components: { MyFooter, MMineBlock, MyMine, MyTimer },
})
</script>

<template>
  <div
    class="flex flex-col dark:bg-gray-900 dark:text-white min-h-screen items-center py-6"
  >
    <h1>Minesweeper</h1>
    <div class="flex gap-6 justify-center items-center py-3">
      <button
        class="border border-emerald-500 bg-emerald-500 py-1 px-2 rounded items-center justify-center text-white"
        @click="
          () => {
            gameState = generateGameState(9, 9, 10)
          }
        "
      >
        Easy
      </button>
      <button
        class="border border-emerald-500 bg-emerald-500 py-1 px-2 rounded items-center justify-center text-white"
        @click="
          () => {
            gameState = generateGameState(16, 16, 40)
          }
        "
      >
        Hard
      </button>
    </div>
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
    <div class="flex flex-col py-2 select-none">
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
          @pointerdown="
            () => {
              centerBlock = block
            }
          "
          @pointerout="
            () => {
              centerBlock = null
            }
          "
          @pointerup="
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
    <div
      class="flex py-2 justify-center items-center text-gray-300 dark:text-gray-700"
    >
      version:{{ package.version }}
    </div>
    <div class="flex py-6 justify-center items-center dark:text-black">
      <input
        v-model="name"
        placeholder="please enter a nickname"
        class="px-1 py-1 text-gray-10 border rounded"
      />
    </div>
    <div
      v-for="(rank, index) in rankList"
      :key="rank.id"
      class="flex py-2 justify-center items-center"
    >
      {{ index + 1 }}、{{ rank.name }} : {{ rank.time }}--{{ rank.status }}
    </div>
  </div>
</template>
