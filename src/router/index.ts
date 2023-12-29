import { createRouter, createWebHistory } from 'vue-router'
import { storeToRefs } from 'pinia'
import layouts from '@/layouts/layouts.vue'
import { useUserStore } from '@/stores/user'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      name: 'layouts',
      component: layouts,
      meta: { isAuth: true },
      children: [
        {
          path: '',
          name: 'Home',
          meta: { title: '公司行事曆' },
          component: () => import('@/views/calendar.vue')
        },
        {
          path: 'personalManage',
          name: 'personalManage',
          meta: { title: '人事管理' },
          component: () => import('@/views/personalManage.vue')
        },
        {
          path: 'managerLeave',
          name: 'managerLeave',
          meta: { title: '請假審核' },
          component: () => import('@/views/managerLeave.vue')
        },
        {
          path: 'applyLeave',
          name: 'applyLeave',
          meta: { title: '請假申請' },
          component: () => import('@/views/applyLeave.vue')
        },
        {
          path: 'addAnnouncement',
          name: 'addAnnouncement',
          meta: { title: '新增公告' },
          component: () => import('@/views/addAnnouncement.vue')
        },
        {
          path: 'manualAttend',
          name: 'manualAttend',
          meta: { title: '調整個別出席狀況' },
          component: () => import('@/views/manualAttend.vue')
        },
        {
          path: 'salaryCalc',
          name: 'salaryCalc',
          meta: { title: '薪資計算' },
          component: () => import('@/views/salaryCalc.vue')
        },
        {
          path: 'salaryInfo',
          name: 'salaryInfo',
          meta: { title: '薪資條' },
          component: () => import('@/views/salaryInfo.vue')
        },
        {
          path: 'allSalaryInfo',
          name: 'allSalaryInfo',
          meta: { title: '所有薪資資訊' },
          component: () => import('@/views/allSalaryInfo.vue')
        },
        {
          path: 'salaryCheck',
          name: 'salaryCheck',
          meta: { title: '薪資核對' },
          component: () => import('@/views/salaryCheck.vue')
        },
        {
          path: '/uploadCalendar',
          name: 'uploadCalendar',
          meta: { title: '匯入行事曆' },
          component: () => import('@/views/uploadCalendar.vue')
        },
        {
          path: '/renewPassword',
          name: 'renewPassword',
          meta: { title: '修改密碼' },
          component: () => import('@/views/renewPassword.vue')
        },
        {
          path: '/attendSheet',
          name: 'attendSheet',
          meta: { title: '排班表' },
          component: () => import('@/views/attendSheet.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      meta: { isAuth: false, title: '登入' },
      component: () => import('@/views/login.vue')
    },
    {
      path: '/:pathMatch(.*)',
      redirect: '/PageNotFound'
    },
    {
      path: '/PageNotFound',
      name: '404',
      meta: { isAuth: false, title: 'Page Not Found' },
      component: () => import('@/views/Error404.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = (to.meta.title as string) + '|排班管理系統'
  if (to.meta.isAuth) {
    const userStore = useUserStore()
    const { isLogin } = storeToRefs(userStore)
    if (!isLogin.value) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
