# 数学几何图形

考试题目中的数学示意图：几何图形、坐标系、数轴、韦恩图等。

## 通用规范

- 背景白色 `background="#FFFFFF"`，线条黑色 `#000000`，线宽 1.5
- 填充色为 `none`（空心图形），标注文字（顶点/角/长度）紧贴对应位置
- 辅助线（高、中线、虚线延长线）用 `dashed=1`，颜色 `#666666`

## 图形模板

### 三角形

```xml
<!-- 等腰三角形 ABC，底边水平 -->
<mxCell id="2" value="" style="shape=mxgraph.basic.isoceles;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000000;strokeWidth=1.5;" vertex="1" parent="1">
  <mxGeometry x="150" y="80" width="200" height="160" as="geometry"/>
</mxCell>
<!-- 顶点标注 A（顶部居中） -->
<mxCell id="3" value="A" style="text;html=1;align=center;fontSize=14;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="238" y="56" width="24" height="24" as="geometry"/>
</mxCell>
<!-- 顶点标注 B（左下） -->
<mxCell id="4" value="B" style="text;html=1;align=center;fontSize=14;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="122" y="236" width="24" height="24" as="geometry"/>
</mxCell>
<!-- 顶点标注 C（右下） -->
<mxCell id="5" value="C" style="text;html=1;align=center;fontSize=14;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="354" y="236" width="24" height="24" as="geometry"/>
</mxCell>
```

直角三角形（用 `shape=mxgraph.basic.right_triangle`）：

```xml
<mxCell id="2" value="" style="shape=mxgraph.basic.right_triangle;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000000;strokeWidth=1.5;" vertex="1" parent="1">
  <mxGeometry x="100" y="100" width="200" height="160" as="geometry"/>
</mxCell>
```

### 圆

#### 圆上取点（坐标精度要求）

Draw.io 中 **y 轴向下**。圆心 (cx, cy)，半径 r，角度 θ（从水平右侧起，逆时针为正）：

```
x = cx + r × cos(θ)
y = cy − r × sin(θ)
```

常用方向偏移（乘以实际半径 r）：

| 方向 | Δx | Δy（屏幕坐标） |
|------|-----|---------------|
| 右 0° | +r | 0 |
| 右上 45° | +0.707r | −0.707r |
| 上 90° | 0 | −r |
| 左上 135° | −0.707r | −0.707r |
| 左 180° | −r | 0 |
| 左下 225° | −0.707r | +0.707r |
| 下 270° | 0 | +r |
| 右下 315° | +0.707r | +0.707r |

**关键规则**：弦端点、切点等所有圆上的点，坐标必须满足 `(x−cx)² + (y−cy)² = r²`，偏差超过 2px 在视觉上会明显偏离圆边。

#### 圆的综合示例（半径 r=150，圆心 (250, 210)，画布 560×450）

```xml
<!-- 圆（空心，aspect=fixed 保证正圆） -->
<mxCell id="2" value="" style="ellipse;aspect=fixed;fillColor=none;strokeColor=#000000;strokeWidth=2;html=1;" vertex="1" parent="1">
  <mxGeometry x="100" y="60" width="300" height="300" as="geometry"/>
</mxCell>
<!-- 圆心小点 -->
<mxCell id="3" value="" style="ellipse;aspect=fixed;fillColor=#000000;strokeColor=#000000;html=1;" vertex="1" parent="1">
  <mxGeometry x="247" y="207" width="6" height="6" as="geometry"/>
</mxCell>
<!-- 圆心标注 O -->
<mxCell id="4" value="O" style="text;html=1;align=left;fontSize=14;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="256" y="200" width="20" height="20" as="geometry"/>
</mxCell>

<!-- 半径 OA（→ 右侧 0°，A 精确在圆上：cx+r=400, cy=210） -->
<mxCell id="5" value="r" style="endArrow=none;html=1;strokeWidth=1.5;fontSize=13;fontStyle=2;labelPosition=center;verticalLabelPosition=top;align=center;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="250" y="210" as="sourcePoint"/>
    <mxPoint x="400" y="210" as="targetPoint"/>
  </mxGeometry>
</mxCell>
<!-- 点 A（右，0°：400, 210） -->
<mxCell id="6" value="" style="ellipse;aspect=fixed;fillColor=#000000;strokeColor=#000000;html=1;" vertex="1" parent="1">
  <mxGeometry x="397" y="207" width="6" height="6" as="geometry"/>
</mxCell>
<mxCell id="7" value="A" style="text;html=1;align=left;fontSize=13;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="406" y="202" width="20" height="20" as="geometry"/>
</mxCell>

<!-- 直径 CD（竖，C 在顶 90°：250,60；D 在底 270°：250,360） -->
<mxCell id="8" value="" style="endArrow=none;html=1;strokeWidth=1.5;strokeColor=#B85450;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="250" y="60" as="sourcePoint"/>
    <mxPoint x="250" y="360" as="targetPoint"/>
  </mxGeometry>
</mxCell>
<!-- 点 C（顶，90°：250, 60） -->
<mxCell id="9" value="" style="ellipse;aspect=fixed;fillColor=#000000;strokeColor=#000000;html=1;" vertex="1" parent="1">
  <mxGeometry x="247" y="57" width="6" height="6" as="geometry"/>
</mxCell>
<mxCell id="10" value="C" style="text;html=1;align=center;fontSize=13;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="240" y="36" width="20" height="20" as="geometry"/>
</mxCell>
<!-- 点 D（底，270°：250, 360） -->
<mxCell id="11" value="" style="ellipse;aspect=fixed;fillColor=#000000;strokeColor=#000000;html=1;" vertex="1" parent="1">
  <mxGeometry x="247" y="357" width="6" height="6" as="geometry"/>
</mxCell>
<mxCell id="12" value="D" style="text;html=1;align=center;fontSize=13;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="240" y="366" width="20" height="20" as="geometry"/>
</mxCell>
<!-- 直径标注 2r -->
<mxCell id="13" value="2r（直径）" style="text;html=1;align=left;fontSize=12;fontColor=#B85450;" vertex="1" parent="1">
  <mxGeometry x="258" y="268" width="80" height="20" as="geometry"/>
</mxCell>

<!-- 弦 EF（注意：不能选 θ 和 θ+180° 的组合，否则 EF 就变成直径）
     E=140°：x=250+150×cos(140°)=135, y=210-150×sin(140°)=114
     F=305°：x=250+150×cos(305°)=336, y=210-150×sin(305°)=333
     两角相差 165°，中点 (235,223) ≠ 圆心，确认为非直径弦 -->
<mxCell id="14" value="" style="endArrow=none;html=1;strokeWidth=1.5;strokeColor=#6C8EBF;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="144" y="104" as="sourcePoint"/>
    <mxPoint x="356" y="316" as="targetPoint"/>
  </mxGeometry>
</mxCell>
<!-- 点 E（135°：144, 104） -->
<mxCell id="15" value="" style="ellipse;aspect=fixed;fillColor=#000000;strokeColor=#000000;html=1;" vertex="1" parent="1">
  <mxGeometry x="141" y="101" width="6" height="6" as="geometry"/>
</mxCell>
<mxCell id="16" value="E" style="text;html=1;align=right;fontSize=13;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="120" y="94" width="20" height="20" as="geometry"/>
</mxCell>
<!-- 点 F（315°：356, 316） -->
<mxCell id="17" value="" style="ellipse;aspect=fixed;fillColor=#000000;strokeColor=#000000;html=1;" vertex="1" parent="1">
  <mxGeometry x="353" y="313" width="6" height="6" as="geometry"/>
</mxCell>
<mxCell id="18" value="F" style="text;html=1;align=left;fontSize=13;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="362" y="314" width="20" height="20" as="geometry"/>
</mxCell>
<!-- 弦标注 -->
<mxCell id="19" value="弦 EF" style="text;html=1;align=center;fontSize=12;fontColor=#6C8EBF;" vertex="1" parent="1">
  <mxGeometry x="170" y="246" width="50" height="20" as="geometry"/>
</mxCell>

<!-- 切线 PQ（过切点 A，垂直于半径 OA，x 固定在 400） -->
<mxCell id="20" value="" style="endArrow=none;html=1;strokeWidth=1.5;strokeColor=#82B366;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="400" y="110" as="sourcePoint"/>
    <mxPoint x="400" y="310" as="targetPoint"/>
  </mxGeometry>
</mxCell>
<mxCell id="21" value="切线" style="text;html=1;align=left;fontSize=12;fontColor=#82B366;" vertex="1" parent="1">
  <mxGeometry x="408" y="148" width="40" height="20" as="geometry"/>
</mxCell>
<!-- 直角符号（切点处，边长 10px） -->
<mxCell id="22" value="" style="rounded=0;fillColor=none;strokeColor=#82B366;strokeWidth=1.5;html=1;" vertex="1" parent="1">
  <mxGeometry x="390" y="200" width="10" height="10" as="geometry"/>
</mxCell>
```

### 圆柱

```xml
<mxCell id="2" value="" style="shape=mxgraph.basic.cylinder2;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000000;strokeWidth=1.5;" vertex="1" parent="1">
  <mxGeometry x="160" y="80" width="160" height="220" as="geometry"/>
</mxCell>
```

### 圆锥

```xml
<mxCell id="2" value="" style="shape=mxgraph.basic.cone;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000000;strokeWidth=1.5;" vertex="1" parent="1">
  <mxGeometry x="160" y="80" width="180" height="220" as="geometry"/>
</mxCell>
```

### 长方体（斜二测画法）

用四边形 + 虚线隐边拼接：

```xml
<!-- 前面（矩形） -->
<mxCell id="2" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000000;strokeWidth=1.5;" vertex="1" parent="1">
  <mxGeometry x="100" y="160" width="180" height="120" as="geometry"/>
</mxCell>
<!-- 顶面（平行四边形，右上偏移） -->
<mxCell id="3" value="" style="shape=mxgraph.basic.parallelogram;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000000;strokeWidth=1.5;" vertex="1" parent="1">
  <mxGeometry x="160" y="80" width="180" height="80" as="geometry"/>
</mxCell>
<!-- 右侧面（平行四边形） -->
<mxCell id="4" value="" style="shape=mxgraph.basic.parallelogram;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000000;strokeWidth=1.5;direction=south;" vertex="1" parent="1">
  <mxGeometry x="280" y="80" width="80" height="200" as="geometry"/>
</mxCell>
```

### 直角坐标系

```xml
<!-- x 轴（带箭头） -->
<mxCell id="2" value="x" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;fontSize=14;fontStyle=1;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="60" y="260" as="sourcePoint"/><mxPoint x="420" y="260" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- y 轴（带箭头） -->
<mxCell id="3" value="y" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;fontSize=14;fontStyle=1;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="220" y="420" as="sourcePoint"/><mxPoint x="220" y="60" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 原点 O -->
<mxCell id="4" value="O" style="text;html=1;align=right;fontSize=13;" vertex="1" parent="1">
  <mxGeometry x="196" y="260" width="20" height="20" as="geometry"/>
</mxCell>
```

### 数轴

```xml
<!-- 数轴主线 -->
<mxCell id="2" value="" style="endArrow=open;endFill=0;startArrow=open;startFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="60" y="200" as="sourcePoint"/><mxPoint x="500" y="200" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 刻度点（每个刻度一个短竖线） -->
<mxCell id="3" value="-2" style="text;html=1;align=center;fontSize=13;" vertex="1" parent="1">
  <mxGeometry x="134" y="208" width="30" height="20" as="geometry"/>
</mxCell>
<!-- 零点 -->
<mxCell id="4" value="0" style="text;html=1;align=center;fontSize=13;" vertex="1" parent="1">
  <mxGeometry x="269" y="208" width="22" height="20" as="geometry"/>
</mxCell>
```

### 韦恩图（两集合）

```xml
<!-- 集合 A -->
<mxCell id="2" value="A" style="ellipse;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;opacity=50;fontSize=14;fontStyle=1;verticalAlign=top;" vertex="1" parent="1">
  <mxGeometry x="80" y="100" width="240" height="200" as="geometry"/>
</mxCell>
<!-- 集合 B -->
<mxCell id="3" value="B" style="ellipse;whiteSpace=wrap;html=1;fillColor=#D5E8D4;strokeColor=#82B366;opacity=50;fontSize=14;fontStyle=1;verticalAlign=top;" vertex="1" parent="1">
  <mxGeometry x="200" y="100" width="240" height="200" as="geometry"/>
</mxCell>
```