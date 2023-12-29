<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { openLoading, closeLoading } from '@/composables/loading'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { isCollapse } from '@/composables/isCollapse'
const formRef = ref<FormInstance | null>(null)
const applyLeaveWindow = ref<boolean>(false)
const fullCalendar = ref(null)
const applyBtnIsShow = ref<boolean>(true)
const dialogWidth = ref('90%')
const form = reactive({
  leave_type: '',
  leave_date: '',
  leave_reason: ''
})
const handleDateClick = (info) => {
  let date = info.date
  applyBtnIsShow.value = true
  form.leave_date = [date, date] as any
  applyLeaveWindow.value = true
}
const check_date = (date: string, type: string): boolean => {
  let today = new Date()
  today.setHours(0, 0, 0, 0)
  let latest_date
  if (type == 'official') {
    latest_date = new Date(today.setDate(today.getDate() + 3))
  } else {
    latest_date = new Date(today.setDate(today.getDate() + 14))
  }
  let start = new Date(date)
  if (start >= latest_date) {
    return true
  }
  return false
}
const addLeaveDate = () => {
  let leaveType =
    form.leave_type == 'sick'
      ? '病假'
      : form.leave_type == 'personal'
        ? '事假'
        : form.leave_type == 'official'
          ? '公假'
          : '特休'
  fullCalendar.value.getApi().addEvent({
    title: leaveType,
    start: form.leave_date[0],
    end: form.leave_date[1],
    allDay: true
  })
  applyLeaveWindow.value = false
}
const applyLeave = (formRef: FormInstance) => {
  if (!formRef) return
  formRef.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm('確定要送出請假申請嗎?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (form.leave_type === 'official') {
            if (check_date(form.leave_date[0], 'official') == false) {
              ElMessage.error('公假需提前三天申請!')
              return
            }
          }
          if (form.leave_type === 'annual') {
            if (check_date(form.leave_date[0], 'annual') == false) {
              ElMessage.error('特休需提前兩周申請!')
              return
            }
          }
          openLoading('資料傳輸中...')
          fetch('api/applyLeave', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              leaveType: form.leave_type,
              leaveDate: form.leave_date,
              leaveReason: form.leave_reason
            })
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.code === 200) {
                ElMessage.success('申請成功')
                addLeaveDate()
                ResetForm()
              } else {
                ElMessage.error('申請失敗')
              }
            })
            .catch(() => {
              ElMessage.error('申請失敗')
            })
            .finally(() => {
              closeLoading()
            })
        })
        .catch(() => {})
    } else {
      ElMessage.error('資料不完整!')
      return false
    }
  })
}
const ResetForm = () => {
  form.leave_type = ''
  form.leave_date = ''
  form.leave_reason = ''
}
const rules = reactive<FormRules>({
  leave_type: [{ required: true, message: '請選擇假別', trigger: 'change' }],
  leave_date: [{ required: true, message: '請選擇請假日期', trigger: 'change' }],
  leave_reason: [{ required: true, message: '請填寫請假原因', trigger: 'change' }]
})
const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  selectable: true,
  initialView: 'dayGridMonth',
  dateClick: handleDateClick,
  locale: 'zh-tw',
  buttonText: {
    today: '當月'
  },
  events: []
}
onMounted(() => {
  dialogWidth.value = window.innerWidth < 768 ? '90%' : '50%'
  window.addEventListener('resize', () => {
    dialogWidth.value = window.innerWidth < 768 ? '90%' : '50%'
  })
})
watch(isCollapse, () => {
  setTimeout(() => {
    fullCalendar.value.getApi().updateSize()
  }, 500)
})
</script>
<template>
  <div>
    <div>
      <ul>
        <li>點擊要請假日期即可申請請假</li>
      </ul>
    </div>
    <FullCalendar ref="fullCalendar" :options="calendarOptions" />
    <el-dialog v-model="applyLeaveWindow" title="請假申請" :width="dialogWidth">
      <el-form :model="form" ref="formRef" :rules="rules">
        <el-form-item label="假別" prop="leave_type">
          <el-select v-model="form.leave_type" placeholder="請選擇假別">
            <el-option label="病假" value="sick" />
            <el-option label="事假" value="personal" />
            <el-option label="公假" value="official" />
            <el-option label="特休" value="annual" />
          </el-select>
        </el-form-item>
        <el-form-item label="請假日期" prop="leave_date">
          <el-date-picker
            v-model="form.leave_date"
            type="daterange"
            range-separator="到"
            start-placeholder="起始日期"
            end-placeholder="結束日期"
          />
        </el-form-item>
        <el-form-item label="請假原因" prop="leave_reason">
          <el-input v-model="form.leave_reason" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="(applyLeaveWindow = false), ResetForm()">取消</el-button>
          <el-button type="primary" @click="applyLeave(formRef)"> 新增請假 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scope lang="scss"></style>
