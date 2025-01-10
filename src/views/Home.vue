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
import { ref } from 'vue'
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
    icon: SpeedometerOutline,
    title: '高性能',
    description: '基于 Golang 开发，性能优异，内存占用低。'
  },
  {
    icon: ShieldOutline,
    title: '安全稳定', 
    description: 'BGP 线路接入，多重防护，稳定可靠，部分节点支持 DDoS 防御。'
  },
  {
    icon: CodeSlashOutline,
    title: '简单易用',
    description: '界面简洁直观，一键配置快速使用，支持多种操作系统。'
  },
  {
    icon: ServerOutline,
    title: '优质节点',
    description: '多地域节点覆盖，低延迟，高带宽。'
  },
  {
    icon: GitNetworkOutline,
    title: '全新界面',
    description: '基于 Naive UI 开发的全新 5.0 界面，美观易用。'
  },
  {
    icon: BuildOutline,
    title: '即时维护',
    description: '我们尽力及时修复故障，保障服务稳定运行。'
  }
])
</script>

<style scoped>
.home-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  padding-top: 10px;
  padding-bottom: 20px;
  text-align: center;
}

.main-title {
  margin: 16px 0 0;
  font-size: 2.5rem;
  font-weight: 600;
  background: linear-gradient(45deg, #2196F3, #42A5F5);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  margin: 16px 0 24px;
  font-size: 1.2rem;
  color: var(--n-text-color-2);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 32px;
}

.feature-card {
  height: 100%;
  text-align: center;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card h4 {
  margin: 8px 0;
  font-size: 1.1rem;
  font-weight: 500;
}

.feature-card p {
  margin: 0;
  color: var(--n-text-color-2);
  line-height: 1.6;
}

/* 调整图标和文字的间距 */
.feature-card :deep(.n-space) {
  --n-space-vertical: 8px;
}

/* 移动端适配 */
@media (max-width: 700px) {
  .home-container {
    padding: 16px;
  }

  .hero-section {
    padding: 32px 0;
  }

  .main-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
    padding: 0 16px;
  }

  .content-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-top: 24px;
  }

  .feature-card {
    margin-bottom: 0;
  }

  .feature-card p {
    font-size: 0.9rem;
  }

  .feature-card h4 {
    font-size: 1rem;
  }

  /* 禁用悬停效果 */
  .feature-card:hover {
    transform: none;
  }
}

/* 平板适配
@media (max-width: 700px) {
  .content-grid {
    grid-template-columns: repeat(2, 2fr);
  }
} */
</style>