<template>
  <div class="contact-page">
    <div class="contact-container">
      <n-card title="联系我们">
        <div class="contact-intro">
          <p>如有任何问题或建议，欢迎通过以下方式与我们联系。我们会尽快回复您的询问。</p>
        </div>

        <n-divider />

        <h3 class="section-title">联系方式</h3>
        <div class="contact-cards">
          <n-card title="官方 QQ 群" class="contact-card">
            <n-space vertical :size="8">
              <div class="contact-label">
                <n-tag :bordered="false" type="success" size="small">推荐</n-tag :bordered="false">
                <span>快速响应</span>
              </div>
              <div class="contact-value">
                <a href="https://qm.qq.com/q/9iibikyupG" target="_blank">1019501085</a>
              </div>
              <div class="contact-desc">
                <p>加入我们的用户交流群，获取实时帮助</p>
              </div>
            </n-space>
          </n-card>

          <n-card title="用户支持邮箱" class="contact-card">
            <n-space vertical :size="8">
              <div class="contact-label">
                <n-tag :bordered="false" type="warning" size="small">慢速</n-tag :bordered="false">
                <span>24-48 小时回复</span>
              </div>
              <div class="contact-value">
                <a href="mailto:support@mefrp.com">support@mefrp.com</a>
              </div>
              <div class="contact-desc">
                <p>适合需要详细描述的问题和建议</p>
              </div>
            </n-space>
          </n-card>
        </div>

        <div class="contact-cards">
          <n-card title="企业微信群（用微信加入）" class="contact-card">
            <n-space vertical :size="8">
              <div class="contact-label">
                <n-tag :bordered="false" type="success" size="small">推荐</n-tag :bordered="false">
                <span>快速响应</span>
              </div>
              <div class="contact-value">
                <img src="https://resources.mefrp.com/d/ME-Frp/Local/Others/wxwork.jpg" alt="企业微信群"
                  style="max-width: 90%;">
              </div>
              <div class="contact-desc">
                <p>加入我们的用户交流群，获取实时帮助</p>
                <div class="contact-value">
                  可尝试使用链接：<a
                    href="https://work.weixin.qq.com/apph5/external_room/join/group_mng?plg_id=dcff145c51cfbbb3dd38bbff87c9fa99&"
                    target="_blank">点击此处</a>
                </div>
              </div>
            </n-space>
          </n-card>
        </div>

        <div class="contact-note">
          <p>我们的工作人员会尽快回复您的问题。如需技术支持，请提供详细的问题描述和系统环境信息，以便我们更好地为您提供帮助。</p>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NTag, NSpace, NDivider } from 'naive-ui'
</script>

<style lang="scss" scoped>
.contact-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  /* 确保内容区域足够高，让footer保持在底部 */
  min-height: calc(100vh - 260px);
  display: flex;
  flex-direction: column;
}

.contact-container {
  margin-bottom: 40px;
  flex-grow: 1;
}

.contact-intro {
  margin-bottom: 20px;

  p {
    font-size: 16px;
    line-height: 1.6;
    color: var(--n-text-color-2);
  }
}

.section-title {
  margin: 10px 0 20px;
  font-size: 18px;
  font-weight: 500;
  color: var(--n-text-color);
}

.contact-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.contact-card {
  flex: 1;
  transition: transform 0.3s, box-shadow 0.3s;
}

.contact-label {
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    font-size: 14px;
    color: var(--n-text-color-2);
  }
}

.contact-value {
  font-size: 16px;
  font-weight: 500;

  a {
    color: var(--n-primary-color);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.contact-desc {
  margin-top: 5px;

  p {
    font-size: 14px;
    color: var(--n-text-color-3);
    margin: 0;
  }
}

.contact-note {
  margin-top: 20px;
  padding: 15px;
  background-color: var(--n-color-hover);

  p {
    margin: 0;
    font-size: 14px;
    color: var(--n-text-color-2);
  }
}
</style>
