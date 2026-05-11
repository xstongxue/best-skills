# 历史示意图

考试题目中的历史示意图：时间轴、朝代更迭图、历史事件关系图、政治制度示意等。

## 通用规范

- 背景白色 `background="#FFFFFF"`
- 时间轴用横向主线 + 竖向刻度，事件框悬挂在刻度线上
- 朝代/人物节点用矩形，关系用有向箭头

## 配色方案

| 用途 | 填充色 | 边框色 |
|------|--------|--------|
| 时间节点 | `#FFF2CC` | `#D6B656` |
| 重大事件 | `#F8CECC` | `#B85450` |
| 朝代/国家 | `#DAE8FC` | `#6C8EBF` |
| 人物 | `#D5E8D4` | `#82B366` |
| 制度/政策 | `#E1D5E7` | `#9673A6` |

## 时间轴

```xml
<!-- 时间轴主线（横向，带箭头） -->
<mxCell id="2" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=2;strokeColor=#000000;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="60" y="200" as="sourcePoint"/><mxPoint x="560" y="200" as="targetPoint"/></mxGeometry>
</mxCell>

<!-- 时间节点 1：刻度线 -->
<mxCell id="3" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="120" y="185" as="sourcePoint"/><mxPoint x="120" y="215" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 时间节点 1：年份标注 -->
<mxCell id="4" value="221 BC" style="text;html=1;fontSize=11;align=center;" vertex="1" parent="1">
  <mxGeometry x="90" y="218" width="60" height="18" as="geometry"/>
</mxCell>
<!-- 时间节点 1：事件框（上方） -->
<mxCell id="5" value="秦统一六国" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="74" y="130" width="92" height="40" as="geometry"/>
</mxCell>
<!-- 连线：刻度 → 事件框 -->
<mxCell id="6" value="" style="endArrow=none;html=1;strokeWidth=1;dashed=1;strokeColor=#666666;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="120" y="185" as="sourcePoint"/><mxPoint x="120" y="170" as="targetPoint"/></mxGeometry>
</mxCell>

<!-- 时间节点 2 -->
<mxCell id="7" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="280" y="185" as="sourcePoint"/><mxPoint x="280" y="215" as="targetPoint"/></mxGeometry>
</mxCell>
<mxCell id="8" value="206 BC" style="text;html=1;fontSize=11;align=center;" vertex="1" parent="1">
  <mxGeometry x="250" y="218" width="60" height="18" as="geometry"/>
</mxCell>
<mxCell id="9" value="汉朝建立" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F8CECC;strokeColor=#B85450;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="234" y="240" width="92" height="40" as="geometry"/>
</mxCell>
<mxCell id="10" value="" style="endArrow=none;html=1;strokeWidth=1;dashed=1;strokeColor=#666666;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="280" y="215" as="sourcePoint"/><mxPoint x="280" y="240" as="targetPoint"/></mxGeometry>
</mxCell>
```

## 朝代更迭图（纵向）

```xml
<!-- 朝代 1 -->
<mxCell id="2" value="夏（约2070—1600BC）" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="160" y="60" width="240" height="44" as="geometry"/>
</mxCell>
<!-- 朝代 2 -->
<mxCell id="3" value="商（约1600—1046BC）" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="160" y="140" width="240" height="44" as="geometry"/>
</mxCell>
<!-- 朝代 3 -->
<mxCell id="4" value="西周（1046—771BC）" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="160" y="220" width="240" height="44" as="geometry"/>
</mxCell>
<!-- 更迭箭头 -->
<mxCell id="5" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="3">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
<mxCell id="6" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="3" target="4">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

## 政治制度示意图（分封制/郡县制）

```xml
<!-- 顶层：天子/皇帝 -->
<mxCell id="2" value="天子" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;fontSize=14;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="240" y="40" width="120" height="50" as="geometry"/>
</mxCell>
<!-- 第二层：诸侯 -->
<mxCell id="3" value="诸侯国 A" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="80" y="160" width="120" height="44" as="geometry"/>
</mxCell>
<mxCell id="4" value="诸侯国 B" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="240" y="160" width="120" height="44" as="geometry"/>
</mxCell>
<mxCell id="5" value="诸侯国 C" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="400" y="160" width="120" height="44" as="geometry"/>
</mxCell>
<!-- 第三层：卿大夫 -->
<mxCell id="6" value="卿大夫" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#D5E8D4;strokeColor=#82B366;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="80" y="280" width="100" height="40" as="geometry"/>
</mxCell>
<mxCell id="7" value="卿大夫" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#D5E8D4;strokeColor=#82B366;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="250" y="280" width="100" height="40" as="geometry"/>
</mxCell>
<!-- 连线 -->
<mxCell id="8" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell>
<mxCell id="9" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="4"><mxGeometry relative="1" as="geometry"/></mxCell>
<mxCell id="10" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="5"><mxGeometry relative="1" as="geometry"/></mxCell>
<mxCell id="11" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="3" target="6"><mxGeometry relative="1" as="geometry"/></mxCell>
<mxCell id="12" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="4" target="7"><mxGeometry relative="1" as="geometry"/></mxCell>
```

## 历史事件因果关系图

```xml
<!-- 原因节点 -->
<mxCell id="2" value="土地兼并严重" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F8CECC;strokeColor=#B85450;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="60" y="100" width="140" height="44" as="geometry"/>
</mxCell>
<mxCell id="3" value="赋税沉重" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F8CECC;strokeColor=#B85450;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="60" y="200" width="140" height="44" as="geometry"/>
</mxCell>
<!-- 结果节点 -->
<mxCell id="4" value="农民起义爆发" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;fontSize=13;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="300" y="150" width="160" height="50" as="geometry"/>
</mxCell>
<!-- 影响节点 -->
<mxCell id="5" value="王朝更迭" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="560" y="150" width="120" height="44" as="geometry"/>
</mxCell>
<!-- 连线 -->
<mxCell id="6" value="" style="endArrow=block;endFill=1;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="4"><mxGeometry relative="1" as="geometry"/></mxCell>
<mxCell id="7" value="" style="endArrow=block;endFill=1;html=1;strokeWidth=1.5;" edge="1" parent="1" source="3" target="4"><mxGeometry relative="1" as="geometry"/></mxCell>
<mxCell id="8" value="" style="endArrow=block;endFill=1;html=1;strokeWidth=1.5;" edge="1" parent="1" source="4" target="5"><mxGeometry relative="1" as="geometry"/></mxCell>
```