<template>
  <div class="donate">
    <div class="content-grid">
      <NCard title="赞助我们">
        <!-- <div class="qrcode-grid">
          <div class="qrcode-item">
            <img src="../assets/img/alipay_qiye.jpg" alt="支付宝" width="250" height="375" />
          </div>
          <div class="qrcode-item">
            <img src="../assets/img/wechat_qiye.jpg" alt="微信支付" width="250" height="375" />
          </div>
        </div> -->
        <p>你的支持是我们最大的动力！</p>
        <p>不要忘记备注您的用户名、邮箱和留言哦！</p>
        <div class="button-group">
          <NButton type="primary" tag="a" href="https://afdian.com/a/aehxy">
            爱发电
          </NButton>
          <NButton type="primary" tag="a" href="https://qm.qq.com/q/Ob3I1Gu52y">
            QQ (节点赞助/合作需求)
          </NButton>
        </div>
      </NCard>

      <NCard title="赞助者列表">
        <NTable>
          <thead>
            <tr>
              <th>姓名</th>
              <th>邮箱</th>
              <th>赞助事项</th>
              <th>留言</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sponsor in sponsors" :key="sponsor.name + sponsor.amount">
              <td>{{ sponsor.name }}</td>
              <td>{{ sponsor.email }}</td>
              <td>{{ sponsor.amount }}</td>
              <td>{{ sponsor.message }}</td>
            </tr>
          </tbody>
        </NTable>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NCard, NButton, NTable } from 'naive-ui'
import { ref } from 'vue'
import { type Sponsor } from '../../types'

const sponsors = ref<Sponsor[]>([])
</script>

<style lang="scss" scoped>
@use '../../assets/styles/dashboard/donate.scss';
</style>