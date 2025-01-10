<template>
  <n-card title="隧道管理">
    <n-space vertical :size="12">
      <n-space>
        <n-input v-model:value="searchValue" placeholder="搜索隧道" clearable style="width: 200px" />
        <n-select
          v-model:value="statusFilter"
          :options="statusOptions"
          placeholder="状态筛选"
          clearable
          style="width: 200px"
        />
      </n-space>

      <n-data-table
        :columns="columns"
        :data="proxies"
        :loading="loading"
        :pagination="pagination"
        @update:page="handlePageChange"
      />
    </n-space>
  </n-card>
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import { NCard, NSpace, NDataTable, NButton, NPopconfirm, NInput, NSelect, useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

const message = useMessage()
const loading = ref(false)
const proxies = ref([])
const searchValue = ref('')
const statusFilter = ref(null)

const statusOptions = [
  {
    label: '运行中',
    value: 'running'
  },
  {
    label: '已停止',
    value: 'stopped'
  },
  {
    label: '已过期',
    value: 'expired'
  }
]

const pagination = ref({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
  onChange: (page: number) => {
    pagination.value.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.value.pageSize = pageSize
    pagination.value.page = 1
  }
})

const columns: DataTableColumns = [
  {
    title: '隧道名称',
    key: 'name'
  },
  {
    title: '所属用户',
    key: 'username'
  },
  {
    title: '节点',
    key: 'node'
  },
  {
    title: '本地地址',
    key: 'local_address'
  },
  {
    title: '远程端口',
    key: 'remote_port'
  },
  {
    title: '协议',
    key: 'protocol'
  },
  {
    title: '状态',
    key: 'status'
  },
  {
    title: '创建时间',
    key: 'created_at'
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
                type: row.status === 'running' ? 'warning' : 'primary',
                onClick: () => handleToggleStatus(row)
              },
              { default: () => row.status === 'running' ? '停止' : '启动' }
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => handleDelete(row)
              },
              {
                default: () => '确认删除此隧道？',
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
  fetchProxies()
}

const handleToggleStatus = (row: any) => {
  const action = row.status === 'running' ? '停止' : '启动'
  message.success(action + '隧道：' + row.name)
}

const handleDelete = (row: any) => {
  message.success('删除隧道：' + row.name)
}

const fetchProxies = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取隧道列表
    proxies.value = []
  } catch (error) {
    message.error('获取隧道列表失败')
  } finally {
    loading.value = false
  }
}

fetchProxies()
</script> 