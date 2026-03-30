# 微信公众号文章创作 SKILL

> 公众号/自媒体全流程解决方案：AI 写作 + 配图生成 + 自动上传草稿箱

## 功能特性

### 智能写作
- **9 种写作风格**：默认、爆款、清单体、资源盘点、个人实测、认知颠覆、身份共鸣、故事化、深度随笔
- **AI 搜索资料**：自动搜索最新资料，深度总结
- **爆款标题生成**：5 个备选标题，痛点明确、情绪调动
- **排版优化建议**：段落结构、配图位置、代码块留白

### 配图生成
- **封面图**：16:9、1:1、9:16 等多种比例
- **正文插图**：步骤图、演示图、流程图、前后对比
- **Draw.io 格式**：可编辑、可导出 PNG/JPG
- **风格统一**：配色与文章主题一致

### 自动上传
- **手动模式**：Doocs MD 在线编辑器，零代码
- **自动模式**：API 调用，一键上传草稿箱
- **图片处理**：自动上传封面和正文图片
- **Markdown 转换**：自动转为微信 HTML 格式

### 风格提取
- **分析范文**：提取写作风格、语言特征
- **生成规则包**：15-30 条可执行规则
- **Prompt 模板**：可直接复用的风格 Prompt

## 快速开始

### 1. 安装依赖

```bash
cd wechat-article-writer
npm install
```

### 2. 配置微信公众号（可选，仅自动上传需要）

复制 `.env.example` 为 `.env`，填入你的公众号凭证：

```bash
cp .env.example .env
```

编辑 `.env`：

```bash
WECHAT_APPID=你的AppID
WECHAT_SECRET=你的AppSecret
```

> **获取凭证**：公众号后台 → 设置与开发 → 基本配置 → 开发者ID(AppID) 和 开发者密码(AppSecret)

### 3. 使用 SKILL

在 Claude Code 中使用此 SKILL：

```
/wechat-article-writer

帮我写一篇关于 AI 写作工具的公众号文章，用爆款风格
```

## 使用示例

### 示例 1：写文章（不上传）

```
用清单体风格写一篇「提升效率的 10 个习惯」
```

**执行流程**：
1. 搜索相关资料
2. 按清单体风格撰写 2000-4000 字文章
3. 生成 5 个爆款标题
4. 提供排版优化建议
5. 生成封面图和正文插图（.drawio 文件）

### 示例 2：写文章并上传（自动模式）

```
用高流量风格写一篇关于 Cursor 的文章，并自动上传到草稿箱
```

**执行流程**：
1. 完成 Step 1-6（写作+配图）
2. 导出图片为 PNG 格式
3. 调用微信 API 上传封面图
4. 转换 Markdown 为微信 HTML
5. 创建草稿并返回 media_id

### 示例 3：仅生成封面图

```
生成这篇文章的封面，16:9 比例，科技风格
```

### 示例 4：风格提取

```
分析这篇文章的写作风格，提取可复用规则：
[粘贴文章全文]
```

## 高级用法

### 手动导出 Draw.io 图片

在 Draw.io 中打开 `.drawio` 文件：

1. 文件 → 导出为 → PNG
2. 选择缩放：200% (推荐)
3. 勾选"透明背景"（如需要）
4. 保存到 `images/covers/export/` 或 `images/illustrations/export/`

### 批量导出图片（自动）

使用提供的导出脚本：

```bash
# 导出所有图片
npm run export-images

# 仅导出封面
npm run export-covers

# 仅导出正文插图
npm run export-illustrations
```

> **前置要求**：需要安装 draw.io 命令行工具
> - macOS: `brew install --cask drawio`
> - Linux: `snap install drawio`
> - Windows: `choco install drawio`

### 手动上传到公众号

使用 Doocs MD 在线编辑器：

1. 打开 https://md.openwrite.cn/
2. 左侧粘贴 Markdown 内容
3. 选择主题样式
4. 点击"复制"按钮
5. 在公众号后台新建图文，粘贴内容

### 自动上传到公众号

使用命令行工具：

```bash
npm run upload -- \
  --title "文章标题" \
  --content drafts/article.md \
  --cover images/covers/export/cover.png \
  --author "你的笔名"
```

或直接使用 Node.js 脚本：

```bash
node scripts/upload-to-wechat.js \
  --title "文章标题" \
  --content drafts/article.md \
  --cover images/covers/export/cover.png
```

## 目录结构

```
wechat-article-writer/
├── SKILL.md                        # SKILL 主文件
├── README.md                       # 本文件
├── package.json                    # 依赖配置
├── .env.example                    # 环境变量模板
├── .env                            # 环境变量（勿提交）
│
├── reference/                      # 写作风格参考
│   ├── writing_style.md            # 默认风格
│   ├── viral_style.md              # 爆款风格
│   ├── checklist_methodology_style.md  # 清单体
│   ├── resource_roundup_style.md   # 资源盘点
│   ├── personal_tool_review_style.md   # 个人实测
│   ├── contrarian_opinion_style.md     # 认知颠覆
│   ├── identity_transformation_style.md # 身份共鸣
│   ├── story_emotional_style.md    # 故事化
│   ├── personal_essay_style.md     # 深度随笔
│   ├── cover_guide.md              # 封面图生成指南
│   ├── illustration_guide.md       # 正文插图生成指南
│   └── extraction_dimensions.md    # 风格提取维度
│
├── scripts/                        # 自动化脚本
│   ├── upload-to-wechat.js         # 上传脚本
│   └── export-drawio.sh            # 图片导出脚本
│
├── drafts/                         # 文章草稿（用户创建）
├── images/                         # 图片资源（用户创建）
│   ├── covers/source/              # 封面 .drawio
│   ├── covers/export/              # 封面 PNG/JPG
│   ├── illustrations/source/       # 插图 .drawio
│   └── illustrations/export/       # 插图 PNG/JPG
│
└── published/                      # 已发布归档（用户创建）
```

## 配置说明

### 支持的写作风格

| 风格 | 触发词 | 篇幅 | 特点 |
|-----|-------|------|-----|
| 默认 | （未指定） | 2000-4000字 | 平衡、通用 |
| 高流量/爆款 | 高流量、爆款 | 2500-4000字 | 吸睛、传播力强 |
| 清单体/方法论 | 清单体、方法论、干货 | 2000-4000字 | 结构化、实用 |
| 资源盘点 | 盘点、替代方案、合集 | 3000-6000字 | 信息密集 |
| 个人实测推荐 | 个人实测、亲身推荐 | 4000-7000字 | 真实、可信 |
| 认知颠覆 | 认知颠覆、反常识 | 2000-3500字 | 观点犀利 |
| 身份共鸣/逆袭 | 身份共鸣、逆袭 | 2500-4000字 | 情感共鸣 |
| 故事化/情感共鸣 | 故事化、情感共鸣 | 2500-4500字 | 故事性强 |
| 深度随笔 | 深度思考、随笔 | 4000-7000字 | 深度、个人化 |

### 封面图比例

- **16:9**（推荐）：1920×1080，公众号默认比例
- **1:1**：900×900，朋友圈分享
- **9:16**：1080×1920，竖屏视频封面
- **4:3**：1200×900，传统比例
- **2.35:1**：1920×817，电影比例

## 注意事项

### 使用限制

- 已认证公众号：可使用所有功能，包括自动发布
- 个人未认证号：只能创建草稿，需手动发布（2025年7月起）
- 测试号：不支持永久素材上传

### 图片要求

- 封面图：< 10MB，格式 JPG/PNG
- 正文图：< 2MB，格式 JPG/PNG/GIF
- 推荐分辨率：封面 1920×1080，插图 1200×900

### 安全建议

- 不要将 `.env` 文件提交到 Git
- 不要在代码中硬编码 AppSecret
- 定期更换 AppSecret（在公众号后台）
- 使用 `.gitignore` 忽略敏感文件

## 相关资源

### 官方文档
- [微信公众平台技术文档](https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html)
- [草稿箱 API](https://developers.weixin.qq.com/doc/offiaccount/Draft_Box/Add_draft.html)
- [发布能力 API](https://developers.weixin.qq.com/doc/offiaccount/Publish/Publish.html)

### 开源工具
- [Doocs MD](https://github.com/doocs/md) - 微信 Markdown 编辑器
- [wechat-format](https://github.com/lyricat/wechat-format) - Markdown 转微信 HTML
- [md2wechat-skill](https://github.com/geekjourneyx/md2wechat-skill) - Claude AI 集成

### 在线编辑器
- [Doocs MD 编辑器](https://md.openwrite.cn/)
- [微信公众号格式化工具](https://lab.lyric.im/wxformat/)
- [Markdown 编辑器](https://markdown.com.cn/editor/)

## 更新日志

### v1.0.0 (2026-03-19)
- 初始版本
- 支持 9 种写作风格
- Draw.io 封面图和正文插图生成
- 手动和自动两种上传模式
- 风格提取功能

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License