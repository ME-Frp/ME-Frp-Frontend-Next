<template>
  <div class="content-grid">
    <!-- 修改步骤指示器区域 -->
    <div class="steps-container" v-if="isMobile">
      <n-button secondary round v-if="currentStep === 2" @click="currentStep = 1" size="medium">
        返回
        <template #icon>
          <NIcon>
            <ArrowBackOutline />
          </NIcon>
        </template>
      </n-button>
      <n-steps :current="currentStep" class="mobile-steps">
        <n-step title="选择节点" />
        <n-step title="隧道配置" />
      </n-steps>
    </div>

    <!-- 修改节点卡片的显示逻辑 -->
    <n-card v-if="!isMobile || currentStep === 1" title="选择节点" class="node-card">
      <n-space vertical>
        <n-grid x-gap="12" y-gap="12" cols="1" style="padding-top: 14px;">
          <n-grid-item v-for="node in nodeOptions" :key="node.value">
            <n-card hoverable @click="handleNodeChange(node.value)"
              :class="{ 'selected-node': formValue.nodeId === node.value }" class="node-item">
              <n-space vertical>
                <div class="node-header">
                  <n-space align="center" justify="space-between">
                    <n-space align="center">
                      <n-space :size="4">
                        <n-tag type="info" size="small"># {{ node.id }}</n-tag>
                        <n-tag :type="node.isOnline ? 'success' : 'error'" size="small">
                          {{ node.isOnline ? '在线' : '离线' }}
                        </n-tag>
                      </n-space>
                      <n-text>{{ node.name }}</n-text>
                    </n-space>
                  </n-space>
                </div>
                <n-text depth="3" style="font-size: 13px;">{{ node.description }}</n-text>
                <n-space vertical size="small">
                  <div class="info-item">
                    <span class="label">用户组:</span>
                    <n-space>
                      <n-tag v-for="group in node.allowGroups" :key="group.name" size="small" type="info">
                        {{ group.friendlyName }}
                      </n-tag>
                    </n-space>
                  </div>
                  <div class="info-item">
                    <span class="label">支持协议:</span>
                    <n-space>
                      <n-tag v-for="protocol in node.allowedProtocols" :key="protocol" size="small" type="success">
                        {{ protocol.toUpperCase() }}
                      </n-tag>
                    </n-space>
                  </div>
                  <div class="info-item">
                    <span class="label">端口范围:</span>
                    <n-tag type="warning" size="small">
                      {{ node.portRange.min }} - {{ node.portRange.max }}
                    </n-tag>
                  </div>
                </n-space>
              </n-space>
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-space>
    </n-card>

    <!-- 修改配置卡片的显示逻辑 -->
    <n-card v-if="!isMobile || currentStep === 2" title="隧道配置" class="config-card">
      <!-- 基础配置 -->
      <n-form ref="formRef" :model="formValue" :rules="rules" label-placement="left" label-width="120"
        require-mark-placement="right-hanging">
        <n-form-item label="隧道名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="请输入隧道名称" :disabled="!canEditConfig" />
        </n-form-item>

        <n-form-item label="本地地址" path="localAddr">
          <n-input v-model:value="formValue.localAddr" placeholder="请输入本地地址" :disabled="!canEditConfig" />
        </n-form-item>

        <n-form-item label="本地端口" path="localPort">
          <n-input-number v-model:value="formValue.localPort" :min="1" :max="65535" placeholder="请输入本地端口"
            :disabled="!canEditConfig" />
        </n-form-item>

        <n-form-item label="协议类型" path="type">
          <n-select v-model:value="formValue.type" :options="allowedProxyTypeOptions" placeholder="请选择协议类型"
            :disabled="!canEditConfig" />
        </n-form-item>

        <n-form-item v-if="formValue.type === 'http' || formValue.type === 'https'" label="绑定域名" path="domain">
          <n-dynamic-tags v-model:value="domainTags" :render-tag="renderDomainTag" :disabled="!canEditConfig" />
        </n-form-item>

        <n-form-item v-else label="远程端口" path="remotePort">
          <n-space align="center">
            <n-input-number v-model:value="formValue.remotePort" :min="selectedNode?.portRange?.min || 1"
              :max="selectedNode?.portRange?.max || 65535" placeholder="请输入远程端口" :disabled="!canEditConfig" />
            <n-button size="medium" :loading="gettingFreePort" :disabled="!canEditConfig" @click="handleGetFreePort">
              获取空闲端口
            </n-button>
          </n-space>
        </n-form-item>

        <n-divider>高级配置</n-divider>
        <n-text depth="3" style="padding-bottom: 15px; display: block;">
          提示：仅推荐技术用户使用，一般用户请勿随意填写。请确保您的配置正确，否则隧道可能无法启动。
        </n-text>

        <n-form-item label="访问密钥" path="accessKey">
          <n-input v-model:value="formValue.accessKey" placeholder="请输入访问密钥" :disabled="!canEditConfig" />
        </n-form-item>

        <n-form-item label="Host Header Rewrite" path="hostHeaderRewrite">
          <n-input v-model:value="formValue.hostHeaderRewrite" placeholder="请输入 Host 请求头重写值"
            :disabled="!canEditConfig" />
        </n-form-item>

        <n-form-item label="X-From-Where" path="headerXFromWhere">
          <n-input v-model:value="formValue.headerXFromWhere" placeholder="请输入 X-From-Where 请求头值"
            :disabled="!canEditConfig" />
        </n-form-item>

        <n-form-item label="Proxy Protocol" path="proxyProtocolVersion">
          <n-select v-model:value="formValue.proxyProtocolVersion" :options="[
            { label: '不启用', value: '' },
            { label: 'v1', value: 'v1' },
            { label: 'v2', value: 'v2' }
          ]" placeholder="Proxy Protocol Version" :disabled="!canEditConfig" />
        </n-form-item>

        <n-form-item label="其他选项">
          <div style="display: flex; gap: 16px;">
            <n-switch v-model:value="formValue.useEncryption" :rail-style="railStyle" :disabled="!canEditConfig">
              <template #checked>启用加密</template>
              <template #unchecked>禁用加密</template>
            </n-switch>
            <n-switch v-model:value="formValue.useCompression" :rail-style="railStyle" :disabled="!canEditConfig">
              <template #checked>启用压缩</template>
              <template #unchecked>禁用压缩</template>
            </n-switch>
          </div>
        </n-form-item>
      </n-form>

      <!-- 修改提交按钮区域 -->
      <div class="submit-section">
        <n-space justify="end">
          <n-button v-if="isMobile && currentStep === 1" type="primary" :disabled="!formValue.nodeId"
            @click="currentStep = 2">
            下一步
          </n-button>
          <n-button v-if="!isMobile || currentStep === 2" type="primary" :loading="loading" @click="handleCreate"
            :disabled="!canEditConfig">
            <template #icon>
              <n-icon>
                <CloudUploadOutline />
              </n-icon>
            </template>
            创建隧道
          </n-button>
        </n-space>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { themeColors } from '../../constants/theme'
import { ref, h, computed, onMounted, onUnmounted } from 'vue'
import { NCard, NForm, NFormItem, NInput, NInputNumber, NSelect, NButton, NIcon, useMessage, type FormRules, type FormInst, NDivider, NSwitch, NTag, NSpace, NText, NGrid, NGridItem, NDynamicTags, NSteps, NStep } from 'naive-ui'
import { CloudUploadOutline, ArrowBackOutline } from '@vicons/ionicons5'
import { AuthApi } from '../../shared/api/auth'
import type { CreateProxyArgs } from '../../types'

const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)

const formValue = ref({
  nodeId: null as number | null,
  localAddr: '',
  localPort: null as number | null,
  remotePort: null as number | null,
  type: null as string | null,
  domain: '',
  name: '',
  accessKey: '',
  hostHeaderRewrite: '',
  headerXFromWhere: '',
  proxyProtocolVersion: '',
  useEncryption: false,
  useCompression: false
})

const proxyTypeOptions = [
  { label: 'TCP', value: 'tcp' },
  { label: 'UDP', value: 'udp' },
  { label: 'HTTP', value: 'http' },
  { label: 'HTTPS', value: 'https' }
]

const nodeOptions = ref<{
  label: string;
  value: number;
  id: number;
  name: string;
  hostname: string;
  description: string;
  isOnline: boolean;
  allowedProtocols: string[];
  allowGroups: { name: string; friendlyName: string }[];
  portRange: {
    min: number;
    max: number
  }
}[]>([])

const rules: FormRules = {
  nodeId: {
    required: true,
    message: '请选择节点',
    trigger: 'blur'
  },
  localAddr: {
    required: true,
    message: '请输入本地地址',
    trigger: 'blur'
  },
  localPort: {
    required: true,
    type: 'number',
    message: '请输入本地端口',
    trigger: 'blur',
    validator: (rule, value) => {
      if (typeof value !== 'number' || value < 1 || value > 65535) {
        return new Error('端口范围必须在 1-65535 之间')
      }
      return true
    }
  },
  remotePort: {
    required: true,
    type: 'number',
    message: '请输入远程端口',
    trigger: 'blur',
    validator: (rule, value) => {
      if (['http', 'https'].includes(formValue.value.type || '')) {
        return true
      }
      if (typeof value !== 'number' || value < 1 || value > 65535) {
        return new Error('端口范围必须在 1-65535 之间')
      }
      return true
    }
  },
  type: {
    required: true,
    message: '请选择隧道类型',
    trigger: 'blur'
  },
  name: {
    required: true,
    message: '请输入隧道名称',
    trigger: 'blur'
  },
  domain: {
    required: true,
    validator: (_rule, value) => {
      if (formValue.value.type === 'http' || formValue.value.type === 'https') {
        return !!value || new Error('请输入绑定域名')
      }
      return true
    },
    trigger: 'blur'
  }
}

const groupNameMap = ref<Record<string, string>>({})

const fetchUserGroups = async () => {
  try {
    const res = await AuthApi.getUserGroups()
    if (res.data.code === 200) {
      groupNameMap.value = res.data.data.groups.reduce((acc, group) => {
        acc[group.name] = group.friendlyName
        return acc
      }, {} as Record<string, string>)
    }
  } catch (error: any) {
    message.error('获取用户组列表失败')
  }
}

const fetchNodes = async () => {
  try {
    const res = await AuthApi.getNodes()
    if (res.data.code === 200) {
      nodeOptions.value = res.data.data.map((node: any) => {
        const [minPort, maxPort] = node.allowPort.split('-').map(Number)
        const allowedProtocols = node.allowType.split(';').map((type: string) => type.trim())
        const allowGroups = node.allowGroup.split(';').map((group: string) => {
          const trimmedGroup = group.trim()
          return {
            name: trimmedGroup,
            friendlyName: groupNameMap.value[trimmedGroup] || trimmedGroup
          }
        })

        return {
          label: `#${node.nodeId} - ${node.name}`,
          value: node.nodeId,
          id: node.nodeId,
          name: node.name,
          hostname: node.hostname,
          description: node.description,
          isOnline: node.isOnline,
          allowedProtocols,
          allowGroups,
          portRange: {
            min: minPort,
            max: maxPort
          }
        }
      })
    }
  } catch (error: any) {
    message.error('获取节点列表失败')
  }
}

const selectedNode = ref<{
  id: number;
  name: string;
  hostname: string;
  allowedProtocols: string[];
  allowGroups: { name: string; friendlyName: string }[];
  portRange: {
    min: number;
    max: number;
  };
} | null>(null)

const handleNodeChange = (value: number | null) => {
  if (value) {
    const node = nodeOptions.value.find(opt => opt.value === value)
    if (node) {
      selectedNode.value = {
        id: node.id,
        name: node.name,
        hostname: node.hostname,
        allowedProtocols: node.allowedProtocols,
        allowGroups: node.allowGroups,
        portRange: node.portRange
      }
      formValue.value.nodeId = value
      formValue.value.type = null
      formValue.value.remotePort = null

      // 在移动端选择节点后自动进入下一步
      if (isMobile.value) {
        currentStep.value = 2
      }
    }
  } else {
    selectedNode.value = null
    formValue.value.nodeId = null
  }
}

const allowedProxyTypeOptions = computed(() => {
  if (!selectedNode.value) return proxyTypeOptions
  return proxyTypeOptions.filter(opt =>
    selectedNode.value?.allowedProtocols.includes(opt.value)
  )
})

const domainTags = ref<string[]>([])

const renderDomainTag = (tag: string) => {
  return h(
    NTag,
    {
      round: false,
      closable: true,
      onClose: () => {
        const index = domainTags.value.indexOf(tag)
        if (index !== -1) {
          const newTags = [...domainTags.value]
          newTags.splice(index, 1)
          domainTags.value = newTags
          formValue.value.domain = JSON.stringify(newTags)
        }
      }
    },
    { default: () => tag }
  )
}

const railStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  const style = {
    background: checked ? themeColors.primary : undefined,
    boxShadow: focused ? `0 0 0 2px ${themeColors.primarySuppl}` : undefined
  }
  return style
}

const handleCreate = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        const createData: CreateProxyArgs = {
          nodeId: formValue.value.nodeId!,
          proxyName: formValue.value.name,
          localIp: formValue.value.localAddr,
          localPort: formValue.value.localPort!,
          remotePort: formValue.value.remotePort!,
          domain: formValue.value.domain,
          proxyType: formValue.value.type!,
          accessKey: formValue.value.accessKey,
          hostHeaderRewrite: formValue.value.hostHeaderRewrite,
          headerXFromWhere: formValue.value.headerXFromWhere,
          proxyProtocolVersion: formValue.value.proxyProtocolVersion,
          useEncryption: formValue.value.useEncryption,
          useCompression: formValue.value.useCompression
        }
        await AuthApi.createProxy(createData)
        message.success('创建隧道成功')
        formRef.value?.restoreValidation()
        formValue.value = {
          nodeId: null,
          localAddr: '',
          localPort: null,
          remotePort: null,
          type: null,
          domain: '',
          name: '',
          accessKey: '',
          hostHeaderRewrite: '',
          headerXFromWhere: '',
          proxyProtocolVersion: '',
          useEncryption: false,
          useCompression: false
        }
      } catch (error: any) {
        message.error(error?.response?.data?.message || '创建隧道失败')
      } finally {
        loading.value = false
      }
    }
  })
}

// 计算是否可以编辑配置
const canEditConfig = computed(() => {
  return formValue.value.nodeId && selectedNode.value
})

// 修改初始化顺序
const init = async () => {
  await fetchUserGroups()
  await fetchNodes()
}

// 修改初始化调用
init()
const isMobile = ref(window.innerWidth <= 700)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 700
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
const currentStep = ref<number>(1)

const gettingFreePort = ref(false)

const handleGetFreePort = async () => {
  if (!canEditConfig.value) return
  try {
    gettingFreePort.value = true
    const res = await AuthApi.getFreeNodePort({ nodeId: formValue.value.nodeId! })
    if (res.data.code === 200) {
      formValue.value.remotePort = res.data.data
    } else {
      message.error(res.data.message || '获取空闲端口失败')
    }
  } catch (error: any) {
    message.error(error?.response?.data?.message || '获取空闲端口失败')
  } finally {
    gettingFreePort.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/createProxy.scss';
</style>