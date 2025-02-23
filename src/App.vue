<template>
  <NConfigProvider :theme="theme" :theme-overrides="themeOverrides">
    <NDialogProvider>
      <NMessageProvider>
        <NNotificationProvider>
          <NLoadingBarProvider>
            <HomeMenu v-if="!isDashboard" />
            <RouterView v-slot="{ Component }">
              <transition name="fade" mode="out-in" appear>
                <component :is="Component" />
              </transition>
            </RouterView>
            <HomeFooter v-if="!isDashboard" />
            <NGlobalStyle />
          </NLoadingBarProvider>
        </NNotificationProvider>
      </NMessageProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import {
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
  NDialogProvider,
  NNotificationProvider,
  NLoadingBarProvider,
  darkTheme
} from 'naive-ui'
import HomeMenu from './components/HomeMenu.vue'
import HomeFooter from './components/HomeFooter.vue'
import { themeOverrides } from './constants/theme'

console.log(`    __  _________   ______         
   /  |/  / ____/  / ____/________ 
  / /|_/ / __/    / /_  / ___/ __ \\
 / /  / / /___   / __/ / /  / /_/ /
/_/  /_/_____/  /_/   /_/  / .___/ 
                          /_/      `);
console.log("Copyright 2025, The ME Frp Project Team.");
console.log("No redistribution allowed.");

const route = useRoute()
const isDashboard = computed(() => route.path.startsWith('/dashboard'))

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
  toggleTheme
})
</script>

<style>
/* 防止 iOS 设备输入时自动放大 */
input, textarea, select {
  font-size: 16px !important;
}

@media screen and (max-width: 768px) {
  input, textarea, select {
    font-size: 16px !important;
  }
}
</style>