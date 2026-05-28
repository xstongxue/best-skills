---
name: drawio-diagram
description: 为深度学习模型、网络架构、算法流程等生成标准 Draw.io (.drawio) 格式的可视化图表；支持从零生成与风格迁移两种模式。从零生成：模型架构图、流程图、感受野示意图等；风格迁移：参考图 + 内容描述/项目 → 按参考图风格生成新图。确保 XML 格式正确，可直接在 Draw.io 中打开编辑。
---

# Draw.io 图表

本 Skill 指导 Agent 生成**标准的 Draw.io 格式图表**（.drawio 文件），支持两种模式：**从零生成**（模型架构、算法流程等）与**风格迁移**（参考图 + 内容 → 按参考图风格生成新图）。

## Step 0：任务识别

| 条件 | 执行 |
|------|------|
| 用户提供**参考图**，且希望「按这张图的风格」画新图 | 执行 `reference/style-migration.md` |
| 其他情况（从零生成） | 执行 `reference/generation.md` |

## 使用时机

**从零生成：**
- 用户需要为深度学习模型（如 Transformer、CNN、RNN 等）生成架构图
- 用户需要绘制算法流程图、数据流图、系统架构图
- 用户需要可视化特定概念（如感受野、注意力机制、特征提取过程等）
- 用户提到「画个图」「生成架构图」「可视化模型结构」「绘制流程图」等需求

**风格迁移：**
- 用户提供参考图，希望「按这个风格画」「照着这个排版/配色画」

## 通用规范（两种模式共用）

### 1. XML 格式严格性

- ✅ 所有标签必须正确闭合：`<mxCell>` 对应 `</mxCell>`，绝不能写成 `</mCell>`
- ✅ 使用 `vertex="1"` 标记节点，`edge="1"` 标记连线
- ✅ 每个元素必须有唯一 `id`，从 0 开始递增
- ✅ 特殊字符必须转义：`&` → `&amp;`，`<` → `&lt;`，`>` → `&gt;`

### 2. 标准文件结构

```xml
<mxfile host="app.diagrams.net">
  <diagram name="图表名称" id="图表id">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="宽度" pageHeight="高度" background="#F5F5DC">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <!-- 所有图形元素从 id="2" 开始 -->
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

### 3. 常用样式

- **2D 节点**：`rounded=1;whiteSpace=wrap;html=1;fillColor=#颜色;strokeColor=#333333;strokeWidth=1;fontSize=11`
- **3D 节点（推荐用于神经网络层）**：`shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;darkOpacity=0.05;darkOpacity2=0.1;size=20;fillColor=#颜色;strokeColor=#333333;strokeWidth=1.5`
- **连线**：`edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#000000;strokeWidth=2;endArrow=classic`
- **虚线（残差）**：`dashed=1`

### 4. 输出要求

1. 图表说明（2-3 行）
2. 使用指南：Draw.io 打开、导出 PNG/SVG/PDF、图题与论文引用示例

## 参考资源

- Draw.io：https://app.diagrams.net/
- 官方文档：https://www.drawio.com/doc/