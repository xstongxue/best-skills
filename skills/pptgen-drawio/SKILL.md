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

| # | 风格 | 主色 | 强调色 | reference 文件 |
|---|------|------|--------|---------------|
| 1 | 经典学术 / 商务严谨 | `#1B2A4A` | `#C9A84C` | `reference/style1-classic-academic.md` |
| 2 | 现代极简 / 大字报感 | `#231F20` | `#F5C638` | `reference/style2-minimal-bigtype.md` |
| 3 | 暖色学术 / 亲和力 | `#2C5160` | `#B7472A` | `reference/style3-warm-academic.md` |
| 4 | 科技明快 / 现代前沿 | `#0170C1` | 同主色 | `reference/style4-tech-modern.md` |
| 5 | 自定义 | 从 style-custom.md 提取 | | `reference/style-custom.md` |

- **论文答辩**：用户未指定时默认风格 1
- **通用汇报**：用户选择或根据语境自动推荐

---

## Step 2：生成多页 Draw.io XML

**必须先读取所选风格的 reference 文件**，基于该风格生成 XML。

- 画布：16:9（pageWidth=1920，pageHeight=1080）
- 页序：按模式识别表中的默认页序
- 页数：10 分钟约 10–12 页，15 分钟约 14–18 页
  - 含节标题过渡页（每章独立一页引入）时，10 分钟约 11 页；无过渡页时约 9 页
  - 节标题过渡页风格：大号数字 + 章节名，可参考 style2 风格或 style4（无过渡页）

### 2.1 论文答辩模式默认页序（23 页，四种风格共享）

当用户选择论文答辩模式、且未另行指定页数时，所有风格（style1–4）**默认采用统一的 23 页结构**：

1. 封面  
2. 目录  
3. 01 研究背景与意义（节标题）  
4–6. 01. 研究背景与意义（内容 3 页）  
7. 02 国内外研究现状（节标题）  
8–9. 02. 国内外研究现状（内容 2 页）  
10. 03 方法总览（节标题）  
11–13. 03. 方法总览（内容 3 页）  
14. 04 实验结果（节标题）  
15–16. 04. 实验结果（内容 2 页）  
17. 05 系统设计（节标题）  
18–19. 05. 系统设计与实现（内容 2 页）  
20. 06 总结与展望（节标题）  
21. 06. 总结与展望（内容 1 页）  
22. 已有成果  
23. 致谢 / Q & A  

> 各 reference/styleX-*.md 只定义**样式与版式**（颜色、字体、组件布局），不再重复定义页序；如需修改默认页序，应在本 SKILL 中统一调整。

### 2.2 文件命名与交付（建议，Windows 兼容）

- **推荐命名（生成/导出阶段）**：优先使用 ASCII 文件名（英文字母/数字/中划线），减少 PowerShell/编码环境下中文文件名乱码、命令找不到文件等问题。
  - 推荐：`defense-style4-tech.drawio`、`defense-style4-tech.pptx`
  - 如必须中文名：建议先用 ASCII 名完成导出，再在资源管理器里重命名为中文
- **交付顺序（推荐流程）**：先提供 `.drawio`（源文件）→ 执行命令导出 `.pptx`（交付文件）→ 校验页数
- **交付依赖**：接收方只需打开 `.pptx`（必要时附 `.drawio`），不需要安装 Python；脚本/代码仅用于生成端自动写 XML（可选）。

### ⚠️ 已知坑清单（生成前逐条过）

生成每一页 XML 前，按下面 checklist 快速自检（只保留高频致命项）：

#### ✅ 必过 checklist（10 条）

1. **多页结构**：根节点必须是 `<mxfile>`，且每页一个 `<diagram>`（否则导出会变 1 页）。
2. **每页坐标系**：每个 `<diagram>` 内 `x` 从 0 开始；背景矩形 `x=0,y=0,w=1920,h=1080`；每页都有 `mxCell id="0"` 与 `mxCell id="1" parent="0"`。
3. **ID 唯一**：全文件内所有 `mxCell id` 必须唯一；每个 `<diagram id="...">` 也必须唯一。
4. **一次性写入**：`.drawio` 必须一次写完整（不要多次覆盖/拼接 XML）。
5. **页数校验**：`drawio2pptx` 输出的 `(N slides)` 必须等于 `<diagram>` 数量。
6. **每页 cell 数量**：封面 ≥ 12、节标题 ≥ 8、内容页 ≥ 15（避免“空页”）。
7. **换行只用真实换行**：在生成 XML 时，正文多行必须写成**真实换行符**（代码里用 `\n` 拼接，再一次性写入文件），禁止在 `value="..."` 中写 `&#xa;` / `&lt;br&gt;` / `<font>/<b>`，也禁止通过 Shell 将 `&amp;#xa;` 替换成字面量 `` `n ``；文本 style 必含 `whiteSpace=wrap;html=1;`。
8. **白字不要误替换**：顶栏/深色块文字保持 `fontColor=#FFFFFF`；背景色替换优先改 `fillColor`，不要全局替换所有 `#FFFFFF`。
9. **遮挡检查**：带底色的装饰块不要跨越正文区域；两列卡片之间不要放有底色标签（会压住字）。
10. **高度预算**：多行正文的卡片/容器宁可偏高留白，避免裁字（正文行高约 \(1.4\times\) 字号）。

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

## Step 3 & 4：输出 Draw.io 并自动导出 PPT（两种模式共用）

### Step 3：输出 Draw.io 文件

将生成的 XML **一次性** 写入工作区 `.drawio` 文件（论文答辩用 `paper-defense.drawio`，通用汇报用 `general-presentation.drawio`），并简述每页概要。

> 写入方式需满足 checklist 第 4 条「一次性写入」与第 7 条「换行只用真实换行」的要求。

### Step 4：自动导出 PPT（必执行）

生成 `.drawio` 后，执行导出（推荐在生成端完成导出后再交付）：

1. 如未安装：`pip install drawio2pptx -q`
2. 切换到 `.drawio` 文件所在目录（**必须先 cd/Set-Location，否则找不到文件**）：
   ```powershell
   Set-Location "d:\你的项目目录"
   drawio2pptx <文件名>.drawio <文件名>.pptx
   ```
3. 验证输出页数：输出中必须包含 `Saved xxx.pptx (N slides)`，且 \(N\) 等于 `<diagram>` 数量（对应 checklist 第 5 条「页数校验」）

> 页数验证需满足 checklist 第 5 条「页数校验」。

### 导出失败排查（高频）

- **Permission denied / 拒绝访问**：目标 `.pptx` 正在被 PowerPoint 占用。
  - 解决：导出到新文件名（如 `*-v2.pptx`），或先关闭 PPT 再覆盖导出。
- **中文文件名乱码/找不到文件**：终端编码导致路径解析异常。
  - 解决：改用 ASCII 文件名生成与导出（见 2.2）。

### 其他注意事项

- **统一字号规则（所有风格）**：  
  - 内容页中文正文（段落 + 列表要点）统一使用 **18 pt**；  
  - 内容页章节标题一般为 **30 pt**，节标题页大号数字/章节名继续按各 styleX 中示例执行；  
  - 日期、页脚、小标签、图表表头等次要信息可保持 13–16 pt 之间的现有设计。
- **字体推荐**：中文标题/正文优先使用 **微软雅黑** 或 **宋体**；数字、英文及公式使用 **Times New Roman**。各风格 reference 可在此基础上微调（如英文标题用 Georgia）。
- XML 标签正确闭合，特殊字符转义（`&`→`&amp;`，`<`→`&lt;`）
- 每页布局：背景全画布矩形、标题区 44–56pt、正文按照 18pt 行高预留空间、留白充足
- Windows 下不支持 `tail` 命令，Shell 输出截断请用 PowerShell 的 `Select-Object -Last N` 替代