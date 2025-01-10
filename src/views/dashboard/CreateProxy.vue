<template>
  <div class="create">
    <NCard title="创建隧道">
      <NForm ref="formRef" :model="formValue" :rules="rules" class="proxy-form">
        <NFormItem label="节点" path="node">
          <NSelect v-model:value="formValue.node" :options="nodeOptions" placeholder="请选择" class="full-width" />
        </NFormItem>

        <div class="form-row">
          <NFormItem label="本地地址" path="localAddr">
            <NInput v-model:value="formValue.localAddr" placeholder="请输入" class="full-width" />
          </NFormItem>
          <NFormItem label="本地端口" path="localPort">
            <NInputNumber v-model:value="formValue.localPort" :min="1" :max="65535" placeholder="请输入"
              class="full-width" />
          </NFormItem>
        </div>

        <div class="form-row">
          <NFormItem label="远程端口" path="remotePort">
            <NInputNumber v-model:value="formValue.remotePort" :min="1" :max="65535" placeholder="请输入"
              class="full-width" />
          </NFormItem>
          <NFormItem label="隧道类型" path="type">
            <NSelect v-model:value="formValue.type" :options="proxyTypeOptions" placeholder="请选择" class="full-width" />
          </NFormItem>
        </div>

        <template v-if="formValue.type === 'http' || formValue.type === 'https'">
          <NFormItem label="绑定域名" path="domain">
            <NInput v-model:value="formValue.domain" placeholder="请输入" class="full-width" />
          </NFormItem>
          <div class="tip-text">请切记将绑定的域名解析到本节点的地址，否则无法访问您的服务。</div>
        </template>

        <NFormItem label="隧道名称" path="name">
          <NInput v-model:value="formValue.name" placeholder="请输入隧道名称" class="full-width" />
        </NFormItem>

        <div class="action-row">
          <NButton type="primary" @click="handleCreate">
            <template #icon>
              <NIcon>
                <CloudUploadOutline />
              </NIcon>
            </template>
            新建隧道
          </NButton>
        </div>
      </NForm>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NForm, NFormItem, NInput, NInputNumber, NSelect, NButton, NIcon, type FormRules } from 'naive-ui'
import { CloudUploadOutline } from '@vicons/ionicons5'
import { type ProxyFormData, mockProxyFormData, mockNodeOptions, mockProxies } from '../../types'

const proxyTypeOptions = [...mockProxies].map(option => ({
  ...option,
  type: 'group'
}))

const nodeOptions = mockNodeOptions.map(option => ({
  ...option,
  type: 'group'
}))

const formValue = ref<ProxyFormData>(mockProxyFormData)

const rules: FormRules = {
  node: {
    required: true,
    message: '请选择节点',
    trigger: 'blur'
  },
  localAddr: {
    required: true,
    message: '请输入本地地址',
    trigger: 'blur'
  },
  localPort: {
    required: true,
    message: '请输入本地端口',
    trigger: 'blur'
  },
  remotePort: {
    required: true,
    message: '请输入远程端口',
    trigger: 'blur'
  },
  type: {
    required: true,
    message: '请选择隧道类型',
    trigger: 'blur'
  },
  name: {
    required: true,
    message: '请输入隧道名称',
    trigger: 'blur'
  },
  domain: {
    required: true,
    validator: (_rule: any, value: string) => {
      if (formValue.value.type === 'http' || formValue.value.type === 'https') {
        return !!value || new Error('请输入绑定域名')
      }
      return true
    },
    trigger: 'blur'
  }
}

// const getNodeInfo = (nodeId: string) => {
//   const node = nodeOptions.find(n => n.value === nodeId)
//   return node?.label || ''
// }

const handleCreate = () => {
  // // 处理创建隧道的逻辑
  // console.log('创建隧道:', formValue.value)
}
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/createProxy.scss';
</style>