<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import { openLoading, closeLoading } from '@/composables/loading'
import { isCollapse } from '@/composables/isCollapse'
const fullCalendar = ref(null)
const activeMonth = ref<string>('')
interface eventDataType {
  title: string
  start: string
  end: string
  type: string
}
const handleAddEvent = (event: eventDataType[]) => {
  clearFullCalendarEvents()
  //fetch後端取得公司行事曆事件
  let calendarapi = fullCalendar.value.getApi()
  event.forEach((item) => {
    calendarapi.addEvent({
      title: item.title,
      start: item.start,
      end: item.end,
      color: item.type === 'dayOff' ? '#FF4FFF' : '#6363FF'
    })
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
const getCalendarData = () => {
  openLoading()
  fetch(`api/getAnnouncement?month=${activeMonth.value}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.code === 200) {
        handleAddEvent(res.data)
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
const prevClick = () => {
  let calendarApi = fullCalendar.value.getApi()
  calendarApi.prev()
  let date = new Date(calendarApi.view.currentStart)
  activeMonth.value = date.getFullYear() + '-' + (date.getMonth() + 1)
  getCalendarData()
}
const nextClick = () => {
  let calendarApi = fullCalendar.value.getApi()
  calendarApi.next()
  let date = new Date(calendarApi.view.currentStart)
  activeMonth.value = date.getFullYear() + '-' + (date.getMonth() + 1)
  getCalendarData()
}
const todayClick = () => {
  let calendarApi = fullCalendar.value.getApi()
  calendarApi.today()
  let date = new Date(calendarApi.view.currentStart)
  activeMonth.value = date.getFullYear() + '-' + (date.getMonth() + 1)
  getCalendarData()
}
const calendarOptions = {
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
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
  //fetch後端取得公司行事曆事件
  let now = new Date()
  activeMonth.value = now.getFullYear() + '-' + (now.getMonth() + 1)
  getCalendarData()
})
watch(isCollapse, () => {
  setTimeout(() => {
    fullCalendar.value.getApi().updateSize()
  }, 500)
})
</script>
<template>
  <h3>公司行事曆</h3>
  <FullCalendar ref="fullCalendar" :options="calendarOptions" />
</template>
<style scoped lang="scss"></style>
