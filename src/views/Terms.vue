<template>
  <div class="policies-container">
    <NCard>
      <div class="markdown-content" v-html="renderedContent">
      </div>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { marked } from 'marked'
import { NCard } from 'naive-ui'

const markdownContent = `
# ME Frp (幻缘映射) 服务条款


**注：** 本服务条款最终解释权归 [幻缘网络](https://www.menetx.com) 与 [阜阳市波比网络科技有限公司](http://www.blbilink.com/) 所有。上次更新时间: 2025-05-10

## 1. 服务概述

ME Frp 是一个提供基于 Frp (Fast Reverse Proxy) 的内网穿透服务的平台。本平台将向用户提供可用于内网穿透的服务器 (下称节点) 使用权以及由本平台开发的启动器、由本平台修改并重新发布的 Frp 客户端。

## 2. 使用须知

### 2.1 用户义务

- **遵守法律法规**：用户必须确保其使用平台服务的行为符合相关法律法规。任何侵犯他人合法权益或违反法律法规的行为, 用户需自行承担法律责任。
- **内容策略遵循**：用户必须遵守平台的[内容策略](/content), 不得发布或传播不符合规定的内容。平台有权定期检查并处理违规内容。
- **个人隐私保护**：平台尊重并保护用户的个人隐私, 但用户也应妥善保管个人信息和账户安全, 避免因自身疏忽导致的损失。
- **未成年人使用**：未成年人在使用平台服务前, 必须取得家长或法定监护人的同意, 并在监护下使用。未成年人购买服务时，监护人应当对购买行为进行确认和监督。

### 2.2 退款政策

- **虚拟商品性质**：本平台提供的所有服务（包括但不限于流量包、额外隧道、VIP会员等）均为虚拟商品，一经购买即视为已交付使用。
- **不支持退款**：由于虚拟商品的特殊性质，所有已购买的服务均不支持退款。用户在购买前应当仔细阅读服务说明，确认需求后再进行购买。
- **特殊情况处理**：如遇不可抗力或平台原因导致服务无法使用，平台将根据实际情况提供相应的补偿方案。

### 2.3 平台责任限制

- **不参与纠纷解决**：对于因用户行为引发的任何纠纷, 平台及其所有者不承担任何责任。用户之间的纠纷应由双方依据法律自行解决。
- **免责条款**：平台对因不可抗力、技术故障 (如黑客攻击、网络故障等) 或其他不可预见的情况导致的服务中断或损失不承担责任。此外, 用户因未按平台说明操作或滥用服务造成的损失, 平台也不承担责任。

## 3. 滥用行为的界定与处罚

### 3.1 滥用行为定义

详见[内容策略](/content)。

### 3.2 处罚措施

一旦被判定为滥用, 平台有权永久封禁账户, 并保留追究法律责任的权利。

## 4. 服务变更、中断或终止

### 4.1 服务调整

平台有权随时调整服务内容, 且无需另行通知用户。对于重大服务变更, 平台将提前至少 1 天通过公告或邮件通知用户。

### 4.2 终止条件

如发生下列任何一种情形, 平台有权随时中断或终止向用户提供服务 (包括收费服务) 而无需对用户或任何第三方承担任何责任：
- 用户被判定为滥用本平台服务
- 随意违反有关声明的规定
- 使用本平台服务穿透[内容策略](/content)所禁止的内容
- 倒卖、出售本平台账户, 恶意爆破服务器节点
- 其他本平台认定需要终止向用户提供服务的情形

### 4.3 数据处理

用户账户被终止后, 平台将在 7 天内备份用户数据, 并在 14 天后删除所有用户数据。用户可以在此期间申请数据导出。

## 5. 免责声明

### 5.1 定期维护

平台需定期或不定期对平台本身或各个节点进行升级、维护, 平台将尽可能事先于首页公告处通知用户, 但因此类情况造成用户服务受到影响, 平台无需为此承担任何责任。

### 5.2 不可抗力

在本协议期限内由不可抗力因素 (即不可预见或虽可预见但其发生或后果不可控制、避免, 非任何一方所能控制且使任何一方无法完全履行本协议的事件) 造成的任何形式的损失, 平台将不承担任何责任。

### 5.3 影响互联网正常运行之情形

鉴于互联网之特殊性质, 不可抗力亦包括下列影响互联网正常运行之情形：
- 黑客攻击
- 电信部门技术调整导致之重大影响
- 因政府管制而造成之暂时关闭
- 病毒侵袭
- 网络故障、域名解析故障或其他网络设备或技术提供商的服务延迟、服务障碍或任何其他类似事件

## 6. 用户行为造成的损失

用户进行下列行为造成的任何形式损失, 平台不承担任何责任:
- 用户私下进行帐号交易、二次销售服务等行为
- 在使用本平台时未按照文档及平台说明进行操作
- 使用本平台服务时未设置妥善的安全策略而造成的各类损失

## 7. 知识产权声明

### 7.1 版权归属

除开源组件外, ME Frp 平台提供的所有软件和服务的知识产权归 ME Frp 所有。未经平台书面许可, 用户不得修改这些资源。

### 7.2 用户内容许可

用户在平台上发布的内容, 用户授予平台非独占的、全球性的、免版税的许可, 以便平台可以在必要范围内使用、复制、分发和展示这些内容。用户保留对其内容的所有权利。

## 8. 争议解决

### 8.1 适用法律

本服务条款受中国大陆法律管辖, 并根据该法律解释。

### 8.2 争议解决机制

如用户与平台之间发生争议, 双方应首先尝试通过友好协商解决。如果协商不成, 任何一方均有权将争议提交至相关机关/部门进行仲裁或诉讼。

## 9. 联系方式

若用户有任何疑问或需要帮助, 请通过 <support@mefrp.com> 联系管理员进行处理。
`

const renderedContent = ref('')
onMounted(async () => {
  renderedContent.value = await marked(markdownContent)
})
</script>

<style lang="scss" scoped>
@use '../assets/styles/policies.scss';
</style> 