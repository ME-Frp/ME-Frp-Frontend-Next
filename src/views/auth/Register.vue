<template>
  <div class="auth-container">
    <NCard class="auth-card">
      <div class="auth-header">
        <div class="logo-link">
          <div class="title-with-icon">
            <NIcon size="32" :component="PersonAddOutline"/>
            <h2>注册 ME Frp 账户</h2>
          </div>
        </div>
      </div>
      <NForm ref="formRef" :model="formValue" :rules="rules">
        <NFormItem path="username" label="用户名">
          <NInput v-model:value="formValue.username" placeholder="请输入用户名" />
        </NFormItem>
        <NFormItem path="email" label="邮箱">
          <NInputGroup>
            <NInput v-model:value="formValue.email" placeholder="请输入邮箱" :disabled="emailCodeCountdown > 0"/>
            <NButton type="primary" ghost :disabled="isEmailCodeSending || emailCodeCountdown > 0" 
              @click="handleSendEmailCode" :loading="isEmailCodeSending">
              {{ emailCodeButtonText }}
            </NButton>
          </NInputGroup>
        </NFormItem>
        <NFormItem path="emailCode" label="验证码">
          <NInput v-model:value="formValue.emailCode" placeholder="请输入邮箱验证码" />
        </NFormItem>
        <NFormItem path="password" label="密码">
          <NInput
            v-model:value="formValue.password"
            type="password"
            placeholder="请输入密码"
            show-password-on="click"
          />
        </NFormItem>
        <NFormItem path="confirmPassword" label="确认密码">
          <NInput
            v-model:value="formValue.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password-on="click"
          />
        </NFormItem>
        <div class="form-footer">
          <span>注册即代表您同意我们的</span>
          <RouterLink to="/terms">服务条款</RouterLink>
          <span>与</span>
          <RouterLink to="/privacy">隐私政策</RouterLink>
        </div>
        <NButton 
          type="primary" 
          block 
          secondary 
          strong 
          @click="handleSubmit"
          :loading="isSubmitting"
        >
          注册
        </NButton>
        <div class="form-footer login-link">
          <span>已有账号？</span>
          <RouterLink to="/auth/login">立即登录</RouterLink>
        </div>
      </NForm>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NInput, NButton, NCard, NIcon, NInputGroup, type FormRules, useMessage, type FormInst } from 'naive-ui'
import { PersonAddOutline } from '@vicons/ionicons5'
import { PublicApi } from '../../shared/api/public'

const router = useRouter()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const isSubmitting = ref(false)
const isEmailCodeSending = ref(false)
const emailCodeCountdown = ref(0)

const formValue = ref({
  username: '',
  email: '',
  emailCode: '',
  password: '',
  confirmPassword: ''
})

const emailCodeButtonText = computed(() => {
  if (isEmailCodeSending.value) return '发送中...'
  if (emailCodeCountdown.value > 0) return `${emailCodeCountdown.value}s后重试`
  return '获取验证码'
})

const rules: FormRules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur',
    type: 'email'
  },
  emailCode: {
    required: true,
    message: '请输入验证码',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  },
  confirmPassword: {
    required: true,
    message: '请再次输入密码',
    trigger: 'blur',
    validator: (_rule: any, value: string) => {
      return value === formValue.value.password || new Error('两次输入的密码不一致')
    }
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
    if (!formValue.value.email) {
      message.error('请输入邮箱')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValue.value.email)) {
      message.error('请输入有效的邮箱地址')
      return
    }
    
    isEmailCodeSending.value = true
    const response = await PublicApi.getRegisterEmailCode(formValue.value.email)
    
    if (response.data.code === 200) {
      message.success(response.data.message)
      startEmailCodeCountdown()
      formValue.value.emailCode = ''
    } else {
      message.error(response.data.message)
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      message.error(error.response.data.message)
    } else {
      message.error(error.message || '验证码发送失败, 请重试')
    }
  } finally {
    isEmailCodeSending.value = false
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    isSubmitting.value = true
    
    const response = await PublicApi.register({
      username: formValue.value.username,
      email: formValue.value.email,
      password: formValue.value.password,
      emailCode: formValue.value.emailCode
    })
    
    if (response.data.code === 200) {
      message.success('注册成功')
      router.push('/auth/login')
    } else {
      message.error(response.data.message || '注册失败')
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      message.error(error.response.data.message)
    } else {
      message.error('注册失败, 请重试')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/auth/register.scss';
</style>