<template>
  <div class="auth-container">
    <NCard class="auth-card">
      <div class="auth-header">
        <router-link to="/" class="logo-link">
          <h2>ME Frp</h2>
        </router-link>
        <NTabs
          v-model:value="currentTab"
          size="large"
          justify-content="space-evenly"
          @update:value="handleTabChange"
        >
          <NTab name="login">登录</NTab>
          <NTab name="register">注册</NTab>
        </NTabs>
      </div>
      <router-view></router-view>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NCard, NTabs, NTab } from 'naive-ui'

const route = useRoute()
const router = useRouter()

const currentTab = computed(() => {
  const path = route.path
  if (path.includes('register')) return 'register'
  return 'login'
})

const handleTabChange = (value: string) => {
  router.push(`/auth/${value}`)
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/auth/authLayout.scss';
</style> 