<template>
  <n-card title="面板管理">
    <n-tabs type="line" animated>
      <n-tab-pane name="basic" tab="基础设置">
        <n-form
          ref="basicFormRef"
          :model="basicForm"
          :rules="basicRules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <n-form-item label="面板名称" path="panelName">
            <n-input v-model:value="basicForm.panelName" placeholder="请输入面板名称" />
          </n-form-item>
          <n-form-item label="面板描述" path="description">
            <n-input
              v-model:value="basicForm.description"
              type="textarea"
              placeholder="请输入面板描述"
            />
          </n-form-item>
          <n-form-item label="网站标题" path="siteTitle">
            <n-input v-model:value="basicForm.siteTitle" placeholder="请输入网站标题" />
          </n-form-item>
          <n-form-item label="备案号" path="icp">
            <n-input v-model:value="basicForm.icp" placeholder="请输入备案号" />
          </n-form-item>
          <n-space justify="end">
            <n-button type="primary" @click="handleSaveBasic">保存设置</n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <n-tab-pane name="security" tab="安全设置">
        <n-form
          ref="securityFormRef"
          :model="securityForm"
          :rules="securityRules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <n-form-item label="注册开关" path="allowRegister">
            <n-switch v-model:value="securityForm.allowRegister" />
          </n-form-item>
          <n-form-item label="邮箱验证" path="requireEmailVerification">
            <n-switch v-model:value="securityForm.requireEmailVerification" />
          </n-form-item>
          <n-form-item label="密码最小长度" path="minPasswordLength">
            <n-input-number
              v-model:value="securityForm.minPasswordLength"
              :min="6"
              :max="32"
            />
          </n-form-item>
          <n-space justify="end">
            <n-button type="primary" @click="handleSaveSecurity">保存设置</n-button>
          </n-space>
        </n-form>
      </n-tab-pane>

      <n-tab-pane name="email" tab="邮件设置">
        <n-form
          ref="emailFormRef"
          :model="emailForm"
          :rules="emailRules"
          label-placement="left"
          label-width="auto"
          require-mark-placement="right-hanging"
        >
          <n-form-item label="SMTP服务器" path="smtpHost">
            <n-input v-model:value="emailForm.smtpHost" placeholder="请输入SMTP服务器地址" />
          </n-form-item>
          <n-form-item label="SMTP端口" path="smtpPort">
            <n-input-number v-model:value="emailForm.smtpPort" :min="1" :max="65535" />
          </n-form-item>
          <n-form-item label="发件人邮箱" path="fromEmail">
            <n-input v-model:value="emailForm.fromEmail" placeholder="请输入发件人邮箱" />
          </n-form-item>
          <n-form-item label="SMTP密码" path="smtpPassword">
            <n-input
              v-model:value="emailForm.smtpPassword"
              type="password"
              placeholder="请输入SMTP密码"
              show-password-on="click"
            />
          </n-form-item>
          <n-space justify="end">
            <n-button @click="handleTestEmail">测试邮件</n-button>
            <n-button type="primary" @click="handleSaveEmail">保存设置</n-button>
          </n-space>
        </n-form>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NCard, NTabs, NTabPane, NForm, NFormItem, NInput, NInputNumber, NSwitch, NSpace, NButton, useMessage } from 'naive-ui'
import type { FormRules, FormInst } from 'naive-ui'

const message = useMessage()

const basicFormRef = ref<FormInst | null>(null)
const securityFormRef = ref<FormInst | null>(null)
const emailFormRef = ref<FormInst | null>(null)

const basicForm = ref({
  panelName: '',
  description: '',
  siteTitle: '',
  icp: ''
})

const securityForm = ref({
  allowRegister: true,
  requireEmailVerification: true,
  minPasswordLength: 8
})

const emailForm = ref({
  smtpHost: '',
  smtpPort: 465,
  fromEmail: '',
  smtpPassword: ''
})

const basicRules: FormRules = {
  panelName: {
    required: true,
    message: '请输入面板名称',
    trigger: ['blur', 'input']
  },
  siteTitle: {
    required: true,
    message: '请输入网站标题',
    trigger: ['blur', 'input']
  }
}

const securityRules: FormRules = {
  minPasswordLength: {
    required: true,
    message: '请设置密码最小长度',
    trigger: ['blur', 'input']
  }
}

const emailRules: FormRules = {
  smtpHost: {
    required: true,
    message: '请输入SMTP服务器地址',
    trigger: ['blur', 'input']
  },
  smtpPort: {
    required: true,
    message: '请输入SMTP端口',
    trigger: ['blur', 'input']
  },
  fromEmail: {
    required: true,
    message: '请输入发件人邮箱',
    trigger: ['blur', 'input']
  },
  smtpPassword: {
    required: true,
    message: '请输入SMTP密码',
    trigger: ['blur', 'input']
  }
}

const handleSaveBasic = () => {
  basicFormRef.value?.validate((errors) => {
    if (!errors) {
      message.success('保存基础设置成功')
    }
  })
}

const handleSaveSecurity = () => {
  securityFormRef.value?.validate((errors) => {
    if (!errors) {
      message.success('保存安全设置成功')
    }
  })
}

const handleSaveEmail = () => {
  emailFormRef.value?.validate((errors) => {
    if (!errors) {
      message.success('保存邮件设置成功')
    }
  })
}

const handleTestEmail = () => {
  emailFormRef.value?.validate((errors) => {
    if (!errors) {
      message.success('测试邮件发送成功')
    }
  })
}

// 获取设置
const fetchSettings = async () => {
  try {
    // TODO: 调用API获取设置
  } catch (error) {
    message.error('获取设置失败')
  }
}

fetchSettings()
</script> 