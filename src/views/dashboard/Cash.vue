<template>
  <div class="cash">
    <div class="content-grid">
      <NCard title="增值服务">
        <div class="service-cards">
          <!-- 流量包 -->
          <NCard class="service-card" title="流量包">
            <div class="price">
              ¥0.5 <span class="unit">/ GB</span>
            </div>
            <div class="features">
              <div class="feature-item">
                <NIcon><CheckmarkCircle /></NIcon>
                无限期有效
              </div>
              <div class="feature-item">
                <NIcon><CheckmarkCircle /></NIcon>
                无额外限速
              </div>
              <div class="feature-item">
                <NIcon><CheckmarkCircle /></NIcon>
                支持所有节点
              </div>
            </div>
            <NSelect
              v-model:value="trafficAmount"
              :options="trafficOptions"
              placeholder="选择购买数量"
              style="margin-bottom: 12px"
            />
            <NButton type="primary" block @click="handleBuyTraffic">
              立即购买
            </NButton>
          </NCard>

          <!-- 额外隧道 -->
          <NCard class="service-card" title="额外隧道">
            <div class="price">
              ¥16.00 <span class="unit">/ 条</span>
            </div>
            <div class="features">
              <div class="feature-item">
                <NIcon><CheckmarkCircle /></NIcon>
                有效期 30 天
              </div>
              <div class="feature-item">
                <NIcon><CheckmarkCircle /></NIcon>
                可通过续费延期
              </div>
              <div class="feature-item">
                <NIcon><CheckmarkCircle /></NIcon>
                支持所有节点 (节点性能限制除外)
              </div>
            </div>
            <NRadioGroup
              v-model:value="extraProxy"
              style="margin-bottom: 12px"
            >
              <NSpace>
                <NRadio v-for="option in extraProxyOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </NRadio>
              </NSpace>
            </NRadioGroup>
            <NButton type="primary" block @click="handleBuyBandwidth">
              立即购买
            </NButton>
          </NCard>

          <!-- VIP 会员 -->
          <NCard class="service-card" title="VIP 会员">
            <div class="price">
              ¥25.00 <span class="unit">/ 月</span>
            </div>
            <div class="features">
              <div class="feature-item">
                <NIcon><CheckmarkCircle/></NIcon>
                带宽提升至 55 Mbps (双向, 节点性能限制除外)
              </div>
              <div class="feature-item">
                <NIcon><CheckmarkCircle/></NIcon>
                隧道数量提升至 20 个
              </div>
              <div class="feature-item">
                <NIcon><CheckmarkCircle/></NIcon>
                每 30 天赠送 50 GB 流量
              </div>
              <div class="feature-item">
                <NIcon><CheckmarkCircle/></NIcon>
                签到额外获得最高 5 GB 流量
              </div>
            </div>
            <NSelect
              v-model:value="vipMonths"
              :options="monthOptions"
              placeholder="选择购买时长"
              style="margin-bottom: 12px"
            />
            <NButton type="primary" block @click="handleBuyVIP">
              立即购买
            </NButton>
          </NCard>
        </div>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NButton, NSelect, NIcon, NRadioGroup, NRadio, NSpace } from 'naive-ui'
import { ref } from 'vue'
import { CheckmarkCircle } from '@vicons/ionicons5'
import { useMessage } from 'naive-ui'

const message = useMessage()
const trafficAmount = ref(10)
const extraProxy = ref(1)
const vipMonths = ref(1)

const trafficOptions = [
  { label: '10GB (¥ 5)', value: 10 },
  { label: '20GB (¥ 10)', value: 20 },
  { label: '50GB (¥ 25)', value: 50 },
  { label: '100GB (¥ 50)', value: 100 },
  { label: '200GB (¥ 100)', value: 200 }
]

const extraProxyOptions = [
  { label: '1 条 (¥ 16)', value: 1 },
  { label: '2 条 (¥ 32)', value: 2 },
  { label: '3 条 (¥ 48)', value: 3 },
  { label: '4 条 (¥ 64)', value: 4 },
  { label: '5 条 (¥ 80)', value: 5 },
]

const monthOptions = [
  { label: '月度 (¥ 26)', value: 1 },
  { label: '季度 (¥ 78)', value: 3 },
  { label: '半年 (¥ 156)', value: 6 },
  { label: '年度 (¥ 312)', value: 12 }
]

const handleBuyTraffic = () => {
  message.info(`正在创建订单：${trafficAmount.value}GB 流量包`)
  // TODO: 实现购买逻辑
}

const handleBuyBandwidth = () => {
  message.info(`正在创建订单：${extraProxy.value} 个月带宽提升服务`)
  // TODO: 实现购买逻辑
}

const handleBuyVIP = () => {
  message.info(`正在创建订单：${vipMonths.value} 个月 VIP 会员`)
  // TODO: 实现购买逻辑
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/cash.scss';
</style>