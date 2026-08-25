# 风格三：暖色学术 / 亲和力（来源：通用ppt模板3.pptx）

## 真实样式数据来源
- 源文件：`通用ppt模板3.pptx`（11 页）
- 画布：1920 × 1080（16:9）

---

## 论文答辩模式页序（通用）

页数与页序由 `pptgen-drawio/SKILL.md` 的 2.1 按答辩时长换算，本文件只定义**配色/字体/版式实现细节**。

---

## 换行约定（避免导出特殊字符）

- **换行用 `&#xa;`**（`value="第 1 行&#xa;第 2 行"`）。属性里的字面换行会被 XML 规范化成空格，导出后变一行
- 要拆成独立段落用 `&lt;br&gt;`；不要在 `value` 里写 `<font>` / `<b>` 这类标签
- 依靠 `whiteSpace=wrap;html=1;` 实现自动换行；框高够不够跑 `scripts/render_check.py` 验，不要靠估

## 配色系统

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 / 色块 / 次标题 | `#2C5160` | 深蓝灰，用于顶栏装饰、日期、汇报人等信息 |
| 强调 / 关键词 | `#B7472A` | 暖砖红/橙红，用于标题高亮、关键词 |
| 基础文字 | `#000000` | 黑色，正文默认 |
| 页面背景 | `#FFFFFF` | 白色 |

> **与风格一的核心区别**：两者共用 `#2C5160` 作为主色，但强调色由红色 `#FF0000` 换成暖砖红 `#B7472A`，整体视觉更亲和、内敛。

## 字体规范

- **整体与风格一保持一致**：封面、目录、节标题、内容页、致谢等所有基础文字，全部沿用风格一在 `style1-classic-academic.md` 中给出的字体与字号配置（默认使用 `微软雅黑`）。抄的时候用那张表里 **画布 `fontSize`** 那一列。
- 如需在个别页面使用英文字体增强层次，可在局部引入 `Arial` 等西文字体，但不改变整体中文字体体系和字号级别。

> ⚠️ **字号只认「画布 `fontSize`」这一套值**：1920×1080 画布导出后是 20 英寸宽，
> 是标准幻灯片（13.33 英寸）的 1.5 倍，所以 `fontSize=18` 投影出来只有 12 pt，后排看不清。
> 常用几档：正文 / 要点 **40**、页内小标题 **48**、顶栏标题 **54**、图题表题 **30**、页脚页码 **24**、
> 节标题数字 **135**、节标题章节名 **72**。
>
> 正文用 `fontSize=40` 时，通栏 1680 px 一行放约 **30 个中文字**，两栏（每栏 800 px）一行只有 **14 字**，
> 要点必须写成短语。装不下就改版式，不要缩字号。

## 版式规则（Draw.io 实现要点）

- **基础结构与风格一完全一致**：顶栏高度（150 px）、金色分隔线（8 px）、底部细线与日期区域等布局全部复用风格一，只是将主色/强调色替换为本风格的 `#2C5160` / `#B7472A`。  
- 本风格的“暖色学术感”主要通过配色和少量小方块装饰实现，不改变整体版式结构。

### 通用装饰（可选增强）
- 右侧或段落旁可使用 `fillColor=#2C5160` 的小方块（约 40 × 55 px）作信息标注。
- 章节名、关键小标题可用 `#B7472A` 暖色强调。

## Draw.io XML 关键样式片段

> 下面所有 `fontSize` 都是**画布值**，可以直接抄。含文字的 cell 一律带 `whiteSpace=wrap;html=1;`，
> 框高用 `scripts/textmetrics.py` 的 `box_h_px()` 量，不要照抄示例里的高度。

```xml
<!-- 封面左侧小方块装饰 -->
<mxCell id="badge1" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#2C5160;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="1580" y="520" width="40" height="55" as="geometry"/>
</mxCell>

<!-- 封面主标题（fontSize=60）-->
<mxCell id="title" value="软件项目质量管理" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=60;fontStyle=1;fontColor=#2C5160;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="120" y="300" width="1600" height="120" as="geometry"/>
</mxCell>

<!-- 内容页章节标题（fontSize=54，暖红色强调）-->
<mxCell id="sec" value="1. 软件质量概述和控制" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=54;fontStyle=1;fontColor=#B7472A;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="120" y="150" width="1600" height="80" as="geometry"/>
</mxCell>

<!-- 正文内容（fontSize=40。中文正文不要用 Times New Roman，缺字会被替换成别的字体）-->
<mxCell id="body" value="第 1 行&#xa;第 2 行" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=top;fontSize=40;fontColor=#000000;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="120" y="240" width="1680" height="160" as="geometry"/>
</mxCell>

<!-- 汇报人信息行（fontSize=30）-->
<mxCell id="info" value="汇报人：xxx    院系：xxx    Date: 2026/03/01" style="text;html=1;whiteSpace=wrap;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=30;fontColor=#2C5160;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="120" y="820" width="1500" height="56" as="geometry"/>
</mxCell>
```