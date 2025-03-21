<template>
  <div class="home">
    <div class="welcome-banner">
      欢迎回来, {{ username }}
    </div>
    <div class="content-grid">
      <!-- 左侧列：用户信息和广告 -->
      <div class="left-column">
        <NCard title="用户信息" class="info-card">
          <NAlert v-if="userGroup === 'noRealname'" type="warning" title="未实名认证" style="margin-bottom: 16px">
            您的账户尚未完成实名认证, 请尽快完成实名认证。<br>
            实名认证后, 您将获得更多节点权限, 且双向带宽将提升至 30Mbps。<br>
            <NButton text type="primary" @click="goToRealname">立即前往</NButton>
          </NAlert>
          <UserInfoGrid ref="userInfoGridRef" />
        </NCard>

        <!-- 广告区域 -->
        <NCard :title="devTitle" class="dev-card">
          <div class="dev-container">
            <DevSpace ref="devSpaceRef" placement="home" v-model:title="devTitle" />
          </div>
        </NCard>
      </div>

      <!-- 右侧列：系统公告 -->
      <NCard title="系统公告" class="notice-card">
        <div class="markdown-content" v-html="renderedNotice" />
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NAlert, NButton } from 'naive-ui'
import { ref, onMounted, computed, watch } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { AuthApi } from '../../shared/api/auth'
import UserInfoGrid from '../../components/UserInfoGrid.vue'
import DevSpace from '../../components/DevSpace.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const devSpaceRef = ref(null)
const devTitle = ref('推荐服务')

// 监听广告组件引用变化
watch(devSpaceRef, (newRef) => {
  if (newRef) {
    if (newRef.ads?.value?.length > 0) {
      devTitle.value = newRef.getCurrentDevTitle();
    }
  }
}, { immediate: true });

const notices = ref<string>('')
const username = localStorage.getItem('username')
const userInfoGridRef = ref<null | { userInfo: { group: string } }>(null)
const userGroup = localStorage.getItem('group')

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

onMounted(() => {
  fetchNotice()
})
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/home.scss';
</style>