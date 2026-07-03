<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'

const width = ref(0)
const route = useRoute()

function onScroll() {
  const el = document.documentElement
  const scrollable = el.scrollHeight - el.clientHeight
  width.value = scrollable > 0 ? Math.min(100, (el.scrollTop / scrollable) * 100) : 0
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <div class="reading-progress" :key="route.path">
    <div class="bar" :style="{ width: width + '%' }" />
  </div>
</template>
