<script setup>
import { ref, onMounted } from 'vue'
import { useSidebar } from 'vitepress/theme'

const { hasSidebar } = useSidebar()

const active = ref(false)

function toggle() {
  active.value = !active.value
  document.documentElement.classList.toggle('reading-mode', active.value)
  localStorage.setItem('reading-mode', active.value ? '1' : '0')
}

onMounted(() => {
  active.value = localStorage.getItem('reading-mode') === '1'
  document.documentElement.classList.toggle('reading-mode', active.value)
})
</script>

<template>
  <button
    v-if="hasSidebar"
    class="reading-toggle"
    :class="{ active }"
    @click="toggle"
  >
    {{ active ? '⊞ 退出专注' : '⊟ 专注阅读' }}
  </button>
</template>
