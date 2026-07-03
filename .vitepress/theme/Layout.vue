<script setup>
import DefaultTheme from 'vitepress/theme'
import ReadingProgress from './ReadingProgress.vue'
import ReadingToggle from './ReadingToggle.vue'
import BackToTop from './BackToTop.vue'
import TitleBar from './TitleBar.vue'
import NavTitleSpacer from './NavTitleSpacer.vue'
import NavRightSpacer from './NavRightSpacer.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-top>
      <ReadingProgress />
      <ReadingToggle />
      <BackToTop />
    </template>
    <template #doc-before>
      <TitleBar />
    </template>
    <template #nav-bar-title-before>
      <NavTitleSpacer />
      <svg class="brand-mark" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <polyline points="10.5,9 17.5,16 10.5,23" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        <rect x="21" y="9" width="4.6" height="14" rx="1.1" fill="currentColor" />
      </svg>
    </template>
    <template #nav-bar-content-after>
      <NavRightSpacer />
    </template>
  </Layout>
</template>

<style scoped>
.brand-mark {
  width: 30px;
  height: 30px;
  margin-right: 9px;
  flex-shrink: 0;
  vertical-align: middle;
  color: var(--brand-green);
}
</style>
