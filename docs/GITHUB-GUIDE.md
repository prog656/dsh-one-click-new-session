# 从零上手 GitHub（照着做即可）

这份文档假设你**从来没用过 GitHub**。每一步都有【验收标准】，做完能立刻看到结果。

---

## 0. 先认词（30 秒）

| 词 | 大白话 | 在你的项目里对应什么 |
| --- | --- | --- |
| Repository / repo（仓库） | 一个项目文件夹 + 它的全部历史 | `dsh-one-click-new-session` |
| README | 仓库首页显示的介绍 | `README.md`、`README.zh-CN.md` |
| Star ⭐ | 收藏 / 认可 | 别人觉得有用点一下 |
| Fork | 把别人的仓库复制一份到自己账号 | 别人想改代码时用 |
| Watch | 订阅动态 | 关注更新 |
| Issue | 提问 / 报 bug / 提需求 | `.github/ISSUE_TEMPLATE/` |
| Pull Request (PR) | 「我改好了，请你合并」 | `.github/PULL_REQUEST_TEMPLATE.md` |
| Release | 一个带版本号的正式发布包 | `v1.0.0` + 附件 zip |
| Tag | 给某一次提交贴的版本标签 | `v1.0.0` |
| Topic | 仓库的标签/关键词，用来被搜到 | `dsh-plugin` 等 |
| Commit | 一次保存（带一句说明） | 「Add MIT license」等 |
| LICENSE | 别人能不能用你的代码 | `LICENSE`（MIT） |
| About | 仓库右侧那一小段简介 | 一句话描述 + topics |

> **没有 LICENSE 的公开仓库＝「保留所有权利」，别人 legally 不能用。** 已经有 MIT 了，别删。

---

## 1. 登录并确认用户名

### 1.1 已经有账号（从这开始）

1. 浏览器打开 <https://github.com/login>。
2. 输入账号 / 邮箱 + 密码，点绿色的 **Sign in**。
3. 登录后看**页面右上角**的圆形头像，**点一下**；弹出菜单里点 **Your profile**。
4. 看浏览器**地址栏**：`https://github.com/你的用户名`，最后那段就是你的用户名，复制记好。

【验收标准】地址栏 `github.com/` 后面就是你的用户名；页面顶部是你的头像。

### 1.2 没有账号才做（已有账号跳过）

1. 打开 <https://github.com>，点 **Sign up**。
2. 填邮箱、密码、**用户名**。用户名会出现在所有链接里（`github.com/你的用户名/...`），起个能长期用的，别带奇怪字符。
3. 验证邮箱（收邮件点链接）。
4. 如果网页打不开或很慢，是网络问题，不是你操作错了；换网络或稍后再试。

【验收标准】同 1.1。

---

## 2. 把占位用户名换成你自己的（**别跳过**）

仓库里有几处链接写的是 `YOUR_USERNAME`（徽章、issue 链接、`package.json`）。不替换的话，别人点徽章会跳到 404。

**方式一（推荐，不用碰命令行）**：把用户名发给帮你打包的人，直接替换好并重新打包 zip，你从第 3 步开始做。

**方式二（自己来）**：在仓库根目录执行

```sh
node setup-username.mjs 你的GitHub用户名
```

不会开命令行的话，按这四步：

1. 按 `Win + E` 打开文件资源管理器；
2. 在**地址栏**粘贴仓库文件夹路径，回车进入；
3. **再点一下地址栏**，输入 `cmd`，回车 —— 弹出一个黑色窗口；
4. 在黑窗口里粘贴上面那条命令（把用户名换成你的），回车。

它会扫描全部文本文件并替换，最后打印改了几个文件。

【验收标准】输出里显示 `Replaced in 5 files`，且 `README.md`、`CHANGELOG.md`、`package.json`、`.github/ISSUE_TEMPLATE/config.yml` 里的链接都变成了你的用户名。（`docs/GITHUB-GUIDE.md` 和脚本自身里剩下的词是教学示例，脚本已特意跳过，不用管。）

---

## 3. 创建仓库

1. 右上角 **＋** → **New repository**（或直接开 <https://github.com/new>）。
2. **Repository name** 填 `dsh-one-click-new-session`。
3. **Description** 填：`One click opens a blank DSH chat without picking a workspace`（这句话会被搜索引擎索引，很重要）。
4. 选 **Public**（私有仓库没人看得到，也不会有 star）。
5. **关键：下面三个初始化选项一个都不要勾**（Add a README / Add .gitignore / Choose a license）。因为文件本地已经准备好了，勾了会产生冲突。
6. 点 **Create repository**。

【验收标准】看到 "Quick setup" 页面，提示仓库是空的。

---

## 4. 上传文件（不用装 Git、不用命令行）

1. 在空仓库页面点 **Add file** → **Upload files**（或 `uploading an existing file` 那个链接）。
2. 打开本仓库文件夹，**选中里面的全部内容**（所有文件 + `.github`、`docs`、`src` 三个文件夹），拖进网页的虚线框。
   - ⚠️ **不要连最外层文件夹一起拖**，否则首页会多出一层目录、README 不会自动显示。要拖的是「文件夹里面的东西」。
   - ⚠️ `.github` 和 `.gitignore` 是点号开头的隐藏项，别漏掉。Windows 资源管理器需要打开「显示隐藏的项目」。
3. 等进度条走完，下面 **Commit changes** 的标题填 `Initial release: one-click new session`。
4. 点 **Commit changes**。

【验收标准】回到仓库首页，`README.md` 的内容直接渲染在文件列表下方，能看到徽章和示意图；左侧文件列表里有 `LICENSE`、`src/`、`docs/`、`install.mjs`。

> **漏了 `.github` 怎么办**：不用重传。仓库首页 → **Add file** → **Create new file** → 文件名框输入 `.github/ISSUE_TEMPLATE/bug_report.md`（输入斜杠会自动建目录）→ 把本地同名文件的内容粘进去 → **Commit changes**。另外两个模板同理，路径分别是 `.github/ISSUE_TEMPLATE/feature_request.md`、`.github/ISSUE_TEMPLATE/config.yml`、`.github/PULL_REQUEST_TEMPLATE.md`。

---

## 5. 填 About 和 Topics（**决定别人能不能搜到你**）

1. 仓库首页右侧 **About** 旁边点小齿轮 ⚙️。
2. Description 填第 3 步那句英文；再补一句中文也行。
3. **Topics** 逐个输入并回车：`dsh-plugin`、`dsh`、`deepseek-harness`、`cordis-plugin`、`deepseek`、`chat`、`productivity`、`plugin`。
   > `dsh-plugin` 是 DSH 官方生态的发现入口，必须加。
4. Website 可先留空，以后有演示页再填。
5. Save changes。

【验收标准】首页右侧出现描述和一串可点击的 topic 标签；点 `dsh-plugin` 能看到同类插件列表，你的仓库也在其中（可能有几分钟延迟）。

---

## 6. 发第一个 Release（别人「下载安装」的入口）

1. 仓库首页右侧点 **Releases** → **Create a new release**。
2. **Choose a tag** 输入 `v1.0.0`，选 `Create new tag: v1.0.0 on publish`。
3. 标题填 `v1.0.0 — One-click workspace-free chat`。
4. 说明框里贴：
   ```md
   ## What's new
   - One click opens a blank, ready-to-type chat, independent of the selected workspace.
   - Idempotent scratch workspace, blank-session reuse, visible failure state.
   - Cross-platform installer (`node install.mjs`), Chinese UI via `--lang zh`.

   ## Install
   Download the zip below, unzip, run `node install.mjs` (or double-click `install.bat` on Windows), then restart DSH.
   ```
5. 把 `dsh-one-click-new-session-v1.0.0.zip` **拖到 "Attach binaries" 区域**。这个压缩包我已单独打好放在仓库文件夹**外面**，是给 Release 用的；第 4 步上传文件时不要把它拖进去。
6. 点 **Publish release**。

【验收标准】Releases 页面出现 `v1.0.0`，下面有一个可下载的 zip；**下载次数**会随别人下载增长（这是比 star 更真实的用量信号）。

> 补充：GitHub 自动为每个 tag 生成 Source code (zip/tar.gz)，所以即使不上传附件，别人也能从 `Code → Download ZIP` 拿到源码。

---

## 7. 别人怎么拿到你的插件

| 方式 | 操作 | 适合谁 |
| --- | --- | --- |
| Release 附件 zip | Releases → 下载 zip → 解压 → `node install.mjs` | 普通用户，**推荐** |
| Download ZIP | 首页绿色 `Code` → `Download ZIP` | 想看最新版源码的人 |
| `git clone` | `git clone https://github.com/你的用户名/dsh-one-click-new-session.git` | 开发者 / 想提 PR 的人 |

三种都要在 README 里写清楚（已经写了两种，clone 可以补在 Issue 模板里）。

---

## 8. 以后怎么改

**最简单**：在仓库里点开某个文件 → 右上角铅笔 ✏️ → 改 → 下面 `Commit changes` → 完成。适合改 README、错别字。

**进阶（本地改完再推）**，只需要第一次配置一次：

```sh
git clone https://github.com/你的用户名/dsh-one-click-new-session.git
cd dsh-one-click-new-session
# ...改文件...
git add .
git commit -m "fix: correct scratch path on macOS"
git push
```

【验收标准】刷新仓库首页能看到新内容，且首页出现最近一次 commit 的说明。

---

## 9. 常见坑

| 现象 | 原因 / 处理 |
| --- | --- |
| 首页没显示 README | 上传时多套了一层文件夹；或文件名不是根目录的 `README.md` |
| 徽章是坏的 / 点过去 404 | 第 2 步没替换 `YOUR_USERNAME` |
| 右侧没显示 MIT | `LICENSE` 文件没在根目录，或文件名写成了 `LICENSE.md`（也能识别，但根目录纯 `LICENSE` 最稳） |
| 中文乱码 | 文件请以 UTF-8 保存；`.bat` 是纯 ASCII 的，不会乱码 |
| 上传时提示文件太大 | 单个文件别超过 100 MB；别把 `node_modules`、`.exe`、`app.asar` 传上去 |
| 有人提 issue 但描述不清 | 已在 `.github/ISSUE_TEMPLATE/` 放好模板，引导对方填 DSH 版本、系统、复现步骤 |
| **别人装了没反应** | 九成是没重启 DSH；或 `--profile` 指错了目录。见 [INSTALL.md](INSTALL.md) |

---

## 10. 完整验收清单

- [ ] 个人主页能打开，用户名确定
- [ ] `YOUR_USERNAME` 已全部替换
- [ ] 仓库是 Public，首页能直接看到 README + 示意图
- [ ] LICENSE 被识别为 MIT
- [ ] About 有描述，`dsh-plugin` 等 topics 已加
- [ ] `v1.0.0` Release 存在且带 zip 附件
- [ ] 用另一台机器（或让朋友）下载 zip 跑一次 `install.mjs`，能出按钮
- [ ] Issues 页面能新建，模板自动带出来

做到这些，你的项目就已经「正式开源、可被下载、可被搜到」了。下一步是怎么让人看见 → [PROMOTION.md](PROMOTION.md)。
