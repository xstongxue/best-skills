# React 代码审查指南

React 审查重点：Hooks 规则、性能优化的适度性、组件设计、以及现代 React 19/RSC 模式。

## 目录

- [基础 Hooks 规则](#基础-hooks-规则)
- [useEffect 模式](#useeffect-模式)
- [useMemo / useCallback](#usememo--usecallback)
- [组件设计](#组件设计)
- [错误边界与 Suspense](#错误边界与-suspense)
- [服务器组件（RSC）](#服务器组件rsc)
- [React 19 Actions 与表单](#react-19-actions-与表单)
- [Suspense 与流式 SSR](#suspense-与流式-ssr)
- [TanStack Query v5（查询库）](#tanstack-query-v5查询库)
- [审查检查清单](#审查检查清单)

---

## 基础 Hooks 规则

```tsx
// ❌ 条件调用 Hooks — 违反 Hooks 规则
function BadComponent({ isLoggedIn }) {
  if (isLoggedIn) {
    const [user, setUser] = useState(null);  // Error!
  }
  return <div>...</div>;
}

// ✅ Hooks 必须在组件顶层调用
function GoodComponent({ isLoggedIn }) {
  const [user, setUser] = useState(null);
  if (!isLoggedIn) return <LoginPrompt />;
  return <div>{user?.name}</div>;
}
```

---

## useEffect 模式

```tsx
// ❌ 依赖数组缺失或不完整
function BadEffect({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, []);  // 缺少 userId 依赖！
}

// ✅ 完整的依赖数组
function GoodEffect({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    let cancelled = false;
    fetchUser(userId).then(data => {
      if (!cancelled) setUser(data);
    });
    return () => { cancelled = true; };  // 清理函数
  }, [userId]);
}

// ❌ useEffect 用于派生状态（反模式）
function BadDerived({ items }) {
  const [filteredItems, setFilteredItems] = useState([]);
  useEffect(() => {
    setFilteredItems(items.filter(i => i.active));
  }, [items]);  // 不必要的 effect + 额外渲染
  return <List items={filteredItems} />;
}

// ✅ 直接在渲染时计算，或用 useMemo
function GoodDerived({ items }) {
  const filteredItems = useMemo(
    () => items.filter(i => i.active),
    [items]
  );
  return <List items={filteredItems} />;
}

// ❌ useEffect 用于事件响应
function BadEventEffect() {
  const [query, setQuery] = useState('');
  useEffect(() => {
    if (query) {
      analytics.track('search', { query });  // 应该在事件处理器中
    }
  }, [query]);
}

// ✅ 在事件处理器中执行副作用
function GoodEvent() {
  const [query, setQuery] = useState('');
  const handleSearch = (q: string) => {
    setQuery(q);
    analytics.track('search', { query: q });
  };
}
```

---

## useMemo / useCallback

```tsx
// ❌ 过度优化 — 常量不需要 useMemo
function OverOptimized() {
  const config = useMemo(() => ({ timeout: 5000 }), []);  // 无意义
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);  // 如果不传给 memo 组件，无意义
}

// ✅ 只在需要时优化
function ProperlyOptimized() {
  const config = { timeout: 5000 };  // 简单对象直接定义
  const handleClick = () => console.log('clicked');
}

// ❌ useCallback 依赖总是变化
function BadCallback({ data }) {
  // data 每次渲染都是新对象，useCallback 无效
  const process = useCallback(() => {
    return data.map(transform);
  }, [data]);
}

// ✅ useMemo + useCallback 配合 React.memo 使用
const MemoizedChild = React.memo(function Child({ onClick, items }) {
  return <div onClick={onClick}>{items.length}</div>;
});

function Parent({ rawItems }) {
  const items = useMemo(() => processItems(rawItems), [rawItems]);
  const handleClick = useCallback(() => {
    console.log(items.length);
  }, [items]);
  return <MemoizedChild onClick={handleClick} items={items} />;
}
```

---

## 组件设计

```tsx
// ❌ 在组件内定义组件 — 每次渲染都创建新组件
function BadParent() {
  function ChildComponent() {  // 每次渲染都是新函数！
    return <div>child</div>;
  }
  return <ChildComponent />;
}

// ✅ 组件定义在外部
function ChildComponent() {
  return <div>child</div>;
}
function GoodParent() {
  return <ChildComponent />;
}

// ❌ Props 总是新对象引用
function BadProps() {
  return (
    <MemoizedComponent
      style={{ color: 'red' }}  // 每次渲染新对象
      onClick={() => {}}         // 每次渲染新函数
    />
  );
}

// ✅ 稳定的引用
const style = { color: 'red' };
function GoodProps() {
  const handleClick = useCallback(() => {}, []);
  return <MemoizedComponent style={style} onClick={handleClick} />;
}
```

---

## 错误边界与 Suspense

```tsx
// ❌ 没有错误边界
function BadApp() {
  return (
    <Suspense fallback={<Loading />}>
      <DataComponent />  {/* 错误会导致整个应用崩溃 */}
    </Suspense>
  );
}

// ✅ Error Boundary 包裹 Suspense
function GoodApp() {
  return (
    <ErrorBoundary fallback={<ErrorUI />}>
      <Suspense fallback={<Loading />}>
        <DataComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

## 服务器组件（RSC）

```tsx
// ❌ 在 Server Component 中使用客户端特性
// app/page.tsx (Server Component by default)
function BadServerComponent() {
  const [count, setCount] = useState(0);  // Error! No hooks in RSC
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// ✅ 交互逻辑提取到 Client Component
// app/counter.tsx
'use client';
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// app/page.tsx (Server Component)
async function GoodServerComponent() {
  const data = await fetchData();  // 可以直接 await
  return (
    <div>
      <h1>{data.title}</h1>
      <Counter />  {/* 客户端组件 */}
    </div>
  );
}

// ❌ 'use client' 放置不当 — 整个树都变成客户端
// layout.tsx
'use client';  // 这会让所有子组件都成为客户端组件
export default function Layout({ children }) { ... }

// ✅ 只在需要交互的组件使用 'use client'
// 将客户端逻辑隔离到叶子组件
```

---

## React 19 Actions 与表单

React 19 引入了 Actions 系统和新的表单处理 Hooks，简化异步操作和乐观更新。

### useActionState

```tsx
// ❌ 传统方式：多个状态变量
function OldForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  const handleSubmit = async (formData: FormData) => {
    setIsPending(true);
    setError(null);
    try {
      const result = await submitForm(formData);
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsPending(false);
    }
  };
}

// ✅ React 19: useActionState 统一管理
import { useActionState } from 'react';

function NewForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState, formData: FormData) => {
      try {
        const result = await submitForm(formData);
        return { success: true, data: result };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },
    { success: false, data: null, error: null }
  );

  return (
    <form action={formAction}>
      <input name="email" />
      <button disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
    </form>
  );
}
```

### useFormStatus

```tsx
// ❌ Props 透传表单状态
function BadSubmitButton({ isSubmitting }) {
  return <button disabled={isSubmitting}>Submit</button>;
}

// ✅ useFormStatus 访问父 <form> 状态（无需 props）
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending, data, method, action } = useFormStatus();
  // 注意：必须在 <form> 内部的子组件中使用
  return (
    <button disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}

// ❌ useFormStatus 在 form 同级组件中调用——不工作
function BadForm() {
  const { pending } = useFormStatus();  // 这里无法获取状态！
  return (
    <form action={action}>
      <button disabled={pending}>Submit</button>
    </form>
  );
}

// ✅ useFormStatus 必须在 form 的子组件中
function GoodForm() {
  return (
    <form action={action}>
      <SubmitButton />  {/* useFormStatus 在这里面调用 */}
    </form>
  );
}
```

### useOptimistic

```tsx
// ❌ 等待服务器响应再更新 UI
function SlowLike({ postId, likes }) {
  const [likeCount, setLikeCount] = useState(likes);
  const [isPending, setIsPending] = useState(false);

  const handleLike = async () => {
    setIsPending(true);
    const newCount = await likePost(postId);  // 等待...
    setLikeCount(newCount);
    setIsPending(false);
  };
}

// ✅ useOptimistic 即时反馈，失败自动回滚
import { useOptimistic } from 'react';

function FastLike({ postId, likes }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (currentLikes, increment: number) => currentLikes + increment
  );

  const handleLike = async () => {
    addOptimisticLike(1);  // 立即更新 UI
    try {
      await likePost(postId);  // 后台同步
    } catch {
      // React 自动回滚到 likes 原值
    }
  };

  return <button onClick={handleLike}>{optimisticLikes} likes</button>;
}
```

### 服务器 Action（Next.js 15+）

```tsx
// ❌ 客户端调用 API
'use client';
function ClientForm() {
  const handleSubmit = async (formData: FormData) => {
    const res = await fetch('/api/submit', {
      method: 'POST',
      body: formData,
    });
    // ...
  };
}

// ✅ Server Action + useActionState
// actions.ts
'use server';
export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title');
  await db.posts.create({ title });
  revalidatePath('/posts');
  return { success: true };
}

// form.tsx
'use client';
import { createPost } from './actions';

function PostForm() {
  const [state, formAction, isPending] = useActionState(createPost, null);
  return (
    <form action={formAction}>
      <input name="title" />
      <SubmitButton />
    </form>
  );
}
```

---

## Suspense 与流式 SSR

Suspense 和 Streaming 是 React 18+ 的核心特性，在 2025 年的 Next.js 15 等框架中广泛使用。

### 基础 Suspense

```tsx
// ❌ 传统加载状态管理
function OldComponent() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData().then(setData).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Spinner />;
  return <DataView data={data} />;
}

// ✅ Suspense 声明式加载状态
function NewComponent() {
  return (
    <Suspense fallback={<Spinner />}>
      <DataView />  {/* 内部使用 use() 或支持 Suspense 的数据获取 */}
    </Suspense>
  );
}
```

### 多个独立 Suspense 边界

```tsx
// ❌ 单一边界——所有内容一起加载
function BadLayout() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Header />
      <MainContent />  {/* 慢 */}
      <Sidebar />      {/* 快 */}
    </Suspense>
  );
}

// ✅ 独立边界——各部分独立流式传输
function GoodLayout() {
  return (
    <>
      <Header />  {/* 立即显示 */}
      <div className="flex">
        <Suspense fallback={<ContentSkeleton />}>
          <MainContent />  {/* 独立加载 */}
        </Suspense>
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />      {/* 独立加载 */}
        </Suspense>
      </div>
    </>
  );
}
```

### Next.js 15 流式渲染

```tsx
// app/page.tsx - 自动 Streaming
export default async function Page() {
  // 这个 await 不会阻塞整个页面
  const data = await fetchSlowData();
  return <div>{data}</div>;
}

// app/loading.tsx - 自动 Suspense 边界
export default function Loading() {
  return <Skeleton />;
}
```

### use() 钩子（React 19）

```tsx
// ✅ 在组件中读取 Promise
import { use } from 'react';

function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);  // 自动触发 Suspense
  return (
    <ul>
      {comments.map(c => <li key={c.id}>{c.text}</li>)}
    </ul>
  );
}

// 父组件创建 Promise，子组件消费
function Post({ postId }) {
  const commentsPromise = fetchComments(postId);  // 不 await
  return (
    <article>
      <PostContent id={postId} />
      <Suspense fallback={<CommentsSkeleton />}>
        <Comments commentsPromise={commentsPromise} />
      </Suspense>
    </article>
  );
}
```

---

## TanStack Query v5（查询库）

TanStack Query 是 React 生态中最流行的数据获取库，v5 是当前稳定版本。

### 基础配置

```tsx
// ❌ 不正确的默认配置
const queryClient = new QueryClient();  // 默认配置可能不适合

// ✅ 生产环境推荐配置
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 分钟内数据视为新鲜
      gcTime: 1000 * 60 * 30,    // 30 分钟后垃圾回收（v5 重命名）
      retry: 3,
      refetchOnWindowFocus: false,  // 根据需求决定
    },
  },
});
```

### queryOptions（v5 新增）

```tsx
// ❌ 重复定义 queryKey 和 queryFn
function Component1() {
  const { data } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  });
}

function prefetchUser(queryClient, userId) {
  queryClient.prefetchQuery({
    queryKey: ['users', userId],  // 重复！
    queryFn: () => fetchUser(userId),  // 重复！
  });
}

// ✅ queryOptions 统一定义，类型安全
import { queryOptions } from '@tanstack/react-query';

const userQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
  });

function Component1({ userId }) {
  const { data } = useQuery(userQueryOptions(userId));
}

function prefetchUser(queryClient, userId) {
  queryClient.prefetchQuery(userQueryOptions(userId));
}

// getQueryData 也是类型安全的
const user = queryClient.getQueryData(userQueryOptions(userId).queryKey);
```

### 常见陷阱

```tsx
// ❌ staleTime 为 0 导致过度请求
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  // staleTime 默认为 0，每次组件挂载都会 refetch
});

// ✅ 设置合理的 staleTime
useQuery({
  queryKey: ['data'],
  queryFn: fetchData,
  staleTime: 1000 * 60,  // 1 分钟内不会重新请求
});

// ❌ 在 queryFn 中使用不稳定的引用
function BadQuery({ filters }) {
  useQuery({
    queryKey: ['items'],  // queryKey 没有包含 filters！
    queryFn: () => fetchItems(filters),  // filters 变化不会触发重新请求
  });
}

// ✅ queryKey 包含所有影响数据的参数
function GoodQuery({ filters }) {
  useQuery({
    queryKey: ['items', filters],  // filters 是 queryKey 的一部分
    queryFn: () => fetchItems(filters),
  });
}
```

### useSuspenseQuery

> **重要限制**：useSuspenseQuery 与 useQuery 有显著差异，选择前需了解其限制。

#### useSuspenseQuery 的限制

| 特性 | useQuery | useSuspenseQuery |
|------|----------|------------------|
| `enabled` 选项 | ✅ 支持 | ❌ 不支持 |
| `placeholderData` | ✅ 支持 | ❌ 不支持 |
| `data` 类型 | `T \| undefined` | `T`（保证有值）|
| 错误处理 | `error` 属性 | 抛出到 Error Boundary |
| 加载状态 | `isLoading` 属性 | 挂起到 Suspense |

#### 不支持 enabled 的替代方案

```tsx
// ❌ 使用 useQuery + enabled 实现条件查询
function BadSuspenseQuery({ userId }) {
  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId,  // useSuspenseQuery 不支持 enabled！
  });
}

// ✅ 组件组合实现条件渲染
function GoodSuspenseQuery({ userId }) {
  // useSuspenseQuery 保证 data 是 T 不是 T | undefined
  const { data } = useSuspenseQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
  });
  return <UserProfile user={data} />;
}

function Parent({ userId }) {
  if (!userId) return <NoUserSelected />;
  return (
    <Suspense fallback={<UserSkeleton />}>
      <GoodSuspenseQuery userId={userId} />
    </Suspense>
  );
}
```

#### 错误处理差异

```tsx
// ❌ useSuspenseQuery 没有 error 属性
function BadErrorHandling() {
  const { data, error } = useSuspenseQuery({...});
  if (error) return <Error />;  // error 总是 null！
}

// ✅ 使用 Error Boundary 处理错误
function GoodErrorHandling() {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<Loading />}>
        <DataComponent />
      </Suspense>
    </ErrorBoundary>
  );
}

function DataComponent() {
  // 错误会抛出到 Error Boundary
  const { data } = useSuspenseQuery({
    queryKey: ['data'],
    queryFn: fetchData,
  });
  return <Display data={data} />;
}
```

#### 何时选择 useSuspenseQuery

```tsx
// ✅ 适合场景：
// 1. 数据总是需要的（无条件查询）
// 2. 组件必须有数据才能渲染
// 3. 使用 React 19 的 Suspense 模式
// 4. 服务端组件 + 客户端 hydration

// ❌ 不适合场景：
// 1. 条件查询（根据用户操作触发）
// 2. 需要 placeholderData 或初始数据
// 3. 需要在组件内处理 loading/error 状态
// 4. 多个查询有依赖关系

// ✅ 多个独立查询用 useSuspenseQueries
function MultipleQueries({ userId }) {
  const [userQuery, postsQuery] = useSuspenseQueries({
    queries: [
      { queryKey: ['user', userId], queryFn: () => fetchUser(userId) },
      { queryKey: ['posts', userId], queryFn: () => fetchPosts(userId) },
    ],
  });
  // 两个查询并行执行，都完成后组件渲染
  return <Profile user={userQuery.data} posts={postsQuery.data} />;
}
```

### 乐观更新 (v5 简化)

```tsx
// ❌ 手动管理缓存的乐观更新（复杂）
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previousTodos = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);
    return { previousTodos };
  },
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos);
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});

// ✅ v5 简化：使用 variables 进行乐观 UI
function TodoList() {
  const { data: todos } = useQuery(todosQueryOptions);
  const { mutate, variables, isPending } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  return (
    <ul>
      {todos?.map(todo => <TodoItem key={todo.id} todo={todo} />)}
      {/* 乐观显示正在添加的 todo */}
      {isPending && <TodoItem todo={variables} isOptimistic />}
    </ul>
  );
}
```

### v5 状态字段变化

```tsx
// v4: isLoading 表示首次加载或后续获取
// v5: isPending 表示没有数据，isLoading = isPending && isFetching

const { data, isPending, isFetching, isLoading } = useQuery({...});

// isPending: 缓存中没有数据（首次加载）
// isFetching: 正在请求中（包括后台刷新）
// isLoading: isPending && isFetching（首次加载中）

// ❌ v4 代码直接迁移
if (isLoading) return <Spinner />;  // v5 中行为可能不同

// ✅ 明确意图
if (isPending) return <Spinner />;  // 没有数据时显示加载
// 或
if (isLoading) return <Spinner />;  // 首次加载中
```

---

## 审查检查清单

### 钩子（Hooks）规则

- [ ] 钩子在组件/自定义 Hook 顶层调用
- [ ] 没有条件/循环中调用钩子
- [ ] useEffect 依赖数组完整
- [ ] useEffect 有清理函数（订阅/定时器/请求）
- [ ] 没有用 useEffect 计算派生状态

### 性能优化（适度原则）

- [ ] useMemo/useCallback 只用于真正需要的场景
- [ ] React.memo 配合稳定的 props 引用
- [ ] 没有在组件内定义子组件
- [ ] 没有在 JSX 中创建新对象/函数（除非传给非 memo 组件）
- [ ] 长列表使用虚拟化（react-window/react-virtual）

### 组件设计

- [ ] 组件职责单一，不超过 200 行
- [ ] 逻辑与展示分离（Custom Hooks）
- [ ] Props 接口清晰，使用 TypeScript
- [ ] 避免 Props Drilling（考虑 Context 或组合）

### 状态管理

- [ ] 状态就近原则（最小必要范围）
- [ ] 复杂状态用 useReducer
- [ ] 全局状态用 Context 或状态库
- [ ] 避免不必要的状态（派生 > 存储）

### 错误处理

- [ ] 关键区域有 Error Boundary
- [ ] Suspense 配合 Error Boundary 使用
- [ ] 异步操作有错误处理

### 服务器组件（RSC）

- [ ] 'use client' 只用于需要交互的组件
- [ ] Server Component 不使用 Hooks/事件处理
- [ ] 客户端组件尽量放在叶子节点
- [ ] 数据获取在 Server Component 中进行

### React 19 表单

- [ ] 使用 useActionState 替代多个 useState
- [ ] useFormStatus 在 form 子组件中调用
- [ ] useOptimistic 不用于关键业务（支付等）
- [ ] Server Action 正确标记 'use server'

### Suspense 与流式渲染

- [ ] 按用户体验需求划分 Suspense 边界
- [ ] 每个 Suspense 有对应的 Error Boundary
- [ ] 提供有意义的 fallback（骨架屏 > Spinner）
- [ ] 避免在 layout 层级 await 慢数据

### TanStack Query

- [ ] queryKey 包含所有影响数据的参数
- [ ] 设置合理的 staleTime（不是默认 0）
- [ ] useSuspenseQuery 不使用 enabled
- [ ] Mutation 成功后 invalidate 相关查询
- [ ] 理解 isPending vs isLoading 区别

### 测试

- [ ] 使用 @testing-library/react
- [ ] 用 screen 查询元素
- [ ] 用 userEvent 代替 fireEvent
- [ ] 优先使用 *ByRole 查询
- [ ] 测试行为而非实现细节
