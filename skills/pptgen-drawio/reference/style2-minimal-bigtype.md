# 风格二：现代极简 / 大字报感（来源：通用ppt模板2.pptx）

## 真实样式数据来源
- 源文件：`通用ppt模板2.pptx`（24 页）
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
| 主色 / 大字标题 | Scheme 主题色（近似 `#231F20` 深灰黑） | 通过主题色系控制，无硬编码 RGB |
| 强调色块 | `#F5C638` | 亮黄色，用于小角标方块、图标装饰 |
| 基础文字 | 继承主题色（近似 `#231F20`） | 深灰近黑 |
| 页面背景 | 主题浅色（近似 `#F5F5F5` 或 `#FFFFFF`） | 极简留白 |

> **注**：模板2大量使用 Office 主题色（`_SchemeColor`），Draw.io 中以近似值 `#231F20` 替代主色，`#F5C638` 替代强调色。

## 字体规范

- **整体与风格一保持一致**：封面主标题、目录标题/条目、节标题数字与章节名、内容页标题/正文/列表、图表标题、底部日期、致谢页等，全部沿用风格一在 `style1-classic-academic.md` 中给出的字体与字号配置（默认使用 `微软雅黑`）。  
- **本风格仅在视觉层面做“现代极简 / 大字报感”的微调**，例如：某些节标题页可以将节号字号适当放大、在目录页叠加更大的英文单词，但不引入额外字体族或完全不同的字号体系。

## 版式规则（Draw.io 实现要点）

- **基础结构与风格一完全一致**：封面、目录、节标题页、内容页、致谢页都采用“顶栏色块 120 px + 强调色细线 6 px + 底部细线、右下角日期”等布局，只是将主色/强调色替换为本风格的 `#231F20` / `#F5C638`。  
- 下列规则仅作为在风格一版式基础上的**装饰性增强建议**，生成脚本可以按需选择使用：

### 封面页（可选增强）
- 在保持风格一封面结构的前提下，可将标题字号适当放大，营造“大字报”视觉冲击。

### 目录页（可选增强）
- 可在目录区域叠加一行超大字号英文单词（如 `CONTENT`），与中文「目录」形成视觉对比。

### 节标题（过渡）页（可选增强）
- 在原有 90 pt 节号基础上，允许略微放大节号，并保留大量留白以突出极简感。

### 内容页与装饰（可选增强）
- 可以在内容区域增加 `fillColor=#F5C638` 的小角标色块或细横条，作为段落导航，不改变整体结构。

## Draw.io XML 关键样式片段

```xml
<!-- 节标题页背景色块 -->
<mxCell id="bg" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#231F20;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="0" y="0" width="1920" height="1080" as="geometry"/>
</mxCell>

<!-- 超大节号数字 -->
<mxCell id="num" value="1" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=115;fontStyle=1;fontColor=#FFFFFF;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="120" y="300" width="400" height="300" as="geometry"/>
</mxCell>

<!-- 节标题中文 -->
<mxCell id="stitle" value="选题背景和意义" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=44;fontStyle=1;fontColor=#FFFFFF;fontFamily=微软雅黑;" vertex="1" parent="1">
  <mxGeometry x="120" y="620" width="800" height="80" as="geometry"/>
</mxCell>

<!-- 黄色导航角标 -->
<mxCell id="badge" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#F5C638;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="120" y="40" width="20" height="55" as="geometry"/>
</mxCell>

<!-- 目录条目示例 -->
<!-- value="第一部分  |  选题背景和意义"，fontSize=28，fontFamily=微软雅黑 -->
```