<template>
  <div class="content-grid" ref="contentGridRef">
    <!-- 实名认证提示弹窗 -->
    <NModal v-model:show="showRealnameModal" preset="dialog" title="未实名认证提示" :show-icon="false" style="width: 400px;">
      <div>
        您的账户尚未完成实名认证, 请尽快完成实名认证。<br>
        实名认证后, 您将获得更多节点权限, 且双向带宽将提升至 24 Mbps。
      </div>
      <div style="margin-top: 12px; text-align: right;">
        <NText depth="3">{{ countDown }}秒后自动关闭</NText>
      </div>
      <template #action>
        <NButton size="small" @click="showRealnameModal = false">关闭</NButton>
        <NButton size="small" type="primary" @click="goToRealname">立即前往</NButton>
      </template>
    </NModal>

    <!-- 选择节点页面 -->
    <Transition name="fade-in" mode="out-in">
      <div v-if="currentStep === 1" class="step-page">
        <NCard title="选择节点" class="node-card">
          <template #header-extra>
            <div class="filter-container">
              <div class="filter-row">
                <NCheckbox v-model:checked="filterWeb" size="small">
                  仅显示可建站节点
                </NCheckbox>
                <NCheckbox v-model:checked="filterHighBandwidth" size="small">
                  仅显示允许大流量节点
                </NCheckbox>
              </div>
              <div class="search-row">
                <NInput
                  v-model:value="searchKeyword"
                  placeholder="搜索…"
                  clearable
                  size="small"
                />
              </div>
            </div>
          </template>
          <NCollapse v-model:value="activeCollapse" accordion :default-expanded-names="[userGroup === 'noRealname' ? 'oversea' : 'cn']">
            <NCollapseItem v-if="userGroup !== 'noRealname' && hasNodesInRegion('cn')" title="中国大陆" name="cn">
              <div class="n-grid">
                <NCard v-for="node in filteredNodeOptions.filter(n => n.region === 'cn')" :key="node.value"
                  :class="{ 'selected-node': formValue.nodeId === node.value }" hoverable @click="handleNodeChange(node.value)">
                  <NSpace vertical>
                    <NSpace align="center" justify="space-between">
                      <NSpace align="center">
                        <NTag :bordered="false" type="info" size="small"># {{ node.id }}</NTag>
                        <!-- <NTag :bordered="false" :type="node.isOnline ? 'success' : 'error'" size="small">
                          {{ node.isOnline ? '在线' : '离线' }}
                        </NTag> -->
                        <NText>{{ node.name }}</NText>
                      </NSpace>
                    </NSpace>
                    <NText depth="3">{{ node.description }}</NText>
                    <NSpace>
                      <template v-for="protocol in node.allowedProtocols" :key="protocol">
                        <NTag v-if="!(protocol === 'https' && node.allowedProtocols.includes('http'))" :bordered="false" size="small" type="success">
                          {{ protocol === 'http' && node.allowedProtocols.includes('https') ? 'HTTP(S)' : protocol.toUpperCase() }}
                        </NTag>
                      </template>
                      <NTag :bordered="false" type="warning" size="small">
                        {{ node.bandwidth || '未知' }}
                      </NTag>
                    </NSpace>
                  </NSpace>
                </NCard>
              </div>
            </NCollapseItem>
            <NCollapseItem v-if="hasNodesInRegion('cnos')" title="中国香港/澳门/台湾地区" name="cnos">
              <div class="n-grid">
                <NCard v-for="node in filteredNodeOptions.filter(n => n.region === 'cnos')" :key="node.value"
                  :class="{ 'selected-node': formValue.nodeId === node.value }" hoverable @click="handleNodeChange(node.value)">
                  <NSpace vertical>
                    <NSpace align="center" justify="space-between">
                      <NSpace align="center">
                        <NTag :bordered="false" type="info" size="small"># {{ node.id }}</NTag>
                        <!-- <NTag :bordered="false" :type="node.isOnline ? 'success' : 'error'" size="small">
                          {{ node.isOnline ? '在线' : '离线' }}
                        </NTag> -->
                        <NText>{{ node.name }}</NText>
                      </NSpace>
                    </NSpace>
                    <NText depth="3">{{ node.description }}</NText>
                    <NSpace>
                      <template v-for="protocol in node.allowedProtocols" :key="protocol">
                        <NTag v-if="!(protocol === 'https' && node.allowedProtocols.includes('http'))" :bordered="false" size="small" type="success">
                          {{ protocol === 'http' && node.allowedProtocols.includes('https') ? 'HTTP(S)' : protocol.toUpperCase() }}
                        </NTag>
                      </template>
                      <NTag :bordered="false" type="warning" size="small">
                        {{ node.bandwidth || '未知' }}
                      </NTag>
                    </NSpace>
                  </NSpace>
                </NCard>
              </div>
            </NCollapseItem>
            <NCollapseItem v-if="hasNodesInRegion('oversea')" title="海外" name="oversea">
              <div class="n-grid">
                <NCard v-for="node in filteredNodeOptions.filter(n => n.region === 'oversea')" :key="node.value"
                  :class="{ 'selected-node': formValue.nodeId === node.value }" hoverable @click="handleNodeChange(node.value)">
                  <NSpace vertical>
                    <NSpace align="center" justify="space-between">
                      <NSpace align="center">
                        <NTag :bordered="false" type="info" size="small"># {{ node.id }}</NTag>
                        <!-- <NTag :bordered="false" :type="node.isOnline ? 'success' : 'error'" size="small">
                          {{ node.isOnline ? '在线' : '离线' }}
                        </NTag> -->
                        <NText>{{ node.name }}</NText>
                      </NSpace>
                    </NSpace>
                    <NText depth="3">{{ node.description }}</NText>
                    <NSpace>
                      <template v-for="protocol in node.allowedProtocols" :key="protocol">
                        <NTag v-if="!(protocol === 'https' && node.allowedProtocols.includes('http'))" :bordered="false" size="small" type="success">
                          {{ protocol === 'http' && node.allowedProtocols.includes('https') ? 'HTTP(S)' : protocol.toUpperCase() }}
                        </NTag>
                      </template>
                      <NTag :bordered="false" type="warning" size="small">
                        {{ node.bandwidth || '未知' }}
                      </NTag>
                    </NSpace>
                  </NSpace>
                </NCard>
              </div>
            </NCollapseItem>
          </NCollapse>
        </NCard>
      </div>
    </Transition>

    <!-- 隧道配置页面 -->
    <Transition name="fade-in" mode="out-in">
      <div v-if="currentStep === 2" class="step-page">
        <!-- 当前节点信息卡片 -->
        <NCard class="selected-node-info" style="margin-bottom: 20px;">
          <NSpace vertical>
            <NSpace align="center" justify="space-between">
              <NSpace align="center">
                <NTag :bordered="false" type="info" size="small"># {{ selectedNode?.id }}</NTag>
                <!-- <NTag :bordered="false" :type="nodeOptions.find(n => n.value === formValue.nodeId)?.isOnline ? 'success' : 'error'" size="small">
                  {{ nodeOptions.find(n => n.value === formValue.nodeId)?.isOnline ? '在线' : '离线' }}
                </NTag> -->
                <NText>{{ selectedNode?.name }}</NText>
              </NSpace>
              <NSpace>
                <NButton size="small" @click="currentStep = 1">
                  <template #icon>
                    <NIcon>
                      <ArrowBackOutline />
                    </NIcon>
                  </template>
                  更换节点
                </NButton>
                <NButton size="small" type="primary" :loading="loading" @click="handleCreate" :disabled="!canEditConfig">
                  <template #icon>
                    <NIcon>
                      <CloudUploadOutline />
                    </NIcon>
                  </template>
                  创建隧道
                </NButton>
              </NSpace>
            </NSpace>
            <NText depth="3">{{ selectedNode?.description }}</NText>
            <NSpace>
              <template v-for="protocol in selectedNode?.allowedProtocols" :key="protocol">
                <NTag v-if="!(protocol === 'https' && selectedNode?.allowedProtocols.includes('http'))" :bordered="false" size="small" type="success">
                  {{ protocol === 'http' && selectedNode?.allowedProtocols.includes('https') ? 'HTTP(S)' : protocol.toUpperCase() }}
                </NTag>
              </template>
              <NTag :bordered="false" type="warning" size="small">
                {{ nodeOptions.find(n => n.value === formValue.nodeId)?.bandwidth || '未知' }}
              </NTag>
              <NTag :bordered="false" type="warning" size="small">
                远程端口范围: {{ selectedNode?.portRange ? `${selectedNode.portRange.min} - ${selectedNode.portRange.max}` : '未知' }}
              </NTag>
            </NSpace>
          </NSpace>
        </NCard>

        <NCard title="隧道配置" class="config-card">
          <NForm ref="formRef" :model="formValue" :rules="rules" label-placement="left" label-width="120"
            require-mark-placement="right-hanging">
            <NFormItem label="隧道名称" path="name">
              <NInput v-model:value="formValue.name" placeholder="请输入隧道名称" :disabled="!canEditConfig" />
            </NFormItem>

            <NFormItem label="本地地址" path="localAddr">
              <NInput v-model:value="formValue.localAddr" placeholder="请输入本地地址" :disabled="!canEditConfig" />
            </NFormItem>

            <NFormItem label="本地端口" path="localPort">
              <NInputNumber v-model:value="formValue.localPort" :min="1" :max="65535" placeholder="请输入本地端口"
                :disabled="!canEditConfig" />
            </NFormItem>

            <NFormItem label="协议类型" path="type">
              <NSelect v-model:value="formValue.type" :options="allowedProxyTypeOptions" placeholder="请选择协议类型"
                :disabled="!canEditConfig" />
            </NFormItem>

            <NFormItem v-if="formValue.type === 'http' || formValue.type === 'https'" label="绑定域名" path="domain">
              <NDynamicTags v-model:value="domainTags" :render-tag="renderDomainTag" :disabled="!canEditConfig" />
            </NFormItem>

            <NFormItem v-else label="远程端口" path="remotePort">
              <NSpace align="center">
                <NInputNumber v-model:value="formValue.remotePort" :min="selectedNode?.portRange?.min || 1"
                  :max="selectedNode?.portRange?.max || 65535" placeholder="请输入远程端口" :disabled="!canEditConfig" />
                <NButton size="medium" :loading="gettingFreePort" :disabled="!canEditConfig" @click="handleGetFreePort">
                  获取空闲端口
                </NButton>
              </NSpace>
            </NFormItem>

            <NDivider>高级配置</NDivider>
            <NText depth="3" style="padding-bottom: 15px; display: block;">
              提示：仅推荐技术用户使用, 一般用户请勿随意填写。请确保您的配置正确, 否则隧道可能无法启动。
            </NText>

            <NFormItem label="访问密钥" path="accessKey">
              <NInput v-model:value="formValue.accessKey" placeholder="访问密钥已不再支持" :disabled="true" />
            </NFormItem>

            <NFormItem label="Host Header Rewrite" path="hostHeaderRewrite">
              <NInput v-model:value="formValue.hostHeaderRewrite" placeholder="请输入 Host 请求头重写值"
                :disabled="!canEditConfig" />
            </NFormItem>

            <NFormItem label="X-From-Where" path="headerXFromWhere">
              <NInput v-model:value="formValue.headerXFromWhere" placeholder="请输入 X-From-Where 请求头值"
                :disabled="!canEditConfig" />
            </NFormItem>

            <NFormItem label="Proxy Protocol" path="proxyProtocolVersion">
              <NSelect v-model:value="formValue.proxyProtocolVersion" :options="[
                { label: '不启用', value: '' },
                { label: 'v1', value: 'v1' },
                { label: 'v2', value: 'v2' }
              ]" placeholder="Proxy Protocol Version" :disabled="!canEditConfig" />
            </NFormItem>

            <NFormItem label="其他选项">
              <div style="display: flex; gap: 16px;">
                <NSwitch v-model:value="formValue.useEncryption" :rail-style="defaultSwc" :disabled="!canEditConfig">
                  <template #checked>启用加密</template>
                  <template #unchecked>禁用加密</template>
                </NSwitch>
                <NSwitch v-model:value="formValue.useCompression" :rail-style="defaultSwc" :disabled="!canEditConfig">
                  <template #checked>启用压缩</template>
                  <template #unchecked>禁用压缩</template>
                </NSwitch>
              </div>
            </NFormItem>
          </NForm>
        </NCard>
      </div>
    </Transition>

    <!-- 底部操作栏 -->
    <Transition name="fade-in">
      <div class="bottom-action-bar" :class="{ show: formValue.nodeId }" v-if="currentStep === 1">
        <NSpace justify="space-between" align="center">
          <div></div>
          <NButton type="primary" @click="currentStep = 2">
            下一步
          </NButton>
        </NSpace>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, h, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { NCard, NForm, NFormItem, NInput, NInputNumber, NSelect, NButton, NIcon, useMessage, type FormRules, type FormInst, NDivider, NSwitch, NTag, NSpace, NText, NDynamicTags, NModal, NCollapse, NCollapseItem, NCheckbox } from 'naive-ui'
import { CloudUploadOutline, ArrowBackOutline } from '@vicons/ionicons5'
import { AuthApi } from '../../shared/api/auth'
import type { CreateProxyArgs } from '../../types'
import { defaultSwc } from '../../constants/theme'
import { useRouter } from 'vue-router'

const router = useRouter()
const message = useMessage()
const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const userGroup = localStorage.getItem('group')
const activeCollapse = ref<string>(userGroup === 'noRealname' ? 'oversea' : 'cn')

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

const goToRealname = () => {
  router.push('/dashboard/profile')
}

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
  };
  region: 'cn' | 'cnos' | 'oversea';
  bandwidth?: string;
  userBandwidth?: string;
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
    validator: (_rule, value) => {
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
    validator: (_rule, value) => {
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
    validator: (_rule, _value) => {
      if (formValue.value.type === 'http' || formValue.value.type === 'https') {
        if (!domainTags.value.length) {
          return new Error('请至少添加一个域名')
        }
      }
      return true
    },
    trigger: ['blur', 'change']
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
          },
          region: node.region,
          bandwidth: node.bandwidth,
          userBandwidth: node.userBandwidth
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
  description: string;
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
        description: node.description,
        allowedProtocols: node.allowedProtocols,
        allowGroups: node.allowGroups,
        portRange: node.portRange
      }
      formValue.value.nodeId = value
      formValue.value.type = selectedNode.value?.allowedProtocols[0] || null
      formValue.value.remotePort = null
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

const handleDomainTagsUpdate = (tags: string[]) => {
  domainTags.value = tags
  formValue.value.domain = JSON.stringify(tags)
}

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
          handleDomainTagsUpdate(newTags)
        }
      }
    },
    { default: () => tag }
  )
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
          domain: formValue.value.type === 'http' || formValue.value.type === 'https' ? JSON.stringify(domainTags.value) : '',
          proxyType: formValue.value.type!,
          accessKey: '',
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
        domainTags.value = []
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

const showRealnameModal = ref(false)
const countDown = ref(10)
let timer: number | null = null

const startCountDown = () => {
  countDown.value = 10
  timer = window.setInterval(() => {
    if (countDown.value > 0) {
      countDown.value--
    } else {
      showRealnameModal.value = false
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }
  }, 1000)
}

watch(showRealnameModal, (newVal) => {
  if (!newVal && timer) {
    clearInterval(timer)
    timer = null
  }
})

// 修改初始化顺序
const init = async () => {
  await fetchUserGroups()
  await fetchNodes()
  if (userGroup === 'noRealname') {
    showRealnameModal.value = true
    startCountDown()
  }
}

// 修改初始化调用
init()
const isMobile = ref(window.innerWidth <= 768)

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
const currentStep = ref<number>(1)
const contentGridRef = ref<HTMLElement | null>(null)

// 监听步骤变化
watch(currentStep, (newStep) => {
  if (newStep === 2) {
    // 使用 nextTick 确保在 DOM 更新后执行滚动
    nextTick(() => {
      contentGridRef.value?.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  }
})

const gettingFreePort = ref(false)

const handleGetFreePort = async () => {
  if (!canEditConfig.value) return
  try {
    gettingFreePort.value = true
    const protocol = formValue.value.type === 'udp' ? 'udp' : 'tcp'
    const res = await AuthApi.getFreeNodePort({ 
      nodeId: formValue.value.nodeId!,
      protocol
    })
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

const filterWeb = ref(false)
const filterHighBandwidth = ref(false)
const searchKeyword = ref('')

// 过滤节点选项
const filteredNodeOptions = computed(() => {
  return nodeOptions.value.filter(node => {
    // 搜索关键词过滤
    if (searchKeyword.value && !node.name.toLowerCase().includes(searchKeyword.value.toLowerCase())) {
      return false
    }
    
    // 建站支持过滤
    if (filterWeb.value && !node.allowedProtocols.some(p => ['http', 'https'].includes(p))) {
      return false
    }
    
    // 允许大流量节点过滤
    if (filterHighBandwidth.value) {
      const bandwidth = node.bandwidth?.toLowerCase() || ''
      if (bandwidth.includes('gbps')) {
        const gbps = parseFloat(bandwidth.replace('gbps', ''))
        if (gbps < 0.07) return false // 小于 70Mbps
      } else if (bandwidth.includes('mbps')) {
        const mbps = parseFloat(bandwidth.replace('mbps', ''))
        if (mbps < 70) return false // 小于 70Mbps
      } else {
        return false // 未知带宽
      }
    }
    
    return true
  })
})

// 检查区域是否有节点
const hasNodesInRegion = (region: string) => {
  return filteredNodeOptions.value.some(node => node.region === region)
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/createProxy.scss';
</style>