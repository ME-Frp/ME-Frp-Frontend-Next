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
        <NCard v-for="proxy in proxies" :key="proxy.id" class="proxy-card">
          <div class="proxy-header">
            <h3 class="proxy-title">{{ proxy.name }}</h3>
            <NTag :type="proxy.status === 'online' ? 'success' : 'error'" size="small">
              {{ proxy.status === 'online' ? '在线' : '离线' }}
            </NTag>
          </div>
          <div class="proxy-info">
              <div class="info-item">
                <span class="label">隧道类型：</span>
                <span class="value">{{ proxy.type.toUpperCase() }}</span>
              </div>
              <div class="info-item">
                <span class="label">远程端口：</span>
                <span class="value">{{ proxy.remotePort }}</span>
              </div>
              <div class="info-item">
                <span class="label">部署节点：</span>
                <span class="value">{{ getNodeLabel(proxy.node) }}</span>
              </div>
              <div class="info-item">
                <span class="label">已用流量：</span>
                <span class="value">{{ proxy.usedTraffic }}</span>
              </div>
          </div>
          <div class="proxy-actions">
            <NButton secondary size="small">
              <template #icon>
                <NIcon>
                  <BuildOutline />
                </NIcon>
              </template> 更多
            </NButton>
          </div>
        </NCard>
      </div>

      <!-- 列表视图 -->
      <NTable v-else :single-line="false">
        <thead>
          <tr>
            <th>名称</th>
            <th>类型</th>
            <th>节点</th>
            <th>远程端口</th>
            <th>已用流量</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="proxy in proxies" :key="proxy.id">
            <td>{{ proxy.name }}</td>
            <td>{{ proxy.type.toUpperCase() }}</td>
            <td>{{ getNodeLabel(proxy.node) }}</td>
            <td>{{ proxy.remotePort }}</td>
            <td>{{ proxy.usedTraffic }}</td>
            <td>
              <NTag :type="proxy.status === 'online' ? 'success' : 'error'" size="small">
                {{ proxy.status === 'online' ? '在线' : '离线' }}
              </NTag>
            </td>
            <td>
              <NButton quaternary circle>
                <template #icon>
                  <NIcon>
                    <BuildOutline />
                  </NIcon>
                </template>
              </NButton>
            </td>
          </tr>
        </tbody>
      </NTable>
    </NCard>

    <!-- 远程地址信息弹窗 -->
    <NModal v-model:show="showModal" preset="dialog" title="远程地址信息">
      <template #header>
        <div>远程地址信息</div>
      </template>
      <div v-if="selectedProxy">
        <div v-if="selectedProxy.domain" class="modal-info-item">
          <span class="label">绑定域名：</span>
          <span class="value">{{ selectedProxy.domain }}</span>
        </div>
        <div v-if="selectedProxy.remoteAddr" class="modal-info-item">
          <span class="label">远程地址：</span>
          <span class="value">{{ selectedProxy.remoteAddr }}</span>
        </div>
      </div>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NButton, NButtonGroup, NTag, NTable, NIcon, NModal, NInput } from 'naive-ui'
import { GridOutline, ListOutline, BuildOutline, RefreshOutline, SearchOutline } from '@vicons/ionicons5'
import { type Proxy, mockProxies, mockNodeOptions } from '../../types'

const viewMode = ref<'grid' | 'list'>('grid')
const searchText = ref('')

// 过滤隧道列表
const proxies = computed(() => {
  const search = searchText.value.toLowerCase()
  return mockProxies.filter(proxy =>
    proxy.name.toLowerCase().includes(search) ||
    proxy.type.toLowerCase().includes(search) ||
    getNodeLabel(proxy.node).toLowerCase().includes(search)
  )
})

const handleRefresh = () => {
  // console.log('刷新隧道列表')
}

const getNodeLabel = (nodeId: string) => {
  return mockNodeOptions.find(node => node.value === nodeId)?.label || nodeId
}

const showModal = ref(false)
const selectedProxy = ref<Proxy | null>(null)

</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/manageProxies.scss';
</style>