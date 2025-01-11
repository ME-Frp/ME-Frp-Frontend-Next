<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-loading-bar-provider>
            <HomeMenu v-if="!isDashboard" />
            <RouterView v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </RouterView>
            <HomeFooter v-if="!isDashboard" />
            <NGlobalStyle />
          </n-loading-bar-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, provide } from 'vue'
import { useRoute } from 'vue-router'
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
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const theme = ref(localStorage.getItem('theme') ?
  (localStorage.getItem('theme') === 'dark' ? darkTheme : null) :
  (prefersDark ? darkTheme : null)
)

// 监听系统主题变化
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    theme.value = e.matches ? darkTheme : null
  }
})

// 提供主题切换函数给全局
const toggleTheme = (isDark: boolean) => {
  theme.value = isDark ? darkTheme : null
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
}

// 提供给全局使用
provide('theme', {
  theme,
  toggleTheme
})
</script>

<style lang="scss">
@use "./assets/styles/dashboard.scss";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
