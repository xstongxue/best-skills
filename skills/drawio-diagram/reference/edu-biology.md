# 生物示意图

考试题目中的生物示意图：细胞结构图、遗传图解、食物链/食物网、生态系统、有丝分裂等。

## 通用规范

- 背景白色 `background="#FFFFFF"`，生物配色偏绿/暖色系
- 细胞结构用嵌套椭圆/矩形表示，标注文字 11–13px
- 遗传图解用表格式布局，等位基因用上标表示（Draw.io 文字中用 `&#x00B9;` 等）

## 配色方案

| 结构 | 填充色 | 说明 |
|------|--------|------|
| 细胞膜 | `none`（透明） | 只显示边框 |
| 细胞质 | `#F0FFF0`（淡绿） | 背景色 |
| 细胞核 | `#FFF2CC` | 圆形/椭圆 |
| 线粒体 | `#FFE6CC` | 椭圆 |
| 叶绿体 | `#D5E8D4` | 椭圆 |
| 液泡 | `#DAE8FC` | 大椭圆 |

## 动物细胞结构图

```xml
<!-- 细胞膜（最外层椭圆） -->
<mxCell id="2" value="" style="ellipse;whiteSpace=wrap;html=1;fillColor=#F0FFF0;strokeColor=#82B366;strokeWidth=2;" vertex="1" parent="1">
  <mxGeometry x="60" y="60" width="400" height="300" as="geometry"/>
</mxCell>
<!-- 细胞核 -->
<mxCell id="3" value="细胞核" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;strokeWidth=1.5;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="170" y="130" width="120" height="90" as="geometry"/>
</mxCell>
<!-- 线粒体 -->
<mxCell id="4" value="线粒体" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFE6CC;strokeColor=#D79B00;strokeWidth=1.5;fontSize=11;" vertex="1" parent="1">
  <mxGeometry x="300" y="160" width="90" height="60" as="geometry"/>
</mxCell>
<!-- 内质网（折线示意） -->
<mxCell id="5" value="内质网" style="text;html=1;fontSize=11;align=center;" vertex="1" parent="1">
  <mxGeometry x="80" y="200" width="70" height="20" as="geometry"/>
</mxCell>
<!-- 细胞膜标注 -->
<mxCell id="6" value="细胞膜" style="text;html=1;fontSize=12;align=left;" vertex="1" parent="1">
  <mxGeometry x="10" y="90" width="60" height="20" as="geometry"/>
</mxCell>
<!-- 引线：细胞膜标注 → 边界 -->
<mxCell id="7" value="" style="endArrow=none;html=1;strokeWidth=1;dashed=1;strokeColor=#666666;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="70" y="100" as="sourcePoint"/><mxPoint x="120" y="100" as="targetPoint"/></mxGeometry>
</mxCell>
```

## 植物细胞结构图

```xml
<!-- 细胞壁（最外层矩形） -->
<mxCell id="2" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=none;strokeColor=#555555;strokeWidth=3;" vertex="1" parent="1">
  <mxGeometry x="60" y="60" width="400" height="320" as="geometry"/>
</mxCell>
<!-- 细胞膜（紧贴细胞壁内侧） -->
<mxCell id="3" value="" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#F0FFF0;strokeColor=#82B366;strokeWidth=1.5;" vertex="1" parent="1">
  <mxGeometry x="70" y="70" width="380" height="300" as="geometry"/>
</mxCell>
<!-- 大液泡（占中间大部分） -->
<mxCell id="4" value="液泡" style="ellipse;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;strokeWidth=1.5;fontSize=13;" vertex="1" parent="1">
  <mxGeometry x="150" y="130" width="200" height="160" as="geometry"/>
</mxCell>
<!-- 叶绿体 -->
<mxCell id="5" value="叶绿体" style="ellipse;whiteSpace=wrap;html=1;fillColor=#D5E8D4;strokeColor=#82B366;strokeWidth=1.5;fontSize=11;" vertex="1" parent="1">
  <mxGeometry x="80" y="160" width="80" height="50" as="geometry"/>
</mxCell>
<!-- 细胞核（在液泡旁） -->
<mxCell id="6" value="细胞核" style="ellipse;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;strokeWidth=1.5;fontSize=11;" vertex="1" parent="1">
  <mxGeometry x="360" y="170" width="70" height="60" as="geometry"/>
</mxCell>
<!-- 标注：细胞壁 -->
<mxCell id="7" value="细胞壁" style="text;html=1;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="464" y="60" width="60" height="20" as="geometry"/>
</mxCell>
```

## 遗传图解（孟德尔豌豆杂交）

用表格式布局，亲本 → 配子 → 子代。

```xml
<!-- 亲本标题行 -->
<mxCell id="2" value="亲本 (P)" style="text;html=1;fontSize=13;fontStyle=1;align=right;" vertex="1" parent="1">
  <mxGeometry x="20" y="40" width="80" height="30" as="geometry"/>
</mxCell>
<!-- 亲本基因型 AA -->
<mxCell id="3" value="AA（高茎）" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=13;" vertex="1" parent="1">
  <mxGeometry x="120" y="40" width="120" height="36" as="geometry"/>
</mxCell>
<!-- × 符号 -->
<mxCell id="4" value="×" style="text;html=1;fontSize=18;fontStyle=1;align=center;" vertex="1" parent="1">
  <mxGeometry x="252" y="40" width="36" height="36" as="geometry"/>
</mxCell>
<!-- 亲本基因型 aa -->
<mxCell id="5" value="aa（矮茎）" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F8CECC;strokeColor=#B85450;fontSize=13;" vertex="1" parent="1">
  <mxGeometry x="300" y="40" width="120" height="36" as="geometry"/>
</mxCell>
<!-- 减数分裂箭头 -->
<mxCell id="6" value="减数分裂" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;fontSize=11;verticalAlign=bottom;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="180" y="76" as="sourcePoint"/><mxPoint x="180" y="130" as="targetPoint"/></mxGeometry>
</mxCell>
<mxCell id="7" value="减数分裂" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;fontSize=11;verticalAlign=bottom;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="360" y="76" as="sourcePoint"/><mxPoint x="360" y="130" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 配子 -->
<mxCell id="8" value="配子" style="text;html=1;fontSize=13;fontStyle=1;align=right;" vertex="1" parent="1">
  <mxGeometry x="20" y="130" width="80" height="30" as="geometry"/>
</mxCell>
<mxCell id="9" value="A" style="ellipse;aspect=fixed;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=14;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="152" y="130" width="56" height="56" as="geometry"/>
</mxCell>
<mxCell id="10" value="a" style="ellipse;aspect=fixed;whiteSpace=wrap;html=1;fillColor=#F8CECC;strokeColor=#B85450;fontSize=14;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="332" y="130" width="56" height="56" as="geometry"/>
</mxCell>
<!-- 受精箭头 -->
<mxCell id="11" value="受精" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;fontSize=11;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry"><mxPoint x="270" y="158" as="sourcePoint"/><mxPoint x="270" y="220" as="targetPoint"/></mxGeometry>
</mxCell>
<!-- 子代 F1 -->
<mxCell id="12" value="子代 (F₁)" style="text;html=1;fontSize=13;fontStyle=1;align=right;" vertex="1" parent="1">
  <mxGeometry x="20" y="220" width="80" height="30" as="geometry"/>
</mxCell>
<mxCell id="13" value="Aa（高茎）" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#D5E8D4;strokeColor=#82B366;fontSize=13;" vertex="1" parent="1">
  <mxGeometry x="180" y="220" width="180" height="36" as="geometry"/>
</mxCell>
```

## 食物链/食物网

```xml
<!-- 生产者 -->
<mxCell id="2" value="草（生产者）" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#D5E8D4;strokeColor=#82B366;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="60" y="200" width="120" height="40" as="geometry"/>
</mxCell>
<!-- 初级消费者 -->
<mxCell id="3" value="兔（初级消费者）" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="260" y="140" width="140" height="40" as="geometry"/>
</mxCell>
<!-- 次级消费者 -->
<mxCell id="4" value="狐（次级消费者）" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFE6CC;strokeColor=#D79B00;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="480" y="200" width="140" height="40" as="geometry"/>
</mxCell>
<!-- 箭头：能量流动方向 -->
<mxCell id="5" value="" style="endArrow=block;endFill=1;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="3">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
<mxCell id="6" value="" style="endArrow=block;endFill=1;html=1;strokeWidth=1.5;" edge="1" parent="1" source="3" target="4">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
<!-- 说明文字 -->
<mxCell id="7" value="（箭头方向代表能量流动）" style="text;html=1;fontSize=11;fontStyle=2;align=center;" vertex="1" parent="1">
  <mxGeometry x="160" y="300" width="360" height="20" as="geometry"/>
</mxCell>
```