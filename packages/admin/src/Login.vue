<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useInfo } from './userInfo'

export default defineComponent({
  setup() {
    const form = reactive({
      name: '',
      pass: '',
    })

    const router = useRouter()

    async function login() {
      useInfo.value.name = form.name
      useInfo.value.token = 'yby_token'
      router.replace({
        path: '/',
      })
    }

    return {
      form,
      login,
    }
  },
})
</script>

<template>
  <el-form :model="form" status-icon label-width="120px" class="m-5">
    <el-form-item label="姓名">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="密码" prop="pass">
      <el-input v-model="form.pass" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="login()">登陆</el-button>
      <el-button>重置</el-button>
    </el-form-item>
  </el-form>
</template>
