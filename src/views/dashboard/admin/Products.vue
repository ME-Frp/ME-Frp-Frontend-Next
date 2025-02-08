<template>
  <div>
    <NCard title="产品管理">
      <NSpace vertical>
        <NButton type="primary" @click="showAddModal = true">添加产品</NButton>
        <NDataTable :columns="productColumns" :data="productsData" :bordered="false" />
      </NSpace>
    </NCard>

    <NModal v-model:show="showAddModal" preset="dialog" title="添加产品">
      <NForm ref="productFormRef" :model="productForm" :rules="productRules">
        <NFormItem label="产品 ID" path="productId">
          <NInput v-model:value="productForm.productId" placeholder="请输入产品 ID" />
        </NFormItem>
        <NFormItem label="支持系统" path="system">
          <NInput v-model:value="productForm.system" type="textarea" :autosize="{ minRows: 1, maxRows: 5 }" placeholder="请输入系统类型，每行一个" />
        </NFormItem>
        <NFormItem label="支持架构" path="arch">
          <NInput v-model:value="productForm.arch" type="textarea" :autosize="{ minRows: 1, maxRows: 5 }" placeholder="请输入架构，每行一个" />
        </NFormItem>
        <NFormItem label="名称" path="name">
          <NInput v-model:value="productForm.name" placeholder="请输入产品名称" />
        </NFormItem>
        <NFormItem label="描述" path="desc">
          <NInput v-model:value="productForm.desc" placeholder="请输入产品描述" />
        </NFormItem>
        <NFormItem label="存储路径" path="path">
          <NInput v-model:value="productForm.path" placeholder="请输入产品路径" />
        </NFormItem>
        <NFormItem label="版本" path="version">
          <NInput v-model:value="productForm.version" placeholder="请输入产品版本" />
        </NFormItem>
      </NForm>
      <template #action>
        <NButton @click="showAddModal = false">取消</NButton>
        <NButton type="primary" @click="handleAddProduct">确定</NButton>
      </template>
    </NModal>

    <NModal v-model:show="showEditModal" preset="dialog" title="编辑产品">
      <NForm ref="editProductFormRef" :model="editProductForm" :rules="productRules" style="padding-top: 12px;">
        <NFormItem label="产品 ID" path="productId">
          <NInput v-model:value="editProductForm.productId" placeholder="请输入产品 ID" />
        </NFormItem>
        <NFormItem label="支持系统" path="system">
          <NInput v-model:value="editProductForm.system" type="textarea" :autosize="{ minRows: 1, maxRows: 5 }" placeholder="请输入系统类型，每行一个" />
        </NFormItem>
        <NFormItem label="支持架构" path="arch">
          <NInput v-model:value="editProductForm.arch" type="textarea" :autosize="{ minRows: 1, maxRows: 5 }" placeholder="请输入架构，每行一个" />
        </NFormItem>
        <NFormItem label="名称" path="name">
          <NInput v-model:value="editProductForm.name" placeholder="请输入产品名称" />
        </NFormItem>
        <NFormItem label="描述" path="desc">
          <NInput v-model:value="editProductForm.desc" placeholder="请输入产品描述" type="textarea" :autosize="{ minRows: 1, maxRows: 5 }"  />
        </NFormItem>
        <NFormItem label="存储路径" path="path">
          <NInput v-model:value="editProductForm.path" placeholder="请输入产品路径" />
        </NFormItem>
        <NFormItem label="版本" path="version">
          <NInput v-model:value="editProductForm.version" placeholder="请输入产品版本" />
        </NFormItem>
      </NForm>
      <template #action>
        <NButton @click="showEditModal = false">取消</NButton>
        <NButton type="primary" @click="handleEditProduct">确定</NButton>
      </template>
    </NModal>
  </div>
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import { NCard, NForm, NFormItem, NInput, NSpace, NButton, useMessage, NDataTable, NModal } from 'naive-ui'
import type { FormRules, FormInst, DataTableColumns } from 'naive-ui'
import { AdminApi } from '../../../shared/api/admin'
import { AuthApi } from '../../../shared/api/auth'
import type { Product } from '../../../types/adminApi'

const message = useMessage()
const productFormRef = ref<FormInst | null>(null)
const editProductFormRef = ref<FormInst | null>(null)

const showAddModal = ref(false)
const showEditModal = ref(false)

const productsData = ref<Product[]>([])

const productForm = ref<Product>({
  productId: '',
  system: '',
  arch: '',
  name: '',
  desc: '',
  path: '',
  version: ''
})

const editProductForm = ref<Product>({
  productId: '',
  system: '',
  arch: '',
  name: '',
  desc: '',
  path: '',
  version: ''
})

const productRules: FormRules = {
  productId: {
    required: true,
    message: '请输入产品 ID',
    trigger: ['blur', 'input']
  },
  system: {
    required: true,
    message: '请输入系统类型',
    trigger: ['blur', 'input']
  },
  arch: {
    required: true,
    message: '请输入架构',
    trigger: ['blur', 'input']
  },
  name: {
    required: true,
    message: '请输入产品名称',
    trigger: ['blur', 'input']
  },
  desc: {
    required: true,
    message: '请输入产品描述',
    trigger: ['blur', 'input']
  },
  path: {
    required: true,
    message: '请输入产品路径',
    trigger: ['blur', 'input']
  },
  version: {
    required: true,
    message: '请输入产品版本',
    trigger: ['blur', 'input']
  }
}

const productColumns: DataTableColumns<Product> = [
  {
    title: '产品 ID',
    key: 'productId'
  },
  {
    title: '系统',
    key: 'system',
    render: (row) => {
      return h(
        'div',
        {
          style: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }
        },
        row.system
      )
    }
  },
  {
    title: '架构',
    key: 'arch',
    render: (row) => {
      return h(
        'div',
        {
          style: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }
        },
        row.arch
      )
    }
  },
  {
    title: '名称',
    key: 'name'
  },
  {
    title: '描述',
    key: 'desc',
    render: (row) => {
      return h(
        'div',
        {
          style: {
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }
        },
        row.desc
      )
    }
  },
  {
    title: '路径',
    key: 'path'
  },
  {
    title: '版本',
    key: 'version'
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
                editProductForm.value = { ...row }
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
              onClick: () => handleDeleteProduct(row.productId)
            },
            { default: () => '删除' }
          )
        ]
      })
    }
  }
]

const handleAddProduct = async () => {
  try {
    await productFormRef.value?.validate()
    await AdminApi.addProduct(productForm.value)
    message.success('添加产品成功')
    showAddModal.value = false
    productForm.value = {
      productId: '',
      system: '',
      arch: '',
      name: '',
      desc: '',
      path: '',
      version: ''
    }
    await fetchProducts()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '添加产品失败')
  }
}

const handleEditProduct = async () => {
  try {
    await editProductFormRef.value?.validate()
    await AdminApi.updateProduct(editProductForm.value)
    message.success('修改产品成功')
    showEditModal.value = false
    await fetchProducts()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '修改产品失败')
  }
}

const handleDeleteProduct = async (productId: string) => {
  try {
    await AdminApi.deleteProduct(productId)
    message.success('删除产品成功')
    await fetchProducts()
  } catch (error: any) {
    message.error(error?.response?.data?.message || '删除产品失败')
  }
}

const fetchProducts = async () => {
  try {
    const { data: { data } } = await AuthApi.getProducts()
    productsData.value = data
  } catch (error) {
    message.error('获取产品列表失败')
  }
}

// 初始获取产品列表
fetchProducts()
</script>
