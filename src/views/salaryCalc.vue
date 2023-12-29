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
  isPerfect: boolean
}
const tableData = ref<UserTableData[]>([])
const nowMonth = ref<string>('')
const isCalc = ref<boolean>(false)
const getData = () => {
  openLoading()
  fetch(`api/allAttendStatus?month=${nowMonth.value}`)
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 200) {
        tableData.value = res.data
        isCalc.value = res.isCalc
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
const Calc = () => {
  openLoading('薪資計算中...')
  fetch('api/salaryCalc', {
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
        ElMessage.success('薪資計算完成')
        getData()
      } else if (res.code === 401) {
        ElMessage.error('當月尚未結束!')
      } else {
        ElMessage.error('薪資計算失敗')
      }
    })
    .catch(() => {
      closeLoading()
      ElMessage.error('薪資計算失敗')
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
    <h3>薪資計算</h3>
    <h5>出缺席天數統計表</h5>
    <p style="color: red">*請先調整完成出席狀態確認出席資料無誤再點擊薪資計算</p>
    <div style="display: flex; margin-bottom: 10px">
      <label style="margin-right: 5px">選擇查看月份:</label>
      <el-date-picker
        v-model="nowMonth"
        type="month"
        placeholder="選擇計算月份"
        @change="handleDateChange"
      />
      <el-button @click="Calc" type="primary" style="margin-left: 10px"> 薪資計算 </el-button>
    </div>
    <el-tag :type="isCalc ? 'success' : 'danger'" effect="dark" style="margin-bottom: 10px">{{
      isCalc ? '薪資計算完成' : '尚未計算薪資'
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
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name" />
      <el-table-column label="出席天數" prop="attend" />
      <el-table-column label="事假天數" prop="personal" />
      <el-table-column label="病假天數" prop="sick" />
      <el-table-column label="公假天數" prop="official" />
      <el-table-column label="曠職天數" prop="absent" />
      <el-table-column label="未入職天數" prop="notEntry" />
      <el-table-column label="全勤" prop="isPerfect">
        <template #default="scope">
          <el-tag v-if="scope.row.isPerfect" type="success" effect="dark">是</el-tag>
          <el-tag v-else type="danger" effect="dark">否</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style scope lang="scss"></style>
