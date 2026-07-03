<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'

// See NavTitleSpacer.vue for why this measures once and freezes.
const spacerWidth = ref(0)
const route = useRoute()
let measured = false

function tryMeasureOnce() {
  const main = document.querySelector('.VPDoc .main')
  const social = document.querySelector('.VPNavBarSocialLinks .VPSocialLink')
  if (!main || !social) return false
  const mainRect = main.getBoundingClientRect()
  const socialRect = social.getBoundingClientRect()
  if (mainRect.width === 0 || socialRect.width === 0) return false
  spacerWidth.value = Math.max(0, Math.round(socialRect.right - mainRect.right))
  measured = true
  return true
}

function attemptWithRetries() {
  if (measured) return
  if (tryMeasureOnce()) return
  let attempts = 0
  const retry = () => {
    if (measured) return
    attempts++
    if (tryMeasureOnce() || attempts > 20) return
    setTimeout(retry, 100)
  }
  setTimeout(retry, 100)
}

onMounted(attemptWithRetries)
watch(() => route.path, attemptWithRetries)
</script>

<template>
  <span :style="{ display: 'inline-block', width: spacerWidth + 'px', flexShrink: 0 }" aria-hidden="true" />
</template>
