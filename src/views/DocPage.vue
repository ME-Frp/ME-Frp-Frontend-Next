<template>
  <div class="docs-page">
    <MarkdownDisplay :path="(route.path + '.md' as string)" />
  </div>
</template>

<script setup lang="ts">
import MarkdownDisplay from '../components/MarkdownDisplay.vue'
import { useRoute } from 'vue-router'
const route = useRoute()

</script>

<style lang="scss" scoped>
.docs-page {
  padding-bottom: 40px;
}
</style> 