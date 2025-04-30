<template>
  <div class="node-donate-manage-container">
    <NCard title="节点捐赠管理" class="manage-card">
      <NTabs type="line" animated>
        <NTabPane name="pending" tab="待审核申请">
          <NDataTable :columns="donateColumns" :data="pendingDonates" :loading="pendingLoading" :pagination="pagination"
            :bordered="false" striped />
        </NTabPane>
        <NTabPane name="all" tab="所有捐赠申请">
          <NDataTable :columns="donateColumns" :data="allDonates" :loading="allLoading" :pagination="allPagination"
            :bordered="false" striped />
        </NTabPane>
        <NTabPane name="pendingDelete" tab="待审核删除申请">
          <NDataTable :columns="deleteColumns" :data="pendingDeleteRequests" :loading="pendingDeleteLoading"
            :pagination="pendingDeletePagination" :bordered="false" striped />
        </NTabPane>
        <NTabPane name="allDelete" tab="所有删除申请">
          <NDataTable :columns="deleteColumns" :data="allDeleteRequests" :loading="allDeleteLoading"
            :pagination="allDeletePagination" :bordered="false" striped />
        </NTabPane>
        <NTabPane name="pendingEdit" tab="待审核编辑申请">
          <NDataTable :columns="editColumns" :data="pendingEditRequests" :loading="pendingEditLoading"
            :pagination="pendingEditPagination" :bordered="false" striped />
        </NTabPane>
        <NTabPane name="allEdit" tab="所有编辑申请">
          <NDataTable :columns="editColumns" :data="allEditRequests" :loading="allEditLoading"
            :pagination="allEditPagination" :bordered="false" striped />
        </NTabPane>
      </NTabs>
    </NCard>

    <!-- 节点详情对话框 -->
    <NModal v-model:show="showDetailModal" preset="dialog" style="width: 650px; max-width: 90vw">
      <template #header>
        <div class="modal-header">节点详情</div>
      </template>
      <div v-if="currentDonate" style="padding: 16px 0">
        <div class="modal-section">
          <div class="section-title">基本信息</div>
          <div class="modal-info-item">
            <span class="label">申请ID：</span>
            <span class="value">{{ currentDonate.donateId }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">用户名：</span>
            <span class="value">{{ currentDonate.username }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">节点名称：</span>
            <span class="value">{{ currentDonate.nodeName }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">地区：</span>
            <span class="value">
              <NSpace>
                <NTag :bordered="false" type="info" size="small">{{ getRegionName(currentDonate.region) || '未设置' }}</NTag>
              </NSpace>
            </span>
          </div>
          <div class="modal-info-item">
            <span class="label">主机名/IP：</span>
            <span class="value">{{ currentDonate.hostname }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">节点描述：</span>
            <span class="value">{{ currentDonate.description }}</span>
          </div>
        </div>

        <NDivider style="margin: 16px 0" />

        <div class="modal-section">
          <div class="section-title">配置信息</div>
          <div class="modal-info-item">
            <span class="label">服务端口：</span>
            <span class="value">{{ currentDonate.servicePort }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">管理端口：</span>
            <span class="value">{{ currentDonate.adminPort }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">管理密码：</span>
            <span class="value">{{ currentDonate.adminPass }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">允许的用户组：</span>
            <span class="value">
              <NSpace>
                <template v-if="currentDonate.allowGroup">
                  <NTag :bordered="false" v-for="group in currentDonate.allowGroup.split(';')" :key="group" type="info" size="small">
                    {{ getGroupName(group) }}
                  </NTag>
                </template>
                <template v-else>-</template>
              </NSpace>
            </span>
          </div>
          <div class="modal-info-item">
            <span class="label">允许的端口范围：</span>
            <span class="value">{{ currentDonate.allowPort }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">允许的隧道类型：</span>
            <span class="value">
              <NSpace>
                <template v-if="currentDonate.allowType">
                  <NTag :bordered="false" v-for="type in currentDonate.allowType.split(';')" :key="type" type="success" size="small">
                    {{ type.toUpperCase() }}
                  </NTag>
                </template>
                <template v-else>-</template>
              </NSpace>
            </span>
          </div>
        </div>

        <NDivider style="margin: 16px 0" />

        <div class="modal-section">
          <div class="section-title">申请状态</div>
          <div class="modal-info-item">
            <span class="label">申请时间：</span>
            <span class="value">{{ new Date(currentDonate.applyTime * 1000).toLocaleString() }}</span>
          </div>
          <div class="modal-info-item" v-if="currentDonate.status !== 0">
            <span class="label">审核时间：</span>
            <span class="value">{{ currentDonate.reviewTime ? new Date(currentDonate.reviewTime * 1000).toLocaleString()
              : '-'
              }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">状态：</span>
            <span class="value">
              <NTag :bordered="false" :type="currentDonate.status === 0 ? 'warning' : (currentDonate.status === 1 ? 'success' : 'error')"
                size="small">
                {{ currentDonate.status === 0 ? '待审核' : (currentDonate.status === 1 ? '已通过' : '已拒绝') }}
              </NTag>
            </span>
          </div>
          <div class="modal-info-item" v-if="currentDonate.status === 2">
            <span class="label">拒绝原因：</span>
            <span class="value">{{ currentDonate.rejectReason || '-' }}</span>
          </div>
        </div>
      </div>
      <template #action>
        <NButton size="small" @click="showDetailModal = false">关闭</NButton>
      </template>
    </NModal>

    <!-- 删除申请详情对话框 -->
    <NModal v-model:show="showDeleteDetailModal" preset="dialog" style="width: 650px; max-width: 90vw">
      <template #header>
        <div class="modal-header">删除申请详情</div>
      </template>
      <div v-if="currentDeleteRequest" style="padding: 16px 0">
        <div class="modal-section">
          <div class="section-title">基本信息</div>
          <div class="modal-info-item">
            <span class="label">申请ID：</span>
            <span class="value">{{ currentDeleteRequest.requestId }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">用户名：</span>
            <span class="value">{{ currentDeleteRequest.username }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">节点ID：</span>
            <span class="value">
              <NTag :bordered="false" type="info" size="small">{{ currentDeleteRequest.nodeId }}</NTag>
            </span>
          </div>
        </div>

        <NDivider style="margin: 16px 0" />

        <div class="modal-section">
          <div class="section-title">删除信息</div>
          <div class="modal-info-item">
            <span class="label">删除原因：</span>
            <span class="value">{{ currentDeleteRequest.reason }}</span>
          </div>
        </div>

        <NDivider style="margin: 16px 0" />

        <div class="modal-section">
          <div class="section-title">申请状态</div>
          <div class="modal-info-item">
            <span class="label">申请时间：</span>
            <span class="value">{{ new Date(currentDeleteRequest.applyTime * 1000).toLocaleString() }}</span>
          </div>
          <div class="modal-info-item" v-if="currentDeleteRequest.status !== 0">
            <span class="label">审核时间：</span>
            <span class="value">{{ currentDeleteRequest.reviewTime ? new Date(currentDeleteRequest.reviewTime *
              1000).toLocaleString() : '-' }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">状态：</span>
            <span class="value">
              <NTag
                :type="currentDeleteRequest.status === 0 ? 'warning' : (currentDeleteRequest.status === 1 ? 'success' : 'error')"
                size="small">
                {{ currentDeleteRequest.status === 0 ? '待审核' : (currentDeleteRequest.status === 1 ? '已通过' : '已拒绝') }}
              </NTag>
            </span>
          </div>
          <div class="modal-info-item" v-if="currentDeleteRequest.status === 2">
            <span class="label">拒绝原因：</span>
            <span class="value">{{ currentDeleteRequest.rejectReason || '-' }}</span>
          </div>
        </div>
      </div>
      <template #action>
        <NButton size="small" @click="showDeleteDetailModal = false">关闭</NButton>
      </template>
    </NModal>

    <!-- 节点编辑申请详情对话框 -->
    <NModal v-model:show="showEditDetailModal" preset="dialog" style="width: 650px; max-width: 90vw">
      <template #header>
        <div class="modal-header">节点编辑申请详情</div>
      </template>
      <div v-if="currentEditRequest" style="padding: 16px 0">
        <div class="modal-section">
          <div class="section-title">基本信息</div>
          <div class="modal-info-item">
            <span class="label">申请ID：</span>
            <span class="value">{{ currentEditRequest.requestId }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">节点ID：</span>
            <span class="value">{{ currentEditRequest.nodeId }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">用户名：</span>
            <span class="value">{{ currentEditRequest.username }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">地区：</span>
            <span class="value">
              <NSpace>
                <NTag :bordered="false" type="info" size="small">{{ getRegionName(currentEditRequest.region) || '未设置' }}</NTag>
              </NSpace>
            </span>
          </div>
          <div class="modal-info-item">
            <span class="label">申请原因：</span>
            <span class="value">{{ currentEditRequest.reason }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">申请时间：</span>
            <span class="value">{{ new Date(currentEditRequest.applyTime * 1000).toLocaleString() }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">审核时间：</span>
            <span class="value">{{ currentEditRequest.reviewTime ? new Date(currentEditRequest.reviewTime *
              1000).toLocaleString() : '-' }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">状态：</span>
            <span class="value">
              <NTag
                :type="currentEditRequest.status === 0 ? 'warning' : (currentEditRequest.status === 1 ? 'success' : 'error')"
                size="small">
                {{ currentEditRequest.status === 0 ? '待审核' : (currentEditRequest.status === 1 ? '已通过' : '已拒绝') }}
              </NTag>
            </span>
          </div>
          <div class="modal-info-item" v-if="currentEditRequest.status === 2">
            <span class="label">拒绝原因：</span>
            <span class="value">{{ currentEditRequest.rejectReason || '-' }}</span>
          </div>
        </div>

        <NDivider style="margin: 16px 0" />

        <div class="modal-section">
          <div class="section-title">编辑信息</div>
          <div class="modal-info-item">
            <span class="label">节点名称：</span>
            <span class="value">{{ currentEditRequest.nodeName }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">地区：</span>
            <span class="value">
              <NSpace>
                <NTag :bordered="false" type="info" size="small">{{ getRegionName(currentEditRequest.region) || '未设置' }}</NTag>
              </NSpace>
            </span>
          </div>
          <div class="modal-info-item">
            <span class="label">主机名/IP：</span>
            <span class="value">{{ currentEditRequest.hostname }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">节点描述：</span>
            <span class="value">{{ currentEditRequest.description }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">服务端口：</span>
            <span class="value">{{ currentEditRequest.servicePort }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">管理端口：</span>
            <span class="value">{{ currentEditRequest.adminPort }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">管理密码：</span>
            <span class="value">{{ currentEditRequest.adminPass }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">允许用户组：</span>
            <span class="value">
              <NSpace>
                <template v-if="currentEditRequest.allowGroup">
                  <NTag :bordered="false" v-for="group in currentEditRequest.allowGroup.split(';')" :key="group" type="info" size="small">
                    {{ getGroupName(group) }}
                  </NTag>
                </template>
                <template v-else>-</template>
              </NSpace>
            </span>
          </div>
          <div class="modal-info-item">
            <span class="label">允许端口范围：</span>
            <span class="value">{{ currentEditRequest.allowPort }}</span>
          </div>
          <div class="modal-info-item">
            <span class="label">允许隧道类型：</span>
            <span class="value">
              <NSpace>
                <template v-if="currentDonate.allowType">
                  <NTag :bordered="false" v-for="type in currentDonate.allowType.split(';')" :key="type" type="success" size="small">
                    {{ type.toUpperCase() }}
                  </NTag>
                </template>
                <template v-else>-</template>
              </NSpace>
            </span>
          </div>
        </div>

        <div v-if="currentEditRequest.status === 0" class="modal-section" style="margin-top: 16px">
          <div class="section-title">审核操作</div>
          <NSpace vertical>
            <NButton type="primary" @click="handleApproveEdit(currentEditRequest.requestId)">通过申请</NButton>
            <div>
              <NInput v-model:value="rejectEditReason" type="textarea" placeholder="请输入拒绝原因" />
              <NButton type="error" style="margin-top: 8px" @click="handleRejectEdit(currentEditRequest.requestId)">拒绝申请
              </NButton>
            </div>
          </NSpace>
        </div>
      </div>
      <template #action>
        <NButton size="small" @click="showEditDetailModal = false">关闭</NButton>
      </template>
    </NModal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, h } from 'vue'
import {
  useMessage,
  useDialog,
  NButton,
  NSpace,
  NInput,
  NCard,
  NTabs,
  NTabPane,
  NDataTable,
  NModal,
  PaginationProps,
  NTag,
  NDivider
} from 'naive-ui'
import {
  getAllNodeDonates,
  getPendingNodeDonates,
  approveNodeDonate,
  rejectNodeDonate,
  getAllNodeDeleteRequests,
  getPendingNodeDeleteRequests,
  approveNodeDeleteRequest,
  rejectNodeDeleteRequest,
  getAllNodeEditRequests,
  getPendingNodeEditRequests,
  approveNodeEditRequest,
  rejectNodeEditRequest
} from '../../../shared/api/nodeDonate'
import { AuthApi } from '../../../shared/api/auth'
import type { NodeDonate, NodeDeleteRequest, NodeEditRequest } from '../../../types'

const message = useMessage()
const dialog = useDialog()
const pendingDonates = ref<NodeDonate[]>([])
const allDonates = ref<NodeDonate[]>([])
const pendingDeleteRequests = ref<NodeDeleteRequest[]>([])
const allDeleteRequests = ref<NodeDeleteRequest[]>([])
const pendingEditRequests = ref<NodeEditRequest[]>([])
const allEditRequests = ref<NodeEditRequest[]>([])
const pendingLoading = ref(false)
const allLoading = ref(false)
const pendingDeleteLoading = ref(false)
const allDeleteLoading = ref(false)
const pendingEditLoading = ref(false)
const allEditLoading = ref(false)
const showDetailModal = ref(false)
const currentDonate = ref<NodeDonate | null>(null)
const showDeleteDetailModal = ref(false)
const currentDeleteRequest = ref<NodeDeleteRequest | null>(null)
const showEditDetailModal = ref(false)
const currentEditRequest = ref<NodeEditRequest | null>(null)
const groupOptions = ref<{ label: string; value: string }[]>([])
const rejectEditReason = ref('')

// 分页配置
const pagination = reactive<PaginationProps>({
  page: 1,
  onChange: (page) => {
    pagination.page = page
  },
  prefix({ itemCount }: { itemCount?: number }) {
    return `共 ${itemCount} 条`
  }
})

const allPagination = reactive<PaginationProps>({
  page: 1,
  onChange: (page) => {
    allPagination.page = page
  },
  prefix({ itemCount }: { itemCount?: number }) {
    return `共 ${itemCount} 条`
  }
})

const pendingDeletePagination = reactive<PaginationProps>({
  page: 1,
  onChange: (page) => {
    pendingDeletePagination.page = page
  },
  prefix({ itemCount }: { itemCount?: number }) {
    return `共 ${itemCount} 条`
  }
})

const allDeletePagination = reactive<PaginationProps>({
  page: 1,
  onChange: (page) => {
    allDeletePagination.page = page
  },
  prefix({ itemCount }: { itemCount?: number }) {
    return `共 ${itemCount} 条`
  }
})

// 节点编辑申请分页配置
const pendingEditPagination = reactive<PaginationProps>({
  page: 1,
  onChange: (page) => {
    pendingEditPagination.page = page
  },
  prefix({ itemCount }: { itemCount?: number }) {
    return `共 ${itemCount} 条`
  }
})

const allEditPagination = reactive<PaginationProps>({
  page: 1,
  onChange: (page) => {
    allEditPagination.page = page
  },
  prefix({ itemCount }: { itemCount?: number }) {
    return `共 ${itemCount} 条`
  }
})

// 捐赠申请表格列定义
const donateColumns = [
  {
    title: 'ID',
    key: 'donateId',
    render(row: NodeDonate) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.donateId)
    }
  },
  {
    title: '用户名',
    key: 'username',
    render(row: NodeDonate) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.username)
    }
  },
  {
    title: '节点名称',
    key: 'nodeName',
    render(row: NodeDonate) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.nodeName)
    }
  },
  {
    title: '主机名/IP',
    key: 'hostname',
    render(row: NodeDonate) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.hostname)
    }
  },
  {
    title: '申请时间',
    key: 'applyTime',
    render(row: NodeDonate) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, new Date(row.applyTime * 1000).toLocaleString())
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row: NodeDonate) {
      if (row.status === 0) {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'warning', size: 'small' }, { default: () => '待审核' })
      } else if (row.status === 1) {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'success', size: 'small' }, { default: () => '已通过' })
      } else {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'error', size: 'small' }, { default: () => '已拒绝' })
      }
    }
  },
  {
    title: '拒绝原因',
    key: 'rejectReason',
    render(row: NodeDonate) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.status === 2 ? row.rejectReason : '-')
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row: NodeDonate) {
      if (row.status === 0) {
        return h(
          NSpace,
          { align: 'center' },
          {
            default: () => [
              h(
                NButton,
                {
                  type: 'primary',
                  size: 'small',
                  onClick: () => handleApprove(row)
                },
                { default: () => '通过' }
              ),
              h(
                NButton,
                {
                  type: 'error',
                  size: 'small',
                  onClick: () => handleReject(row)
                },
                { default: () => '拒绝' }
              ),
              h(
                NButton,
                {
                  type: 'info',
                  size: 'small',
                  onClick: () => handleViewDetail(row)
                },
                { default: () => '详情' }
              )
            ]
          }
        )
      } else {
        return h(
          NButton,
          {
            type: 'info',
            size: 'small',
            onClick: () => handleViewDetail(row)
          },
          { default: () => '详情' }
        )
      }
    }
  }
]

// 删除申请表格列定义
const deleteColumns = [
  {
    title: 'ID',
    key: 'requestId',
    render(row: NodeDeleteRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.requestId)
    }
  },
  {
    title: '用户名',
    key: 'username',
    render(row: NodeDeleteRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.username)
    }
  },
  {
    title: '节点ID',
    key: 'nodeId',
    render(row: NodeDeleteRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.nodeId)
    }
  },
  {
    title: '删除原因',
    key: 'reason',
    render(row: NodeDeleteRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.reason)
    }
  },
  {
    title: '申请时间',
    key: 'applyTime',
    render(row: NodeDeleteRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, new Date(row.applyTime * 1000).toLocaleString())
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row: NodeDeleteRequest) {
      if (row.status === 0) {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'warning', size: 'small' }, { default: () => '待审核' })
      } else if (row.status === 1) {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'success', size: 'small' }, { default: () => '已通过' })
      } else {
        return h(NTag, { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;', type: 'error', size: 'small' }, { default: () => '已拒绝' })
      }
    }
  },
  {
    title: '拒绝原因',
    key: 'rejectReason',
    render(row: NodeDeleteRequest) {
      return h('div', { style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;' }, row.status === 2 ? row.rejectReason : '-')
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row: NodeDeleteRequest) {
      if (row.status === 0) {
        return h(
          NSpace,
          { align: 'center' },
          {
            default: () => [
              h(
                NButton,
                {
                  type: 'primary',
                  size: 'small',
                  onClick: () => handleApproveDelete(row)
                },
                { default: () => '通过' }
              ),
              h(
                NButton,
                {
                  type: 'error',
                  size: 'small',
                  onClick: () => handleRejectDelete(row)
                },
                { default: () => '拒绝' }
              ),
              h(
                NButton,
                {
                  type: 'info',
                  size: 'small',
                  onClick: () => handleViewDeleteDetail(row)
                },
                { default: () => '详情' }
              )
            ]
          }
        )
      } else {
        return h(
          NButton,
          {
            type: 'info',
            size: 'small',
            onClick: () => handleViewDeleteDetail(row)
          },
          { default: () => '详情' }
        )
      }
    }
  }
]

// 节点编辑申请表格列定义
const editColumns = [
  {
    title: 'ID',
    key: 'requestId'
  },
  {
    title: '节点ID',
    key: 'nodeId'
  },
  {
    title: '用户名',
    key: 'username'
  },
  {
    title: '节点名称',
    key: 'nodeName'
  },
  {
    title: '申请时间',
    key: 'applyTime',
    render(row: NodeEditRequest) {
      return h('span', {}, new Date(row.applyTime * 1000).toLocaleString())
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row: NodeEditRequest) {
      let type: 'default' | 'success' | 'error' | 'warning' | 'info' | 'primary' = 'default'
      let text = '未知'

      switch (row.status) {
        case 0:
          type = 'warning'
          text = '待审核'
          break
        case 1:
          type = 'success'
          text = '已通过'
          break
        case 2:
          type = 'error'
          text = '已拒绝'
          break
      }

      return h(NTag, { type, size: 'small' }, { default: () => text })
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row: NodeEditRequest) {
      return h(NButton, {
        size: 'small',
        onClick: () => {
          currentEditRequest.value = row
          showEditDetailModal.value = true
        }
      }, { default: () => '详情' })
    }
  }
]

// 获取用户组友好名称的函数
const getGroupName = (groupName: string) => {
  const group = groupOptions.value.find(g => g.value === groupName)
  return group ? group.label : groupName
}

// 获取用户组列表
const fetchGroups = async () => {
  try {
    const res = await AuthApi.getUserGroups()
    if (res.data.code === 200) {
      const groups = res.data.data.groups
      groupOptions.value = groups.map(group => ({
        label: group.friendlyName,
        value: group.name
      }))
    } else {
      message.error(res.data.message || '获取用户组列表失败')
    }
  } catch (error) {
    console.error(error)
    message.error('获取用户组列表失败, 请稍后重试')
  }
}

// 通过捐赠申请
const handleApprove = (row: NodeDonate) => {
  dialog.warning({
    title: '确认通过',
    content: `确定要通过 ${row.username} 的节点捐赠申请吗？通过后将自动创建新节点。`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const res = await approveNodeDonate({ donateId: row.donateId })
        if (res.data.code === 200) {
          message.success(res.data.message || '审核通过成功')
          // 刷新列表
          fetchPendingDonates()
          fetchAllDonates()
        } else {
          message.error(res.data.message || '审核通过失败')
        }
      } catch (error) {
        message.error('操作失败, 请稍后重试')
        console.error(error)
      }
    }
  })
}

// 拒绝捐赠申请
const handleReject = (row: NodeDonate) => {
  const rejectReasonRef = ref('')
  dialog.warning({
    title: '拒绝申请',
    content: () => h(NInput, {
      placeholder: '请输入拒绝原因',
      value: rejectReasonRef.value,
      onUpdateValue: (value) => {
        rejectReasonRef.value = value
      },
      type: 'textarea',
      rows: 3
    }),
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      if (!rejectReasonRef.value) {
        message.error('请输入拒绝原因')
        return false
      }

      try {
        const res = await rejectNodeDonate({
          donateId: row.donateId,
          reason: rejectReasonRef.value
        })
        if (res.data.code === 200) {
          message.success(res.data.message || '拒绝申请成功')
          // 刷新列表
          fetchPendingDonates()
          fetchAllDonates()
        } else {
          message.error(res.data.message || '拒绝申请失败')
        }
      } catch (error) {
        message.error('操作失败, 请稍后重试')
        console.error(error)
      }
    }
  })
}

// 查看捐赠申请详情
const handleViewDetail = (row: NodeDonate) => {
  showDetailModal.value = true
  currentDonate.value = row
}

// 通过删除申请
const handleApproveDelete = (row: NodeDeleteRequest) => {
  dialog.warning({
    title: '确认通过',
    content: `确定要通过 ${row.username} 的节点删除申请吗？通过后将删除节点及相关隧道。`,
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const res = await approveNodeDeleteRequest({ requestId: row.requestId })
        if (res.data.code === 200) {
          message.success(res.data.message || '审核通过成功')
          // 刷新列表
          fetchPendingDeleteRequests()
          fetchAllDeleteRequests()
        } else {
          message.error(res.data.message || '审核通过失败')
        }
      } catch (error) {
        message.error('操作失败, 请稍后重试')
        console.error(error)
      }
    }
  })
}

// 拒绝删除申请
const handleRejectDelete = (row: NodeDeleteRequest) => {
  const rejectReasonRef = ref('')
  dialog.warning({
    title: '拒绝申请',
    content: () => h(NInput, {
      placeholder: '请输入拒绝原因',
      value: rejectReasonRef.value,
      onUpdateValue: (value) => {
        rejectReasonRef.value = value
      },
      type: 'textarea',
      rows: 3
    }),
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      if (!rejectReasonRef.value) {
        message.error('请输入拒绝原因')
        return false
      }

      try {
        const res = await rejectNodeDeleteRequest({
          requestId: row.requestId,
          reason: rejectReasonRef.value
        })
        if (res.data.code === 200) {
          message.success(res.data.message || '拒绝申请成功')
          // 刷新列表
          fetchPendingDeleteRequests()
          fetchAllDeleteRequests()
        } else {
          message.error(res.data.message || '拒绝申请失败')
        }
      } catch (error) {
        message.error('操作失败, 请稍后重试')
        console.error(error)
      }
    }
  })
}

// 查看删除申请详情
const handleViewDeleteDetail = (row: NodeDeleteRequest) => {
  showDeleteDetailModal.value = true
  currentDeleteRequest.value = row
}

// 获取待审核的捐赠申请
const fetchPendingDonates = async () => {
  pendingLoading.value = true
  try {
    const res = await getPendingNodeDonates()
    if (res.data.code === 200) {
      pendingDonates.value = res.data.data || []
    } else {
      message.error(res.data.message || '获取待审核申请失败')
    }
  } catch (error) {
    message.error('获取待审核申请失败, 请稍后重试')
    console.error(error)
  } finally {
    pendingLoading.value = false
  }
}

// 获取所有捐赠申请
const fetchAllDonates = async () => {
  allLoading.value = true
  try {
    const res = await getAllNodeDonates()
    if (res.data.code === 200) {
      allDonates.value = res.data.data || []
    } else {
      message.error(res.data.message || '获取申请列表失败')
    }
  } catch (error) {
    message.error('获取申请列表失败, 请稍后重试')
    console.error(error)
  } finally {
    allLoading.value = false
  }
}

// 获取待审核的删除申请
const fetchPendingDeleteRequests = async () => {
  pendingDeleteLoading.value = true
  try {
    const res = await getPendingNodeDeleteRequests()
    if (res.data.code === 200) {
      pendingDeleteRequests.value = res.data.data || []
    } else {
      message.error(res.data.message || '获取待审核删除申请失败')
    }
  } catch (error) {
    message.error('获取待审核删除申请失败, 请稍后重试')
    console.error(error)
  } finally {
    pendingDeleteLoading.value = false
  }
}

// 获取所有删除申请
const fetchAllDeleteRequests = async () => {
  allDeleteLoading.value = true
  try {
    const res = await getAllNodeDeleteRequests()
    if (res.data.code === 200) {
      allDeleteRequests.value = res.data.data || []
    } else {
      message.error(res.data.message || '获取删除申请列表失败')
    }
  } catch (error) {
    message.error('获取删除申请列表失败, 请稍后重试')
    console.error(error)
  } finally {
    allDeleteLoading.value = false
  }
}

// 获取待审核的节点编辑申请
const fetchPendingEditRequests = async () => {
  pendingEditLoading.value = true
  try {
    const res = await getPendingNodeEditRequests()
    if (res.data.code === 200) {
      pendingEditRequests.value = res.data.data
      pendingEditPagination.itemCount = res.data.data.length
    } else {
      message.error(res.data.message)
    }
  } catch (error) {
    message.error('获取待审核节点编辑申请失败')
    console.error(error)
  } finally {
    pendingEditLoading.value = false
  }
}

// 获取所有节点编辑申请
const fetchAllEditRequests = async () => {
  allEditLoading.value = true
  try {
    const res = await getAllNodeEditRequests()
    if (res.data.code === 200) {
      allEditRequests.value = res.data.data
      allEditPagination.itemCount = res.data.data.length
    } else {
      message.error(res.data.message)
    }
  } catch (error) {
    message.error('获取所有节点编辑申请失败')
    console.error(error)
  } finally {
    allEditLoading.value = false
  }
}

// 通过节点编辑申请
const handleApproveEdit = async (requestId: number) => {
  dialog.warning({
    title: '确认通过',
    content: '确定要通过这个节点编辑申请吗？通过后将更新节点信息。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        const res = await approveNodeEditRequest({ requestId })
        if (res.data.code === 200) {
          message.success('已通过节点编辑申请')
          fetchPendingEditRequests()
          fetchAllEditRequests()
          showEditDetailModal.value = false
        } else {
          message.error(res.data.message)
        }
      } catch (error) {
        message.error('操作失败')
        console.error(error)
      }
    }
  })
}

// 拒绝节点编辑申请
const handleRejectEdit = async (requestId: number) => {
  if (!rejectEditReason.value) {
    message.warning('请输入拒绝原因')
    return
  }

  try {
    const res = await rejectNodeEditRequest({
      requestId,
      reason: rejectEditReason.value
    })
    if (res.data.code === 200) {
      message.success('已拒绝节点编辑申请')
      rejectEditReason.value = ''
      fetchPendingEditRequests()
      fetchAllEditRequests()
      showEditDetailModal.value = false
    } else {
      message.error(res.data.message)
    }
  } catch (error) {
    message.error('操作失败')
    console.error(error)
  }
}

// 获取地区显示名称
const getRegionName = (region: string) => {
  const regionMap: Record<string, string> = {
    'cn': '中国大陆',
    'cnos': '中国香港/澳门/台湾地区',
    'oversea': '海外'
  }
  return regionMap[region] || region
}

onMounted(() => {
  fetchPendingDonates()
  fetchAllDonates()
  fetchPendingDeleteRequests()
  fetchAllDeleteRequests()
  fetchPendingEditRequests()
  fetchAllEditRequests()
  fetchGroups()
})
</script>

<style lang="scss" scoped>
.node-donate-manage-container {
  .manage-card {
    margin-bottom: 20px;
  }

  :deep(.n-data-table-td) {
    padding: 10px 12px;
  }

  :deep(.n-card-header) {
    padding: 16px 20px;
  }

  :deep(.n-card__content) {
    padding: 0 16px 16px;
  }
}

.modal-info-item {
  display: flex;
  margin-bottom: 14px;
  line-height: 1.5;

  .label {
    width: 140px;
    font-weight: 500;
    color: var(--text-color-2);
    text-align: right;
    padding-right: 16px;
  }

  .value {
    flex: 1;
    word-break: break-all;
  }
}

.modal-section {
  margin-bottom: 24px;
  position: relative;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 0;
    right: 0;
    height: 1px;
    background-color: var(--n-border-color);
    opacity: 0.5;
  }

  .section-title {
    font-weight: 500;
    margin-bottom: 16px;
    font-size: 15px;
    color: var(--n-title-text-color);
    position: relative;
    padding-left: 12px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 16px;
      background-color: var(--n-primary-color);
      border-radius: 2px;
    }
  }
}

.modal-header {
  font-size: 16px;
  font-weight: 600;
  color: var(--n-title-text-color);
}

:deep(.n-modal) {
  .n-card-header {
    padding: 16px 20px;
    font-weight: 500;
    font-size: 16px;
    border-bottom: 1px solid var(--n-border-color);
  }

  .n-card__content {
    padding: 0 20px 20px;
  }

  .n-card__action {
    padding: 12px 20px;
    background-color: var(--n-color-modal);
    border-top: 1px solid var(--n-border-color);
  }

  .n-divider {
    margin: 16px 0;
  }
}

:deep(.n-button) {
  &.n-button--primary-type {
    font-weight: 500;
  }
}

:deep(.n-tag) {
  padding: 0 8px;
}
</style>