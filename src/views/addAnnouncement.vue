<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { openLoading, closeLoading } from '@/composables/loading'
const formRef = ref<FormInstance | null>(null)
const form = ref({
  date: '',
  title: ''
})
const onSubmit = (formRef: FormInstance) => {
  if (!formRef) return
  formRef.validate((valid) => {
    if (valid) {
      openLoading('資料傳輸中...')
      fetch('api/addAnnouncement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form.value)
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.code === 200) {
            ElMessage.success('新增成功')
            ResetForm()
          } else {
            ElMessage.error('新增失敗')
          }
        })
        .catch(() => {
          ElMessage.error('新增失敗')
        })
        .finally(() => {
          closeLoading()
        })
    } else {
      ElMessage.error('資料不完整!')
      return false
    }
  })
}
const ResetForm = () => {
  form.value = {
    date: '',
    title: ''
  }
}
const rules = reactive<FormRules>({
  date: [{ required: true, message: '請填寫公告日期', trigger: 'change' }],
  title: [{ required: true, message: '請填寫公告內容', trigger: 'blur' }]
})
</script>
<template>
  <div>
    <h3>新增行事曆事項</h3>
    <el-form :model="form" label-width="120px" ref="formRef" :rules="rules">
      <el-form-item label="公告日期" prop="date">
        <el-date-picker
          v-model="form.date"
          type="daterange"
          range-separator="到"
          start-placeholder="公告起始日期"
          end-placeholder="公告結束日期"
        />
      </el-form-item>
      <el-form-item label="公告內容" prop="title">
        <el-input v-model="form.title" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(formRef)">新增公告</el-button>
        <el-button type="warning" @click="ResetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
