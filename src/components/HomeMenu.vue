<template>
  <n-layout-header bordered class="navbar">
    <div class="navbar-content">
      <div class="logo">
        <router-link to="/" class="logo-link">
          <h2>ME Frp 镜缘映射</h2>
        </router-link>
      </div>

      <!-- 桌面端菜单 -->
      <div class="nav-links">
        <n-space class="desktop-menu">
          <router-link to="/dashboard">
            <NButton strong secondary type="primary">管理面板</NButton>
          </router-link>
        </n-space>
      </div>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import { NLayoutHeader, NButton, NSpace } from 'naive-ui'
</script>

<style lang="scss" scoped>
@use '../assets/styles/components/homeMenu.scss';
</style>
