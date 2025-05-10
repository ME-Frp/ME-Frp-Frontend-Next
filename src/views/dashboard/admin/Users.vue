<template>
  <div class="users">
    <NCard title="用户管理">
      <NSpace vertical :size="12">
        <div style="display: flex;">
          <NInput v-model:value="filters.search" placeholder="搜索 ID、用户名、邮箱或访问密钥" clearable style="flex: 1;"
            @update:value="handleSearch">
            <template #prefix>
              <NIcon :component="Search" />
            </template>
          </NInput>
        </div>
        <NSpace>
          <NSelect v-model:value="filters.group" :options="groupOptions" placeholder="用户组" clearable
            style="width: 200px" @update:value="handleGroupFilter" />
          <NSelect v-model:value="filters.isRealname" :options="realnameOptions" placeholder="实名状态" clearable
            style="width: 200px" @update:value="handleRealnameFilter" />
          <NSelect v-model:value="filters.status" :options="statusOptions" placeholder="账户状态" clearable
            style="width: 200px" @update:value="handleStatusFilter" />
        </NSpace>
        <NDataTable remote :columns="columns" :data="users" :loading="loading" :pagination="pagination" />
      </NSpace>
    </NCard>

    <!-- 添加编辑用户的模态框 -->
    <NModal v-model:show="showEditModal" preset="card" title="编辑用户" style="width: 600px;">
      <NForm ref="formRef" :model="editForm" :rules="rules" label-placement="left" label-width="auto"
        require-mark-placement="right-hanging">
        <NFormItem label="用户名" path="username">
          <NInput v-model:value="editForm.username" placeholder="请输入用户名" />
        </NFormItem>
        <NFormItem label="邮箱" path="email">
          <NInput v-model:value="editForm.email" placeholder="请输入邮箱" />
        </NFormItem>
        <NFormItem label="用户组" path="group">
          <NSelect v-model:value="editForm.group" :options="groupOptions" placeholder="请选择用户组" />
        </NFormItem>
        <NFormItem label="账户状态" path="status">
          <NSelect v-model:value="editForm.status" :options="statusOptions" placeholder="请选择账户状态" />
        </NFormItem>
        <NFormItem label="实名状态" path="isRealname">
          <NSwitch v-model:value="editForm.isRealname" :rail-style="switchButtonRailStyle" />
        </NFormItem>
        <NFormItem label="流量限制" path="traffic">
          <NSpace align="center">
            <NInputNumber v-model:value="editForm.traffic" placeholder="请输入流量限制" :min="0" />
            <span>GB</span>
          </NSpace>
        </NFormItem>
        <NFormItem label="出站带宽" path="outBound">
          <NSpace align="center">
            <NInputNumber v-model:value="editForm.outBound" placeholder="请输入出站带宽" :min="0" />
            <span>Mbps</span>
          </NSpace>
        </NFormItem>
        <NFormItem label="入站带宽" path="inBound">
          <NSpace align="center">
            <NInputNumber v-model:value="editForm.inBound" placeholder="请输入入站带宽" :min="0" />
            <span>Mbps</span>
          </NSpace>
        </NFormItem>
        <NFormItem label="隧道数量" path="maxProxies">
          <NSpace align="center">
            <NInputNumber v-model:value="editForm.maxProxies" placeholder="请输入隧道数量" :min="0" />
            <span>个</span>
          </NSpace>
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace justify="end">
          <NButton size="small" @click="showEditModal = false">取消</NButton>
          <NButton type="primary" size="small" :loading="submitting" @click="handleEditSubmit">
            确定
          </NButton>
        </NSpace>
      </template>
    </NModal>

    <!-- 封禁理由模态框 -->
    <NModal v-model:show="banModalVisible" preset="dialog" title="封禁用户" style="width: 500px;">
      <div>
        <p>您正在封禁用户：<strong>{{ currentUser?.username }}</strong></p>
        <NFormItem label="封禁理由" required>
          <NInput v-model:value="banReason" type="textarea" placeholder="请输入封禁理由" :rows="4" />
        </NFormItem>
      </div>
      <NSpace justify="end">
        <NButton size="small" @click="banModalVisible = false">取消</NButton>
        <NButton type="primary" size="small" @click="handleBanSubmit">确认封禁</NButton>
      </NSpace>
    </NModal>
  </div>
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import { NCard, NSpace, NDataTable, NButton, useMessage, NTag, NInput, NSelect, NIcon, NModal, NForm, NFormItem, NInputNumber, NSwitch, SelectOption } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import type { DataTableColumns, FormInst, FormRules } from 'naive-ui'
import { AdminApi } from '../../../shared/api/admin'
import { AuthApi } from '../../../shared/api/auth'
import type { UserInfo } from '../../../types/authApi'
import type { FilterUsersArgs } from '../../../types/adminApi'
import { switchButtonRailStyle } from '../../../constants/theme'
const message = useMessage()
const loading = ref(false)
const users = ref<UserInfo[]>([])
const groupNameMap = ref<Record<string, string>>({})

const filters = ref<{
  search: string;
  group: string | null;
  isRealname: string | null;
  status: number | null;
}>({
  search: '',
  group: null,
  isRealname: null,
  status: null
})

const groupOptions = ref<{ label: string; value: string }[]>([])

const realnameOptions: SelectOption[] = [
  { label: '已实名', value: 'true', type: 'default' },
  { label: '未实名', value: 'false', type: 'default' }
]

const statusOptions: SelectOption[] = [
  { label: '正常', value: 0 },
  { label: '封禁', value: 1 },
  { label: '流量超限', value: 2 }
]

const pagination = ref({
  page: 1,
  pageSize: 20,
  pageCount: 1,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [
    {
      label: '10 条 / 页',
      value: 10
    },
    {
      label: '20 条 / 页',
      value: 20
    },
    {
      label: '30 条 / 页',
      value: 30
    },
    {
      label: '40 条 / 页',
      value: 40
    }
  ],
  prefix({ itemCount }: { itemCount?: number }) {
    return `共 ${itemCount} 条`
  },
  onUpdatePage: (page: number) => {
    pagination.value.page = page
    loadData()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
    loadData()
  }
})

const showEditModal = ref(false)
const formRef = ref<FormInst | null>(null)
const submitting = ref(false)

const editForm = ref({
  userId: 0,
  username: '',
  email: '',
  group: '',
  status: 0,
  isRealname: false,
  traffic: 0,
  outBound: 0,
  inBound: 0,
  maxProxies: 0
})

const rules: FormRules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: ['blur', 'input']
  },
  email: {
    required: true,
    message: '请输入邮箱',
    trigger: ['blur', 'input'],
    validator: (_rule: any, value: string) => {
      if (!value) return true
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return new Error('请输入有效的邮箱地址')
      }
      return true
    }
  },
  group: {
    required: true,
    message: '请选择用户组',
    trigger: ['blur', 'change']
  }
}

const columns: DataTableColumns<UserInfo> = [
  {
    title: 'ID',
    key: 'userId',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.userId)
    }
  },
  {
    title: '用户名',
    key: 'username',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.username)
    }
  },
  {
    title: '邮箱',
    key: 'email',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.email)
    }
  },
  {
    title: '用户组',
    key: 'group',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.friendlyGroup)
    }
  },
  {
    title: '注册时间',
    key: 'regTime',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, new Date(row.regTime * 1000).toLocaleString())
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      const statusMap: Record<number, { text: string, type: 'success' | 'error' | 'warning' }> = {
        0: { text: '正常', type: 'success' },
        1: { text: '封禁', type: 'error' },
        2: { text: '流量超限', type: 'warning' }
      }
      const status = statusMap[row.status] || { text: '未知', type: 'warning' }
      return h(
        NTag,
        {
          type: status.type
        },
        { default: () => status.text }
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
              NButton,
              {
                size: 'small',
                type: row.status === 1 ? 'success' : 'error',
                onClick: () => row.status === 1
                  ? handleToggleStatus(row, "") // 解封直接调用，传空字符串
                  : showBanModal(row) // 封禁显示对话框
              },
              { default: () => row.status === 1 ? '解封' : '封禁' }
            )
          ]
        }
      )
    }
  }
]

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    loadData()
  }, 300)
}

const handleGroupFilter = () => {
  pagination.value.page = 1
  loadData()
}

const handleRealnameFilter = () => {
  pagination.value.page = 1
  loadData()
}

const handleStatusFilter = () => {
  pagination.value.page = 1
  loadData()
}

const banModalVisible = ref(false)
const banReason = ref('')
const currentUser = ref<UserInfo | null>(null)

const showBanModal = (user: UserInfo) => {
  // 只有正常状态的用户才能被封禁
  if (user.status !== 0) {
    message.warning('只有正常状态的用户才能被封禁')
    return
  }

  currentUser.value = user
  banReason.value = '' // 清空之前的理由
  banModalVisible.value = true
}

const handleBanSubmit = async () => {
  if (!currentUser.value) return

  // 封禁理由不能为空
  if (!banReason.value.trim()) {
    message.error('请输入封禁理由')
    return
  }

  try {
    await handleToggleStatus(currentUser.value, banReason.value)
    banModalVisible.value = false
  } catch (error) {
    console.error('处理封禁失败:', error)
  }
}

const handleToggleStatus = async (user: UserInfo, banReason: string) => {
  try {
    const data = await AdminApi.toggleUser(user.userId, banReason)
    if (data.data.code === 200) {
      message.success(data.data.message || '操作成功')
    } else {
      message.error(data.data.message || '操作失败')
    }
    loadData()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '操作失败')
  }
}

const handleEditSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      submitting.value = true
      try {
        editForm.value.traffic *= 1024
        editForm.value.outBound *= 128
        editForm.value.inBound *= 128
        await AdminApi.updateUser(editForm.value)
        message.success('更新用户成功')
        showEditModal.value = false
        loadData()
      } catch (error: any) {
        message.error(error?.response?.data?.message || '更新用户失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleEdit = async (user: UserInfo) => {
  try {
    const res = await AdminApi.getUser(user.userId)
    if (res.data.code === 200) {
      const userDetail = res.data.data
      editForm.value = {
        userId: userDetail.userId,
        username: userDetail.username,
        email: userDetail.email,
        group: userDetail.group,
        status: userDetail.status,
        isRealname: userDetail.isRealname,
        traffic: userDetail.traffic / 1024,
        outBound: userDetail.outBound / 128,
        inBound: userDetail.inBound / 128,
        maxProxies: userDetail.maxProxies
      }
      showEditModal.value = true
    } else {
      message.error(res.data.message || '获取用户信息失败')
    }
  } catch (error: any) {
    message.error(error?.response?.data?.message || '获取用户信息失败')
  }
}

// 获取用户组列表
const fetchUserGroups = async () => {
  try {
    const res = await AuthApi.getUserGroups()
    if (res.data.code === 200) {
      // 更新用户组选项
      groupOptions.value = res.data.data.groups.map(group => ({
        label: group.friendlyName,
        value: group.name
      }))
      // 更新用户组名称映射
      groupNameMap.value = res.data.data.groups.reduce((acc, group) => {
        acc[group.name] = group.friendlyName
        return acc
      }, {} as Record<string, string>)
    } else {
      message.error(res.data.message || '获取用户组失败')
    }
  } catch (error) {
    message.error('获取用户组失败')
  }
}

// 处理用户数据, 添加 friendlyGroup
const processUsers = (users: UserInfo[]) => {
  return users.map(user => ({
    ...user,
    friendlyGroup: groupNameMap.value[user.group] || user.group
  }))
}

// 统一的数据加载函数
const loadData = async () => {
  loading.value = true
  try {
    const params: FilterUsersArgs = {
      page: pagination.value.page,
      limit: pagination.value.pageSize
    }

    // 添加所有有效的筛选条件
    if (filters.value.search) {
      params.keyword = filters.value.search
    }
    if (filters.value.group) {
      params.group = filters.value.group
    }
    if (filters.value.isRealname !== null) {
      params.isRealname = filters.value.isRealname === 'true'
    }
    if (filters.value.status !== null) {
      params.status = filters.value.status
    }

    const res = await AdminApi.filterUsers(params)

    if (res.data.code === 200) {
      users.value = processUsers(res.data.data.users)
      pagination.value.pageCount = res.data.data.totalPages
      pagination.value.itemCount = res.data.data.totalUsers
    } else {
      message.error(res.data.message || '获取数据失败')
    }
  } catch (error) {
    message.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 初始化数据
fetchUserGroups()
loadData()
</script>