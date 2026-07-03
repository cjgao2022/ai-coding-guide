# 54 · 速查手册（QuickStart）

> 纯查询用途:只列命令、参数、配置、路径,不讲原理(原理见教程 01-53 篇)。版本相关条目以 `claude --version` 实际行为为准,`claude --help` 不是完整列表。

## 检索目录

| 想查什么 | 跳到 |
|---|---|
| 安装 / 升级 / 卸载 / 登录 | [§1](#_1-安装与登录) |
| 子命令、CLI flags | [§2](#_2-cli-命令与-flags) |
| Slash commands | [§3](#_3-slash-commands) |
| 键盘快捷键 | [§4](#_4-键盘快捷键) |
| 权限模式 / allow-deny 规则 / 沙箱 | [§5](#_5-权限与沙箱) |
| settings.json / CLAUDE.md 分层 | [§6](#_6-配置文件与分层) |
| Hooks | [§7](#_7-hooks) |
| MCP | [§8](#_8-mcp) |
| Subagent / Skill 文件格式 | [§9](#_9-subagent-与-skill) |
| 上下文 / 记忆 / 检查点 | [§10](#_10-上下文与检查点) |
| Headless / 脚本化 / 并行 | [§11](#_11-headless-与并行) |
| 模型与第三方接入 | [§12](#_12-模型配置) |
| 环境变量 | [§13](#_13-环境变量) |
| 故障排查 | [§14](#_14-故障排查) |

---

## 1. 安装与登录

| 目的 | 命令 | 备注 |
|---|---|---|
| 安装(macOS/Linux/WSL) | `curl -fsSL https://claude.ai/install.sh \| bash` | 首选,自带自动更新 |
| 安装(Windows PS) | `irm https://claude.ai/install.ps1 \| iex` | 同上 |
| 安装(Homebrew) | `brew install --cask claude-code` | 不自动更新 |
| 安装(WinGet) | `winget install Anthropic.ClaudeCode` | 不自动更新 |
| 安装(npm) | `npm install -g @anthropic-ai/claude-code` | Node 18+,禁止 sudo |
| 验证 | `claude --version` / `claude doctor` | |
| 登录 | `claude auth login`(或会话内 `/login`) | |
| 查登录状态 | `claude auth status` | 已登录退出码 0,未登录 1 |
| 升级 | `claude update` | |
| 钉死版本 | `claude install 2.1.x`(或 `stable`/`latest`) | 回退用 |
| 卸载(脚本装) | `rm -f ~/.local/bin/claude && rm -rf ~/.local/share/claude` | |
| 彻底清配置 | `rm -rf ~/.claude && rm ~/.claude.json` | 不可恢复 |

- 系统要求:macOS 13+ / Win10 1809+ / Ubuntu 20.04+ / Debian 10+ / Alpine 3.19+,4GB+ RAM。需 Pro/Max/Team/Enterprise 或 Console(API) 账号。
- 凭证位置:macOS Keychain;Linux `~/.claude/.credentials.json`(0600);Windows `%USERPROFILE%\.claude\.credentials.json`。
- 更新渠道:settings.json `"autoUpdatesChannel": "stable" | "latest"`;关自动更新:env `DISABLE_AUTOUPDATER=1`。
- 登录报 `organization has been disabled` → 残留 `ANTHROPIC_API_KEY` 顶掉了订阅登录,`unset ANTHROPIC_API_KEY`。

## 2. CLI 命令与 flags

### 子命令

| 命令 | 作用 |
|---|---|
| `claude` / `claude "提示"` | 交互会话(可带初始提示) |
| `claude -p "提示"` | headless,出结果即退出 |
| `claude -c` / `--continue` | 恢复当前目录最近会话 |
| `claude -r <id\|name>` / `--resume` | 恢复指定会话;不带参数弹选择列表 |
| `claude update` / `claude install <ver>` | 更新 / 装指定版本 |
| `claude auth login` / `auth status` | 登录管理 |
| `claude mcp add/list/remove` | MCP 管理(见 §8) |
| `claude agents` | 多会话控制面板(研究预览) |
| `claude daemon status` | 后台 supervisor 状态(未运行退出码 1) |
| `claude plugin init/validate/uninstall` | 插件管理 |
| `claude remote-control` | 远程控制 |

### flags

| 分类 | flag | 说明 |
|---|---|---|
| 会话 | `-p` / `--print` | headless 模式开关 |
| | `-c` / `--continue` | 续最近会话,可与 `-p` 叠用 |
| | `-r` / `--resume` | 按 ID/名字恢复 |
| | `-n` / `--name` | 给会话命名,之后 `--resume <名字>` |
| | `--fork-session` | 恢复时新建会话 ID |
| | `--session-id` | 指定会话 ID(须合法 UUID) |
| 模型 | `--model` | 别名(`sonnet`/`opus`)或完整名,覆盖默认 |
| | `--fallback-model` | 主模型过载时回退(仅 `-p` 和后台会话) |
| 权限 | `--permission-mode` | `default`/`acceptEdits`/`plan`/`auto`/`dontAsk`/`bypassPermissions` |
| | `--allowedTools` | 免提示放行,如 `"Read,Edit,Bash(git diff *)"` |
| | `--disallowedTools` | 拒绝规则 |
| | `--dangerously-skip-permissions` | 等同 bypassPermissions,仅隔离环境用 |
| 目录/配置 | `--add-dir` | 额外目录读写权(不加载该目录 `.claude/` 配置) |
| | `--settings` | 指定 settings 文件或内联 JSON |
| | `--setting-sources` | 限定加载 `user`/`project`/`local` |
| | `--mcp-config` | 从 JSON 加载 MCP server |
| | `--bare` | 跳过 hooks/skills/plugins/MCP/CLAUDE.md 自动发现;官方预告将成 `-p` 默认 |
| | `--plugin-dir` | 指定插件目录 |
| headless | `--output-format` | `text`(默认)/`json`/`stream-json` |
| | `--input-format` | `text`/`stream-json` |
| | `--max-turns` | 轮数上限,超限报错退出 |
| | `--max-budget-usd` | 花费上限(美元) |
| | `--append-system-prompt` | 默认系统提示后追加(九成场景用这个) |
| | `--system-prompt` | 整个替换默认系统提示 |
| | `--verbose` | 逐轮完整输出 |
| 其他 | `-v`/`--version`,`--ide`,`--debug`(可 `"api,mcp"`),`-w`/`--worktree`,`--bg`,`--from-pr <n>`,`--chrome` | |

### headless 常用组合

```bash
claude -p "总结项目" --output-format json | jq -r '.result'      # 取结果文本
cat error.log | claude -p "解释根因" > out.txt                    # 管道喂料(stdin 上限 10MB)
session=$(claude -p "开始审查" --output-format json | jq -r '.session_id')
claude -p "继续" --resume "$session"                              # 多轮串联
gh pr diff 42 | claude -p --append-system-prompt "You are a security engineer." --output-format json
```

退出码:`0` 成功,非 `0` 失败(`--max-turns` 超限、stdin 超 10MB 均非零退出)。

## 3. Slash Commands

| 分类 | 命令 |
|---|---|
| 项目设置 | `/init` `/memory` `/mcp` `/agents` `/permissions` |
| 会话控制 | `/model` `/clear` `/compact [指令]` `/context` `/plan` `/resume` `/rename` `/rewind` |
| 交付检查 | `/diff` `/review` `/security-review` `/code-review [--fix]` |
| 配置诊断 | `/config` `/doctor`(按 `f` 自动修) `/status` `/usage` `/usage-credits` `/debug [描述]` |
| 功能开关 | `/skills` `/hooks`(只读) `/sandbox` `/effort` `/fast` `/goal` `/keybindings` `/theme` `/terminal-setup` |
| 其他 | `/help` `/chrome` `/desktop` `/mobile` `/bg` `/upgrade` `/reload-plugins` `/feedback` `/heapdump` |

- 已移除:`/output-style`(v2.1.91),改用 `/config` 或 settings.json `outputStyle` 字段。
- 自定义命令:`.claude/commands/<name>.md`(项目)或 `~/.claude/commands/<name>.md`(个人);已并入 Skill 系统,与 `.claude/skills/<name>/SKILL.md` 同名时 Skill 优先。占位符 `$ARGUMENTS`、`$0`/`$1`;`` !`command` `` 执行前动态注入。

## 4. 键盘快捷键

| 键 | 作用 |
|---|---|
| `Esc` | 中断当前回答/工具调用 |
| `Esc Esc`(空输入框) | 回退菜单;有文字时只清空文字 |
| `Ctrl+C` | 任务中断;空输入框首次清空、二次退出 |
| `Ctrl+D` | 退出(EOF) |
| `Shift+Tab` | 循环权限模式(部分 Windows 环境为 `Alt+M`) |
| `Ctrl+L` | 重绘屏幕 |
| `Ctrl+R` | 反向搜索历史 |
| `Ctrl+O` | 切换详细转录视图 |
| `Ctrl+G` | 外部编辑器写长指令 |
| `Ctrl+B` | 后台运行长命令(tmux 需按两次) |
| `Alt/Option+P` | 切模型 |
| `Alt/Option+T` | 切换扩展思考 |
| `Alt/Option+O` | fast mode |

多行输入:`\`+Enter / `Ctrl+J` / `Shift+Enter`(VS Code 等终端先跑 `/terminal-setup`)。
自定义:`~/.claude/keybindings.json`(`Ctrl+C`/`Ctrl+D`/`Ctrl+M` 硬编码不可改)。

## 5. 权限与沙箱

### 权限模式

| 模式 | 行为 |
|---|---|
| `default` | 只读自动,改动/命令均询问 |
| `acceptEdits` | 文件编辑与常见 fs 命令(`mkdir/touch/rm/mv/cp/sed`)免问 |
| `plan` | 纯只读,不改代码 |
| `auto` | 后台分类模型逐项审查(研究预览;`defaultMode:"auto"` 只能设在用户层) |
| `dontAsk` | 仅放行预批准工具,其余自动拒绝 |
| `bypassPermissions` | 全部跳过;无提示注入防护,仅隔离容器 |

### 规则语法(`permissions.allow` / `ask` / `deny`)

```
Bash                        # 整个工具
Bash(npm run build)         # 精确
Bash(npm run *)             # 前缀(空格敏感:`ls *` 匹配 `ls -la` 不匹配 `lsof`)
Read(./.env)
WebFetch(domain:github.com)
```

- 优先级 `deny > ask > allow`,首个匹配生效。
- 数组型设置(`allow`/`deny`)跨层**合并去重**;单值字段(`model`、`defaultMode`)才是覆盖。
- `Read`/`Edit` 的 deny 不拦子进程直接读文件(如 Python `open()`);OS 级强制需开沙箱。沙箱默认仍放行 `~/.aws/credentials`、`~/.ssh/`,要拦需显式加 `denyRead`。
- bypass 模式内置护栏:删 `/` 或家目录仍提示;root/sudo 下拒绝启动该模式。

### 沙箱

开启:`/sandbox` 或 settings.json `sandbox.enabled`。macOS 用 Seatbelt(开箱即用);Linux/WSL2 需 `bubblewrap`+`socat`;原生 Windows 不支持。只隔离 Bash 子进程,不含内置文件工具/MCP/Hooks。

### git 权限基线(推荐)

```json
{ "permissions": {
  "allow": ["Bash(git status)", "Bash(git diff *)", "Bash(git log *)"],
  "ask":   ["Bash(git commit *)"],
  "deny":  ["Bash(git push *)"] } }
```

## 6. 配置文件与分层

### settings.json

| 层级 | 路径 | 进 git |
|---|---|---|
| 受管 | MDM/注册表/服务端 | n/a |
| 用户 | `~/.claude/settings.json` | 否 |
| 项目 | `.claude/settings.json` | 是 |
| 本地 | `.claude/settings.local.json` | 否(自动 gitignore) |

优先级:受管 > CLI `--settings` > 本地 > 项目 > 用户。

### CLAUDE.md

| 层级 | 路径 | 进 git |
|---|---|---|
| 企业 | macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`;Linux `/etc/claude-code/CLAUDE.md` | n/a |
| 用户 | `~/.claude/CLAUDE.md` | 否 |
| 项目 | `./CLAUDE.md` 或 `./.claude/CLAUDE.md` | 是 |
| 本地 | `./CLAUDE.local.md` | 否(自行 gitignore) |
| 子目录 | 任意子目录 `CLAUDE.md` | 是(按需加载) |

- 全部拼接而非覆盖;`/compact` 后项目根 CLAUDE.md 自动重读;建议 <200 行。
- `@path` 导入语法可用,递归深度 4,导入内容全量计入上下文(不省 token)。
- 生成:会话内 `/init`(已有文件不覆盖,只给建议)。

### `.claude/` 目录

`settings.json` `settings.local.json` `agents/` `skills/` `commands/` `output-styles/` `rules/` `worktrees/`

## 7. Hooks

事件:`PreToolUse`(可拦截) `PostToolUse` `UserPromptSubmit` `Stop` `SessionStart` `SessionEnd` `PreCompact` `PostCompact` `SubagentStart` `SubagentStop` `Notification` `FileChanged` `ConfigChange`(全集约 30 个)

```json
{ "hooks": { "PostToolUse": [ {
  "matcher": "Edit|Write",
  "hooks": [{ "type": "command",
    "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write" }] } ] } }
```

| 项 | 规则 |
|---|---|
| matcher | 工具名过滤;`\|`=OR;留空=全匹配;**大小写敏感**(`Bash`/`Edit`) |
| type | `command` / `http` / `mcp_tool` / `prompt` / `agent` |
| exit 0 | 放行 |
| exit 2 | **阻断**(唯一能阻断的码,stderr 反馈给 Claude;`exit 1` 不阻断) |
| 其他码 | 非阻断错误,操作继续 |
| stdout JSON | `hookSpecificOutput.permissionDecision`: `deny`/`ask`/`allow`/`defer`(与 exit-code 阻断互斥) |

- Hook 只能收紧不能放宽;deny-hook 在 bypass 模式下仍生效。
- `$CLAUDE_PROJECT_DIR` 指向项目根。
- 调试:`claude --debug hooks`,日志 `~/.claude/debug/<session>.txt`;全局关闭 `"disableAllHooks": true`。

## 8. MCP

```bash
claude mcp add playwright -- npx -y @playwright/mcp@latest             # stdio(默认)
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp      # http(推荐)
claude mcp add --scope project --transport http github https://api.githubcopilot.com/mcp/
claude mcp list / remove <name> / reset-project-choices
```

选项必须写在 server 名之前;`--` 分隔 server 名与启动命令。SSE 传输已废弃。

| Scope | 范围 | 存储 |
|---|---|---|
| `local`(默认) | 当前项目私有 | `~/.claude.json` |
| `project` | 团队共享 | 项目根 `.mcp.json`(进 git) |
| `user` | 所有项目私有 | `~/.claude.json` 顶层 |

`.mcp.json` 格式:

```json
{ "mcpServers": {
  "playwright": { "type": "stdio", "command": "npx", "args": ["-y", "@playwright/mcp@latest"] },
  "sentry":     { "type": "http", "url": "https://mcp.sentry.dev/mcp" } } }
```

- 必须放项目根目录(不是 `.claude/` 下);改动需重启会话。
- 项目 scope 首次使用需批准;每个 MCP 工具首次调用需单独批准。会话内 `/mcp` 查状态。

## 9. Subagent 与 Skill

### Subagent(`.claude/agents/<name>.md` 项目级;`~/.claude/agents/` 个人级)

```markdown
---
name: code-reviewer
description: Reviews code for quality and best practices
tools: Read, Glob, Grep        # 省略=继承全部
model: sonnet                   # 默认 inherit
permissionMode: plan            # 可选,六种模式
---
系统提示正文……
```

- 必填仅 `name`+`description`。手写文件需重启会话;`/agents` UI 创建即时生效。
- 触发:description 自动委派 / 自然语言点名 / `@agent-<name>` 强制。

### Skill(目录 + `SKILL.md`)

```
my-skill/
├── SKILL.md          # 必需
├── template.md       # 可选支持文件
└── scripts/xx.sh
```

frontmatter 字段:

| 字段 | 说明 |
|---|---|
| `name` / `description` | 必填;description 决定自动触发,与 `when_to_use` 合计 ≤1536 字符 |
| `disable-model-invocation: true` | 仅手动 `/name` 触发 |
| `user-invocable: false` | 仅 Claude 可调用 |
| `version` | 可选 |

- 渐进式披露:平时只加载 description,调用才加载正文,加载后驻留上下文 → 正文建议 <500 行。
- 位置:`~/.claude/skills/`(个人)、`.claude/skills/`(项目)、插件内、企业受管;同名优先级 企业 > 个人 > 项目。
- 新建顶层目录需重启会话;`/skills` 查看开关;`/doctor` 检查 description 是否被截断。

## 10. 上下文与检查点

| 命令 | 作用 |
|---|---|
| `/compact [指令]` | 压缩历史(有损,可带保留指令) |
| `/clear` | 清空会话,不动 CLAUDE.md/记忆 |
| `/context` | 可视化上下文占用 |
| `/usage` | token 用量/花销 |
| `/memory` | 列出并编辑已加载的 CLAUDE.md/规则文件 |
| `/rewind` 或空输入框 `Esc Esc` | 检查点回溯 |

- 窗口约 200K token;`[1m]` 模型 100 万。最大开销来源是读取的文件。
- auto-compact 临近上限自动触发,不可控时机;关闭:env `DISABLE_AUTO_COMPACT`。
- 检查点:每条 prompt 前自动快照,存 `~/.claude/file-history/<session>/`,保留期 `cleanupPeriodDays`(默认 30 天)。**只覆盖** Edit/Write/MultiEdit 改动;不含 bash 改动(`rm`/`mv`)、其他会话、真实副作用——这些操作前先 `git commit`。
- 经验:任务间 `/compact`,跨任务 `/clear`;纠正两次无效 → `/clear` 重写;高输出工作交 subagent 隔离。

## 11. Headless 与并行

| 目的 | 命令 |
|---|---|
| worktree 会话 | `claude -w <name>`(建在 `.claude/worktrees/<name>/`,该目录需先跑过一次 claude 建信任) |
| 后台会话 | `claude --bg "任务"`;`claude agents` 查看,`claude attach`/`logs`/`stop` |
| PR 追踪 | `claude --from-pr <number>` |

- `.claude/worktrees/` 加进 `.gitignore`;`.worktreeinclude`(gitignore 语法)声明要复制进 worktree 的未跟踪文件(如 `.env`)。
- 只并行不碰同一文件的独立任务;人工并行 3-5 个为宜。
- CI 脚本务必加 `--max-turns` / `--max-budget-usd` 当保险丝;登录检查:`claude auth status || exit 1`。

## 12. 模型配置

- 别名:`default` `opus` `sonnet` `haiku` `best` `opusplan`(Plan 用 Opus、执行切 Sonnet) `opus[1m]` `sonnet[1m]`。
- 优先级:`/model` > `--model` > `ANTHROPIC_MODEL` env > settings.json `model`。

第三方接入(以 DeepSeek 为例):

```bash
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN=<key>
export ANTHROPIC_MODEL=deepseek-chat
```

- `ANTHROPIC_BASE_URL` 指向非官方主机时 MCP 工具搜索默认关闭。
- 认证优先级(高→低):云厂商(Bedrock/Vertex/Foundry) > `ANTHROPIC_AUTH_TOKEN` > `ANTHROPIC_API_KEY` > `apiKeyHelper` > `CLAUDE_CODE_OAUTH_TOKEN` > `/login` 订阅。

## 13. 环境变量

| 变量 | 作用 |
|---|---|
| `ANTHROPIC_API_KEY` | API key(会覆盖订阅登录) |
| `ANTHROPIC_AUTH_TOKEN` | Bearer token,优先级高于 API_KEY |
| `ANTHROPIC_BASE_URL` | 请求目标地址(第三方接入) |
| `ANTHROPIC_MODEL` | 默认模型 |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` / `_SONNET_MODEL` / `_HAIKU_MODEL` | 别名解析目标 |
| `CLAUDE_CODE_SUBAGENT_MODEL` | 子代理统一模型 |
| `CLAUDE_CODE_EFFORT_LEVEL` | `low/medium/high/xhigh/max/auto`,覆盖 `/effort` |
| `CLAUDE_CODE_OAUTH_TOKEN` | CI 长期令牌 |
| `API_TIMEOUT_MS` | 单请求超时(默认 600000) |
| `BASH_DEFAULT_TIMEOUT_MS` | bash 超时(默认 120000) |
| `CLAUDE_CODE_MAX_RETRIES` | 重试次数(默认 10) |
| `DISABLE_TELEMETRY=1` / `DO_NOT_TRACK=1` | 关遥测 |
| `DISABLE_AUTOUPDATER=1` | 关自动更新 |
| `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` | 遥测+更新+反馈+错误上报一键关 |
| `CLAUDE_CONFIG_DIR` | 覆盖 `~/.claude`(多账号) |
| `DISABLE_AUTO_COMPACT` | 关自动压缩 |
| `USE_BUILTIN_RIPGREP=0` | `@file` 补全失效排查 |
| `HTTPS_PROXY` / `HTTP_PROXY` / `NO_PROXY` / `NODE_EXTRA_CA_CERTS` | 代理/证书 |

已弃用:`ANTHROPIC_SMALL_FAST_MODEL` → `ANTHROPIC_DEFAULT_HAIKU_MODEL`。启动时读取,改动需重启;此表非穷举(官方全表上百个)。

## 14. 故障排查

| 症状 | 处置 |
|---|---|
| 反复要求登录 / 403 | `unset ANTHROPIC_API_KEY` 后 `/status` 验证 |
| hook 不触发 | matcher 大小写(`Bash`/`Edit`);必须在 settings.json `hooks` 键下;`exit 1` 不阻断要 `exit 2` |
| `.mcp.json` 不生效 | 须在项目根目录;改后重启会话 |
| MCP 排查 | `claude --debug mcp`;会话内 `/mcp` |
| 卡顿 / 内存高 | 定期 `/compact`;构建目录加 `.gitignore`;`/heapdump` |
| API 5xx | 自动退避重试 10 次,可见报错=重试耗尽 |
| 配额 / prompt 过长 | `/usage` 查看;`/compact` 或 `/clear` |
| 怀疑自身配置问题 | `cd /tmp && CLAUDE_CONFIG_DIR=/tmp/claude-clean claude` 干净对比 |
| 通用调试 | `claude --debug`、`claude --debug hooks`、`/debug [描述]`、`claude doctor` |
