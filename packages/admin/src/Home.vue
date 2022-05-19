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
  <el-row class="tac">
    <el-col :span="3">
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
        :router="true"
      >
        <el-menu-item index="1" :route="{ path: '/' }"
          ><el-icon><HomeFilled /></el-icon>首页</el-menu-item
        >
        <el-menu-item index="2" :route="{ path: '/ranklist' }"
          ><el-icon><List /></el-icon>排名</el-menu-item
        >
      </el-menu>
    </el-col>
  </el-row>
  <router-view></router-view>
</template>
