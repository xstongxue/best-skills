# 从零生成图表

在无参考图的情况下，根据用户需求（模型架构、算法流程、概念示意等）从零生成 .drawio 图表。

## 使用时机

- 用户需要为深度学习模型（如 Transformer、CNN、RNN 等）生成架构图
- 用户需要绘制算法流程图、数据流图、系统架构图
- 用户需要可视化特定概念（如感受野、注意力机制、特征提取过程等）
- 用户提到「画个图」「生成架构图」「可视化模型结构」「绘制流程图」等需求

## 工作流程

### Step 1：需求分析

1. **确定图表类型**：
   - 模型架构图（Transformer、CNN、RNN、GAN 等）
   - 算法流程图（前向传播、训练流程、推理流程）
   - 概念示意图（感受野、注意力机制、特征金字塔）
   - 系统架构图（多模块交互、数据流）

2. **提取关键信息**：
   - 如果有代码：分析类结构、forward 方法、层堆叠关系
   - 如果是概念图：确定需要展示的核心要素

### Step 2：设计布局

1. **选择布局方向**：
   - 自下而上：适合数据流图、前向传播
   - 自上而下：适合层次结构、决策流程
   - 自左向右：适合时序展开、编码-解码结构
   - 中心发散：适合注意力机制、多分支结构

2. **规划元素位置**：
   - 计算画布大小（通常 800-1200 宽，600-1000 高）
   - 为每个模块预留空间（节点间距至少 20-30px）
   - 考虑残差连接、跳跃连接的路径

### Step 3：生成 XML（关键）

**严格按照以下模板生成，避免标签错误：**

```xml
<mxfile host="app.diagrams.net">
  <diagram name="图表名称" id="唯一id">
    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="900" pageHeight="800" background="#F5F5DC">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        
        <!-- 2D 节点示例 -->
        <mxCell id="2" value="节点标签" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F4CCCC;strokeColor=#333333;strokeWidth=1;fontSize=11" vertex="1" parent="1">
          <mxGeometry x="100" y="100" width="150" height="40" as="geometry"/>
        </mxCell>
        
        <!-- 3D 节点示例 (用于表示特征图、卷积层等立体结构) -->
        <mxCell id="3" value="" style="shape=cube;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;darkOpacity=0.05;darkOpacity2=0.1;size=20;fillColor=#B3D9E6;strokeColor=#333333;strokeWidth=1.5" vertex="1" parent="1">
          <mxGeometry x="300" y="50" width="50" height="140" as="geometry"/>
        </mxCell>
        <!-- 3D 节点的文本标签 (通常放置于图形下方独立对齐) -->
        <mxCell id="3_label" value="Conv" style="text;html=1;align=center;verticalAlign=middle;fontSize=11;" vertex="1" parent="1">
          <mxGeometry x="295" y="200" width="60" height="20" as="geometry"/>
        </mxCell>

        <!-- 连线示例 -->
        <mxCell id="4" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#000000;strokeWidth=2;endArrow=classic" edge="1" parent="1" source="2" target="3">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
        
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

**生成过程中的检查清单：**
- [ ] 每个 `<mxCell>` 都有对应的 `</mxCell>`（不是 `</mCell>` 或其他）
- [ ] `vertex="1"` 用于节点，`edge="1"` 用于连线
- [ ] 所有 ID 唯一且连续（0, 1, 2, 3, ...）
- [ ] 连线的 `source` 和 `target` 指向存在的节点 ID
- [ ] 文本中的特殊字符已转义（`&lt;`、`&gt;`、`&amp;`）
- [ ] 所有元素都有 `parent="1"`（除了根元素 0 和 1）

### Step 4：添加辅助元素

1. **标注文本**：输入/输出标签、参数说明框、操作说明（如 "× N"）、公式或维度标注
2. **视觉增强**：分组容器框、残差连接（虚线箭头）、颜色区分不同类型的层

### Step 5：输出与说明

图表说明、使用指南、图题和论文引用示例。

## 标准配色方案（学术风格）

- **背景色**：`#F5F5DC`
- **输入/嵌入层**：`#F4CCCC`
- **卷积/变换层**：`#B3D9E6`
- **注意力层**：`#F4CCCC`
- **归一化层**：`#FFEB99`
- **前馈网络/MLP**：`#B3D9E6`
- **输出层**：`#B6D7A8`
- **特殊操作**：`#E6E6FA`
- **拼接/融合**：`#FFD966`
- **参数说明框**：`#FFF9E6`

## 常见图表类型模板

### Transformer 编码器/解码器
结构：Input Embedding + PE、Multi-Head Attention、Add & Norm、FFN、残差连接、× N 层。布局：自下而上，左右分列。

### CNN 架构图
结构：输入图像、Conv+BN+Act、池化、特征图维度、全连接、输出。布局：自左向右。

### 感受野示意图
结构：多层特征图网格、感受野高亮、计算公式框、参数说明。布局：横向并列。

### 注意力机制图
结构：Q/K/V、矩阵乘法、Softmax、加权求和、注意力权重可视化。布局：自下而上或流程图式。

## 质量保证

- **生成前**：准确理解代码/概念，确定图表类型
- **生成后**：XML 语法检查、逻辑完整性（连线、ID）、视觉效果（不重叠、间距合理）

## 输出模板

图表说明、核心组件、设计风格、文件信息、使用说明、论文引用示例。详见主 SKILL 输出模板。

## 常见问题

- "Not a diagram file"：检查 `<mxfile>`、`host`、嵌套关系
- "Opening and ending tag mismatch"：确保 `</mxCell>` 正确闭合
- 节点/连线不显示：检查 `vertex`/`edge`、`parent`、`source`/`target`
- 中文乱码：UTF-8 编码，特殊字符转义

## 注意事项

1. 连线使用 `edgeStyle=orthogonalEdgeStyle` 自动布线
2. ID 按生成顺序递增
3. 文本换行用 `&lt;br&gt;`
4. 保持学术风格简洁
5. 宽度建议不超过 800-1000px