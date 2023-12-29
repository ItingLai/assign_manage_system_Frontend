<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { openLoading, closeLoading } from '@/composables/loading'
import { isCollapse } from '@/composables/isCollapse'
interface Date {
  date: string
  type: string
  name: string
}
const fullCalendar = ref(null)
const activeMonth = ref<string>('')
const AttendDateList = ref<Date[]>(null)

const getAttendData = () => {
  clearFullCalendarEvents()
  openLoading()
  fetch(`api/getAttendSheet?month=${activeMonth.value}`, {
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
  fullCalendar.value.getApi().addEvent({
    title: item.name,
    date: item.date,
    allDay: true,
    color: item.type === 'attend' ? '#67C23A' : '#FF4FFF'
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
  getAttendData()
}
const nextClick = () => {
  let calendarApi = fullCalendar.value.getApi()
  calendarApi.next()
  let date = new Date(calendarApi.view.currentStart)
  activeMonth.value = date.getFullYear() + '-' + (date.getMonth() + 1)
  getAttendData()
}
const todayClick = () => {
  let calendarApi = fullCalendar.value.getApi()
  calendarApi.today()
  let date = new Date(calendarApi.view.currentStart)
  activeMonth.value = date.getFullYear() + '-' + (date.getMonth() + 1)
  getAttendData()
}
const calendarOptions = {
  plugins: [dayGridPlugin, interactionPlugin],
  selectable: true,
  initialView: 'dayGridMonth',
  // dateClick: handleDateClick,
  locale: 'zh-tw',
  buttonText: {
    today: '今天'
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
  getAttendData()
})
watch(isCollapse, () => {
  setTimeout(() => {
    fullCalendar.value.getApi().updateSize()
  }, 500)
})
</script>
<template>
  <div>
    <FullCalendar ref="fullCalendar" :options="calendarOptions" />
  </div>
</template>
<style scoped lang="scss"></style>
