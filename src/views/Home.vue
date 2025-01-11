<template>
  <div class="home-container">
    <!-- 主标题 -->
    <div class="hero-section">
      <n-space vertical align="center">
        <h1 class="main-title">ME Frp 镜缘映射</h1>
        <p class="subtitle">免费 公益 好用 低延迟 稳定的 Frp 内网穿透</p>
        <n-space>
          <n-button type="primary" size="large" @click="router.push('/auth/login')">
            开始使用
          </n-button>
          <n-button size="large" @click="router.push('/docs')">
            使用文档
          </n-button>
        </n-space>
      </n-space>
    </div>

    <!-- 特色功能卡片 -->
    <div class="content-grid">
      <n-card v-for="feature in features" :key="feature.title" class="feature-card">
        <n-space vertical align="center">
          <n-icon size="36" :component="feature.icon" />
          <h4>{{ feature.title }}</h4>
          <p>{{ feature.description }}</p>
        </n-space>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import { useRouter } from 'vue-router'
import {
  NSpace,
  NButton,
  NCard,
  NIcon
} from 'naive-ui'
import {
  SpeedometerOutline,
  ShieldOutline,
  CodeSlashOutline,
  ServerOutline,
  HeartOutline,
  GitNetworkOutline,
  BuildOutline
} from '@vicons/ionicons5'

const router = useRouter()

// 特色功能
const features = ref([
  {
    icon: markRaw(SpeedometerOutline),
    title: '高性能',
    description: '基于 Golang 开发，性能优异，内存占用低。'
  },
  {
    icon: markRaw(ShieldOutline),
    title: '安全稳定', 
    description: 'BGP 线路接入，多重防护，稳定可靠，部分节点支持 DDoS 防御。'
  },
  {
    icon: markRaw(CodeSlashOutline),
    title: '简单易用',
    description: '界面简洁直观，一键配置快速使用，支持多种操作系统。'
  },
  {
    icon: markRaw(ServerOutline),
    title: '优质节点',
    description: '多地域节点覆盖，低延迟，高带宽。'
  },
  {
    icon: markRaw(GitNetworkOutline),
    title: '全新界面',
    description: '基于 Naive UI 开发的全新 5.0 界面，美观易用。'
  },
  {
    icon: markRaw(BuildOutline),
    title: '即时维护',
    description: '我们尽力及时修复故障，保障服务稳定运行。'
  }
])
</script>

<style lang="scss" scoped>
@use '../assets/styles/home.scss';
</style>