<script setup lang="ts"></script>
<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <AsideBar />
      </el-aside>
      <el-container>
        <el-header>
          <HeaderBar />
        </el-header>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style scope lang="scss">
.el-aside {
  height: 100vh;
  width: auto;
  background-color: #d1d1d1;
}
.el-main {
  overflow-y: scroll;
  width: auto;
  height: calc(100vh - 60px);
  padding-top: 0px;
}
.el-header {
  display: flex;
  justify-content: end;
  align-items: center;
  height: 60px;
}
</style>
