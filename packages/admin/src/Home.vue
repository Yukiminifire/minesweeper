<script lang="ts">
import { defineComponent } from 'vue'
import { useInfo } from './userInfo'

export default defineComponent({
  setup() {
    return {
      useInfo,
    }
  },
})
</script>

<template>
  <h2>欢迎来到首页 {{ useInfo.name }}</h2>
</template>
