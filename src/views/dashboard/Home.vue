<template>
  <div class="home">
    <div class="welcome-banner">
        欢迎回来, {{ username }}
    </div>
    <div class="content-grid">
      <NCard title="用户信息" class="info-card">
        <NAlert
          v-if="userGroup === 'noRealname'"
          type="warning"
          title="未实名认证"
          style="margin-bottom: 16px"
        >
          您的账户尚未完成实名认证, 请尽快完成实名认证。<br>
          实名认证后, 您将获得更多节点权限, 且双向带宽将提升至 30Mbps。<br>
          <NButton text type="primary" @click="goToRealname">立即前往</NButton>
        </NAlert>
        <UserInfoGrid ref="userInfoGridRef" />
      </NCard>

      <NCard title="系统公告" class="notice-card">
          <div class="markdown-content" v-html="renderedNotice" />
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NAlert, NButton } from 'naive-ui'
import { ref, onMounted, computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { AuthApi } from '../../shared/api/auth'
import UserInfoGrid from '../../components/UserInfoGrid.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const notices = ref<string>('')
const username = localStorage.getItem('username')
const userGroup = ref<string>('')

// 配置 marked
marked.setOptions({
  gfm: true,
  breaks: true
})

const goToRealname = () => {
  router.push('/dashboard/profile')
}

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

// 获取用户组信息
const fetchUserGroup = async () => {
  try {
    const response = await AuthApi.getUserInfo()
    if (response.data.code === 200) {
      userGroup.value = response.data.data.group
    }
  } catch (error) {
    console.error('获取用户组信息失败:', error)
  }
}

onMounted(() => {
  fetchNotice()
  fetchUserGroup()
})
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/home.scss';
</style>