<script lang="ts">
import { defineComponent } from 'vue'
import { useInfo } from './userInfo'

export default defineComponent({
  setup() {
    const handleOpen = (key: string, keyPath: string[]) => {
      // console.log(key, keyPath)
    }
    const handleClose = (key: string, keyPath: string[]) => {
      // console.log(key, keyPath)
    }
    const handleSelect = (...args: any[]) => {
      // console.log('select', ...args)
    }
    return {
      useInfo,
      handleOpen,
      handleClose,
      handleSelect,
    }
  },
})
</script>

<template>
  <div class="h-screen flex">
    <el-menu
      @open="handleOpen"
      @close="handleClose"
      @select="handleSelect"
      :router="true"
      class="h-full w-40"
    >
      <el-menu-item index="1" :route="{ path: '/' }"
        ><el-icon><HomeFilled /></el-icon>首页</el-menu-item
      >
      <el-menu-item index="2" :route="{ path: '/ranklist' }"
        ><el-icon><List /></el-icon>排名</el-menu-item
      >
    </el-menu>

    <router-view></router-view>
  </div>
</template>
