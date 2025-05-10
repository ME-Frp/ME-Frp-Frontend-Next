<template>
  <div>
    <NCard title="节点管理">
      <NSpace vertical :size="12">
        <NSpace>
          <NInput v-model:value="searchKeyword" placeholder="搜索ID、节点名称或主机名" style="width: 200px" clearable
            @update:value="handleSearch" />
          <NSelect v-model:value="selectedOnline" placeholder="在线状态" :options="onlineOptions" style="width: 120px"
            clearable @update:value="handleFilterChange" />
          <NSelect v-model:value="selectedStatus" placeholder="节点状态" :options="statusOptions" style="width: 120px"
            clearable @update:value="handleFilterChange" />
          <NButton type="primary" @click="showAddModal = true">
            添加节点
          </NButton>
        </NSpace>

        <NDataTable remote :columns="columns" :data="nodes" :loading="loading" :pagination="pagination" :style="{
          '.n-data-table-td': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '200px'
          }
        }" @update:page="handlePageChange" />
      </NSpace>

      <NModal v-model:show="showAddModal" preset="card" title="添加节点" style="width: 600px;">
        <NForm ref="formRef" :model="formModel" :rules="rules" label-placement="left" label-width="auto"
          require-mark-placement="right-hanging">
          <NFormItem label="节点名称" path="name">
            <NInput v-model:value="formModel.name" placeholder="请输入节点名称" />
          </NFormItem>
          <NFormItem label="节点地区" path="region">
            <NSelect v-model:value="formModel.region" :options="regionOptions" placeholder="请选择节点地区" />
          </NFormItem>
          <NFormItem label="主机名" path="hostname">
            <NInput v-model:value="formModel.hostname" placeholder="请输入主机名" />
          </NFormItem>
          <NFormItem label="节点描述" path="description">
            <NInput v-model:value="formModel.description" type="textarea" placeholder="请输入节点描述" />
          </NFormItem>
          <NFormItem label="Token" path="token">
            <NInput v-model:value="formModel.token" placeholder="请输入Token" />
          </NFormItem>
          <NFormItem label="服务端口" path="servicePort">
            <NInputNumber v-model:value="formModel.servicePort" placeholder="请输入服务端口" />
          </NFormItem>
          <NFormItem label="管理端口" path="adminPort">
            <NInputNumber v-model:value="formModel.adminPort" placeholder="请输入管理端口" />
          </NFormItem>
          <NFormItem label="管理密码" path="adminPass">
            <NInput v-model:value="formModel.adminPass" show-password-on="click"
              placeholder="请输入管理密码" />
          </NFormItem>
          <NFormItem label="允许用户组" path="allowGroup">
            <NButtonGroup>
              <NButton v-for="group in groupOptions" :key="group.value"
                :type="formModel.allowGroup.includes(group.value) ? 'primary' : 'default'"
                :disabled="group.value === 'admin'" @click="toggleGroup(group.value)">
                {{ group.label }}
              </NButton>
            </NButtonGroup>
          </NFormItem>
          <NFormItem label="允许端口" path="allowPort">
            <NInput v-model:value="formModel.allowPort" placeholder="请输入允许的端口范围, 如: 10000-20000" />
          </NFormItem>
          <NFormItem label="允许协议" path="allowType">
            <NButtonGroup>
              <NButton v-for="protocol in protocolOptions" :key="protocol.value"
                :type="formModel.allowType.includes(protocol.value) ? 'primary' : 'default'"
                @click="toggleProtocol(protocol.value)">
                {{ protocol.label }}
              </NButton>
            </NButtonGroup>
          </NFormItem>
        </NForm>
        <template #footer>
          <NSpace justify="end">
            <NButton @click="showAddModal = false">取消</NButton>
            <NButton type="primary" :loading="submitting" @click="handleAddNode">确定</NButton>
          </NSpace>
        </template>
      </NModal>

      <NModal v-model:show="showEditModal" preset="card" title="编辑节点" style="width: 600px;">
        <NTabs type="line">
          <NTabPane name="基本信息" tab="基本信息">
            <NForm ref="formRef" :model="formModel" :rules="rules" label-placement="left" label-width="auto"
              require-mark-placement="right-hanging">
              <NFormItem label="节点名称" path="name">
                <NInput v-model:value="formModel.name" placeholder="请输入节点名称" />
              </NFormItem>
              <NFormItem label="节点带宽" path="bandwidth">
                <NInput v-model:value="formModel.bandwidth" placeholder="请输入节点带宽" />
              </NFormItem>
              <NFormItem label="节点地区" path="region">
                <NSelect v-model:value="formModel.region" :options="regionOptions" placeholder="请选择节点地区" />
              </NFormItem>
              <NFormItem label="主机名" path="hostname">
                <NInput v-model:value="formModel.hostname" placeholder="请输入主机名" />
              </NFormItem>
              <NFormItem label="节点描述" path="description">
                <NInput v-model:value="formModel.description" type="textarea" placeholder="请输入节点描述" />
              </NFormItem>
              <NFormItem label="Token" path="token">
                <NInput v-model:value="formModel.token" placeholder="请输入Token" />
              </NFormItem>
              <NFormItem label="服务端口" path="servicePort">
                <NInputNumber v-model:value="formModel.servicePort" placeholder="请输入服务端口" />
              </NFormItem>
              <NFormItem label="管理端口" path="adminPort">
                <NInputNumber v-model:value="formModel.adminPort" placeholder="请输入管理端口" />
              </NFormItem>
              <NFormItem label="管理密码" path="adminPass">
                <NInput v-model:value="formModel.adminPass" show-password-on="click"
                  placeholder="请输入管理密码" />
              </NFormItem>
              <NFormItem label="允许用户组" path="allowGroup">
                <NButtonGroup>
                  <NButton v-for="group in groupOptions" :key="group.value"
                    :type="formModel.allowGroup.includes(group.value) ? 'primary' : 'default'"
                    :disabled="group.value === 'admin'" @click="toggleGroup(group.value)">
                    {{ group.label }}
                  </NButton>
                </NButtonGroup>
              </NFormItem>
              <NFormItem label="允许端口" path="allowPort">
                <NInput v-model:value="formModel.allowPort" placeholder="请输入允许的端口范围, 如: 10000-20000" />
              </NFormItem>
              <NFormItem label="允许协议" path="allowType">
                <NButtonGroup>
                  <NButton v-for="protocol in protocolOptions" :key="protocol.value"
                    :type="formModel.allowType.includes(protocol.value) ? 'primary' : 'default'"
                    @click="toggleProtocol(protocol.value)">
                    {{ protocol.label }}
                  </NButton>
                </NButtonGroup>
              </NFormItem>
            </NForm>
          </NTabPane>
          <NTabPane name="安装脚本" tab="安装脚本">
            <NSpace vertical>
              <NForm label-placement="left" label-width="auto">
                <NFormItem label="系统类型">
                  <NSelect v-model:value="scriptSystem" :options="systemOptions" placeholder="请选择系统类型" />
                </NFormItem>
                <NFormItem label="架构">
                  <NSelect v-model:value="scriptArch" :options="archOptions" placeholder="请选择系统架构"
                    :loading="loadingArchs" />
                </NFormItem>
                <NFormItem>
                  <NButton type="primary" :loading="generatingScript"
                    :disabled="!editingNode || !scriptSystem || !scriptArch" @click="generateScript">
                    生成安装脚本
                  </NButton>
                </NFormItem>
              </NForm>
              <div v-if="scriptUrl">
                <NAlert type="success">
                  已生成安装脚本，请点击复制按钮复制下载链接或安装命令
                </NAlert>
                <div style="margin-top: 16px;">
                  <NInput v-model:value="scriptUrl" readonly>
                  </NInput>
                  <NButton style="margin-top: 8px;" type="primary" @click="copyScriptUrl">
                    复制下载链接
                  </NButton>
                </div>
                <div style="margin-top: 16px;">
                  <p>一键安装命令（{{ scriptSystem === 'linux' ? 'Linux Shell' : 'Windows PowerShell' }}）：</p>
                  <div style="margin-top: 8px;">
                    <NInput :value="getInstallCommand" readonly />
                    <div style="margin-top: 8px;">
                      <NButton type="primary" @click="copyInstallCommand">
                        复制安装命令
                      </NButton>
                    </div>
                  </div>
                </div>
              </div>
            </NSpace>
          </NTabPane>
        </NTabs>
        <template #footer>
          <NSpace justify="end">
            <NButton @click="showEditModal = false">取消</NButton>
            <NButton type="primary" :loading="submitting" @click="handleEditSubmit">确定</NButton>
          </NSpace>
        </template>
      </NModal>

      <NModal v-model:show="showToggleModal" preset="dialog" :title="currentNode?.isDisabled ? '启用节点' : '禁用节点'"
        style="width: 400px;" :show-icon="false">
        <div>确定要{{ currentNode?.isDisabled ? '启用' : '禁用' }}节点 "{{ currentNode?.name }}" 吗？</div>
        <template #action>
          <NButton secondary size="small" @click="showToggleModal = false">取消</NButton>
          <NButton secondary size="small" type="warning" :loading="submitting"
            @click="() => currentNode && handleToggleNode(currentNode)">确定</NButton>
        </template>
      </NModal>

      <NModal v-model:show="showDeleteModal" preset="dialog" title="删除节点" style="width: 400px;" :show-icon="false">
        <div>确定要删除节点 "{{ currentNode?.name }}" 吗？此操作不可恢复！</div>
        <template #action>
          <NButton secondary size="small" @click="showDeleteModal = false">取消</NButton>
          <NButton secondary size="small" type="error" :loading="submitting"
            @click="() => currentNode && handleDeleteNode(currentNode)">删除</NButton>
        </template>
      </NModal>

      <NModal v-model:show="showDashboardTipModal" preset="card" title="访问管理面板提示" style="width: 460px;">
        <div>
          <NSpace vertical>
            <div>您正在访问 Frp 服务端面板，请注意以下事项：</div>
            <NAlert type="warning">
              由于 Basic Auth 机制的限制, Frp 服务端可能会提示 "从 Frp 服务端获取服务器信息失败！"<br>
              请在成功登录管理面板后，手动编辑地址栏，移除用户名和密码部分。
            </NAlert>
            <NDivider />
            <NDescriptions bordered size="small">
              <NDescriptionsItem label="用户名">
                <NText code>admin</NText>
                <NButton size="tiny" text type="primary" @click="() => copyAdminUsername()" style="margin-left: 8px;">
                  <template #icon>
                    <NIcon>
                      <CopyOutline />
                    </NIcon>
                  </template>
                  复制
                </NButton>
              </NDescriptionsItem>
              <NDescriptionsItem label="密码">
                <NText code>{{ currentDashboardNode?.adminPass }}</NText>
                <NButton size="tiny" text type="primary" @click="() => copyAdminPassword()" style="margin-left: 8px;">
                  <template #icon>
                    <NIcon>
                      <CopyOutline />
                    </NIcon>
                  </template>
                  复制
                </NButton>
              </NDescriptionsItem>
            </NDescriptions>
          </NSpace>
        </div>
        <template #footer>
          <NSpace justify="end">
            <NButton @click="showDashboardTipModal = false">取消</NButton>
            <NButton type="primary" @click="confirmOpenDashboard">确定</NButton>
          </NSpace>
        </template>
      </NModal>
    </NCard>
  </div>
</template>

<script lang="ts" setup>
import { ref, h, computed, watch } from 'vue'
import { NCard, NSpace, NDataTable, NButton, NModal, NForm, NFormItem, NInput, NInputNumber, useMessage, NButtonGroup, NSelect, NTag, NDropdown, NIcon, NTabs, NTabPane, NAlert, NDivider, NDescriptions, NDescriptionsItem, NText } from 'naive-ui'
import { EllipsisHorizontalCircleOutline, CreateOutline, PowerOutline, TrashOutline, AppsOutline, CopyOutline } from '@vicons/ionicons5'
import type { DataTableColumns, FormRules, FormInst, SelectOption, DropdownOption } from 'naive-ui'
import { AdminApi } from '../../../shared/api/admin'
import { AuthApi } from '../../../shared/api/auth'
import { getNodeInstallScript } from '../../../shared/api/nodeDonate'
import type { Node, UpdateNodeArgs, GetNodesArgs, Product } from '../../../types/adminApi'

const message = useMessage()
const loading = ref(false)
const submitting = ref(false)
const nodes = ref<Node[]>([])
const showAddModal = ref(false)
const formRef = ref<FormInst | null>(null)
const showDashboardTipModal = ref(false)
const currentDashboardNode = ref<Node | null>(null)

// 安装脚本相关变量
const scriptSystem = ref<string>('linux')
const scriptArch = ref<string>('')
const scriptUrl = ref<string>('')
const generatingScript = ref(false)
const loadingArchs = ref(false)
const products = ref<Product[]>([])

const searchKeyword = ref('')
const selectedOnline = ref<string | null>(null)
const selectedStatus = ref<string | null>(null)

const groupOptions = ref<{ label: string; value: string }[]>([])

const protocolOptions = [
  { label: 'TCP', value: 'tcp' },
  { label: 'UDP', value: 'udp' },
  { label: 'HTTP', value: 'http' },
  { label: 'HTTPS', value: 'https' }
]

const regionOptions = [
  { label: '中国大陆', value: 'cn' },
  { label: '中国香港/澳门/台湾地区', value: 'cnos' },
  { label: '海外', value: 'oversea' }
]

const formModel = ref({
  name: '',
  region: 'cn',
  bandwidth: '100Mbps',
  hostname: '',
  description: '',
  token: '',
  servicePort: 2333,
  adminPort: 8233,
  adminPass: '',
  allowGroup: [] as string[],
  allowPort: '',
  allowType: [] as string[]
})

const toggleGroup = (value: string) => {
  if (value === 'admin') {
    if (!formModel.value.allowGroup.includes(value)) {
      formModel.value.allowGroup.push(value)
    }
    return
  }

  const index = formModel.value.allowGroup.indexOf(value)
  if (index === -1) {
    formModel.value.allowGroup.push(value)
  } else {
    formModel.value.allowGroup.splice(index, 1)
  }
}

const toggleProtocol = (value: string) => {
  const index = formModel.value.allowType.indexOf(value)
  if (index === -1) {
    formModel.value.allowType.push(value)
  } else {
    formModel.value.allowType.splice(index, 1)
  }
}

const rules: FormRules = {
  name: {
    required: true,
    message: '请输入节点名称',
    trigger: ['blur', 'input']
  },
  region: {
    required: true,
    message: '请选择节点地区',
    trigger: ['blur', 'input']
  },
  hostname: {
    required: true,
    message: '请输入主机名',
    trigger: ['blur', 'input']
  },
  token: {
    required: true,
    message: '请输入Token',
    trigger: ['blur', 'input']
  },
  servicePort: {
    required: true,
    message: '请输入服务端口',
    trigger: ['blur', 'input'],
    validator: (_rule, value) => {
      if (typeof value !== 'number' || value < 1 || value > 65535) {
        return new Error('端口范围必须在 1-65535 之间')
      }
      return true
    }
  },
  adminPort: {
    required: true,
    message: '请输入管理端口',
    trigger: ['blur', 'input'],
    validator: (_rule, value) => {
      if (typeof value !== 'number' || value < 1 || value > 65535) {
        return new Error('端口范围必须在 1-65535 之间')
      }
      return true
    }
  },
  adminPass: {
    required: true,
    message: '请输入管理密码',
    trigger: ['blur', 'input']
  },
  allowGroup: {
    required: true,
    message: '请选择允许的用户组',
    trigger: ['blur', 'input'],
    validator: (_rule, value) => {
      if (!Array.isArray(value) || value.length === 0) {
        return new Error('请至少选择一个用户组')
      }
      return true
    }
  },
  allowPort: {
    required: true,
    message: '请输入允许的端口范围',
    trigger: ['blur', 'input'],
    validator: (_rule, value) => {
      if (!value) return new Error('请输入端口范围')

      // 支持多个端口范围, 用逗号分隔
      const ranges = value.split(';').map(range => range.trim())

      for (const range of ranges) {
        // 检查单个端口
        if (/^\d+$/.test(range)) {
          const port = parseInt(range)
          if (port < 1 || port > 65535) {
            return new Error('端口必须在 1-65535 之间')
          }
          continue
        }

        // 检查端口范围
        const match = range.match(/^(\d+)-(\d+)$/)
        if (!match) {
          return new Error('端口范围格式不正确, 请使用 1-65535 或 80,443 或 1000-2000,3000-4000 的格式')
        }

        const start = parseInt(match[1])
        const end = parseInt(match[2])

        if (start < 1 || start > 65535 || end < 1 || end > 65535) {
          return new Error('端口必须在 1-65535 之间')
        }

        if (start >= end) {
          return new Error('起始端口必须小于结束端口')
        }
      }

      return true
    }
  },
  allowType: {
    required: true,
    message: '请选择允许的协议',
    trigger: ['blur', 'input'],
    validator: (_rule, value) => {
      if (!Array.isArray(value) || value.length === 0) {
        return new Error('请至少选择一个协议')
      }
      return true
    }
  }
}

const pagination = ref({
  page: 1,
  pageSize: 10,
  pageCount: 1,
  itemCount: 0,
  prefix({ itemCount }: { itemCount?: number }) {
    return `共 ${itemCount} 条`
  }
})

const columns: DataTableColumns = [
  {
    title: 'ID',
    key: 'nodeId',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.nodeId)
    }
  },
  {
    title: '名称',
    key: 'name',
    render(row) {
      return h(NSpace, { align: 'center' }, {
        default: () => [
          h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, [
            h(NTag, {
              type: row.isOnline ? 'success' : 'error',
              size: 'small'
            }, { default: () => row.isOnline ? '在线' : '离线' }),
            h('span', { style: 'margin-right: 4px' }, ' ' + row.name)
          ])
        ]
      })
    }
  },
  {
    title: '带宽',
    key: 'bandwidth',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.bandwidth)
    }
  },
  {
    title: '主机名',
    key: 'hostname',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.hostname)
    }
  },
  // {
  //   title: '描述',
  //   key: 'description',
  //   render(row) {
  //     return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.description)
  //   }
  // },
  {
    title: '服务端口',
    key: 'servicePort',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.servicePort)
    }
  },
  {
    title: '管理端口',
    key: 'adminPort',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.adminPort)
    }
  },
  {
    title: '用户组',
    key: 'allowGroup',
    render(row) {
      const groups = row.allowGroup.split(';')
      return h(
        NSpace,
        { wrap: true, justify: 'start' },
        {
          default: () => groups.map(group => {
            const option = groupOptions.value.find(opt => opt.value === group)
            return h(
              NTag,
              {
                type: 'info',
                size: 'small',
                style: 'margin: 2px'
              },
              { default: () => option ? option.label : group }
            )
          })
        }
      )
    }
  },
  {
    title: '端口',
    key: 'allowPort',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.allowPort)
    }
  },
  {
    title: '协议',
    key: 'allowType',
    render(row) {
      const types = row.allowType.split(';')
      return h(
        NSpace,
        { wrap: true, justify: 'start' },
        {
          default: () => types.map(type => {
            const option = protocolOptions.find(opt => opt.value === type)
            return h(
              NTag,
              {
                type: 'success',
                size: 'small',
                style: 'margin: 2px'
              },
              { default: () => option ? option.label : type }
            )
          })
        }
      )
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      return h(
        NTag,
        {
          type: row.isDisabled ? 'error' : 'success',
          size: 'small'
        },
        { default: () => row.isDisabled ? '已禁用' : '已启用' }
      )
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(NDropdown, {
        trigger: 'click',
        options: dropdownOptions(row),
        onSelect: (key: string) => handleSelect(key, row),
        placement: 'bottom'
      }, {
        default: () => h(NButton, {
          text: true,
          style: 'display: flex; align-items: center;'
        }, {
          icon: () => h(NIcon, null, {
            default: () => h(EllipsisHorizontalCircleOutline)
          })
        })
      })
    }
  }
]

const handlePageChange = (page: number) => {
  pagination.value.page = page
  fetchNodes()
}

const showEditModal = ref(false)
const editingNode = ref<Node | null>(null)

const handleEdit = (row: Node) => {
  editingNode.value = row
  formModel.value = {
    name: row.name,
    region: row.region,
    bandwidth: row.bandwidth,
    hostname: row.hostname,
    description: row.description,
    token: row.token,
    servicePort: row.servicePort,
    adminPort: row.adminPort,
    adminPass: row.adminPass,
    allowGroup: row.allowGroup.split(';'),
    allowPort: row.allowPort,
    allowType: row.allowType.split(';')
  }
  showEditModal.value = true

  // 重置脚本相关状态
  scriptSystem.value = 'linux'
  scriptArch.value = ''
  scriptUrl.value = ''
}

const handleEditSubmit = () => {
  if (!editingNode.value) return

  if (!formModel.value.allowGroup.includes('admin')) {
    formModel.value.allowGroup.push('admin')
  }

  formRef.value?.validate(async (errors) => {
    if (!errors) {
      submitting.value = true
      try {
        const config: UpdateNodeArgs = {
          nodeId: editingNode.value.nodeId,
          name: formModel.value.name,
          region: formModel.value.region,
          bandwidth: formModel.value.bandwidth,
          hostname: formModel.value.hostname,
          description: formModel.value.description,
          token: formModel.value.token,
          servicePort: formModel.value.servicePort,
          adminPort: formModel.value.adminPort,
          adminPass: formModel.value.adminPass,
          allowGroup: formModel.value.allowGroup.join(';'),
          allowPort: formModel.value.allowPort,
          allowType: formModel.value.allowType.join(';'),
        }
        await AdminApi.updateNode(config)
        message.success('更新节点成功')
        showEditModal.value = false
        formRef.value?.restoreValidation()
        editingNode.value = null
        Object.assign(formModel.value, {
          name: '',
          region: 'cn',
          hostname: '',
          description: '',
          token: '',
          servicePort: 2333,
          adminPort: 8233,
          adminPass: '',
          allowGroup: [],
          allowPort: '',
          allowType: [],
          bandwidth: ''
        })
        fetchNodes()
      } catch (error: any) {
        message.error(error?.response?.data?.message || '更新节点失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleAddNode = () => {
  if (!formModel.value.allowGroup.includes('admin')) {
    formModel.value.allowGroup.push('admin')
  }

  formRef.value?.validate(async (errors) => {
    if (!errors) {
      submitting.value = true
      try {
        const config = {
          ...formModel.value,
          allowGroup: formModel.value.allowGroup.join(';'),
          allowType: formModel.value.allowType.join(';')
        }
        await AdminApi.addNode(config)
        message.success('添加节点成功')
        showAddModal.value = false
        formRef.value?.restoreValidation()
        Object.assign(formModel.value, {
          name: '',
          region: 'cn',
          hostname: '',
          description: '',
          token: '',
          servicePort: 2333,
          adminPort: 8233,
          adminPass: '',
          allowGroup: [],
          allowPort: '',
          allowType: []
        })
        fetchNodes()
      } catch (error: any) {
        message.error(error?.response?.data?.message || '添加节点失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleSearch = () => {
  pagination.value.page = 1
  fetchNodes()
}

const handleFilterChange = () => {
  pagination.value.page = 1
  fetchNodes()
}

const onlineOptions: SelectOption[] = [
  { label: '在线', value: 'online' },
  { label: '离线', value: 'offline' }
]

const statusOptions: SelectOption[] = [
  { label: '已启用', value: 'enabled' },
  { label: '已禁用', value: 'disabled' }
]

const showToggleModal = ref(false)
const showDeleteModal = ref(false)
const currentNode = ref<Node | null>(null)

const handleToggleNode = async (node: Node) => {
  try {
    submitting.value = true
    await AdminApi.toggleNode(node.nodeId, !node.isDisabled)
    message.success(node.isDisabled ? '启用节点成功' : '禁用节点成功')
    showToggleModal.value = false
    loadData()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

const handleDeleteNode = async (node: Node) => {
  try {
    submitting.value = true
    await AdminApi.deleteNode(node.nodeId)
    message.success('删除节点成功')
    showDeleteModal.value = false
    loadData()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '操作失败')
  } finally {
    submitting.value = false
  }
}

const dropdownOptions = (row: Node): DropdownOption[] => [
  {
    label: '编辑',
    key: 'edit',
    type: 'primary',
    icon: () => h(NIcon, null, { default: () => h(CreateOutline) })
  },
  {
    label: '管理面板',
    key: 'dashboard',
    type: 'info',
    icon: () => h(NIcon, null, { default: () => h(AppsOutline) })
  },
  {
    label: row.isDisabled ? '启用' : '禁用',
    key: 'toggle',
    type: row.isDisabled ? 'success' : 'warning',
    icon: () => h(NIcon, null, { default: () => h(PowerOutline) })
  },
  {
    label: '删除',
    key: 'delete',
    type: 'error',
    icon: () => h(NIcon, null, { default: () => h(TrashOutline) })
  }
]

const handleSelect = (key: string, row: Node) => {
  switch (key) {
    case 'edit':
      handleEdit(row)
      break
    case 'dashboard':
      openDashboard(row)
      break
    case 'toggle':
      currentNode.value = row
      showToggleModal.value = true
      break
    case 'delete':
      currentNode.value = row
      showDeleteModal.value = true
      break
  }
}

const fetchNodes = async () => {
  loading.value = true
  try {
    const params: GetNodesArgs = {
      page: pagination.value.page,
      limit: pagination.value.pageSize
    }

    if (searchKeyword.value) {
      params.keyword = searchKeyword.value
    }
    if (selectedOnline.value !== null) {
      params.isOnline = selectedOnline.value === 'online'
    }
    if (selectedStatus.value !== null) {
      params.isDisabled = selectedStatus.value === 'disabled'
    }

    const res = await AdminApi.filterNodes(params)
    if (res.data.code === 200) {
      nodes.value = res.data.data.nodes
      pagination.value.itemCount = res.data.data.totalNodes
      pagination.value.pageCount = res.data.data.totalPages
    } else {
      message.error(res.data.message || '获取节点列表失败')
    }
  } catch (error: any) {
    message.error(error?.response?.data?.message || '获取节点列表失败')
  } finally {
    loading.value = false
  }
}

const fetchUserGroups = async () => {
  try {
    const res = await AuthApi.getUserGroups()
    if (res.data.code === 200) {
      groupOptions.value = res.data.data.groups.map(group => ({
        label: group.friendlyName,
        value: group.name
      }))
    } else {
      message.error(res.data.message || '获取用户组列表失败')
    }
  } catch (error: any) {
    message.error(error?.response?.data?.message || '获取用户组列表失败')
  }
}

const loadData = () => {
  fetchNodes()
  fetchUserGroups()
}

// 系统类型选项
const systemOptions: SelectOption[] = [
  { label: 'Linux', value: 'linux' },
  { label: 'Windows', value: 'windows' }
]

// 根据系统类型计算可用的架构选项
const archOptions = computed(() => {
  const system = scriptSystem.value

  // 过滤出MEFrps产品，并且系统类型匹配
  const filteredProducts = products.value.filter(p =>
    p.productId.includes('MEFrp_Next') &&
    p.system.includes(system)
  )

  if (filteredProducts.length === 0) {
    return []
  }

  // 参考 NodeDonate.vue 的处理方式，从 arch 字段中提取架构信息
  // 架构格式：windows:386/amd64/arm/arm64|darwin:amd64/arm64|linux:386/amd64/arm/arm64|android:arm64
  const archMap = new Map()

  filteredProducts.forEach(product => {
    if (!product.arch) return

    product.arch.split('|').forEach(item => {
      const [sys, archs] = item.split(':')
      if (sys === system) {
        archMap.set(sys, archs.split('/'))
      }
    })
  })

  // 获取当前系统的架构列表
  const archs = archMap.get(system) || []

  // 转换为选项格式
  return archs.map(arch => {
    let label = arch

    // 为常见架构添加友好名称
    if (arch === 'x86_64') label = 'x86_64 (64 位)'
    else if (arch === 'amd64') label = 'amd64 (64 位)'
    else if (arch === 'i386') label = 'i386 (32 位)'
    else if (arch === '386') label = '386 (32 位)'
    else if (arch === 'arm64') label = 'arm64 (ARM64)'
    else if (arch === 'armv7') label = 'armv7 (ARM)'
    else if (arch === 'arm') label = 'arm (ARM)'

    return { label, value: arch }
  })
})

// 监听系统类型变化，自动选择第一个架构
watch(() => scriptSystem.value, (_newSystem) => {
  // 使用计算属性中的逻辑获取架构选项
  const options = archOptions.value

  if (options.length > 0) {
    scriptArch.value = options[0].value
  } else {
    scriptArch.value = ''
  }
})

// 获取系统架构信息
const fetchProducts = async () => {
  loadingArchs.value = true
  try {
    const res = await AuthApi.getProducts()
    if (res.data.code === 200) {
      products.value = res.data.data || []

      // 设置默认架构
      setTimeout(() => {
        const options = archOptions.value
        if (options.length > 0) {
          scriptArch.value = options[0].value
        }
      }, 0)
    } else {
      message.error(res.data.message || '获取产品信息失败')
    }
  } catch (error) {
    console.error(error)
    message.error('获取产品信息失败，请稍后重试')
  } finally {
    loadingArchs.value = false
  }
}

// 生成安装脚本
const generateScript = async () => {
  if (!editingNode.value || !scriptSystem.value || !scriptArch.value) {
    message.warning('请选择系统类型和架构')
    return
  }

  try {
    generatingScript.value = true
    const response = await getNodeInstallScript({
      nodeId: String(editingNode.value.nodeId),
      system: scriptSystem.value as 'linux' | 'windows',
      arch: scriptArch.value
    })

    if (response.data.code === 200) {
      scriptUrl.value = response.data.data.downloadUrl
      message.success('安装脚本生成成功')
    } else {
      message.error(response.data.message || '生成安装脚本失败')
    }
  } catch (error: any) {
    message.error(error?.response?.data?.message || '生成安装脚本失败')
  } finally {
    generatingScript.value = false
  }
}

// 复制脚本链接
const copyScriptUrl = () => {
  if (!scriptUrl.value) {
    message.warning('没有可复制的脚本链接')
    return
  }

  navigator.clipboard.writeText(scriptUrl.value)
    .then(() => {
      message.success('脚本下载链接已复制到剪贴板')
    })
    .catch(() => {
      message.error('复制失败，请手动复制')
    })
}

// 获取一键安装命令
const getInstallCommand = computed(() => {
  if (!scriptUrl.value) {
    return ''
  }

  const downloadUrl = scriptUrl.value

  if (scriptSystem.value === 'linux') {
    return `wget -O install.sh "${downloadUrl}" && chmod +x install.sh && bash install.sh`
  } else {
    // Windows PowerShell命令，使用Set-ExecutionPolicy绕过执行策略限制
    return `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iwr -useb "${downloadUrl}" | iex`
  }
})

// 复制安装命令到剪贴板
const copyInstallCommand = () => {
  if (!getInstallCommand.value) {
    message.warning('请先生成脚本')
    return
  }

  try {
    navigator.clipboard.writeText(getInstallCommand.value)
    message.success('安装命令已复制到剪贴板')
  } catch (error) {
    message.error('复制失败，请手动复制')
    console.error('复制安装命令错误:', error)
  }
}

// 打开frps管理面板
const openDashboard = (node: Node) => {

  currentDashboardNode.value = node
  showDashboardTipModal.value = true
}

// 复制管理员用户名
const copyAdminUsername = () => {
  navigator.clipboard.writeText('admin')
    .then(() => {
      message.success('用户名已复制到剪贴板')
    })
    .catch(() => {
      message.error('复制失败，请手动复制')
    })
}

// 复制管理员密码
const copyAdminPassword = () => {
  if (!currentDashboardNode.value) return

  navigator.clipboard.writeText(currentDashboardNode.value.adminPass)
    .then(() => {
      message.success('密码已复制到剪贴板')
    })
    .catch(() => {
      message.error('复制失败，请手动复制')
    })
}

// 确认打开管理面板
const confirmOpenDashboard = () => {
  if (!currentDashboardNode.value) return

  const password = currentDashboardNode.value.adminPass // 使用节点配置的管理密码

  // 构建带有Basic Auth的URL (用户名:密码@主机:端口)
  const dashboardUrl = `http://admin:${encodeURIComponent(password)}@${currentDashboardNode.value.hostname}:${currentDashboardNode.value.adminPort}`

  console.log(dashboardUrl)
  // 打开新窗口
  window.open(dashboardUrl, '_blank')

  // 关闭提示模态框
  showDashboardTipModal.value = false
}

// 在组件挂载时获取用户组列表
fetchUserGroups()
fetchNodes()
fetchProducts()
</script>