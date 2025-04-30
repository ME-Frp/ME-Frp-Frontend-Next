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
          <div class="overview-label">在线用户</div>
          <div class="overview-value">
            <NNumberAnimation :from="0" :to="totalOnlineClient" :precision="0" />
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-label">在线隧道</div>
          <div class="overview-value">
            <NNumberAnimation :from="0" :to="totalOnlineProxy" :precision="0" />
          </div>
        </div>
        <div class="overview-item">
          <div class="overview-label">今日入站流量</div>
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
          <div class="overview-label">今日出站流量</div>
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
        <NCard v-for="node in sortedNodes" :key="node.nodeId" class="node-card" :class="{ offline: !node.isOnline }">
          <div class="node-header">
            <div class="node-title">
              <NTag :bordered="false" type="info" size="small" style="margin-right: 8px"># {{ node.nodeId }}</NTag>
              {{ node.name }}
            </div>
            <NSpace>
              <NTag :bordered="false" type="info" size="small">{{ node.version }}</NTag>
              <NTag :bordered="false" :type="node.isOnline ? 'success' : 'error'" size="small">
                {{ node.isOnline ? '在线' : '离线' }}
              </NTag>
            </NSpace>
          </div>

          <div class="node-stats">
            <div class="stat-item">
              <div class="stat-label">在线隧道</div>
              <div class="stat-value">
                <NNumberAnimation :from="0" :to="node.onlineProxy" />
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-label">当前连接</div>
              <div class="stat-value">
                <NNumberAnimation :from="0" :to="node.curConns" />
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

          <div class="node-footer">
            <NText depth="3">
              {{ node.isOnline ? `已上线 ${formatUptime(node.uptime)}` : '节点离线' }}
            </NText>
          </div>
        </NCard>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTag, NDivider, NNumberAnimation, NSpace, NText } from 'naive-ui'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { AuthApi } from '../../shared/api/auth'
import type { NodeUsage } from '../../types'

const nodes = ref<NodeUsage[]>([])

// 排序后的节点列表（按节点ID升序）
const sortedNodes = computed(() => {
  return [...nodes.value].sort((a, b) => a.nodeId - b.nodeId)
})

// 计算总览数据
const totalOnlineClient = computed(() => nodes.value.reduce((sum, node) => sum + node.onlineClient, 0))
const totalOnlineProxy = computed(() => nodes.value.reduce((sum, node) => sum + node.onlineProxy, 0))
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

// 格式化在线时长
const formatUptime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds}秒`
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    return `${minutes}分钟`
  } else if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}小时${minutes}分钟`
  } else {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    return `${days}天${hours}小时`
  }
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
  timer = window.setInterval(fetchNodeStatus, 1000 * 60 * 5)
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