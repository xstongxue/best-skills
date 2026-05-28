# UML 时序图（Sequence Diagram）

技术文档与系统设计中的 UML 时序图：参与者、生命线、激活条、同步/异步消息、返回消息。

## 使用时机

- 用户需要绘制系统交互流程（登录、支付、消息推送等）
- 用户提到「时序图」「UML」「Sequence Diagram」「交互流程图」「消息流」等关键词
- 用户需要展示多个对象/服务之间的调用顺序和返回关系

## 通用规范

- 背景白色 `background="#FFFFFF"`，画布宽度根据参与者数量调整（每增加一个参与者 +170px）
- 生命线（Lifeline）：参与者头部底边向下延伸的垂直虚线，颜色 `#999999`，线宽 1
- 激活条（Activation Bar）：宽 14px，高度覆盖活跃调用期，颜色与参与者头部一致
- 消息类型：
  - 同步调用（→）：`endArrow=block;endFill=1`，实线黑色
  - 返回消息（--▶）：`endArrow=open;endFill=0;dashed=1`，虚线灰色 `#555555`
  - 异步消息（⇢）：`endArrow=open;endFill=0`，实线（半箭头）

## 坐标规则

- 参与者头部高度：40px，顶部留白 20px，所以头部底边 y=60
- 生命线从 y=60 延伸到画布底部（留 60px 给图题）
- 激活条：`x = lifeline_x − 7`，宽 14px
- 消息 sourceX：出发方激活条右边界 `lifeline_x + 7`
- 消息 targetX：目标方激活条左边界 `target_lifeline_x − 7`
- 消息垂直间距建议 40–50px（避免标签重叠）
- 返回消息 y 比同组调用消息 y 大 40–50px

## 元素模板

### 参与者头部（Actor Box）

```xml
<mxCell id="2" value="Client" style="rounded=1;arcSize=15;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;strokeWidth=1.5;fontSize=13;fontStyle=1;" vertex="1" parent="1">
  <mxGeometry x="60" y="20" width="120" height="40" as="geometry"/>
</mxCell>
```

### 生命线（垂直虚线）

```xml
<mxCell id="10" value="" style="endArrow=none;dashed=1;html=1;strokeWidth=1;strokeColor=#999999;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="120" y="60" as="sourcePoint"/>
    <mxPoint x="120" y="460" as="targetPoint"/>
  </mxGeometry>
</mxCell>
```

生命线 x = 参与者头部中心 x = 头部左边距 + 宽度/2。

### 激活条（Activation Bar）

```xml
<mxCell id="20" value="" style="rounded=0;fillColor=#DAE8FC;strokeColor=#6C8EBF;strokeWidth=1;html=1;" vertex="1" parent="1">
  <mxGeometry x="113" y="95" width="14" height="200" as="geometry"/>
</mxCell>
```

### 同步消息（Synchronous Call）

```xml
<mxCell id="30" value="消息名称" style="endArrow=block;endFill=1;html=1;strokeWidth=1.5;strokeColor=#000000;fontSize=12;labelPosition=center;verticalLabelPosition=bottom;align=center;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="127" y="115" as="sourcePoint"/>
    <mxPoint x="283" y="115" as="targetPoint"/>
  </mxGeometry>
</mxCell>
```

### 返回消息（Return, 虚线箭头）

```xml
<mxCell id="31" value="返回值" style="endArrow=open;endFill=0;dashed=1;html=1;strokeWidth=1.5;strokeColor=#555555;fontSize=12;labelPosition=center;verticalLabelPosition=bottom;align=center;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="283" y="200" as="sourcePoint"/>
    <mxPoint x="127" y="200" as="targetPoint"/>
  </mxGeometry>
</mxCell>
```

### 异步消息（Asynchronous, 半箭头）

```xml
<mxCell id="32" value="async event" style="endArrow=open;endFill=0;html=1;strokeWidth=1.5;strokeColor=#000000;fontSize=12;labelPosition=center;verticalLabelPosition=bottom;align=center;" edge="1" parent="1">
  <mxGeometry relative="1" as="geometry">
    <mxPoint x="127" y="150" as="sourcePoint"/>
    <mxPoint x="283" y="150" as="targetPoint"/>
  </mxGeometry>
</mxCell>
```

## 颜色配色建议

| 参与者类型 | fillColor | strokeColor |
|----------|-----------|-------------|
| 前端 / 客户端 | `#DAE8FC` | `#6C8EBF` |
| 后端 / API 网关 | `#D5E8D4` | `#82B366` |
| 业务服务 | `#FFF2CC` | `#D6B656` |
| 数据库 | `#F8CECC` | `#B85450` |
| 外部系统 | `#E1D5E7` | `#9673A6` |
| 消息队列 | `#FCF7FF` | `#666666` |

## 完整示例：用户登录时序图

参与者：Client（120）→ API Gateway（290）→ Auth Service（470）→ Database（650）

```xml
<mxfile host="app.diagrams.net">
  <diagram name="UML时序图-登录流程" id="uml-seq-login">
    <mxGraphModel dx="1000" dy="600" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="0" pageScale="1" pageWidth="900" pageHeight="520" math="0" shadow="0">
      <root>
        <mxCell id="0"/>
        <mxCell id="1" parent="0"/>
        <!-- 参与者头部 -->
        <mxCell id="2" value="Client" style="rounded=1;arcSize=15;whiteSpace=wrap;html=1;fillColor=#DAE8FC;strokeColor=#6C8EBF;strokeWidth=1.5;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="60" y="20" width="120" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="3" value="API Gateway" style="rounded=1;arcSize=15;whiteSpace=wrap;html=1;fillColor=#D5E8D4;strokeColor=#82B366;strokeWidth=1.5;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="230" y="20" width="120" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="4" value="Auth Service" style="rounded=1;arcSize=15;whiteSpace=wrap;html=1;fillColor=#FFF2CC;strokeColor=#D6B656;strokeWidth=1.5;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="400" y="20" width="140" height="40" as="geometry"/>
        </mxCell>
        <mxCell id="5" value="Database" style="rounded=1;arcSize=15;whiteSpace=wrap;html=1;fillColor=#F8CECC;strokeColor=#B85450;strokeWidth=1.5;fontSize=13;fontStyle=1;" vertex="1" parent="1">
          <mxGeometry x="590" y="20" width="120" height="40" as="geometry"/>
        </mxCell>
        <!-- 生命线（垂直虚线） -->
        <mxCell id="6" value="" style="endArrow=none;dashed=1;html=1;strokeWidth=1;strokeColor=#999999;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="120" y="60" as="sourcePoint"/><mxPoint x="120" y="460" as="targetPoint"/></mxGeometry>
        </mxCell>
        <mxCell id="7" value="" style="endArrow=none;dashed=1;html=1;strokeWidth=1;strokeColor=#999999;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="290" y="60" as="sourcePoint"/><mxPoint x="290" y="460" as="targetPoint"/></mxGeometry>
        </mxCell>
        <mxCell id="8" value="" style="endArrow=none;dashed=1;html=1;strokeWidth=1;strokeColor=#999999;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="470" y="60" as="sourcePoint"/><mxPoint x="470" y="460" as="targetPoint"/></mxGeometry>
        </mxCell>
        <mxCell id="9" value="" style="endArrow=none;dashed=1;html=1;strokeWidth=1;strokeColor=#999999;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="650" y="60" as="sourcePoint"/><mxPoint x="650" y="460" as="targetPoint"/></mxGeometry>
        </mxCell>
        <!-- 激活条 -->
        <mxCell id="10" value="" style="rounded=0;fillColor=#DAE8FC;strokeColor=#6C8EBF;strokeWidth=1;html=1;" vertex="1" parent="1">
          <mxGeometry x="113" y="95" width="14" height="275" as="geometry"/>
        </mxCell>
        <mxCell id="11" value="" style="rounded=0;fillColor=#D5E8D4;strokeColor=#82B366;strokeWidth=1;html=1;" vertex="1" parent="1">
          <mxGeometry x="283" y="115" width="14" height="215" as="geometry"/>
        </mxCell>
        <mxCell id="12" value="" style="rounded=0;fillColor=#FFF2CC;strokeColor=#D6B656;strokeWidth=1;html=1;" vertex="1" parent="1">
          <mxGeometry x="463" y="165" width="14" height="125" as="geometry"/>
        </mxCell>
        <mxCell id="13" value="" style="rounded=0;fillColor=#F8CECC;strokeColor=#B85450;strokeWidth=1;html=1;" vertex="1" parent="1">
          <mxGeometry x="643" y="215" width="14" height="50" as="geometry"/>
        </mxCell>
        <!-- 消息（序号写在 value 里，省去额外标注元素） -->
        <mxCell id="14" value="① POST /login" style="endArrow=block;endFill=1;html=1;strokeWidth=1.5;strokeColor=#000000;fontSize=12;labelPosition=center;verticalLabelPosition=bottom;align=center;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="127" y="115" as="sourcePoint"/><mxPoint x="283" y="115" as="targetPoint"/></mxGeometry>
        </mxCell>
        <mxCell id="15" value="② validate(credentials)" style="endArrow=block;endFill=1;html=1;strokeWidth=1.5;strokeColor=#000000;fontSize=12;labelPosition=center;verticalLabelPosition=bottom;align=center;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="297" y="165" as="sourcePoint"/><mxPoint x="463" y="165" as="targetPoint"/></mxGeometry>
        </mxCell>
        <mxCell id="16" value="③ SELECT user" style="endArrow=block;endFill=1;html=1;strokeWidth=1.5;strokeColor=#000000;fontSize=12;labelPosition=center;verticalLabelPosition=bottom;align=center;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="477" y="215" as="sourcePoint"/><mxPoint x="643" y="215" as="targetPoint"/></mxGeometry>
        </mxCell>
        <mxCell id="17" value="④ user record" style="endArrow=open;endFill=0;dashed=1;html=1;strokeWidth=1.5;strokeColor=#555555;fontSize=12;labelPosition=center;verticalLabelPosition=bottom;align=center;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="643" y="260" as="sourcePoint"/><mxPoint x="477" y="260" as="targetPoint"/></mxGeometry>
        </mxCell>
        <mxCell id="18" value="⑤ JWT token" style="endArrow=open;endFill=0;dashed=1;html=1;strokeWidth=1.5;strokeColor=#555555;fontSize=12;labelPosition=center;verticalLabelPosition=bottom;align=center;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="463" y="300" as="sourcePoint"/><mxPoint x="297" y="300" as="targetPoint"/></mxGeometry>
        </mxCell>
        <mxCell id="19" value="⑥ 200 OK + JWT" style="endArrow=open;endFill=0;dashed=1;html=1;strokeWidth=1.5;strokeColor=#555555;fontSize=12;labelPosition=center;verticalLabelPosition=bottom;align=center;" edge="1" parent="1">
          <mxGeometry relative="1" as="geometry"><mxPoint x="283" y="345" as="sourcePoint"/><mxPoint x="127" y="345" as="targetPoint"/></mxGeometry>
        </mxCell>
        <!-- 图题 -->
        <mxCell id="20" value="图：用户登录时序图（Login Sequence Diagram）" style="text;html=1;align=center;fontSize=13;fontStyle=2;" vertex="1" parent="1">
          <mxGeometry x="150" y="472" width="500" height="24" as="geometry"/>
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>
```

## 质量检查清单

- [ ] 生命线 x 坐标与参与者头部中心对齐
- [ ] 激活条 x = lifeline_x − 7
- [ ] 消息箭头水平（同一行），y 坐标在激活条起始 y 内
- [ ] 返回消息用虚线，调用消息用实线实心箭头
- [ ] 消息标签不重叠（y 间距 ≥ 40px）
- [ ] 图题在最下方（y > 最低元素底边 + 20px）
- [ ] 所有 ID 唯一，无重复
