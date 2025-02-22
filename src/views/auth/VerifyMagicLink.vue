<template>
  <div class="auth-container">
    <NCard class="auth-card">
      <div class="auth-header">
        <div class="logo-link">
          <div class="title-with-icon">
            <NIcon size="32" :component="PersonOutline" />
            <h2>验证 Magic Link</h2>
          </div>
        </div>
      </div>
      <div class="verify-content" v-if="!error">
        <NSpin size="large" :show="isVerifying">
          <div class="verify-message">
            <NIcon size="48" :component="CheckmarkCircleOutline" class="success-icon" />
            <p>{{ verifyMessage }}</p>
          </div>
        </NSpin>
      </div>
      <div class="verify-error" v-else>
        <NIcon size="48" :component="CloseCircleOutline" class="error-icon" />
        <p>{{ error }}</p>
        <NButton type="primary" secondary strong @click="goToLogin">返回登录</NButton>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NCard, NIcon, NSpin, NButton } from 'naive-ui'
import { CheckmarkCircleOutline, CloseCircleOutline, PersonOutline } from '@vicons/ionicons5'
import { PublicApi } from '../../shared/api/public'

const router = useRouter()
const route = useRoute()

const isVerifying = ref(true)
const error = ref('')
const verifyMessage = ref('正在验证您的登录请求...')

const goToLogin = () => {
  router.push('/auth/login')
}

onMounted(async () => {
  const mid = route.query.mid as string

  if (!mid) {
    error.value = '无效的验证链接'
    isVerifying.value = false
    return
  }

  try {
    const response = await PublicApi.verifyMagicLink({
      mid
    })

    if (response.data.code === 200) {
      localStorage.setItem('token', response.data.data.token)
      localStorage.setItem('username', response.data.data.username)
      localStorage.setItem('group', response.data.data.group)
      verifyMessage.value = '登录成功，即将跳转...'
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 2500)
      }).then(() => {
        router.push('/dashboard')
      })
    } else {
      error.value = response.data.message || '验证失败'
    }
  } catch (err: any) {
    error.value = err?.response?.data?.message || '验证失败，请重试'
  } finally {
    isVerifying.value = false
  }
})
</script>

<style lang="scss" scoped>
@use '../../assets/styles/auth/login.scss';

.verify-content,
.verify-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
  text-align: center;

  .success-icon {
    color: var(--success-color);
    margin-bottom: 16px;
  }

  .error-icon {
    color: var(--error-color);
    margin-bottom: 16px;
  }

  p {
    margin: 8px 0 16px;
    font-size: 16px;
    color: var(--n-text-color-2);
  }
}

.verify-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>