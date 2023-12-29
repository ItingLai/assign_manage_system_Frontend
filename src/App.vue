<script setup lang="ts">
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const { checkLogin } = userStore
onMounted(() => {
  nextTick(() => {
    checkLogin()
  })
})
</script>
<template>
  <RouterView />
</template>

<style scoped lang="scss"></style>
