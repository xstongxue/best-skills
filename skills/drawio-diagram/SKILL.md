---
name: drawio-diagram
description: 生成标准 Draw.io (.drawio) 格式的可视化图表；支持从零生成与风格迁移两种模式。从零生成：AI/深度学习模型架构图、算法流程图、系统架构图；教育/考试示意图（数学几何、物理受力/电路/光路、化学实验/分子结构、生物细胞/遗传/食物链、地理经纬/圈层/地形、历史时间轴/朝代/制度、语文结构图）。风格迁移：参考图 + 内容 → 按参考图风格生成新图。确保 XML 格式正确，可直接在 Draw.io 中打开编辑。
---

# Draw.io 图表

本 Skill 指导 Agent 生成**标准的 Draw.io 格式图表**（.drawio 文件），支持两种模式：**从零生成**（技术图表、教育/考试示意图等）与**风格迁移**（参考图 + 内容 → 按参考图风格生成新图）。

## Step 0：任务识别

| 条件 | 执行 |
|------|------|
| 用户提供**参考图**，且希望「按这张图的风格」画新图 | 执行 `reference/style-migration.md` |
| 数学几何图形（三角形、圆、圆柱、坐标系、数轴、韦恩图等） | 执行 `reference/edu-math.md` |
| 物理示意图（受力图、电路图、光路图、运动轨迹等） | 执行 `reference/edu-physics.md` |
| 化学示意图（实验装置、原子结构、分子结构、方程式注解等） | 执行 `reference/edu-chemistry.md` |
| 生物示意图（细胞结构、遗传图解、食物链/食物网等） | 执行 `reference/edu-biology.md` |
| 地理示意图（经纬网、地球圈层、地形剖面、大气环流等） | 执行 `reference/edu-geography.md` |
| 历史示意图（时间轴、朝代更迭、政治制度、因果关系等） | 执行 `reference/edu-history.md` |
| 语文示意图（文章结构、古诗词脉络、句子成分、议论文结构等） | 执行 `reference/edu-chinese.md` |
| 其他（AI/深度学习模型架构、算法流程、系统架构等） | 执行 `reference/tech-diagram.md` |

## 使用时机

**从零生成：**
- 用户需要为深度学习模型（如 Transformer、CNN、RNN 等）生成架构图
- 用户需要绘制算法流程图、数据流图、系统架构图
- 用户需要可视化特定概念（如感受野、注意力机制、特征提取过程等）
- **用户需要教育/考试示意图**：
  - 数学：几何图形（三角形、圆、圆柱、圆锥、棱柱等）、数轴、韦恩图、坐标系
  - 物理：受力分析图、电路图、光路图、运动轨迹图
  - 化学：实验装置图、原子/分子结构、化学反应方程式注解
  - 生物：细胞结构图、遗传图解、食物链/食物网
  - 地理：经纬网、地球圈层、地形剖面图、大气环流/风带
  - 历史：时间轴、朝代更迭图、政治制度示意、因果关系图
  - 语文：文章结构图、古诗词脉络图、句子成分分析、议论文结构图
- 用户提到「画个图」「生成架构图」「可视化模型结构」「绘制流程图」「画示意图」「考试题图」等需求

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

- **节点**：`rounded=1;whiteSpace=wrap;html=1;fillColor=#颜色;strokeColor=#333333;strokeWidth=1;fontSize=11`
- **连线**：`edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#000000;strokeWidth=2;endArrow=classic`
- **虚线（残差）**：`dashed=1`

### 4. 输出要求

1. 图表说明（2-3 行）
2. 使用指南：Draw.io 打开、导出 PNG/SVG/PDF、图题与论文引用示例

## 参考资源

- Draw.io：https://app.diagrams.net/
- 官方文档：https://www.drawio.com/doc/