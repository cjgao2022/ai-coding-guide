# 40 · 速查手册（QuickStart）

> 纯查询用途:只列命令、参数、配置、路径,不讲原理(原理见教程 01-39 篇)。标注 Beta/实验性的条目随版本变化,以 `codex --version` + `codex --help` 实际行为为准。

## 检索目录

| 想查什么 | 跳到 |
|---|---|
| 安装 / 登录 / IDE 扩展 | [§1](#_1-安装与登录) |
| 沙箱 / 审批档位 | [§2](#_2-沙箱与审批) |
| 子命令、CLI flags | [§3](#_3-cli-命令与-flags) |
| Slash commands / 快捷键 | [§4](#_4-slash-commands-与快捷键) |
| config.toml 全字段 | [§5](#_5-config-toml) |
| AGENTS.md 规则 | [§6](#_6-agents-md) |
| Rules / Permission Profiles | [§7](#_7-rules-与-permission-profiles) |
| MCP | [§8](#_8-mcp) |
| Subagent / Skill / Plugin | [§9](#_9-subagent-skill-plugin) |
| Memories / 上下文 | [§10](#_10-memories-与上下文) |
| codex exec / CI / SDK | [§11](#_11-codex-exec-与自动化) |
| Git / GitHub / Worktree | [§12](#_12-git-与-worktree) |
| 第三方模型 | [§13](#_13-第三方模型) |
| 环境变量 | [§14](#_14-环境变量) |
| 与 Claude Code 对照 | [§15](#_15-与-claude-code-对照) |
| 常见坑 | [§16](#_16-常见坑) |

---

## 1. 安装与登录

| 目的 | 命令 | 备注 |
|---|---|---|
| 安装(macOS/Linux) | `curl -fsSL https://chatgpt.com/codex/install.sh \| sh` | 首选,独立二进制不依赖 Node |
| 安装(Windows) | `powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 \| iex"` | |
| CI 无人值守 | `curl -fsSL https://chatgpt.com/codex/install.sh \| CODEX_NON_INTERACTIVE=1 sh` | |
| Homebrew | `brew install --cask codex` | 慢一两天,更稳 |
| npm | `npm install -g @openai/codex` | 不建议 sudo |
| 验证 | `codex --version` | 无输出=PATH 问题 |
| 冲突排查 | `which -a codex` | 多个则卸载多余 |
| 体检 | `codex doctor` | |
| 登录(OAuth) | `codex login` | |
| 登录(设备码) | `codex login --device-auth` | 远程/无浏览器,Beta |
| 登录(API key) | `printenv OPENAI_API_KEY \| codex login --with-api-key` | 从 stdin 读 |
| 查状态 | `codex login status` | 已登录退出码 0 |
| 登出 | `codex logout` | |

- 平台:macOS 首选;Windows 11(或 Win10 1809+);Linux 仅 CLI(无桌面 App);WSL 需 WSL2。
- IDE 扩展 ID 是 **`openai.chatgpt`**(不叫 Codex):`code --install-extension openai.chatgpt`;支持 VS Code/Cursor/Windsurf/Insiders,JetBrains 走独立集成。
- 桌面 App:`chatgpt.com/codex` 下载,Windows 可 `winget install Codex -s msstore`。
- 凭据:`~/.codex/auth.json`(明文)或系统凭据库,`cli_auth_credentials_store = "file"|"keyring"|"auto"`。CLI 与 IDE 共享登录。
- 企业 CA:`export CODEX_CA_CERTIFICATE=/path/ca.pem`(回落 `SSL_CERT_FILE`)。

## 2. 沙箱与审批

两个独立旋钮:沙箱(能动多大)× 审批(问不问)。

| sandbox_mode | 改文件 | 联网 |
|---|---|---|
| `read-only` | 否 | 否 |
| `workspace-write` | 仅工作区 | 默认关,需 `network_access = true` |
| `danger-full-access` | 全机器 | 是 |

| approval_policy | 行为 |
|---|---|
| `untrusted` | 从严 |
| `on-request`(默认) | 平衡档 |
| `never` | 不问 |

- 默认档按目录有无 Git 选择:有 Git → `workspace-write`+`on-request`;无 Git → `read-only`。
- `workspace-write` 下 `.git`/`.agents`/`.codex` 强制只读(递归)。
- 平台实现:macOS Seatbelt;Windows 原生沙箱(`elevated`/`unelevated`)或 WSL2;Linux 需 `bubblewrap`。
- 危险开关:`--dangerously-bypass-approvals-and-sandbox`(别名 `--yolo`),仅隔离容器/VM。
- Beta(0.142+):permission profiles 可能替换旧预设;回旧档用 `codex --sandbox read-only` 或 config 写 `sandbox_mode`。

## 3. CLI 命令与 flags

命令结构:`codex [子命令] [选项] ["提示词"]`

### 子命令

| 命令 | 作用 |
|---|---|
| `codex` | 交互式 TUI |
| `codex exec`(`e`) | 非交互跑一次(默认只读;要求 Git 仓库) |
| `codex resume` | 续上次会话 |
| `codex fork` | 分叉会话 |
| `codex apply`(`a`) | 云端任务 diff 应用到本地 |
| `codex mcp` | MCP 管理(实验性) |
| `codex features` | 功能开关列表/启停 |
| `codex plugin marketplace` | 插件市场 |
| `codex app-server` | JSON-RPC App Server |
| `codex execpolicy check` | 验证 rules 判定 |
| `codex doctor` | 体检 |

### 全局 flags

| flag | 作用 |
|---|---|
| `-m` / `--model` | 换模型 |
| `-i` / `--image` | 附图片 |
| `-C` / `--cd` | 指定工作目录 |
| `-s` / `--sandbox` | 沙箱档位 |
| `-a` / `--ask-for-approval` | 审批时机 |
| `--search` | 实时联网搜索(默认 cached) |
| `--add-dir` | 额外可写目录(可重复) |
| `-p` / `--profile` | 套用配置 profile |
| `-c` / `--config` | 临时覆盖配置键(TOML 语法) |
| `--oss` | 本地开源模型(需 Ollama) |
| `--yolo` | 跳过审批+沙箱 |

### codex exec 专属

| flag | 作用 |
|---|---|
| `-`(作 PROMPT) | 从 stdin 读提示词 |
| `--json` | JSONL 事件流 |
| `-o` / `--output-last-message` | 最终消息写文件 |
| `--output-schema` | 输出符合 JSON Schema |
| `--skip-git-repo-check` | 允许非 Git 目录 |
| `--ephemeral` | 不落盘(无法 resume) |
| `--ignore-user-config` | 不加载 config.toml(可能 401) |
| `--ignore-rules` | 跳过 .rules |
| `--dangerously-bypass-hook-trust` | 跳过钩子信任(CI) |

续会话:`codex exec resume --last "..."`。stdout=最终结果,stderr=过程噪音。

## 4. Slash Commands 与快捷键

| 分类 | 命令 |
|---|---|
| 设置 | `/init` `/permissions` `/mcp` `/skills` `/status` |
| 会话 | `/model` `/compact` `/clear` `/new`(不清屏) `/plan` `/resume` `/fork` `/side`(=`/btw`) |
| 交付 | `/diff` `/review` `/copy`(=Ctrl+O) |
| 功能 | `/memories` `/goal`(需 `features.goals`) `/agent`(切子代理线程) `/fast` `/hooks`(信任新钩子) `/personality` `/plugins` |
| 外观 | `/keymap` `/statusline` `/theme` `/raw` |
| 退出 | `/quit` `/exit` |

- 桌面 App 仅 6 条:`/status` `/review` `/plan` `/goal` `/mcp` `/feedback`;`$` 调 Skills。
- IDE 扩展 8 条:`/status` `/review` `/goal` `/auto-context` `/local` `/cloud` `/cloud-environment` `/feedback`。
- ⚠️ `/explain` `/fix` `/test` 不存在(网络谣传)。

| 键 | 作用 |
|---|---|
| `Ctrl+L` | 清屏不丢对话(≠`/clear`) |
| `Ctrl+O` | 复制最近输出 |
| `Tab` | 任务运行中排队下一条 |
| `Ctrl+G` | 外部编辑器(`$VISUAL`/`$EDITOR`) |
| `!` 行首 | 直接跑 shell,结果进上下文 |
| `@` | 模糊搜文件 |
| `Alt+R` | raw 滚屏(=`/raw`) |
| `↑`/`↓` | 草稿历史 |
| `Ctrl+R` | 反向搜索历史 |
| `Esc Esc` | 回退编辑上条消息 |

## 5. config.toml

路径:用户级 `~/.codex/config.toml`(`CODEX_HOME` 可改);项目级 `<repo>/.codex/config.toml`(仅受信任项目加载)。

优先级:CLI/`--config` > 项目级 > `--profile` 档 > 用户级 > `/etc/codex/config.toml` > 内置默认。

- TOML 坑:根键必须写在所有 `[表]` 之前。
- 项目级**被忽略**的键(只认用户级):`openai_base_url` `chatgpt_base_url` `model_provider` `model_providers` `notify` `profile` `profiles` `otel` 等。
- Profile:`~/.codex/<名字>.config.toml`,`--profile <名字>` 选用;0.134+ 不再支持 `[profiles.x]` 旧写法。

```toml
model = "gpt-5.5"
model_reasoning_effort = "medium"    # none/minimal/low/medium/high/xhigh
model_reasoning_summary = "concise"  # auto/concise/detailed/none
sandbox_mode = "workspace-write"     # read-only/workspace-write/danger-full-access
approval_policy = "on-request"       # untrusted/on-request/never
web_search = "cached"                # disabled/cached/live
service_tier = "flex"                # flex/fast(fast 需 features.fast_mode)
personality = "friendly"             # none/friendly/pragmatic
file_opener = "vscode"               # vscode/vscode-insiders/windsurf/cursor/none
project_doc_fallback_filenames = ["TEAM_GUIDE.md"]
project_doc_max_bytes = 65536
cli_auth_credentials_store = "auto"  # file/keyring/auto
review_model = "..."
model_instructions_file = "..."

[sandbox_workspace_write]
network_access = false
writable_roots = ["/path/a"]

[features]
memories = false      # 默认关
hooks = true          # 默认开
multi_agent = true
fast_mode = true
goals = true          # 开了才有 /goal
shell_snapshot = true

[agents]
max_threads = 6                  # 默认 6
max_depth = 1                    # 默认 1,不建议调大
job_max_runtime_seconds = 1800

[mcp_servers.<id>]
command = "npx"                          # STDIO 型
args = ["-y", "@upstash/context7-mcp"]
url = "https://mcp.figma.com/mcp"        # HTTP 型
bearer_token_env_var = "FIGMA_OAUTH_TOKEN"
enabled = true
enabled_tools = []
disabled_tools = []                       # 在白名单之后应用
default_tools_approval_mode = "prompt"    # auto/prompt/approve
startup_timeout_sec = 10
tool_timeout_sec = 60

[[skills.config]]
path = "/path/to/skill/SKILL.md"
enabled = false

[windows]
sandbox = "elevated"      # elevated/unelevated

[permissions.<name>]      # Beta,与 sandbox_mode 不能混用
extends = ":workspace"
```

## 6. AGENTS.md

发现链条(每轮构建一次):

1. 全局层:`~/.codex/AGENTS.override.md` 优先,否则 `AGENTS.md`,只取第一个非空文件
2. 项目层:Git 根 → 当前目录逐级,每目录挑一个(override 优先)
3. 从根到叶**拼接**(非覆盖),越近当前目录优先级越高

| 项 | 规则 |
|---|---|
| 大小限制 | 合并后默认 **32 KiB(按字节)**,超则截断;`project_doc_max_bytes` 可调 |
| override 语义 | `AGENTS.override.md` 使同层 `AGENTS.md` 被跳过,不影响其他层 |
| 自定义文件名 | `project_doc_fallback_filenames = [...]`,改后重启 |
| 生成 | 会话内 `/init` |
| 验证是否读到 | `codex --ask-for-approval never "Summarize the current instructions."` |

写:项目概述、技术栈、常用命令、约定、"不要做"清单。不写:长篇背景、过时信息、代码能自证的内容。

## 7. Rules 与 Permission Profiles

### Rules(实验性)— `~/.codex/rules/default.rules`(Starlark 语法)

```python
prefix_rule(
    pattern = ["gh", "pr", "view"],
    decision = "prompt",     # allow/prompt/forbidden;forbidden > prompt > allow
    justification = "...",
)
```

- 复合命令(`&&`)被 tree-sitter 拆开逐条判;含重定向/变量替换则整体判一条。
- 验证:`codex execpolicy check --pretty --rules <file> -- <command>`

### Permission Profiles(Beta)

内置 `:read-only` / `:workspace` / `:danger-full-access`;`default_permissions` 指定默认。与老 `sandbox_mode` **不可混用**——配置或命令行出现 `sandbox_mode`/`--sandbox` 即回落老沙箱。

### 其他安全项

- Auto-review:`approvals_reviewer = "auto_review"`,审查代理先过高危请求,fail-closed。
- Codex Security 插件:`/plugins` 安装,`$codex-security:security-scan` / `deep-security-scan` / `security-diff-scan` / `fix-finding`。

## 8. MCP

```bash
codex mcp add context7 -- npx -y @upstash/context7-mcp    # STDIO;-- 后为启动命令
codex mcp add linear --url https://mcp.linear.app/mcp     # HTTP
codex mcp login <server-name>                              # OAuth
```

- 仅支持 STDIO 和 Streamable HTTP(无 SSE)。
- **没有 `--scope`**:作用域由文件位置决定——全局 `~/.codex/config.toml` vs 项目 `.codex/config.toml`(需受信任)。CLI 与 IDE 共用。
- 手写配置见 §5 `[mcp_servers.<id>]`;会话内 `/mcp` 查状态。

## 9. Subagent / Skill / Plugin

### Subagent

- **绝不自动派生**,须明确要求并行("spawn two agents")。内置类型:`default` / `worker` / `explorer`。
- 自定义:TOML 放 `~/.codex/agents/`(全局)或 `.codex/agents/`(项目):

```toml
name = "reviewer"                      # 必填
description = "..."                    # 必填
developer_instructions = """..."""     # 必填
model = "gpt-5.4-mini"                 # 可选,默认继承
sandbox_mode = "read-only"             # 可单独锁权限
```

- 限流:§5 `[agents]`;线程切换:`/agent`;批量:`spawn_agents_on_csv`(实验性)。

### Skill

结构:目录 + `SKILL.md`(frontmatter 必含 `name`+`description`)+ 可选 `scripts/` `references/`。

| 项 | 规则 |
|---|---|
| 显式触发 | `$` 或 `/skills`(**不是 `@`**) |
| 隐式触发 | 按 description 语义匹配(**无 `trigger` 字段**) |
| 披露预算 | 启动只带 name+description+路径(约窗口 2% 或 8000 字符) |
| 放置(优先级降序) | `$CWD/.agents/skills`(REPO,逐级扫)→ `~/.agents/skills`(USER)→ `/etc/codex/skills`(ADMIN)→ 内置(SYSTEM) |
| ⚠️ | 手写 Skill 别放 `~/.codex/skills/`(那是 `$skill-installer` 的安装位);同名不合并、并列列出 |
| 创建/安装 | `$skill-creator` / `$skill-installer <name>` |
| 禁用 | §5 `[[skills.config]]` |
| 关隐式触发 | 技能目录放 `agents/openai.yaml`:`policy.allow_implicit_invocation: false` |

### Plugin

```
my-plugin/
├── .codex-plugin/plugin.json    # name(kebab-case)/version/description + 路径字段
├── skills/<name>/SKILL.md
├── .mcp.json
├── .app.json
└── hooks/hooks.json
```

```bash
codex plugin marketplace add owner/repo [--ref main] [--sparse .agents/plugins]
codex plugin marketplace list / upgrade [name] / remove <name>
```

禁用:`[plugins."name@marketplace"] enabled = false`。安装插件 ≠ 信任其 hook(须 `/hooks` 手动信任)。

## 10. Memories 与上下文

### Memories(默认关;EEA/UK/瑞士不可用)

```toml
[features]
memories = true

[memories]
use_memories = true                        # 默认 true
generate_memories = true                   # 默认 true
disable_on_external_context = false        # 默认 false
min_rate_limit_remaining_percent = 25      # 默认 25
```

- 非实时:后台异步生成,会话闲置足够久才总结;限额低于阈值跳过。
- 存储:`~/.codex/memories/`(明文 markdown);会话级控制 `/memories`。
- 死规矩写 `AGENTS.md`,不靠记忆;密钥永不进记忆。

### Chronicle(实验性;仅 ChatGPT Pro + macOS;EEA/UK/瑞士不可用)

屏幕内容喂记忆。开启:App 设置 → Personalization → Memories → Chronicle。需屏幕录制+辅助功能权限。截图临时存 `$TMPDIR/chronicle/screen_recording/`(6 小时删);记忆存 `~/.codex/memories_extensions/chronicle/`。

### 上下文

`/compact` 压缩;`/new` 开新对话不清屏;`/clear` 清屏+新对话。一个任务一个会话;`@` 精准喂文件。

## 11. codex exec 与自动化

```bash
codex exec "任务" --sandbox workspace-write      # 默认只读,要写必须显式给
codex exec --json -o result.md "任务"            # CI 黄金搭配
提示词 | codex exec "指令"                        # 管道内容当上下文
cat prompt.txt | codex exec -                     # stdin 当整个提示词
codex exec resume --last "继续"
```

### GitHub Actions

```yaml
- uses: openai/codex-action@v1
  with:
    openai-api-key: ${{ secrets.OPENAI_API_KEY }}
    prompt-file: .github/codex/prompts/review.md
    output-file: codex-output.md
```

- 输入:`sandbox`(**默认只读**)、`model`/`effort`、`codex-args`、`codex-version`、`codex-home`;输出:`final-message`。
- 密钥三层:GitHub Secrets 不硬编码;不设 job 级 env 只传给该步;`safety-strategy` 默认 `drop-sudo`(Windows 须 `unsafe`)+ `allow-users`/`allow-bots` 限触发者。

### SDK / App Server

```bash
npm install @openai/codex-sdk      # TS,Node 18+
pip install openai-codex            # Python 3.10+,beta
```

```ts
import { Codex } from "@openai/codex-sdk";
const thread = new Codex().startThread();
const result = await thread.run("...");
```

App Server:`codex app-server`(JSON-RPC 2.0 / stdio),深度集成用;CI/自动化用 SDK 而非 App Server。概念:会话=thread,一次请求响应=turn,具体动作=item。

### Slack / Linear

- Slack:thread 里 `@Codex` 派活(云端任务);装 app:`chatgpt.com/codex/settings/connectors`。
- Linear:指派 issue 或评论 `@Codex`;triage 规则可自动派单。

## 12. Git 与 Worktree

| 场景 | 入口 |
|---|---|
| PR 云端审查 | PR 评论 `@codex review`(只报 P0/P1) |
| 本地审查 | `/review`(只读) |
| 自动审查开关 | `chatgpt.com/codex/settings/code-review` |
| 审查规则 | `AGENTS.md` 写 `## Review guidelines` 小节(就近原则) |
| 云端修复 | `@codex fix the P1 issue`(`@codex review` 是保留词,其余走通用云任务) |
| 应用云端 diff | `codex apply` |

- 红线:merge 和 force-push 永远自己按。桌面/IDE 处理 PR 需 `gh auth login`。
- Worktree(桌面 App 功能):Local / Worktree(默认 detached HEAD,"Create branch here" 转正)/ Cloud 三模式;同一分支不能两处同时检出;存 `$CODEX_HOME/worktrees`,默认保留 15 个;Handoff 双向搬运线程,`.gitignore` 文件不跟走;setup 脚本(App 设置,存 `.codex/` 可提交)自动装依赖。
- 自动 commit 依赖实验开关 `codex_git_commit`(默认关);稳妥做法:Codex 拟 diff,自己敲 `git commit`。

## 13. 第三方模型

```toml
model_provider = "deepseek"
model = "<模型名>"

[model_providers.deepseek]
name = "DeepSeek"
base_url = "<base_url>"
env_key = "DEEPSEEK_API_KEY"
```

- 只支持 `wire_api = "responses"`(Chat Completions 已弃用);能否接通取决于对方是否实现 Responses API。
- 内置 provider id(`openai` `ollama` `lmstudio`)不可覆盖。本地模型:`codex --oss`(需 Ollama)。

## 14. 环境变量

| 变量 | 作用 |
|---|---|
| `CODEX_HOME` | 覆盖 `~/.codex` |
| `CODEX_NON_INTERACTIVE=1` | 安装脚本无人值守 |
| `CODEX_CA_CERTIFICATE` | 企业 CA 证书(回落 `SSL_CERT_FILE`) |
| `OPENAI_API_KEY` | API key 登录 |
| `VISUAL` / `EDITOR` | `Ctrl+G` 外部编辑器 |
| `HTTP_PROXY` / `HTTPS_PROXY` | 代理 |

CI 中 API key 不设 job 级 env,只传给需要的那一步。

## 15. 与 Claude Code 对照

| 维度 | Claude Code | Codex |
|---|---|---|
| 项目说明书 | `CLAUDE.md`(建议 <200 行) | `AGENTS.md`(32 KiB 字节上限) |
| 本地覆写 | `CLAUDE.local.md`(附加) | `AGENTS.override.md`(跳过同层) |
| 配置文件 | `~/.claude/settings.json`(JSON) | `~/.codex/config.toml`(TOML) |
| 权限心智 | 六档模式 + allow/ask/deny 白名单 | 沙箱 × 审批两个独立旋钮 |
| 默认档 | 固定 `default` | 按有无 Git 智能选 |
| 非交互 | `claude -p` | `codex exec`(默认只读) |
| 自动记忆 | 默认开 | 默认关,地区限制,异步生成 |
| 切权限入口 | `Shift+Tab` | `/permissions` |
| MCP 作用域 | `--scope` 参数 | 配置文件位置决定 |
| 第三方模型 | 改环境变量即可 | 改 `model_providers`,仅 Responses API |
| 独有 | checkpoints/rewind、`.worktreeinclude` | `AGENTS.override.md`、Chronicle、Rules、Computer Use |

## 16. 常见坑

| 坑 | 规避 |
|---|---|
| `workspace-write` 联不了网 | 网络默认关,需 `[sandbox_workspace_write] network_access = true` |
| `codex exec` 改不动文件 | 默认只读,显式 `--sandbox workspace-write` |
| 钩子不触发 | 新/改钩子默认跳过,`/hooks` 逐一信任(按定义哈希) |
| 子代理不拆活 | 绝不自动派生,须明说并行 |
| 权限档不生效 | Beta 权限档与 `sandbox_mode`/`--sandbox` 混用即回落老沙箱 |
| Windows diff 满屏 `^M` | `.gitattributes` 写 `* text=auto eol=lf` 或 `git config --global core.autocrlf false` |
| AGENTS.md 规矩没被听到 | 注水稀释;只写每轮必须的事实 |
| 额度烧太快 | 5 小时滚动窗口计;提示写具体、AGENTS.md 瘦身、MCP 按需开、杂活换小模型、`/new` 切活 |
| 模型选择 | 调 `model_reasoning_effort` 比换模型更立竿见影;`gpt-5.2`/`gpt-5.3-codex` 已弃用别写进配置 |
| Skills 触发写法 | 显式用 `$` 不是 `@`;没有 `trigger` 字段 |
