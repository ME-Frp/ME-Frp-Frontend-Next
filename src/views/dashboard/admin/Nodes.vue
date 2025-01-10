<template>
  <n-card title="节点管理">
    <n-space vertical :size="12">
      <n-space>
        <n-button type="primary" @click="showAddModal = true">
          添加节点
        </n-button>
      </n-space>

      <n-data-table
        :columns="columns"
        :data="nodes"
        :loading="loading"
        :pagination="pagination"
        @update:page="handlePageChange"
      />
    </n-space>

    <n-modal v-model:show="showAddModal" preset="card" title="添加节点">
      <n-form
        ref="formRef"
        :model="formModel"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="节点名称" path="name">
          <n-input v-model:value="formModel.name" placeholder="请输入节点名称" />
        </n-form-item>
        <n-form-item label="节点地址" path="address">
          <n-input v-model:value="formModel.address" placeholder="请输入节点地址" />
        </n-form-item>
        <n-form-item label="节点端口" path="port">
          <n-input-number v-model:value="formModel.port" placeholder="请输入节点端口" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showAddModal = false">取消</n-button>
          <n-button type="primary" @click="handleAddNode">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import { NCard, NSpace, NDataTable, NButton, NPopconfirm, NModal, NForm, NFormItem, NInput, NInputNumber, useMessage } from 'naive-ui'
import type { DataTableColumns, FormRules, FormInst } from 'naive-ui'

const message = useMessage()
const loading = ref(false)
const nodes = ref([])
const showAddModal = ref(false)
const formRef = ref<FormInst | null>(null)

const formModel = ref({
  name: '',
  address: '',
  port: 7000
})

const rules: FormRules = {
  name: {
    required: true,
    message: '请输入节点名称',
    trigger: ['blur', 'input']
  },
  address: {
    required: true,
    message: '请输入节点地址',
    trigger: ['blur', 'input']
  },
  port: {
    required: true,
    message: '请输入节点端口',
    trigger: ['blur', 'input']
  }
}

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
    title: '节点名称',
    key: 'name'
  },
  {
    title: '节点地址',
    key: 'address'
  },
  {
    title: '节点端口',
    key: 'port'
  },
  {
    title: '状态',
    key: 'status'
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
                onPositiveClick: () => handleDelete(row)
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

const handleEdit = (row: any) => {
  message.info('编辑节点：' + row.name)
}

const handleDelete = (row: any) => {
  message.success('删除节点：' + row.name)
}

const handleAddNode = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      message.success('添加节点成功')
      showAddModal.value = false
      formRef.value?.restoreValidation()
      Object.assign(formModel.value, {
        name: '',
        address: '',
        port: 7000
      })
    }
  })
}

const fetchNodes = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取节点列表
    nodes.value = []
  } catch (error) {
    message.error('获取节点列表失败')
  } finally {
    loading.value = false
  }
}

fetchNodes()
</script> 