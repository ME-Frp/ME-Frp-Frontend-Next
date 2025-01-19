<template>
  <div class="proxies">
    <NCard title="隧道管理">
      <div class="toolbar">
        <div class="search-box">
          <NInput v-model:value="searchText" placeholder="搜索隧道..." clearable>
            <template #prefix>
              <NIcon>
                <SearchOutline />
              </NIcon>
            </template>
          </NInput>
        </div>

        <div class="toolbar-right">
          <NButtonGroup>
            <NButton :type="viewMode === 'grid' ? 'primary' : 'default'" @click="viewMode = 'grid'">
              <template #icon>
                <NIcon>
                  <GridOutline />
                </NIcon>
              </template>
              <span class="view-text">网格</span><span class="view-suffix">视图</span>
            </NButton>
            <NButton :type="viewMode === 'list' ? 'primary' : 'default'" @click="viewMode = 'list'">
              <template #icon>
                <NIcon>
                  <ListOutline />
                </NIcon>
              </template>
              <span class="view-text">列表</span><span class="view-suffix">视图</span>
            </NButton>
          </NButtonGroup>

          <NButton secondary @click="handleRefresh">
            <template #icon>
              <NIcon>
                <RefreshOutline />
              </NIcon>
            </template>刷新
          </NButton>
        </div>
      </div>

      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="proxy-grid">
        <NCard v-for="proxy in filteredProxies" :key="proxy.proxyId" class="proxy-card">
          <div class="proxy-header">
            <h3 class="proxy-title">
              {{ proxy.proxyName }}
            </h3>
            <NTag :type="proxy.isOnline ? 'success' : 'error'" size="small">
              {{ proxy.isOnline ? '在线' : '离线' }}
            </NTag>
          </div>
          <div class="proxy-info">
            <div class="info-item">
              <span class="label">ID:</span>
              <span class="value">
                <NTag type="info" size="small"># {{ proxy.proxyId }}</NTag>
              </span>
            </div>
            <div class="info-item">
              <span class="label">协议:</span>
              <span class="value">{{ proxy.proxyType.toUpperCase() }}</span>
            </div>
            <div class="info-item">
              <span class="label">远程端口：</span>
              <span class="value">{{ proxy.remotePort }}</span>
            </div>
            <div class="info-item" style="display: flex; align-items: flex-start">
              <span class="label">节点：</span>
              <span class="value" style="flex: 1; word-break: break-all;">{{ getNodeLabel(proxy.nodeId) }}</span>
            </div>
          </div>
          <div class="proxy-actions">
            <NDropdown :options="dropdownOptions.filter(opt => 
              !(opt.key === 'offline' && !proxy.isOnline)
            )" @select="key => handleSelect(key, proxy)" trigger="click">
              <NButton secondary size="small">
                <template #icon>
                  <NIcon>
                    <BuildOutline />
                  </NIcon>
                </template>
                更多
              </NButton>
            </NDropdown>
          </div>
        </NCard>
      </div>

      <!-- 列表视图 -->
      <NTable v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>名称</th>
            <th>类型</th>
            <th>远程端口</th>
            <th>节点</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="proxy in filteredProxies" :key="proxy.proxyId">
            <td>
              <NTag type="info" size="medium"># {{ proxy.proxyId }}</NTag>
            </td>
            <td>{{ proxy.proxyName }}</td>
            <td>{{ proxy.proxyType.toUpperCase() }}</td>
            <td>{{ proxy.remotePort }}</td>
            <td>{{ getNodeLabel(proxy.nodeId) }}</td>
            <td>
              <NTag :type="proxy.isOnline ? 'success' : 'error'" size="small">
                {{ proxy.isOnline ? '在线' : '离线' }}
              </NTag>
            </td>
            <td>
              <NDropdown :options="dropdownOptions.filter(opt => 
                !(opt.key === 'offline' && !proxy.isOnline)
              )" @select="key => handleSelect(key, proxy)" trigger="click" placement="bottom">
                <div style="display: flex; align-items: center;">
                  <NButton text>
                    <template #icon>
                      <NIcon>
                        <BuildOutline />
                      </NIcon>
                    </template>
                  </NButton>
                </div>
              </NDropdown>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCard>

    <!-- 远程地址信息弹窗 -->
    <NModal v-model:show="showModal" preset="dialog" title="隧道详细信息">
      <template #header>
        <div>隧道详细信息</div>
      </template>
      <div v-if="selectedProxy" style="padding: 16px 0">
        <div class="modal-info-item">
          <span class="label">隧道名称：</span>
          <span class="value">{{ selectedProxy.proxyName }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">协议类型：</span>
          <span class="value">{{ selectedProxy.proxyType.toUpperCase() }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">本地端口：</span>
          <span class="value">{{ selectedProxy.localPort }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">本地地址：</span>
          <span class="value">{{ selectedProxy.localIp }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">节点名称：</span>
          <span class="value">{{ getNodeLabel(selectedProxy.nodeId).split(' - ')[1] }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">节点主机名：</span>
          <span class="value">{{ nodeOptions.find(node => node.value === selectedProxy.nodeId)?.hostname || '-' }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">远程端口：</span>
          <span class="value">{{ selectedProxy.remotePort }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">上次启动时间：</span>
          <span class="value">{{ selectedProxy.lastStartTime || '从未启动' }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">上次关闭时间：</span>
          <span class="value">{{ selectedProxy.lastCloseTime || '从未关闭' }}</span>
        </div>
        <div class="modal-info-item">
          <span class="label">状态：</span>
          <NTag :type="selectedProxy.isOnline ? 'success' : 'error'" size="small">
            {{ selectedProxy.isOnline ? '在线' : '离线' }}
          </NTag>
          <NTag v-if="selectedProxy.isBanned" type="error" size="small" style="margin-left: 8px">
            已封禁
          </NTag>
        </div>
      </div>
    </NModal>

    <!-- 删除确认弹窗 -->
    <NModal v-model:show="showDeleteModal" preset="dialog" title="是否删除此隧道？" style="width: 400px">
      <template #header>
        <div>删除确认</div>
      </template>
        <p>确定要删除此隧道吗？此操作不可恢复。</p>
      <template #action>
        <NButton size="small" @click="showDeleteModal = false">取消</NButton>
        <NButton size="small" type="error" :loading="loading" @click="handleDeleteConfirm">删除</NButton>
      </template>
    </NModal>

    <!-- 编辑隧道弹窗 -->
    <NModal v-model:show="showEditModal" preset="dialog" title="编辑隧道">
      <NForm ref="editFormRef" :model="editForm" :rules="rules" label-placement="left" label-width="120"
        require-mark-placement="right-hanging" size="medium" style="padding-top: 12px;">
        <NFormItem label="隧道名称" path="proxyName">
          <NInput v-model:value="editForm.proxyName" placeholder="请输入隧道名称" />
        </NFormItem>
        <NFormItem label="本地地址" path="localIp">
          <NInput v-model:value="editForm.localIp" placeholder="请输入本地地址" />
        </NFormItem>
        <NFormItem label="本地端口" path="localPort">
          <NInputNumber v-model:value="editForm.localPort" :min="1" :max="65535" placeholder="请输入本地端口" />
        </NFormItem>
        <NFormItem label="远程端口" path="remotePort">
          <NInputNumber v-model:value="editForm.remotePort" :min="1" :max="65535" placeholder="请输入远程端口" />
        </NFormItem>
        <NFormItem v-if="editForm.proxyType === 'http' || editForm.proxyType === 'https'" label="绑定域名" path="domain">
          <NInput v-model:value="editForm.domain" placeholder="请输入绑定域名" />
        </NFormItem>

        <NDivider>高级配置</NDivider>
        <NText depth="3" style="padding-bottom: 15px; display: block;">
          提示：仅推荐技术用户使用，一般用户请勿随意填写。请确保您的配置正确，否则隧道可能无法启动。
        </NText>

        <NFormItem label="访问密钥" path="accessKey">
          <NInput v-model:value="editForm.accessKey" placeholder="请输入访问密钥" />
        </NFormItem>
        <NFormItem label="Host Header Rewrite" path="hostHeaderRewrite">
          <NInput v-model:value="editForm.hostHeaderRewrite" placeholder="请输入 Host 请求头重写值" />
        </NFormItem>
        <NFormItem label="X-From-Where" path="headerXFromWhere">
          <NInput v-model:value="editForm.headerXFromWhere" placeholder="请输入 X-From-Where 请求头值" />
        </NFormItem>
        <NFormItem label="Proxy Protocol" path="proxyProtocolVersion">
          <NSelect v-model:value="editForm.proxyProtocolVersion" :options="[
            { label: '不启用', value: '' },
            { label: 'v1', value: 'v1' },
            { label: 'v2', value: 'v2' }
          ]" placeholder="Proxy Protocol Version" />
        </NFormItem>
        <NFormItem label="其他选项">
          <div style="display: flex; gap: 16px;">
            <NSwitch v-model:value="editForm.useEncryption" :rail-style="railStyle">
              <template #checked>启用加密</template>
              <template #unchecked>禁用加密</template>
            </NSwitch>
            <NSwitch v-model:value="editForm.useCompression" :rail-style="railStyle">
              <template #checked>启用压缩</template>
              <template #unchecked>禁用压缩</template>
            </NSwitch>
          </div>
        </NFormItem>
      </NForm>
      <template #action>
        <NButton size="small" @click="showEditModal = false">取消</NButton>
        <NButton size="small" type="primary" :loading="loading" @click="handleEditSubmit">确定</NButton>
      </template>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue'
import { NCard, NButton, NButtonGroup, NTag, NTable, NIcon, NModal, NInput, NDropdown, NForm, NFormItem, NSelect, NInputNumber, useMessage, type FormInst, NDivider, NSwitch, NText, NPopconfirm } from 'naive-ui'
import { GridOutline, ListOutline, BuildOutline, RefreshOutline, SearchOutline, InformationCircleOutline, CreateOutline, TrashOutline, PowerOutline } from '@vicons/ionicons5'
import { AuthApi } from '../../shared/api/auth'
import type { Proxy, UserNodeName } from '../../types'
import { themeColors } from '../../constants/theme'

const message = useMessage()
const loading = ref(false)
const proxies = ref<Proxy[]>([])
const viewMode = ref<'grid' | 'list'>('grid')
const searchText = ref('')
const nodeOptions = ref<{ label: string; value: number; hostname: string }[]>([])
const showModal = ref(false)
const selectedProxy = ref<Proxy | null>(null)
const showEditModal = ref(false)
const editFormRef = ref<FormInst | null>(null)
const editForm = ref({
  proxyId: 0,
  proxyName: '',
  localIp: '',
  localPort: 0,
  remotePort: 0,
  domain: '',
  location: '',
  accessKey: '',
  hostHeaderRewrite: '',
  headerXFromWhere: '',
  useEncryption: false,
  useCompression: false,
  proxyProtocolVersion: '',
  proxyType: '',
  nodeId: 0
})

const proxyTypeOptions = [
  { label: 'TCP', value: 'tcp' },
  { label: 'UDP', value: 'udp' },
  { label: 'HTTP', value: 'http' },
  { label: 'HTTPS', value: 'https' }
]

const rules = {
  proxyName: {
    required: true,
    message: '请输入隧道名称',
    trigger: 'blur',
    type: 'string'
  },
  localIp: {
    required: true,
    message: '请输入本地地址',
    trigger: 'blur',
    type: 'string'
  },
  localPort: {
    required: true,
    message: '请输入本地端口',
    trigger: 'blur',
    type: 'number',
    validator: (_rule: any, value: number) => {
      if (value < 1 || value > 65535) {
        return new Error('端口范围必须在 1-65535 之间')
      }
      return true
    }
  },
  remotePort: {
    required: true,
    message: '请输入远程端口',
    trigger: 'blur',
    type: 'number',
    validator: (_rule: any, value: number) => {
      if (editForm.value.proxyType === 'http' || editForm.value.proxyType === 'https') {
        return true
      }
      if (value < 1 || value > 65535) {
        return new Error('端口范围必须在 1-65535 之间')
      }
      return true
    }
  },
  domain: {
    type: 'string',
    trigger: 'blur',
    validator: (_rule: any, value: string) => {
      if (editForm.value.proxyType === 'http' || editForm.value.proxyType === 'https') {
        if (!value) {
          return new Error('请输入绑定域名')
        }
      }
      return true
    }
  }
} as const

// 过滤隧道列表
const filteredProxies = computed(() => {
  const search = searchText.value.toLowerCase()
  return proxies.value.filter(proxy =>
    proxy.proxyName.toLowerCase().includes(search) ||
    proxy.proxyType.toLowerCase().includes(search) ||
    (proxy.domain || '').toLowerCase().includes(search) ||
    getNodeLabel(proxy.nodeId).toLowerCase().includes(search)
  )
})

const handleRefresh = async () => {
  loading.value = true
  try {
    const res = await AuthApi.getUserProxies()
    if (res.data.code === 200) {
      proxies.value = res.data.data
    } else {
      message.error(res.data.message || '获取隧道列表失败')
    }
  } catch (error: any) {
    message.error(error?.response?.data?.message || '获取隧道列表失败')
  } finally {
    loading.value = false
  }
}

const getNodeLabel = (nodeId: number) => {
  const node = nodeOptions.value.find(node => node.value === nodeId)
  return node ? `#${nodeId} - ${node.label}` : `#${nodeId}`
}

const handleViewInfo = (proxy: Proxy) => {
  selectedProxy.value = proxy
  showModal.value = true
}

// 获取节点列表
const fetchNodes = async () => {
  try {
    const res = await AuthApi.getNodeNames()
    if (res.data.code === 200) {
      nodeOptions.value = res.data.data.map((node: UserNodeName) => ({
        label: node.name,
        value: node.nodeId,
        hostname: node.hostname
      }))
    }
  } catch (error: any) {
    message.error('获取节点列表失败')
  }
}

// 初始化数据
fetchNodes()
handleRefresh()

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const dropdownOptions = [
  {
    label: '查看详情',
    key: 'view',
    icon: renderIcon(InformationCircleOutline)
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '编辑',
    key: 'edit',
    icon: renderIcon(CreateOutline)
  },
  {
    label: '刷新状态',
    key: 'refresh',
    icon: renderIcon(RefreshOutline)
  },
  {
    label: '强制下线',
    key: 'kickProxy',
    icon: renderIcon(PowerOutline)
  },
  {
    type: 'divider',
    key: 'd2'
  },
  {
    label: '删除',
    key: 'delete',
    icon: renderIcon(TrashOutline)
  }
]

const handleDelete = async (proxy: Proxy) => {
  try {
    await AuthApi.deleteProxy(proxy.proxyId)
    message.success('删除隧道成功')
    handleRefresh()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '删除隧道失败')
  }
}

const handleRefreshStatus = async (proxy: Proxy) => {
  try {
    await AuthApi.refreshProxyStatus(proxy.proxyId)
    message.success('刷新状态成功')
    handleRefresh()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '刷新状态失败')
  }
}

const handleKickProxy = async (proxy: Proxy) => {
  try {
    await AuthApi.kickProxy(proxy.proxyId)
    message.success('强制下线成功')
    handleRefresh()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '强制下线失败')
  }
}

const handleEdit = (proxy: Proxy) => {
  editForm.value = {
    proxyId: proxy.proxyId,
    proxyName: proxy.proxyName,
    localIp: proxy.localIp,
    localPort: proxy.localPort,
    remotePort: proxy.remotePort,
    domain: proxy.domain || '',
    location: proxy.location || '',
    accessKey: proxy.accessKey || '',
    hostHeaderRewrite: proxy.hostHeaderRewrite || '',
    headerXFromWhere: proxy.headerXFromWhere || '',
    useEncryption: proxy.useEncryption || false,
    useCompression: proxy.useCompression || false,
    proxyProtocolVersion: proxy.proxyProtocolVersion || '',
    proxyType: proxy.proxyType,
    nodeId: proxy.nodeId
  }
  showEditModal.value = true
}

const handleEditSubmit = () => {
  editFormRef.value?.validate(async (errors) => {
    if (!errors) {
      loading.value = true
      try {
        await AuthApi.updateProxy(editForm.value)
        message.success('更新隧道成功')
        showEditModal.value = false
        handleRefresh()
      } catch (error: any) {
        message.error(error?.response?.data?.message || '更新隧道失败')
      } finally {
        loading.value = false
      }
    }
  })
}

const showDeleteModal = ref(false)
const proxyToDelete = ref<Proxy | null>(null)

const handleDeleteClick = (proxy: Proxy) => {
  proxyToDelete.value = proxy
  showDeleteModal.value = true
}

const handleDeleteConfirm = async () => {
  if (!proxyToDelete.value) return
  try {
    await AuthApi.deleteProxy(proxyToDelete.value.proxyId)
    message.success('删除隧道成功')
    handleRefresh()
    showDeleteModal.value = false
  } catch (error: any) {
    message.error(error?.response?.data?.message || '删除隧道失败')
  }
}

const actions = [
  {
    label: '详情',
    key: 'detail',
    icon: renderIcon(InformationCircleOutline)
  },
  {
    label: '编辑',
    key: 'edit',
    icon: renderIcon(CreateOutline)
  },
  {
    label: '删除',
    key: 'delete',
    icon: renderIcon(TrashOutline)
  }
]

const handleSelect = (key: string, proxy: Proxy) => {
  switch (key) {
    case 'view':
      selectedProxy.value = proxy
      showModal.value = true
      break
    case 'edit':
      handleEdit(proxy)
      break
    case 'refresh':
      handleRefreshStatus(proxy)
      break
    case 'kickProxy':
      handleKickProxy(proxy)
      break
    case 'delete':
      handleDeleteClick(proxy)
      break
  }
}

const railStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  const style = {
    background: checked ? themeColors.primary : undefined,
    boxShadow: focused ? `0 0 0 2px ${themeColors.primarySuppl}` : undefined
  }
  return style
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/manageProxies.scss';
</style>