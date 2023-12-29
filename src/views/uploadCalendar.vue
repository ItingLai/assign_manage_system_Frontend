<script setup lang="ts">
import type { UploadInstance } from 'element-plus'
const uploadRef = ref<UploadInstance>()
const submitUpload = () => {
  uploadRef.value.submit()
}
const beforeUpload = (file: File) => {
  const isCSV = file.type === 'text/csv'
  if (!isCSV) {
    ElMessage.error('上傳檔案格式錯誤!')
  }
  return isCSV
}
const handleExeceed = () => {
  ElMessage.warning(`只能上傳一個檔案`)
}
const handleSuccess = (res: any) => {
  uploadRef.value.clearFiles()
  if (res.code == 200) {
    ElMessage.success('匯入資料成功!')
  } else if (res.code == 500 && res.msg == 'Date Data exist!') {
    ElMessage.error('資料已存在!')
  } else {
    ElMessage.error('上傳失敗!')
  }
}
</script>
<template>
  <div>
    <h3>上傳行事曆檔案</h3>
    <p>
      請前往<a href="https://data.gov.tw/dataset/14718" target="_blank">公開資料網站</a
      >下載隔年度檔案並上傳伺服器以獲取行事曆資料
    </p>
    <p style="color: red">*請下載非Google行事曆專用</p>
    <el-upload
      ref="uploadRef"
      class="upload"
      accept="text/csv"
      action="/api/uploadCalendar"
      :auto-upload="false"
      :before-upload="beforeUpload"
      :limit="1"
      :on-exceed="handleExeceed"
      :on-success="handleSuccess"
    >
      <template #trigger>
        <el-button type="primary">選擇檔案</el-button>
      </template>
      <el-button type="success" style="margin-left: 10px" @click="submitUpload">
        上傳檔案
      </el-button>
      <template #tip>
        <div class="el-upload__tip">僅限上傳 <strong>csv</strong> 檔案，請勿上傳其他檔案</div>
      </template>
    </el-upload>
  </div>
</template>
<style scope lang="scss"></style>
