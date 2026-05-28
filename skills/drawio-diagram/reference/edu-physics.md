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

### 串联电路（电源–开关–电阻–灯泡）

矩形回路，元件依次串在回路各边，导线用带折角的 `endArrow=none` 边（明确指定 waypoints）。

```xml
<!-- 电源（左侧，中心 x=100） -->
<mxCell id="2" value="电源" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.5;fontSize=13;" vertex="1" parent="1">
  <mxGeometry x="75" y="175" width="50" height="60" as="geometry"/>
</mxCell>
<!-- "+" 标注 -->
<mxCell id="3" value="+" style="text;html=1;align=center;fontSize=14;fontStyle=1;fontColor=#D04A22;" vertex="1" parent="1">
  <mxGeometry x="84" y="157" width="14" height="18" as="geometry"/>
</mxCell>
<!-- "−" 标注 -->
<mxCell id="4" value="−" style="text;html=1;align=center;fontSize=16;fontColor=#2060C0;" vertex="1" parent="1">
  <mxGeometry x="84" y="235" width="14" height="18" as="geometry"/>
</mxCell>
<!-- 开关 K（上导线左段） -->
<mxCell id="5" value="开关 K" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.5;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="190" y="60" width="70" height="30" as="geometry"/>
</mxCell>
<!-- 电阻 R（上导线右段） -->
<mxCell id="6" value="电阻 R" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFBE6;strokeColor=#CFC286;strokeWidth=1.5;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="315" y="60" width="70" height="30" as="geometry"/>
</mxCell>
<!-- 灯泡 L（右侧） -->
<mxCell id="7" value="灯泡 L" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.5;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="440" y="175" width="50" height="60" as="geometry"/>
</mxCell>
<!-- 导线1: 电源+ → 折角 → 开关K左 -->
<mxCell id="8" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="100" y="175" as="sourcePoint"/>
    <mxPoint x="190" y="75" as="targetPoint"/>
    <Array as="points"><mxPoint x="100" y="75"/></Array>
  </mxGeometry>
</mxCell>
<!-- 导线2: 开关K右 → 电阻R左 -->
<mxCell id="9" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="260" y="75" as="sourcePoint"/>
    <mxPoint x="315" y="75" as="targetPoint"/>
  </mxGeometry>
</mxCell>
<!-- 导线3: 电阻R右 → 折角 → 灯泡L顶 -->
<mxCell id="10" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="385" y="75" as="sourcePoint"/>
    <mxPoint x="465" y="175" as="targetPoint"/>
    <Array as="points"><mxPoint x="465" y="75"/></Array>
  </mxGeometry>
</mxCell>
<!-- 导线4: 灯泡L底 → 两个折角 → 电源− -->
<mxCell id="11" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="465" y="235" as="sourcePoint"/>
    <mxPoint x="100" y="235" as="targetPoint"/>
    <Array as="points"><mxPoint x="465" y="360"/><mxPoint x="100" y="360"/></Array>
  </mxGeometry>
</mxCell>
```

**串联特性**：同一条导线，电流处处相等（$I = I_1 = I_2$）；总电阻 $R = R_1 + R_2 + \cdots$。

### 并联电路（两支路：电阻 R₁‖灯泡 L）

左右两条纵向导线（分别在 x=660 / x=990），上下两条横向支路（分别在 y=90 / y=290）。结点用 8px 实心圆标出。

```xml
<!-- 电源（左侧，中心 x=660） -->
<mxCell id="2" value="电源" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.5;fontSize=13;" vertex="1" parent="1">
  <mxGeometry x="635" y="175" width="50" height="60" as="geometry"/>
</mxCell>
<!-- 电阻 R₁（上支路，y 中心=90） -->
<mxCell id="3" value="电阻 R₁" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFFBE6;strokeColor=#CFC286;strokeWidth=1.5;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="760" y="75" width="80" height="30" as="geometry"/>
</mxCell>
<!-- 灯泡 L（下支路，y 中心=290） -->
<mxCell id="4" value="灯泡 L" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.5;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="760" y="275" width="80" height="30" as="geometry"/>
</mxCell>
<!-- 导线 A: 电源+ → 左上结点 -->
<mxCell id="5" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="660" y="175" as="sourcePoint"/><mxPoint x="660" y="90" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 导线 B: 左上结点 → R₁左 -->
<mxCell id="6" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="660" y="90" as="sourcePoint"/><mxPoint x="760" y="90" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 导线 C: R₁右 → 右上结点 -->
<mxCell id="7" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="840" y="90" as="sourcePoint"/><mxPoint x="990" y="90" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 导线 D: 右侧纵线（上结点 → 下结点） -->
<mxCell id="8" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="990" y="90" as="sourcePoint"/><mxPoint x="990" y="290" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 导线 E: 右下结点 → L右 -->
<mxCell id="9" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="990" y="290" as="sourcePoint"/><mxPoint x="840" y="290" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 导线 F: L左 → 左下结点 -->
<mxCell id="10" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="760" y="290" as="sourcePoint"/><mxPoint x="660" y="290" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 导线 G: 左下结点 → 电源− -->
<mxCell id="11" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="660" y="290" as="sourcePoint"/><mxPoint x="660" y="235" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 结点（Junction dots，4 个 T 形交叉处） -->
<mxCell id="12" value="" style="ellipse;aspect=fixed;fillColor=#000000;strokeColor=#000000;html=1;" vertex="1" parent="1">
  <mxGeometry x="656" y="86" width="8" height="8" as="geometry"/>
</mxCell>
<mxCell id="13" value="" style="ellipse;aspect=fixed;fillColor=#000000;strokeColor=#000000;html=1;" vertex="1" parent="1">
  <mxGeometry x="656" y="286" width="8" height="8" as="geometry"/>
</mxCell>
<mxCell id="14" value="" style="ellipse;aspect=fixed;fillColor=#000000;strokeColor=#000000;html=1;" vertex="1" parent="1">
  <mxGeometry x="986" y="86" width="8" height="8" as="geometry"/>
</mxCell>
<mxCell id="15" value="" style="ellipse;aspect=fixed;fillColor=#000000;strokeColor=#000000;html=1;" vertex="1" parent="1">
  <mxGeometry x="986" y="286" width="8" height="8" as="geometry"/>
</mxCell>
```

**并联特性**：各支路电压相等（$U = U_1 = U_2$）；总电流 $I = I_1 + I_2$；总电阻 $\frac{1}{R} = \frac{1}{R_1} + \frac{1}{R_2}$。

### 电流表与电压表位置

- **电流表 A**：串联在被测支路中，替换任意一段导线（在该段两端插入电流表矩形，替换原来那段导线）
- **电压表 V**：并联在被测元件两端，从元件两侧各引一根导线接到 V 的两端

```xml
<!-- 电流表 A（示例：串在上支路） -->
<mxCell id="20" value="A" style="ellipse;aspect=fixed;whiteSpace=wrap;html=1;fillColor=#FFFFFF;strokeColor=#000000;strokeWidth=1.5;fontSize=14;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="690" y="77" width="36" height="36" as="geometry"/>
</mxCell>
<!-- 电压表 V（示例：并在 R₁ 两端） -->
<mxCell id="21" value="V" style="ellipse;aspect=fixed;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;strokeWidth=1.5;fontSize=14;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="794" y="140" width="36" height="36" as="geometry"/>
</mxCell>
<!-- V 并联导线（从 R₁ 左端引到 V，从 V 引到 R₁ 右端） -->
<mxCell id="22" value="" style="edgeStyle=orthogonalEdgeStyle;endArrow=none;html=1;strokeWidth=1;dashed=1;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="760" y="90" as="sourcePoint"/><mxPoint x="812" y="140" as="targetPoint"/></mxGeometry>
</mxCell>
<mxCell id="23" value="" style="edgeStyle=orthogonalEdgeStyle;endArrow=none;html=1;strokeWidth=1;dashed=1;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="840" y="90" as="sourcePoint"/><mxPoint x="812" y="176" as="targetPoint"/></mxGeometry>
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