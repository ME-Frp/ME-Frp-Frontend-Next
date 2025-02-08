<template>
  <div class="downloads">
    <NCard title="文件下载">
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
            <NTag v-if="currentProduct" size="small" type="info" round>v{{ currentProduct.version }}</NTag>
          </div>
          
          <div v-if="currentProduct" class="product-content">
            <div class="markdown-content">
              <NText depth="3">
                <div v-html="renderedDesc"></div>
              </NText>
            </div>
            <NDivider />
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
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { NCard, NButton, NDivider, NText, NPopselect, NSelect, NIcon, NTag, useMessage } from 'naive-ui'
import { ChevronDownOutline, DownloadOutline, CopyOutline } from '@vicons/ionicons5'
import { AuthApi } from '../../shared/api/auth'
import type { Product } from '../../types/adminApi'
import type { DownloadSource } from '../../types'
import type { SelectOption } from 'naive-ui'
import { marked } from 'marked'

const message = useMessage()
const products = ref<(Product & {
  selectedSystem?: string
  selectedArch?: string
})[]>([])
const downloadSources = ref<DownloadSource[]>([])
const selectedSource = ref<string>('')
const selectedProduct = ref<string>('')

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
@use '../../assets/styles/variables' as *;

.downloads :deep(.n-divider) {
  margin: 16px 0;
}

.downloads-container {
  display: flex;
  gap: 16px;
  flex-direction: column;
}

.source-group {
  /* display: flex; */
  flex-wrap: wrap;
  /* gap: 8px; */
}

.main-content {
  flex-grow: 1;
  min-width: 0;
  margin-top: 8px;
}

.product-content {
  margin-top: 16px;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.download-row {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
}

.select-row {
  display: flex;
  gap: 16px;
  width: 100%;
  align-items: center;
}

.select-row + .select-row {
  margin-top: 16px;
}

.select-label {
  min-width: 40px;
  color: var(--n-text-color-2);
}

.select-row :deep(.n-select) {
  flex: 1;
}

@media (max-width: 768px) {
  .select-row {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    gap: 8px;
  }

  .select-row :deep(.n-select) {
    width: 100%;
  }
}

.markdown-content {
  :deep(a) {
    color: $primary-color;
    text-decoration: none;
    transition: $transition-all;

    &:hover {
      color: $primary-hover;
    }
  }

  :deep(h1) {
    font-size: 1.6em;
    margin: 0;
  }

  :deep(h2) {
    font-size: 1.4em;
    margin: 0;
  }

  :deep(h3) {
    font-size: 1.2em;
    margin: 0;
  }

  :deep(p) {
    margin: 0;
    line-height: 1.6;
    font-size: 1.1em;
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 1.5em;
    margin: 0;
    font-size: 1.1em;
  }

  :deep(li) {
    margin: 0;
  }

  :deep(code) {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
    font-size: 1.1em;
  }

  :deep(pre) {
    background-color: rgba(0, 0, 0, 0.05);
    padding: 1em;
    border-radius: 5px;
    overflow-x: auto;
    margin: 0;

    code {
      background-color: transparent;
      padding: 0;
    }
  }

  :deep(blockquote) {
    border-left: 4px solid $border-color;
    padding-left: 1em;
    margin: 0;
    color: $text-color-2;
    font-size: 1.1em;
  }

  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 0;
    font-size: 1.1em;
  }

  :deep(th),
  :deep(td) {
    border: 1px solid $border-color;
    padding: 0.5em;
  }

  :deep(th) {
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>