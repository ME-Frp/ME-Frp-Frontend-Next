<template>
  <div class="home">
    <div class="welcome-banner">
        欢迎回来，{{ username }}
    </div>
    <div class="content-grid">
      <NCard title="用户信息" class="info-card">
        <UserInfoGrid ref="userInfoGridRef" />
      </NCard>

      <NCard title="系统公告" class="notice-card">
          <div class="markdown-content" v-html="renderedNotice" />
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard } from 'naive-ui'
import { ref, onMounted, computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { AuthApi } from '../../shared/api/auth'
import UserInfoGrid from '../../components/UserInfoGrid.vue'

const notices = ref<string>('')
const username = localStorage.getItem('username')

// 配置 marked
marked.setOptions({
  gfm: true,
  breaks: true
})

const renderedNotice = computed(() => {
  if (!notices.value) return ''
  try {
    const html = marked.parse(notices.value) as string
    return DOMPurify.sanitize(html)
  } catch {
    return ''
  }
})

const fetchNotice = async (): Promise<void> => {
  try {
    const data = await AuthApi.getNotice()
    if (data.data.code !== 200) {
      throw new Error('获取公告失败')
    }
    notices.value = data.data.data
  } catch (error) {
    console.error('获取公告失败:', error)
  }
}

onMounted(() => {
  fetchNotice()
})
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/home.scss';
</style>