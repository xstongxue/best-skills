# 化学示意图

考试题目中的化学示意图：实验装置图、原子/分子结构、化学反应方程式注解、元素周期表局部等。

## 通用规范

- 背景白色 `background="#FFFFFF"`，线条黑色 `#000000`，线宽 1.5
- 仪器轮廓用简化几何形状，标注文字用小字（12px）
- 化学键（单键/双键）用直线/双线表示，键长均匀

## 实验装置图

元件用简化形状拼接，导管用折线连接。

### 常用仪器形状

```xml
<!-- 烧瓶（圆形瓶身 + 细颈） -->
<mxCell id="2" value="" style="ellipse;whiteSpace=wrap;html=1;aspect=fixed;fillColor=none;strokeColor=#000000;strokeWidth=1.5;" vertex="1" parent="1">
  <mxGeometry x="160" y="180" width="160" height="160" as="geometry"/>
</mxCell>
<!-- 细颈（矩形细长） -->
<mxCell id="3" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000000;strokeWidth=1.5;" vertex="1" parent="1">
  <mxGeometry x="218" y="100" width="44" height="80" as="geometry"/>
</mxCell>

<!-- 试管（圆角矩形，底部圆弧） -->
<mxCell id="4" value="" style="rounded=1;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000000;strokeWidth=1.5;arcSize=40;" vertex="1" parent="1">
  <mxGeometry x="340" y="120" width="50" height="120" as="geometry"/>
</mxCell>

<!-- 酒精灯（梯形灯座 + 灯芯） -->
<mxCell id="5" value="酒精灯" style="shape=mxgraph.basic.trapezoid;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#000000;strokeWidth=1.5;fontSize=11;" vertex="1" parent="1">
  <mxGeometry x="80" y="340" width="100" height="60" as="geometry"/>
</mxCell>

<!-- 导管（折线，用 orthogonalEdgeStyle） -->
<mxCell id="6" value="" style="edgeStyle=orthogonalEdgeStyle;html=1;strokeWidth=1.5;endArrow=none;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="240" y="100" as="sourcePoint"/><mxPoint x="340" y="140" as="targetPoint"/></mxGeometry>
</mxCell>
```

### 完整装置示例（制取气体）

```xml
<!-- 圆底烧瓶 -->
<mxCell id="2" value="" style="ellipse;aspect=fixed;fillColor=none;strokeColor=#000000;strokeWidth=1.5;html=1;" vertex="1" parent="1">
  <mxGeometry x="80" y="200" width="140" height="140" as="geometry"/>
</mxCell>
<!-- 烧瓶颈 -->
<mxCell id="3" value="" style="rounded=0;fillColor=none;strokeColor=#000000;strokeWidth=1.5;html=1;" vertex="1" parent="1">
  <mxGeometry x="132" y="120" width="36" height="80" as="geometry"/>
</mxCell>
<!-- 瓶塞 -->
<mxCell id="4" value="" style="shape=mxgraph.basic.trapezoid;flipV=1;fillColor=#CCCCCC;strokeColor=#000000;strokeWidth=1.5;html=1;" vertex="1" parent="1">
  <mxGeometry x="126" y="100" width="48" height="24" as="geometry"/>
</mxCell>
<!-- 收集装置（试管） -->
<mxCell id="5" value="" style="rounded=1;arcSize=40;fillColor=none;strokeColor=#000000;strokeWidth=1.5;html=1;" vertex="1" parent="1">
  <mxGeometry x="340" y="140" width="50" height="120" as="geometry"/>
</mxCell>
<!-- 导管 -->
<mxCell id="6" value="" style="edgeStyle=orthogonalEdgeStyle;html=1;strokeWidth=1.5;endArrow=none;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="168" y="112" as="sourcePoint"/><mxPoint x="340" y="160" as="targetPoint"/><Array as="points"><mxPoint x="260" y="112"/><mxPoint x="260" y="160"/></Array></mxGeometry>
</mxCell>
<!-- 标注：烧瓶 -->
<mxCell id="7" value="圆底烧瓶" style="text;html=1;fontSize=11;align=center;" vertex="1" parent="1">
  <mxGeometry x="80" y="348" width="80" height="20" as="geometry"/>
</mxCell>
<!-- 标注：收集装置 -->
<mxCell id="8" value="收集装置" style="text;html=1;fontSize=11;align=center;" vertex="1" parent="1">
  <mxGeometry x="318" y="268" width="80" height="20" as="geometry"/>
</mxCell>
```

## 原子结构示意图

```xml
<!-- 原子核（圆形，标注质子数） -->
<mxCell id="2" value="6p&#xa;6n" style="ellipse;aspect=fixed;whiteSpace=wrap;html=1;fillColor=#FFE6CC;strokeColor=#D79B00;strokeWidth=1.5;fontSize=12;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="210" y="190" width="60" height="60" as="geometry"/>
</mxCell>
<!-- 第一电子层（虚线圆） -->
<mxCell id="3" value="" style="ellipse;aspect=fixed;fillColor=none;strokeColor=#666666;strokeWidth=1;dashed=1;html=1;" vertex="1" parent="1">
  <mxGeometry x="160" y="140" width="160" height="160" as="geometry"/>
</mxCell>
<!-- 第二电子层 -->
<mxCell id="4" value="" style="ellipse;aspect=fixed;fillColor=none;strokeColor=#666666;strokeWidth=1;dashed=1;html=1;" vertex="1" parent="1">
  <mxGeometry x="100" y="80" width="280" height="280" as="geometry"/>
</mxCell>
<!-- 电子（小圆点）第一层 2 个 -->
<mxCell id="5" value="2" style="text;html=1;fontSize=12;align=center;" vertex="1" parent="1">
  <mxGeometry x="224" y="120" width="20" height="20" as="geometry"/>
</mxCell>
<!-- 电子（小圆点）第二层 4 个 -->
<mxCell id="6" value="4" style="text;html=1;fontSize=12;align=center;" vertex="1" parent="1">
  <mxGeometry x="224" y="58" width="20" height="20" as="geometry"/>
</mxCell>
<!-- 元素符号标注 -->
<mxCell id="7" value="碳 (C)" style="text;html=1;fontSize=14;fontStyle=1;align=center;" vertex="1" parent="1">
  <mxGeometry x="190" y="380" width="100" height="24" as="geometry"/>
</mxCell>
```

## 分子结构示意图（Lewis 式）

用矩形（原子）+ 线（化学键）表示。

```xml
<!-- 水分子 H₂O -->
<!-- O 原子（中心） -->
<mxCell id="2" value="O" style="ellipse;aspect=fixed;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=16;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="210" y="180" width="60" height="60" as="geometry"/>
</mxCell>
<!-- H 原子（左） -->
<mxCell id="3" value="H" style="ellipse;aspect=fixed;whiteSpace=wrap;html=1;fillColor=#D5E8D4;strokeColor=#82B366;fontSize=15;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="100" y="220" width="50" height="50" as="geometry"/>
</mxCell>
<!-- H 原子（右） -->
<mxCell id="4" value="H" style="ellipse;aspect=fixed;whiteSpace=wrap;html=1;fillColor=#D5E8D4;strokeColor=#82B366;fontSize=15;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="330" y="220" width="50" height="50" as="geometry"/>
</mxCell>
<!-- 共价键 O-H（单键） -->
<mxCell id="5" value="" style="endArrow=none;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="2" target="3">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
<mxCell id="6" value="" style="endArrow=none;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1" source="2" target="4">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

## 化学反应方程式注解图

```xml
<!-- 反应物 A -->
<mxCell id="2" value="2H₂" style="text;html=1;fontSize=18;fontStyle=1;align=center;" vertex="1" parent="1">
  <mxGeometry x="60" y="160" width="80" height="40" as="geometry"/>
</mxCell>
<!-- 加号 -->
<mxCell id="3" value="+" style="text;html=1;fontSize=20;align=center;" vertex="1" parent="1">
  <mxGeometry x="148" y="160" width="30" height="40" as="geometry"/>
</mxCell>
<!-- 反应物 B -->
<mxCell id="4" value="O₂" style="text;html=1;fontSize=18;fontStyle=1;align=center;" vertex="1" parent="1">
  <mxGeometry x="186" y="160" width="60" height="40" as="geometry"/>
</mxCell>
<!-- 箭头（反应条件写在箭头上方） -->
<mxCell id="5" value="点燃" style="endArrow=block;endFill=1;html=1;strokeWidth=1.5;fontSize=12;verticalAlign=bottom;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="260" y="180" as="sourcePoint"/><mxPoint x="360" y="180" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 生成物 -->
<mxCell id="6" value="2H₂O" style="text;html=1;fontSize=18;fontStyle=1;align=center;" vertex="1" parent="1">
  <mxGeometry x="368" y="160" width="100" height="40" as="geometry"/>
</mxCell>
<!-- 注解：H₂ 标注 -->
<mxCell id="7" value="氢气（可燃）" style="text;html=1;fontSize=11;fontStyle=2;align=center;" vertex="1" parent="1">
  <mxGeometry x="42" y="210" width="100" height="20" as="geometry"/>
</mxCell>
<!-- 注解：O₂ 标注 -->
<mxCell id="8" value="氧气（助燃）" style="text;html=1;fontSize=11;fontStyle=2;align=center;" vertex="1" parent="1">
  <mxGeometry x="166" y="210" width="100" height="20" as="geometry"/>
</mxCell>
```