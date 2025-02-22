<template>
  <div>
    <NCard title="系统管理">
      <NTabs type="line" animated @update:value="handleTabUpdate">
        <NTabPane name="basic" tab="基础">
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

        <NTabPane name="security" tab="安全">
          <NForm ref="securityFormRef" :model="securityForm" :rules="securityRules" label-placement="left"
            label-width="auto" require-mark-placement="right-hanging">
            <NFormItem label="注册开关" path="allowRegister">
              <NSwitch v-model:value="securityForm.allowRegister" :rail-style="switchButtonRailStyle" />
            </NFormItem>
            <NFormItem label="签到功能" path="allowSign">
              <NSwitch v-model:value="securityForm.allowSign" :rail-style="switchButtonRailStyle" />
            </NFormItem>

            <NSpace justify="end">
              <NButton type="primary" @click="handleSaveSecurity">保存设置</NButton>
            </NSpace>
          </NForm>
        </NTabPane>

        <NTabPane name="email" tab="邮件">

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
              <NInput v-model:value="emailForm.smtpPassword" placeholder="请输入 SMTP 密码" type="password"
                show-password-on="click" />
            </NFormItem>
            <NFormItem label="使用 SSL" path="smtpSSL">
              <NSwitch v-model:value="emailForm.smtpSSL" :rail-style="switchButtonRailStyle" />
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

        <NTabPane name="downloads" tab="下载源">
          <NSpace vertical>
            <NForm inline>
              <NFormItem label="ID">
                <NInput v-model:value="addSourceForm.id" placeholder="请输入下载源 ID" />
              </NFormItem>
              <NFormItem label="Path">
                <NInput v-model:value="addSourceForm.path" placeholder="请输入下载源 Path" />
              </NFormItem>
              <NFormItem label="名称">
                <NInput v-model:value="addSourceForm.name" placeholder="请输入下载源名称" />
              </NFormItem>
              <NFormItem>
                <NButton type="primary" @click="handleAddDownloadSource">添加</NButton>
              </NFormItem>
            </NForm>
            <NDataTable :columns="downloadSourceColumns" :data="downloadSourcesData" :bordered="false" />
          </NSpace>
        </NTabPane>

        <NTabPane name="groups" tab="用户组">
          <NSpace vertical>
            <NButton type="primary" @click="showAddGroupModal = true">添加用户组</NButton>
            <NDataTable :columns="groupColumns" :data="groupsData" :bordered="false" />
          </NSpace>
        </NTabPane>

      </NTabs>
    </NCard>

    <NModal v-model:show="showEditModal" preset="dialog" title="修改下载源">
      <NForm ref="editSourceFormRef" :model="editSourceForm" :rules="addSourceRules">
        <NFormItem label="ID" path="id">
          <NInput v-model:value="editSourceForm.id" placeholder="请输入下载源 ID" />
        </NFormItem>
        <NFormItem label="Path" path="path">
          <NInput v-model:value="editSourceForm.path" placeholder="请输入下载源 Path" />
        </NFormItem>
        <NFormItem label="名称" path="name">
          <NInput v-model:value="editSourceForm.name" placeholder="请输入下载源名称" />
        </NFormItem>
      </NForm>
      <template #action>
        <NButton @click="showEditModal = false">取消</NButton>
        <NButton type="primary" @click="handleEditSource">确定</NButton>
      </template>
    </NModal>

    <NModal v-model:show="showAddGroupModal" preset="dialog" title="添加用户组">
      <NForm ref="groupFormRef" :model="groupForm" :rules="groupRules">
        <NFormItem label="组名" path="name">
          <NInput v-model:value="groupForm.name" placeholder="请输入用户组名称" />
        </NFormItem>
        <NFormItem label="显示名称" path="friendlyName">
          <NInput v-model:value="groupForm.friendlyName" placeholder="请输入显示名称" />
        </NFormItem>
        <NFormItem label="基础流量" path="baseTraffic">
          <NInputNumber v-model:value="groupForm.baseTraffic" :min="0" />
        </NFormItem>
        <NFormItem label="最大隧道数" path="maxProxies">
          <NInputNumber v-model:value="groupForm.maxProxies" :min="0" />
        </NFormItem>
        <NFormItem label="出站带宽" path="outBound">
          <NSpace align="center">
            <NInputNumber v-model:value="groupForm.outBound" :min="0" />
            <span>Mbps</span>
          </NSpace>
        </NFormItem>
        <NFormItem label="入站带宽" path="inBound">
          <NSpace align="center">
            <NInputNumber v-model:value="groupForm.inBound" :min="0" />
            <span>Mbps</span>
          </NSpace>
        </NFormItem>
      </NForm>
      <template #action>
        <NButton @click="showAddGroupModal = false">取消</NButton>
        <NButton type="primary" @click="handleAddGroup">确定</NButton>
      </template>
    </NModal>

    <NModal v-model:show="showEditGroupModal" preset="dialog" title="修改用户组">
      <NForm ref="editGroupFormRef" :model="editGroupForm" :rules="groupRules">
        <NFormItem label="组名" path="name">
          <NInput v-model:value="editGroupForm.name" placeholder="请输入用户组名称" />
        </NFormItem>
        <NFormItem label="显示名称" path="friendlyName">
          <NInput v-model:value="editGroupForm.friendlyName" placeholder="请输入显示名称" />
        </NFormItem>
        <NFormItem label="基础流量" path="baseTraffic">
          <NInputNumber v-model:value="editGroupForm.baseTraffic" :min="0" />
        </NFormItem>
        <NFormItem label="最大隧道数" path="maxProxies">
          <NInputNumber v-model:value="editGroupForm.maxProxies" :min="0" />
        </NFormItem>
        <NFormItem label="出站带宽" path="outBound">
          <NSpace align="center">
            <NInputNumber v-model:value="editGroupForm.outBound" :min="0" />
            <span>Mbps</span>
          </NSpace>
        </NFormItem>
        <NFormItem label="入站带宽" path="inBound">
          <NSpace align="center">
            <NInputNumber v-model:value="editGroupForm.inBound" :min="0" />
            <span>Mbps</span>
          </NSpace>
        </NFormItem>
      </NForm>
      <template #action>
        <NButton @click="showEditGroupModal = false">取消</NButton>
        <NButton type="primary" @click="handleEditGroup">确定</NButton>
      </template>
    </NModal>
  </div>
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import { NCard, NTabs, NTabPane, NForm, NFormItem, NInput, NInputNumber, NSwitch, NSpace, NButton, useMessage, NTag, NDynamicTags, NDivider, NDataTable, NModal } from 'naive-ui'
import type { FormRules, FormInst, DataTableColumns } from 'naive-ui'
import { switchButtonRailStyle } from '../../../constants/theme'
import { AdminApi } from '../../../shared/api/admin'
import { AuthApi } from '../../../shared/api/auth'
import type { DownloadSource, Group } from '../../../types'

const message = useMessage()

const basicFormRef = ref<FormInst | null>(null)
const securityFormRef = ref<FormInst | null>(null)
const emailFormRef = ref<FormInst | null>(null)
const editSourceFormRef = ref<FormInst | null>(null)
const groupFormRef = ref<FormInst | null>(null)

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

const downloadSourcesData = ref<DownloadSource[]>([])
const showEditModal = ref(false)
const addSourceForm = ref({
  id: '',
  name: '',
  path: ''
})
const editSourceForm = ref({
  id: '',
  name: '',
  path: ''
})

const showAddGroupModal = ref(false)
const showEditGroupModal = ref(false)
const groupForm = ref<Group>({
  name: '',
  friendlyName: '',
  maxProxies: 0,
  baseTraffic: 0,
  outBound: 0,
  inBound: 0
})
const editGroupForm = ref<Group>({
  name: '',
  friendlyName: '',
  maxProxies: 0,
  baseTraffic: 0,
  outBound: 0,
  inBound: 0
})
const groupsData = ref<Group[]>([])

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

const addSourceRules: FormRules = {
  id: {
    required: true,
    message: '请输入下载源 ID',
    trigger: ['blur', 'input']
  },
  name: {
    required: true,
    message: '请输入下载源名称',
    trigger: ['blur', 'input']
  }
}

const groupRules: FormRules = {
  name: {
    required: true,
    message: '请输入用户组名称',
    trigger: ['blur', 'input']
  }
}

const downloadSourceColumns: DataTableColumns<DownloadSource> = [
  {
    title: 'ID',
    key: 'id'
  },
  {
    title: '名称',
    key: 'name'
  },
  {
    title: '操作',
    key: 'actions',
    render: (row) => {
      return h(NSpace, {}, {
        default: () => [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () => {
                editSourceForm.value.id = row.id
                editSourceForm.value.name = row.name
                showEditModal.value = true
              }
            },
            { default: () => '修改' }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => handleRemoveDownloadSource(row.id)
            },
            { default: () => '删除' }
          )
        ]
      })
    }
  }
]

// 格式化流量数值
function formatTraffic(traffic: number): string {
  const value = traffic
  if (isNaN(value)) return String(traffic)
  if (value >= 1024) {
    return `${(value / 1024).toFixed(2)} GB`
  }
  return `${value.toFixed(2)} MB`
}

const groupColumns: DataTableColumns<Group> = [
  {
    title: '组名',
    key: 'name',    
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.name)
    }
  },
  {
    title: '显示名称',
    key: 'friendlyName',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.friendlyName)
    }
  },
  {
    title: '最大隧道数',
    key: 'maxProxies',    
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.maxProxies)
    }
  },
  {
    title: '基础流量',
    key: 'baseTraffic',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, formatTraffic(row.baseTraffic))
    }
  },
  {
    title: '出站带宽',
    key: 'outBound',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.outBound ? `${row.outBound} Mbps` : '无')
    }
  },
  {
    title: '入站带宽',
    key: 'inBound',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.outBound ? `${row.inBound} Mbps` : '无')
    }
  },
  {
    title: '操作',
    key: 'actions',
    render: (row) => {
      return h(NSpace, {}, {
        default: () => [
          h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              onClick: () => {
                editGroupForm.value = { ...row }
                showEditGroupModal.value = true
              }
            },
            { default: () => '修改' }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => handleRemoveGroup(row.name)
            },
            { default: () => '删除' }
          )
        ]
      })
    }
  }
]

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

const fetchDownloadSources = async () => {
  try {
    const { data: { data } } = await AuthApi.getDownloadSources()
    downloadSourcesData.value = data
  } catch (error: any) {
    message.error('获取下载源列表失败')
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

const handleAddDownloadSource = async () => {
  if (!addSourceForm.value.id || !addSourceForm.value.name || !addSourceForm.value.path) {
    message.error('请填写完整信息')
    return
  }

  try {
    await AdminApi.addDownloadSource({
      source: {
        id: addSourceForm.value.id,
        path: addSourceForm.value.path,
        name: addSourceForm.value.name
      }
    })
    message.success('添加成功')
    addSourceForm.value.id = ''
    addSourceForm.value.name = ''
    addSourceForm.value.path = ''
    await fetchDownloadSources()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '添加失败')
  }
}

const handleEditSource = async () => {
  if (!editSourceForm.value.id || !editSourceForm.value.name) {
    message.error('请填写完整信息')
    return
  }

  try {
    await AdminApi.updateDownloadSource({
      source: {
        id: editSourceForm.value.id,
        path: editSourceForm.value.path,
        name: editSourceForm.value.name,
      }
    })
    message.success('修改成功')
    showEditModal.value = false
    editSourceForm.value.id = ''
    editSourceForm.value.name = ''
    await fetchDownloadSources()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '修改失败')
  }
}

const handleRemoveDownloadSource = async (sourceId: string) => {
  try {
    await AdminApi.deleteDownloadSource(sourceId)
    message.success('删除成功')
    await fetchDownloadSources()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '删除失败')
  }
}

const handleAddGroup = async () => {
  try {
    // 转换带宽单位从 Mbps 到 B/s
    const formData = {
      ...groupForm.value,
      outBound: groupForm.value.outBound * 128,
      inBound: groupForm.value.inBound * 128
    }
    await AdminApi.addGroup(formData)
    message.success('添加成功')
    showAddGroupModal.value = false
    groupForm.value = {
      name: '',
      friendlyName: '',
      maxProxies: 0,
      baseTraffic: 0,
      outBound: 0,
      inBound: 0
    }
    await fetchGroups()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '添加失败')
  }
}

const handleEditGroup = async () => {
  try {
    // 转换带宽单位从 Mbps 到 B/s
    const formData = {
      ...editGroupForm.value,
      outBound: editGroupForm.value.outBound * 128,
      inBound: editGroupForm.value.inBound * 128
    }
    await AdminApi.updateGroup(formData)
    message.success('修改成功')
    showEditGroupModal.value = false
    await fetchGroups()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '修改失败')
  }
}

const handleRemoveGroup = async (name: string) => {
  try {
    await AdminApi.deleteGroup(name)
    message.success('删除成功')
    await fetchGroups()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '删除失败')
  }
}

const fetchGroups = async () => {
  try {
    const { data: { data } } = await AuthApi.getUserGroups()
    // 转换带宽单位从 B/s 到 Mbps
    groupsData.value = data.groups.map(group => ({
      ...group,
      outBound: group.outBound / 128,
      inBound: group.inBound / 128
    }))
  } catch (error: any) {
    message.error('获取用户组列表失败')
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
    case 'downloads':
      fetchDownloadSources()
      break
    case 'groups':
      fetchGroups()
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