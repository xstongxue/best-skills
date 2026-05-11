# 语文示意图

考试题目中的语文示意图：文章结构图、古诗词脉络图、句子成分分析、思维导图式分析。

## 通用规范

- 背景白色 `background="#FFFFFF"`
- 节点圆角矩形，线条颜色与节点边框一致
- 连线无箭头（`endArrow=none`）或单向箭头，线宽 1.5
- 字号：主题节点 14–16px，分支节点 12–13px

## 配色方案

| 层级 | 填充色 | 边框色 |
|------|--------|--------|
| 中心主题 | `#FFF2CC` | `#D6B656` |
| 一级分支 | `#DAE8FC` | `#6C8EBF` |
| 二级分支 | `#D5E8D4` | `#82B366` |
| 三级/补充 | `#F8CECC` | `#B85450` |

## 文章结构图（线性层次）

适用于记叙文、说明文的段落结构梳理。

```xml
<!-- 标题/总结节点 -->
<mxCell id="2" value="全文主旨" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;fontSize=14;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="260" y="40" width="160" height="50" as="geometry"/>
</mxCell>
<!-- 第一部分 -->
<mxCell id="3" value="第一部分（1-3段）&#xa;交代背景" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="80" y="160" width="180" height="50" as="geometry"/>
</mxCell>
<!-- 第二部分 -->
<mxCell id="4" value="第二部分（4-8段）&#xa;发展高潮" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="300" y="160" width="180" height="50" as="geometry"/>
</mxCell>
<!-- 第三部分 -->
<mxCell id="5" value="第三部分（9段）&#xa;结尾升华" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="520" y="160" width="180" height="50" as="geometry"/>
</mxCell>
<!-- 连线：主旨 → 各部分 -->
<mxCell id="6" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="3">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
<mxCell id="7" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="4">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
<mxCell id="8" value="" style="endArrow=none;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="5">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

## 古诗词脉络图（情感/意象分析）

```xml
<!-- 诗题/作者 -->
<mxCell id="2" value="《静夜思》李白" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;fontSize=14;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="240" y="40" width="200" height="50" as="geometry"/>
</mxCell>
<!-- 意象 -->
<mxCell id="3" value="意象&#xa;明月·故乡" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="60" y="160" width="160" height="50" as="geometry"/>
</mxCell>
<!-- 情感 -->
<mxCell id="4" value="情感&#xa;思乡·孤寂" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#D5E8D4;strokeColor=#82B366;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="260" y="160" width="160" height="50" as="geometry"/>
</mxCell>
<!-- 手法 -->
<mxCell id="5" value="手法&#xa;借景抒情·对比" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F8CECC;strokeColor=#B85450;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="460" y="160" width="160" height="50" as="geometry"/>
</mxCell>
<!-- 连线 -->
<mxCell id="6" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="3">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
<mxCell id="7" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="4">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
<mxCell id="8" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="5">
  <mxGeometry relative="1" as="geometry"/>
</mxCell>
```

## 句子成分分析图

主谓宾定状补，用括号或下划线标注，Draw.io 用分层文字框表示。

```xml
<!-- 句子原文 -->
<mxCell id="2" value="他 / 认真地 / 完成了 / 一篇 / 精彩的 / 作文" style="text;html=1;align=center;fontSize=15;strokeColor=none;fillColor=none;" vertex="1" parent="1">
  <mxGeometry x="60" y="60" width="560" height="40" as="geometry"/>
</mxCell>
<!-- 成分标注行 -->
<mxCell id="3" value="主语" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="80" y="120" width="60" height="30" as="geometry"/>
</mxCell>
<mxCell id="4" value="状语" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="180" y="120" width="60" height="30" as="geometry"/>
</mxCell>
<mxCell id="5" value="谓语" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#D5E8D4;strokeColor=#82B366;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="280" y="120" width="60" height="30" as="geometry"/>
</mxCell>
<mxCell id="6" value="定语" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#F8CECC;strokeColor=#B85450;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="380" y="120" width="60" height="30" as="geometry"/>
</mxCell>
<mxCell id="7" value="宾语" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#E1D5E7;strokeColor=#9673A6;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="480" y="120" width="60" height="30" as="geometry"/>
</mxCell>
```

## 总分总结构图（议论文）

```xml
<!-- 引论 -->
<mxCell id="2" value="引论（提出问题）" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;fontSize=13;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="220" y="40" width="240" height="50" as="geometry"/>
</mxCell>
<!-- 论点1 -->
<mxCell id="3" value="分论点一" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="60" y="160" width="140" height="45" as="geometry"/>
</mxCell>
<!-- 论点2 -->
<mxCell id="4" value="分论点二" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="270" y="160" width="140" height="45" as="geometry"/>
</mxCell>
<!-- 论点3 -->
<mxCell id="5" value="分论点三" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;fontSize=12;" vertex="1" parent="1">
  <mxGeometry x="480" y="160" width="140" height="45" as="geometry"/>
</mxCell>
<!-- 结论 -->
<mxCell id="6" value="结论（解决问题）" style="rounded=0;whiteSpace=wrap;html=1;fillColor=#D5E8D4;strokeColor=#82B366;fontSize=13;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="220" y="280" width="240" height="50" as="geometry"/>
</mxCell>
<!-- 连线 -->
<mxCell id="7" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="3"><mxGeometry relative="1" as="geometry"/></mxCell>
<mxCell id="8" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="4"><mxGeometry relative="1" as="geometry"/></mxCell>
<mxCell id="9" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="2" target="5"><mxGeometry relative="1" as="geometry"/></mxCell>
<mxCell id="10" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="3" target="6"><mxGeometry relative="1" as="geometry"/></mxCell>
<mxCell id="11" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="4" target="6"><mxGeometry relative="1" as="geometry"/></mxCell>
<mxCell id="12" value="" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;" edge="1" parent="1" source="5" target="6"><mxGeometry relative="1" as="geometry"/></mxCell>
```