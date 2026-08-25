# 风格二：现代极简 / 大字报感（来源：通用ppt模板2.pptx）

## 真实样式数据来源
- 源文件：`通用ppt模板2.pptx`（24 页）
- 画布：1920 × 1080（16:9）

---

## 页数与页序

页数由 `pptgen-drawio/SKILL.md` 的 2.1 按答辩时长换算，本文件只定义**配色/字体/版式**。

## 这个风格和风格一的关系

**不是风格一换个配色**。核心区别：

| | 风格一 经典学术 | 风格二 现代极简 |
|---|---|---|
| 顶栏色块 | 有，150 px + 金线 8 px | **没有** |
| 底部细线 | 有 | **没有** |
| 内容页标题 | 白字嵌在深色顶栏里 | 深色字直接放在留白上 |
| 左右留白 | 120 px | 200 px |
| 节标题数字 | `fontSize=135` 居中 | `fontSize=300` 左对齐 |
| 强调色用量 | 金线 + 小方块 + 关键词，多处 | 全页只出现一次 |

适合什么场合：计算机、设计类专业，或评委偏年轻的场合。传统工科院校的答辩建议用风格一——顶栏加页码的规矩感在那种场合是加分的。

---

## 换行约定（避免导出特殊字符）

- **换行用 `&#xa;`**（`value="第 1 行&#xa;第 2 行"`）。属性里的字面换行会被 XML 规范化成空格，导出后变一行
- 要拆成独立段落用 `&lt;br&gt;`；不要在 `value` 里写 `<font>` / `<b>` 这类标签
- 依靠 `whiteSpace=wrap;html=1;` 实现自动换行；框高够不够跑 `scripts/render_check.py` 验，不要靠估

## 配色系统

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 / 满版深色背景 | `#231F20` | 深灰黑，只用在节标题页和致谢页 |
| 强调色 | `#F5C638` | 亮黄，**每页只用一次** |
| 正文文字 | `#3A3634` | 暖深灰，比纯黑柔和 |
| 标题文字 | `#231F20` | |
| 页面背景 | `#F7F5F2` | 暖白，**不用纯白**——纯白配黄色发廉价 |
| 目录水印字 | `#EDEAE6` | 比背景略深一点点 |
| 次级信息（日期/落款） | `#8A8580` | |
| 页码 | `#B8B3AE` | |

## 字体规范

字号体系和风格一不同——这个风格靠字号差距拉开层次，不靠装饰。

> ⚠️ **下表的 pt 值都是「标准 13.33 英寸幻灯片」的视觉大小，不是 drawio 的 `fontSize`。**
> 1920×1080 画布导出后是 20 英寸宽（1.5 倍），**画布 `fontSize` = 表里的 pt × 1.5**。
> 表末一列已经换算好，写 XML 时直接抄「画布值」那一列。

| 用途 | 字体 | 视觉字号 | **画布 `fontSize`** |
|---|---|---|---|
| 封面主标题 | `微软雅黑` | 60 pt 加粗，最多两行 | **90** |
| 封面其余信息 | `微软雅黑` | 18 pt，`#8A8580` 灰 | **27** |
| 目录项 | `微软雅黑` | 30 pt | **45** |
| 目录英文水印 | `Arial` | 150 pt，`#EDEAE6`（浅到几乎看不见） | **225** |
| 节标题数字 | `微软雅黑` | 200 pt 加粗 | **300** |
| 节标题章节名 | `微软雅黑` | 44 pt | **66** |
| 内容页标题 | `微软雅黑` | 40 pt 加粗，深色字不在色块里 | **60** |
| 内容页正文/列表 | `微软雅黑` | 27 pt（所有风格统一） | **40** |
| 图题/表题 | `微软雅黑` | 20 pt | **30** |
| 页码 | `Arial` | 16 pt | **24** |

> 正文用 `fontSize=40` 时，1520 px 宽的正文区一行放约 **27 个中文字**；
> 分成两栏（每栏 ~730 px）时一行只有 **13 字**，要点必须写成短语。

## 版式规则（Draw.io 实现要点）

**和风格一的区别就是没有装饰**。风格一靠顶栏色块 + 金线 + 底部细线建立秩序感；这个风格靠留白和字号差距。**不要照抄风格一的版式再换色**，那样两个风格看起来是同一个模板。

> 下面所有 pt 都是**画布 `fontSize`**（已经乘过 1.5），可以直接写进 XML。

硬规则：

- **不画顶栏色块**、不画顶部细线、不画底部细线
- 左右留白各 **200 px**（风格一是 120 px），上下各 **140 px**
- 正文区最宽 **1520 px**，比风格一窄，行短更好读
- 强调色 `#F5C638` 只出现在**一处**：段落前的小方块（20 × 20 px）或数字标号。一页出现两次以上就失去强调作用
- 页码放右下角，纯数字，`fontSize=24`，`#B8B3AE`——不写「第 X 页 / 共 Y 页」

### 封面页

- 背景 `#F7F5F2`，不画任何色块
- 主标题 `fontSize=90`，左对齐，起始 `x=200, y=380`
- 标题下方留 60 px，画一条 **80 px 宽、4 px 高**的 `#F5C638` 短线（只有这一处装饰）
- 学校、汇报人、导师、日期堆在 `y=700` 往下，`fontSize=27` 灰字，行距 60 px

### 目录页

- 背景 `#F7F5F2`
- `CONTENTS` `fontSize=225` 水印字，`#EDEAE6`，压在左上角 `x=160, y=100`，被目录项盖住一部分正好
- 目录项 `fontSize=45` 竖排在 `x=220`，行距 110 px，前面带 `01`–`06` 编号（`#F5C638`）

### 节标题（过渡）页

- 满版深色背景 `#231F20`
- 超大数字 **`fontSize=300`**，白色，左对齐 `x=180, y=260`（风格一是 135，差距要明显）
- 章节名 `fontSize=66` 白色，压在数字下方 `y=700`
- 除此之外整页留空

### 内容页

- 背景 `#F7F5F2`，**没有顶栏**
- 标题 `fontSize=60` 深色字（`#231F20`）直接放在 `x=200, y=140`，不放在色块里
- 标题左侧 20 × 20 px `#F5C638` 小方块，是全页唯一的强调色
- 正文 `fontSize=40`，从 `y=280` 开始，宽 1520 px
- 右下角页码

### 致谢页

- 满版 `#231F20`
- 主句 `fontSize=66` 白色居中，`Q & A` `fontSize=180` 白色
- 落款 `fontSize=24`，`#8A8580`

## Draw.io XML 关键样式片段

```xml
<!-- 内容页背景（暖白，注意不是纯白） -->
<mxCell id="bg" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#F7F5F2;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="0" y="0" width="1920" height="1080" as="geometry"/>
</mxCell>

<!-- 内容页标题（fontSize=60，深色字，不在色块里）-->
<mxCell id="title" value="01. 研究背景与意义" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=60;fontStyle=1;fontColor=#231F20;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="240" y="140" width="1400" height="90" as="geometry"/>
</mxCell>

<!-- 标题左侧强调方块（全页唯一强调色）-->
<mxCell id="badge" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#F5C638;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="200" y="165" width="20" height="20" as="geometry"/>
</mxCell>

<!-- 正文（fontSize=40，≈ 标准幻灯片 27 pt，宽 1520）
     框高不要照抄：用 scripts/textmetrics.py 的 box_h_px() 按真实字体量出来 -->
<mxCell id="body" value="第 1 行&#xa;第 2 行" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=top;fontSize=40;fontColor=#3A3634;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="200" y="280" width="1520" height="200" as="geometry"/>
</mxCell>

<!-- 节标题页：满版深色 + 200 pt 数字 -->
<mxCell id="sbg" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#231F20;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="0" y="0" width="1920" height="1080" as="geometry"/>
</mxCell>
<mxCell id="num" value="01" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=300;fontStyle=1;fontColor=#FFFFFF;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="180" y="260" width="900" height="380" as="geometry"/>
</mxCell>
<mxCell id="stitle" value="研究背景与意义" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=66;fontColor=#FFFFFF;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="190" y="700" width="1200" height="110" as="geometry"/>
</mxCell>

<!-- 目录页超大水印英文（fontSize=225）-->
<mxCell id="wm" value="CONTENTS" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=225;fontStyle=1;fontColor=#EDEAE6;fontFamily=Arial;" vertex="1" parent="1">
  <mxGeometry x="160" y="100" width="1700" height="300" as="geometry"/>
</mxCell>

<!-- 右下角页码（fontSize=24）-->
<mxCell id="pageno" value="7" style="text;html=1;strokeColor=none;fillColor=none;align=right;verticalAlign=middle;fontSize=24;fontColor=#B8B3AE;fontFamily=Arial;" vertex="1" parent="1">
  <mxGeometry x="1660" y="975" width="100" height="40" as="geometry"/>
</mxCell>
```

> 关键词强调同风格一：拆成独立小文本框（`fontColor=#F5C638`），不要在 `value` 里混 HTML。