<template>
  <div class="auth-container">
    <NCard class="auth-card">
      <div class="auth-header">
        <div class="logo-link">
          <div class="title-with-icon">
            <NIcon size="32" :component="MailOutline"/>
            <h2>Magic Link 登录</h2>
          </div>
        </div>
      </div>
      <NForm ref="formRef" :model="formValue" :rules="rules">
        <NAlert type="info" style="margin-bottom: 20px">
          我们将发送链接到您的邮箱，点击链接即可登录。
        </NAlert>
        <NFormItem path="email" label="用户名或邮箱">
          <NInput v-model:value="formValue.email" placeholder="请输入用户名或邮箱" />
        </NFormItem>
        <NButton 
          type="primary" 
          block 
          secondary 
          strong 
          @click="handleSubmit"
          :loading="isSubmitting"
        >
          发送 Magic Link
        </NButton>
        <div class="form-footer register-link">
          <span>需要其他登录方式？</span>
          <router-link to="/auth/login">返回</router-link>
        </div>
      </NForm>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NForm, NFormItem, NInput, NButton, NCard, NIcon, NAlert, type FormRules, useMessage, type FormInst } from 'naive-ui'
import { MailOutline } from '@vicons/ionicons5'
import { PublicApi } from '../../shared/api/public'

const message = useMessage()

const formRef = ref<FormInst | null>(null)
const isSubmitting = ref(false)
const formValue = ref({
  email: ''
})

const rules: FormRules = {
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: 'blur',
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    isSubmitting.value = true
    const response = await PublicApi.sendMagicLink({
      user: formValue.value.email,
      callback: `${window.location.origin}/auth/mverify?mid=%s`
    })
    
    if (response.data.code === 200) {
      message.success('登录链接已发送到您的邮箱')
    } else {
      message.error(response.data.message || '发送失败')
    }
  } catch (error: any) {
    if (error?.response?.data?.message) {
      message.error(error.response.data.message)
    } else {
      message.error('发送失败，请重试')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/auth/login.scss';

</style>