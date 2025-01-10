<template>
  <div class="home">
    <div class="welcome-banner">
        欢迎回来，{{ username }}
    </div>
    <div class="content-grid">
      <NCard title="用户信息" class="info-card">
        <UserInfoGrid ref="userInfoGridRef" />
      </NCard>

      <n-card title="系统公告" class="notice-card">
        <NTimeline>
          <NTimelineItem v-for="notice in notices" :key="notice.id" :title="notice.title" :time="notice.time">
            {{ notice.content }}
          </NTimelineItem>
        </NTimeline>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTimeline, NTimelineItem } from 'naive-ui'
import { ref } from 'vue'
import { type Notice, mockNotices } from '../../types'
import UserInfoGrid from '../../components/UserInfoGrid.vue'

const notices = ref<Notice[]>(mockNotices)
const username = localStorage.getItem('username')
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/home.scss';
</style>