<template>
  <div class="profile">
    <NCard title="个人中心" class="info-card">
      <UserInfoGrid />
    </NCard>
    <NCard title="流量历史记录" class="traffic-card">
      <div v-if="trafficLoading" class="loading-container">
        <NSpin size="large" />
      </div>
      <div v-else-if="trafficError" class="error-container">
        <NResult status="error" title="获取流量数据失败" :description="trafficError">
          <template #footer>
            <NButton @click="loadTrafficStats">重试</NButton>
          </template>
        </NResult>
      </div>
      <div v-else-if="!trafficStats || !trafficStats.dates || trafficStats.dates.length === 0" class="empty-container">
        <NEmpty description="暂无流量数据" />
      </div>
      <div v-else>
        <!-- <div class="traffic-summary">
          <div class="summary-item">
            <div class="summary-label">今日总流量</div>
            <div class="summary-value">{{ formatBytes(todayTotalTraffic) }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">今日入站</div>
            <div class="summary-value">{{ formatBytes(todayTrafficIn) }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">今日出站</div>
            <div class="summary-value">{{ formatBytes(todayTrafficOut) }}</div>
          </div>
        </div> -->
        <div class="traffic-tip">
          <NText depth="3" style="font-size: 13px;">
            提示: 流量每日 0 点结算, 请以实际为准
          </NText>
        </div>
        <div ref="trafficChartRef" class="traffic-chart"></div>
      </div>
    </NCard>
    <NCard title="域名白名单" class="security-card">
      <div class="security-item">
        <div class="security-desc" style="user-select: none">
          这里是用于 "中国大陆(不含港澳台)" 节点创建 HTTP/HTTPS 隧道的域名白名单。<br>
          您的域名需要拥有工业和信息化部的备案记录才可添加。非中国大陆节点建站, 域名无需过白。<br>
          在填写时, 请直接填写根域名, 例如: mefrp.com, 不要填写 www.mefrp.com 等子域名。<br>
          <strong>注意: ME Frp 不提供任何的域名备案服务, 请自行根据服务商要求备案。</strong>
        </div>
        <NSpace vertical>
          <NButton secondary @click="showAddDomainModal" style="margin-bottom: 12px">
            <template #icon>
              <NIcon>
                <AddOutline />
              </NIcon>
            </template>
            添加域名
          </NButton>
          <NSpace vertical v-if="icpDomains.length">
            <NCard v-for="domain in icpDomains" :key="domain.domain" size="small" class="domainCard">
              <NSpace justify="space-between" align="center" style="width: 100%; margin: 8px;">
                <NSpace vertical size="small">
                  <NText strong>{{ domain.domain }}</NText>
                  <NSpace size="small">
                    <NTag :bordered="false" size="small" type="success">{{ domain.icpId }}</NTag>
                    <NTag :bordered="false" size="small" type="info">
                      {{ domain.unitName }} - {{ domain.natureName }}
                    </NTag>
                  </NSpace>
                </NSpace>
                <NPopconfirm @positive-click="handleDeleteDomain(domain.domain)" positive-text="确定" negative-text="取消">
                  <template #trigger>
                    <NButton size="medium" type="error" secondary style="margin-right: 12px">
                      <template #icon>
                        <NIcon>
                          <TrashOutline />
                        </NIcon>
                      </template>
                      删除
                    </NButton>
                  </template>
                  确定要删除域名 {{ domain.domain }} 吗？
                </NPopconfirm>
              </NSpace>
            </NCard>
          </NSpace>
          <NEmpty v-else description="暂无已添加的域名" />
        </NSpace>
      </div>
    </NCard>
    <NCard title="账户与安全" class="security-card">
      <div class="security-item" style="user-select: none">
        <div class="security-label">
          <span>实名认证</span>
        </div>
        <div class="security-desc">
          实名认证后可获得更多权限, 包括更高的带宽限制和更多的节点使用权限。<br>
          注意：实名认证信息将会使用 RSA 加密存储, 一旦认证成功, 将被安全存储。<br>
          如果此处显示的状态与上方不一致, 请立刻<a href="mailto:support@mefrp.com">联系管理员</a>。
        </div>
        <div class="security-value">
          <NSpace align="center">
            <NTag :bordered="false" :type="realnameTime ? 'success' : 'warning'">
              {{ realnameTime ? `已实名认证 (${formatTime(realnameTime)})` : '未实名认证' }}
            </NTag>
            <NButton v-if="!realnameTime" type="primary" secondary @click="showRealnameModal">
              立即认证
            </NButton>
          </NSpace>
        </div>
      </div>
      <NDivider />
      <div class="security-item" style="user-select: none">
        <div class="security-label">
          <span>账户密码</span>
        </div>
        <div class="security-desc">
          账户密码用于登录, 请妥善保管, 一经泄露请及时重置。注意, 更改密码后, 访问密钥也会同时更改。
          <br>如果你忘记了旧密码, 请点击 "找回密码"; 否则请点击 "更改密码"。
        </div>
        <div class="security-value">
          <NSpace>
            <NButton size="medium" type="warning" secondary class="action-btn" @click="showPasswordResetModal">
              <template #icon>
                <NIcon>
                  <KeyOutline />
                </NIcon>
              </template>
              更改密码
            </NButton>
            <NButton size="medium" type="error" secondary class="action-btn" @click="showForgotPasswordModal">
              <template #icon>
                <NIcon>
                  <KeyOutline />
                </NIcon>
              </template>
              找回密码
            </NButton>
          </NSpace>
        </div>
      </div>
      <NDivider />
      <div class="security-item" style="user-select: none">
        <div class="security-label">
          <span>访问密钥</span>
        </div>
        <div class="security-desc">
          访问密钥用于验证您的身份, 请妥善保管, 一经泄露请及时重置。
        </div>
        <div class="security-value">
          <div class="button-group">
            <NButton size="medium" type="warning" secondary class="action-btn" @click="showTokenResetConfirm">
              <template #icon>
                <NIcon>
                  <RefreshOutline />
                </NIcon>
              </template>
              重置访问密钥
            </NButton>
            <NButton size="medium" secondary class="action-btn" @click="copyToken">
              <template #icon>
                <NIcon>
                  <CopyOutline />
                </NIcon>
              </template>
              复制访问密钥
            </NButton>
          </div>
        </div>
      </div>
    </NCard>

    <NModal v-model:show="showTokenResetModal" preset="dialog" type="warning" title="重置访问密钥" positive-text="确认"
      negative-text="取消" @positive-click="handleTokenReset" @negative-click="closeModal">
      <div>重置后原有密钥将失效, 请及时更新配置。是否继续？</div>
    </NModal>
    <NModal v-model:show="showPasswordModal" preset="dialog" title="重置密码" style="width: 400px">
      <NForm ref="formRef" :model="passwordForm" :rules="rules">
        <NFormItem label="原密码" path="oldPassword">
          <NInput v-model:value="passwordForm.oldPassword" type="password" placeholder="请输入原密码"
            show-password-on="click" />
        </NFormItem>
        <NFormItem label="新密码" path="newPassword">
          <NInput v-model:value="passwordForm.newPassword" type="password" placeholder="请输入新密码"
            show-password-on="click" />
        </NFormItem>
        <NFormItem label="确认密码" path="confirmPassword">
          <NInput v-model:value="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码"
            show-password-on="click" />
        </NFormItem>
      </NForm>
      <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px">
        <NButton @click="closePasswordModal">取消</NButton>
        <NButton type="primary" :loading="loading" @click="handlePasswordReset">确认</NButton>
      </div>
    </NModal>

    <NModal v-model:show="showForgotModal" preset="dialog" title="找回密码" style="width: 400px">
      <NSpace vertical>
        <NAlert type="warning">
          如果您还记得旧密码, 请使用更改密码功能。
        </NAlert>
        <NAlert type="info">
          您将退出登录并重定向到找回账户页面。
        </NAlert>
      </NSpace>

      <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px">
        <NButton @click="closeForgotPasswordModal">取消</NButton>
        <NButton type="primary" :loading="loading" @click="logoutAndResetPassword">确认</NButton>
      </div>
    </NModal>
    <NModal v-model:show="showDomainModal" preset="card" title="添加域名" style="width: 400px">
      <NForm ref="domainFormRef" :model="domainForm">
        <NFormItem label="域名" path="domain">
          <NInput v-model:value="domainForm.domain" placeholder="请输入需要添加的域名" />
        </NFormItem>
      </NForm>
      <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px">
        <NButton @click="closeDomainModal">取消</NButton>
        <NButton type="primary" :loading="domainLoading" @click="handleAddDomain">确认</NButton>
      </div>
    </NModal>
    <NModal v-model:show="showRealnameForm" preset="card" title="实名认证" style="width: 400px" :maskClosable="false">
      <NForm ref="realnameFormRef" :model="realnameForm" :rules="realnameRules">
        <NFormItem label="真实姓名" path="realname">
          <NInput v-model:value="realnameForm.realname" placeholder="请输入真实姓名" maxlength="20" />
        </NFormItem>
        <NFormItem label="身份证号" path="idCard">
          <NInput v-model:value="realnameForm.idCard" placeholder="请输入18位身份证号" maxlength="18" />
        </NFormItem>
        <div class="form-tips">
          提示：请确保填写的信息真实有效, 实名认证通过后将无法修改。
        </div>
      </NForm>
      <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px">
        <NButton @click="closeRealnameModal">取消</NButton>
        <NButton type="primary" :loading="realnameLoading" @click="handleRealnameSubmit">
          提交认证
        </NButton>
      </div>
    </NModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, inject, watch, Ref } from 'vue'
import {
  NCard,
  NButton,
  NModal,
  useMessage,
  NIcon,
  NDivider,
  NForm,
  NFormItem,
  NInput,
  NSpace,
  NText,
  NTag,
  NAlert,
  NEmpty,
  NPopconfirm,
  NSpin,
  NResult
} from 'naive-ui'
import { RefreshOutline, CopyOutline, KeyOutline, TrashOutline, AddOutline } from '@vicons/ionicons5'
import type { FormInst } from 'naive-ui'
import UserInfoGrid from '../../components/UserInfoGrid.vue'
import { AuthApi } from '../../shared/api/auth'
import { IcpDomain, UserTrafficStats } from '../../types'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'

const router = useRouter()
const message = useMessage()
const showTokenResetModal = ref(false)
const showPasswordModal = ref(false)
const showForgotModal = ref(false)
const loading = ref(false)
const formRef = ref<FormInst | null>(null)
const showDomainModal = ref(false)
const domainLoading = ref(false)
const icpDomains = ref<IcpDomain[]>([])
const domainForm = ref({
  domain: ''
})

function formatTime(timestamp: number): string {
  if (!timestamp) return ''
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const rules = {
  oldPassword: {
    required: true,
    message: '请输入原密码',
    trigger: 'blur'
  },
  newPassword: {
    required: true,
    message: '请输入新密码',
    trigger: 'blur'
  },
  confirmPassword: {
    required: true,
    message: '请再次输入新密码',
    trigger: 'blur',
    validator: (_rule: any, value: string) => {
      return value === passwordForm.value.newPassword || new Error('两次输入的密码不一致')
    }
  }
}

const showPasswordResetModal = () => {
  showPasswordModal.value = true
}

const showForgotPasswordModal = () => {
  showForgotModal.value = true
}

const closeForgotPasswordModal = () => {
  showForgotModal.value = false
}

const logoutAndResetPassword = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  localStorage.removeItem('group')
  router.push('/auth/iforgot').then(() => {
    window.location.reload()
  })
}

const closePasswordModal = () => {
  showPasswordModal.value = false
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const handlePasswordReset = () => {
  formRef.value?.validate(async (errors) => {
    if (errors) return

    loading.value = true
    try {
      const response = await AuthApi.passwordReset({
        oldPassword: passwordForm.value.oldPassword,
        newPassword: passwordForm.value.newPassword
      })
      if (response.data.code === 200) {
        message.success('密码重置成功, 请重新登录')
        localStorage.removeItem('token')
        closePasswordModal()
        new Promise(resolve => setTimeout(resolve, 1000))
        router.push('/auth/login').then(() => {
          window.location.reload()
        })
      } else {
        message.error(response.data.message || '密码重置失败')
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || '密码重置失败')
    } finally {
      loading.value = false
    }
  })
}

const showTokenResetConfirm = () => {
  showTokenResetModal.value = true
}

const closeModal = () => {
  showTokenResetModal.value = false
}

const copyToken = () => {
  const token = localStorage.getItem('token')
  if (token) {
    navigator.clipboard.writeText(token)
    message.success('访问密钥已复制到剪贴板')
  } else {
    message.error('访问密钥不存在')
  }
}

const handleTokenReset = async () => {
  try {
    const response = await AuthApi.tokenReset()
    showTokenResetModal.value = false
    if (response.data.code === 200) {
      message.success(response.data.message || '重置成功')
      localStorage.setItem('token', response.data.data.newToken)
      await new Promise(resolve => setTimeout(resolve, 1000))
      window.location.reload()
    } else {
      message.error(response.data.message || '重置失败')
    }
  } catch (error: any) {
    message.error(error?.response?.data?.message || '重置失败')
  } finally {
    showTokenResetModal.value = false
  }
}

const showAddDomainModal = () => {
  showDomainModal.value = true
}

const closeDomainModal = () => {
  showDomainModal.value = false
  domainForm.value.domain = ''
}

const loadIcpDomains = async () => {
  try {
    const response = await AuthApi.getIcpDomains()
    if (response.data.code === 200) {
      icpDomains.value = response.data.data || []
    } else {
      message.error(response.data.message || '获取域名列表失败')
    }
  } catch (error: any) {
    message.error(error?.response?.data?.message || '获取域名列表失败')
    icpDomains.value = []
  }
}

const handleAddDomain = async () => {
  if (!domainForm.value.domain) {
    message.error('请输入域名')
    return
  }

  domainLoading.value = true
  try {
    const response = await AuthApi.addIcpDomain({ domain: domainForm.value.domain })
    if (response.data.code === 200) {
      message.success('添加成功')
      await loadIcpDomains()
      closeDomainModal()
    } else {
      message.error(response.data.message || '添加失败')
    }
  } catch (error: any) {
    message.error(error?.response?.data?.message || '添加失败')
  } finally {
    domainLoading.value = false
  }
}

const handleDeleteDomain = async (domain: string) => {
  try {
    const response = await AuthApi.deleteIcpDomain({ domain })
    if (response.data.code === 200) {
      message.success('删除成功')
      await loadIcpDomains()
    } else {
      message.error(response.data.message || '删除失败')
    }
  } catch (error: any) {
    message.error(error?.response?.data?.message || '删除失败')
  }
}

// 实名认证相关
const realnameTime = ref(0)
const showRealnameForm = ref(false)
const realnameLoading = ref(false)
const realnameFormRef = ref<FormInst | null>(null)
const realnameForm = ref({
  realname: '',
  idCard: ''
})

const realnameRules = {
  realname: {
    required: true,
    message: '请输入真实姓名',
    trigger: ['blur', 'input'],
    validator: (_rule: any, value: string) => {
      if (!value.trim()) {
        return new Error('姓名不能为空')
      }
      if (value.length < 2) {
        return new Error('姓名长度不能小于2个字符')
      }
      return true
    }
  },
  idCard: {
    required: true,
    message: '请输入身份证号',
    trigger: ['blur', 'input'],
    validator: (_rule: any, value: string) => {
      const reg = /(^\d{17}(\d|X|x)$)/
      if (!reg.test(value)) {
        return new Error('请输入正确的18位身份证号')
      }
      return true
    }
  }
}

const loadRealnameStatus = async () => {
  try {
    const response = await AuthApi.getRealnameInfo()
    if (response.data.code === 200) {
      realnameTime.value = response.data.data || 0
    }
  } catch (error) {
    message.error('获取实名认证状态失败')
  }
}

const showRealnameModal = () => {
  showRealnameForm.value = true
}

const closeRealnameModal = () => {
  showRealnameForm.value = false
  realnameForm.value = {
    realname: '',
    idCard: ''
  }
  realnameFormRef.value?.restoreValidation()
}

const handleRealnameSubmit = () => {
  realnameFormRef.value?.validate(async (errors) => {
    if (errors) return

    realnameLoading.value = true
    try {
      const response = await AuthApi.submitRealname({
        realname: realnameForm.value.realname.trim(),
        idCard: realnameForm.value.idCard.toUpperCase()
      })

      if (response.data.code === 200) {
        message.success('实名认证提交成功')
        closeRealnameModal()
        await loadRealnameStatus()
        await new Promise(resolve => setTimeout(resolve, 1000))
        window.location.reload()
      } else {
        message.error(response.data.message || '实名认证失败')
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || '实名认证失败')
    } finally {
      realnameLoading.value = false
    }
  })
}

// 流量历史记录相关
const trafficChartRef = ref<HTMLElement | null>(null)
const trafficStats = ref<UserTrafficStats | null>(null)
const trafficLoading = ref(true)
const trafficError = ref<string | null>(null)
let trafficChart: echarts.ECharts | null = null

// 获取主题上下文
const { isDarkMode } = inject('theme', {
  isDarkMode: ref(false)
}) as {
  isDarkMode: Ref<boolean>
}

// 格式化流量数据显示, 接受字节（bytes）作为输入单位
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  // 使用1024作为换算基数
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  // 保证单位不会超出范围
  const unitIndex = Math.min(i, units.length - 1)

  // 转换为相应单位的值
  const value = bytes / Math.pow(1024, unitIndex)

  // 根据大小控制小数位数
  const decimalPlaces = unitIndex >= 3 ? 2 : (unitIndex >= 2 ? 1 : 0)

  return value.toFixed(decimalPlaces) + ' ' + units[unitIndex]
}

// 加载流量统计数据
const loadTrafficStats = async () => {
  trafficLoading.value = true
  trafficError.value = null

  try {
    const response = await AuthApi.getUserTrafficStats()
    if (response.data.code === 200) {
      trafficStats.value = response.data.data

      // 下一帧更新图表
      setTimeout(() => {
        initTrafficChart()
      }, 0)
    } else {
      trafficError.value = response.data.message || '获取流量统计数据失败'
    }
  } catch (error: any) {
    trafficError.value = error?.response?.data?.message || '获取流量统计数据失败'
  } finally {
    trafficLoading.value = false
  }
}

// 初始化流量图表
const initTrafficChart = () => {
  if (!trafficChartRef.value || !trafficStats.value) return

  if (trafficChart) {
    trafficChart.dispose()
  }

  trafficChart = echarts.init(trafficChartRef.value)

  // 根据当前主题设置文字颜色
  const textColor = isDarkMode.value ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'
  const axisLineColor = isDarkMode.value ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
  const splitLineColor = isDarkMode.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'

  // 使用字节数据, 由formatBytes函数进行合适的单位转换
  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        let result = `${params[0].axisValue}<br/>`
        params.forEach((item: any) => {
          // 使用formatBytes函数格式化显示字节数据
          result += `${item.seriesName}: ${formatBytes(item.value)}<br/>`
        })
        return result
      }
    },
    legend: {
      data: ['上传流量', '下载流量', '总流量'],
      textStyle: {
        color: textColor
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trafficStats.value.dates,
      axisLine: {
        lineStyle: {
          color: axisLineColor
        }
      },
      axisLabel: {
        color: textColor
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function (value: number) {
          // 使用formatBytes函数格式化显示字节数据
          return formatBytes(value)
        },
        color: textColor
      },
      axisLine: {
        lineStyle: {
          color: axisLineColor
        }
      },
      splitLine: {
        lineStyle: {
          color: splitLineColor
        }
      }
    },
    series: [
      {
        name: '上传流量',
        type: 'line',
        areaStyle: { opacity: 0.3 },
        data: trafficStats.value.trafficOut, // 原始字节数据
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: '#18a058' }
      },
      {
        name: '下载流量',
        type: 'line',
        areaStyle: { opacity: 0.3 },
        data: trafficStats.value.trafficIn, // 原始字节数据
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: '#2080f0' }
      },
      {
        name: '总流量',
        type: 'line',
        areaStyle: { opacity: 0.3 },
        data: trafficStats.value.totalTraffic, // 原始字节数据
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: '#f0a020' }
      }
    ]
  }

  trafficChart.setOption(option)

  // 响应窗口大小变化
  window.addEventListener('resize', handleResize)
}

const handleResize = () => {
  if (trafficChart) {
    trafficChart.resize()
  }
}

onMounted(() => {
  loadIcpDomains()
  loadRealnameStatus()
  loadTrafficStats()

  // 监听主题变化, 更新图表
  watch(isDarkMode, () => {
    if (trafficChart && trafficStats.value) {
      initTrafficChart()
    }
  })
})

onBeforeUnmount(() => {
  // 清理图表实例和事件监听器
  if (trafficChart) {
    trafficChart.dispose()
    trafficChart = null
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/profile.scss';
</style>