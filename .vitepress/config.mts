import { defineConfig } from 'vitepress'
import type MarkdownIt from 'markdown-it'

// Article markdown uses a few recurring conventions (📚 系列导航 / 💡 一句话总结 /
// **类比：** / a bold "看完这一篇，你会拿到：" line before a bullet list). The
// original site styles these as distinct callout boxes; tag them with classes
// here so custom.css can pick them up.
function customBlocks(md: MarkdownIt) {
  md.core.ruler.push('custom_blocks', (state) => {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i]
      if (t.type === 'blockquote_open') {
        const inline = tokens[i + 2]
        if (inline?.type === 'inline') {
          const text = inline.content
          if (text.startsWith('📚') && text.includes('系列导航')) {
            t.attrJoin('class', 'series-nav')
          } else if (text.startsWith('💡') && text.includes('一句话总结')) {
            t.attrJoin('class', 'takeaway')
          }
        }
      } else if (t.type === 'paragraph_open') {
        const inline = tokens[i + 1]
        if (inline?.type === 'inline') {
          const text = inline.content
          if (text.startsWith('**类比：') || text.startsWith('类比：')) {
            t.attrJoin('class', 'analogy')
          } else if (/^\*\*[^*]+：\*\*$/.test(text.trim())) {
            const next = tokens[i + 3]
            if (next?.type === 'bullet_list_open') t.attrJoin('class', 'promise-title')
          }
        }
      }
    }
  })
}

export default defineConfig({
  markdown: {
    config: (md) => customBlocks(md)
  },
  lang: 'zh-CN',
  title: 'AI 编程指南',
  description: '面向小白的 AI 编程指南：Claude Code + Codex',
  cleanUrls: false,
  appearance: true,
  ignoreDeadLinks: true,

  themeConfig: {
    nav: [
      { text: 'Claude Code', link: '/claude-code/01-what-is-claude-code', activeMatch: '/claude-code/' },
      { text: 'Codex', link: '/codex/01-what-is-codex', activeMatch: '/codex/' }
    ],

    sidebar: {
      '/claude-code/': [
        {
          text: '一 · 基础入门',
          collapsed: true,
          items: [
            { text: '01 · Claude Code 简介', link: '/claude-code/01-what-is-claude-code' },
            { text: '02 · 安装与使用', link: '/claude-code/02-install' },
            { text: '03 · Claude Code 如何工作', link: '/claude-code/03-how-it-works' },
            { text: '04 · API 配置：订阅登录还是 API key，怎么选、怎么切', link: '/claude-code/04-api-config' },
            { text: '05 · 接入第三方 / 国产模型', link: '/claude-code/05-third-party-models' }
          ]
        },
        {
          text: '二 · 上手与项目',
          collapsed: true,
          items: [
            { text: '06 · Coding Plan：订阅套餐与计费', link: '/claude-code/06-coding-plan' },
            { text: '07 · 第一次使用：跑通第一个例子', link: '/claude-code/07-first-run' },
            { text: '08 · VS Code 集成', link: '/claude-code/08-vscode' },
            { text: '09 · JetBrains 集成', link: '/claude-code/09-jetbrains' },
            { text: '10 · 桌面 app（Desktop）', link: '/claude-code/10-desktop' },
            { text: '11 · 网页版与云端：把 Claude Code 装进浏览器和手机', link: '/claude-code/11-web-and-cloud' },
            { text: '12 · 项目初始化：用 /init 一键生成 CLAUDE.md', link: '/claude-code/12-project-init' },
            { text: '13 · 项目结构：Claude Code 在你项目里都放了什么', link: '/claude-code/13-project-structure' }
          ]
        },
        {
          text: '三 · 核心交互与操作',
          collapsed: true,
          items: [
            { text: '14 · 交互界面与快捷键：把手放对地方', link: '/claude-code/14-interface-and-shortcuts' },
            { text: '15 · 怎么提问和给指令：把话说到 Claude 心坎里', link: '/claude-code/15-prompting' },
            { text: '16 · 四个最常用的活儿：探索代码库、修 bug、重构、写测试', link: '/claude-code/16-common-workflows' },
            { text: '17 · 图片与多模态：贴张截图，它就懂了', link: '/claude-code/17-images-multimodal' },
            { text: '18 · CLAUDE.md 使用指南：把项目规矩写进它的记忆', link: '/claude-code/18-claude-md-guide' },
            { text: '19 · 上下文管理：别让它「失忆」也别烧爆 token', link: '/claude-code/19-context-management' },
            { text: '20 · 权限配置：放多松、收多紧，你说了算', link: '/claude-code/20-permissions' },
            { text: '21 · 安全与风险边界：到底该不该信任 AI 碰你的代码', link: '/claude-code/21-security' }
          ]
        },
        {
          text: '四 · 高级功能扩展',
          collapsed: true,
          items: [
            { text: '22 · MCP：给 Claude 接上外部世界', link: '/claude-code/22-mcp' },
            { text: '23 · 子代理（Subagents）：把活儿外包出去，别什么都自己扛', link: '/claude-code/23-subagents' },
            { text: '24 · 插件（Plugins）：把一堆零碎配置一键打包', link: '/claude-code/24-plugins' },
            { text: '25 · 记忆系统（memory）：让它跨会话记住你', link: '/claude-code/25-memory' },
            { text: '26 · Agent Skills：给 Claude 装一身随叫随到的专项本事', link: '/claude-code/26-agent-skills' },
            { text: '27 · Skills 使用实例：装一个、喊一声、看它干活', link: '/claude-code/27-skills-in-practice' },
            { text: '28 · skill-creator 使用：用一个 skill 造你自己的 skill', link: '/claude-code/28-skill-creator' },
            { text: '29 · Agent teams 智能体团队：多会话协作', link: '/claude-code/29-agent-teams' },
            { text: '30 · 功能怎么选：CLAUDE.md vs Skill vs Hook vs MCP vs Subagent', link: '/claude-code/30-choosing-features' }
          ]
        },
        {
          text: '五 · 系统配置与优化',
          collapsed: true,
          items: [
            { text: '31 · settings.json：用户级 / 项目级配置', link: '/claude-code/31-settings-json' },
            { text: '32 · 输出样式（Output Styles）：换一档「节目」，不换主持人', link: '/claude-code/32-output-styles' },
            { text: '33 · 钩子（Hooks）：在固定时机自动扣扳机', link: '/claude-code/33-hooks' },
            { text: '34 · CLI 参考手册：命令与全部标志', link: '/claude-code/34-cli-reference' },
            { text: '35 · 控制与模式：开会话时手里那块「调音台」', link: '/claude-code/35-modes-and-control' },
            { text: '36 · 斜杠命令（Slash Commands）：一个 `/` 调出 Claude 的所有快捷动作', link: '/claude-code/36-slash-commands' },
            { text: '37 · 检查点（Checkpoints）：随时能倒带的安全网', link: '/claude-code/37-checkpoints' }
          ]
        },
        {
          text: '六 · 高级参考与实战',
          collapsed: true,
          items: [
            { text: '38 · 插件参考手册：把自己那套配置，打成一个能发出去的包', link: '/claude-code/38-plugins-reference' },
            { text: '39 · 实战入门：拿一个真需求，从开工到交付走一整趟', link: '/claude-code/39-getting-started-practice' },
            { text: '40 · Chrome：让它操作浏览器', link: '/claude-code/40-chrome' },
            { text: '41 · 并行任务：让几个 Claude 同时开工，而不是排队', link: '/claude-code/41-parallel-tasks' },
            { text: '42 · 环境变量：藏在背后那排「总开关」', link: '/claude-code/42-env-vars' },
            { text: '43 · Git 工作流：让 Claude 当你的 git 副手', link: '/claude-code/43-git-workflow' },
            { text: '44 · GitHub Actions：在 PR 里 @ 一下，让 Claude 自己干活', link: '/claude-code/44-github-actions' },
            { text: '45 · Agent SDK：把 Claude Code 的能力搬进你自己的程序', link: '/claude-code/45-agent-sdk' },
            { text: '46 · 开发配置：把 Claude 干活的「工作环境」调顺', link: '/claude-code/46-dev-config' },
            { text: '47 · Voice 语音模式：把提示词说出来，而不是打出来', link: '/claude-code/47-voice' },
            { text: '48 · 综合实战：从零到上线，把所学串成一条线', link: '/claude-code/48-capstone-project' }
          ]
        },
        {
          text: '七 · 收尾与查阅',
          collapsed: true,
          items: [
            { text: '49 · 最佳实践：把零散的好习惯，攒成一套能照着做的心法', link: '/claude-code/49-best-practices' },
            { text: '50 · 反模式：常见的错误用法', link: '/claude-code/50-anti-patterns' },
            { text: '51 · 常见问题排查（FAQ / Troubleshooting）', link: '/claude-code/51-troubleshooting' },
            { text: '52 · 术语表（小白友好）：把这一路的「黑话」一次性翻译成人话', link: '/claude-code/52-glossary' },
            { text: '53 · 制作视频（Remotion）〔选读〕', link: '/claude-code/53-remotion-video' },
            { text: '54 · 速查手册（QuickStart）', link: '/claude-code/54-quickstart' }
          ]
        }
      ],
      '/codex/': [
        {
          text: '一 · 基础入门',
          collapsed: true,
          items: [
            { text: '01 · 认识 Codex 与四种入口', link: '/codex/01-what-is-codex' },
            { text: '02 · Codex 核心概念速览', link: '/codex/02-core-concepts' },
            { text: '03 · 安装与登录（Mac / Windows / Linux）', link: '/codex/03-install' },
            { text: '04 · 订阅与计费', link: '/codex/04-pricing' },
            { text: '05 · 接入 DeepSeek 等国产模型', link: '/codex/05-third-party-models' }
          ]
        },
        {
          text: '二 · 各入口怎么上手',
          collapsed: true,
          items: [
            { text: '06 · 跑通第一个任务', link: '/codex/06-first-task' },
            { text: '07 · 桌面 App 全景', link: '/codex/07-desktop-app' },
            { text: '08 · 命令行 CLI 上手', link: '/codex/08-cli' },
            { text: '09 · IDE 扩展（VS Code 等）', link: '/codex/09-ide' },
            { text: '10 · 云端 Codex Cloud：把活丢上云，喝着咖啡等结果', link: '/codex/10-cloud' },
            { text: '11 · 项目说明书 AGENTS.md：把规矩焊进 Codex 的开工流程', link: '/codex/11-agents-md' }
          ]
        },
        {
          text: '三 · 核心交互与操作',
          collapsed: true,
          items: [
            { text: '12 · 斜杠命令与快捷键：会话里的「快捷操作面板」', link: '/codex/12-slash-commands' },
            { text: '13 · 提示词（Prompt）写法：把话说到 Codex 心坎里', link: '/codex/13-prompting' },
            { text: '14 · 四类日常工作流：探索、修 bug、重构、写测试', link: '/codex/14-workflows' },
            { text: '15 · 权限、沙箱与审批：放多松、收多紧，自己拧', link: '/codex/15-permissions' },
            { text: '16 · 安全与风险边界：到底该不该放手让它碰你的代码', link: '/codex/16-security' },
            { text: '17 · 电脑操控与浏览器（Computer Use）：让 Codex 长出手', link: '/codex/17-computer-use' }
          ]
        },
        {
          text: '四 · 高级功能扩展',
          collapsed: true,
          items: [
            { text: '18 · config.toml 配置详解：一个文件管住所有旋钮', link: '/codex/18-config' },
            { text: '19 · 记忆系统（Memories 与 Chronicle）：让 Codex 跨会话记住你', link: '/codex/19-memory' },
            { text: '20 · 用 MCP 接外部工具：给 Codex 装上「外接口」', link: '/codex/20-mcp' },
            { text: '21 · 子代理（Subagents）：把活儿拆出去并行跑，但只有「你开口」它才拆', link: '/codex/21-subagents' },
            { text: '22 · Agent Skills 技能：把一套活儿打包，教会 Codex 自己接', link: '/codex/22-skills' },
            { text: '23 · 插件（Plugins）：一键装一整套能力，别再一个个手配', link: '/codex/23-plugins' },
            { text: '24 · 规则与钩子（Rules & Hooks）：给 Codex 装上「卡点」和「扳机」', link: '/codex/24-hooks' }
          ]
        },
        {
          text: '五 · 工程化与自动化',
          collapsed: true,
          items: [
            { text: '25 · Worktrees 并行隔离：让几个 Codex 各干各的，互不打架', link: '/codex/25-worktrees' },
            { text: '26 · Git 与 GitHub 集成：让 Codex 在你的 PR 里当审查员', link: '/codex/26-git-github' },
            { text: '27 · 自动化与 CI/CD：让 Codex 在你不在的时候自己干活', link: '/codex/27-automation' },
            { text: '28 · 非交互模式 codex exec：把它塞进脚本和 CI 里跑', link: '/codex/28-noninteractive' },
            { text: '29 · Slack / Linear 与 SDK 集成：在别处召唤 Codex，把它嵌进你自己的产品', link: '/codex/29-integrations' }
          ]
        },
        {
          text: '六 · 实战与进阶',
          collapsed: true,
          items: [
            { text: '30 · 怎么选模型：同一句话，到底该派哪个模型去跑', link: '/codex/30-models' },
            { text: '31 · 进阶技巧与提速：拖慢你的不是模型，是你给的烂上下文', link: '/codex/31-speed' },
            { text: '32 · 从 Claude Code 迁移：旧地图换个工具，照样能找到家', link: '/codex/32-migrate-from-claude-code' },
            { text: '33 · Windows 使用要点：原生还是 WSL，到底怎么跑才省心', link: '/codex/33-windows' },
            { text: '34 · 综合实战：从零给一个 TODO 小工具加功能、提交一次', link: '/codex/34-capstone' }
          ]
        },
        {
          text: '七 · 收尾与查阅',
          collapsed: true,
          items: [
            { text: '35 · 命令与配置速查表', link: '/codex/35-cheatsheet' },
            { text: '36 · 最佳实践：那些「正确的废话」之外，真正能落地的几条', link: '/codex/36-best-practices' },
            { text: '37 · 常见问题排查：装不上、登不了、不肯改文件，挨个拆', link: '/codex/37-faq' },
            { text: '38 · 术语表', link: '/codex/38-glossary' },
            { text: '39 · 企业管理与治理：一个人玩和一家公司用，是两件事', link: '/codex/39-enterprise' },
            { text: '40 · 速查手册（QuickStart）', link: '/codex/40-quickstart' }
          ]
        }
      ]
    },

    outline: { label: '本页目录', level: [2, 3] },
    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '深色模式',
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/cjgao2022/ai-coding-guide' }
    ]
  }
})
