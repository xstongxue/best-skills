# 风格四：科技明快 / 现代前沿（来源：通用ppt模板4.pptx）

## 真实样式数据来源
- 源文件：`通用ppt模板4.pptx`（13 页）
- 画布：1920 × 1080（16:9，原模板宽约 338 mm）

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
| 主色 / 横条色块 | `#0170C1` | 高饱和度科技蓝 |
| 基础文字 | 继承（黑色） | 正文 |
| 标题高亮 | `#0170C1` | 页面标题文字用蓝色 |
| 页面背景 | `#FFFFFF` | 白色 |

## 字体规范

- **整体与风格一保持一致**：封面主标题/副标题、目录标题与条目、节标题数字与章节名、内容页标题/正文/列表、图题/表题、底部日期、致谢等，统一沿用风格一在 `style1-classic-academic.md` 中给出的 `微软雅黑` 字体与字号体系。  
- 如需强调“科技感”，可以在**个别英文单词或小标题**上适度使用科技感强的西文字体（如 `Century Gothic`），但不改变整体中文字体与字号级别。

## 版式规则（Draw.io 实现要点）

- **基础结构与风格一完全一致**：封面、目录、节标题页、内容页、致谢页等整体布局（顶栏 120 px + 强调色细线 6 px + 底部细线 + 右下角日期等）全部复用风格一，只是将主色替换为科技蓝 `#0170C1`（强调色仍可用 `#C9A84C`，或按需要选用同色系浅/深蓝做强调）。  
- “科技明快 / 现代前沿”主要通过配色和少量小装饰元素体现，不改变整体结构。

### 通用装饰（可选增强）
- 顶栏或正文区可增加 `fillColor=#0170C1` 的小竖色块/细横条，作为导航与强调，不改变布局。
- 底部可叠加一条科技蓝细线作为装饰（与风格一底部细线并存或替换）。

## Draw.io XML 关键样式片段

```xml
<!-- 顶部左小色块 -->
<mxCell id="tl" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#0170C1;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="0" y="0" width="20" height="30" as="geometry"/>
</mxCell>

<!-- 顶部右延伸大横条 -->
<mxCell id="tr" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#0170C1;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="40" y="0" width="1880" height="30" as="geometry"/>
</mxCell>

<!-- 底部横条 -->
<mxCell id="bot" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#0170C1;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="0" y="1050" width="1920" height="30" as="geometry"/>
</mxCell>

<!-- 页面标题 -->
<mxCell id="ptitle" value="目录页" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=36;fontColor=#0170C1;fontFamily=方正尚酷简体;" vertex="1" parent="1">
  <mxGeometry x="120" y="80" width="600" height="60" as="geometry"/>
</mxCell>

<!-- 英文副标题 -->
<mxCell id="en" value="CONTENTS" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=24;fontColor=#000000;fontFamily=Garage Gothic;" vertex="1" parent="1">
  <mxGeometry x="120" y="150" width="400" height="40" as="geometry"/>
</mxCell>

<!-- 封面底部全宽横条（封面页用） -->
<mxCell id="cbot" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#0170C1;strokeColor=none;" vertex="1" parent="1">
  <mxGeometry x="0" y="1040" width="1920" height="40" as="geometry"/>
</mxCell>

<!-- 封面主标题 -->
<mxCell id="ctitle" value="基于 XX 的系统设计与实现" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontSize=48;fontColor=#000000;fontFamily=方正尚酷简体;" vertex="1" parent="1">
  <mxGeometry x="120" y="340" width="1400" height="100" as="geometry"/>
</mxCell>
```