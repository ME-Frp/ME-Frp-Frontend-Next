<template>
  <div class="auth-container">
    <NCard class="auth-card">
      <div class="auth-header">
        <div class="logo-link">
          <div class="title-with-icon">
            <NIcon size="32" :component="KeyOutline"/>
            <h2>找回 ME Frp 账户</h2>
          </div>
        </div>
      </div>
      
      <!-- 邮箱验证码表单 -->
      <NForm ref="emailFormRef" :model="emailForm" :rules="emailRules">
        <NFormItem path="email" label="邮箱">
          <NInputGroup>
            <NInput v-model:value="emailForm.email" placeholder="请输入邮箱" :disabled="emailCodeCountdown > 0"/>
            <NButton type="primary" ghost :disabled="isEmailCodeSending || emailCodeCountdown > 0" 
              @click="handleSendEmailCode" :loading="isEmailCodeSending">
              {{ emailCodeButtonText }}
            </NButton>
          </NInputGroup>
        </NFormItem>
      </NForm>

      <!-- 重置密码表单 -->
      <NForm ref="resetFormRef" :model="resetForm" :rules="resetRules">
        <NFormItem path="username" label="用户名">
          <NInput v-model:value="resetForm.username" placeholder="请输入用户名" />
        </NFormItem>
        <NFormItem path="emailCode" label="验证码">
          <NInput v-model:value="resetForm.emailCode" placeholder="请输入邮箱验证码" />
        </NFormItem>
        <NFormItem path="password" label="新密码">
          <NInput v-model:value="resetForm.password" type="password" placeholder="请输入新密码" show-password-on="click" />
        </NFormItem>
        <NButton type="primary" block secondary strong @click="handleSubmit" :loading="isSubmitting">
          重置密码
        </NButton>
      </NForm>

      <div class="form-footer login-link">
        <span>记起密码了？</span>
        <router-link to="/auth/login">返回登录</router-link>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NInput, NButton, NCard, NIcon, NInputGroup, type FormRules, useMessage, type FormInst } from 'naive-ui'
import { KeyOutline } from '@vicons/ionicons5'
import { PublicApi } from '../../shared/api/public'

const router = useRouter()
const message = useMessage()

const emailFormRef = ref<FormInst | null>(null)
const resetFormRef = ref<FormInst | null>(null)

const emailForm = ref({
  email: ''
})

const resetForm = ref({
  username: '',
  emailCode: '',
  password: ''
})

const isEmailCodeSending = ref(false)
const isSubmitting = ref(false)
const emailCodeCountdown = ref(0)

const emailCodeButtonText = computed(() => {
  if (isEmailCodeSending.value) return '发送中...'
  if (emailCodeCountdown.value > 0) return `${emailCodeCountdown.value}s后重试`
  return '获取验证码'
})

const emailRules: FormRules = {
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur',
    type: 'email'
  }
}

const resetRules: FormRules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  emailCode: {
    required: true,
    message: '请输入验证码',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入新密码',
    trigger: 'blur'
  }
}

const startEmailCodeCountdown = () => {
  emailCodeCountdown.value = 60
  const timer = setInterval(() => {
    emailCodeCountdown.value--
    if (emailCodeCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

const handleSendEmailCode = async () => {
  
  try {
    if (!emailForm.value.email) {
      message.error('请输入邮箱')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.value.email)) {
      message.error('请输入有效的邮箱地址')
      return
    }
    isEmailCodeSending.value = true
    
    const response = await PublicApi.getIForgotEmailCode(emailForm.value.email)
    if (response.data.code === 200) {
      message.success(response.data.message)
      startEmailCodeCountdown()
    } else {
      message.error(response.data.message)
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      message.error(error.response.data.message)
    }
  } finally {
    isEmailCodeSending.value = false
  }
}

const handleSubmit = async () => {
  if (!resetFormRef.value) return
  
  try {
    await resetFormRef.value.validate()
    isSubmitting.value = true
    
    const response = await PublicApi.iForgot({
      username: resetForm.value.username,
      email: emailForm.value.email,
      password: resetForm.value.password,
      emailCode: resetForm.value.emailCode
    })
    
    if (response.data.code === 200) {
      message.success('密码重置成功')
      router.push('/auth/login')
    } else {
      message.error(response.data.message || '密码重置失败')
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      message.error(error.response.data.message)
    } else {
      message.error('操作失败，请重试')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/auth/iForgot.scss';
</style>