<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useData } from 'vitepress'
import { useSidebar } from 'vitepress/theme'

const { page } = useData()
const { hasSidebar } = useSidebar()

const path = page.value.relativePath.replace(/\.md$/, '')
const minutes = ref(null)

onMounted(async () => {
  await nextTick()
  const doc = document.querySelector('.vp-doc')
  const chars = doc ? doc.innerText.length : 0
  minutes.value = Math.max(1, Math.round(chars / 400))
})
</script>

<template>
  <div v-if="hasSidebar" class="cc-titlebar">
    <span class="cc-dot r" />
    <span class="cc-dot y" />
    <span class="cc-dot g" />
    <span class="cc-title">claude <b>~</b> {{ path }}</span>
    <span class="cc-meta" v-if="minutes">— {{ minutes }} min read</span>
  </div>
</template>
