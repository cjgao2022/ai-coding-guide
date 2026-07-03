<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const CLAUDE_VERSION = 'v2.1.183'
const CLAUDE_MODEL = 'Opus 4.8 (1M context)'
const CLAUDE_PLAN = 'Claude Max'

// Scripted demo conversation for the terminal mock. This is a hand-written
// approximation of the interaction pattern (typed prompt -> running -> reply),
// not a byte-for-byte reproduction of the original site's animation logic.
const SCRIPT = [
  { role: 'user', text: '帮我把这个函数里的 bug 找出来并修好' },
  { role: 'running', text: '正在阅读代码…' },
  { role: 'assistant', text: '找到了：第 42 行数组越界，已修复并补了一个测试。' },
  { role: 'user', text: '再帮我提交一下' },
  { role: 'running', text: '正在生成 commit…' },
  { role: 'assistant', text: '已提交：fix: 修复数组越界导致的崩溃问题' }
]

const convo = ref([])
const inputText = ref('')
const running = ref(false)
const paused = ref(false)
const termEl = ref(null)

let timer = null
const wait = (ms) => new Promise((resolve) => {
  timer = setTimeout(() => {
    if (paused.value) {
      const check = setInterval(() => {
        if (!paused.value) {
          clearInterval(check)
          resolve()
        }
      }, 150)
    } else {
      resolve()
    }
  }, ms)
})

async function typeInto(target, text, speed = 32) {
  for (let i = 0; i <= text.length; i++) {
    if (paused.value) await wait(0)
    target.value = text.slice(0, i)
    await wait(speed)
  }
}

async function playScript() {
  convo.value = []
  inputText.value = ''
  for (const step of SCRIPT) {
    if (step.role === 'user') {
      await typeInto(inputText, step.text)
      await wait(300)
      convo.value.push({ role: 'user', text: step.text })
      inputText.value = ''
      await wait(400)
    } else if (step.role === 'running') {
      running.value = true
      await wait(900)
      running.value = false
    } else {
      convo.value.push({ role: 'assistant', text: '' })
      const idx = convo.value.length - 1
      const fake = { value: '' }
      await typeInto(fake, step.text, 18)
      convo.value[idx].text = fake.value
      await wait(900)
    }
  }
  await wait(2200)
}

async function loop() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await playScript()
  }
}

function replay() {
  clearTimeout(timer)
  playScript()
}

// scroll-reveal for the cards row
const reveal = ref(null)
let observer = null

onMounted(() => {
  loop()
  if (reveal.value && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('in')
      })
    }, { threshold: 0.2 })
    observer.observe(reveal.value)
  } else if (reveal.value) {
    reveal.value.classList.add('in')
  }
})

onBeforeUnmount(() => {
  clearTimeout(timer)
  if (observer) observer.disconnect()
})
</script>

<template>
  <div class="hero-home">
    <div class="hh-glow" aria-hidden="true" />

    <header class="hh-nav">
      <a class="hh-brand" href="/" target="_self">
        AI 编程指南<span class="dot">.</span><span class="hh-brand-cur" />
      </a>
      <nav class="hh-nav-links">
        <a href="/claude-code/01-what-is-claude-code">Claude Code</a>
        <a href="/codex/01-what-is-codex">Codex</a>
      </nav>
    </header>

    <section class="hh-hero">
      <div class="hh-left">
        <span class="hh-badge"><span class="hh-pulse" /> Claude Code · Codex · 92 篇</span>
        <h1>
          <span class="hh-cn">在终端里，</span><br>
          <span class="brand-grad">长出生产力</span>
        </h1>
        <p class="hh-sub">面向小白的 AI 编程指南。从装好到熟练，把命令行变成你最快的那只手。</p>
        <div class="hh-btns">
          <a class="hh-btn primary" href="/claude-code/01-what-is-claude-code">从 Claude Code 开始 →</a>
          <a class="hh-btn ghost" href="/codex/01-what-is-codex">Codex 篇</a>
        </div>
      </div>

      <div class="hh-right">
        <div class="hh-term" title="点击重播 · 悬停暂停" @click="replay" @mouseenter="paused = true" @mouseleave="paused = false" ref="termEl">
          <div class="hh-term-bar">
            <span class="d r" /><span class="d y" /><span class="d g" />
            <span class="hh-term-title">claude</span>
          </div>
          <div class="hh-term-body">
            <div class="cc-header">
              <svg class="cc-logo" viewBox="0 0 20 16" aria-hidden="true">
                <rect x="2" y="1" width="16" height="10" rx="2" fill="#f38ba8" />
                <rect class="cc-eye" x="6" y="4" width="2" height="3.6" fill="#1e1e2e" />
                <rect class="cc-eye" x="12" y="4" width="2" height="3.6" fill="#1e1e2e" />
                <rect x="4" y="11" width="1.6" height="3" fill="#f38ba8" />
                <rect x="8" y="11" width="1.6" height="3" fill="#f38ba8" />
                <rect x="11" y="11" width="1.6" height="3" fill="#f38ba8" />
                <rect x="15" y="11" width="1.6" height="3" fill="#f38ba8" />
              </svg>
              <div class="cc-meta">
                <div><b>Claude Code</b> <span class="dim">{{ CLAUDE_VERSION }}</span></div>
                <div class="dim">{{ CLAUDE_MODEL }}</div>
                <div class="dim">{{ CLAUDE_PLAN }}</div>
              </div>
            </div>

            <div class="cc-convo">
              <div v-for="(msg, i) in convo" :key="i" :class="['cc-row', msg.role]">
                <span class="chev" v-if="msg.role === 'user'">›</span>
                <span class="bullet" v-else>●</span>
                {{ msg.text }}
              </div>
              <div class="cc-running" v-if="running">
                <span class="spin">●</span>
                <span class="dim">正在处理…</span>
              </div>
            </div>

            <div class="cc-input">
              <span class="chev">›</span>
              <span class="itext">{{ inputText }}</span>
              <span class="cur" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="hh-cards hh-reveal" ref="reveal">
      <a class="hh-card" href="/claude-code/01-what-is-claude-code">
        <div class="hh-card-top">
          <span class="hh-tag">53 篇</span>
          <span class="hh-arrow">→</span>
        </div>
        <h3>Claude Code 篇</h3>
        <p>从安装、代理循环，到 MCP、子代理、Skill、Hooks 与综合实战。</p>
      </a>
      <a class="hh-card" href="/codex/01-what-is-codex">
        <div class="hh-card-top">
          <span class="hh-tag">39 篇</span>
          <span class="hh-arrow">→</span>
        </div>
        <h3>Codex 篇</h3>
        <p>四种入口、AGENTS.md、沙箱审批、config.toml 到工程化自动化。</p>
      </a>
    </section>
  </div>
</template>

<style scoped>
.hero-home {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
}

.hh-glow {
  position: absolute;
  top: -80px;
  left: 50%;
  width: 100vw;
  margin-left: -50vw;
  height: 620px;
  z-index: -1;
  pointer-events: none;
  background:
    radial-gradient(46% 60% at 26% 18%, rgba(64, 160, 43, .08), transparent 70%),
    radial-gradient(40% 52% at 82% 8%, rgba(30, 102, 245, .07), transparent 72%);
  animation: hhGlow 18s ease-in-out infinite alternate;
}

.dark .hh-glow {
  background:
    radial-gradient(46% 60% at 26% 18%, rgba(166, 227, 161, .1), transparent 70%),
    radial-gradient(40% 52% at 82% 8%, rgba(137, 180, 250, .1), transparent 72%);
}

.hh-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.hh-brand {
  font-family: var(--vp-font-family-mono);
  font-size: 21px;
  font-weight: 700;
  letter-spacing: -.01em;
  color: var(--vp-c-text-1);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: color .2s, opacity .2s;
}

.hh-brand:hover,
.hh-brand .dot {
  color: var(--brand-green);
}

.hh-brand-cur {
  display: inline-block;
  width: 8px;
  height: 17px;
  margin-left: 4px;
  background: var(--brand-green);
  vertical-align: -2px;
  animation: hhBlink 1.1s steps(1) infinite;
}

.hh-nav-links {
  display: flex;
  gap: 26px;
}

.hh-nav-links a {
  font-family: var(--vp-font-family-mono);
  font-size: 14px;
  color: var(--ctp-subtext0);
  text-decoration: none;
  transition: color .2s;
}

.hh-nav-links a:hover {
  color: var(--brand-green);
}

.hh-hero {
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  gap: 48px;
  align-items: center;
  padding: 48px 0 60px;
}

.hh-badge {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  color: var(--brand-green);
  border: 1px solid rgba(var(--brand-accent-rgb), .25);
  background: rgba(var(--brand-accent-rgb), .05);
  border-radius: 999px;
  padding: 6px 15px;
  margin-bottom: 26px;
}

.hh-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--brand-green);
  animation: hhPulse 2s infinite;
}

.hh-left h1 {
  font-family: var(--vp-font-family-base);
  font-size: clamp(44px, 5.4vw, 76px);
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: -.02em;
  margin: 0 0 6px;
  border: none;
  padding: 0;
}

.brand-grad {
  background: linear-gradient(110deg, var(--brand-green), var(--ctp-blue));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hh-sub {
  font-size: 19px;
  color: var(--ctp-subtext0);
  max-width: 460px;
  margin: 18px 0 30px;
  line-height: 1.7;
}

.hh-btns {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

.hh-btn {
  font-size: 15.5px;
  font-weight: 700;
  text-decoration: none;
  padding: 13px 26px;
  border-radius: 11px;
  transition: .25s;
  display: inline-block;
}

.hh-btn.primary {
  background: linear-gradient(110deg, var(--brand-green), var(--ctp-blue));
  color: #fff;
  box-shadow: 0 10px 30px -10px rgba(var(--brand-accent-rgb), .5);
}

.dark .hh-btn.primary {
  color: #1e1e2e;
}

.hh-btn.primary:hover {
  transform: translateY(-2px);
  filter: brightness(1.08);
}

.hh-btn.ghost {
  border: 1.5px solid rgba(var(--brand-accent-rgb), .3);
  color: var(--vp-c-text-1);
}

.hh-btn.ghost:hover {
  border-color: var(--brand-green);
  color: var(--brand-green);
}

.hh-term {
  --ctp-base: #1e1e2e;
  --ctp-mantle: #181825;
  --ctp-crust: #11111b;
  --ctp-surface0: #313244;
  --ctp-surface1: #45475a;
  --ctp-overlay0: #6c7086;
  --ctp-text: #cdd6f4;
  --ctp-subtext1: #bac2de;
  --ctp-subtext0: #a6adc8;
  --ctp-green: #a6e3a1;
  --ctp-teal: #94e2d5;
  --ctp-blue: #89b4fa;
  --ctp-mauve: #cba6f7;
  --ctp-peach: #fab387;
  --ctp-red: #f38ba8;
  --ctp-yellow: #f9e2af;
  --brand-green: #a6e3a1;
  --vp-c-text-1: #cdd6f4;
  border: 1px solid var(--ctp-surface0);
  border-radius: 14px;
  background: var(--ctp-crust);
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 30px 80px -40px #000c, 0 0 50px -30px rgba(var(--brand-accent-rgb), .3);
}

.hh-term-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 14px;
  background: var(--ctp-mantle);
  border-bottom: 1px solid var(--ctp-surface0);
}

.hh-term-bar .d {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.hh-term-bar .d.r { background: var(--ctp-red); }
.hh-term-bar .d.y { background: var(--ctp-yellow); }
.hh-term-bar .d.g { background: var(--ctp-green); }

.hh-term-title {
  margin-left: 8px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--ctp-overlay0);
}

.hh-term-body {
  padding: 18px 16px 14px;
  font-family: var(--vp-font-family-mono);
  font-size: 12.5px;
  line-height: 1.75;
  height: 480px;
  display: flex;
  flex-direction: column;
  color: var(--ctp-text);
}

.cc-header {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: flex-start;
  padding-left: 36px;
}

.cc-logo {
  width: 58px;
  min-width: 58px;
  max-width: 58px;
  height: 46px;
  flex: 0 0 58px;
  animation: ccFloat 4.5s ease-in-out infinite;
}

.cc-eye {
  transform-box: fill-box;
  transform-origin: center;
  animation: ccBlink 4.2s infinite;
}

.cc-meta {
  line-height: 1.6;
  text-align: left;
  margin-left: 40px;
}

.cc-meta b {
  color: var(--vp-c-text-1);
  font-weight: 700;
}

.cc-meta .dim {
  color: var(--ctp-overlay0);
}

.cc-convo {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 16px;
  padding: 12px 0;
}

.cc-row {
  white-space: pre-wrap;
  word-break: break-word;
}

.cc-row .chev,
.cc-row .bullet {
  color: var(--ctp-overlay0);
  margin-right: 6px;
}

.cc-row.assistant .bullet {
  color: var(--brand-green);
}

.cc-running {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 2px 8px;
  color: var(--ctp-subtext0);
}

.cc-running .spin {
  color: var(--brand-green);
  animation: hhPulse 1s infinite;
}

.cc-running .dim {
  color: var(--ctp-overlay0);
  font-size: 12px;
}

.cc-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 4px;
  border-top: 1px solid var(--ctp-surface0);
  border-bottom: 1px solid var(--ctp-surface0);
}

.cc-input .chev {
  color: var(--ctp-overlay0);
}

.cc-input .itext {
  color: var(--ctp-text);
}

.cc-input .cur {
  display: inline-block;
  width: 6px;
  height: 14px;
  background: var(--brand-green);
  animation: hhBlink .9s steps(1) infinite;
}

.hh-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding-bottom: 90px;
}

.hh-card {
  display: block;
  text-decoration: none;
  border: 1px solid var(--ctp-surface0, var(--vp-c-divider));
  border-radius: 16px;
  padding: 24px 26px;
  background: #fff9;
  transition: .25s;
}

.dark .hh-card {
  background: #18182580;
}

.hh-card:hover {
  border-color: var(--brand-green);
  transform: translateY(-3px);
  box-shadow: 0 14px 34px -18px rgba(var(--brand-accent-rgb), .5);
}

.hh-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hh-tag {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--brand-green);
}

.hh-arrow {
  color: var(--brand-green);
  transition: transform .25s;
}

.hh-card:hover .hh-arrow {
  transform: translate(4px);
}

.hh-card h3 {
  margin: 12px 0 6px;
  font-size: 19px;
  color: var(--vp-c-text-1);
  border: none;
  padding: 0;
}

.hh-card p {
  margin: 0;
  font-size: 14.5px;
  color: var(--ctp-subtext0);
  line-height: 1.65;
}

.hh-reveal {
  opacity: 0;
  transform: translateY(22px);
  transition: .7s var(--ease-reveal);
}

.hh-reveal.in {
  opacity: 1;
  transform: none;
}

@keyframes hhGlow {
  0% { transform: translate(0) scale(1); }
  100% { transform: translate(3%, 2%) scale(1.06); }
}

@keyframes hhBlink {
  50% { opacity: 0; }
}

@keyframes hhPulse {
  0% { box-shadow: 0 0 rgba(var(--brand-accent-rgb), .6); }
  70% { box-shadow: 0 0 0 9px transparent; }
  100% { box-shadow: 0 0 0 0 transparent; }
}

@keyframes ccFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes ccBlink {
  0%, 93%, 100% { transform: scaleY(1); }
  96% { transform: scaleY(.1); }
}

@media (max-width: 860px) {
  .hh-hero { grid-template-columns: 1fr; gap: 32px; padding-top: 24px; }
  .hh-right { order: 2; }
  .hh-term-body { height: 380px; }
}

@media (max-width: 640px) {
  .hh-cards { grid-template-columns: 1fr; }
  .hh-nav-links { gap: 18px; }
  .hh-sub { font-size: 16px; }
  .hh-btn { font-size: 14px; padding: 14px 22px; min-height: 44px; }
  .hh-nav-links a { font-size: 12px; }
}

@media (max-width: 480px) {
  .hh-term-body { height: 280px; font-size: 11.5px; }
  .hh-term-bar { height: 34px; }
  .hh-term-bar .d { width: 9px; height: 9px; }
  .hh-nav { height: 64px; }
  .hh-brand { font-size: 18px; }
}

@media (prefers-reduced-motion: reduce) {
  .hh-glow, .cc-logo, .cc-eye { animation: none !important; }
}
</style>
