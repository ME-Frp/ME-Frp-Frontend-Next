<template>
  <NConfigProvider :theme="theme" :theme-overrides="getThemeOverrides()">
    <NDialogProvider>
      <NMessageProvider>
        <NNotificationProvider>
          <NLoadingBarProvider>
            <AppContent />
          </NLoadingBarProvider>
        </NNotificationProvider>
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
  darkTheme
} from 'naive-ui'
import { getThemeOverrides } from './constants/theme'
import AppContent from './components/AppContent.vue'

console.log(`    __  _________   ______         
   /  |/  / ____/  / ____/________ 
  / /|_/ / __/    / /_  / ___/ __ \\
 / /  / / /___   / __/ / /  / /_/ /
/_/  /_/_____/  /_/   /_/  / .___/ 
                          /_/      `);
console.log("Copyright 2025, The ME Frp Project.");
console.log("No redistribution allowed.");

// 主题状态
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
const isDarkMode = ref(prefersDark.matches)
const theme = computed(() => isDarkMode.value ? darkTheme : null)


// 监听系统主题变化
prefersDark.addEventListener('change', (e) => {
  isDarkMode.value = e.matches
})

// 主题切换函数
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
}

// 提供给全局使用
provide('theme', {
  isDarkMode,
  theme,
  toggleTheme,
})
</script>

<style lang="scss">
@use "./assets/styles/transitions.scss";
input, textarea, select {
  font-size: 16px !important;
}

@media screen and (max-width: 768px) {
  input, textarea, select {
    font-size: 16px !important;
  }
}
</style>