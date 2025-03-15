<template>
  <div class="ad-space">
    <template v-if="ads.length > 0">
      <NCarousel
        :autoplay="ads.length > 1"
        :interval="3200"
        :show-dots="ads.length > 1"
        :show-arrow="ads.length > 1"
        :mousewheel="true"
        dot-type="dot"
        effect="fade"
        arrow-placement="wrapper"
        dot-placement="bottom"
        class="ad-carousel"
        style="width: 100%; height: 100%; min-height: 200px; box-sizing: border-box; position: relative; z-index: 1;"
        @update:current-index="handleAdChange"
      >
        <NCarouselItem v-for="ad in ads" :key="ad.adsId" style="width: 100%; height: 100%; box-sizing: border-box; ">
          <!-- 带图片的广告 -->
          <div v-if="ad.adsImageUrl" class="ad-with-image">
            <NImage
              :src="ad.adsImageUrl"
              :alt="ad.adsContent || '广告'"
              object-fit="cover"
              preview-disabled
              class="ad-image"
              :intersection-observer-options="{
                root: null,
                rootMargin: '0px',
                threshold: 0.1
              }"
            />
            <div class="ad-overlay">
              <div v-if="ad.adsContent" class="ad-image-content">{{ ad.adsContent }}</div>
              <NButton class="ad-button" type="warning" size="small" @click.stop="openAdLink(ad.adsUrl, ad.adsId)">
                <template #icon>
                  <NIcon>
                    <LinkOutline />
                  </NIcon>
                </template>
                访问链接
              </NButton>
            </div>
          </div>
          
          <!-- 纯文本广告 -->
          <div v-else class="ad-text-only">
            <div class="ad-content">
              <div v-if="ad.adsContent" class="ad-description">{{ ad.adsContent }}</div>
              <div style="position: relative; z-index: 20; pointer-events: all;">
                <NButton 
                  class="ad-button" 
                  type="warning" 
                  size="small" 
                  style="z-index: 30; position: relative;"
                  @click="(e) => {
                    e.stopPropagation();
                    openAdLink(ad.adsUrl, ad.adsId);
                  }"
                >
                  <template #icon>
                    <NIcon>
                      <LinkOutline />
                    </NIcon>
                  </template>
                  访问链接
                </NButton>
              </div>
            </div>
          </div>
        </NCarouselItem>
      </NCarousel>
    </template>
    
    <!-- 加载状态 -->
    <div v-else-if="loading" class="empty-state">
      <NSpin size="medium" />
      <p>加载中...</p>
    </div>
    
    <!-- 无广告状态 -->
    <div v-else class="empty-state">
      <NEmpty description="暂无广告" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { NCarousel, NCarouselItem, NImage, NSpin, NEmpty, NButton, NIcon } from 'naive-ui'
import { LinkOutline } from '@vicons/ionicons5'
import { AdsApi } from '../shared/api/ads'
import type { Ad } from '../shared/api/ads'

const props = defineProps<{
  placement: string
  title?: string
}>()

const emit = defineEmits(['update:title'])

const ads = ref<Ad[]>([])
const loading = ref(true)
const currentAdIndex = ref(0)

// 广告类型对应的标题映射
const adTypeTitles = {
  'idc': 'IDC 服务广告',
  'game': '游戏相关广告',
  'official': '官方广告',
  'tools': '工具推荐',
  'other': '其他广告'
}

// 获取广告标题
const getAdTitle = (ad: Ad): string => {
  return adTypeTitles[ad.adsType as keyof typeof adTypeTitles] || props.title || '推荐服务'
}

// 获取当前广告标题
const getCurrentAdTitle = (): string => {
  if (ads.value.length > 0 && currentAdIndex.value < ads.value.length) {
    return getAdTitle(ads.value[currentAdIndex.value])
  }
  return props.title || '推荐服务'
}

// 处理广告切换
const handleAdChange = (index: number) => {
  currentAdIndex.value = index
  updateTitle()
}

// 更新标题
const updateTitle = () => {
  const newTitle = getCurrentAdTitle()
  emit('update:title', newTitle)
}

// 监听广告数据变化，更新标题
watch(ads, () => {
  if (ads.value.length > 0) {
    nextTick(updateTitle)
  }
}, { deep: true, immediate: true })

// 打开广告链接
const openAdLink = (url: string, adId?: number) => {
  if (!url) return
  
  console.log('点击广告链接:', url, '广告ID:', adId)
  
  // 如果有广告ID，则追踪点击
  if (adId) {
    try {
      // 异步追踪点击，不等待结果
      AdsApi.trackAdClick(adId).catch(error => {
        console.error('追踪广告点击失败:', error)
      })
    } catch (error) {
      console.error('追踪广告点击失败:', error)
    }
  }
  
  // 使用setTimeout确保事件处理完成后再打开链接
  setTimeout(() => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }, 50)
}

// 获取广告数据
const fetchAds = async () => {
  loading.value = true
  
  try {
    // 检查用户是否已登录
    const token = localStorage.getItem('token')
    if (!token) {
      loading.value = false
      return
    }

    const response = await AdsApi.getAdsByPlacement(props.placement)
    
    if (response?.data && Array.isArray(response.data)) {
      // 过滤掉已过期的广告
      const now = Date.now()
      ads.value = response.data.filter((ad: Ad) => {
        return ad.adsExpire * 1000 > now
      })
      
      // 确保在下一个 tick 更新标题
      if (ads.value.length > 0) {
        nextTick(updateTitle)
      }
    } else {
      ads.value = []
    }
  } catch (error) {
    console.error('获取广告失败:', error)
    ads.value = []
  } finally {
    loading.value = false
  }
}

// 暴露方法供父组件使用
defineExpose({
  getAdTitle,
  getCurrentAdTitle,
  updateTitle,
  ads
})

onMounted(fetchAds)
</script>

<style lang="scss" scoped>
@use '../assets/styles/components/adspace.scss';
</style> 