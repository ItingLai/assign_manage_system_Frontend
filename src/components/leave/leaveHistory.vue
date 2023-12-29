<script setup lang="ts">
import { openLoading, closeLoading } from '@/composables/loading'
interface tableDataType {
  date: string
  start: string
  end: string
  id: string
  user_id: string
  name: string
  type: string
  reason: string
  not_agree_reason: string
  status: number
}
const tableData = ref<tableDataType[]>([])
const getData = () => {
  openLoading()
  fetch('api/getLeaveHistory', {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 200) {
        tableData.value = res.data
      } else {
        ElMessage.error('取得資料失敗')
      }
    })
    .catch(() => {
      ElMessage.error('取得資料失敗')
    })
    .finally(() => {
      closeLoading()
    })
}
onMounted(() => {
  getData()
})
</script>
<template>
  <div>
    <div style="display: flex; justify-content: space-between; align-items: center">
      <h1>請假紀錄</h1>
      <el-button type="primary" @click="getData()">重新獲取資料</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%" :border="true">
      <el-table-column type="expand">
        <template #default="props">
          <div style="margin: 1rem 0 0 2rem">
            <p class="userInfo"><span class="title">請假原因: </span> {{ props.row.reason }}</p>
            <p class="userInfo" v-if="props.row.status === 0">
              <span class="title">未通過理由: </span> {{ props.row.not_agree_reason }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="申請日期" />
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="type" label="假別">
        <template #default="scope">
          <el-tag class="ml-2" v-if="scope.row.type === 'sick'" effect="dark">病假</el-tag>
          <el-tag class="ml-2" v-if="scope.row.type === 'personal'" type="warning" effect="dark"
            >事假</el-tag
          >
          <el-tag class="ml-2" v-if="scope.row.type === 'official'" type="info" effect="dark"
            >公假</el-tag
          >
          <el-tag class="ml-2" v-if="scope.row.type === 'annual'" type="success" effect="dark"
            >特休</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="start" label="起始日期" />
      <el-table-column prop="end" label="結束日期" />
      <el-table-column prop="status" label="審核狀態" width="100" fixed="right">
        <template #default="scope">
          <el-tag v-if="scope.row.status === null" type="warning" effect="dark">審核中</el-tag>
          <el-tag v-if="scope.row.status === 1" type="success" effect="dark">已准許</el-tag>
          <el-tag v-if="scope.row.status === 0" type="danger" effect="dark">未通過</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style scope lang="scss">
.userInfo {
  margin: 0.5rem;
  .title {
    font-weight: bold;
    color: black;
  }
}
</style>
