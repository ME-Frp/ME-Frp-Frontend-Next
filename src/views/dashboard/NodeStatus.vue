<template>
  <div class="node-status">
    <NCard title="节点监控">
      <div class="overview">
        <div class="overview-item">
          <div class="overview-label">总节点数</div>
          <div class="overview-value">
            <NNumberAnimation :from="0" :to="nodes.length" :precision="0" />
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-label">在线节点</div>
          <div class="overview-value">
            <NNumberAnimation :from="0" :to="nodes.filter(n => n.isOnline).length" :precision="0" />
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-label">总在线隧道</div>
          <div class="overview-value">
            <NNumberAnimation :from="0" :to="totalOnlineCount" :precision="0" />
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-label">总入站流量</div>
          <div class="overview-value">{{ formatTraffic(totalTrafficIn) }}</div>
        </div>
        <div class="overview-item">
          <div class="overview-label">总出站流量</div>
          <div class="overview-value">{{ formatTraffic(totalTrafficOut) }}</div>
        </div>
      </div>

      <NDivider />

      <div class="node-grid">
        <NCard v-for="node in nodes" :key="node.nodeId" class="node-card" :class="{ offline: !node.isOnline }">
          <div class="node-header">
            <div class="node-title">
              <NTag type="info" size="small" style="margin-right: 8px"># {{ node.nodeId }}</NTag>
              {{ node.name }}
            </div>
            <NTag :type="node.isOnline ? 'success' : 'error'" size="small">
              {{ node.isOnline ? '在线' : '离线' }}
            </NTag>
          </div>

          <div class="node-stats">
            <div class="stat-item">
              <div class="stat-label">在线隧道</div>
              <div class="stat-value">
                <NNumberAnimation :from="0" :to="node.onlineCount" :precision="2" />
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-label">入站流量</div>
              <div class="stat-value">{{ formatTraffic(node.totalTrafficIn) }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">出站流量</div>
              <div class="stat-value">{{ formatTraffic(node.totalTrafficOut) }}</div>
            </div>
          </div>
        </NCard>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTag, NDivider, NNumberAnimation } from 'naive-ui'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { AuthApi } from '../../shared/api/auth'
import type { NodeUsage } from '../../types'

const nodes = ref<NodeUsage[]>([])

// 计算总览数据
const totalOnlineCount = computed(() => nodes.value.reduce((sum, node) => sum + node.onlineCount, 0))
const totalTrafficIn = computed(() => nodes.value.reduce((sum, node) => sum + node.totalTrafficIn, 0))
const totalTrafficOut = computed(() => nodes.value.reduce((sum, node) => sum + node.totalTrafficOut, 0))

const formatTraffic = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const fetchNodeStatus = async () => {
  try {
    const { data: { data } } = await AuthApi.getNodeStatus()
    nodes.value = data
  } catch (error) {
    console.error('获取节点状态失败:', error)
  }
}

// 定时刷新
let timer: number | null = null

onMounted(() => {
  fetchNodeStatus()
  timer = window.setInterval(fetchNodeStatus, 1000 * 60 * 30)
})

onUnmounted(() => {
  if (timer) {
    window.clearInterval(timer)
  }
})
</script>

<style lang="scss" scoped>
.overview {
  display: flex;
  flex-direction: row;

  .overview-item {
    text-align: left;
    padding: 8px 12px;
    background: var(--n-color);
    border-radius: 8px;

    .overview-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 4px;
    }

    .overview-value {
      font-size: 20px;
      font-weight: 500;
      color: var(--n-text-color);
    }
  }
}

.node-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 8px;
}

.node-card {
  transition: all 0.3s ease;

  &.offline {
    opacity: 0.7;
  }

  .node-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .node-title {
      display: flex;
      align-items: center;
      font-weight: 500;
    }
  }

  .node-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    .stat-item {
      text-align: center;

      .stat-label {
        font-size: 13px;
        color: #666;
        margin-bottom: 4px;
      }

      .stat-value {
        font-size: 15px;
        font-weight: 500;
        color: var(--n-text-color);
      }
    }
  }
}
</style>