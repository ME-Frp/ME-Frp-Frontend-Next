<template>
  <n-card title="节点管理">
    <n-space vertical :size="12">
      <n-space>
        <n-input
          v-model:value="searchKeyword"
          placeholder="搜索节点名称或主机名"
          style="width: 200px"
          clearable
          @update:value="handleSearch"
        />
        <n-select
          v-model:value="selectedOnline"
          placeholder="在线状态"
          :options="onlineOptions"
          style="width: 120px"
          clearable
          @update:value="handleFilterChange"
        />
        <n-select
          v-model:value="selectedStatus"
          placeholder="节点状态"
          :options="statusOptions"
          style="width: 120px"
          clearable
          @update:value="handleFilterChange"
        />
        <n-button type="primary" @click="showAddModal = true">
          添加节点
        </n-button>
      </n-space>

      <n-data-table remote :columns="columns" :data="nodes" :loading="loading" :pagination="pagination"
        @update:page="handlePageChange" />
    </n-space>

    <n-modal v-model:show="showAddModal" preset="card" title="添加节点" style="width: 600px;">
      <n-form ref="formRef" :model="formModel" :rules="rules" label-placement="left" label-width="auto"
        require-mark-placement="right-hanging">
        <n-form-item label="节点名称" path="name">
          <n-input v-model:value="formModel.name" placeholder="请输入节点名称" />
        </n-form-item>
        <n-form-item label="主机名" path="hostname">
          <n-input v-model:value="formModel.hostname" placeholder="请输入主机名" />
        </n-form-item>
        <n-form-item label="节点描述" path="description">
          <n-input v-model:value="formModel.description" type="textarea" placeholder="请输入节点描述" />
        </n-form-item>
        <n-form-item label="Token" path="token">
          <n-input v-model:value="formModel.token" placeholder="请输入Token" />
        </n-form-item>
        <n-form-item label="服务端口" path="servicePort">
          <n-input-number v-model:value="formModel.servicePort" placeholder="请输入服务端口" />
        </n-form-item>
        <n-form-item label="管理端口" path="adminPort">
          <n-input-number v-model:value="formModel.adminPort" placeholder="请输入管理端口" />
        </n-form-item>
        <n-form-item label="管理密码" path="adminPass">
          <n-input v-model:value="formModel.adminPass" type="password" show-password-on="click" placeholder="请输入管理密码" />
        </n-form-item>
        <n-form-item label="允许用户组" path="allowGroup">
          <n-button-group>
            <n-button
              v-for="group in groupOptions"
              :key="group.value"
              :type="formModel.allowGroup.includes(group.value) ? 'primary' : 'default'"
              :disabled="group.value === 'admin'"
              @click="toggleGroup(group.value)"
            >
              {{ group.label }}
            </n-button>
          </n-button-group>
        </n-form-item>
        <n-form-item label="允许端口" path="allowPort">
          <n-input v-model:value="formModel.allowPort" placeholder="请输入允许的端口范围，如: 10000-20000" />
        </n-form-item>
        <n-form-item label="允许协议" path="allowType">
          <n-button-group>
            <n-button
              v-for="protocol in protocolOptions"
              :key="protocol.value"
              :type="formModel.allowType.includes(protocol.value) ? 'primary' : 'default'"
              @click="toggleProtocol(protocol.value)"
            >
              {{ protocol.label }}
            </n-button>
          </n-button-group>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showAddModal = false">取消</n-button>
          <n-button type="primary" :loading="submitting" @click="handleAddNode">确定</n-button>
        </n-space>
      </template>
    </n-modal>

    <n-modal v-model:show="showEditModal" preset="card" title="编辑节点" style="width: 600px;">
      <n-form ref="formRef" :model="formModel" :rules="rules" label-placement="left" label-width="auto"
        require-mark-placement="right-hanging">
        <n-form-item label="节点名称" path="name">
          <n-input v-model:value="formModel.name" placeholder="请输入节点名称" />
        </n-form-item>
        <n-form-item label="主机名" path="hostname">
          <n-input v-model:value="formModel.hostname" placeholder="请输入主机名" />
        </n-form-item>
        <n-form-item label="节点描述" path="description">
          <n-input v-model:value="formModel.description" type="textarea" placeholder="请输入节点描述" />
        </n-form-item>
        <n-form-item label="Token" path="token">
          <n-input v-model:value="formModel.token" placeholder="请输入Token" />
        </n-form-item>
        <n-form-item label="服务端口" path="servicePort">
          <n-input-number v-model:value="formModel.servicePort" placeholder="请输入服务端口" />
        </n-form-item>
        <n-form-item label="管理端口" path="adminPort">
          <n-input-number v-model:value="formModel.adminPort" placeholder="请输入管理端口" />
        </n-form-item>
        <n-form-item label="管理密码" path="adminPass">
          <n-input v-model:value="formModel.adminPass" type="password" show-password-on="click" placeholder="请输入管理密码" />
        </n-form-item>
        <n-form-item label="允许用户组" path="allowGroup">
          <n-button-group>
            <n-button
              v-for="group in groupOptions"
              :key="group.value"
              :type="formModel.allowGroup.includes(group.value) ? 'primary' : 'default'"
              :disabled="group.value === 'admin'"
              @click="toggleGroup(group.value)"
            >
              {{ group.label }}
            </n-button>
          </n-button-group>
        </n-form-item>
        <n-form-item label="允许端口" path="allowPort">
          <n-input v-model:value="formModel.allowPort" placeholder="请输入允许的端口范围，如: 10000-20000" />
        </n-form-item>
        <n-form-item label="允许协议" path="allowType">
          <n-button-group>
            <n-button
              v-for="protocol in protocolOptions"
              :key="protocol.value"
              :type="formModel.allowType.includes(protocol.value) ? 'primary' : 'default'"
              @click="toggleProtocol(protocol.value)"
            >
              {{ protocol.label }}
            </n-button>
          </n-button-group>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showEditModal = false">取消</n-button>
          <n-button type="primary" :loading="submitting" @click="handleEditSubmit">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import { NCard, NSpace, NDataTable, NButton, NPopconfirm, NModal, NForm, NFormItem, NInput, NInputNumber, useMessage, NButtonGroup, NSelect, NTag } from 'naive-ui'
import type { DataTableColumns, FormRules, FormInst, SelectOption } from 'naive-ui'
import { AdminApi } from '../../../shared/api/admin'
import type { Node, UpdateNodeArgs, GetNodesArgs } from '../../../types/adminApi'

const message = useMessage()
const loading = ref(false)
const submitting = ref(false)
const nodes = ref<Node[]>([])
const showAddModal = ref(false)
const formRef = ref<FormInst | null>(null)

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

const formModel = ref({
  name: '',
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
    validator: (rule, value) => {
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
    validator: (rule, value) => {
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
    validator: (rule, value) => {
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
    validator: (rule, value) => {
      if (!value) return new Error('请输入端口范围')
      
      // 支持多个端口范围，用逗号分隔
      const ranges = value.split(',').map(range => range.trim())
      
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
          return new Error('端口范围格式不正确，请使用 1-65535 或 80,443 或 1000-2000,3000-4000 的格式')
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
    validator: (rule, value) => {
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
    key: 'nodeId'
  },
  {
    title: '名称',
    key: 'name',
    render(row) {
      return h('div', { style: 'white-space: pre-wrap; word-break: break-all;' }, row.name)
    }
  },
  {
    title: '主机名',
    key: 'hostname'
  },
  {
    title: '描述',
    key: 'description',
    render(row) {
      return h('div', { style: 'white-space: pre-wrap; word-break: break-all;' }, row.description)
    }
  },
  {
    title: '服务端口',
    key: 'servicePort'
  },
  {
    title: '管理端口',
    key: 'adminPort'
  },
  {
    title: '用户组',
    key: 'allowGroup',
    render(row) {
      const groups = row.allowGroup.split(',')
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
    key: 'allowPort'
  },
  {
    title: '协议',
    key: 'allowType',
    render(row) {
      const types = row.allowType.split(',')
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
    title: '操作',
    key: 'actions',
    render(row) {
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                onClick: () => handleEdit(row)
              },
              { default: () => '编辑' }
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDelete(row),
                positiveText: '确定',
                negativeText: '取消'
              },
              {
                default: () => '确认删除此节点？',
                trigger: () =>
                  h(
                    NButton,
                    {
                      size: 'small',
                      type: 'error'
                    },
                    { default: () => '删除' }
                  )
              }
            )
          ]
        }
      )
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
  Object.assign(formModel.value, {
    name: row.name,
    hostname: row.hostname,
    description: row.description,
    token: row.token,
    servicePort: row.servicePort,
    adminPort: row.adminPort,
    adminPass: row.adminPass,
    allowGroup: row.allowGroup.split(','),
    allowPort: row.allowPort,
    allowType: row.allowType.split(',')
  })
  showEditModal.value = true
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
          hostname: formModel.value.hostname,
          description: formModel.value.description,
          token: formModel.value.token,
          servicePort: formModel.value.servicePort,
          adminPort: formModel.value.adminPort,
          adminPass: formModel.value.adminPass,
          allowGroup: formModel.value.allowGroup.join(','),
          allowPort: formModel.value.allowPort,
          allowType: formModel.value.allowType.join(',')
        }
        await AdminApi.updateNode(config)
        message.success('更新节点成功')
        showEditModal.value = false
        formRef.value?.restoreValidation()
        editingNode.value = null
        Object.assign(formModel.value, {
          name: '',
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
        message.error(error?.response?.data?.message || '更新节点失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleDelete = async (row: Node) => {
  try {
    await AdminApi.deleteNode(row.nodeId)
    message.success('删除节点成功')
    fetchNodes()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '删除节点失败')
  }
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
          allowGroup: formModel.value.allowGroup.join(','),
          allowType: formModel.value.allowType.join(',')
        }
        await AdminApi.addNode(config)
        message.success('添加节点成功')
        showAddModal.value = false
        formRef.value?.restoreValidation()
        Object.assign(formModel.value, {
          name: '',
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
    const res = await AdminApi.getUserGroups()
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

// 在组件挂载时获取用户组列表
fetchUserGroups()
fetchNodes()
</script>