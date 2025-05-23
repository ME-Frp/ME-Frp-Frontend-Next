<template>
  <div class="downloads">
    <div class="downloads-layout">
      <!-- 左侧：资源下载 -->
      <NCard title="文件下载" class="download-card">
        <div class="downloads-container">
          <div class="select-row">
            <div class="select-label">下载源</div>
            <NPopselect
              v-model:value="selectedSource"
              :options="sourceOptions"
              trigger="click"
            >
              <NButton :focusable="false" text size="small" type="info">
                <span style="font-size: 16px;vertical-align: top;">{{ currentSource?.name || '请选择下载源' }}</span>
                <NIcon :size="16" style="margin-top: 2px;margin-left:4px;" :component="ChevronDownOutline" />
              </NButton>
            </NPopselect>
          </div>

          <div class="main-content" v-if="selectedSource">
            <div class="select-row">
              <div class="select-label">产品</div>
              <NPopselect
                v-model:value="selectedProduct"
                :options="productOptions"
                trigger="click"
                @update:value="handleProductChange"
              >
                <NButton :focusable="false" text size="small" type="info">
                  <span style="font-size: 16px;vertical-align: top;">{{ currentProduct?.name || '请选择产品' }}</span>
                  <NIcon :size="16" style="margin-top: 2px;margin-left:4px;" :component="ChevronDownOutline" />
                </NButton>
              </NPopselect>
              <NTag :bordered="false" v-if="currentProduct" size="small" type="info" round>v{{ currentProduct.version }}</NTag>
            </div>
            
            <div v-if="currentProduct" class="product-content">
              <div class="markdown-content">
                <NText depth="3">
                  <div v-html="renderedDesc"></div>
                </NText>
              </div>
              <NDivider />
              
              <!-- Docker产品不显示系统和架构选择 -->
              <template v-if="!isDockerProduct">
                <div class="select-row">
                  <div class="select-label">系统</div>
                  <NSelect
                    :key="currentProduct.productId"
                    v-model:value="currentProduct.selectedSystem"
                    :options="getSystemOptions(currentProduct.system)"
                    @update:value="handleSystemChange"
                    placeholder="请选择系统"
                  />
                </div>
                <div class="select-row" style="margin-top: 8px;">
                  <div class="select-label">架构</div>
                  <NSelect
                    :key="currentProduct.productId"
                    v-model:value="currentProduct.selectedArch"
                    :options="getArchOptions(currentProduct.arch, currentProduct.selectedSystem)"
                    :disabled="!currentProduct.selectedSystem"
                    placeholder="请选择架构"
                  />
                </div>
                <div class="download-row">
                  <NButton
                    secondary
                    size="medium"
                    :disabled="!currentProduct.selectedSystem || !currentProduct.selectedArch"
                    @click="handleCopyDownloadUrl"
                  >
                    <template #icon>
                      <NIcon :component="CopyOutline" />
                    </template>
                    复制下载链接
                  </NButton>
                  <NButton
                    type="primary"
                    size="medium"
                    :disabled="!currentProduct.selectedSystem || !currentProduct.selectedArch"
                    @click="handleDownload"
                  >
                    <template #icon>
                      <NIcon :component="DownloadOutline" />
                    </template>
                    下载
                  </NButton>
                </div>
              </template>
              
              <!-- Docker产品显示Docker提示 -->
              <template v-else>
                <div class="docker-info">
                  <NAlert type="info" title="Docker 镜像">
                    <template #icon>
                      <NIcon :component="InformationCircleOutline" />
                    </template>
                    <p>此产品为 Docker 镜像，请使用以下命令拉取：</p>
                    <div class="docker-command">
                      <NCode>docker pull {{ currentProduct.path }}:{{ currentProduct.version }}</NCode>
                      <NButton size="small" @click="copyDockerCommand">
                        <template #icon>
                          <NIcon :component="CopyOutline" />
                        </template>
                        复制
                      </NButton>
                    </div>
                  </NAlert>
                </div>
              </template>
            </div>
          </div>
        </div>
      </NCard>

      <!-- 右侧：广告位 -->
      <div class="dev-column">
        <!-- 顶部广告位 -->
        <NCard :title="topDevTitle" class="dev-card top-dev-card">
          <div class="dev-container">
            <DevSpace ref="topDevSpaceRef" placement="downloads-1" v-model:title="topDevTitle" />
          </div>
        </NCard>

        <!-- 底部广告位 -->
        <NCard :title="bottomDevTitle" class="dev-card bottom-dev-card">
          <div class="dev-container">
            <DevSpace ref="bottomDevSpaceRef" placement="downloads-2" v-model:title="bottomDevTitle" />
          </div>
        </NCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { NCode, NCard, NButton, NDivider, NText, NPopselect, NSelect, NIcon, NTag, NAlert, useMessage } from 'naive-ui'
import { ChevronDownOutline, DownloadOutline, CopyOutline, InformationCircleOutline } from '@vicons/ionicons5'
import { AuthApi } from '../../shared/api/auth'
import type { Product } from '../../types/adminApi'
import type { DownloadSource } from '../../types'
import type { SelectOption } from 'naive-ui'
import { marked } from 'marked'
import DevSpace from '../../components/DevSpace.vue'

const message = useMessage()

// 顶部广告位
const topDevSpaceRef = ref(null)
const topDevTitle = ref('推荐服务')

// 底部广告位
const bottomDevSpaceRef = ref(null)
const bottomDevTitle = ref('推荐服务')

// 监听顶部广告组件引用变化
watch(topDevSpaceRef, (newRef) => {
  if (newRef) {
    console.log('顶部广告组件引用已更新，当前标题:', newRef.getCurrentDevTitle?.());
    // 如果广告已加载，立即更新标题
    if (newRef.ads?.value?.length > 0) {
      topDevTitle.value = newRef.getCurrentDevTitle();
      console.log('从引用更新顶部标题为:', topDevTitle.value);
    }
  }
}, { immediate: true });

// 监听底部广告组件引用变化
watch(bottomDevSpaceRef, (newRef) => {
  if (newRef) {
    // 如果广告已加载，立即更新标题
    if (newRef.ads?.value?.length > 0) {
      bottomDevTitle.value = newRef.getCurrentDevTitle();
    }
  }
}, { immediate: true });

const products = ref<(Product & {
  selectedSystem?: string
  selectedArch?: string
})[]>([])
const downloadSources = ref<DownloadSource[]>([])
const selectedSource = ref<string>('')
const selectedProduct = ref<string>('')

// 判断当前产品是否为 Docker 产品
const isDockerProduct = computed(() => {
  if (!currentProduct.value) return false
  return currentProduct.value.productId.toLowerCase().includes('docker')
})

const productOptions = computed<SelectOption[]>(() => 
  products.value.map(product => ({
    label: product.name,
    value: product.productId
  }))
)

const currentProduct = computed(() => 
  products.value.find(p => p.productId === selectedProduct.value)
)

const handleProductChange = () => {
  if (currentProduct.value) {
    currentProduct.value.selectedSystem = undefined
    currentProduct.value.selectedArch = undefined
  }
}

const getSystemOptions = (systemStr: string): SelectOption[] => {
  // 系统格式：windows|darwin|linux|freebsd|android
  return systemStr.split('|').map(system => ({
    label: system,
    value: system
  }))
}

const getArchOptions = (archStr: string, selectedSystem?: string): SelectOption[] => {
  if (!selectedSystem || !archStr) return []
  
  // 架构格式：windows:386/amd64/arm/arm64|darwin:amd64/arm64|linux:386/amd64/arm/arm64|android:arm64
  const archMap = new Map(
    archStr.split('|').map(item => {
      const [sys, archs] = item.split(':')
      return [sys, archs.split('/')]
    })
  )
  
  const archs = archMap.get(selectedSystem) || []
  return archs.map(arch => ({
    label: arch,
    value: arch
  }))
}

const handleSystemChange = () => {
  // 切换系统时清空已选择的架构
  if (currentProduct.value) {
    currentProduct.value.selectedArch = undefined
  }
}

// 复制Docker命令
const copyDockerCommand = () => {
  if (!currentProduct.value) return
  const command = `docker pull ${currentProduct.value.path}:${currentProduct.value.version}`
  navigator.clipboard.writeText(command)
  message.success('复制 Docker 拉取命令成功')
}

const getDownloadUrl = async (product: Product & {
  selectedSystem?: string
  selectedArch?: string
}) => {
  if (!selectedSource.value || !product.selectedSystem || !product.selectedArch) return '#'
  
  try {
    // 构建文件路径
    const basePath = `/ME-Frp/${currentSource.value?.path}/${product.path}/${product.version}`
    
    // 调用 AList API 获取文件列表
    const res = await fetch(`https://resources.mefrp.com/api/fs/list?path=${encodeURIComponent(basePath)}`)
    const data = await res.json()
    
    if (data.code !== 200) {
      throw new Error(data.message || '获取文件列表失败')
    }
    
    // 查找匹配的文件
    const file = data.data.content.find((item: any) => {
      const name = item.name.toLowerCase()
      const system = product.selectedSystem?.toLowerCase() || ''
      const arch = product.selectedArch?.toLowerCase() || ''
      
      // 文件名需要同时包含选择的系统和架构
      return name.includes(system) && name.includes(arch)
    })

    if (!file) {
      throw new Error('未找到对应的下载文件')
    }
    
    // 返回下载链接
    return `https://resources.mefrp.com/d${basePath}/${file.name}`
  } catch (error: any) {
    message.error(error.message || '获取下载链接失败')
    return '#'
  }
}

const handleDownload = async () => {
  if (!currentProduct.value) return
  const url = await getDownloadUrl(currentProduct.value)
  if (url !== '#') {
    window.open(url, '_blank')
  }
}

const handleCopyDownloadUrl = async () => {
  if (!currentProduct.value) return
  const url = await getDownloadUrl(currentProduct.value)
  if (url !== '#') {
    navigator.clipboard.writeText(url)
    message.success('复制下载链接成功')
  }
}

const fetchProducts = async () => {
  try {
    const { data: { data } } = await AuthApi.getProducts()
    products.value = data.map(product => ({
      ...product,
      selectedSystem: undefined,
      selectedArch: undefined
    }))
    if (data.length > 0) {
      selectedProduct.value = data[0].productId
    }
  } catch (error) {
    message.error('获取产品列表失败')
  }
}

const fetchDownloadSources = async () => {
  try {
    const { data: { data } } = await AuthApi.getDownloadSources()
    downloadSources.value = data
    if (data.length > 0) {
      selectedSource.value = data[0].id
    }
  } catch (error) {
    message.error('获取下载源列表失败')
  }
}

const currentSource = computed(() => 
  downloadSources.value.find(s => s.id === selectedSource.value)
)

const sourceOptions = computed<SelectOption[]>(() => 
  downloadSources.value.map(source => ({
    label: source.name,
    value: source.id
  }))
)

const renderedDesc = computed(() => {
  if (!currentProduct.value?.desc) return ''
  return marked(currentProduct.value.desc, { breaks: true })
})

onMounted(async () => {
  await Promise.all([
    fetchProducts(),
    fetchDownloadSources()
  ])
})
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/downloads.scss' as *;
</style>