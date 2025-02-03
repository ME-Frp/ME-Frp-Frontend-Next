<template>
  <div>
    <NCard title="系统管理">
      <NTabs type="line" animated @update:value="handleTabUpdate">
        <NTabPane name="basic" tab="基础设置">
          <NForm ref="basicFormRef" :model="basicForm" :rules="basicRules" label-placement="left" label-width="auto"
            require-mark-placement="right-hanging">
            <NFormItem label="公告内容" path="notice">
              <NInput v-model:value="basicForm.notice" type="textarea" placeholder="请输入公告内容" :rows="15" />
            </NFormItem>
            <NSpace justify="end">
              <NButton type="primary" @click="handleSaveBasic">保存设置</NButton>
            </NSpace>
          </NForm>
        </NTabPane>

        <NTabPane name="security" tab="安全设置">
          <NForm ref="securityFormRef" :model="securityForm" :rules="securityRules" label-placement="left"
            label-width="auto" require-mark-placement="right-hanging">
            <NFormItem label="注册开关" path="allowRegister">
              <NSwitch v-model:value="securityForm.allowRegister" />
            </NFormItem>
            <NFormItem label="签到功能" path="allowSign">
              <NSwitch v-model:value="securityForm.allowSign" />
            </NFormItem>

            <NSpace justify="end">
              <NButton type="primary" @click="handleSaveSecurity">保存设置</NButton>
            </NSpace>
          </NForm>
        </NTabPane>

        <NTabPane name="email" tab="邮件设置">

          <NDivider>发信设置</NDivider>
          <NForm ref="emailFormRef" :model="emailForm" :rules="emailRules" label-placement="left" label-width="auto"
            require-mark-placement="right-hanging">
            <NFormItem label="SMTP 服务器" path="smtpServer">
              <NInput v-model:value="emailForm.smtpServer" placeholder="请输入SMTP服务器地址" />
            </NFormItem>
            <NFormItem label="SMTP 端口" path="smtpPort">
              <NInputNumber v-model:value="emailForm.smtpPort" :min="1" :max="65535" />
            </NFormItem>
            <NFormItem label="发件人邮箱" path="smtpAccount">
              <NInput v-model:value="emailForm.smtpAccount" placeholder="请输入发件人邮箱" />
            </NFormItem>
            <NFormItem label="发件人昵称" path="smtpFrom">
              <NInput v-model:value="emailForm.smtpFrom" placeholder="请输入发件人昵称" />
            </NFormItem>
            <NFormItem label="SMTP 密码" path="smtpPassword">
              <NInput v-model:value="emailForm.smtpPassword" placeholder="请输入 SMTP 密码"/>
            </NFormItem>
            <NFormItem label="使用 SSL" path="smtpSSL">
              <NSwitch v-model:value="emailForm.smtpSSL" />
            </NFormItem>
            <NSpace justify="end" style="margin-top: 18px">
              <NButton type="primary" @click="handleSaveEmail">保存设置</NButton>
            </NSpace>
          </NForm>
          <NDivider>禁用邮箱提供商</NDivider>
          <NSpace vertical>
            <NDynamicTags v-model:value="bannedProviders" :render-tag="renderBannedProvider"
              @update:value="handleTagsUpdate" />
          </NSpace>
        </NTabPane>
      </NTabs>
    </NCard>
  </div>
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import { NCard, NTabs, NTabPane, NForm, NFormItem, NInput, NInputNumber, NSwitch, NSpace, NButton, useMessage, NTag, NDynamicTags, NDivider } from 'naive-ui'
import type { FormRules, FormInst } from 'naive-ui'
import { AdminApi } from '../../../shared/api/admin'

const message = useMessage()

const basicFormRef = ref<FormInst | null>(null)
const securityFormRef = ref<FormInst | null>(null)
const emailFormRef = ref<FormInst | null>(null)

const basicForm = ref({
  notice: ''
})

const securityForm = ref({
  allowRegister: true,
  allowSign: true
})

const emailForm = ref({
  smtpServer: '',
  smtpPort: 465,
  smtpAccount: '',
  smtpFrom: '',
  smtpPassword: '',
  smtpSSL: true,
  smtpProvider: 'custom'
})

const bannedProviders = ref<string[]>([])

const bannedProvidersOri = ref<string[]>([])

const basicRules: FormRules = {
  notice: {
    required: true,
    type: 'string',
    message: '请输入公告内容',
    trigger: ['blur', 'input']
  }
}

const securityRules: FormRules = {
  allowRegister: {
    required: true,
    type: 'boolean'
  },
  allowSign: {
    required: true,
    type: 'boolean'
  }
}

const emailRules: FormRules = {
  smtpServer: {
    required: true,
    type: 'string',
    message: '请输入 SMTP 服务器地址',
    trigger: ['blur', 'input']
  },
  smtpPort: {
    required: true,
    type: 'number',
    message: '请输入 SMTP 端口',
    trigger: ['blur', 'input'],
    validator: (_rule, value) => {
      if (!value || value < 1 || value > 65535) {
        return new Error('端口号必须在 1-65535 之间')
      }
      return true
    }
  },
  smtpAccount: {
    required: true,
    type: 'string',
    message: '请输入发件人邮箱',
    trigger: ['blur', 'input'],
    validator: (_rule, value) => {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(value)) {
        return new Error('请输入正确的邮箱地址')
      }
      return true
    }
  },
  smtpFrom: {
    required: true,
    type: 'string',
    message: '请输入发件人昵称',
    trigger: ['blur', 'input']
  },
  smtpPassword: {
    required: true,
    type: 'string',
    message: '请输入 SMTP 密码',
    trigger: ['blur', 'input']
  },
  smtpSSL: {
    required: true,
    type: 'boolean',
    message: '请选择是否使用 SSL',
    trigger: ['blur', 'input']
  }
}

const handleSaveBasic = async () => {
  try {
    await basicFormRef.value?.validate()
    await AdminApi.updateSystemConfig({
      key: 'notice',
      value: basicForm.value.notice
    })
    message.success('保存基础设置成功')
  } catch (error) {
    message.error('保存基础设置失败')
  }
}

const handleSaveSecurity = async () => {
  try {
    await securityFormRef.value?.validate()
    await Promise.all([
      AdminApi.updateSystemConfig({
        key: 'allowRegister',
        value: String(securityForm.value.allowRegister)
      }),
      AdminApi.updateSystemConfig({
        key: 'allowSign',
        value: String(securityForm.value.allowSign)
      })
    ])
    message.success('保存安全设置成功')
  } catch (error) {
    message.error('保存安全设置失败')
  }
}

const handleSaveEmail = async () => {
  try {
    await emailFormRef.value?.validate()
    await Promise.all([
      AdminApi.updateSystemConfig({
        key: 'smtpServer',
        value: emailForm.value.smtpServer
      }),
      AdminApi.updateSystemConfig({
        key: 'smtpPort',
        value: String(emailForm.value.smtpPort)
      }),
      AdminApi.updateSystemConfig({
        key: 'smtpAccount',
        value: emailForm.value.smtpAccount
      }),
      AdminApi.updateSystemConfig({
        key: 'smtpFrom',
        value: emailForm.value.smtpFrom
      }),
      AdminApi.updateSystemConfig({
        key: 'smtpPassword',
        value: emailForm.value.smtpPassword
      }),
      AdminApi.updateSystemConfig({
        key: 'smtpSSL',
        value: String(emailForm.value.smtpSSL)
      })
    ])
    message.success('保存邮件设置成功')
  } catch (error) {
    message.error('保存邮件设置失败')
  }
}

const handleTagsUpdate = async (tags: string[]) => {
  const newTag = tags.find(tag => !bannedProvidersOri.value.includes(tag))

  if (newTag) {
    try {
      if (bannedProvidersOri.value.includes(newTag)) {
        message.error('该邮箱提供商已存在')
        bannedProviders.value = bannedProvidersOri.value
        return
      }
      await AdminApi.addBannedEmailProvider(newTag)
      message.success('添加成功')
      await fetchBannedProviders()
    } catch (error: any) {
      message.error(error?.response?.data?.message || '添加失败')
      bannedProviders.value = bannedProvidersOri.value
    }
  }
}

const handleRemoveProvider = async (provider: string) => {
  try {
    await AdminApi.removeBannedEmailProvider(provider)
    message.success('删除成功')
    await fetchBannedProviders()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '删除失败')
  }
}

const fetchBannedProviders = async () => {
  try {
    const { data: { data } } = await AdminApi.getBannedEmailProviders()
    bannedProvidersOri.value = data
    bannedProviders.value = data
  } catch (error: any) {
    message.error('获取被禁用邮箱提供商列表失败')
  }
}

const fetchBasicSettings = async () => {
  try {
    const { data: { data: notice } } = await AdminApi.getSystemConfig('notice')
    basicForm.value.notice = notice
  } catch (error) {
    message.error('获取基础设置失败')
  }
}

const fetchSecuritySettings = async () => {
  try {
    const [
      { data: { data: allowRegister } },
      { data: { data: allowSign } }
    ] = await Promise.all([
      AdminApi.getSystemConfig('allowRegister'),
      AdminApi.getSystemConfig('allowSign')
    ])

    securityForm.value.allowRegister = allowRegister === 'true'
    securityForm.value.allowSign = allowSign === 'true'
  } catch (error) {
    message.error('获取安全设置失败')
  }
}

const fetchEmailSettings = async () => {
  try {
    const [
      { data: { data: smtp } },
      { data: { data: smtpPort } },
      { data: { data: smtpFrom } },
      { data: { data: smtpAccount } },
      { data: { data: smtpPassword } },
      { data: { data: smtpSSL } }
    ] = await Promise.all([
      AdminApi.getSystemConfig('smtpServer'),
      AdminApi.getSystemConfig('smtpPort'),
      AdminApi.getSystemConfig('smtpFrom'),
      AdminApi.getSystemConfig('smtpAccount'),
      AdminApi.getSystemConfig('smtpPassword'),
      AdminApi.getSystemConfig('smtpSSL')
    ])

    emailForm.value.smtpServer = smtp
    emailForm.value.smtpPort = Number(smtpPort)
    emailForm.value.smtpAccount = smtpAccount
    emailForm.value.smtpFrom = smtpFrom
    emailForm.value.smtpPassword = smtpPassword
    emailForm.value.smtpSSL = smtpSSL === 'true'
  } catch (error) {
    message.error('获取邮件设置失败')
  }
}

const handleTabUpdate = (tab: string) => {
  switch (tab) {
    case 'basic':
      fetchBasicSettings()
      break
    case 'security':
      fetchSecuritySettings()
      break
    case 'email':
      fetchEmailSettings()
      fetchBannedProviders()
      break
  }
}

const renderBannedProvider = (tag: string) => {
  return h(
    NTag,
    {
      type: 'error',
      closable: true,
      onClose: () => handleRemoveProvider(tag)
    },
    { default: () => tag }
  )
}

// 初始获取基础设置
fetchBasicSettings()
</script>