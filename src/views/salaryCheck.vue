<script setup lang="ts">
import { openLoading, closeLoading } from '@/composables/loading'
interface UserTableData {
  name: string
  attend: number
  personal: number
  sick: number
  official: number
  absent: number
  notEntry: number
  basic: number
  perfectAttend: null | number
  sick_personal_deduction: number
  notEntry_deduction: number
  dock: null | number
  laborHealthInsurance: number
  total: number
  isCheck: number
}
const tableData = ref<UserTableData[]>([])
const nowMonth = ref<string>('')
const isCheck = ref<boolean>(false)
const getData = () => {
  openLoading()
  fetch(`api/getAllSalary?month=${nowMonth.value}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 200) {
        tableData.value = res.data
        isCheck.value = res.isCheck
      } else {
        ElMessage.error('資料取得失敗')
      }
    })
    .catch(() => {
      ElMessage.error('資料取得失敗')
    })
    .finally(() => {
      closeLoading()
    })
}
const handleDateChange = () => {
  let date = new Date(nowMonth.value)
  nowMonth.value = `${date.getFullYear()}-${date.getMonth() + 1}`
  getData()
}
const Check = () => {
  openLoading('薪資確認中...')
  fetch('api/salaryCheck', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      month: nowMonth.value
    })
  })
    .then((res) => res.json())
    .then((res) => {
      closeLoading()
      if (res.code === 200) {
        ElMessage.success('已成功上傳薪資')
        getData()
      } else {
        ElMessage.error('薪資確認失敗')
      }
    })
    .catch(() => {
      closeLoading()
      ElMessage.error('薪資確認失敗')
    })
}
onMounted(() => {
  let now = new Date()
  let month = now.getMonth() == 0 ? 12 : now.getMonth()
  nowMonth.value = `${now.getFullYear()}-${month}`
  getData()
})
</script>
<template>
  <div>
    <h3>薪資確認</h3>
    <h5>所有人員當月薪資表</h5>
    <p style="color: red">*如薪資計算錯誤或資料有誤請聯絡人事進行出席資料更改!</p>
    <div style="display: flex; margin-bottom: 10px">
      <label style="margin-right: 5px">選擇查看月份:</label>
      <el-date-picker
        v-model="nowMonth"
        type="month"
        placeholder="選擇確認月份"
        @change="handleDateChange"
      />
      <el-button @click="Check" type="primary" style="margin-left: 10px"> 薪資確認 </el-button>
    </div>
    <el-tag :type="isCheck ? 'success' : 'danger'" effect="dark" style="margin-bottom: 10px">{{
      isCheck ? '薪資確認完成' : '尚未確認薪資'
    }}</el-tag>
    <el-table :data="tableData" :border="true" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <div style="margin: 1rem 0 0 2rem">
            <p class="userInfo"><span class="title">出席天數: </span> {{ props.row.attend }}</p>
            <p class="userInfo"><span class="title">事假天數: </span> {{ props.row.personal }}</p>
            <p class="userInfo"><span class="title">病假天數: </span> {{ props.row.sick }}</p>
            <p class="userInfo"><span class="title">公假天數: </span> {{ props.row.official }}</p>
            <p class="userInfo"><span class="title">曠職天數: </span> {{ props.row.absent }}</p>
            <p class="userInfo"><span class="title">未入職天數: </span> {{ props.row.notEntry }}</p>
            <p class="userInfo"><span class="title">底薪: </span> {{ props.row.basic }}</p>
            <p class="userInfo">
              <span class="title">全勤獎金: </span> {{ props.row.perfectAttend }}
            </p>
            <p class="userInfo">
              <span class="title">病事假扣薪: </span> {{ props.row.sick_personal_deduction }}
            </p>
            <p class="userInfo">
              <span class="title">未入職扣薪: </span> {{ props.row.notEntry_deduction }}
            </p>
            <p class="userInfo"><span class="title">曠職扣薪: </span> {{ props.row.dock }}</p>
            <p class="userInfo">
              <span class="title">勞健保: </span> {{ props.row.laborHealthInsurance }}
            </p>
            <p class="userInfo"><span class="title">總薪資: </span> {{ props.row.total }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="出席天數" prop="attend" width="100" />
      <el-table-column label="事假天數" prop="personal" width="100" />
      <el-table-column label="病假天數" prop="sick" width="100" />
      <el-table-column label="公假天數" prop="official" width="100" />
      <el-table-column label="曠職天數" prop="absent" width="100" />
      <el-table-column label="未入職天數" prop="notEntry" width="100" />
      <el-table-column label="是否上傳" prop="isCheck" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.isCheck" type="success" effect="dark">是</el-tag>
          <el-tag v-else type="danger" effect="dark">否</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style scope lang="scss"></style>
