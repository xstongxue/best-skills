# TypeScript/JavaScript 代码审查指南

> TypeScript 代码审查指南，覆盖类型系统、泛型、条件类型、严格模式、async/await 模式等核心主题。

## 目录

- [类型安全基础](#类型安全基础)
- [泛型模式](#泛型模式)
- [高级类型](#高级类型)
- [严格模式配置](#严格模式配置)
- [异步处理](#异步处理)
- [不可变性](#不可变性)
- [ESLint 规则](#eslint-规则)
- [审查检查清单](#审查检查清单)

---

## 类型安全基础

### 避免使用任意类型（any）

```typescript
// ❌ Using any defeats type safety
function processData(data: any) {
  return data.value;  // 无类型检查，运行时可能崩溃
}

// ✅ Use proper types
interface DataPayload {
  value: string;
}
function processData(data: DataPayload) {
  return data.value;
}

// ✅ 未知类型用 unknown + 类型守卫
function processUnknown(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Invalid data');
}
```

### 类型收窄

```typescript
// ❌ 不安全的类型断言
function getLength(value: string | string[]) {
  return (value as string[]).length;  // 如果是 string 会出错
}

// ✅ 使用类型守卫
function getLength(value: string | string[]): number {
  if (Array.isArray(value)) {
    return value.length;
  }
  return value.length;
}

// ✅ 使用 in 操作符
interface Dog { bark(): void }
interface Cat { meow(): void }

function speak(animal: Dog | Cat) {
  if ('bark' in animal) {
    animal.bark();
  } else {
    animal.meow();
  }
}
```

### 字面量类型与 as const

```typescript
// ❌ 类型过于宽泛
const config = {
  endpoint: '/api',
  method: 'GET'  // 类型是 string
};

// ✅ 使用 as const 获得字面量类型
const config = {
  endpoint: '/api',
  method: 'GET'
} as const;  // method 类型是 'GET'

// ✅ 用于函数参数
function request(method: 'GET' | 'POST', url: string) { ... }
request(config.method, config.endpoint);  // 正确！
```

---

## 泛型模式

### 基础泛型

```typescript
// ❌ 重复代码
function getFirstString(arr: string[]): string | undefined {
  return arr[0];
}
function getFirstNumber(arr: number[]): number | undefined {
  return arr[0];
}

// ✅ 使用泛型
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

### 泛型约束

```typescript
// ❌ 泛型没有约束，无法访问属性
function getProperty<T>(obj: T, key: string) {
  return obj[key];  // Error: 无法索引
}

// ✅ 使用 keyof 约束
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Alice', age: 30 };
getProperty(user, 'name');  // 返回类型是 string
getProperty(user, 'age');   // 返回类型是 number
getProperty(user, 'foo');   // Error: 'foo' 不在 keyof User
```

### 泛型默认值

```typescript
// ✅ 提供合理的默认类型
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  message: string;
}

// 可以不指定泛型参数
const response: ApiResponse = { data: null, status: 200, message: 'OK' };
// 也可以指定
const userResponse: ApiResponse<User> = { ... };
```

### 常见泛型工具类型

```typescript
// ✅ 善用内置工具类型
interface User {
  id: number;
  name: string;
  email: string;
}

type PartialUser = Partial<User>;         // 所有属性可选
type RequiredUser = Required<User>;       // 所有属性必需
type ReadonlyUser = Readonly<User>;       // 所有属性只读
type UserKeys = keyof User;               // 'id' | 'name' | 'email'
type NameOnly = Pick<User, 'name'>;       // { name: string }
type WithoutId = Omit<User, 'id'>;        // { name: string; email: string }
type UserRecord = Record<string, User>;   // { [key: string]: User }
```

---

## 高级类型

### 条件类型

```typescript
// ✅ 根据输入类型返回不同类型
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// ✅ 提取数组元素类型
type ElementType<T> = T extends (infer U)[] ? U : never;

type Elem = ElementType<string[]>;  // string

// ✅ 提取函数返回类型（内置 ReturnType）
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

### 映射类型

```typescript
// ✅ 转换对象类型的所有属性
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface User {
  name: string;
  age: number;
}

type NullableUser = Nullable<User>;
// { name: string | null; age: number | null }

// ✅ 添加前缀
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }
```

### 模板字面量类型

```typescript
// ✅ 类型安全的事件名称
type EventName = 'click' | 'focus' | 'blur';
type HandlerName = `on${Capitalize<EventName>}`;
// 'onClick' | 'onFocus' | 'onBlur'

// ✅ API 路由类型
type ApiRoute = `/api/${string}`;
const route: ApiRoute = '/api/users';  // OK
const badRoute: ApiRoute = '/users';   // Error
```

### 判别联合类型

```typescript
// ✅ 使用判别属性实现类型安全
type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

function handleResult(result: Result<User, Error>) {
  if (result.success) {
    console.log(result.data.name);  // TypeScript 知道 data 存在
  } else {
    console.log(result.error.message);  // TypeScript 知道 error 存在
  }
}

// ✅ Redux Action 模式
type Action =
  | { type: 'INCREMENT'; payload: number }
  | { type: 'DECREMENT'; payload: number }
  | { type: 'RESET' };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'INCREMENT':
      return state + action.payload;  // payload 类型已知
    case 'DECREMENT':
      return state - action.payload;
    case 'RESET':
      return 0;  // 这里没有 payload
  }
}
```

---

## 严格模式配置

### 推荐的 tsconfig.json

```json
{
  "compilerOptions": {
    // ✅ 必须开启的 strict 选项
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "useUnknownInCatchVariables": true,

    // ✅ 额外推荐选项
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "noPropertyAccessFromIndexSignature": true
  }
}
```

### noUncheckedIndexedAccess 的影响

```typescript
// tsconfig: "noUncheckedIndexedAccess": true

const arr = [1, 2, 3];
const first = arr[0];  // 类型是 number | undefined

// ❌ 直接使用可能出错
console.log(first.toFixed(2));  // Error: 可能是 undefined

// ✅ 先检查
if (first !== undefined) {
  console.log(first.toFixed(2));
}

// ✅ 或使用非空断言（确定时）
console.log(arr[0]!.toFixed(2));
```

---

## 异步处理

### Promise 异常处理

```typescript
// ❌ Not handling async errors
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`);
  return response.json();  // 网络错误未处理
}

// ✅ Handle errors properly
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
    throw error;
  }
}
```

### Promise.all 与 Promise.allSettled

```typescript
// ❌ Promise.all 一个失败全部失败
async function fetchAllUsers(ids: string[]) {
  const users = await Promise.all(ids.map(fetchUser));
  return users;  // 一个失败就全部失败
}

// ✅ Promise.allSettled 获取所有结果
async function fetchAllUsers(ids: string[]) {
  const results = await Promise.allSettled(ids.map(fetchUser));

  const users: User[] = [];
  const errors: Error[] = [];

  for (const result of results) {
    if (result.status === 'fulfilled') {
      users.push(result.value);
    } else {
      errors.push(result.reason);
    }
  }

  return { users, errors };
}
```

### 竞态条件处理

```typescript
// ❌ 竞态条件：旧请求可能覆盖新请求
function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`/api/search?q=${query}`)
      .then(r => r.json())
      .then(setResults);  // 旧请求可能后返回！
  }, [query]);
}

// ✅ 使用 AbortController
function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/search?q=${query}`, { signal: controller.signal })
      .then(r => r.json())
      .then(setResults)
      .catch(e => {
        if (e.name !== 'AbortError') throw e;
      });

    return () => controller.abort();
  }, [query]);
}
```

---

## 不可变性

### Readonly 与只读数组（ReadonlyArray）

```typescript
// ❌ 可变参数可能被意外修改
function processUsers(users: User[]) {
  users.sort((a, b) => a.name.localeCompare(b.name));  // 修改了原数组！
  return users;
}

// ✅ 使用 readonly 防止修改
function processUsers(users: readonly User[]): User[] {
  return [...users].sort((a, b) => a.name.localeCompare(b.name));
}

// ✅ 深度只读
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
```

### 不变式函数参数

```typescript
// ✅ 使用 as const 和 readonly 保护数据
function createConfig<T extends readonly string[]>(routes: T) {
  return routes;
}

const routes = createConfig(['home', 'about', 'contact'] as const);
// 类型是 readonly ['home', 'about', 'contact']
```

---

## ESLint 规则

### 推荐的 @typescript-eslint 规则

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/strict'
  ],
  rules: {
    // ✅ 类型安全
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',

    // ✅ 最佳实践
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-misused-promises': 'error',

    // ✅ 代码风格
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error'
  }
};
```

### 常见 ESLint 错误修复

```typescript
// ❌ no-floating-promises: Promise 必须被处理
async function save() { ... }
save();  // Error: 未处理的 Promise

// ✅ 显式处理
await save();
// 或
save().catch(console.error);
// 或明确忽略
void save();

// ❌ no-misused-promises: 不能在非 async 位置使用 Promise
const items = [1, 2, 3];
items.forEach(async (item) => {  // Error!
  await processItem(item);
});

// ✅ 使用 for...of
for (const item of items) {
  await processItem(item);
}
// 或 Promise.all
await Promise.all(items.map(processItem));
```

---

## 审查检查清单

### 类型系统
- [ ] 没有使用 `any`（使用 `unknown` + 类型守卫代替）
- [ ] 接口和类型定义完整且有意义的命名
- [ ] 使用泛型提高代码复用性
- [ ] 联合类型有正确的类型收窄
- [ ] 善用工具类型（Partial、Pick、Omit 等）

### 泛型
- [ ] 泛型有适当的约束（extends）
- [ ] 泛型参数有合理的默认值
- [ ] 避免过度泛型化（KISS 原则）

### 严格模式
- [ ] tsconfig.json 启用了 `strict: true`
- [ ] 启用了 noUncheckedIndexedAccess
- [ ] 没有使用 @ts-ignore（改用 @ts-expect-error）

### 异步代码
- [ ] async 函数有错误处理
- [ ] `Promise` rejection 被正确处理
- [ ] 没有 floating promises（未处理的 Promise）
- [ ] 并发请求使用 Promise.all 或 Promise.allSettled
- [ ] 竞态条件使用 AbortController 处理

### 不可变性
- [ ] 不直接修改函数参数
- [ ] 使用 spread 操作符创建新对象/数组
- [ ] 考虑使用 readonly 修饰符

### ESLint
- [ ] 使用 @typescript-eslint/recommended
- [ ] 没有 ESLint 警告或错误
- [ ] 使用 consistent-type-imports
