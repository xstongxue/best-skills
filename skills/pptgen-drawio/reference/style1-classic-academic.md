# 风格一：经典学术 / 商务严谨（来源：答辩PPT.pptx）

## 真实样式数据来源

- 源文件：`答辩PPT.pptx`（23 页，学位论文答辩终极版）
- 画布：1920 × 1080（16:9）
- 幻灯片尺寸：20.0 × 11.25 英寸

---

## 各页字号（页数本身由 SKILL.md 2.1 按时长换算）

下表是**每种页面类型的字号**，不是页数规定。哪一章几页看 SKILL.md 的时长换算表。

> 表里的数字是**画布 `fontSize`**，写 XML 时直接抄。它们已经按 ×1.5 换算过——
> 1920×1080 画布导出后是 20 英寸宽，是标准幻灯片（13.33 英寸）的 1.5 倍。
> 括号里是导出后在常规 PPT 里的视觉大小，只用来对照，**不要写进 XML**。

| 页面类型 | 画布 `fontSize` |
|---|---|
| 封面 | 主标题 60（≈40），落款 30（≈20），日期 27（≈18），**不画底部横线** |
| 目录 | 顶栏标题 54（≈36），编号 48（≈32），目录项 44（≈29），CONTENTS 90（≈60） |
| 节标题（过渡） | 大数字 135（≈90），章节名 72（≈48） |
| 内容页 | 顶栏标题 54（≈36），小标题 48（≈32），正文 **40（≈27）** |
| 图表页 | 顶栏标题 54，图题/表题 30（≈20） |
| 总结与展望 | 顶栏标题 54，小标题 48，正文 **40** |
| 已有成果 | 顶栏标题 54，正文 40 |
| 致谢 / Q&A | 主句 58（≈39），Q&A 90（≈60），落款 27（≈18） |

> 源文件 `答辩PPT.pptx` 是 23 页，那是一份 20 分钟以上答辩的真实页数。**不要把 23 当默认值**——10 分钟答辩按 SKILL.md 2.1 是 17 页。

---

## 配色系统

参考预答辩 PPT 主题色与经典学术答辩审美，遵循 **60-30-10 法则**。

| 角色 | 色值 | 说明 |
|------|------|------|
| 主色 / 顶栏 / 大色块 | `#1F497D` | 深蓝（Office 主题色），权威、沉稳 |
| 备选主色 | `#1B2A4A` | 深海军蓝，顶级咨询风 |
| 辅色 / 分隔线 / 强调 | `#C9A84C` | 金铜色，高级感强调 |
| 备选强调色 | `#C0504D` | 深红（Office 主题），用于重点标注 |
| 页面背景 | `#F7F8FA` | 冷白/极浅灰 |
| 备选背景 | `#EEECE1` | 浅米灰（Office 主题） |
| 正文文字 | `#1A1A2E` | 近黑深蓝 |
| 次级信息（日期/人名） | `#4A5568` | 中性石板灰 |
| 内容页底部装饰条 | `#E2E8F0` | 浅灰线 |

---

## 字体规范（按预答辩 PPT 实测）

> ⚠️ **下表的 pt 是源 pptx 里的值（13.33 英寸标准幻灯片），不能直接抄成 drawio 的 `fontSize`。**
> 1920×1080 画布导出后是 20 英寸宽，是标准幻灯片的 1.5 倍，所以
> **画布 `fontSize` = 表里的 pt × 1.5**。照抄会小掉三分之一，现场后排看不清。
>
> 常用几档换算好的画布值（跟 SKILL.md 的字号表一致，优先用这个）：
>
> | 用途 | 画布 `fontSize` | 表里的 pt |
> |---|---|---|
> | 内容页正文 / 列表要点 | **40** | 27 |
> | 内容页小标题 | **48** | 32 |
> | 内容页顶栏标题 | **54** | 36 |
> | 图题 / 表题 | **30** | 20 |
> | 页脚 / 页码 / 日期 | **24** | 16 |
> | 节标题页大数字 | **135** | 90 |
> | 节标题页章节名 | **72** | 48 |
>
> 用 40 pt 正文时，800 px 宽的栏一行只放 **14 个中文字**，要点必须写成短语。

| 用途 | 字体 | 源 pptx pt | **画布 `fontSize`** | 说明 |
|------|------|---|---|------|
| 封面主标题 | `微软雅黑` | 33，加粗 | **60**（稍加大） | 论文题目主副两行 |
| 封面学校/类型 | `微软雅黑` | 26 | **39** | XX大学、硕士学位论文预答辩 |
| 封面落款（汇报人/导师/专业） | `微软雅黑` | 20 | **30** | 汇报人、指导教师、学科专业 |
| 封面日期 | `微软雅黑` | 15 | **27**（稍加大） | 2026 年 3 月 |
| 目录标题 | `微软雅黑` | 30 | **54** | 「目录」 |
| 目录项 | `微软雅黑` | 24 | **44** | 01–06 章节名 |
| 目录英文大字 | `微软雅黑` 或 `Arial` | 60 | **90** | CONTENTS |
| 节标题数字 | `微软雅黑` | 90 | **135** | 01、02、03… |
| 节标题章节名 | `微软雅黑` | 48 | **72** | 研究背景与意义、国内外研究现状… |
| 内容页顶栏标题 | `微软雅黑` | 30 | **54**，白色 | 01. 研究背景与意义 |
| 内容页小标题 | `微软雅黑` | 24 | **48** | 研究背景、研究意义 |
| 内容页正文 | `微软雅黑` | 27 | **40** | 正文段落（所有风格统一） |
| 内容页列表/要点 | `微软雅黑` | 27 | **40** | bullets、编号列表（所有风格统一） |
| 图题/表题 | `微软雅黑` | 16.5 | **30**（稍加大） | 图 5-1、表 4-1 |
| 页脚日期 / 页码 | `微软雅黑` 或 `Calibri` | 13.5 | **24**（稍加大） | 2026 年 3 月 |
| 致谢主句 | `微软雅黑` | 39 | **58** | 感谢各位老师的聆听与指导！ |
| 致谢 Q&A | `微软雅黑` 或 `Arial` | 60 | **90** | Q & A |
| 致谢落款 | `微软雅黑` | 16.5 | **27** | 汇报人、指导教师、日期 |

> 少数几档（封面主标题、日期、图题、页脚）在换算之后又往上提了一点——
> 源文件那几处按 ÷1.5 反推只有 20–24，投影到教室后排偏小。表里给的是实测调过的值。

---

## 版式规则（Draw.io 实现要点）

> 下面所有 pt 都是**画布 `fontSize`**（已经乘过 1.5），可以直接写进 XML；px 是 1920×1080 画布坐标。

### 封面页

- 顶部 `#1F497D` 或 `#1B2A4A` 色块：全宽 × 150 px
- 顶部色块下方：`#C9A84C` 金色细线分隔条（高度 8 px）
- 主标题：`微软雅黑`，`fontSize=60` 加粗，`#1A1A2E`，两行（题目主副）
- 背景：`#F7F8FA`
- 落款区：汇报人、指导教师、学科专业、日期，`fontSize=30`，左对齐或居中
- **封面底部不画装饰横线**（底部细线仅用于各内容页）

### 目录页

- 左侧目录列表：01–06 章节，章节名 `fontSize=44`，编号 `fontSize=48`（金色），行距 122 px
- 右侧或中部：CONTENTS 大字 `fontSize=90`，`#E4E8EF`
- 底部日期：`fontSize=24`，`#4A5568`

### 节标题（过渡）页

- 全宽 `#1F497D` 或 `#1B2A4A` 大色块铺满整页
- 左侧或居中：大数字 `fontSize=135`（01、02…）
- 右侧或下方：章节名 `fontSize=72`，白色
- 可叠加半透明强调色数字水印

### 内容页

- 顶部 `#1F497D` 或 `#1B2A4A` 色块（高 150 px）+ `#C9A84C` 金线（高 8 px）
- 标题文字嵌入顶部色块内，左对齐，`微软雅黑`，`fontSize=54`，白色
- 页内小标题 `fontSize=48`，主色
- 正文区：`微软雅黑`，**`fontSize=40`**，`#1A1A2E`，`y=230..990` 之间；关键词用 `#C9A84C` 强调
- 底部细线：`#E2E8F0`，全宽 × 4 px（仅内容页使用，封面不需要）
- 底部左侧日期、右侧页码：`fontSize=24`，`#4A5568`

### 致谢页

- 居中主句：`fontSize=58`
- Q & A：`fontSize=90`，金色，醒目
- 底部：汇报人、指导教师、日期，`fontSize=27`

### 通用装饰

- 段落标记小方块：`10 × 42 px`，`fillColor=#C9A84C`，垂直位置对齐正文首行（`y + fontSize × 0.42`）
- 底部右侧：日期，`fontSize=24`，`#4A5568`

---

## 文字换行要点（重要）

Draw.io 文字默认**不换行**，必须同时满足以下三条才能正常折行：

1. **style 加 `whiteSpace=wrap`**：所有含文字的 cell 都必须加
2. **容器高度要足够**
3. **不要用 `overflow=hidden`**：会裁掉溢出文字

> 高度不要靠系数估。写完跑 `python scripts/render_check.py xxx.pptx`，脚本用本机真实字体量出每个框需要多高，直接报哪一页会裁字。

> **换行约定**：  
> - **换行写成 `&#xa;`**（`value="第 1 行&#xa;第 2 行"`）。属性值里的字面换行会被 XML 规范化成空格，导出后会挤成一行；  
> - 要把内容拆成独立段落用 `&lt;br&gt;`；  
> - `whiteSpace=wrap;html=1;` 负责自动折行，`value` 里不要混 `<font>` / `<b>` 这类标签。详见 SKILL.md checklist 第 5 条的实测对照表。

---

## Draw.io XML 关键样式片段

```xml
<!-- 页面背景（冷白） -->
<mxCell id="bg" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#F7F8FA;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="0" y="0" width="1920" height="1080" as="geometry"/>
</mxCell>

<!-- 顶部深蓝色块（主色 #1F497D 或 #1B2A4A） -->
<mxCell id="topbar" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#1F497D;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="0" y="0" width="1920" height="150" as="geometry"/>
</mxCell>

<!-- 金色分隔线 -->
<mxCell id="line" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#C9A84C;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="0" y="150" width="1920" height="8" as="geometry"/>
</mxCell>

<!-- 内容页标题（fontSize=54，嵌入顶色块内） -->
<mxCell id="title" value="  01. 研究背景与意义" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=54;fontStyle=1;fontColor=#FFFFFF;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="0" y="0" width="1920" height="150" as="geometry"/>
</mxCell>

<!-- 左侧小方块装饰（金铜色），高度跟着正文字号走 -->
<mxCell id="badge" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#C9A84C;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="120" y="247" width="10" height="42" as="geometry"/>
</mxCell>

<!-- 正文内容（fontSize=40，≈ 标准幻灯片 27 pt）
     框高不要照抄：用 scripts/textmetrics.py 的 box_h_px() 按真实字体量出来 -->
<mxCell id="body" value="正文第 1 行&#xa;正文第 2 行" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=top;fontSize=40;fontColor=#1A1A2E;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="160" y="230" width="1680" height="160" as="geometry"/>
</mxCell>

<!-- 底部装饰细线 -->
<mxCell id="botline" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#E2E8F0;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="0" y="1040" width="1920" height="4" as="geometry"/>
</mxCell>

<!-- 底部日期（fontSize=24） -->
<mxCell id="footer" value="2026 年 3 月" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=right;verticalAlign=middle;fontSize=24;fontColor=#4A5568;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="1500" y="1040" width="300" height="34" as="geometry"/>
</mxCell>

<!-- 节标题页：大数字 fontSize=135 -->
<mxCell id="section_num" value="01" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;fontSize=135;fontStyle=1;fontColor=#FFFFFF;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="200" y="350" width="600" height="170" as="geometry"/>
</mxCell>

<!-- 节标题页：章节名 fontSize=72 -->
<mxCell id="section_title" value="研究背景与意义" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;fontSize=72;fontStyle=1;fontColor=#FFFFFF;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="600" y="400" width="800" height="80" as="geometry"/>
</mxCell>

<!-- 关键词强调（推荐做法） -->
<!-- 避免在同一文本框 value 里混用 HTML（如 <font>/<b>），否则导出 PPT 后容易出现“特殊字符”或续写样式不一致。
     推荐做法：把关键词拆成独立的小文本框（fontColor=#C9A84C，fontStyle=1），与正文并排/叠放。 -->
```

---

## 页数与页序

页数由 `pptgen-drawio/SKILL.md` 的 2.1 按答辩时长换算，本文件只覆盖**配色与版式实现细节**。