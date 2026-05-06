# 架构审查指南

架构设计审查指南，帮助评估代码的架构是否合理、设计是否恰当。

## SOLID 原则检查清单

### S - 单一职责原则（SRP）

**检查要点：**
- 这个类/模块是否只有一个改变的理由？
- 类中的方法是否都服务于同一个目的？
- 如果要向非技术人员描述这个类，能否用一句话说清楚？

**代码审查中的识别信号：**
```
⚠️ 类名包含 "And"、"Manager"、"Handler"、"Processor" 等泛化词汇
⚠️ 一个类超过 200-300 行代码
⚠️ 类有超过 5-7 个公共方法
⚠️ 不同的方法操作完全不同的数据
```

**审查问题：**
- "这个类负责哪些事情？能否拆分？"
- "如果 X 需求变化，哪些方法需要改？如果 Y 需求变化呢？"

### O - 开闭原则（OCP）

**检查要点：**
- 添加新功能时，是否需要修改现有代码？
- 是否可以通过扩展（继承、组合）来添加新行为？
- 是否存在大量的 if/else 或 switch 语句来处理不同类型？

**代码审查中的识别信号：**
```
⚠️ switch/if-else 链处理不同类型
⚠️ 添加新功能需要修改核心类
⚠️ 类型检查 (instanceof, typeof) 散布在代码中
```

**审查问题：**
- "如果要添加新的 X 类型，需要修改哪些文件？"
- "这个 switch 语句会随着新类型增加而增长吗？"

### L - 里氏替换原则（LSP）

**检查要点：**
- 子类是否可以完全替代父类使用？
- 子类是否改变了父类方法的预期行为？
- 是否存在子类抛出父类未声明的异常？

**代码审查中的识别信号：**
```
⚠️ 显式类型转换 (casting)
⚠️ 子类方法抛出未实现异常（NotImplementedException）
⚠️ 子类方法为空实现或只有 return
⚠️ 使用基类的地方需要检查具体类型
```

**审查问题：**
- "如果用子类替换父类，调用方代码是否需要修改？"
- "这个方法在子类中的行为是否符合父类的契约？"

### I - 接口隔离原则（ISP）

**检查要点：**
- 接口是否足够小且专注？
- 实现类是否被迫实现不需要的方法？
- 客户端是否依赖了它不使用的方法？

**代码审查中的识别信号：**
```
⚠️ 接口超过 5-7 个方法
⚠️ 实现类有空方法或抛出 NotImplementedException
⚠️ 接口名称过于宽泛（如 IManager、IService）
⚠️ 不同的客户端只使用接口的部分方法
```

**审查问题：**
- "这个接口的所有方法是否都被每个实现类使用？"
- "能否将这个大接口拆分为更小的专用接口？"

### D - 依赖倒置原则（DIP）

**检查要点：**
- 高层模块是否依赖于抽象而非具体实现？
- 是否使用依赖注入而非直接 new 对象？
- 抽象是否由高层模块定义而非低层模块？

**代码审查中的识别信号：**
```
⚠️ 高层模块直接 new 低层模块的具体类
⚠️ 导入具体实现类而非接口/抽象类
⚠️ 配置和连接字符串硬编码在业务逻辑中
⚠️ 难以为某个类编写单元测试
```

**审查问题：**
- "这个类的依赖能否在测试时被桩对象（mock）替换？"
- "如果要更换数据库/API 实现，需要修改多少地方？"

---

## 架构反模式识别

### 致命反模式

| 反模式 | 识别信号 | 影响 |
|--------|----------|------|
| **大泥球 (Big Ball of Mud)** | 没有清晰的模块边界，任何代码都可能调用任何其他代码 | 难以理解、修改和测试 |
| **上帝类 (God Object)** | 单个类承担过多职责，知道太多、做太多 | 高耦合，难以重用和测试 |
| **意大利面条代码** | 控制流程混乱，goto 或深层嵌套，难以追踪执行路径 | 难以理解和维护 |
| **熔岩流 (Lava Flow)** | 没人敢动的古老代码，缺乏文档和测试 | 技术债务累积 |

### 设计反模式

| 反模式 | 识别信号 | 建议 |
|--------|----------|------|
| **金锤子 (Golden Hammer)** | 对所有问题使用同一种技术/模式 | 根据问题选择合适的解决方案 |
| **过度工程（Gas Factory）** | 简单问题用复杂方案解决，滥用设计模式 | YAGNI 原则，先简单后复杂 |
| **船锚 (Boat Anchor)** | 为"将来可能需要"而写的未使用代码 | 删除未使用代码，需要时再写 |
| **复制粘贴编程** | 相同逻辑出现在多处 | 提取公共方法或模块 |

### 审查问题

```markdown
🔴 [blocking] "这个类有 2000 行代码，建议拆分为多个专注的类"
🟡 [important] "这段逻辑在 3 个地方重复，考虑提取为公共方法？"
💡 [suggestion] "这个 switch 语句可以用策略模式替代，更易扩展"
```

---

## 耦合度与内聚性评估

### 耦合类型（从好到差）

| 类型 | 描述 | 示例 |
|------|------|------|
| **消息耦合** ✅ | 通过参数传递数据 | `calculate(price, quantity)` |
| **数据耦合** ✅ | 共享简单数据结构 | `processOrder(orderDTO)` |
| **印记耦合** ⚠️ | 共享复杂数据结构但只用部分 | 传入整个 User 对象但只用 name |
| **控制耦合** ⚠️ | 传递控制标志影响行为 | `process(data, isAdmin=true)` |
| **公共耦合** ❌ | 共享全局变量 | 多个模块读写同一个全局状态 |
| **内容耦合** ❌ | 直接访问另一模块的内部 | 直接操作另一个类的私有属性 |

### 内聚类型（从好到差）

| 类型 | 描述 | 质量 |
|------|------|------|
| **功能内聚** | 所有元素完成单一任务 | ✅ 最佳 |
| **顺序内聚** | 输出作为下一步输入 | ✅ 良好 |
| **通信内聚** | 操作相同数据 | ⚠️ 可接受 |
| **时间内聚** | 同时执行的任务 | ⚠️ 较差 |
| **逻辑内聚** | 逻辑相关但功能不同 | ❌ 差 |
| **偶然内聚** | 没有明显关系 | ❌ 最差 |

### 度量指标参考

```yaml
耦合指标:
  CBO (类间耦合):
    好: < 5
    警告: 5-10
    危险: > 10

  Ce (传出耦合):
    描述: 依赖多少外部类
    好: < 7

  Ca (传入耦合):
    描述: 被多少类依赖
    高值意味着: 修改影响大，需要稳定

内聚指标:
  LCOM4 (方法缺乏内聚):
    1: 单一职责 ✅
    2-3: 可能需要拆分 ⚠️
    >3: 应该拆分 ❌
```

### 审查问题

- "这个模块依赖了多少其他模块？能否减少？"
- "修改这个类会影响多少其他地方？"
- "这个类的方法是否都操作相同的数据？"

---

## 分层架构审查

### 清晰架构（Clean Architecture）分层检查

```
┌─────────────────────────────────────┐
│        外层框架与驱动层           │ ← 最外层：Web、DB、UI
├─────────────────────────────────────┤
│          接口适配层                │ ← 控制器、网关、展示器
├─────────────────────────────────────┤
│          应用层                    │ ← 用例、应用服务
├─────────────────────────────────────┤
│          领域层                    │ ← 实体、领域服务
└─────────────────────────────────────┘
          ↑ 依赖方向只能向内 ↑
```

### 依赖规则检查

**核心规则：源代码依赖只能指向内层**

```typescript
// ❌ 违反依赖规则：领域层依赖基础设施层
// domain/User.ts
import { MySQLConnection } from '../infrastructure/database';

// ✅ 正确：领域层定义接口，基础设施层实现
// domain/UserRepository.ts (接口)
interface UserRepository {
  findById(id: string): Promise<User>;
}

// infrastructure/MySQLUserRepository.ts (实现)
class MySQLUserRepository implements UserRepository {
  findById(id: string): Promise<User> { /* ... */ }
}
```

### 审查清单

**层次边界检查：**
- [ ] 领域层是否有外部依赖（数据库、HTTP、文件系统）？
- [ ] 应用层是否直接操作数据库或调用外部 API？
- [ ] 控制器是否包含业务逻辑？
- [ ] 是否存在跨层调用（UI 直接调用 Repository）？

**关注点分离检查：**
- [ ] 业务逻辑是否与展示逻辑分离？
- [ ] 数据访问是否封装在专门的层？
- [ ] 配置和环境相关代码是否集中管理？

### 审查问题

```markdown
🔴 [blocking] "领域实体直接导入了数据库连接，违反依赖规则"
🟡 [important] "控制器包含业务计算逻辑，建议移到服务层"
💡 [suggestion] "考虑使用依赖注入来解耦这些组件"
```

---

## 设计模式使用评估

### 何时使用设计模式

| 模式 | 适用场景 | 不适用场景 |
|------|----------|------------|
| **Factory** | 需要创建不同类型对象，类型在运行时确定 | 只有一种类型，或类型固定不变 |
| **Strategy** | 算法需要在运行时切换，有多种可互换的行为 | 只有一种算法，或算法不会变化 |
| **Observer** | 一对多依赖，状态变化需要通知多个对象 | 简单的直接调用即可满足需求 |
| **Singleton** | 确实需要全局唯一实例，如配置管理 | 可以通过依赖注入传递的对象 |
| **Decorator** | 需要动态添加职责，避免继承爆炸 | 职责固定，不需要动态组合 |

### 过度设计警告信号

```
⚠️ Patternitis（模式炎）识别信号：

1. 简单的 if/else 被替换为策略模式 + 工厂 + 注册表
2. 只有一个实现的接口
3. 为了"将来可能需要"而添加的抽象层
4. 代码行数因模式应用而大幅增加
5. 新人需要很长时间才能理解代码结构
```

### 审查原则

```markdown
✅ 正确使用模式:
- 解决了实际的可扩展性问题
- 代码更容易理解和测试
- 添加新功能变得更简单

❌ 过度使用模式:
- 为了使用模式而使用
- 增加了不必要的复杂度
- 违反了 YAGNI 原则
```

### 审查问题

- "使用这个模式解决了什么具体问题？"
- "如果不用这个模式，代码会有什么问题？"
- "这个抽象层带来的价值是否大于它的复杂度？"

---

## 可扩展性评估

### 扩展性检查清单

**功能扩展性：**
- [ ] 添加新功能是否需要修改核心代码？
- [ ] 是否提供了扩展点（hooks、plugins、events）？
- [ ] 配置是否外部化（配置文件、环境变量）？

**数据扩展性：**
- [ ] 数据模型是否支持新增字段？
- [ ] 是否考虑了数据量增长的场景？
- [ ] 查询是否有合适的索引？

**负载扩展性：**
- [ ] 是否可以水平扩展（添加更多实例）？
- [ ] 是否有状态依赖（session、本地缓存）？
- [ ] 数据库连接是否使用连接池？

### 扩展点设计检查

```typescript
// ✅ 好的扩展设计：使用事件/钩子
class OrderService {
  private hooks: OrderHooks;

  async createOrder(order: Order) {
    await this.hooks.beforeCreate?.(order);
    const result = await this.save(order);
    await this.hooks.afterCreate?.(result);
    return result;
  }
}

// ❌ 差的扩展设计：硬编码所有行为
class OrderService {
  async createOrder(order: Order) {
    await this.sendEmail(order);        // 硬编码
    await this.updateInventory(order);  // 硬编码
    await this.notifyWarehouse(order);  // 硬编码
    return await this.save(order);
  }
}
```

### 审查问题

```markdown
💡 [suggestion] "如果将来需要支持新的支付方式，这个设计是否容易扩展？"
🟡 [important] "这里的逻辑是硬编码的，考虑使用配置或策略模式？"
📚 [learning] "事件驱动架构可以让这个功能更容易扩展"
```

---

## 代码结构最佳实践

### 目录组织

**按功能/领域组织（推荐）：**
```
src/
├── user/
│   ├── User.ts           (实体)
│   ├── UserService.ts    (服务)
│   ├── UserRepository.ts (数据访问)
│   └── UserController.ts (API)
├── order/
│   ├── Order.ts
│   ├── OrderService.ts
│   └── ...
└── shared/
    ├── utils/
    └── types/
```

**按技术层组织（不推荐）：**
```
src/
├── controllers/     ← 不同领域混在一起
│   ├── UserController.ts
│   └── OrderController.ts
├── services/
├── repositories/
└── models/
```

### 命名约定检查

| 类型 | 约定 | 示例 |
|------|------|------|
| 类名 | PascalCase，名词 | `UserService`, `OrderRepository` |
| 方法名 | camelCase，动词 | `createUser`, `findOrderById` |
| 接口名 | I 前缀或无前缀 | `IUserService` 或 `UserService` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 私有属性 | 下划线前缀或无 | `_cache` 或 `#cache` |

### 文件大小指南

```yaml
建议限制:
  单个文件: < 300 行
  单个函数: < 50 行
  单个类: < 200 行
  函数参数: < 4 个
  嵌套深度: < 4 层

超出限制时:
  - 考虑拆分为更小的单元
  - 使用组合而非继承
  - 提取辅助函数或类
```

### 审查问题

```markdown
🟢 [nit] "这个 500 行的文件可以考虑按职责拆分"
🟡 [important] "建议按功能领域而非技术层组织目录结构"
💡 [suggestion] "函数名 `process` 不够明确，考虑改为 `calculateOrderTotal`？"
```

---

## 快速参考清单

### 架构审查 5 分钟速查

```markdown
□ 依赖方向是否正确？（外层依赖内层）
□ 是否存在循环依赖？
□ 核心业务逻辑是否与框架/UI/数据库解耦？
□ 是否遵循 SOLID 原则？
□ 是否存在明显的反模式？
```

### 红旗信号（必须处理）

```markdown
🔴 上帝类（God Object）- 单个类超过 1000 行
🔴 循环依赖 - A → B → C → A
🔴 领域层包含框架依赖
🔴 硬编码的配置和密钥
🔴 没有接口的外部服务调用
```

### 黄旗信号（建议处理）

```markdown
🟡 类间耦合度 (CBO) > 10
🟡 方法参数超过 5 个
🟡 嵌套深度超过 4 层
🟡 重复代码块 > 10 行
🟡 只有一个实现的接口
```

---

## 工具推荐

| 工具 | 用途 | 语言支持 |
|------|------|----------|
| **SonarQube** | 代码质量、耦合度分析 | 多语言 |
| **NDepend** | 依赖分析、架构规则 | .NET |
| **JDepend** | 包依赖分析 | Java |
| **Madge** | 模块依赖图 | JavaScript/TypeScript |
| **ESLint** | 代码规范、复杂度检查 | JavaScript/TypeScript |
| **CodeScene** | 技术债务、热点分析 | 多语言 |

---

## 参考资源

- [Clean Architecture - Uncle Bob](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles in Code Review - JetBrains](https://blog.jetbrains.com/upsource/2015/08/31/what-to-look-for-in-a-code-review-solid-principles-2/)
- [Software Architecture Anti-Patterns](https://medium.com/@christophnissle/anti-patterns-in-software-architecture-3c8970c9c4f5)
- [Coupling and Cohesion in System Design](https://www.geeksforgeeks.org/system-design/coupling-and-cohesion-in-system-design/)
- [Design Patterns - Refactoring Guru](https://refactoring.guru/design-patterns)
