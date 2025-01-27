<template>
  <div class="about">
    <NCard title="关于 ME Frp 5.0" class="single-card">
      <NSpace vertical :size="24">
        <NDescriptions label-placement="left" bordered :column="1">
          <NDescriptionsItem label="面板版本">
            v5.0.0
          </NDescriptionsItem>
          <NDescriptionsItem label="开发者">
            <div class="user-info">
              <NAvatar round size="small" src="https://www.lxhtt.cn/img/avatar.webp" />
              <span>落雪无痕LxHTT</span>
            </div>
          </NDescriptionsItem>
          <NDescriptionsItem label="技术栈">
            <NSpace>
              <NTag type="success" style="cursor: pointer" @click="openUrl('https://vuejs.org')">
                Vue 3
              </NTag>
              <NTag type="info" style="cursor: pointer" @click="openUrl('https://www.typescriptlang.org')">
                TypeScript
              </NTag>
              <NTag type="warning" style="cursor: pointer" @click="openUrl('https://www.naiveui.com')">
                Naive UI
              </NTag>
              <NTag type="error" style="cursor: pointer" @click="openUrl('https://vitejs.dev')">
                Vite
              </NTag>
            </NSpace>
          </NDescriptionsItem>
        </NDescriptions>
        <div>
          <span>
            ME Frp 5.0 除 <strong>设计框架/程序框架及 <a href="https://github.com/fatedier/frp">Frp 项目原有代码</a></strong> 以外,
            其他所有组件均为自主研发, 受《中华人民共和国著作权法》保护。
          </span><br>
          <span>
            中国内网穿透联盟致力于聚集各个行业同僚，可在 <a href="https://xn--v6qw21h0gd43u.xn--fiqs8s">内网穿透.中国</a> 了解更多信息。
          </span><br>
          <span>
            如需了解我们的相关规定，请访问相应链接: <RouterLink to="/terms">服务条款</RouterLink>&nbsp;
            <RouterLink to="/privacy">隐私政策</RouterLink>&nbsp;
            <RouterLink to="/content">内容策略</RouterLink>
          </span>
        </div>
      </NSpace>
    </NCard>
    <NCard title="联系方式" class="single-card">
      <NSpace vertical :size="10">
        <NCard title="官方 QQ 群聊">
          <NSpace align="center">
            <NTag type="success" size="small">推荐</NTag>
            <a href="https://qm.qq.com/q/9iibikyupG">1019501085</a>
          </NSpace>
        </NCard>
        <NCard title="官方用户支持邮箱">
          <NSpace align="center">
            <NTag type="warning" size="small">慢速</NTag>
            <a href="mailto:support@mefrp.com">support@mefrp.com</a>
          </NSpace>
        </NCard>
      </NSpace>
    </NCard>
    <NCard title="关于我们" class="single-card">
      <NSpace vertical :size="24">
        <NDescriptions label-placement="left" bordered :column="1">
          <NDescriptionsItem label="管理团队">
            <div class="user-info">
              <NAvatar round size="small" src="https://images.lxhtt.cn/i/2025/01/27/6797612080123.webp" />
              <span>Aehxy</span>
            </div>
            <div class="user-info">
              <NAvatar round size="small" src="https://www.lxhtt.cn/img/avatar.webp" />
              <span>落雪无痕LxHTT</span>
            </div>
            <div class="user-info">
              <NAvatar round size="small" src="https://images.lxhtt.cn/i/2025/01/27/679761211b280.webp" />
              <span>PH</span>
            </div>
            <div class="user-info">
              <NAvatar round size="small" src="https://images.lxhtt.cn/i/2025/01/27/6797612191ee7.webp" />
              <span>余生长醉</span>
            </div>
          </NDescriptionsItem>
          <NDescriptionsItem label="运营商">
            <span>阜阳市波比网络科技有限公司</span>
          </NDescriptionsItem>
          <NDescriptionsItem label="CFU 识别编码">
            <span>AZWB66WB</span>
          </NDescriptionsItem>
        </NDescriptions>
        <div>
          <span>
            如果您有捐赠节点的意向, 可联系 <a href="mailto:support@mefrp.com">support@mefrp.com</a>, 或加入 QQ 群 <a
              href="https://qm.qq.com/q/9iibikyupG">1019501085</a> 进行咨询。
          </span><br>
          <span>
            中国内网穿透联盟致力于聚集各个行业同僚，可在 <a href="https://xn--v6qw21h0gd43u.xn--fiqs8s">内网穿透.中国</a> 了解更多信息。
          </span>
        </div>
      </NSpace>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NSpace, NDescriptions, NDescriptionsItem, NTag, NAvatar } from 'naive-ui'

const openUrl = (url: string) => {
  window.open(url, '_blank')
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/about.scss';
</style>