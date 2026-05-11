# 地理示意图

考试题目中的地理示意图：经纬网/地球仪、地球圈层结构、地形剖面、气候分布、洋流示意、板块构造等。

## 通用规范

- 背景白色 `background="#FFFFFF"`，地理配色偏蓝/棕/绿
- 圆形表示地球，箭头表示风向/洋流方向
- 剖面图用梯形/不规则多边形，标注高程

## 配色参考

| 要素 | 颜色 | 说明 |
|------|------|------|
| 海洋/水体 | `#DAE8FC` | 蓝色系 |
| 陆地/平原 | `#D5E8D4` | 绿色系 |
| 山地/高原 | `#FFF2CC` | 黄色系 |
| 极地/冰川 | `#FFFFFF`（白）+ 蓝边 | — |
| 地核 | `#F8CECC` | 红/橙系 |
| 地幔 | `#FFE6CC` | 橙系 |

## 经纬网示意图

```xml
<!-- 地球轮廓（圆） -->
<mxCell id="2" value="" style="ellipse;aspect=fixed;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;strokeWidth=2;" vertex="1" parent="1">
  <mxGeometry x="100" y="80" width="280" height="280" as="geometry"/>
</mxCell>
<!-- 赤道（水平线） -->
<mxCell id="3" value="赤道" style="endArrow=none;html=1;strokeWidth=1.5;strokeColor=#B85450;dashed=0;fontSize=11;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="100" y="220" as="sourcePoint"/><mxPoint x="380" y="220" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 北回归线（虚线） -->
<mxCell id="4" value="北回归线(23.5°N)" style="endArrow=none;html=1;strokeWidth=1;strokeColor=#D79B00;dashed=1;fontSize=10;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="130" y="160" as="sourcePoint"/><mxPoint x="350" y="160" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 南回归线（虚线） -->
<mxCell id="5" value="南回归线(23.5°S)" style="endArrow=none;html=1;strokeWidth=1;strokeColor=#D79B00;dashed=1;fontSize=10;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="130" y="280" as="sourcePoint"/><mxPoint x="350" y="280" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 本初子午线（竖线） -->
<mxCell id="6" value="本初子午线(0°)" style="endArrow=none;html=1;strokeWidth=1.5;strokeColor=#82B366;fontSize=10;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="240" y="80" as="sourcePoint"/><mxPoint x="240" y="360" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 极点标注 -->
<mxCell id="7" value="N" style="text;html=1;fontSize=14;fontStyle=1;align=center;" vertex="1" parent="1">
  <mxGeometry x="228" y="54" width="24" height="24" as="geometry"/>
</mxCell>
<mxCell id="8" value="S" style="text;html=1;fontSize=14;fontStyle=1;align=center;" vertex="1" parent="1">
  <mxGeometry x="228" y="360" width="24" height="24" as="geometry"/>
</mxCell>
```

## 地球圈层结构（剖面）

```xml
<!-- 地壳（最外层薄环） -->
<mxCell id="2" value="地壳" style="ellipse;aspect=fixed;whiteSpace=wrap;html=1;fillColor=#D5E8D4;strokeColor=#82B366;strokeWidth=2;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="60" y="60" width="360" height="360" as="geometry"/>
</mxCell>
<!-- 地幔（中间层） -->
<mxCell id="3" value="地幔" style="ellipse;aspect=fixed;whiteSpace=wrap;html=1;fillColor=#FFE6CC;strokeColor=#D79B00;strokeWidth=2;fontSize=13;" vertex="1" parent="1">
  <mxGeometry x="110" y="110" width="260" height="260" as="geometry"/>
</mxCell>
<!-- 外核 -->
<mxCell id="4" value="外核" style="ellipse;aspect=fixed;whiteSpace=wrap;html=1;fillColor=#F8CECC;strokeColor=#B85450;strokeWidth=2;fontSize=13;" vertex="1" parent="1">
  <mxGeometry x="170" y="170" width="140" height="140" as="geometry"/>
</mxCell>
<!-- 内核（最中心） -->
<mxCell id="5" value="内核" style="ellipse;aspect=fixed;whiteSpace=wrap;html=1;fillColor=#FF8080;strokeColor=#AE4132;strokeWidth=2;fontSize=13;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="210" y="210" width="60" height="60" as="geometry"/>
</mxCell>
```

## 地形剖面图

```xml
<!-- 基线（海平面） -->
<mxCell id="2" value="海平面" style="endArrow=none;html=1;strokeWidth=1.5;fontSize=11;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="60" y="320" as="sourcePoint"/><mxPoint x="540" y="320" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 平原（低矩形） -->
<mxCell id="3" value="平原" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#D5E8D4;strokeColor=#82B366;strokeWidth=1.5;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="80" y="280" width="120" height="40" as="geometry"/>
</mxCell>
<!-- 丘陵（圆角矩形，稍高） -->
<mxCell id="4" value="丘陵" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;strokeWidth=1.5;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="220" y="240" width="100" height="80" as="geometry"/>
</mxCell>
<!-- 山地（高三角形） -->
<mxCell id="5" value="山地" style="shape=mxgraph.basic.isoceles;whiteSpace=wrap;html=1;fillColor=#FFE6CC;strokeColor=#D79B00;strokeWidth=1.5;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="340" y="160" width="140" height="160" as="geometry"/>
</mxCell>
<!-- 高程标注 -->
<mxCell id="6" value="▲ 2000m" style="text;html=1;fontSize=11;align=center;" vertex="1" parent="1">
  <mxGeometry x="350" y="134" width="100" height="20" as="geometry"/>
</mxCell>
```

## 大气环流/风带示意

```xml
<!-- 赤道低压带 -->
<mxCell id="2" value="赤道低压带" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="160" y="240" width="280" height="36" as="geometry"/>
</mxCell>
<!-- 信风带（箭头向赤道） -->
<mxCell id="3" value="东北信风" style="endArrow=block;endFill=1;html=1;strokeWidth=1.5;fontSize=12;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="440" y="200" as="sourcePoint"/><mxPoint x="300" y="240" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 副热带高压带 -->
<mxCell id="4" value="副热带高压带(30°N)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="160" y="140" width="280" height="36" as="geometry"/>
</mxCell>
<!-- 西风带（箭头向极地） -->
<mxCell id="5" value="盛行西风" style="endArrow=block;endFill=1;html=1;strokeWidth=1.5;fontSize=12;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="160" y="100" as="sourcePoint"/><mxPoint x="440" y="140" as="targetPoint"/></mxGeometry>
</mxCell>
```