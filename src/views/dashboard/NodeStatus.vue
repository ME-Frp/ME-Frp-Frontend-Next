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
          <div class="overview-value">
            <NNumberAnimation 
              :from="0" 
              :to="getTrafficValue(totalTrafficIn)" 
              :precision="2"
              :active="true"
              :duration="1500"
            />
            <span class="unit">{{ getTrafficUnit(totalTrafficIn) }}</span>
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-label">总出站流量</div>
          <div class="overview-value">
            <NNumberAnimation 
              :from="0" 
              :to="getTrafficValue(totalTrafficOut)" 
              :precision="2"
              :active="true"
              :duration="1500"
            />
            <span class="unit">{{ getTrafficUnit(totalTrafficOut) }}</span>
          </div>
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
                <NNumberAnimation :from="0" :to="node.onlineCount" />
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

// 获取流量单位
const getTrafficUnit = (bytes: number): string => {
  if (bytes === 0) return 'B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return sizes[i]
}

// 获取转换后的流量值
const getTrafficValue = (bytes: number): number => {
  if (bytes === 0) return 0
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2))
}

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
@use '../../assets/styles/dashboard/nodeStatus.scss';
</style>