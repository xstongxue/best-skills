# 风格三：暖色学术 / 亲和力（来源：通用ppt模板3.pptx）

## 真实样式数据来源
- 源文件：`通用ppt模板3.pptx`（11 页）
- 画布：1920 × 1080（16:9）

---

## 论文答辩模式页序（通用）

本风格在论文答辩模式下沿用 `pptgen-drawio/SKILL.md` 中定义的 **23 页通用页序**（封面、目录、01–06 各章节标题 + 内容、已有成果、致谢 / Q&A），本文件仅定义**配色/字体/版式实现细节**。

---

## 换行约定（避免导出特殊字符）

- **只用真实 `\n` 做换行**（脚本里写 `"第 1 行\\n第 2 行"`）
- **禁止**在 `value="..."` 中写 `&#xa;`、`&lt;br&gt;` 等实体或 HTML 标签
- 依靠 `whiteSpace=wrap;html=1;` 实现自动换行；容器高度需预留足够空间

## 配色系统

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 / 色块 / 次标题 | `#2C5160` | 深蓝灰，用于顶栏装饰、日期、汇报人等信息 |
| 强调 / 关键词 | `#B7472A` | 暖砖红/橙红，用于标题高亮、关键词 |
| 基础文字 | `#000000` | 黑色，正文默认 |
| 页面背景 | `#FFFFFF` | 白色 |

> **与风格一的核心区别**：两者共用 `#2C5160` 作为主色，但强调色由红色 `#FF0000` 换成暖砖红 `#B7472A`，整体视觉更亲和、内敛。

## 字体规范

- **整体与风格一保持一致**：封面、目录、节标题、内容页、致谢等所有基础文字，全部沿用风格一在 `style1-classic-academic.md` 中给出的字体与字号配置（默认使用 `微软雅黑`）。  
- 如需在个别页面使用英文字体增强层次，可在局部引入 `Arial` 等西文字体，但不改变整体中文字体体系和字号级别。

## 版式规则（Draw.io 实现要点）

- **基础结构与风格一完全一致**：顶栏高度、金色分隔线、底部细线与日期区域等布局全部复用风格一，只是将主色/强调色替换为本风格的 `#2C5160` / `#B7472A`。  
- 本风格的“暖色学术感”主要通过配色和少量小方块装饰实现，不改变整体版式结构。

### 通用装饰（可选增强）
- 右侧或段落旁可使用 `fillColor=#2C5160` 的小方块（约 14 × 15 mm）作信息标注。
- 章节名、关键小标题可用 `#B7472A` 暖色强调。

## Draw.io XML 关键样式片段

```xml
<!-- 封面左侧小方块装饰 -->
<mxCell id="badge1" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#2C5160;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="1580" y="520" width="40" height="55" as="geometry"/>
</mxCell>

<!-- 封面主标题 -->
<mxCell id="title" value="软件项目质量管理" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=44;fontColor=#2C5160;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="120" y="300" width="1400" height="80" as="geometry"/>
</mxCell>

<!-- 内容页章节标题（Arial，暖红色强调） -->
<mxCell id="sec" value="1. 软件质量概述和控制" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=32;fontColor=#B7472A;fontFamily=Arial;" vertex="1" parent="1">
  <mxGeometry x="120" y="160" width="1000" height="50" as="geometry"/>
</mxCell>

<!-- 正文内容 -->
<mxCell id="body" value="[正文内容...]" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=top;fontSize=22;fontColor=#000000;fontFamily=Times New Roman;" vertex="1" parent="1">
  <mxGeometry x="120" y="240" width="1680" height="600" as="geometry"/>
</mxCell>

<!-- 汇报人信息行 -->
<mxCell id="info" value="汇报人：xxx    院系：xxx    Date: 2024/01/01" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=20;fontColor=#2C5160;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="120" y="820" width="1400" height="40" as="geometry"/>
</mxCell>
```