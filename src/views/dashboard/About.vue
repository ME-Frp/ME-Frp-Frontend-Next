<template>
  <div class="about">
    <NCard title="关于面板">
      <NSpace vertical :size="16">
        <NDescriptions label-placement="left" bordered :column="1">
          <NDescriptionsItem label="版本">5.0.0</NDescriptionsItem>
          <NDescriptionsItem label="开发">落雪无痕LxHTT</NDescriptionsItem>
        </NDescriptions>
      </NSpace>
    </NCard>
  </div>
</template>

<script setup lang="ts">
import { NCard, NSpace, NDescriptions, NDescriptionsItem } from 'naive-ui'

</script>