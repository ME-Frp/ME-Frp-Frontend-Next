<template>
  <div class="cash">
    <div class="content-grid">
      <NCard title="增值服务">
        <NAlert type="warning" :closable="false" style="margin-bottom: 16px" title="购买前请注意">
          虚拟商品购买后不支持退款，请确认后再进行支付。若您在购买后恶意退款/投诉，我们将直接封禁帐户。 <br>
          目前我们只允许实名后的用户购买，请先完成实名认证。
        </NAlert>
        <NAlert type="success" :closable="false" style="margin-bottom: 16px" title="给赞助者的温馨提示"
          v-if="userGroup === 'sponsor'">
          您当前用户组可直接联系管理员获取更高权益，无需付费。
        </NAlert>
        <div class="service-cards">
          <!-- 流量包 -->
          <NCard class="service-card" title="流量包">
            <div class="price">
              ¥0.5 <span class="unit">/ GB</span>
            </div>
            <div class="features">
              <div class="feature-item">
                <NIcon>
                  <CheckmarkCircle />
                </NIcon>
                无限期有效
              </div>
              <div class="feature-item">
                <NIcon>
                  <CheckmarkCircle />
                </NIcon>
                无额外限速
              </div>
              <div class="feature-item">
                <NIcon>
                  <CheckmarkCircle />
                </NIcon>
                支持所有节点
              </div>
            </div>
            <!-- <NSelect v-model:value="trafficAmount" :options="trafficOptions" placeholder="选择购买数量" style="margin-bottom: 12px" :disabled="isNoRealname" /> -->
            <NSelect v-model:value="trafficAmount" :options="trafficOptions" placeholder="选择购买数量"
              style="margin-bottom: 12px" :disabled="userGroup === 'sponsor' || isNoRealname" />
            <!-- <NButton type="primary" block @click="handleBuyTraffic" :disabled="isNoRealname"> -->
            <NButton type="primary" block @click="handleBuyTraffic" :disabled="userGroup === 'sponsor' || isNoRealname">
              {{ userGroup === 'sponsor' ? '当前用户组无需购买' : isNoRealname ? '请先完成实名认证' : '立即购买' }}
            </NButton>
          </NCard>

          <!-- 额外隧道 -->
          <NCard class="service-card" title="额外隧道">
            <div class="price">
              ¥15.00 <span class="unit">/ 条</span>
            </div>
            <div class="features">
              <div class="feature-item">
                <NIcon>
                  <CheckmarkCircle />
                </NIcon>
                无限期有效
              </div>
              <div class="feature-item">
                <NIcon>
                  <CheckmarkCircle />
                </NIcon>
                支持所有节点 (节点性能限制除外)
              </div>
            </div>
            <!-- <NRadioGroup v-model:value="extraProxy" style="margin-bottom: 12px" :disabled="isNoRealname"> -->
            <NRadioGroup v-model:value="extraProxy" style="margin-bottom: 12px"
              :disabled="userGroup === 'sponsor' || isNoRealname">
              <NSpace>
                <NRadio v-for="option in extraProxyOptions" :key="option.value" :value="option.value">
                  {{ option.label }}
                </NRadio>
              </NSpace>
            </NRadioGroup>
            <!-- <NButton type="primary" block @click="handleBuyBandwidth" :disabled="isNoRealname"> -->
            <NButton type="primary" block @click="handleBuyBandwidth"
              :disabled="userGroup === 'sponsor' || isNoRealname">
              {{ userGroup === 'sponsor' ? '当前用户组无需购买' : isNoRealname ? '请先完成实名认证' : '立即购买' }}
            </NButton>
          </NCard>

          <!-- VIP 会员 -->
          <NCard class="service-card" title="VIP 会员" :disabled="true">
            <div class="price">
              ¥26.00 <span class="unit">/ 月</span>
            </div>
            <div class="features">
              <div class="feature-item">
                <NIcon>
                  <CheckmarkCircle />
                </NIcon>
                带宽提升至 55 Mbps (双向, 节点性能限制除外)
              </div>
              <div class="feature-item">
                <NIcon>
                  <CheckmarkCircle />
                </NIcon>
                隧道数量提升至 20 个
              </div>
              <div class="feature-item">
                <NIcon>
                  <CheckmarkCircle />
                </NIcon>
                每 30 天赠送 50 GB 流量
              </div>
              <div class="feature-item">
                <NIcon>
                  <CheckmarkCircle />
                </NIcon>
                签到额外获得最高 8 GB 流量
              </div>
            </div>
            <NSelect v-model:value="vipMonths" :options="monthOptions" placeholder="选择购买时长" style="margin-bottom: 12px"
              :disabled="isSponsorOrAdmin || isNoRealname" />
            <NButton type="primary" block @click="handleBuyVIP" :disabled="isSponsorOrAdmin || isNoRealname">
              {{ isSponsorOrAdmin ? '当前用户组无需购买' : isNoRealname ? '请先完成实名认证' : '立即购买' }}
            </NButton>
          </NCard>
        </div>
      </NCard>
    </div>

    <!-- 支付确认弹窗 -->
    <NModal v-model:show="showPayModal" preset="dialog" title="确认支付" style="width: 400px" :mask-closable="false">

      <NSpace vertical :size="8">
        <NAlert type="success" :closable="false" style="margin-bottom: 16px" title="温馨提示">
          由于当前支付接口尚未完善，需要人工处理支付，请您耐心等待。
        </NAlert>
        <NCard title="官方 QQ 群" class="contact-card">
          <NSpace vertical :size="8">
            <div class="contact-value">
              1019501085
            </div>
            <div class="contact-desc">
              <p>请添加 QQ 群联系管理购买</p>
            </div>
          </NSpace>
        </NCard>
        <NCard title="站长微信" class="contact-card">
          <NSpace vertical :size="8">
            <div class="contact-value">
              LxHTT_
            </div>
            <div class="contact-desc">
              <p>或添加站长微信购买</p>
            </div>
          </NSpace>
        </NCard>
      </NSpace>
      <!-- <div class="order-info">
        <div class="order-item">
          <span class="label">商品名称：</span>
          <span class="value">{{ currentOrder.name }}</span>
        </div>
        <div class="order-item">
          <span class="label">支付金额：</span>
          <span class="value price">¥{{ currentOrder.money.toFixed(2) }}</span>
        </div>
      </div>

      <NRadioGroup v-model:value="payMethod" style="margin-top: 10px;">
        <NSpace>
          <NRadioButton v-for="method in payMethods" :key="method.value" :value="method.value">
            {{ method.label }}
          </NRadioButton>
        </NSpace>
      </NRadioGroup>

      <template #action>
        <NButton @click="showPayModal = false">取消</NButton>
        <NButton type="primary" @click="confirmPay">确认支付</NButton>
      </template> -->
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { NCard, NButton, NSelect, NIcon, NRadioGroup, NRadio, NSpace, NRadioButton, NModal } from 'naive-ui'
import { ref, onUnmounted } from 'vue'
import { CheckmarkCircle } from '@vicons/ionicons5'
// import { useMessage } from 'naive-ui'
// import CashApi from '../../../shared/api/cash'
// import type { PayMethod } from '../../../types'

// const message = useMessage()
const trafficAmount = ref(10)
const extraProxy = ref(1)
const vipMonths = ref(1)

// 检查用户组
const userGroup = localStorage.getItem('group')
const isSponsorOrAdmin = userGroup === 'sponsor' || userGroup === 'admin'
const isNoRealname = userGroup === 'noRealname'

// 支付方式选择
// const payMethod = ref<PayMethod>('alipay')
// const payMethods = [
//   { label: '支付宝', value: 'alipay' },
//   { label: '微信支付', value: 'wxpay' },
//   { label: 'QQ钱包', value: 'qqpay' }
// ]

const trafficOptions = [
  { label: '10GB (¥ 5)', value: 10 },
  { label: '20GB (¥ 10)', value: 20 },
  { label: '50GB (¥ 25)', value: 50 },
  { label: '100GB (¥ 50)', value: 100 },
  { label: '200GB (¥ 100)', value: 200 }
]

const extraProxyOptions = [
  { label: '1 条 (¥ 15)', value: 1 },
  { label: '2 条 (¥ 30)', value: 2 },
  { label: '3 条 (¥ 45)', value: 3 },
  { label: '4 条 (¥ 60)', value: 4 },
  { label: '5 条 (¥ 75)', value: 5 },
]

const monthOptions = [
  { label: '月度 (¥ 26)', value: 1 },
  { label: '季度 (¥ 78)', value: 3 },
  { label: '半年 (¥ 156)', value: 6 },
  { label: '年度 (¥ 312)', value: 12 }
]

// 支付弹窗相关
const showPayModal = ref(false)
const currentOrder = ref<{
  type: 'traffic' | 'proxy' | 'vip'
  amount: number
  months?: number
  name: string
  money: number
} | null>(null)

// 计算订单名称和金额
const calculateOrderInfo = (type: 'traffic' | 'proxy' | 'vip', amount: number, months?: number) => {
  let name = ''
  let money = 0
  switch (type) {
    case 'traffic':
      name = `${amount}GB流量包`
      money = amount * 0.5
      break
    case 'proxy':
      name = `${amount}条额外隧道`
      money = amount * 15
      break
    case 'vip':
      name = `${months}个月VIP会员`
      money = months! * 26
      break
  }
  return { name, money }
}

// 打开支付弹窗
const openPayModal = (type: 'traffic' | 'proxy' | 'vip', amount: number, months?: number) => {
  const { name, money } = calculateOrderInfo(type, amount, months)
  currentOrder.value = { type, amount, months, name, money }
  showPayModal.value = true
}

// 确认支付
// const confirmPay = async () => {
//   if (!currentOrder.value) return

//   try {
//     const response = await CashApi.submitOrder({
//       type: currentOrder.value.type,
//       amount: currentOrder.value.amount,
//       months: currentOrder.value.months,
//       client_ip: window.location.hostname,
//       pay_method: payMethod.value,
//       notify_url: `${window.location.origin}/api/cash/notify`,
//       return_url: `${window.location.origin}/dashboard/more/cash/check`
//     })

//     if (response.data.code === 200) {
//       message.success('正在跳转到支付页面')
//       showPayModal.value = false
//       window.location.href = response.data.data.payUrl
//     } else {
//       message.error(response.data.message || '创建订单失败')
//     }
//   } catch (error: any) {
//     message.error(error.message || '创建订单失败')
//   }
// }

const handleBuyTraffic = () => {
  openPayModal('traffic', trafficAmount.value)
}

const handleBuyBandwidth = () => {
  openPayModal('proxy', extraProxy.value)
}

const handleBuyVIP = () => {
  openPayModal('vip', 1, vipMonths.value)
}

// 移除轮询相关代码
onUnmounted(() => {
  // 清理其他可能的副作用
})
</script>

<style lang="scss" scoped>
@use '../../../assets/styles/dashboard/cash.scss';
</style>