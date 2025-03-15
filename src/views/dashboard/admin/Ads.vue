<template>
  <div class="ads-management">
    <NCard title="广告管理">
      <template #header-extra>
        <NButton type="primary" @click="openAddModal">
          添加广告
        </NButton>
      </template>

      <NDataTable remote :columns="columns" :data="ads" :loading="loading" :pagination="pagination"
        @update:page="handlePageChange" :style="{
          '.n-data-table-td': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '200px'
          }
        }" />

      <!-- 添加/编辑广告模态框 -->
      <NModal v-model:show="showAddModal" :mask-closable="false">
        <NCard :title="editingAd ? '编辑广告' : '添加广告'" style="width: 600px" :bordered="false" size="huge" role="dialog"
          aria-modal="true">
          <NForm ref="formRef" :model="adForm" :rules="rules" label-placement="left" label-width="100"
            require-mark-placement="right-hanging">
            <NFormItem label="广告类型" path="adsType">
              <NSelect v-model:value="adForm.adsType" :options="typeOptions" />
            </NFormItem>
            <NFormItem label="广告位置" path="adsPlacement">
              <NSelect v-model:value="adForm.adsPlacement" :options="placementOptions" />
            </NFormItem>
            <NFormItem label="广告链接" path="adsUrl">
              <NInput v-model:value="adForm.adsUrl" placeholder="请输入广告链接" />
            </NFormItem>
            <NFormItem label="广告内容" path="adsContent">
              <NInput v-model:value="adForm.adsContent" type="textarea" placeholder="请输入广告内容（可选）" />
              <template #feedback>
                <div class="form-tip">可选字段，纯文本广告将显示此内容</div>
              </template>
            </NFormItem>
            <NFormItem label="图片链接" path="adsImageUrl">
              <NInput v-model:value="adForm.adsImageUrl" placeholder="请输入图片链接（可选）" />
              <template #feedback>
                <div class="form-tip">可选字段，如不填写则显示为纯文本广告</div>
              </template>
            </NFormItem>
            <NFormItem label="过期时间" path="adsExpire">
              <NDatePicker v-model:value="adForm.adsExpire" type="datetime" clearable
                :is-date-disabled="disablePastDates" />
            </NFormItem>
          </NForm>

          <template #footer>
            <NSpace justify="end">
              <NButton @click="showAddModal = false">取消</NButton>
              <NButton type="primary" @click="handleSubmit" :loading="submitting">
                确定
              </NButton>
            </NSpace>
          </template>
        </NCard>
      </NModal>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted, reactive } from 'vue'
import {
  NCard,
  NButton,
  NDataTable,
  NModal,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NSpace,
  NDatePicker,
  useMessage
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { AdsApi } from '../../../shared/api/ads'
import type { Ad } from '../../../shared/api/ads'

const message = useMessage()
const loading = ref(false)
const ads = ref<Ad[]>([])
const showAddModal = ref(false)
const editingAd = ref<Ad | null>(null)
const submitting = ref(false)

const adForm = reactive<Ad>({
  adsType: '',
  adsPlacement: '',
  adsUrl: '',
  adsContent: '',
  adsImageUrl: '',
  adsExpire: 0
})

const typeOptions = [
  { label: 'IDC 服务广告', value: 'idc' },
  { label: '游戏相关广告', value: 'game' },
  { label: '官方广告', value: 'official' },
  { label: '工具推荐', value: 'tools' },
  { label: '其他广告', value: 'other' }
]

const placementOptions = [
  { label: '首页', value: 'home' },
  { label: '下载页-1', value: 'downloads-1' },
  { label: '下载页-2', value: 'downloads-2' }
]

const rules = {
  adsType: { required: true, message: '请选择广告类型' },
  adsPlacement: { required: true, message: '请选择广告位置' },
  adsUrl: { required: true, message: '请输入广告链接' },
  adsExpire: { required: true, message: '请选择过期时间' }
}

const pagination = ref({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 30, 40],
  prefix({ itemCount }) {
    return `共 ${itemCount} 条`
  }
})


const columns: DataTableColumns = [
  {
    title: 'ID',
    key: 'adsId',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.adsId)
    }
  },
  {
    title: '类型',
    key: 'adsType',
    render(row) {
      let text = '';
      switch (row.adsType) {
        case 'idc': text = 'IDC 服务广告'; break;
        case 'game': text = '游戏相关广告'; break;
        case 'official': text = '官方广告'; break;
        case 'tools': text = '工具推荐'; break;
        case 'other': text = '其他广告'; break;
        default: text = row.adsType;
      }
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, text)
    }
  },
  {
    title: '位置',
    key: 'adsPlacement',
    render(row) {
      let text = '';
      text = placementOptions.find(option => option.value === row.adsPlacement)?.label || row.adsPlacement
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, text)
    }
  },
  {
    title: '内容',
    key: 'adsContent',
    width: 400,
    render(row) {
      return h('div', { style: 'white-space: pre-wrap;' }, row.adsContent || '无内容')
    }
  },
  {
    title: '图片',
    key: 'adsImageUrl',
    render(row) {
      return row.adsImageUrl ?
        h('div', { style: 'display: flex; align-items: center; gap: 12px;' }, [
          h('a', {
            href: row.adsImageUrl,
            target: '_blank',
            style: 'width: 80px; height: 50px; border-radius: 6px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);',
            onClick: (e) => e.stopPropagation()
          }, [
            h('img', {
              src: row.adsImageUrl,
              style: 'width: 100%; height: 100%; object-fit: cover;',
              onerror: 'this.style.display="none"; this.parentNode.style.display="none";'
            })
          ])
        ]) :
        h('span', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--n-text-color-3);' }, '无图片')
    }
  },
  {
    title: '链接',
    key: 'adsUrl',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.adsUrl)
    }
  },
  {
    title: '点击量',
    key: 'adsClick',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.adsClick || 0)
    }
  },
  {
    title: '过期时间',
    key: 'adsExpire',
    render(row) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, new Date(row.adsExpire * 1000).toLocaleString())
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(NSpace, null, {
        default: () => [
          h(
            NButton,
            {
              size: 'small',
              onClick: (e) => {
                e.stopPropagation()
                handleEdit(row)
              }
            },
            { default: () => '编辑' }
          ),
          h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: (e) => {
                e.stopPropagation()
                handleDelete(row.adsId)
              }
            },
            { default: () => '删除' }
          )
        ]
      })
    }
  }
]

const fetchAds = async () => {
  loading.value = true
  try {
    const { data } = await AdsApi.getAds()
    ads.value = data
    pagination.value.itemCount = data.length
  } catch (error) {
    message.error('获取广告列表失败')
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  adForm.adsType = ''
  adForm.adsPlacement = ''
  adForm.adsUrl = ''
  adForm.adsContent = ''
  adForm.adsImageUrl = ''
  adForm.adsExpire = 0
  editingAd.value = null
}

// 打开添加模态框
const openAddModal = () => {
  resetForm()
  showAddModal.value = true
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (editingAd.value) {
      const { code } = await AdsApi.adminUpdateAd({
        ...adForm,
        adsId: editingAd.value.adsId,
        adsExpire: Math.floor(adForm.adsExpire / 1000)
      })
      if (code === 200) {
        message.success('更新广告成功')
      }
    } else {
      const { code } = await AdsApi.adminAddAd({
        ...adForm,
        adsExpire: Math.floor(adForm.adsExpire / 1000)
      })
      if (code === 200) {
        message.success('添加广告成功')
      }
    }
    showAddModal.value = false
    resetForm()
    fetchAds()
  } catch (error) {
    message.error(editingAd.value ? '更新广告失败' : '添加广告失败')
  } finally {
    submitting.value = false
  }
}

const handleEdit = (ad: Ad) => {
  editingAd.value = ad

  // 复制值到表单
  adForm.adsType = ad.adsType
  adForm.adsPlacement = ad.adsPlacement
  adForm.adsUrl = ad.adsUrl
  adForm.adsContent = ad.adsContent || ''
  adForm.adsImageUrl = ad.adsImageUrl || ''
  adForm.adsExpire = ad.adsExpire * 1000

  showAddModal.value = true
}

const handleDelete = async (adsId?: number) => {
  if (!adsId) return
  try {
    const { code } = await AdsApi.adminDeleteAd(adsId)
    if (code === 200) {
      message.success('删除广告成功')
      fetchAds()
    }
  } catch (error) {
    message.error('删除广告失败')
  }
}

const handlePageChange = (page: number) => {
  pagination.value.page = page
}

const disablePastDates = (ts: number) => {
  return ts < Date.now()
}

onMounted(() => {
  fetchAds()
})
</script>

<style scoped lang="scss">
@use "../../../assets/styles/dashboard/admin/ads.scss";

:deep(.n-data-table-td) {
  padding: 8px 12px;
}
</style>