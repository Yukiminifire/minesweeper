<script lang="ts">
import { defineComponent, reactive } from 'vue'
const form = reactive({
  name: '',
})
const ruleForm = reactive({
  pass: '',
})

export default defineComponent({
  setup() {
    return {
      form,
      ruleForm,
    }
  },
})
</script>

<template>
  <el-form :model="ruleForm" status-icon label-width="120px" class="m-5">
    <el-form-item label="姓名">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="密码" prop="pass">
      <el-input v-model="ruleForm.pass" type="password" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="">登陆</el-button>
      <el-button>重置</el-button>
    </el-form-item>
  </el-form>
</template>
