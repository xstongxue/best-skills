---
name: pptgen-drawio
description: 根据论文或汇报内容生成多页 Draw.io 格式 PPT，支持论文答辩与通用汇报两种模式，自动导出为 .pptx。当用户提到论文答辩 PPT、答辩幻灯片、通用 PPT、汇报 PPT、根据模板生成 PPT、drawio2pptx 时使用。
---

# PPT 多页 Draw.io 生成（论文答辩 + 通用汇报）

本 skill 支持两种模式，**共用** `ppt_template/`、`scripts/`、`reference/` 目录，以及 **Step 0 自定义模板**、**Step 1 确定内容与风格**、**Step 3 & 4 输出与导出** 全流程。

---

## 模式识别

| 模式 | 使用时机 | 内容来源 | 默认页序 | 输出文件 |
|------|----------|----------|----------|----------|
| **论文答辩** | 学位论文答辩、开题、预答辩 | paper-write 结构化提取 | 封面→目录→背景→现状→方法→创新点→实验→结论→致谢→Q&A | `paper-defense.drawio` |
| **通用汇报** | 工作汇报、产品介绍、演讲 | 用户消息提取/生成 | 封面→目录→节标题→内容页→总结→致谢→Q&A | `general-presentation.drawio` |

---

## Step 0：用户自定义模板（可选，两种模式共用）

若用户提供了自己的 `.pptx` 模板文件：

1. **模板放置**：将 `.pptx` 放入 `ppt_template/` 目录
2. **运行样式提取**：在 skill 根目录下执行：
   ```
   python scripts/analyze_pptx.py ppt_template/xxx.pptx reference/style-custom.md
   ```
3. 读取 `reference/style-custom.md` 作为「自定义风格」继续

**目录约定**：`ppt_template/` 存放模板、`scripts/analyze_pptx.py` 样式提取、`reference/` 风格文件

---

## Step 1：确定内容与风格（两种模式共用）

### 1.1 确定内容

- **论文答辩**：若用户只有论文全文：先调用 paper-write 的「结构化信息提取」；若已提供结构化信息：从消息中提取【论文题目】【学科方向】【答辩时长】【论文结构/目录】【各章核心内容】【创新点/贡献】等，缺失则追问
- **通用汇报**：从用户消息中提取幻灯片大纲及内容，或根据核心需求扩展为完整结构

### 1.2 选择风格

两种模式均可选择以下风格之一，**读取对应 reference 文件**获取配色、字体、版式规则与 XML 样式片段：

| # | 风格 | 主色 | 强调色 | 有无顶栏装饰 | reference 文件 |
|---|------|------|--------|---|---------------|
| 1 | 经典学术 / 商务严谨 | `#1B2A4A` | `#C9A84C` | 有：顶栏 150px + 金线 8px | `reference/style1-classic-academic.md` |
| 2 | 现代极简 / 大字报感 | `#231F20` | `#F5C638` | **无**，靠留白和字号差 | `reference/style2-minimal-bigtype.md` |
| 3 | 暖色学术 / 亲和力 | `#2C5160` | `#B7472A` | 有，同风格一结构 | `reference/style3-warm-academic.md` |
| 4 | 科技明快 / 现代前沿 | `#0170C1` | 同主色 | 有 | `reference/style4-tech-modern.md` |
| 5 | 自定义 | 从 style-custom.md 提取 | | 看模板 | `reference/style-custom.md` |

- **论文答辩**：用户未指定时默认风格 1
- **通用汇报**：用户选择或根据语境自动推荐
- 风格 1 / 3 / 4 是同一套版式换配色（顶栏 + 细线 + 页脚），**只有风格 2 是真正不同的版式**。用户想要「看起来不一样」时推风格 2；传统工科院校答辩推风格 1

---

## Step 2：生成多页 Draw.io XML

**必须先读取所选风格的 reference 文件**，基于该风格生成 XML。

- 画布：16:9（pageWidth=1920，pageHeight=1080）
- 页序：按模式识别表中的默认页序
- 页数：**由 Step 1.1 拿到的答辩时长决定**，见下面 2.1

### 2.1 论文答辩模式页序（按时长换算）

页数由三部分相加：

```
封面 · 目录 · 已有成果 · 致谢/Q&A            → 4 页，任何时长都有
每章一个节标题过渡页                          → 章数 × 1 页
各章内容页                                    → 按下表分配
```

**按时长选一列**，表里的数字是「各章内容页数」：

| 章节 | 10 分钟 | 15 分钟 | 20 分钟 |
|---|---|---|---|
| 01 研究背景与意义 | 1 | 2 | 3 |
| 02 国内外研究现状 | 1 | 1 | 2 |
| 03 方法（含创新点） | 2 | 3 | 3 |
| 04 实验结果 | 1 | 2 | 2 |
| 05 系统设计与实现 | 1 | 1 | 2 |
| 06 总结与展望 | 1 | 1 | 1 |
| 内容页小计 | 7 | 10 | 13 |
| **总页数**（+4 固定 +6 节标题） | **17** | **20** | **23** |

时长不在表里就按 **每页 45 秒**估：总页数 ≈ 时长(分) × 60 ÷ 45，再按上表比例分配到各章。

**方法章占比是硬要求**：方法 + 实验合起来不少于内容页的 40%。这是答辩评委真正听的部分，背景和现状讲长了会被打断。

**用户点名要几页就按用户的**，上表只在用户没说页数时用。

> 原先固定 23 页的写法已废弃——那个数来自 `style1` 的源文件 `答辩PPT.pptx`，是一份 20 分钟以上答辩的真实页数，不适用于 10–15 分钟。

> 各 reference/styleX-*.md 只定义**样式与版式**（颜色、字体、组件布局），不定义页序和页数。

### 2.2 文件命名与交付（建议，Windows 兼容）

- **推荐命名（生成/导出阶段）**：优先使用 ASCII 文件名（英文字母/数字/中划线），减少 PowerShell/编码环境下中文文件名乱码、命令找不到文件等问题。
  - 推荐：`defense-style4-tech.drawio`、`defense-style4-tech.pptx`
  - 如必须中文名：建议先用 ASCII 名完成导出，再在资源管理器里重命名为中文
- **交付顺序（推荐流程）**：先提供 `.drawio`（源文件）→ 执行命令导出 `.pptx`（交付文件）→ 校验页数
- **交付依赖**：接收方只需打开 `.pptx`（必要时附 `.drawio`），不需要安装 Python；脚本/代码仅用于生成端自动写 XML（可选）。

### ⚠️ 已知坑清单（生成前逐条过）

#### ✅ 必过 checklist（7 条）

1. **多页结构**：根节点必须是 `<mxfile>`，且每页一个 `<diagram>`（否则导出会变 1 页）。
2. **每页坐标系**：每个 `<diagram>` 内 `x` 从 0 开始；背景矩形 `x=0,y=0,w=1920,h=1080`；每页都有 `mxCell id="0"` 与 `mxCell id="1" parent="0"`。
3. **ID 唯一**：全文件内所有 `mxCell id` 必须唯一；每个 `<diagram id="...">` 也必须唯一。
4. **一次性写入**：`.drawio` 必须一次写完整（不要多次覆盖/拼接 XML）。
5. **换行用 `&#xa;`，不要用真实换行符**。XML 规范规定属性值里的字面换行会被规范化成空格，所以 `value="第一行\n第二行"` 导出后是**一行**，中间多个空格。实测（drawio2pptx 0.0.7 + PowerPoint）：

   | 写法 | 导出结果 |
   |---|---|
   | `value="A&#xa;B"` | ✅ 两行 |
   | `value="A&lt;br&gt;B"` | ✅ 两行（拆成两个段落） |
   | `value="A` 真实换行 `B"` | ❌ 一行，换行变空格 |

   多行正文用 `&#xa;`；需要拆成独立段落（比如列表项各自成段）用 `&lt;br&gt;`。文本 style 必含 `whiteSpace=wrap;html=1;`。
6. **白字不要误替换**：顶栏/深色块文字保持 `fontColor=#FFFFFF`；背景色替换优先改 `fillColor`，不要全局替换所有 `#FFFFFF`。
7. **遮挡检查**：带底色的装饰块不要跨越正文区域；两列卡片之间不要放有底色标签（会压住字）。

> 原先还有三条「每页 cell 数 ≥ N」「高度按 1.4 倍字号预算」「页数校验」——前两条是在猜渲染结果，第三条只能验证页数。都已被 Step 5 的 `render_check.py` 取代：那个脚本用真实字体文件量宽度，直接告诉你哪一页第几个框会裁字。**不要再靠加 cell 凑数或按系数估行高。**

#### 最小可用多页模板（仅示意结构）

```xml
<mxfile host="app.diagrams.net">
  <diagram id="p1" name="封面">
    <mxGraphModel page="1" pageWidth="1920" pageHeight="1080">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>
      </root>
    </mxGraphModel>
  </diagram>
  <diagram id="p2" name="目录">
    <mxGraphModel page="1" pageWidth="1920" pageHeight="1080">
      <root>
        <mxCell id="0"/><mxCell id="1" parent="0"/>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

---

## Step 3 & 4 & 4.5 & 5：输出 Draw.io、导出 PPT、修补、验证渲染（两种模式共用）

### Step 3：输出 Draw.io 文件

将生成的 XML **一次性** 写入工作区 `.drawio` 文件（论文答辩用 `paper-defense.drawio`，通用汇报用 `general-presentation.drawio`），并简述每页概要。

> 写入方式需满足 checklist 第 4 条「一次性写入」与第 5 条「换行用 `&#xa;`」的要求。

### Step 4：导出 PPT（必执行）

1. 如未安装：`pip install drawio2pptx -q`
2. **先切到 `.drawio` 所在目录**，否则找不到文件：

   ```bash
   cd /d/你的项目目录          # bash / zsh
   drawio2pptx paper-defense.drawio paper-defense.pptx
   ```
   ```powershell
   Set-Location "D:\你的项目目录"   # PowerShell
   drawio2pptx paper-defense.drawio paper-defense.pptx
   ```
3. 输出里应出现 `Saved xxx.pptx (N slides)`，`N` 等于 `<diagram>` 数量。**页数对上只说明页没丢，不说明排版对**，继续 Step 4.5。

### Step 4.5：修补 pptx（必执行，中文 PPT 尤其不能跳）

```bash
python scripts/postprocess_pptx.py paper-defense.pptx
```

**为什么必须跑**：drawio2pptx 0.0.7 的 `io/drawio_loader.py` 有一段「nowrap 启发式」——一个文本框里所有段落都不含空白字符时，它会把 `whiteSpace=wrap` 覆盖成 `wrap="none"`。**中文句子没有空格，所以每一个纯中文文本框都会被判成不换行**，文字沿一行无限向右流，压穿右栏、跑出画布。

字号小的时候一行刚好放得下，看不出来；一旦按上面的 40 pt 规则排版就会全崩。这个脚本把所有文本框的 `word_wrap` 强制设回 `True`。

**注意顺序**：`render_check.py` 的扫描是按「会换行」算的，所以必须先修补再扫描，否则扫描结果和实际渲染不是一回事。

论文答辩模式在写完 Step 6 讲稿后，再跑一次带讲稿的版本，把讲稿写进备注区：

```bash
python scripts/postprocess_pptx.py paper-defense.pptx --notes paper-defense-script.md
```

### Step 5：验证渲染（必执行）

```bash
python scripts/render_check.py paper-defense.pptx
```

脚本做两件事：

- **量文字溢出** —— 用本机真实字体文件量每行像素宽度，算出文本框需要多高，和框高比。有 `❌ OVERFLOW` 就回 Step 2 改那一页的框高或减字，改完重跑，直到只剩 `⚠️ TIGHT` 或全清。退出码非 0 表示有溢出。
- **逐页导 PNG** —— Windows 走 PowerPoint COM，其他平台走 LibreOffice + `pdftoppm`。**导完要真的逐页看图**，优先看文字有没有跑出框、装饰块有没有压住字。两个引擎都没有时只出扫描结果，此时要告诉用户「没做视觉验证」。

字体没装的话脚本会提示「量出来的宽度只是估算」——这种情况下扫描结果只能当参考，必须看图。

### Step 6：输出讲稿（论文答辩模式必做）

答辩是讲出来的。同时写一份 `paper-defense-script.md`：

```markdown
## 第 N 页 · <页面标题>       ⏱ 约 XX 秒
<这一页要说的话，口语，能照着念>
```

- 按 **每分钟 200 字**折算秒数，最后核对总时长和用户给的答辩时长差距在 ±1 分钟内。差太多就回 Step 2 调页数
- 封面 15 秒、目录 20 秒、节标题页 5 秒左右，剩下的时间分给内容页
- Draw.io 没有备注这个概念，所以讲稿是独立的 `.md`。写完后回到 Step 4.5，用 `--notes` 把它写进 pptx 备注区：
  `python scripts/postprocess_pptx.py xxx.pptx --notes xxx-script.md`

### 导出失败排查（高频）

- **Permission denied / 拒绝访问**：目标 `.pptx` 正在被 PowerPoint 占用。
  - 解决：导出到新文件名（如 `*-v2.pptx`），或先关闭 PPT 再覆盖导出。
- **中文文件名乱码/找不到文件**：终端编码导致路径解析异常。
  - 解决：改用 ASCII 文件名生成与导出（见 2.2）。
- **`pip install` 报 SSLError / 找不到版本**：网络问题。
  - 解决：换镜像 `pip install drawio2pptx -i https://pypi.tuna.tsinghua.edu.cn/simple`，或从 PyPI 直接下 wheel 后 `pip install --no-deps xxx.whl` 再单独装 `python-pptx lxml`（`cairosvg` 只在图里有 SVG 时才需要）。

### 其他注意事项

- **字号规则（所有风格）**：画布是 1920×1080 px，导出后是 **20 英寸宽**——标准 16:9 幻灯片只有 13.33 英寸。**画布上的 pt 值除以 1.5 才是常规 PPT 的视觉大小。**

  | 用途 | 画布上写 | 相当于常规 PPT |
  |---|---|---|
  | 内容页正文 / 列表要点 | **40 pt** | 27 pt |
  | 页内小标题 | 48 pt | 32 pt |
  | 内容页顶栏标题 | 54 pt | 36 pt |
  | 图题 / 表题 | 30 pt | 20 pt |
  | 页脚 / 页码 / 日期 | 24 pt | 16 pt |

  节标题页的大号数字和章节名按各 styleX 里的示例执行（数字 120–140 pt，章节名 66–72 pt）。

  > 原先写的「正文统一 18 pt」是**单位没换算**：18 ÷ 1.5 = 12 pt，答辩现场后排根本看不清。已按实测改正。

- **40 pt 的代价是每页字要少**，这是硬约束不是建议：

  | 文本框宽 | 一行放几个中文字 |
  |---|---|
  | 800 px（两栏） | **14** |
  | 1680 px（通栏） | **30** |

  所以两栏的要点必须写成 **≤14 字的短语**，通栏句子 ≤30 字。写不下就删内容或改版式（比如 4 张横条卡片改成 2×2 网格），**不要靠缩小字号硬塞**。生成脚本里应该在写文件前就用 `scripts/textmetrics.py` 算一遍高度，装不下直接报警。
- **字体推荐**：中文标题/正文优先使用 **微软雅黑** 或 **宋体**；数字、英文及公式使用 **Times New Roman**。各风格 reference 可在此基础上微调（如英文标题用 Georgia）。
- XML 标签正确闭合，特殊字符转义（`&`→`&amp;`，`<`→`&lt;`）
- 每页布局：背景全画布矩形、标题区顶栏 150 px、正文区留在 y=230..990 之间、留白充足
- **Shell 差异**：本 skill 的命令按 bash 写。PowerShell 下 `cd` 换成 `Set-Location`、`tail -n N` 换成 `Select-Object -Last N`、`head -N` 换成 `Select-Object -First N`。