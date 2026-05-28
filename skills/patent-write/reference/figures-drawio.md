---
name: patent-figures-drawio
description: 为中文发明专利生成黑白配色、中文标注的 Draw.io 附图。支持总体流程图、架构图、模块步骤图、系统框图四种类型。
type: reference
---

# 专利附图 Draw.io 绘制规范

## 基本原则

- 配色：**全黑白灰**，禁用彩色填充。允许用浅灰区分层级，白色为主填充。
- 文字：**全中文**，模块名粗体，副标题常规体，字号 18–22px。
- 线条：**黑色实线**（`strokeColor=#111111`），箭头用 `classic`，`strokeWidth=2`。
- 菱形判断框：白色填充，黑色边框，字号 18px。
- 容器/分组：浅灰填充（`#F5F5F5`）或无填充 + 黑色虚线边框（`dashed=1`）。
- 背景：白色（`background=#FFFFFF`）。

## 四种图类型

### 1. 总体流程图（方法流程）

适用：权利要求步骤 S1→S2→…→SN 的线性流程。

**参考专利通行风格（重要）：**
- 纯线性向下，**主流程图不画分支**，分支细节留给从属权利要求或其他附图
- 步骤标签 S1/S2… 写在框的**左侧外部**，加短横线指向框边，不写在框内
- 框内只有一段文字，简短描述步骤功能，字号 20–22px 粗体，不加副描述
- 箭头用实心三角头（`endArrow=block;endFill=1`），比 classic 更符合专利图惯例
- 开始/结束用胶囊形（`rounded=1;arcSize=50`）
- 页面宽度约 900px，框宽占约 65%（580px），框间距约 50px

```xml
<!-- 页面设置 -->
<mxGraphModel pageWidth="900" pageHeight="1500" backg
round="#FFFFFF">

<!-- 开始/结束胶囊 -->
<mxCell value="开始"
  style="rounded=1;arcSize=50;whiteSpace=wrap;html=1;
         fillColor=#FFFFFF;strokeColor=#111111;strokeWidth=2;
         fontSize=22;fontStyle=1"
  vertex="1" parent="1">
  <mxGeometry x="300" y="60" width="300" height="60" as="geometry"/>
</mxCell>

<!-- S标签（框外左侧）-->
<mxCell value="S1" style="text;html=1;strokeColor=none;fillColor=none;
  fontSize=20;fontStyle=1;align=right;verticalAlign=middle"
  vertex="1" parent="1">
  <mxGeometry x="60" y="175" width="60" height="60" as="geometry"/>
</mxCell>
<!-- S标签短横线 -->
<mxCell style="edgeStyle=none;html=1;strokeColor=#111111;strokeWidth=1.5;
  endArrow=none" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="120" y="205" as="sourcePoint"/>
    <mxPoint x="160" y="205" as="targetPoint"/>
  </mxGeometry>
</mxCell>

<!-- 步骤框（框内只有步骤名，不加副描述）-->
<mxCell value="接收批改请求"
  style="rounded=1;whiteSpace=wrap;html=1;
         fillColor=#FFFFFF;strokeColor=#111111;strokeWidth=2;
         fontSize=22;fontStyle=1;align=center;verticalAlign=middle"
  vertex="1" parent="1">
  <mxGeometry x="160" y="170" width="580" height="70" as="geometry"/>
</mxCell>

<!-- 箭头（实心三角头）-->
<mxCell style="edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;
               strokeColor=#111111;strokeWidth=2;endArrow=block;endFill=1"
  edge="1" source="src_id" target="tgt_id" parent="1">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

### 2. 架构图（智能体协同架构）

适用：决策智能体 + 专项批改智能体集合 + 汇总智能体的层级结构。

参考布局（黑白配色，层级结构）：

```
┌─────────────────────────────────────────────────┐
│  兼容层（请求接收）                                 │ ← 无填充 + 实线边框
├─────────────────────────────────────────────────┤
│  决策智能体                                        │ ← 白色填充 + 粗实线
├─────────────────────────────────────────────────┤
│  任务路由规划                                      │ ← 浅灰填充 #F5F5F5
├────────┬─────────┬────────┬───────────────────┤
│文本语义 │数学步骤  │英语语法 │图形结构            │ ← 各智能体 白色+实线
│比对型  │推理型   │感知型  │识别型              │   圆角矩形 rounded=1
└────────┴─────────┴────────┴───────────────────┘
         ↓ 统一执行（箭头统一汇聚）
┌─────────────────────────────────────────────────┐
│  汇总智能体（归一化 + 报告生成）                    │ ← 白色填充 + 粗实线
└─────────────────────────────────────────────────┘
```

关键样式差异（对照参考图原彩色版改为黑白）：

| 原参考图配色 | 专利版改为 |
|---|---|
| `fillColor=#d5e8d4`（绿色智能体） | `fillColor=#FFFFFF` |
| `strokeColor=#82b366`（绿边框） | `strokeColor=#111111` |
| `fillColor=#f5f5f5`（灰色规划模块） | `fillColor=#F5F5F5`（保留浅灰） |
| `fillColor=#EEF7EA`（状态模块） | `fillColor=#FFFFFF` + `dashed=1` |
| `strokeColor=#34A853`（绿色执行箭头） | `strokeColor=#111111` |

### 3. 模块步骤图（单智能体内部流程）

适用：某一专项智能体内部的评分步骤，如加分制/扣分制流程。

布局建议：
- 顶部：输入框（白色圆角矩形）
- 中间：菱形判断 → 分支标注"加分制"/"扣分制"
- 末尾：输出框（白色矩形），箭头向下

### 4. 系统框图（系统实施例）

适用：实施例2中的系统模块结构，各模块并列或层叠展示。

```xml
<!-- 系统模块框模板 -->
<mxCell value="决策智能体模块&#xa;维护路由映射表，转发批改请求"
  style="rounded=0;whiteSpace=wrap;html=1;
         fillColor=#F5F5F5;strokeColor=#111111;strokeWidth=2;
         fontSize=20;fontStyle=1;align=center;verticalAlign=middle"
  vertex="1" parent="1">
  <mxGeometry x="300" y="200" width="500" height="90" as="geometry"/>
</mxCell>
```

## 全局 mxGraphModel 设置

```xml
<mxGraphModel dx="1434" dy="836" grid="0" gridSize="10" guides="0"
  tooltips="1" connect="1" arrows="1" fold="1" page="1"
  pageScale="1" pageWidth="1600" pageHeight="980"
  background="#FFFFFF" math="0" shadow="0">
```

## 文字规范

- 模块主名：中文，粗体（`fontStyle=1`），字号 20–22px
- 副描述（第二行）：字号 15px，`<font style="font-size:15px;">副描述</font>`
- 箭头标注：字号 18px，背景色 `#FFFFFF` 防遮挡
- 禁止使用英文模块名（兼容层、决策Agent 等原图英文标注，统一改为中文）

## 禁止事项

- 禁用彩色填充（绿、蓝、黄、橙等）
- 禁用 `sketch=1`（手绘风格）
- 禁用阴影（`shadow=0`）
- 禁用英文标注
- 禁用像素级对齐（允许轻微偏差，保持图面整洁即可）