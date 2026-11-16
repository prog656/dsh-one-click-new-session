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
- 第三方桌面端自定义的目录，例如 `D:/Apps/deepseek-harness/profiles/desktop`

---

## 自动安装

> **重复安装会被拦下。** 安装器检测到该 profile 已注册本插件时会直接停止并把原因打印出来（这是故意的，防止误覆盖现有配置）。确需覆盖加 `--force`；按钮文案会按 `--lang` 指定的语言重写，不带参数时是英文。

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
3. 把包的四个文件写到 `profile/node_modules/dsh-one-click-new-session/`，并把本机真实的 scratch 路径替换进 `lib/client.js` 的 `__DSH_BLANK_SESSION_DIR__` 占位符；
4. 在 `profile/package.json` 里加一条 `dependencies` 和一条 `dsh.profile.bundles`。

**装完必须完全退出并重启 DSH**（不是刷新页面）。DSH 启动时才读 bundle 名册。

---

## 手动安装

不想跑脚本、或脚本探测不到 profile 时，按这五步：

**1. 建目录**

新建任意一个空文件夹，例如 `C:\Users\你\dsh-blank-sessions`（Windows）或 `~/dsh-blank-sessions`（macOS/Linux）。记住它的**绝对路径**。

**2. 复制插件文件**

把仓库根目录下这四个文件复制到：

```
<profile>/node_modules/dsh-one-click-new-session/
├── package.json
├── cordis.patch.yml
└── lib/
    ├── index.js
    └── client.js
```

**3. 不用手改路径**

`lib/client.js` 里保留的是占位符 `__DSH_BLANK_SESSION_DIR__`。DSH 启动、host 端插件被加载时，`lib/index.js` 会把真实路径烘焙进去并写回磁盘，所以**你不需要手动改任何路径**；`install.mjs` 做的是同一件事，两条路径都幂等。

想换目录，设环境变量 `DSH_BLANK_SESSION_DIR` 即可，不必改源码。界面文案在 `lib/client.js` 的 `SCRATCH_TITLE` / `LABEL` / `HINT` / `FAIL_LABEL` 四个常量里。

**4. 注册 bundle**

编辑 `<profile>/package.json`，两处：

```json
{
  "dependencies": {
    "dsh-one-click-new-session": "1.1.5"
  },
  "dsh": {
    "profile": {
      "bundles": [
        "dsh-one-click-new-session"
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
| 按钮变红 `Scratch directory unresolved` | 占位符没被替换：确认 `lib/index.js` 和 `lib/client.js` 在同一目录（host 端要读得到才能烘焙），或显式设 `DSH_BLANK_SESSION_DIR` |
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
