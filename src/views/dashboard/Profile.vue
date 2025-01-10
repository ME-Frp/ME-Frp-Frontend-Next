<template>
  <div class="profile">
    <NCard title="个人中心" class="info-card">
      <UserInfoGrid />
    </NCard>
    <NCard title="账户与安全" class="security-card">
      <div class="security-item">
        <div class="security-label">
          <span>账户密码</span>
        </div>
        <div class="security-desc">
          账户密码用于登录，请妥善保管，一经泄露请及时重置。注意，更改密码后，访问密钥也会同时更改。
        </div>
        <div class="security-value">
          <NButton size="medium" type="error" class="action-btn" @click="showPasswordResetModal">
            <template #icon>
              <NIcon>
                <KeyOutline />
              </NIcon>
            </template>
            更改密码
          </NButton>
        </div>
      </div>
      <NDivider />
      <div class="security-item">
        <div class="security-label">
          <span>访问密钥</span>
        </div>
        <div class="security-desc">
          访问密钥用于验证您的身份，请妥善保管，一经泄露请及时重置。
        </div>
        <div class="security-value">
          <div class="button-group">
            <NButton size="medium" type="error" class="action-btn" @click="showTokenResetConfirm">
              <template #icon>
                <NIcon>
                  <RefreshOutline />
                </NIcon>
              </template>
              重置访问密钥
            </NButton>
            <NButton size="medium" type="warning" class="action-btn" @click="copyToken">
              <template #icon>
                <NIcon>
                  <CopyOutline />
                </NIcon>
              </template>
              复制访问密钥
            </NButton>
          </div>
        </div>
      </div>
      <NDivider /><div class="security-item">
        <div class="security-label">
          <span>域名白名单</span>
        </div>
        <div class="security-desc">
          这里是用于 “中国大陆(不含港澳台)” 节点创建 HTTP(S) 隧道的备案域名白名单；非中国大陆节点建站，域名无需要过白。
        </div>
        <div class="security-value">
          
        </div>
      </div>
    </NCard>
    <NModal v-model:show="showTokenResetModal" preset="dialog" type="warning" title="重置访问密钥" positive-text="确认" negative-text="取消"
      @positive-click="handleTokenReset" @negative-click="closeModal">
      <div>重置后原有密钥将失效，请及时更新配置。是否继续？</div>
    </NModal>
    <NModal v-model:show="showPasswordModal" preset="card" title="重置密码" style="width: 400px">
      <NForm ref="formRef" :model="passwordForm" :rules="rules">
        <NFormItem label="原密码" path="oldPassword">
          <NInput v-model:value="passwordForm.oldPassword" type="password" placeholder="请输入原密码" show-password-on="click" />
        </NFormItem>
        <NFormItem label="新密码" path="newPassword">
          <NInput v-model:value="passwordForm.newPassword" type="password" placeholder="请输入新密码" show-password-on="click" />
        </NFormItem>
        <NFormItem label="确认密码" path="confirmPassword">
          <NInput v-model:value="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" show-password-on="click" />
        </NFormItem>
      </NForm>
      <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px">
        <NButton @click="closePasswordModal">取消</NButton>
        <NButton type="primary" :loading="loading" @click="handlePasswordReset">确认</NButton>
      </div>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NButton, NModal, useMessage, NIcon, NDivider, NForm, NFormItem, NInput } from 'naive-ui'
import { RefreshOutline, CopyOutline, KeyOutline } from '@vicons/ionicons5'
import type { FormInst } from 'naive-ui'
import UserInfoGrid from '../../components/UserInfoGrid.vue'
import { AuthApi } from '../../shared/api/auth'

const message = useMessage()
const showTokenResetModal = ref(false)
const showPasswordModal = ref(false)
const loading = ref(false)
const formRef = ref<FormInst | null>(null)

const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = {
  oldPassword: {
    required: true,
    message: '请输入原密码',
    trigger: 'blur'
  },
  newPassword: {
    required: true,
    message: '请输入新密码',
    trigger: 'blur'
  },
  confirmPassword: {
    required: true,
    message: '请再次输入新密码',
    trigger: 'blur',
    validator: (_rule: any, value: string) => {
      return value === passwordForm.value.newPassword || new Error('两次输入的密码不一致')
    }
  }
}

const showPasswordResetModal = () => {
  showPasswordModal.value = true
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const handlePasswordReset = () => {
  formRef.value?.validate(async (errors) => {
    if (errors) return

    loading.value = true
    try {
      const response = await AuthApi.passwordReset({
        oldPassword: passwordForm.value.oldPassword,
        newPassword: passwordForm.value.newPassword
      })
      if (response.data.code === 200) {
        message.success('密码重置成功，请重新登录')
        localStorage.removeItem('token')
        closePasswordModal()
        new Promise(resolve => setTimeout(resolve, 1000))
        window.location.href = '/login'
        window.location.reload()
      } else {
        message.error(response.data.message || '密码重置失败')
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || '密码重置失败')
    } finally {
      loading.value = false
    }
  })
}

const showTokenResetConfirm = () => {
  showTokenResetModal.value = true
}

const closeModal = () => {
  showTokenResetModal.value = false
}

const copyToken = () => {
  const token = localStorage.getItem('token')
  if (token) {
    navigator.clipboard.writeText(token)
    message.success('访问密钥已复制到剪贴板')
  } else {
    message.error('访问密钥不存在')
  }
}

const handleTokenReset = async () => {
  try {
    const response = await AuthApi.tokenReset()
    showTokenResetModal.value = false
    if (response.data.code === 200) {
      message.success(response.data.message || '重置成功')
      localStorage.setItem('token', response.data.data.newToken)
      await new Promise(resolve => setTimeout(resolve, 1000))
      window.location.reload()
    } else {
      message.error(response.data.message || '重置失败')
    }
  } catch (error: any) {
    message.error(error?.response?.data?.message || '重置失败')
  } finally {
    showTokenResetModal.value = false
  }
}
</script>

<style lang="scss" scoped>
.profile {
  .info-card {
    margin-bottom: 16px;
  }

  .security-card {
    margin-bottom: 16px;

    .security-item {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .security-label {
        font-size: 16px;
        color: var(--n-text-color-2);
      }

      .security-desc {
        font-size: 14px;
        color: var(--n-text-color-2);
        margin-bottom: 8px;
      }

      .security-value {
        font-size: 14px;
        color: var(--n-text-color);
      }
    }
  }

  .button-group {
    display: flex;
    gap: 8px;

    .action-btn {
      height: 32px;
      padding: 0 12px;
    }
  }
}
</style>