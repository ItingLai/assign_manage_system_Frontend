<script setup lang="ts">
import { FormInstance, FormRules } from 'element-plus'
import router from '@/router'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const { isLogin } = storeToRefs(userStore)
interface FormType {
  originalPw: string
  password: string
  confirmPw: string
}
const formRef = ref<FormInstance | null>(null)
const form = ref<FormType>({
  originalPw: '',
  password: '',
  confirmPw: ''
})
const submitForm = (formRef: FormInstance) => {
  if (!formRef) return
  formRef.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm('是否確定更改密碼?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          fetch('api/renewPassword', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              originalPw: form.value.originalPw,
              password: form.value.password,
              confirmPw: form.value.confirmPw
            })
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.code === 200) {
                ElMessage.success('密碼更改成功!請重新登入')
                isLogin.value = false
                router.push('/login')
              } else {
                ElMessage.error('密碼更改失敗')
              }
            })
            .catch(() => {
              ElMessage.error('密碼更改失敗')
            })
        })
        .catch(() => {})
    } else {
      ElMessage.error('表單資料不完整!')
      return false
    }
  })
}
const rules = reactive<FormRules<FormType>>({
  originalPw: [
    { required: true, message: '請輸入原始密碼', trigger: 'blur' },
    { min: 6, max: 20, message: '長度在 6 到 20 個字元', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 6, max: 20, message: '長度在 6 到 20 個字元', trigger: 'blur' },
    {
      pattern: /^(?=.*\d)(?=.*[a-z]).{6,20}$/,
      message: '帳號須包含大小寫英文字母及數字，長度6-20字元',
      trigger: 'blur'
    }
  ],
  confirmPw: [
    { required: true, message: '請再次輸入密碼', trigger: 'blur' },
    { min: 6, max: 20, message: '長度在 6 到 20 個字元', trigger: 'blur' },
    {
      pattern: /^(?=.*\d)(?=.*[a-z]).{6,20}$/,
      message: '帳號須包含大小寫英文字母及數字，長度6-20字元',
      trigger: 'blur'
    },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.password) {
          callback(new Error('兩次輸入密碼不一致!'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})
</script>
<template>
  <div>
    <h3>更改密碼</h3>
    <el-form
      ref="formRef"
      :model="form"
      status-icon
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="原始密碼" prop="originalPw">
        <el-input v-model="form.originalPw" type="password" autocomplete="off" show-password />
      </el-form-item>
      <el-form-item label="新密碼" prop="password">
        <el-input v-model="form.password" type="password" autocomplete="off" show-password />
      </el-form-item>
      <el-form-item label="確認新密碼" prop="confirmPw">
        <el-input v-model="form.confirmPw" type="password" autocomplete="off" show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(formRef)">更改</el-button>
        <el-button type="warning" @click="formRef.resetFields()">重置表單</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style scope lang="scss"></style>
