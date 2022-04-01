<script setup lang="ts">
import { BlockState } from './type'
import { GameStatus } from '../logic'
import MyFlag from './FlagICON.vue'
import MyMine from './MineICON.vue'
import { isDev } from './storage/index'
defineProps<{
  block: BlockState
  gameStaus: GameStatus | 'notReady'
  isInArounds: boolean
}>()

const numberColors = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-yellow-500',
  'tect-orange-500',
  'tect-red-500',
  'tect-purple-500',
  'tect-pink-500',
  'tect-teal-500',
]

function getblockClass(block: BlockState) {
  if (!block.revealed) {
    return 'bg-gray-500/30 hover:bg-gray-400'
  }
  return block.isMine ? 'bg-red-500' : numberColors[block.adjacentMine]
}
</script>
<template>
  <button
    :class="`
    flex   
      w-8
      h-8 
      m-0.2 
      border
      border-gray-500/70
      rounded-sm
      justify-center 
      items-center
      ${getblockClass(block)}
      ${isInArounds && !block.revealed && !block.flagged ? 'bg-blue-500' : ''}
      `"
  >
    <template v-if="block.flagged">
      <div class="text-red-500">
        <MyFlag />
      </div>
    </template>
    <template v-else-if="block.revealed || isDev">
      <div v-if="block.isMine">
        <MyMine />
      </div>
      <div v-else class="font-bold">
        {{ block.adjacentMine }}
      </div>
    </template>
    <template v-else-if="gameStaus === 'lost'">
      <div
        v-if="block.isMine"
        class="w-full h-full flex items-center justify-center bg-red-500"
      >
        <MyMine />
      </div>
    </template>
  </button>
</template>
