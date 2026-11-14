# 怎么让人看见、把 star 做起来

## 先说大实话

**1000 star 对这类小插件不是"照着清单做就能到"的目标。** 它是结果，不是步骤。

- `deepseek-ai/deepseek-harness`（官方，MIT）：约 **280,000** star
- `awesome-dsh-plugin/awesome-dsh-plugin`（社区插件精选）：约 **24,600** star
- `dsh-market/dsh-market`（插件市场）：约 **12,300** star
- `dsh-plugin` topic：数千个仓库，且大量高 star 项目只是"贴标签蹭流量"，竞争很激烈

同类**单点小插件**通常是 **几 ~ 几百 star**。一个更现实的目标是：**先到 50，再到 200，运气 + 官方转发才可能破 1000**。如果 DSH 官方把它收进精选 / 在官方社媒提一次，一夜上千是可能的，但那不属于你能控制的变量。

所以正确的思路是：**把「能被发现」的每一条通路都铺好，把「点进来愿不愿意 star」的转化率做高，然后持续更新。** 下面全是可执行动作。

---

## 一、仓库自身：决定「点进来的人会不会 star」

访客在前 10 秒决定要不要点星。这四件事权重最高：

1. **首屏一句话说清痛点**（已有）："One click → a blank chat, no workspace picker"。别用「基于 cordis 的…」开头。
2. **可视化证据**（已有 `docs/demo.svg`）：示意图比三段文字管用。如果你有真机截图或 10 秒 GIF，替换掉示意图，转化率还会更高。
3. **安装不超过 5 步**（已有）：`node install.mjs` 一条命令。
4. **如实写出限制**（已有 Known limitations）：反而增加信任；藏着掖着，别人装完踩坑就来差评。

另外：README 里可以放一句克制的 CTA：`If this saves you a click, a ⭐ helps others find it.` —— 放在结尾，别放开头。

---

## 二、生态内渠道（**性价比最高，优先做**）

按优先级排：

| # | 动作 | 具体怎么做 | 预期 |
| --- | --- | --- | --- |
| 1 | 打 `dsh-plugin` topic | 见 GITHUB-GUIDE 第 5 步 | 进入官方发现池，长期流量 |
| 2 | 投稿 Awesome 列表 | 去 `awesome-dsh-plugin/awesome-dsh-plugin`，先读它的 CONTRIBUTING，按「中英各一行」格式提 PR；`ymck-x/awesome-deepseek-harness-jiji` 等小列表也投 | **最稳的长期入口**，列表本身 2 万+ star，SEO 权重高 |
| 3 | 上架 dsh-market | 看 `dsh-market/dsh-market` 的插件收录方式，按其规范提交 | 用户可一键搜到安装 |
| 4 | 官方 Discussions / Discord | 在官方仓库 Discussions 发 "Show and tell"，讲**问题**而不是求星 | 精准受众，可能带来官方转发 |
| 5 | Awesome 小列表 / 中文列表 | 中文 awesome 列表接受率通常更高，先从小的投起 | 慢但永久 |

> 投 Awesome 列表前**先开 issue 问一句**再提 PR，是社区礼貌，也提高通过率。

---

## 三、生态外渠道

| 渠道 | 发什么 | 注意 |
| --- | --- | --- |
| V2EX / 掘金 / 知乎 / 少数派 | 中文技术短文：「DSH 为什么不给无工作区会话输入？我做了个插件」 | **讲源码根因**（`inert` 那段）比讲功能有意思得多，技术文更容易被转 |
| Reddit `r/SideProject`、`r/coolgithubprojects` | 英文，讲问题 + 用例 | 别写 "please star"，会被踩；发完 24 小时内认真回评论 |
| Hacker News `Show HN` | 有可运行 demo 再发 | 门槛高，别当首发渠道 |
| X / Twitter | 英文短帖 + 示意图，带 `#DeepSeekHarness` `#dsh` | 需要账号有基础关注者才有效 |
| B 站 / 小红书 | 15 秒录屏：点一下 → 直接打字 | DSH 用户里中文用户多，短视频转化不错 |
| Product Hunt | 有英文落地页再考虑 | 对插件类项目收益一般 |

**发布文案模板（中文）**

> DSH 里「新会话」必须挂在某个工作区上，想随手问一句就会污染项目；而且源码里 `hero && chipTitle === undefined` 会把无工作区的空白会话输入框直接禁用——光调 API 建会话，只能看不能聊。
> 我做了个小插件：侧边栏底部一键开一个真正能输入的空白对话，官方插槽注册 + 官方服务调用，失败会明确报错。MIT，一条命令安装。
> 仓库：<链接>　已知限制：<两条>

**英文模板**

> In DeepSeek Harness, "new session" is tied to the selected workspace — a quick question ends up polluting your project. Worse, a blank session with no workspace has its composer disabled (`hero && chipTitle === undefined`), so an API-created workspace-free chat is read-only.
> This plugin adds one sidebar button that opens a genuinely typeable blank chat, using the official slot + client services. MIT, one-command install.
> Repo: <link> · Limitations: <two items>

---

## 四、节奏（比"发一次"重要得多）

- **集中**：首发时各渠道尽量压在 48 小时内，GitHub Trending 看的是增长**速度**。
- **冷启动**：先让身边确实在用 DSH 的朋友试装、觉得有用再点星，有个基础数再对外发；0 star 的仓库转化率很低。
- **持续**：每周一次小更新（README 优化、兼容性、issue 回复）比一次爆发更能维持曝光。
- **响应**：issue 24 小时内回复，哪怕只是「收到，我看下」。没人回的 issue 区会让人以为项目死了。
- **版本**：每次实质改动发一个 Release，写清楚改了什么。

---

## 五、明确不要做

- ❌ 买 star / 互刷群 / 互换 star：GitHub 会检测并可能封号，社区一眼看得出，反噬极大。
- ❌ 群发私信「求 star」：会被标记 spam。
- ❌ 贴一堆与项目无关的 topic 蹭流量（比如硬塞 `react`、`ai`）：短期有曝光，长期损害信任，也可能被 awesome 列表拒收。
- ❌ 把 DSH 官方源码、`app.asar`、任何凭据传上仓库：既违规又有安全风险。
- ❌ 宣称「DeepSeek 官方出品」：这是非官方社区插件，README 里已写清 Disclaimer。

---

## 六、怎么判断有没有效果

建个简单表格，每次发布后记一行：

| 日期 | 渠道 / 链接 | 仓库访问数 | 新增 star | Release 下载 | 新增 issue | 结论 |
| --- | --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |  |

访问数在 `Insights → Traffic` 看。**下载数和 issue 质量比 star 更能说明有人真的在用**。如果访问多但 star 少，问题在 README 首屏；如果 star 多但下载少，说明大家只是收藏，得简化安装。
