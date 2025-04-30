<template>
    <div class="help">
        <NCard title="联系方式" class="single-card">
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

        </NCard>
    </div>
</template>

<script setup lang="ts">
import { NCard, NTag, NSpace } from 'naive-ui'

</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/help.scss';
</style>
