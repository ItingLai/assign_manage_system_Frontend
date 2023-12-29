<script setup lang="ts">
import { openLoading, closeLoading } from '@/composables/loading'
interface UserTableData {
  name: string
  attend: number
  personal: number
  sick: number
  official: number
  absent: number
  basic: number
  perfectAttend: null | number
  sick_personal_deduction: number
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
onMounted(() => {
  let now = new Date()
  let month = now.getMonth() == 0 ? 12 : now.getMonth()
  nowMonth.value = `${now.getFullYear()}-${month}`
  getData()
})
</script>
<template>
  <div>
    <h3>所有人員薪資表</h3>
    <div>
      <p style="display: inline-block; margin-right: 5px">選擇查看月份:</p>
      <el-date-picker
        v-model="nowMonth"
        type="month"
        placeholder="選擇查看月份"
        @change="handleDateChange"
      />
    </div>
    <el-tag :type="isCheck ? 'success' : 'danger'" effect="dark">{{
      isCheck ? '薪資上傳完成' : '尚未上傳薪資'
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
            <p class="userInfo"><span class="title">底薪: </span> {{ props.row.basic }}</p>
            <p class="userInfo">
              <span class="title">全勤獎金: </span> {{ props.row.perfectAttend }}
            </p>
            <p class="userInfo">
              <span class="title">病事扣薪: </span> {{ props.row.sick_personal_deduction }}
            </p>
            <p class="userInfo"><span class="title">缺席扣薪: </span> {{ props.row.dock }}</p>
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
