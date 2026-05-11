# 物理示意图

考试题目中的物理示意图：受力分析图、电路图、光路图、运动轨迹图。

## 通用规范

- 背景白色 `background="#FFFFFF"`，线条黑色 `#000000`
- 力箭头用实心箭头 `endArrow=block;endFill=1`，线宽 1.5–2
- 辅助线（法线、参考线）用虚线 `dashed=1`，颜色 `#666666`
- 力标注用**粗体**（`fontStyle=1`），字号 13–14px

## 受力分析图

物体（正方形或圆形）居中，各方向力箭头从物体边界出发，长度表示大小。

```xml
<!-- 物体（水平面上的正方体） -->
<mxCell id="2" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#E0E0E0;strokeColor=#000000;strokeWidth=1.5;" vertex="1" parent="1">
  <mxGeometry x="200" y="200" width="80" height="80" as="geometry"/>
</mxCell>
<!-- 重力 G（向下，从底面中点出发） -->
<mxCell id="3" value="G" style="endArrow=block;endFill=1;html=1;strokeWidth=2;fontStyle=1;fontSize=14;labelPosition=right;align=left;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="240" y="280" as="sourcePoint"/><mxPoint x="240" y="380" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 支持力 N（向上，从顶面中点出发） -->
<mxCell id="4" value="N" style="endArrow=block;endFill=1;html=1;strokeWidth=2;fontStyle=1;fontSize=14;labelPosition=right;align=left;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="240" y="200" as="sourcePoint"/><mxPoint x="240" y="100" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 摩擦力 f（向右，从右侧面中点出发） -->
<mxCell id="5" value="f" style="endArrow=block;endFill=1;html=1;strokeWidth=2;fontStyle=1;fontSize=14;labelPosition=top;align=center;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="280" y="240" as="sourcePoint"/><mxPoint x="380" y="240" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 水平面（物体下方） -->
<mxCell id="6" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="100" y="280" as="sourcePoint"/><mxPoint x="380" y="280" as="targetPoint"/></mxGeometry>
</mxCell>
```

### 斜面受力图

```xml
<!-- 斜面（三角形） -->
<mxCell id="2" value="" style="shape=mxgraph.basic.right_triangle;whiteSpace=wrap;html=1;fillColor=#F5F5F5;strokeColor=#000000;strokeWidth=1.5;" vertex="1" parent="1">
  <mxGeometry x="80" y="180" width="280" height="160" as="geometry"/>
</mxCell>
<!-- 斜面上的物体（小正方形） -->
<mxCell id="3" value="" style="rounded=0;fillColor=#E0E0E0;strokeColor=#000000;strokeWidth=1.5;" vertex="1" parent="1">
  <mxGeometry x="180" y="220" width="50" height="50" as="geometry"/>
</mxCell>
<!-- 重力 G（竖直向下） -->
<mxCell id="4" value="G" style="endArrow=block;endFill=1;html=1;strokeWidth=2;fontStyle=1;fontSize=13;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="205" y="270" as="sourcePoint"/><mxPoint x="205" y="360" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 支持力 N（垂直斜面向上，斜向） -->
<mxCell id="5" value="N" style="endArrow=block;endFill=1;html=1;strokeWidth=2;fontStyle=1;fontSize=13;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="205" y="220" as="sourcePoint"/><mxPoint x="155" y="134" as="targetPoint"/></mxGeometry>
</mxCell>
```

## 电路图

元件用简化图形表示，导线用正交折线（`edgeStyle=orthogonalEdgeStyle`）。

```xml
<!-- 电源（用矩形 + 标注表示） -->
<mxCell id="2" value="电源" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.5;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="100" y="160" width="60" height="40" as="geometry"/>
</mxCell>
<!-- 电阻 R₁ -->
<mxCell id="3" value="R₁" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.5;fontSize=13;" vertex="1" parent="1">
  <mxGeometry x="260" y="80" width="60" height="30" as="geometry"/>
</mxCell>
<!-- 电阻 R₂ -->
<mxCell id="4" value="R₂" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.5;fontSize=13;" vertex="1" parent="1">
  <mxGeometry x="260" y="240" width="60" height="30" as="geometry"/>
</mxCell>
<!-- 导线（电源上端 → R₁ 左端） -->
<mxCell id="5" value="" style="edgeStyle=orthogonalEdgeStyle;html=1;strokeWidth=1.5;endArrow=none;" edge="1" parent="1" source="2" target="3">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
<!-- 导线（电源下端 → R₂ 左端） -->
<mxCell id="6" value="" style="edgeStyle=orthogonalEdgeStyle;html=1;strokeWidth=1.5;endArrow=none;" edge="1" parent="1" source="2" target="4">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

## 光路图

```xml
<!-- 介质分界面（水平线） -->
<mxCell id="2" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="60" y="240" as="sourcePoint"/><mxPoint x="440" y="240" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 法线（虚线，垂直于界面） -->
<mxCell id="3" value="法线" style="endArrow=none;dashed=1;html=1;strokeWidth=1;strokeColor=#666666;fontSize=12;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="240" y="80" as="sourcePoint"/><mxPoint x="240" y="400" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 入射光线（左上 → 界面交点） -->
<mxCell id="4" value="入射光" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;fontSize=12;labelPosition=left;align=right;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="80" y="100" as="sourcePoint"/><mxPoint x="240" y="240" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 折射光线（界面交点 → 右下，折向法线） -->
<mxCell id="5" value="折射光" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;fontSize=12;labelPosition=right;align=left;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="240" y="240" as="sourcePoint"/><mxPoint x="360" y="400" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 反射光线（界面交点 → 右上） -->
<mxCell id="6" value="反射光" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;fontSize=12;labelPosition=right;align=left;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="240" y="240" as="sourcePoint"/><mxPoint x="400" y="100" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 入射角标注（弧线用文字代替） -->
<mxCell id="7" value="θ₁" style="text;html=1;fontSize=14;fontStyle=2;" vertex="1" parent="1">
  <mxGeometry x="218" y="180" width="30" height="24" as="geometry"/>
</mxCell>
<!-- 折射角标注 -->
<mxCell id="8" value="θ₂" style="text;html=1;fontSize=14;fontStyle=2;" vertex="1" parent="1">
  <mxGeometry x="250" y="268" width="30" height="24" as="geometry"/>
</mxCell>
```

## 运动轨迹图

```xml
<!-- 抛体运动轨迹（用曲线近似，多段折线） -->
<mxCell id="2" value="" style="curved=1;endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="80" y="200" as="sourcePoint"/>
    <mxPoint x="400" y="360" as="targetPoint"/>
    <Array as="points"><mxPoint x="160" y="120"/><mxPoint x="240" y="100"/><mxPoint x="320" y="160"/></Array>
  </mxGeometry>
</mxCell>
<!-- 初速度箭头 v₀ -->
<mxCell id="3" value="v₀" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;fontStyle=1;fontSize=13;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="80" y="200" as="sourcePoint"/><mxPoint x="160" y="160" as="targetPoint"/></mxGeometry>
</mxCell>
```