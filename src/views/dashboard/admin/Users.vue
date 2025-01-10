<template>
  <n-card title="用户管理">
    <n-space vertical :size="12">
      <div style="display: flex;">
        <n-input
          v-model:value="filters.search"
          placeholder="搜索用户名或邮箱"
          clearable
          style="flex: 1;"
          @update:value="handleSearch"
        >
          <template #prefix>
            <n-icon :component="Search" />
          </template>
        </n-input>
      </div>
      <n-space>
        <n-select
          v-model:value="filters.group"
          :options="groupOptions"
          placeholder="用户组"
          clearable
          style="width: 200px"
          @update:value="handleGroupFilter"
        />
        <n-select
          v-model:value="filters.isRealname"
          :options="realnameOptions"
          placeholder="实名状态"
          clearable
          style="width: 200px"
          @update:value="handleRealnameFilter"
        />
        <n-select
          v-model:value="filters.status"
          :options="statusOptions"
          placeholder="账户状态"
          clearable
          style="width: 200px"
          @update:value="handleStatusFilter"
        />
      </n-space>
      <n-data-table
        remote
        :columns="columns"
        :data="users"
        :loading="loading"
        :pagination="pagination"
      />
    </n-space>
  </n-card>
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import { NCard, NSpace, NDataTable, NButton, useMessage, NTag, NInput, NSelect, NPopconfirm, NIcon } from 'naive-ui'
import { Search } from '@vicons/ionicons5'
import type { DataTableColumns } from 'naive-ui'
import { AdminApi, type FilterUsersParams } from '../../../shared/api/admin'
import type { BaseUser } from '../../../types/user'

const message = useMessage()
const loading = ref(false)
const users = ref<BaseUser[]>([])
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

const realnameOptions = [
  { label: '已实名', value: 'true', type: 'default' },
  { label: '未实名', value: 'false', type: 'default' }
]

const statusOptions = [
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

const columns: DataTableColumns = [
  {
    title: 'ID',
    key: 'userId'
  },
  {
    title: '用户名',
    key: 'username'
  },
  {
    title: '邮箱',
    key: 'email'
  },
  {
    title: '用户组',
    key: 'group',
    render(row) {
      const user = row as unknown as BaseUser
      return user.friendlyGroup || user.group
    }
  },
  {
    title: '注册时间',
    key: 'regTime',
    render(row) {
      const user = row as unknown as BaseUser
      return new Date(user.regTime * 1000).toLocaleString()
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      const user = row as unknown as BaseUser
      const statusMap: Record<number, { text: string, type: 'success' | 'error' | 'warning' }> = {
        0: { text: '正常', type: 'success' },
        1: { text: '封禁', type: 'error' },
        2: { text: '流量超限', type: 'warning' }
      }
      const status = statusMap[user.status] || { text: '未知', type: 'warning' }
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
      const user = row as unknown as BaseUser
      return h(
        NSpace,
        {},
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                onClick: () => handleEdit(user)
              },
              { default: () => '编辑' }
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleToggleStatus(user),
                positiveText: '确定',
                negativeText: '取消'
              },
              {
                trigger: () => h(
                  NButton,
                  {
                    size: 'small',
                    type: user.status === 1 ? 'primary' : 'warning'
                  },
                  { default: () => user.status === 1 ? '解封' : '封禁' }
                ),
                default: () => user.status === 1 ? 
                  '确定要解封该用户吗？' : 
                  '确定要封禁该用户吗？'
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
  loadData()
}

const handleEdit = (user: BaseUser) => {
  message.info('编辑用户：' + user.username)
}

const handleToggleStatus = async (user: BaseUser) => {
  try {
    if (user.status === 1) {
      await AdminApi.unbanUser(user.userId)
    } else {
      await AdminApi.banUser(user.userId)
    }
    const action = user.status === 1 ? '解封' : '封禁'
    message.success(action + '用户成功')
    loadData()
  } catch (error) {
    message.error('操作失败')
  }
}

// 获取用户组列表
const fetchUserGroups = async () => {
  try {
    const res = await AdminApi.getUserGroups()
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

// 处理用户数据，添加 friendlyGroup
const processUsers = (users: BaseUser[]) => {
  return users.map(user => ({
    ...user,
    friendlyGroup: groupNameMap.value[user.group] || user.group
  }))
}

// 统一的数据加载函数
const loadData = async () => {
  loading.value = true
  try {
    const params: FilterUsersParams = {
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

// 使用防抖处理搜索
let searchTimeout: NodeJS.Timeout | null = null
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    loadData()
  }, 300)
}

// 处理用户组筛选
const handleGroupFilter = () => {
  pagination.value.page = 1
  loadData()
}

// 处理实名状态筛选
const handleRealnameFilter = () => {
  pagination.value.page = 1
  loadData()
}

// 处理账户状态筛选
const handleStatusFilter = () => {
  pagination.value.page = 1
  loadData()
}

// 初始化数据
fetchUserGroups()
loadData()
</script>