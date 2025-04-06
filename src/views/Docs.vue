<template>
  <div>
    <NLayout position="absolute">
      <NLayoutHeader>
        <DocsTopMenu />
      </NLayoutHeader>
      <DocsSubMenu :openDrawer="openDrawer" :title="currentTitle" />
      <NLayout has-sider position="absolute" style="top: 53px">
        <NLayoutSider v-if="!isMobile" bordered collapse-mode="width" :collapsed-width="64" :width="240"
          :collapsed="collapsed" :native-scrollbar="false" show-trigger @update:collapsed="collapsed = $event">
          <DocsLeftMenu />
        </NLayoutSider>
        <NLayout :native-scrollbar="false">
          <NLayoutContent :style="contentStyle">
            <div class="docs-content">
              <RouterView v-slot="{ Component }">
                <transition name="fade" mode="out-in" appear>
                  <component :is="Component" />
                </transition>
              </RouterView>
            </div>
          </NLayoutContent>
        </NLayout>
      </NLayout>
    </NLayout>

    <!-- 移动端侧边菜单抽屉 -->
    <NDrawer v-model:show="showDrawer" :width="240" placement="left">
      <NDrawerContent title="文档导航">
        <DocsLeftMenu @menu-click="showDrawer = false" />
      </NDrawerContent>
    </NDrawer>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { NLayout, NLayoutContent, NLayoutSider, NLayoutHeader, NDrawer, NDrawerContent } from 'naive-ui'
import DocsTopMenu from '../components/DocsTopMenu.vue'
import DocsLeftMenu from '../components/DocsLeftMenu.vue'
import DocsSubMenu from '../components/DocsSubMenu.vue'

const route = useRoute()
const collapsed = ref(false)
const isMobile = ref(window.innerWidth <= 768)
const showDrawer = ref(false)

const contentStyle = computed(() => ({
  padding: isMobile.value ? '16px' : '24px',
  paddingTop: isMobile.value ? '68px' : '24px'
}))

const currentTitle = computed(() => {
  return (route.meta.title as string) || '使用文档'
})

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
}

const openDrawer = () => {
  showDrawer.value = true
}

// 确保处理标题锚点
const ensureHeadingAnchors = () => {
  nextTick(() => {
    // 给所有标题添加锚点和ID
    const headings = document.querySelectorAll('.docs-content h1, .docs-content h2, .docs-content h3, .docs-content h4, .docs-content h5, .docs-content h6');
    
    headings.forEach((heading, index) => {
      // 检查标题是否已有ID
      if (!heading.id) {
        const headingText = heading.textContent || '';
        const headingId = headingText
          .toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .replace(/^(\d)/, 'h-$1');
        
        heading.id = headingId || `heading-${index}`;
      }
      
      // 检查锚点是否存在
      if (!heading.querySelector('.header-anchor')) {
        const anchor = document.createElement('a');
        anchor.href = `#${heading.id}`;
        anchor.className = 'header-anchor';
        anchor.textContent = '#';
        anchor.style.opacity = '0.2'; // 与CSS样式保持一致
        heading.insertBefore(anchor, heading.firstChild);
        console.log(`为标题 "${heading.textContent}" 添加了锚点`);
      }
    });
  });
};

// 监听路由变化
watch(() => route.path, () => {
  // 路由变化时处理锚点
  setTimeout(ensureHeadingAnchors, 500);
  
  // 如果URL中包含锚点，处理滚动定位
  nextTick(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          // 平滑滚动到目标元素
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 600); // 延迟执行，确保DOM已更新
    }
  });
});

onMounted(() => {
  window.addEventListener('resize', handleResize);
  // 初始化时处理锚点
  setTimeout(ensureHeadingAnchors, 500);
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss">
.docs-content {
  margin: 0 auto;
  padding: 0 20px;

  .docs-title-row {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  .docs-title {
    margin: 0 0 0 8px;
    font-size: 22px;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  pre {
    position: relative;
    border-radius: 8px;
    padding: 16px;
    margin: 16px 0;
    overflow-x: auto;
    background-color: #0d1117;

    &::after {
      content: attr(data-language);
      position: absolute;
      top: 0;
      right: 0;
      padding: 4px 8px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
      background-color: rgba(0, 0, 0, 0.3);
      border-bottom-left-radius: 5px;
    }

    code {
      font-family: 'Source Code Pro', Consolas, Monaco, 'Andale Mono', monospace;
      font-size: 14px;
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 16px 0;
    overflow-x: auto;
    display: block;

    th, td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid var(--border-color);
    }

    th {
      font-weight: 600;
    }
  }

  blockquote {
    margin: 16px 0;
    padding: 8px 16px;
    border-left: 4px solid var(--primary-color);
    background-color: var(--block-quote-color);
    color: var(--text-color-2);
  }

  a {
    color: var(--primary-color);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
  }

  h1 {
    font-size: 2em;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.3em;
  }

  h2 {
    font-size: 1.5em;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.3em;
  }

  h3 {
    font-size: 1.25em;
  }

  h4 {
    font-size: 1em;
  }

  p, li {
    line-height: 1.7;
    margin-bottom: 16px;
  }

  ul, ol {
    padding-left: 24px;
    margin-bottom: 16px;
  }
}

@media (max-width: 768px) {
  .n-layout-header + .n-layout {
    top: 112px !important;
  }
}
</style> 