<template>
  <div>
    <div class="user-info-grid">
      <template v-if="loading">
        <div v-for="i in 8" :key="i" class="user-info-item">
          <NSkeleton :sharp="false" size="medium" />
        </div>
      </template>
      <template v-else>
        <div class="user-info-item">
          <NText depth="3" style="font-size: 13px;">用户名</NText>
          <div class="user-info-value">{{ userInfo.username }}</div>
        </div>

        <div class="user-info-item">
          <NText depth="3" style="font-size: 13px;">用户 ID</NText>
          <div class="user-info-value">
            <NTag :bordered="false" type="warning" size="small">
              # {{ userInfo.userId }}
            </NTag>
          </div>
        </div>

        <div class="user-info-item">
          <NText depth="3" style="font-size: 13px;">实名认证</NText>
          <div class="user-info-value">
            <NTag :bordered="false" :type="userInfo.isRealname ? 'success' : 'default'" size="small">
              {{ userInfo.isRealname ? '已实名' : '未实名' }}
            </NTag>
          </div>
        </div>

        <div class="user-info-item">
          <NText depth="3" style="font-size: 13px;">用户组</NText>
          <div class="user-info-value">
            <NTag :bordered="false" type="info" size="small">
              {{ userInfo.friendlyGroup }}
            </NTag>
          </div>
        </div>

        <div class="user-info-item">
          <NText depth="3" style="font-size: 13px;">注册时间</NText>
          <div class="user-info-value">{{ formattedRegTime }}</div>
        </div>

        <div class="user-info-item">
          <NText depth="3" style="font-size: 13px;">注册邮箱</NText>
          <div class="user-info-value">{{ userInfo.email }}</div>
        </div>

        <div class="user-info-item">
          <NText depth="3" style="font-size: 13px;">隧道数量</NText>
          <div class="user-info-value">{{ userInfo.usedProxies }} / {{ userInfo.maxProxies }}</div>
        </div>

        <div class="user-info-item">
          <NText depth="3" style="font-size: 13px;">剩余流量</NText>
          <div class="user-info-value">
            {{ formattedTraffic }}
          </div>
        </div>

        <div class="user-info-item">
          <NText depth="3" style="font-size: 13px;">入站带宽</NText>
          <div class="user-info-value">{{ userInfo.inBound / 128 }} Mbps</div>
        </div>

        <div class="user-info-item">
          <NText depth="3" style="font-size: 13px;">出站带宽</NText>
          <div class="user-info-value">{{ userInfo.outBound / 128 }} Mbps</div>
        </div>

        <div class="vip-info-item" v-if="userInfo.group === 'vip'">
          <NText depth="1" style="font-size: 13px; font-weight: bold">VIP 到期时间</NText>
          <div class="user-info-value">{{ formatTime(userInfo.vipExpireTime) }}</div>
        </div>
      </template>
    </div>

    <div class="sign-section" v-if="!loading">
      <NSpace vertical :size="4">
        <NButton text type="primary" :loading="signLoading" :disabled="!isSignAvailable" @click="handleSign">
          <template #icon>
            <NIcon>
              <CalendarOutline />
            </NIcon>
          </template>
          {{ signButtonText }}
        </NButton>
        <NText depth="3" style="font-size: 13px;">签到一次可以获得 5~10 GB 的流量</NText>
      </NSpace>
    </div>

    <div v-if="!loading && !isProfilePage && userInfo.token" class="token-section">
      <NButton text type="info" @click="copyToken">
        <template #icon>
          <NIcon>
            <KeyOutline />
          </NIcon>
        </template>
        复制访问密钥
      </NButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { NTag, useMessage, NSkeleton, NButton, NIcon, NSpace, NText, useDialog } from 'naive-ui'
import { CalendarOutline, KeyOutline } from '@vicons/ionicons5'
import { type UserInfo } from '../types'
import { AuthApi } from '../shared/api/auth'
import { useRoute } from 'vue-router'

const message = useMessage()
const dialog = useDialog()
const route = useRoute()
const loading = ref(true)
const signLoading = ref(false)
const isSignAvailable = ref(false)

// 判断当前是否在Profile页面
const isProfilePage = computed(() => route.path === '/dashboard/profile')

const userInfo = ref<UserInfo>({
  userId: 0,
  username: '',
  isRealname: false,
  group: '',
  friendlyGroup: '',
  usedProxies: 0,
  maxProxies: 0,
  regTime: 0,
  traffic: 0,
  outBound: 0,
  inBound: 0,
  email: '',
  status: 0,
  todaySigned: false,
  vipExpireTime: 0,
})

const formatTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

const formatTraffic = (traffic: number) => {
  const value = traffic
  if (isNaN(value)) return traffic
  if (value >= 1024) {
    return `${(value / 1024).toFixed(2)} GB`
  }
  return `${value.toFixed(2)} MB`
}

const formattedRegTime = computed(() => formatTime(userInfo.value.regTime))
const formattedTraffic = computed(() => formatTraffic(userInfo.value.traffic))
const signButtonText = computed(() => signLoading.value ? '签到中...' : (isSignAvailable.value ? '签到' : '已签到'))

// 执行签到
const handleSign = async () => {
  if (!isSignAvailable.value || signLoading.value) return

  try {
    signLoading.value = true
    const response = await AuthApi.sign()
    if (response.data.code === 200) {
      dialog.info({
        title: '签到成功',
        content: response.data.message,
        positiveText: '确定',
        closable: true
      })
      isSignAvailable.value = false
      // 刷新用户信息以更新流量显示
      await fetchUserInfo()
    } else {
      message.error(response.data.message || '签到失败')
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      message.error(error.response.data.message)
    } else {
      message.error('签到失败, 请重试')
    }
  } finally {
    signLoading.value = false
  }
}

const fetchUserInfo = async () => {
  try {
    loading.value = true
    const response = await AuthApi.getUserInfo()
    if (response.data.code === 200) {
      userInfo.value = response.data.data
      isSignAvailable.value = !response.data.data.todaySigned
      localStorage.setItem('group', userInfo.value.group)

      // 直接从localStorage获取token
      userInfo.value.token = localStorage.getItem('token') || ''
    } else {
      message.error(response.data.message || '获取用户信息失败')
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      message.error(error.response.data.message)
    } else {
      message.error('获取用户信息失败, 请重试')
    }
  } finally {
    loading.value = false
  }
}

// 复制用户访问密钥
const copyToken = () => {
  if (!userInfo.value.token) {
    message.warning('无法获取访问密钥')
    return
  }

  navigator.clipboard.writeText(userInfo.value.token)
    .then(() => {
      message.success('访问密钥已复制到剪贴板')
    })
    .catch(() => {
      message.error('复制失败，请手动复制')
    })
}

onMounted(async () => {
  await fetchUserInfo()
})
</script>

<style lang="scss" scoped>
@use '../assets/styles/components/userInfoGrid.scss';
</style>
