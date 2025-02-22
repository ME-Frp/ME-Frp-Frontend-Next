<template>
  <div class="auth-container">
    <NCard class="auth-card">
      <div class="auth-header">
        <div class="logo-link">
          <div class="title-with-icon">
            <NIcon size="32" :component="LogInOutline"/>
            <h2>登录 ME Frp</h2>
          </div>
        </div>
      </div>
      <div class="login-methods">
        <NSpace vertical size="large" style="width: 100%">
          <NButton
            block
            secondary
            strong
            @click="router.push('/auth/pwd-login')"
          >
            <template #icon>
              <NIcon :component="KeyOutline" />
            </template>
            密码登录
          </NButton>
          <NButton
            block
            secondary
            strong
            @click="router.push('/auth/mlogin')"
          >
            <template #icon>
              <NIcon :component="MailOutline" />
            </template>
            Magic Link 登录
          </NButton>
          <NButton
            block
            secondary
            strong
            @click="handleWebAuthnLogin"
            :loading="isWebAuthnLoading"
          >
            <template #icon>
              <NIcon :component="FingerPrintOutline" />
            </template>
            通行密钥登录
          </NButton>
        </NSpace>
      </div>
      <div class="form-footer register-link">
        <span>还没有账号？</span>
        <router-link to="/auth/register">立即注册</router-link>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { NCard, NButton, NIcon, NSpace, useMessage } from 'naive-ui'
import { LogInOutline, KeyOutline, MailOutline, FingerPrintOutline } from '@vicons/ionicons5'

const router = useRouter()
const message = useMessage()
const isWebAuthnLoading = ref(false)

const handleWebAuthnLogin = async () => {
  isWebAuthnLoading.value = true
  try {
    // TODO: 实现WebAuthn登录逻辑
    message.info('WebAuthn登录功能即将上线')
  } catch (error: any) {
    message.error('生物认证登录失败')
  } finally {
    isWebAuthnLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/auth/login.scss';

.login-methods {
  margin: 20px 0;

  :deep(.n-button) {
    height: 48px;
    text-align: left;
    padding: 0 20px;

    .n-button__icon {
      margin-right: 8px;
    }
  }
}
</style>