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
  <div class="flex justify-center h-screen bg-green-100">
    <el-form
      :model="form"
      status-icon
      label-width="40px"
      class="m-20 justify-center items-center w-56"
    >
      <el-form-item label="姓名">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input v-model="form.pass" type="password" />
      </el-form-item>
      <el-form-item>
        <div class="flex justify-center">
          <el-button
            type="primary"
            @click="login()"
            class="flex justify-center w-46"
            >登陆</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
