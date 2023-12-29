<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { openLoading, closeLoading } from '@/composables/loading'
interface Date {
  start: string
  end: string
  type: string
  title: string
}
interface User {
  id: string
  name: string
}
const fullCalendar = ref(null)
const manualLeaveWindow = ref<boolean>(false)
const activeMonth = ref<string>('')
const activeDateStart = ref<string>('')
const activeDateEnd = ref<string>('')
const activeAttendType = ref(null)
const activeEvent = ref(null)
const activeUserId = ref<string>('')
const AttendDateList = ref<Date[]>(null)
const AllUser = ref<User[] | null>(null)
const dialogWidth = ref('90%')
const handleEventClick = (info) => {
  let date = info.event
  activeDateStart.value = date.startStr
  if (date.endStr == '') {
    activeDateEnd.value = date.startStr
  } else {
    activeDateEnd.value = date.endStr
  }
  AttendDateList.value.map((item) => {
    if (item.start === info.event.startStr) {
      activeAttendType.value = item.type //取得當天的出席狀況
    }
  })
  activeEvent.value = info.event
  manualLeaveWindow.value = true
}
const ResetForm = () => {
  activeDateStart.value = ''
  activeDateEnd.value = ''
  activeAttendType.value = null
  activeEvent.value = null
}
const applyLeave = () => {
  fetch('api/manualAttend', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: activeUserId.value,
      attendType: activeAttendType.value,
      start: activeDateStart.value,
      end: activeDateEnd.value
    })
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 200) {
        AttendDateList.value = AttendDateList.value.map((item) => {
          if (item.start === activeDateStart.value) {
            item.type = activeAttendType.value
          }
          return item
        })
        activeEvent.value.remove()
        addFullCalendarEvent({
          start: activeDateStart.value,
          end: activeDateEnd.value,
          type: activeAttendType.value,
          title: ''
        })
        ElMessage.success('資料儲存成功')
        manualLeaveWindow.value = false
      } else {
        ElMessage.error('資料儲存失敗')
      }
    })
    .catch(() => {
      ElMessage.error('資料儲存失敗')
    })
}
const getAttendData = () => {
  clearFullCalendarEvents()
  if (!activeMonth.value || !activeUserId.value) return
  openLoading()
  fetch(`api/getAttendData?userId=${activeUserId.value}&month=${activeMonth.value}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 200) {
        AttendDateList.value = res.data
        res.data.forEach((item) => {
          addFullCalendarEvent(item)
        })
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
const addFullCalendarEvent = (item: Date) => {
  item.title =
    item.type === 'attend'
      ? '出席'
      : item.type === 'official'
        ? '公假'
        : item.type === 'personal'
          ? '事假'
          : item.type === 'sick'
            ? '病假'
            : item.type === 'dayOff' && item.title === ''
              ? '休假'
              : item.type === 'dayOff' && item.title !== ''
                ? item.title
                : item.type === 'annual'
                  ? '特休'
                  : item.type === 'absent'
                    ? '曠職'
                    : '尚未入職'
  fullCalendar.value.getApi().addEvent({
    title: item.title,
    start: item.start,
    end: item.end,
    allDay: true,
    color:
      item.type === 'attend'
        ? '#67C23A'
        : item.type === 'official'
          ? '#E6A23C'
          : item.type === 'personal'
            ? '#F56C6C'
            : item.type === 'sick'
              ? '#C26EFF	'
              : item.type === 'dayOff'
                ? '#FF4FFF'
                : item.type === 'annual'
                  ? '#990DFF'
                  : item.type === 'absent'
                    ? '#909399'
                    : '#909399'
  })
}
const clearFullCalendarEvents = () => {
  let getEvents = fullCalendar.value.getApi().getEvents() //獲取當前日曆上的所有事件
  if (getEvents && getEvents.length > 0) {
    getEvents.map((item) => {
      fullCalendar.value.getApi().getEventById(item.id).remove()
    })
  }
}
const prevClick = () => {
  let calendarApi = fullCalendar.value.getApi()
  calendarApi.prev()
  let date = new Date(calendarApi.view.currentStart)
  activeMonth.value = date.getFullYear() + '-' + (date.getMonth() + 1)
  if (activeUserId.value) {
    getAttendData()
  } else {
    clearFullCalendarEvents()
  }
}
const nextClick = () => {
  let calendarApi = fullCalendar.value.getApi()
  calendarApi.next()
  let date = new Date(calendarApi.view.currentStart)
  activeMonth.value = date.getFullYear() + '-' + (date.getMonth() + 1)
  if (activeUserId.value) {
    getAttendData()
  } else {
    clearFullCalendarEvents()
  }
}
const todayClick = () => {
  let calendarApi = fullCalendar.value.getApi()
  calendarApi.today()
  let date = new Date(calendarApi.view.currentStart)
  activeMonth.value = date.getFullYear() + '-' + (date.getMonth() + 1)
  if (activeUserId.value) {
    getAttendData()
  } else {
    clearFullCalendarEvents()
  }
}
const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  selectable: true,
  initialView: 'dayGridMonth',
  // dateClick: handleDateClick,
  eventClick: handleEventClick,
  locale: 'zh-tw',
  buttonText: {
    today: '當月'
  },
  customButtons: {
    prev: {
      text: '上個月',
      click: prevClick
    },
    next: {
      text: '下個月',
      click: nextClick
    },
    today: {
      text: '當月',
      click: todayClick
    }
  },
  events: []
}
onMounted(() => {
  openLoading()
  let date = new Date()
  date.setHours(0, 0, 0, 0)
  activeMonth.value = `${date.getFullYear()}-${date.getMonth() + 1}`
  fetch('api/getAllUser', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 200) {
        AllUser.value = res.data
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
  dialogWidth.value = window.innerWidth < 768 ? '90%' : '50%'
  window.addEventListener('resize', () => {
    dialogWidth.value = window.innerWidth < 768 ? '90%' : '50%'
  })
})
</script>
<template>
  <div>
    <div style="display: flex; align-items: center">
      <label>請選擇要調整的使用者:</label>
      <el-select v-model="activeUserId" @change="getAttendData">
        <el-option v-for="user in AllUser" :key="user.id" :label="user.name" :value="user.id" />
      </el-select>
    </div>
    <FullCalendar ref="fullCalendar" :options="calendarOptions" />
    <el-dialog v-model="manualLeaveWindow" title="出席調整" :width="dialogWidth">
      <el-form-item label="出席日期">
        <el-date-picker v-model="activeDateStart" :disabled="true" />
      </el-form-item>
      <el-form-item label="出席狀況">
        <el-select v-model="activeAttendType">
          <el-option label="出席" value="attend" />
          <el-option label="公假" value="official" />
          <el-option label="事假" value="personal" />
          <el-option label="病假" value="sick" />
          <el-option label="曠職" value="absent" />
          <el-option label="休假" value="dayOff" />
          <el-option label="特休" value="annual" />
          <el-option label="尚未入職" value="notEntry" />
        </el-select>
      </el-form-item>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="(manualLeaveWindow = false), ResetForm()">取消</el-button>
          <el-button type="primary" @click="applyLeave"> 完成調整 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss"></style>
