<template>
    <div class="help">
        <NCard title="联系方式" class="single-card">
            <NSpace horizontal :size="10">
                <NCard title="官方 QQ 群聊" class="contact-info">
                    <NSpace align="center">
                        <NTag type="success" size="small">推荐</NTag>
                        <a href="https://qm.qq.com/q/9iibikyupG">1019501085</a>
                    </NSpace>
                </NCard>
                <NCard title="官方用户支持邮箱" class="contact-info">
                    <NSpace align="center">
                        <NTag type="warning" size="small">慢速</NTag>
                        <a href="mailto:support@mefrp.com">support@mefrp.com</a>
                    </NSpace>
                </NCard>
            </NSpace>
        </NCard>
    </div>
</template>

<script setup lang="ts">
import { NCard, NTag, NSpace } from 'naive-ui'

</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/help.scss';
</style>

