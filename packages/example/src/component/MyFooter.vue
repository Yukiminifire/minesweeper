<script setup lang="ts">
import { isDark, toggleDark } from './index'
import Mygithub from './GithubICON.vue'
import Mymoon from './MoonICON.vue'
import Mysun from './SunICON.vue'
</script>

<template>
  <nav class="text-xl mt-4 inline-flex gap-2">
    <button
      class="icon-btn !outline-none dark:text-white"
      @click="toggleDark()"
    >
      <div v-if="isDark" i-carbon-moon><Mymoon /></div>
      <div v-else i-carbon-sun><Mysun /></div>
    </button>

    <a
      class="icon-btn dark:text-white"
      i-carbon-logo-github
      rel="noreferrer"
      href="https://github.com/Yukiminifire/minesweeper"
      target="_blank"
      title="GitHub"
      ><Mygithub
    /></a>
  </nav>
</template>
