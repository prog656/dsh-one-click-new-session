# 安装与排障

## 前置条件

| 项 | 要求 |
| --- | --- |
| DeepSeek Harness | `>= 0.1.7-rc.1`（开发基于 `0.2.x`） |
| Node.js | 18+（DSH 本身依赖 Node，一般已具备） |
| 权限 | 能写入 DSH profile 目录；`Program Files` 下可能需要以管理员身份运行 |
| 系统 | Windows（已实测）/ macOS / Linux（安装脚本跨平台） |

**先确认 profile 目录在哪**：它是一个含 `package.json`、且 `package.json` 里有 `dsh.profile.bundles` 数组的目录。常见位置：

- `~/.dsh/profiles/web`
- `~/.dsh/profiles/desktop`
- `%APPDATA%/@deepseek-ai/dsh-desktop/profiles/desktop`
- 第三方桌面端，例如 `D:/Program Files (x86)/deepseek harness skins/dsh-home/profiles/desktop`

---

## 自动安装

> **注意：如果你就是这台机器的作者，插件已经装好了，不用再装。** 再跑一次会被"已安装"保护拦下（这是故意的）。想覆盖测试加 `--force`，但会把按钮文案改成英文版。

在仓库根目录：

```sh
node install.mjs --dry-run                  # 先看计划，不写任何文件
node install.mjs                            # 正式安装，英文界面
node install.mjs --lang zh                  # 中文界面
```

Windows 双击 `install.bat` 等价于 `node install.mjs --lang zh`。

| 参数 | 作用 |
| --- | --- |
| `--profile <dir>` | 手动指定 profile 目录（自动探测不到时用） |
| `--dir <path>` | 指定免工作区对话的目录，默认 `~/dsh-blank-sessions` |
| `--lang en\|zh` | 按钮文案与控制台语言 |
| `--dry-run` | 只打印计划，不写文件 |
| `--force` | 覆盖已有安装（默认会拒绝，保护你现有配置） |
| `--uninstall` | 移除注册并删除插件目录，**保留会话数据** |

脚本会做四件事：

1. 探测 / 校验 profile 目录；
2. 创建 scratch 目录；
3. 把 `src/` 四个文件写到 `profile/node_modules/@local/dsh-one-click-new-session/`，其中 `lib/client.js` 的 `__DSH_BLANK_SESSION_DIR__` 被替换成你的真实绝对路径；
4. 在 `profile/package.json` 里加一条 `dependencies` 和一条 `dsh.profile.bundles`。

**装完必须完全退出并重启 DSH**（不是刷新页面）。DSH 启动时才读 bundle 名册。

---

## 手动安装

不想跑脚本、或脚本探测不到 profile 时，按这五步：

**1. 建目录**

新建任意一个空文件夹，例如 `C:\Users\你\dsh-blank-sessions`（Windows）或 `~/dsh-blank-sessions`（macOS/Linux）。记住它的**绝对路径**。

**2. 复制插件文件**

把 `src/` 里的四个文件复制到：

```
<profile>/node_modules/@local/dsh-one-click-new-session/
├── package.json
├── cordis.patch.yml
└── lib/
    ├── index.js
    └── client.js
```

**3. 改 `lib/client.js` 顶部这一行**

```js
const SCRATCH_DIR = "__DSH_BLANK_SESSION_DIR__";
```

换成你的绝对路径，**用正斜杠、末尾不要带斜杠**：

```js
const SCRATCH_DIR = "C:/Users/you/dsh-blank-sessions";   // Windows
const SCRATCH_DIR = "/home/you/dsh-blank-sessions";       // macOS / Linux
```

> 如果这一行没改，按钮会变红并显示 `SCRATCH_DIR is not configured`，不会静默失败。
> 顺手可以改 `SCRATCH_TITLE`（侧边栏组名）和 `LABEL`（按钮文字）。

**4. 注册 bundle**

编辑 `<profile>/package.json`，两处：

```json
{
  "dependencies": {
    "@local/dsh-one-click-new-session": "1.0.0"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "@local/dsh-one-click-new-session"
      ]
    }
  }
}
```

（原有条目全部保留，只追加这两项。）

**5. 完全退出并重启 DSH**

---

## 验证清单

| 检查 | 期望结果 |
| --- | --- |
| 侧边栏展开时底部 | 出现「新建对话 / New chat」按钮，紧挨设置 |
| 点一下 | 主视图立刻变成空白新对话，侧边栏出现 `Quick Chats` / `临时对话` 分组并高亮新会话 |
| 输入框 | **可以打字**，「发送消息」按钮可点 |
| 连点两次 | 不会多出一串空会话（空白会话被复用） |
| 会话落盘 | `<scratch>` 对应的会话目录里出现新的 session 文件夹 |
| 控制台 | `[dsh-one-click-new-session] client plugin ready` |

---

## 排障

| 现象 | 原因 / 处理 |
| --- | --- |
| 完全没有按钮 | ① 没重启 DSH；② `bundles` 没加；③ 侧边栏处于收起窄条（宿主隐藏整个底部动作区，展开即可）；④ profile 指错了 |
| 按钮变红 `SCRATCH_DIR is not configured` | 没跑安装脚本，手动把第 3 步那行填好 |
| 按钮变红 `Could not create scratch workspace` | 目录不存在或不可写；建好目录，或换到用户目录下 |
| 能跳转但输入框禁用了 | 说明会话没挂上工作区；检查 `workspaces.create` 是否被权限拦住，见控制台错误 |
| 启动报错 / 锁超时 | 强杀进程会留下 `.lock`，删掉 profile 下的 `*.lock` 再启动 |
| 改了源码没生效 | 有**两处副本**（源包与 `node_modules` 副本）时需同步；只改你实际注册的那个目录 |
| 中文乱码 | 所有源码文件请保持 UTF-8；`install.bat` 是纯 ASCII，不会乱码 |

---

## 卸载

```sh
node install.mjs --uninstall
```

会移除 `dependencies` 与 `bundles` 条目、删除插件目录；**scratch 目录与会话数据保留**，需要的话手动删除。然后重启 DSH。
