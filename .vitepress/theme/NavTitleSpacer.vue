<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'

// Measured exactly ONCE — as soon as a doc page (one with `.VPDoc .main`)
// is available — and then frozen forever after that. Layout.vue (and this
// component) never remounts across client-side route changes, so this same
// fixed value is reused on every subsequent page: rather than re-measuring
// per page (which raced with layout settling and gave inconsistent results
// page to page), compute it once when things are guaranteed stable and
// apply that one number everywhere for the rest of the session.
const spacerWidth = ref(0)
const route = useRoute()
let measured = false

function tryMeasureOnce() {
  const main = document.querySelector('.VPDoc .main')
  const title = document.querySelector('.VPNavBarTitle .title')
  if (!main || !title) return false
  const mainRect = main.getBoundingClientRect()
  const titleRect = title.getBoundingClientRect()
  if (mainRect.width === 0 || titleRect.width === 0) return false
  spacerWidth.value = Math.max(0, Math.round(mainRect.left - titleRect.left))
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

// e.g. user's very first landing was the homepage (no .VPDoc .main yet) —
// once they navigate to an actual doc page, try again; a no-op once measured
watch(() => route.path, attemptWithRetries)
</script>

<template>
  <span :style="{ display: 'inline-block', width: spacerWidth + 'px', flexShrink: 0 }" aria-hidden="true" />
</template>
