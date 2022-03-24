<script setup lang="ts">
import { isDark, toggleDark } from './index'
import Mgithub from './Mgithub.vue'
import Mmoon from './Mmoon.vue'
import Msun from './Msun.vue'
</script>

<template>
  <nav class="text-xl mt-6 inline-flex gap-2">
    <button
      class="icon-btn !outline-none dark:text-white"
      @click="toggleDark()"
    >
      <div v-if="isDark" i-carbon-moon><Mmoon /></div>
      <div v-else i-carbon-sun><Msun /></div>
    </button>

    <a
      class="icon-btn dark:text-white"
      i-carbon-logo-github
      rel="noreferrer"
      href="https://github.com/Yukiminifire/minesweeper"
      target="_blank"
      title="GitHub"
      ><Mgithub
    /></a>
  </nav>
</template>
