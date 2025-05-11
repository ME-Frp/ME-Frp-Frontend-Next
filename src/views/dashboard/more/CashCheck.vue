<template>
  <div class="cash-check">
    <div class="content-grid">
      <NCard title="支付结果">
        <div class="check-content">
          <div v-if="loading" class="loading">
            <NSpin size="large" />
            <div class="loading-text">正在检查支付状态...</div>
          </div>
          <div v-else-if="error" class="error">
            <NIcon size="48" class="error-icon">
              <CloseCircle />
            </NIcon>
            <div class="error-text">{{ error }}</div>
            <NButton type="primary" @click="goBack">返回</NButton>
          </div>
          <div v-else class="success">
            <NIcon size="48" class="success-icon">
              <CheckmarkCircle />
            </NIcon>
            <div class="success-text">支付成功，稍后生效</div>
            <NTable :single-line="false" class="order-info">
              <tbody>
                <tr>
                  <td class="label">订单号</td>
                  <td class="value">{{ orderInfo.orderId }}</td>
                </tr>
                <tr>
                  <td class="label">支付方式</td>
                  <td class="value">{{ getPayMethodName(orderInfo.payType) }}</td>
                </tr>
                <tr>
                  <td class="label">支付金额</td>
                  <td class="value">¥{{ orderInfo.money }}</td>
                </tr>
                <tr>
                  <td class="label">支付时间</td>
                  <td class="value">{{ orderInfo.payTime }}</td>
                </tr>
              </tbody>
            </NTable>
            <NButton type="primary" @click="goBack">返回</NButton>
          </div>
        </div>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NButton, NIcon, NSpin, NTable } from 'naive-ui'
import { CheckmarkCircle, CloseCircle } from '@vicons/ionicons5'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CashApi from '../../../shared/api/cash'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const error = ref('')
const orderInfo = ref<{
  orderId: string
  payType: string
  money: string
  payTime: string
  payItem: string
} | null>(null)

// 获取支付方式名称
const getPayMethodName = (type: string) => {
  const types: Record<string, string> = {
    alipay: '支付宝',
    wxpay: '微信支付',
    qqpay: 'QQ钱包'
  }
  return types[type] || type
}

// 返回上一页
const goBack = () => {
  router.push('/dashboard/more/cash')
}

// 检查支付状态
const checkPayStatus = async () => {
  try {
    // 从 URL 参数中获取订单号
    const orderId = route.query.out_trade_no as string
    if (!orderId) {
      error.value = '订单号不存在'
      loading.value = false
      return
    }

    // 调用后端查询接口
    const response = await CashApi.queryOrder(orderId)
    if (response.data.code !== 200) {
      error.value = response.data.message || '查询订单失败'
      loading.value = false
      return
    }

    const data = response.data.data
    if (data.status !== 1) {
      error.value = '支付未完成'
      loading.value = false
      return
    }

    // 保存订单信息
    orderInfo.value = {
      orderId: data.orderId,
      payType: data.payType,
      money: data.money,
      payTime: data.payTime,
      payItem: data.payItem
    }

  } catch (err: any) {
    error.value = err.message || '处理支付结果失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  checkPayStatus()
})
</script>

<style lang="scss" scoped>
.cash-check {
  .content-grid {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .check-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0;
  }

  .loading {
    text-align: center;

    .loading-text {
      margin-top: 16px;
    }
  }

  .error {
    text-align: center;

    .error-icon {
      color: #f56c6c;
    }

    .error-text {
      margin: 16px 0;
      color: #f56c6c;
    }
  }

  .success {
    text-align: center;

    .success-icon {
      color: #67c23a;
    }

    .success-text {
      margin: 16px 0;
      color: #67c23a;
      font-size: 20px;
      font-weight: bold;
    }

    .order-info {
      margin: 24px 0;
      width: 100%;
      max-width: 500px;

      :deep(.n-table) {
        background: #f5f7fa;
        border-radius: 4px;
      }

      :deep(td) {
        padding: 12px 16px;
      }

      .label {
        width: 100px;
      }

      .value {
        font-weight: 500;
      }
    }
  }
}
</style>
