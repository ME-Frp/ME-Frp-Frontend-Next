<template>
  <HomeMenu v-if="shouldShow" />
  <RouterView v-slot="{ Component }" @vue:before-update="shouldShowFooter = false" @vue:updated="shouldShowFooter = true">
    <transition name="fade" mode="out-in" appear>
      <component :is="Component" />
    </transition>
  </RouterView>

  <HomeFooter v-show="shouldShowFooter" v-if="shouldShow" />

  <NGlobalStyle />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { NGlobalStyle, useLoadingBar, useMessage, useDialog, useNotification } from 'naive-ui'
import HomeMenu from './HomeMenu.vue'
import HomeFooter from './HomeFooter.vue'
import { Window } from '../types'

// 声明window类型
declare const window: Window

const route = useRoute()

const shouldShowFooter = ref(false)

const shouldShow = computed(() => {
  return !route.path.startsWith('/dashboard') && !route.path.startsWith('/docs')
})

// 初始化全局UI组件
onMounted(() => {
  // 在组件挂载后，将UI组件实例挂载到window对象上
  window.$loadingBar = useLoadingBar()
  window.$message = useMessage()
  window.$dialog = useDialog()
  window.$notification = useNotification()
})
</script> 