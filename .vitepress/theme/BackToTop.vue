<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSidebar } from 'vitepress/theme'

const { hasSidebar } = useSidebar()
const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
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
  <Transition name="btt">
    <button v-if="hasSidebar && visible" class="back-to-top" @click="scrollToTop">
      <span>›</span> <span>▲</span> 回到顶部
    </button>
  </Transition>
</template>
