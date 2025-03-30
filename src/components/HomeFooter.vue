<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-left">
        <div class="footer-logos">
          <!-- <div class="footer-logo white-bg">
            <img src="https://resources.mefrp.com/d/ME-Frp/Local/Others/menetx.png" alt="幻缘网络" />
            <span>幻缘网络</span>
          </div> -->
          <div class="footer-logo">
            <img src="https://resources.mefrp.com/d/ME-Frp/Local/Others/logo.svg" alt="幻缘映射" />
            <div class="footer-logo-text">
              <span class="logo-title">幻缘映射 MagicEdge Frp</span>
              <span class="logo-subtitle">由 <a href="http://www.menetx.com" target="_blank">幻缘网络</a> 与 <a href="http://www.blbilink.com" target="_blank">阜阳市波比网络科技有限公司</a> 运营</span>
            </div>
          </div>
        </div>
        <p>Copyright © ME Frp 项目组 2021-2025.</p>
        <p><a href="https://内网穿透.中国/">内网穿透联盟统一识别编码: AZWB66WB</a></p>
        <!-- <p><a href="https://beian.miit.gov.cn"></a></p> -->
      </div>
      <div class="footer-right">
          <RouterLink to="/privacy">
            <NButton text>隐私政策</NButton>
          </RouterLink>
          <RouterLink to="/content">
            <NButton text>内容策略</NButton>
          </RouterLink>
          <RouterLink to="/terms">
            <NButton text>服务条款</NButton>
          </RouterLink>
          <RouterLink to="/contact">
            <NButton text>联系我们</NButton>
          </RouterLink>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { NButton } from 'naive-ui'
</script>

<style lang="scss" scoped>
@use '../assets/styles/components/homeFooter.scss';
</style>
