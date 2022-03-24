<script setup lang="ts">
import { BlockState } from './type'
import { isDev } from './storage/index'
import Flag from './Flag.vue'
import Mmines from './Mmines.vue'
defineProps<{ block: BlockState }>()

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
  if (block.flagged) return
  if (!block.revealed) {
    return 'bg-gray-500/40 hover:bg-gray-400'
  }
  return block.mines ? 'bg-red-500' : numberColors[block.adjacentMines]
}
</script>

<template>
  <button
    :class="`border
    dark:border-gray-500
    w-8
    h-8
    flex
    m-0.2
    justify-center
    items-center ${getblockClass(block)}`"
  >
    <template v-if="block.flagged">
      <div class="text-red-500">
        <Flag />
      </div>
    </template>
    <template v-else-if="block.revealed || isDev">
      <div v-if="block.mines">
        <Mmines />
      </div>
      <div v-else class="font-bold">
        {{ block.adjacentMines }}
      </div>
    </template>
  </button>
</template>
