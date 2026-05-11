# 技术图与模型架构图生成规范

在无参考图的情况下，根据用户需求生成专业、可编辑、可用于论文或技术文档的 `.drawio` 图表。优先保证信息层次清楚、视觉统一、审稿人能快速读懂核心结构。

## 使用时机

- 用户需要为深度学习模型（如 Transformer、CNN、RNN 等）生成架构图
- 用户需要绘制算法流程图、数据流图、系统架构图
- 用户需要可视化特定概念（如感受野、注意力机制、特征金字塔）
- 用户提到「画个图」「生成架构图」「可视化模型结构」「绘制流程图」等需求

## 工作流程

### Step 1：明确图的核心信息

1. **确定图表类型**：
   - 模型架构图：突出模块层级、数据流、重复结构和关键连接
   - 算法流程图：突出步骤顺序、输入输出、条件分支
   - 概念示意图：突出关键变量、计算关系、局部机制
   - 系统架构图：突出模块职责、数据/控制流、边界

2. **提取必要内容**：
   - 有代码时，优先分析类结构、`forward` 方法、层堆叠关系和张量流向
   - 无代码时，从用户描述中提取节点、层次、连接、重复次数和输入输出
   - 不确定的结构不要凭空补全；影响图意的假设需要在输出说明中标注

### Step 2：先设计布局，再写 XML

1. **选择布局方向**：
   - 自下而上：适合神经网络前向传播、编码器/解码器堆叠
   - 自上而下：适合步骤流程、决策流程、训练流程
   - 自左向右：适合时序展开、多阶段 pipeline、特征提取链路
   - 中心发散：适合注意力机制、多分支融合、模块内部机制

2. **控制专业版式**：
   - 画布建议 `1400-1800` 宽、`900-1200` 高；复杂图可使用 `page="0"` 的自由画布
   - 主模块宽度建议 `300-420px`，高度 `56-72px`；不要使用过小的 11px 字号
   - 主标题 `28-32px`，模块标题 `24-26px`，说明文字 `18-20px`
   - 模块间距至少 `28-40px`；分组容器内边距至少 `40px`
   - 同一列内所有模块必须使用**相同的 x 坐标和相同的宽度**，不能宽窄混用；以容器中心居中，左右内边距各留 50-60px
   - 编码器/解码器、Backbone/Neck/Head 等并列结构要对齐基线和中心线
   - 残差、跳连、跨模块连接走外侧，避免穿过主节点

### Step 3：使用统一的学术图样式

参考浅色学术配色，避免高饱和、杂乱或默认 Draw.io 风格。

| 元素 | 推荐样式 |
| --- | --- |
| 页面 | `grid="0"`，优先白色或透明背景 |
| 分组容器 | `rounded=1;arcSize=10;strokeWidth=3;fillColor=#FFFCFF;strokeColor=#B7E0FF` |
| 普通模块 | `rounded=1;arcSize=10;strokeWidth=2;fillColor=#FCF7FF;strokeColor=#666666` |
| 注意力/关键计算 | `fillColor=#EBDFF2;strokeColor=#9673A6` |
| 前馈/卷积/变换层 | `fillColor=#FFFBE6;strokeColor=#CFC286` |
| 归一化/融合 | `fillColor=#C9E9D2;strokeColor=#67AB9F` |
| 输入/嵌入 | `fillColor=#FAE2D4;strokeColor=#B89E8A` |
| 输出/预测 | `fillColor=#B7E0FF;strokeColor=#6C8EBF` |
| 说明框 | `fillColor=#FFFBE6;strokeColor=#CFC286` |
| 主连线 | `edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#000000;strokeWidth=2;endArrow=classic` |
| 残差/辅助连线 | 主连线基础上加 `dashed=1;dashPattern=8 6;strokeColor=#666666` |

### Step 4：生成 XML（关键）

优先生成未压缩、可读的 Draw.io XML，便于后续人工编辑和版本对比。

```xml
<mxfile host="app.diagrams.net">
  <diagram name="图表名称" id="diagram-id">
    <mxGraphModel dx="1600" dy="1000" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" pageScale="1" pageWidth="1600" pageHeight="1000" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <mxCell id="2" value="模块名称" style="rounded=1;arcSize=10;whiteSpace=wrap;html=1;strokeWidth=2;fillColor=#FCF7FF;strokeColor=#666666;fontColor=#333333;" vertex="1" parent="1">
          <mxGeometry x="100" y="100" width="360" height="64" as="geometry"/>
        </mxCell>
        <mxCell id="4" value="下游模块" style="rounded=1;arcSize=10;whiteSpace=wrap;html=1;strokeWidth=2;fillColor=#FFFBE6;strokeColor=#CFC286;fontColor=#333333;" vertex="1" parent="1">
          <mxGeometry x="100" y="220" width="360" height="64" as="geometry"/>
        </mxCell>
        <mxCell id="3" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;strokeColor=#000000;strokeWidth=2;endArrow=classic;" edge="1" parent="1" source="2" target="4">
          <mxGeometry relative="1" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

生成过程中的检查清单：
- [ ] 每个 `<mxCell>` 都有对应的 `</mxCell>`，不能写成 `</mCell>`
- [ ] 节点使用 `vertex="1"`，连线使用 `edge="1"`
- [ ] 所有 ID 唯一，连线的 `source` 和 `target` 指向存在节点
- [ ] 文本中的特殊字符已转义：`&`、`<`、`>` 分别写成 `&amp;`、`&lt;`、`&gt;`
- [ ] 所有普通元素都有 `parent="1"`，根元素除外
- [ ] 节点不重叠，连线不穿过关键文字，外侧跳连留足空间
- [ ] 同类节点的宽高、字号、圆角、描边保持一致
- [ ] `value` 里的富文本直接写 `<font style="...">` 原始标签，**不要**预先写成 `&lt;font&gt;`——由 XML 序列化做唯一一次转义；否则 Draw.io 会把标签当纯文字显示
- [ ] 分组容器的底边/顶边必须留出至少 30px 内边距，确保最靠近边界的节点完全在容器内而不越界

### Step 5：添加辅助表达

1. **重复结构**：使用 `x N`、`N layers` 或分组标题表示，不要机械复制多层导致图拥挤。
2. **残差连接**：用外侧虚线箭头表达，落点指向 `Add + Norm` 或融合节点。
3. **跨模块信息流**：如 Encoder Memory 到 Cross-Attention，应使用清晰的横向正交箭头，并添加说明框。
4. **维度/参数标注**：只标关键维度，避免把论文公式全部塞进节点。
5. **标题与图注**：标题和图注放在图的**下方**（y 坐标大于最低节点底边 + 30px），不放顶部，符合论文图题惯例。

## 常见图表模板

### Transformer 编码器/解码器

结构：输入嵌入与位置编码、Multi-Head Self-Attention、Add + LayerNorm、FFN、Decoder Masked Attention、Encoder-Decoder Cross-Attention、Linear + Softmax、残差连接、`x N` 重复层。布局优先左右分列，Encoder 在左、Decoder 在右，数据流自下而上，Encoder Memory 横向输入 Cross-Attention。

### CNN / 检测网络架构图

结构：Input、Backbone、Neck、Head、Prediction，可按阶段从左到右展开。复杂模块用容器概括，模块内部只展示对理解贡献最大的算子。

### 感受野示意图

结构：多层特征图网格、感受野高亮、计算公式框、参数说明。布局横向并列，颜色只强调被解释区域。

### 注意力机制图

结构：Q/K/V、矩阵乘法、Scale、Softmax、加权求和、输出。布局可以自下而上或左到右，矩阵和向量要对齐，避免箭头交叉。

## 质量标准

- **内容准确**：图中每个模块都能追溯到用户描述、论文结构或代码实现。
- **层次清晰**：主路径、辅助路径、重复结构一眼可分辨。
- **视觉统一**：同类模块同色、同尺寸、同字号，连线样式一致。
- **审稿友好**：字号足够大，图形留白充足，避免装饰性元素压过模型结构。
- **可维护**：输出未压缩 XML，后续可在 Draw.io 中继续编辑。

## 输出模板

输出时说明：图表说明、核心组件、布局与配色、文件位置、Draw.io 打开方式、论文图题建议。

## 常见问题

- "Not a diagram file"：检查 `<mxfile>`、`<diagram>`、`<mxGraphModel>` 的嵌套关系
- "Opening and ending tag mismatch"：确保所有 XML 标签闭合正确
- 节点/连线不显示：检查 `vertex`/`edge`、`parent`、`source`/`target`
- 中文乱码：使用 UTF-8 编码，特殊字符按 XML 规则转义
- 图看起来不专业：优先检查字号是否过小、模块是否拥挤、颜色是否过多、连线是否穿过主体