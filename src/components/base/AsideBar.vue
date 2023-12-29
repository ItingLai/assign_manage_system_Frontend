<script setup lang="ts">
import { isCollapse } from '@/composables/isCollapse'
import { useUserStore } from '@/stores/user'
const user = useUserStore()
const { type } = storeToRefs(user)

const router_path = {
  normal: {
    leave: {
      path: '/applyLeave',
      title: '請假申請',
      icon: 'DocumentAdd'
    }
  },
  manager: {
    leave: {
      path: '/applyLeave',
      title: '請假申請',
      icon: 'DocumentAdd'
    },
    manager_leave: {
      path: '/managerLeave',
      title: '請假審核',
      icon: 'Files'
    }
  },
  personal: {
    leave: {
      path: '/applyLeave',
      title: '請假申請',
      icon: 'DocumentAdd'
    },
    personal_manage: {
      path: '/personalManage',
      title: '人事管理',
      icon: 'List'
    },
    manager_leave: {
      path: '/managerLeave',
      title: '請假審核',
      icon: 'Files'
    },
    manual_leave: {
      path: '/manualAttend',
      title: '調整個別出席狀況',
      icon: 'MagicStick'
    },
    salary_calc: {
      path: '/salaryCalc',
      title: '薪資計算',
      icon: 'Cpu'
    },
    uploadCalendar: {
      path: '/uploadCalendar',
      title: '匯入行事曆',
      icon: 'Upload'
    }
  },
  accountant: {
    leave: {
      path: '/applyLeave',
      title: '請假申請',
      icon: 'DocumentAdd'
    },
    salary_calc: {
      path: '/salaryCalc',
      title: '薪資計算',
      icon: 'Cpu'
    },
    salary_check: {
      path: '/salaryCheck',
      title: '薪資核對',
      icon: 'Check'
    }
  },
  boss: {
    personal_manage: {
      path: '/personalManage',
      title: '人事管理',
      icon: 'List'
    },
    manager_leave: {
      path: '/managerLeave',
      title: '請假審核',
      icon: 'Files'
    },
    post_calendar: {
      path: '/addAnnouncement',
      title: '新增行事曆事項',
      icon: 'Plus'
    },
    allSalary: {
      path: '/allSalaryInfo',
      title: '薪資總覽',
      icon: 'Money'
    }
  }
}
</script>
<template>
  <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="isCollapse" router>
    <div style="display: flex; justify-content: center; align-items: center">
      <h1 v-show="!isCollapse" style="color: black; cursor: pointer" @click="$router.push('/')">
        排班管理系統
      </h1>
    </div>
    <el-menu-item
      v-for="(path, idx) in router_path[type]"
      :key="idx"
      :index="path.path"
      :class="$route.path === path.path ? 'link-active' : ''"
    >
      <el-icon>
        <component :is="path.icon" />
      </el-icon>
      <template #title>
        <span>{{ path.title }}</span>
      </template>
    </el-menu-item>
    <el-menu-item index="attendSheet" :class="$route.path === '/attendSheet' ? 'link-active' : ''">
      <el-icon>
        <Checked />
      </el-icon>
      <template #title>
        <span>排班表 </span>
      </template>
    </el-menu-item>
    <el-menu-item index="salaryInfo" :class="$route.path === '/salaryInfo' ? 'link-active' : ''">
      <el-icon>
        <Coin />
      </el-icon>
      <template #title>
        <span>薪資條 </span>
      </template>
    </el-menu-item>
    <el-menu-item index="/" :class="$route.path === '/' ? 'link-active' : ''">
      <el-icon>
        <Calendar />
      </el-icon>
      <template #title>
        <span>公司行事曆 </span>
      </template>
    </el-menu-item>
  </el-menu>
</template>
<style scope lang="scss">
.el-menu {
  background-color: #d1d1d1;
  width: 200px;
  border-right: none;
  &.el-menu--collapse {
    width: 60px;
    &h1 {
      display: none;
    }
  }
}
.el-menu-item.is-active {
  color: unset;
}
.el-menu-item.link-active {
  background-color: #4d8fed;
  color: white;
  &:hover {
    background-color: white;
    color: #4d8fed;
  }
}
</style>
