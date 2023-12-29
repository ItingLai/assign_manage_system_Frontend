<script setup lang="ts">
import { openLoading, closeLoading } from '@/composables/loading'
interface InfoType {
  month: string
  name: string
  attend: number
  personal: number
  sick: number
  official: number
  absent: number
  basic: number
  perfectAttend: null | number
  sick_personal_deduction: number
  notEntry_deduction: number
  dock: null | number
  laborHealthInsurance: number
  total: number
}
const infoData = ref<InfoType | null>({
  month: '',
  name: '',
  attend: 0,
  personal: 0,
  sick: 0,
  official: 0,
  absent: 0,
  basic: 0,
  perfectAttend: 0,
  sick_personal_deduction: 0,
  notEntry_deduction: 0,
  dock: 0,
  laborHealthInsurance: 0,
  total: 0
})
onMounted(() => {
  openLoading()
  fetch('api/salaryInfo', {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 200) {
        infoData.value = res.data
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
    <h3>{{ infoData.month }}薪資資訊</h3>
    <el-descriptions title="薪資條" :column="3" :border="true">
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon>
              <user />
            </el-icon>
            姓名
          </div>
        </template>
        {{ infoData.name }}
      </el-descriptions-item>
      <el-descriptions-item label="出席天數">
        {{ infoData.attend }}
      </el-descriptions-item>
      <el-descriptions-item label="事假天數">
        {{ infoData.personal }}
      </el-descriptions-item>
      <el-descriptions-item label="病假天數">
        {{ infoData.sick }}
      </el-descriptions-item>
      <el-descriptions-item label="公假天數">
        {{ infoData.official }}
      </el-descriptions-item>
      <el-descriptions-item label="曠職天數">
        {{ infoData.absent }}
      </el-descriptions-item>
      <el-descriptions-item label="基本薪資">
        {{ infoData.basic }}
      </el-descriptions-item>
      <el-descriptions-item label="全勤獎金">
        {{ infoData.perfectAttend }}
      </el-descriptions-item>
      <el-descriptions-item label="事病假扣款">
        {{ infoData.sick_personal_deduction }}
      </el-descriptions-item>
      <el-descriptions-item label="未入職扣款">
        {{ infoData.notEntry_deduction }}
      </el-descriptions-item>
      <el-descriptions-item label="曠職扣款">
        {{ infoData.dock }}
      </el-descriptions-item>
      <el-descriptions-item label="勞健保">
        {{ infoData.laborHealthInsurance }}
      </el-descriptions-item>
      <el-descriptions-item label="總薪資">
        {{ infoData.total }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>
<style scope lang="scss"></style>
