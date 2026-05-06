# 常见缺陷检查清单

按语言整理的代码审查高频缺陷与风险点。

## 通用问题

### 逻辑错误
- [ ] 循环或数组访问中的 off-by-one 错误
- [ ] 布尔逻辑错误（如德摩根定律误用）
- [ ] 缺失 null/undefined 判定
- [ ] 并发代码中的竞态条件
- [ ] 比较运算符使用错误（== vs ===，= vs ==）
- [ ] 整数溢出/下溢
- [ ] 浮点数比较问题

### 资源管理
- [ ] 内存泄漏（连接、监听器未释放）
- [ ] 文件句柄未关闭
- [ ] 数据库连接未释放
- [ ] 事件监听未移除
- [ ] 定时器/轮询未清理

### 错误处理
- [ ] 异常被吞掉（空 catch 块）
- [ ] 过度泛化异常处理掩盖具体错误
- [ ] 缺失错误向上传播
- [ ] 抛出的错误类型不正确
- [ ] 缺失 finally/清理逻辑

## TypeScript/JavaScript

### 类型问题
```typescript
// ❌ Using any defeats type safety
function process(data: any) { return data.value; }

// ✅ Use proper types
interface Data { value: string; }
function process(data: Data) { return data.value; }
```

### 异步/Await 常见陷阱
```typescript
// ❌ Missing await
async function fetch() {
  const data = fetchData();  // Missing await!
  return data.json();
}

// ❌ Unhandled promise rejection
async function risky() {
  const result = await fetchData();  // No try-catch
  return result;
}

// ✅ Proper error handling
async function safe() {
  try {
    const result = await fetchData();
    return result;
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}
```

### React 专项

#### Hooks 规则违反
```tsx
// ❌ 条件调用 Hooks — 违反 Hooks 规则
function BadComponent({ show }) {
  if (show) {
    const [value, setValue] = useState(0);  // Error!
  }
  return <div>...</div>;
}

// ✅ Hooks 必须在顶层无条件调用
function GoodComponent({ show }) {
  const [value, setValue] = useState(0);
  if (!show) return null;
  return <div>{value}</div>;
}

// ❌ 循环中调用 Hooks
function BadLoop({ items }) {
  items.forEach(item => {
    const [selected, setSelected] = useState(false);  // Error!
  });
}

// ✅ 将状态提升或使用不同的数据结构
function GoodLoop({ items }) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  return items.map(item => (
    <Item key={item.id} selected={selectedIds.has(item.id)} />
  ));
}
```

#### useEffect 常见错误
```tsx
// ❌ 依赖数组不完整 — stale closure
function StaleClosureExample({ userId, onSuccess }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData(userId).then(result => {
      setData(result);
      onSuccess(result);  // onSuccess 可能是 stale 的！
    });
  }, [userId]);  // 缺少 onSuccess 依赖
}

// ✅ 完整的依赖数组
useEffect(() => {
  fetchData(userId).then(result => {
    setData(result);
    onSuccess(result);
  });
}, [userId, onSuccess]);

// ❌ 无限循环 — 在 effect 中更新依赖
function InfiniteLoop() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count + 1);  // 触发重渲染，又触发 effect
  }, [count]);  // 无限循环！
}

// ❌ 缺少清理函数 — 内存泄漏
function MemoryLeak({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUser(userId).then(setUser);  // 组件卸载后仍然调用 setUser
  }, [userId]);
}

// ✅ 正确的清理
function NoLeak({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetchUser(userId).then(data => {
      if (!cancelled) setUser(data);
    });
    return () => { cancelled = true; };
  }, [userId]);
}

// ❌ useEffect 用于派生状态（反模式）
function BadDerived({ items }) {
  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(items.reduce((a, b) => a + b.price, 0));
  }, [items]);  // 不必要的 effect + 额外渲染
}

// ✅ 直接计算或用 useMemo
function GoodDerived({ items }) {
  const total = useMemo(
    () => items.reduce((a, b) => a + b.price, 0),
    [items]
  );
}

// ❌ useEffect 用于事件响应
function BadEvent() {
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (query) logSearch(query);  // 应该在事件处理器中
  }, [query]);
}

// ✅ 副作用在事件处理器中
function GoodEvent() {
  const handleSearch = (q: string) => {
    setQuery(q);
    logSearch(q);
  };
}
```

#### useMemo / useCallback 误用
```tsx
// ❌ 过度优化 — 常量不需要 memo
function OverOptimized() {
  const config = useMemo(() => ({ api: '/v1' }), []);  // 无意义
  const noop = useCallback(() => {}, []);  // 无意义
}

// ❌ 空依赖的 useMemo（可能隐藏 bug）
function EmptyDeps({ user }) {
  const greeting = useMemo(() => `Hello ${user.name}`, []);
  // user 变化时 greeting 不更新！
}

// ❌ useCallback 依赖总是变化
function UselessCallback({ data }) {
  const process = useCallback(() => {
    return data.map(transform);
  }, [data]);  // 如果 data 每次都是新引用，完全无效
}

// ❌ useMemo/useCallback 没有配合 React.memo
function Parent() {
  const data = useMemo(() => compute(), []);
  const handler = useCallback(() => {}, []);
  return <Child data={data} onClick={handler} />;
  // Child 没有用 React.memo，这些优化毫无意义
}

// ✅ 正确的优化组合
const MemoChild = React.memo(function Child({ data, onClick }) {
  return <button onClick={onClick}>{data}</button>;
});

function Parent() {
  const data = useMemo(() => expensiveCompute(), [dep]);
  const handler = useCallback(() => {}, []);
  return <MemoChild data={data} onClick={handler} />;
}
```

#### 组件设计问题
```tsx
// ❌ 在组件内定义组件
function Parent() {
  // 每次渲染都创建新的 Child 函数，导致完全重新挂载
  const Child = () => <div>child</div>;
  return <Child />;
}

// ✅ 组件定义在外部
const Child = () => <div>child</div>;
function Parent() {
  return <Child />;
}

// ❌ Props 总是新引用 — 破坏 memo
function BadProps() {
  return (
    <MemoComponent
      style={{ color: 'red' }}      // 每次渲染新对象
      onClick={() => handle()}       // 每次渲染新函数
      items={data.filter(x => x)}    // 每次渲染新数组
    />
  );
}

// ❌ 直接修改 props
function MutateProps({ user }) {
  user.name = 'Changed';  // 永远不要这样做！
  return <div>{user.name}</div>;
}
```

#### Server Components 错误 (React 19+)
```tsx
// ❌ 在 Server Component 中使用客户端 API
// app/page.tsx (默认是 Server Component)
export default function Page() {
  const [count, setCount] = useState(0);  // Error!
  useEffect(() => {}, []);  // Error!
  return <button onClick={() => {}}>Click</button>;  // Error!
}

// ✅ 交互逻辑移到 Client Component
// app/counter.tsx
'use client';
export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// app/page.tsx
import { Counter } from './counter';
export default async function Page() {
  const data = await fetchData();  // Server Component 可以直接 await
  return <Counter initialCount={data.count} />;
}

// ❌ 在父组件标记 'use client'，整个子树变成客户端
// layout.tsx
'use client';  // 坏主意！所有子组件都变成客户端组件
export default function Layout({ children }) { ... }
```

#### 测试常见错误
```tsx
// ❌ 使用 container 查询
const { container } = render(<Component />);
const button = container.querySelector('button');  // 不推荐

// ✅ 使用 screen 和语义查询
render(<Component />);
const button = screen.getByRole('button', { name: /submit/i });

// ❌ 使用 fireEvent
fireEvent.click(button);

// ✅ 使用 userEvent
await userEvent.click(button);

// ❌ 测试实现细节
expect(component.state.isOpen).toBe(true);

// ✅ 测试行为
expect(screen.getByRole('dialog')).toBeVisible();

// ❌ 等待同步查询
await screen.getByText('Hello');  // getBy 是同步的

// ✅ 异步用 findBy
await screen.findByText('Hello');  // findBy 会等待
```

### React 常见错误清单
- [ ] Hooks 不在顶层调用（条件/循环中）
- [ ] useEffect 依赖数组不完整
- [ ] useEffect 缺少清理函数
- [ ] useEffect 用于派生状态计算
- [ ] useMemo/useCallback 过度使用
- [ ] useMemo/useCallback 没配合 React.memo
- [ ] 在组件内定义子组件
- [ ] Props 是新对象/函数引用（传给 memo 组件时）
- [ ] 直接修改 props
- [ ] 列表缺少 key 或用 index 作为 key
- [ ] Server Component 使用客户端 API
- [ ] 'use client' 放在父组件导致整个树客户端化
- [ ] 测试使用 container 查询而非 screen
- [ ] 测试实现细节而非行为

### React 19 Actions & Forms 错误

```tsx
// === useActionState 错误 ===

// ❌ 在 Action 中直接 setState 而不是返回状态
const [state, action] = useActionState(async (prev, formData) => {
  setSomeState(newValue);  // 错误！应该返回新状态
}, initialState);

// ✅ 返回新状态
const [state, action] = useActionState(async (prev, formData) => {
  const result = await submitForm(formData);
  return { ...prev, data: result };  // 返回新状态
}, initialState);

// ❌ 忘记处理 isPending
const [state, action] = useActionState(submitAction, null);
return <button>Submit</button>;  // 用户可以重复点击

// ✅ 使用 isPending 禁用按钮
const [state, action, isPending] = useActionState(submitAction, null);
return <button disabled={isPending}>Submit</button>;

// === useFormStatus 错误 ===

// ❌ 在 form 同级调用 useFormStatus
function Form() {
  const { pending } = useFormStatus();  // 永远是 undefined！
  return <form><button disabled={pending}>Submit</button></form>;
}

// ✅ 在子组件中调用
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Submit</button>;
}
function Form() {
  return <form><SubmitButton /></form>;
}

// === useOptimistic 错误 ===

// ❌ 用于关键业务操作
function PaymentButton() {
  const [optimisticPaid, setPaid] = useOptimistic(false);
  const handlePay = async () => {
    setPaid(true);  // 危险：显示已支付但可能失败
    await processPayment();
  };
}

// ❌ 没有处理回滚后的 UI 状态
const [optimisticLikes, addLike] = useOptimistic(likes);
// 失败后 UI 回滚，但用户可能困惑为什么点赞消失了

// ✅ 提供失败反馈
const handleLike = async () => {
  addLike(1);
  try {
    await likePost();
  } catch {
    toast.error('点赞失败，请重试');  // 通知用户
  }
};
```

### React 19 表单检查清单
- [ ] useActionState 返回新状态而不是 setState
- [ ] useActionState 正确使用 isPending 禁用提交
- [ ] useFormStatus 在 form 子组件中调用
- [ ] useOptimistic 不用于关键业务（支付、删除等）
- [ ] useOptimistic 失败时有用户反馈
- [ ] Server Action 正确标记 'use server'

### Suspense 与流式渲染错误

```tsx
// === Suspense 边界错误 ===

// ❌ 整个页面一个 Suspense——慢内容阻塞快内容
function BadPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <FastHeader />      {/* 快 */}
      <SlowMainContent /> {/* 慢——阻塞整个页面 */}
      <FastFooter />      {/* 快 */}
    </Suspense>
  );
}

// ✅ 独立边界，互不阻塞
function GoodPage() {
  return (
    <>
      <FastHeader />
      <Suspense fallback={<ContentSkeleton />}>
        <SlowMainContent />
      </Suspense>
      <FastFooter />
    </>
  );
}

// ❌ 没有 Error Boundary
function NoErrorHandling() {
  return (
    <Suspense fallback={<Loading />}>
      <DataFetcher />  {/* 抛错导致白屏 */}
    </Suspense>
  );
}

// ✅ Error Boundary + Suspense
function WithErrorHandling() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<Loading />}>
        <DataFetcher />
      </Suspense>
    </ErrorBoundary>
  );
}

// === use() Hook 错误 ===

// ❌ 在组件外创建 Promise（每次渲染新 Promise）
function BadUse() {
  const data = use(fetchData());  // 每次渲染都创建新 Promise！
  return <div>{data}</div>;
}

// ✅ 在父组件创建，通过 props 传递
function Parent() {
  const dataPromise = useMemo(() => fetchData(), []);
  return <Child dataPromise={dataPromise} />;
}
function Child({ dataPromise }) {
  const data = use(dataPromise);
  return <div>{data}</div>;
}

// === Next.js Streaming 错误 ===

// ❌ 在 layout.tsx 中 await 慢数据——阻塞所有子页面
// app/layout.tsx
export default async function Layout({ children }) {
  const config = await fetchSlowConfig();  // 阻塞整个应用！
  return <ConfigProvider value={config}>{children}</ConfigProvider>;
}

// ✅ 将慢数据放在页面级别或使用 Suspense
// app/layout.tsx
export default function Layout({ children }) {
  return (
    <Suspense fallback={<ConfigSkeleton />}>
      <ConfigProvider>{children}</ConfigProvider>
    </Suspense>
  );
}
```

### Suspense 检查清单
- [ ] 慢内容有独立的 Suspense 边界
- [ ] 每个 Suspense 有对应的 Error Boundary
- [ ] fallback 是有意义的骨架屏（不是简单 spinner）
- [ ] use() 的 Promise 不在渲染时创建
- [ ] 没有在 layout 中 await 慢数据
- [ ] 嵌套层级不超过 3 层

### TanStack Query 错误

```tsx
// === 查询配置错误 ===

// ❌ queryKey 不包含查询参数
function BadQuery({ userId, filters }) {
  const { data } = useQuery({
    queryKey: ['users'],  // 缺少 userId 和 filters！
    queryFn: () => fetchUsers(userId, filters),
  });
  // userId 或 filters 变化时数据不会更新
}

// ✅ queryKey 包含所有影响数据的参数
function GoodQuery({ userId, filters }) {
  const { data } = useQuery({
    queryKey: ['users', userId, filters],
    queryFn: () => fetchUsers(userId, filters),
  });
}

// ❌ staleTime: 0 导致过度请求
const { data } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  // 默认 staleTime: 0，每次组件挂载/窗口聚焦都会 refetch
});

// ✅ 设置合理的 staleTime
const { data } = useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 5 * 60 * 1000,  // 5 分钟内不会自动 refetch
});

// === useSuspenseQuery 错误 ===

// ❌ useSuspenseQuery + enabled（不支持）
const { data } = useSuspenseQuery({
  queryKey: ['user', userId],
  queryFn: () => fetchUser(userId),
  enabled: !!userId,  // 错误！useSuspenseQuery 不支持 enabled
});

// ✅ 条件渲染实现
function UserQuery({ userId }) {
  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  return <UserProfile user={data} />;
}

function Parent({ userId }) {
  if (!userId) return <SelectUser />;
  return (
    <Suspense fallback={<UserSkeleton />}>
      <UserQuery userId={userId} />
    </Suspense>
  );
}

// === Mutation 错误 ===

// ❌ Mutation 成功后不 invalidate 查询
const mutation = useMutation({
  mutationFn: updateUser,
  // 忘记 invalidate，UI 显示旧数据
});

// ✅ 成功后 invalidate 相关查询
const mutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  },
});

// ❌ 乐观更新不处理回滚
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);
    // 没有保存旧数据，失败后无法回滚！
  },
});

// ✅ 完整的乐观更新
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previous = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);
    return { previous };
  },
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previous);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});

// === v5 迁移错误 ===

// ❌ 使用废弃的 API
const { data, isLoading } = useQuery(['key'], fetchFn);  // v4 语法

// ✅ v5 单一对象参数
const { data, isPending } = useQuery({
  queryKey: ['key'],
  queryFn: fetchFn,
});

// ❌ 混淆 isPending 和 isLoading
if (isLoading) return <Spinner />;
// v5 中 isLoading = isPending && isFetching

// ✅ 根据意图选择
if (isPending) return <Spinner />;  // 没有缓存数据
// 或
if (isFetching) return <Refreshing />;  // 正在后台刷新
```

### TanStack Query Checklist
- [ ] queryKey 包含所有影响数据的参数
- [ ] 设置了合理的 staleTime（不是默认 0）
- [ ] useSuspenseQuery 不使用 enabled
- [ ] Mutation 成功后 invalidate 相关查询
- [ ] 乐观更新有完整的回滚逻辑
- [ ] v5 使用单一对象参数语法
- [ ] 理解 isPending vs isLoading vs isFetching

### TypeScript/JavaScript 常见错误
- [ ] `==` instead of `===`
- [ ] 迭代时修改数组/对象
- [ ] `this` context lost in callbacks
- [ ] 列表缺少 `key` 属性
- [ ] Closure capturing loop variable
- [ ] parseInt without radix parameter

## Vue 3

### 响应性丢失
```vue
<!-- ❌ 解构 reactive 丢失响应性 -->
<script setup>
const state = reactive({ count: 0 })
const { count } = state  // count 不是响应式的！
</script>

<!-- ✅ 使用 toRefs -->
<script setup>
const state = reactive({ count: 0 })
const { count } = toRefs(state)  // count.value 是响应式的
</script>
```

### Props 响应性传递
```vue
<!-- ❌ 传递 props 值到 composable 丢失响应性 -->
<script setup>
const props = defineProps<{ id: string }>()
const { data } = useFetch(props.id)  // id 变化时不会重新获取！
</script>

<!-- ✅ 使用 toRef 或 getter -->
<script setup>
const props = defineProps<{ id: string }>()
const { data } = useFetch(() => props.id)  // getter 保持响应性
// 或
const { data } = useFetch(toRef(props, 'id'))
</script>
```

### Watch 清理
```vue
<!-- ❌ 异步 watch 无清理，导致竞态 -->
<script setup>
watch(id, async (newId) => {
  const data = await fetchData(newId)
  result.value = data  // 旧请求可能覆盖新结果！
})
</script>

<!-- ✅ 使用 onCleanup 取消旧请求 -->
<script setup>
watch(id, async (newId, _, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())

  const data = await fetchData(newId, controller.signal)
  result.value = data
})
</script>
```

### Computed 副作用
```vue
<!-- ❌ computed 中修改其他状态 -->
<script setup>
const total = computed(() => {
  sideEffect.value++  // 副作用！每次访问都会执行
  return items.value.reduce((a, b) => a + b, 0)
})
</script>

<!-- ✅ computed 只做纯计算 -->
<script setup>
const total = computed(() => {
  return items.value.reduce((a, b) => a + b, 0)
})
// 副作用放 watch
watch(total, () => { sideEffect.value++ })
</script>
```

### 模板常见错误
```vue
<!-- ❌ v-if 和 v-for 同时使用（v-if 优先级更高） -->
<template>
  <div v-for="item in items" v-if="item.visible" :key="item.id">
    {{ item.name }}
  </div>
</template>

<!-- ✅ 使用 computed 或 template 包裹 -->
<template>
  <template v-for="item in items" :key="item.id">
    <div v-if="item.visible">{{ item.name }}</div>
  </template>
</template>
```

### Vue 常见错误
- [ ] props 传递给 composable 时未保持响应性
- [ ] watch 异步回调无清理函数
- [ ] computed 中产生副作用
- [ ] v-for 使用 index 作为 key（列表会重排时）
- [ ] v-if 和 v-for 在同一元素上
- [ ] defineProps 未使用 TypeScript 类型声明
- [ ] withDefaults 对象默认值未使用工厂函数
- [ ] 直接修改 props（而不是 emit）
- [ ] watchEffect 依赖不明确导致过度触发

## Python

### 可变默认参数
```python
# ❌ Bug: List shared across all calls
def add_item(item, items=[]):
    items.append(item)
    return items

# ✅ Correct
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

### Exception Handling
```python
# ❌ Catching everything, including KeyboardInterrupt
try:
    risky_operation()
except:
    pass

# ✅ Catch specific exceptions
try:
    risky_operation()
except ValueError as e:
    logger.error(f"Invalid value: {e}")
    raise
```

### Class Attributes
```python
# ❌ Shared mutable class attribute
class User:
    permissions = []  # Shared across all instances!

# ✅ Initialize in __init__
class User:
    def __init__(self):
        self.permissions = []
```

### Python 常见错误
- [ ] 方法中遗漏 `self` 参数
- [ ] 迭代时修改列表
- [ ] 在循环中做字符串拼接（应使用 join）
- [ ] 文件未关闭（应使用 `with` 语句）

## Rust

### 所有权与借用

```rust
// ❌ Use after move
let s = String::from("hello");
let s2 = s;
println!("{}", s);  // Error: s was moved

// ✅ Clone if needed (but consider if clone is necessary)
let s = String::from("hello");
let s2 = s.clone();
println!("{}", s);  // OK

// ❌ 用 clone() 绕过借用检查器（反模式）
fn process(data: &Data) {
    let owned = data.clone();  // 不必要的 clone
    do_something(owned);
}

// ✅ 正确使用借用
fn process(data: &Data) {
    do_something(data);  // 传递引用
}

// ❌ 在结构体中存储借用（通常是坏主意）
struct Parser<'a> {
    input: &'a str,  // 生命周期复杂化
    position: usize,
}

// ✅ 使用拥有的数据
struct Parser {
    input: String,  // 拥有数据，简化生命周期
    position: usize,
}

// ❌ 迭代时修改集合
let mut vec = vec![1, 2, 3];
for item in &vec {
    vec.push(*item);  // Error: cannot borrow as mutable
}

// ✅ 收集到新集合
let vec = vec![1, 2, 3];
let new_vec: Vec<_> = vec.iter().map(|x| x * 2).collect();
```

### Unsafe 代码审查

```rust
// ❌ unsafe 没有安全注释
unsafe {
    ptr::write(dest, value);
}

// ✅ 必须有 SAFETY 注释说明不变量
// SAFETY: dest 指针由 Vec::as_mut_ptr() 获得，保证：
// 1. 指针有效且已对齐
// 2. 目标内存未被其他引用借用
// 3. 写入不会超出分配的容量
unsafe {
    ptr::write(dest, value);
}

// ❌ unsafe fn 没有 # Safety 文档
pub unsafe fn from_raw_parts(ptr: *mut T, len: usize) -> Self { ... }

// ✅ 必须文档化安全契约
/// Creates a new instance from raw parts.
///
/// # Safety
///
/// - `ptr` must have been allocated via `GlobalAlloc`
/// - `len` must be less than or equal to the allocated capacity
/// - The caller must ensure no other references to the memory exist
pub unsafe fn from_raw_parts(ptr: *mut T, len: usize) -> Self { ... }

// ❌ 跨模块 unsafe 不变量
mod a {
    pub fn set_flag() { FLAG = true; }  // 安全代码影响 unsafe
}
mod b {
    pub unsafe fn do_thing() {
        if FLAG { /* assumes FLAG means something */ }
    }
}

// ✅ 将 unsafe 边界封装在单一模块
mod safe_wrapper {
    // 所有 unsafe 逻辑在一个模块内
    // 对外提供 safe API
}
```

### 异步/并发

```rust
// ❌ 在异步上下文中阻塞
async fn bad_fetch(url: &str) -> Result<String> {
    let resp = reqwest::blocking::get(url)?;  // 阻塞整个运行时！
    Ok(resp.text()?)
}

// ✅ 使用异步版本
async fn good_fetch(url: &str) -> Result<String> {
    let resp = reqwest::get(url).await?;
    Ok(resp.text().await?)
}

// ❌ 跨 .await 持有 Mutex
async fn bad_lock(mutex: &Mutex<Data>) {
    let guard = mutex.lock().unwrap();
    some_async_op().await;  // 持锁跨越 await！
    drop(guard);
}

// ✅ 缩短锁持有时间
async fn good_lock(mutex: &Mutex<Data>) {
    let data = {
        let guard = mutex.lock().unwrap();
        guard.clone()  // 获取数据后立即释放锁
    };
    some_async_op().await;
    // 处理 data
}

// ❌ 在异步函数中使用 std::sync::Mutex
async fn bad_async_mutex(mutex: &std::sync::Mutex<Data>) {
    let _guard = mutex.lock().unwrap();  // 可能死锁
    tokio::time::sleep(Duration::from_secs(1)).await;
}

// ✅ 使用 tokio::sync::Mutex（如果必须跨 await）
async fn good_async_mutex(mutex: &tokio::sync::Mutex<Data>) {
    let _guard = mutex.lock().await;
    tokio::time::sleep(Duration::from_secs(1)).await;
}

// ❌ 忘记 Future 是惰性的
fn bad_spawn() {
    let future = async_operation();  // 没有执行！
    // future 被丢弃，什么都没发生
}

// ✅ 必须 await 或 spawn
async fn good_spawn() {
    async_operation().await;  // 执行
    // 或
    tokio::spawn(async_operation());  // 后台执行
}

// ❌ spawn 任务缺少 'static
async fn bad_spawn_lifetime(data: &str) {
    tokio::spawn(async {
        println!("{}", data);  // Error: data 不是 'static
    });
}

// ✅ 使用 move 或 Arc
async fn good_spawn_lifetime(data: String) {
    tokio::spawn(async move {
        println!("{}", data);  // OK: 拥有数据
    });
}
```

### 错误处理

```rust
// ❌ 生产代码中使用 unwrap/expect
fn bad_parse(input: &str) -> i32 {
    input.parse().unwrap()  // panic!
}

// ✅ 正确传播错误
fn good_parse(input: &str) -> Result<i32, ParseIntError> {
    input.parse()
}

// ❌ 吞掉错误信息
fn bad_error_handling() -> Result<()> {
    match operation() {
        Ok(v) => Ok(v),
        Err(_) => Err(anyhow!("operation failed"))  // 丢失原始错误
    }
}

// ✅ 使用 context 添加上下文
fn good_error_handling() -> Result<()> {
    operation().context("failed to perform operation")?;
    Ok(())
}

// ❌ 库代码使用 anyhow（应该用 thiserror）
// lib.rs
pub fn parse_config(path: &str) -> anyhow::Result<Config> {
    // 调用者无法区分错误类型
}

// ✅ 库代码用 thiserror 定义错误类型
#[derive(Debug, thiserror::Error)]
pub enum ConfigError {
    #[error("failed to read config file: {0}")]
    Io(#[from] std::io::Error),
    #[error("invalid config format: {0}")]
    Parse(#[from] serde_json::Error),
}

pub fn parse_config(path: &str) -> Result<Config, ConfigError> {
    // 调用者可以 match 不同错误
}

// ❌ 忽略 must_use 返回值
fn bad_ignore_result() {
    some_fallible_operation();  // 警告：unused Result
}

// ✅ 显式处理或标记忽略
fn good_handle_result() {
    let _ = some_fallible_operation();  // 显式忽略
    // 或
    some_fallible_operation().ok();  // 转换为 Option
}
```

### 性能陷阱

```rust
// ❌ 不必要的 collect
fn bad_process(items: &[i32]) -> i32 {
    items.iter()
        .filter(|x| **x > 0)
        .collect::<Vec<_>>()  // 不必要的分配
        .iter()
        .sum()
}

// ✅ 惰性迭代
fn good_process(items: &[i32]) -> i32 {
    items.iter()
        .filter(|x| **x > 0)
        .sum()
}

// ❌ 循环中重复分配
fn bad_loop() -> String {
    let mut result = String::new();
    for i in 0..1000 {
        result = result + &i.to_string();  // 每次迭代都重新分配！
    }
    result
}

// ✅ 预分配或使用 push_str
fn good_loop() -> String {
    let mut result = String::with_capacity(4000);  // 预分配
    for i in 0..1000 {
        write!(result, "{}", i).unwrap();  // 原地追加
    }
    result
}

// ❌ 过度使用 clone
fn bad_clone(data: &HashMap<String, Vec<u8>>) -> Vec<u8> {
    data.get("key").cloned().unwrap_or_default()
}

// ✅ 返回引用或使用 Cow
fn good_ref(data: &HashMap<String, Vec<u8>>) -> &[u8] {
    data.get("key").map(|v| v.as_slice()).unwrap_or(&[])
}

// ❌ 大结构体按值传递
fn bad_pass(data: LargeStruct) { ... }  // 拷贝整个结构体

// ✅ 传递引用
fn good_pass(data: &LargeStruct) { ... }

// ❌ Box<dyn Trait> 用于小型已知类型
fn bad_trait_object() -> Box<dyn Iterator<Item = i32>> {
    Box::new(vec![1, 2, 3].into_iter())
}

// ✅ 使用 impl Trait
fn good_impl_trait() -> impl Iterator<Item = i32> {
    vec![1, 2, 3].into_iter()
}

// ❌ retain 比 filter+collect 慢（某些场景）
vec.retain(|x| x.is_valid());  // O(n) 但常数因子大

// ✅ 如果不需要原地修改，考虑 filter
let vec: Vec<_> = vec.into_iter().filter(|x| x.is_valid()).collect();
```

### 生命周期与引用

```rust
// ❌ 返回局部变量的引用
fn bad_return_ref() -> &str {
    let s = String::from("hello");
    &s  // Error: s will be dropped
}

// ✅ 返回拥有的数据或静态引用
fn good_return_owned() -> String {
    String::from("hello")
}

// ❌ 生命周期过度泛化
fn bad_lifetime<'a, 'b>(x: &'a str, y: &'b str) -> &'a str {
    x  // 'b 没有被使用
}

// ✅ 简化生命周期
fn good_lifetime(x: &str, _y: &str) -> &str {
    x  // 编译器自动推断
}

// ❌ 结构体持有多个相关引用但生命周期独立
struct Bad<'a, 'b> {
    name: &'a str,
    data: &'b [u8],  // 通常应该是同一个生命周期
}

// ✅ 相关数据使用相同生命周期
struct Good<'a> {
    name: &'a str,
    data: &'a [u8],
}
```

### Rust 审查清单

**所有权与借用**
- [ ] clone() 是有意为之，不是绕过借用检查器
- [ ] 避免在结构体中存储借用（除非必要）
- [ ] Rc/Arc 使用合理，没有隐藏不必要的共享状态
- [ ] 没有不必要的 RefCell（运行时检查 vs 编译时）

**Unsafe 代码**
- [ ] 每个 unsafe 块有 SAFETY 注释
- [ ] unsafe fn 有 # Safety 文档
- [ ] 安全不变量被清晰记录
- [ ] unsafe 边界尽可能小

**异步/并发**
- [ ] 没有在异步上下文中阻塞
- [ ] 没有跨 .await 持有 std::sync 锁
- [ ] spawn 的任务满足 'static 约束
- [ ] Future 被正确 await 或 spawn
- [ ] 锁的顺序一致（避免死锁）

**错误处理**
- [ ] 库代码使用 thiserror，应用代码使用 anyhow
- [ ] 错误有足够的上下文信息
- [ ] 没有在生产代码中 unwrap/expect
- [ ] must_use 返回值被正确处理

**性能**
- [ ] 避免不必要的 collect()
- [ ] 大数据结构传引用
- [ ] 字符串拼接使用 String::with_capacity 或 write!
- [ ] impl Trait 优于 Box<dyn Trait>（当可能时）

**类型系统**
- [ ] 善用 newtype 模式增加类型安全
- [ ] 枚举穷尽匹配（没有 _ 通配符隐藏新变体）
- [ ] 生命周期尽可能简化

## SQL

### 注入漏洞
```sql
-- ❌ String concatenation (SQL injection risk)
query = "SELECT * FROM users WHERE id = " + user_id

-- ✅ Parameterized queries
query = "SELECT * FROM users WHERE id = ?"
cursor.execute(query, (user_id,))
```

### 性能问题
- [ ] 过滤/关联列缺少索引
- [ ] 使用了 `SELECT *` 而非指定列
- [ ] 存在 N+1 查询模式
- [ ] 大表查询缺少 LIMIT
- [ ] 子查询与 JOIN 选择低效

### 常见错误
- [ ] 错误处理 NULL 比较
- [ ] 相关操作缺少事务包裹
- [ ] JOIN 类型使用不正确
- [ ] 大小写敏感性问题
- [ ] 日期/时区处理错误

## API 设计

### REST 常见问题
- [ ] 资源命名不一致
- [ ] HTTP 方法使用错误（如幂等操作用了 POST）
- [ ] 列表接口缺少分页
- [ ] 状态码使用不正确
- [ ] 缺少限流

### 数据校验
- [ ] 缺少输入校验
- [ ] 数据类型校验不正确
- [ ] 缺少长度/范围校验
- [ ] 未对用户输入做清洗
- [ ] 仅依赖客户端校验

## 测试

### 测试质量问题
- [ ] 测试实现细节而非行为
- [ ] 缺少边界场景测试
- [ ] 测试不稳定（非确定性）
- [ ] 测试依赖外部系统
- [ ] 缺少负向测试（错误场景）
- [ ] 测试初始化过于复杂