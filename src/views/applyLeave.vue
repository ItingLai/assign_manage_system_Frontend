<script setup lang="ts">
const activeName = ref<string>('apply')
</script>
<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="請假申請" name="apply" lazy>
        <Leave />
      </el-tab-pane>
      <el-tab-pane label="申請紀錄" name="history" lazy>
        <LeaveHistory />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style scope lang="scss"></style>
