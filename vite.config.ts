import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,webp}'],
        runtimeCaching: [{
          urlPattern: ({ url }) => 
            url.hostname === 'resources.mefrp.com'
            && !url.pathname.startsWith('/api'),
          handler: 'CacheFirst',
          options: {
            cacheName: 'mefrp-resources',
            expiration: {
              maxEntries: 256,
            },
          },
        }],
      },
      manifest: {
        id: 'com.mefrp.v5',
        name: 'ME Frp',
        short_name: 'ME Frp',
        description: 'ME Frp 幻缘映射 - 提供免费内网穿透、端口映射服务，支持 Minecraft、泰拉瑞亚联机，远程桌面，开发调试，建站等。高速稳定，半公益性质。',
        theme_color: '#42A5F5',
        background_color: '#101014',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
          },
        ],
        screenshots: [{
          src: '/pwa/fullscreen-wide.png',
          sizes: '2726x1544',
          form_factor: 'wide',
          label: 'Application Fullscreen (Wide)',
          type: 'image/png',
        }, {
          src: '/pwa/fullscreen-narrow.png',
          sizes: '747x1331',
          form_factor: 'narrow',
          label: 'Application Fullscreen (Narrow)',
          type: 'image/png',
        }]
      },
      includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.xml', 'docs/**/*'],
      devOptions: {
        enabled: false,
        type: 'module',
        navigateFallback: 'index.html',
      },
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar',
            'useThemeVars',
            'darkTheme',
            'lightTheme',
            'createDiscreteApi',
            'useOsTheme'
          ]
        }
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/composables', 'src/stores'],
      vueTemplate: true
    }),
    Components({
      resolvers: [NaiveUiResolver()],
      dts: 'src/components.d.ts',
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true
    })
  ],
  build: {
    // 确保构建时 docs 目录的 Markdown 文件被复制到输出目录
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  publicDir: 'public',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  // 将 docs 目录中的 Markdown 文件复制到公共目录
  assetsInclude: ['**/*.md']
})