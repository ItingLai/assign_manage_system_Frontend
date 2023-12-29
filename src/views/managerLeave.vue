<script setup lang="ts">
import { openLoading, closeLoading } from '@/composables/loading'
interface tableDataType {
  date: string
  start: string
  end: string
  leave_id: string
  user_id: string
  name: string
  type: string
  reason: string
}
const tableData = ref<tableDataType[]>([])
const post_data = (type: string, leave_id: string, id: string, reason: string = '') => {
  fetch('api/managerLeave', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      leave_id: leave_id,
      user_id: id,
      type: type,
      reason: reason
    })
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 200) {
        ElMessage.success('操作成功')
        tableData.value = tableData.value.filter((item) => item.leave_id !== leave_id)
      } else {
        ElMessage.error('操作失敗')
      }
    })
    .catch(() => {
      ElMessage.error('操作失敗')
    })
}
const openReason = (type: string, leave_id: string, user_id: string) => {
  ElMessageBox.prompt('請輸入拒絕原因', '輸入視窗', {
    confirmButtonText: '送出',
    cancelButtonText: '取消'
  })
    .then(({ value }) => {
      post_data(type, leave_id, user_id, value)
    })
    .catch(() => {})
}
onMounted(() => {
  openLoading()
  fetch('api/getAllLeave', {
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
})
</script>
<template>
  <div>
    <h1>請假審核</h1>
    <el-table :data="tableData" stripe style="width: 100%" :border="true">
      <el-table-column type="expand">
        <template #default="props">
          <div style="margin: 1rem 0 0 2rem">
            <p class="userInfo"><span class="title">請假原因: </span> {{ props.row.reason }}</p>
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
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="scope">
          <el-button
            type="primary"
            @click="post_data('agree', scope.row.leave_id, scope.row.user_id)"
            >准許</el-button
          >
          <el-button
            type="danger"
            @click="openReason('disagree', scope.row.leave_id, scope.row.user_id)"
            >拒絕</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<style scope lang="scss"></style>
