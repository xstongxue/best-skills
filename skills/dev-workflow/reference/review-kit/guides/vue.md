# Vue 3 代码审查指南

> Vue 3 Composition API 代码审查指南，覆盖响应性系统、Props/Emits、Watchers、Composables、Vue 3.5 新特性等核心主题。

## 目录

- [响应性系统](#响应性系统)
- [Props 与 Emits](#props-与-emits)
- [Vue 3.5 新特性](#vue-35-新特性)
- [观察器（Watchers）](#观察器watchers)
- [模板最佳实践](#模板最佳实践)
- [组合式函数（Composables）](#组合式函数composables)
- [性能优化](#性能优化)
- [审查检查清单](#审查检查清单)

---

## 响应性系统

### 响应式引用（ref）与响应式对象（reactive）选择

```vue
<!-- ✅ 基本类型用 ref -->
<script setup lang="ts">
const count = ref(0)
const name = ref('Vue')

// ref 需要 .value 访问
count.value++
</script>

<!-- ✅ 对象/数组用 reactive（可选）-->
<script setup lang="ts">
const state = reactive({
  user: null,
  loading: false,
  error: null
})

// reactive 直接访问
state.loading = true
</script>

<!-- 💡 现代最佳实践：全部使用 ref，保持一致性 -->
<script setup lang="ts">
const user = ref<User | null>(null)
const loading = ref(false)
const error = ref<Error | null>(null)
</script>
```

### 解构 reactive 对象

```vue
<!-- ❌ 解构 reactive 会丢失响应性 -->
<script setup lang="ts">
const state = reactive({ count: 0, name: 'Vue' })
const { count, name } = state  // 丢失响应性！
</script>

<!-- ✅ 使用 toRefs 保持响应性 -->
<script setup lang="ts">
const state = reactive({ count: 0, name: 'Vue' })
const { count, name } = toRefs(state)  // 保持响应性
// 或者直接使用 ref
const count = ref(0)
const name = ref('Vue')
</script>
```

### 计算属性（computed）副作用

```vue
<!-- ❌ computed 中产生副作用 -->
<script setup lang="ts">
const fullName = computed(() => {
  console.log('Computing...')  // 副作用！
  otherRef.value = 'changed'   // 修改其他状态！
  return `${firstName.value} ${lastName.value}`
})
</script>

<!-- ✅ computed 只用于派生状态 -->
<script setup lang="ts">
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})
// 副作用放在 watch 或事件处理中
watch(fullName, (name) => {
  console.log('Name changed:', name)
})
</script>
```

### 浅层响应引用（shallowRef）优化

```vue
<!-- ❌ 大型对象使用 ref 会深度转换 -->
<script setup lang="ts">
const largeData = ref(hugeNestedObject)  // 深度响应式，性能开销大
</script>

<!-- ✅ 使用 shallowRef 避免深度转换 -->
<script setup lang="ts">
const largeData = shallowRef(hugeNestedObject)

// 整体替换才会触发更新
function updateData(newData) {
  largeData.value = newData  // ✅ 触发更新
}

// ❌ 修改嵌套属性不会触发更新
// largeData.value.nested.prop = 'new'

// 需要手动触发时使用 triggerRef
import { triggerRef } from 'vue'
largeData.value.nested.prop = 'new'
triggerRef(largeData)
</script>
```

---

## Props 与 Emits

### 直接修改 props

```vue
<!-- ❌ 直接修改 props -->
<script setup lang="ts">
const props = defineProps<{ user: User }>()
props.user.name = 'New Name'  // 永远不要直接修改 props！
</script>

<!-- ✅ 使用 emit 通知父组件更新 -->
<script setup lang="ts">
const props = defineProps<{ user: User }>()
const emit = defineEmits<{
  update: [name: string]
}>()
const updateName = (name: string) => emit('update', name)
</script>
```

### defineProps 类型声明

```vue
<!-- ❌ defineProps 缺少类型声明 -->
<script setup lang="ts">
const props = defineProps(['title', 'count'])  // 无类型检查
</script>

<!-- ✅ 使用类型声明 + withDefaults -->
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  items?: string[]
}
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  items: () => []  // 对象/数组默认值需要工厂函数
})
</script>
```

### defineEmits 类型安全

```vue
<!-- ❌ defineEmits 缺少类型 -->
<script setup lang="ts">
const emit = defineEmits(['update', 'delete'])  // 无类型检查
emit('update', someValue)  // 参数类型不安全
</script>

<!-- ✅ 完整的类型定义 -->
<script setup lang="ts">
const emit = defineEmits<{
  update: [id: number, value: string]
  delete: [id: number]
  'custom-event': [payload: CustomPayload]
}>()

// 现在有完整的类型检查
emit('update', 1, 'new value')  // ✅
emit('update', 'wrong')  // ❌ TypeScript 报错
</script>
```

---

## Vue 3.5 新特性

### Reactive Props Destructure (3.5+)

```vue
<!-- Vue 3.5 之前：解构会丢失响应性 -->
<script setup lang="ts">
const props = defineProps<{ count: number }>()
// 需要使用 props.count 或 toRefs
</script>

<!-- ✅ Vue 3.5+：解构保持响应性 -->
<script setup lang="ts">
const { count, name = 'default' } = defineProps<{
  count: number
  name?: string
}>()

// count 和 name 自动保持响应性！
// 可以直接在模板和 watch 中使用
watch(() => count, (newCount) => {
  console.log('Count changed:', newCount)
})
</script>

<!-- ✅ 配合默认值使用 -->
<script setup lang="ts">
const {
  title,
  count = 0,
  items = () => []  // 函数作为默认值（对象/数组）
} = defineProps<{
  title: string
  count?: number
  items?: () => string[]
}>()
</script>
```

### defineModel (3.4+)

```vue
<!-- ❌ 传统 v-model 实现：冗长 -->
<script setup lang="ts">
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

// 需要 computed 来双向绑定
const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

<!-- ✅ defineModel：简洁的 v-model 实现 -->
<script setup lang="ts">
// 自动处理 props 和 emit
const model = defineModel<string>()

// 直接使用
model.value = 'new value'  // 自动 emit
</script>
<template>
  <input v-model="model" />
</template>

<!-- ✅ 命名 v-model -->
<script setup lang="ts">
// v-model:title 的实现
const title = defineModel<string>('title')

// 带默认值和选项
const count = defineModel<number>('count', {
  default: 0,
  required: false
})
</script>

<!-- ✅ 多个 v-model -->
<script setup lang="ts">
const firstName = defineModel<string>('firstName')
const lastName = defineModel<string>('lastName')
</script>
<template>
  <!-- 父组件使用：<MyInput v-model:first-name="first" v-model:last-name="last" /> -->
</template>

<!-- ✅ v-model 修饰符 -->
<script setup lang="ts">
const [model, modifiers] = defineModel<string>()

// 检查修饰符
if (modifiers.capitalize) {
  // 处理 .capitalize 修饰符
}
</script>
```

### useTemplateRef (3.5+)

```vue
<!-- 传统方式：ref 属性与变量同名 -->
<script setup lang="ts">
const inputRef = ref<HTMLInputElement | null>(null)
</script>
<template>
  <input ref="inputRef" />
</template>

<!-- ✅ useTemplateRef：更清晰的模板引用 -->
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const input = useTemplateRef<HTMLInputElement>('my-input')

onMounted(() => {
  input.value?.focus()
})
</script>
<template>
  <input ref="my-input" />
</template>

<!-- ✅ 动态 ref -->
<script setup lang="ts">
const refKey = ref('input-a')
const dynamicInput = useTemplateRef<HTMLInputElement>(refKey)
</script>
```

### useId (3.5+)

```vue
<!-- ❌ 手动生成 ID 可能冲突 -->
<script setup lang="ts">
const id = `input-${Math.random()}`  // SSR 不一致！
</script>

<!-- ✅ useId：SSR 安全的唯一 ID -->
<script setup lang="ts">
import { useId } from 'vue'

const id = useId()  // 例如：'v-0'
</script>
<template>
  <label :for="id">Name</label>
  <input :id="id" />
</template>

<!-- ✅ 表单组件中使用 -->
<script setup lang="ts">
const inputId = useId()
const errorId = useId()
</script>
<template>
  <label :for="inputId">Email</label>
  <input
    :id="inputId"
    :aria-describedby="errorId"
  />
  <span :id="errorId" class="error">{{ error }}</span>
</template>
```

### onWatcherCleanup (3.5+)

```vue
<!-- 传统方式：watch 第三个参数 -->
<script setup lang="ts">
watch(source, async (value, oldValue, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())
  // ...
})
</script>

<!-- ✅ onWatcherCleanup：更灵活的清理 -->
<script setup lang="ts">
import { onWatcherCleanup } from 'vue'

watch(source, async (value) => {
  const controller = new AbortController()
  onWatcherCleanup(() => controller.abort())

  // 可以在任意位置调用，不限于回调开头
  if (someCondition) {
    const anotherResource = createResource()
    onWatcherCleanup(() => anotherResource.dispose())
  }

  await fetchData(value, controller.signal)
})
</script>
```

### Deferred Teleport (3.5+)

```vue
<!-- ❌ Teleport 目标必须在挂载时存在 -->
<template>
  <Teleport to="#modal-container">
    <!-- 如果 #modal-container 不存在会报错 -->
  </Teleport>
</template>

<!-- ✅ defer 属性延迟挂载 -->
<template>
  <Teleport to="#modal-container" defer>
    <!-- 等待目标元素存在后再挂载 -->
    <Modal />
  </Teleport>
</template>
```

---

## 观察器（Watchers）

### watch 与 watchEffect

```vue
<script setup lang="ts">
// ✅ watch：明确指定依赖，惰性执行
watch(
  () => props.userId,
  async (userId) => {
    user.value = await fetchUser(userId)
  }
)

// ✅ watchEffect：自动收集依赖，立即执行
watchEffect(async () => {
  // 自动追踪 props.userId
  user.value = await fetchUser(props.userId)
})

// 💡 选择指南：
// - 需要旧值？用 watch
// - 需要惰性执行？用 watch
// - 依赖复杂？用 watchEffect
</script>
```

### watch 清理函数

```vue
<!-- ❌ watch 缺少清理函数，可能内存泄漏 -->
<script setup lang="ts">
watch(searchQuery, async (query) => {
  const controller = new AbortController()
  const data = await fetch(`/api/search?q=${query}`, {
    signal: controller.signal
  })
  results.value = await data.json()
  // 如果 query 快速变化，旧请求不会被取消！
})
</script>

<!-- ✅ 使用 onCleanup 清理副作用 -->
<script setup lang="ts">
watch(searchQuery, async (query, _, onCleanup) => {
  const controller = new AbortController()
  onCleanup(() => controller.abort())  // 取消旧请求

  try {
    const data = await fetch(`/api/search?q=${query}`, {
      signal: controller.signal
    })
    results.value = await data.json()
  } catch (e) {
    if (e.name !== 'AbortError') throw e
  }
})
</script>
```

### watch 选项

```vue
<script setup lang="ts">
// ✅ immediate：立即执行一次
watch(
  userId,
  async (id) => {
    user.value = await fetchUser(id)
  },
  { immediate: true }
)

// ✅ deep：深度监听（性能开销大，谨慎使用）
watch(
  state,
  (newState) => {
    console.log('State changed deeply')
  },
  { deep: true }
)

// ✅ flush: 'post'：DOM 更新后执行
watch(
  source,
  () => {
    // 可以安全访问更新后的 DOM
    // nextTick 不再需要
  },
  { flush: 'post' }
)

// ✅ once: true (Vue 3.4+)：只执行一次
watch(
  source,
  (value) => {
    console.log('只会执行一次:', value)
  },
  { once: true }
)
</script>
```

### 监听多个源

```vue
<script setup lang="ts">
// ✅ 监听多个 ref
watch(
  [firstName, lastName],
  ([newFirst, newLast], [oldFirst, oldLast]) => {
    console.log(`Name changed from ${oldFirst} ${oldLast} to ${newFirst} ${newLast}`)
  }
)

// ✅ 监听 reactive 对象的特定属性
watch(
  () => [state.count, state.name],
  ([count, name]) => {
    console.log(`count: ${count}, name: ${name}`)
  }
)
</script>
```

---

## 模板最佳实践

### v-for 的 key

```vue
<!-- ❌ v-for 中使用 index 作为 key -->
<template>
  <li v-for="(item, index) in items" :key="index">
    {{ item.name }}
  </li>
</template>

<!-- ✅ 使用唯一标识作为 key -->
<template>
  <li v-for="item in items" :key="item.id">
    {{ item.name }}
  </li>
</template>

<!-- ✅ 复合 key（当没有唯一 ID 时）-->
<template>
  <li v-for="(item, index) in items" :key="`${item.name}-${item.type}-${index}`">
    {{ item.name }}
  </li>
</template>
```

### v-if 和 v-for 优先级

```vue
<!-- ❌ v-if 和 v-for 同时使用 -->
<template>
  <li v-for="user in users" v-if="user.active" :key="user.id">
    {{ user.name }}
  </li>
</template>

<!-- ✅ 使用 computed 过滤 -->
<script setup lang="ts">
const activeUsers = computed(() =>
  users.value.filter(user => user.active)
)
</script>
<template>
  <li v-for="user in activeUsers" :key="user.id">
    {{ user.name }}
  </li>
</template>

<!-- ✅ 或用 template 包裹 -->
<template>
  <template v-for="user in users" :key="user.id">
    <li v-if="user.active">
      {{ user.name }}
    </li>
  </template>
</template>
```

### 事件处理

```vue
<!-- ❌ 内联复杂逻辑 -->
<template>
  <button @click="items = items.filter(i => i.id !== item.id); count--">
    Delete
  </button>
</template>

<!-- ✅ 使用方法 -->
<script setup lang="ts">
const deleteItem = (id: number) => {
  items.value = items.value.filter(i => i.id !== id)
  count.value--
}
</script>
<template>
  <button @click="deleteItem(item.id)">Delete</button>
</template>

<!-- ✅ 事件修饰符 -->
<template>
  <!-- 阻止默认行为 -->
  <form @submit.prevent="handleSubmit">...</form>

  <!-- 阻止冒泡 -->
  <button @click.stop="handleClick">...</button>

  <!-- 只执行一次 -->
  <button @click.once="handleOnce">...</button>

  <!-- 键盘修饰符 -->
  <input @keyup.enter="submit" @keyup.esc="cancel" />
</template>
```

---

## 组合式函数（Composables）

### 组合式函数（Composable）设计原则

```typescript
// ✅ 好的 composable 设计
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue

  // 返回响应式引用和方法
  return {
    count: readonly(count),  // 只读防止外部修改
    increment,
    decrement,
    reset
  }
}

// ❌ 不要返回 .value
export function useBadCounter() {
  const count = ref(0)
  return {
    count: count.value  // ❌ 丢失响应性！
  }
}
```

### Props 传递给 composable

```vue
<!-- ❌ 传递 props 到 composable 丢失响应性 -->
<script setup lang="ts">
const props = defineProps<{ userId: string }>()
const { user } = useUser(props.userId)  // 丢失响应性！
</script>

<!-- ✅ 使用 toRef 或 computed 保持响应性 -->
<script setup lang="ts">
const props = defineProps<{ userId: string }>()
const userIdRef = toRef(props, 'userId')
const { user } = useUser(userIdRef)  // 保持响应性
// 或使用 computed
const { user } = useUser(computed(() => props.userId))

// ✅ Vue 3.5+：直接解构使用
const { userId } = defineProps<{ userId: string }>()
const { user } = useUser(() => userId)  // getter 函数
</script>
```

### 异步组合式函数（Composable）

```typescript
// ✅ 异步 composable 模式
export function useFetch<T>(url: MaybeRefOrGetter<string>) {
  const data = ref<T | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)

  const execute = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(toValue(url))
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      data.value = await response.json()
    } catch (e) {
      error.value = e as Error
    } finally {
      loading.value = false
    }
  }

  // 响应式 URL 时自动重新获取
  watchEffect(() => {
    toValue(url)  // 追踪依赖
    execute()
  })

  return {
    data: readonly(data),
    error: readonly(error),
    loading: readonly(loading),
    refetch: execute
  }
}

// 使用
const { data, loading, error, refetch } = useFetch<User[]>('/api/users')
```

### 生命周期与清理

```typescript
// ✅ Composable 中正确处理生命周期
export function useEventListener(
  target: MaybeRefOrGetter<EventTarget>,
  event: string,
  handler: EventListener
) {
  // 组件挂载后添加
  onMounted(() => {
    toValue(target).addEventListener(event, handler)
  })

  // 组件卸载时移除
  onUnmounted(() => {
    toValue(target).removeEventListener(event, handler)
  })
}

// ✅ 使用 effectScope 管理副作用
export function useFeature() {
  const scope = effectScope()

  scope.run(() => {
    // 所有响应式效果都在这个 scope 内
    const state = ref(0)
    watch(state, () => { /* ... */ })
    watchEffect(() => { /* ... */ })
  })

  // 清理所有效果
  onUnmounted(() => scope.stop())

  return { /* ... */ }
}
```

---

## 性能优化

### v-memo

```vue
<!-- ✅ v-memo：缓存子树，避免重复渲染 -->
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.id === selected]">
    <!-- 只有当 item.id === selected 变化时才重新渲染 -->
    <ExpensiveComponent :item="item" :selected="item.id === selected" />
  </div>
</template>

<!-- ✅ 配合 v-for 使用 -->
<template>
  <div
    v-for="item in list"
    :key="item.id"
    v-memo="[item.name, item.status]"
  >
    <!-- 只有 name 或 status 变化时重新渲染 -->
  </div>
</template>
```

### defineAsyncComponent

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// ✅ 懒加载组件
const HeavyChart = defineAsyncComponent(() =>
  import('./components/HeavyChart.vue')
)

// ✅ 带加载和错误状态
const AsyncModal = defineAsyncComponent({
  loader: () => import('./components/Modal.vue'),
  loadingComponent: LoadingSpinner,
  errorComponent: ErrorDisplay,
  delay: 200,  // 延迟显示 loading（避免闪烁）
  timeout: 3000  // 超时时间
})
</script>
```

### KeepAlive

```vue
<template>
  <!-- ✅ 缓存动态组件 -->
  <KeepAlive>
    <component :is="currentTab" />
  </KeepAlive>

  <!-- ✅ 指定缓存的组件 -->
  <KeepAlive include="TabA,TabB">
    <component :is="currentTab" />
  </KeepAlive>

  <!-- ✅ 限制缓存数量 -->
  <KeepAlive :max="10">
    <component :is="currentTab" />
  </KeepAlive>
</template>

<script setup lang="ts">
// KeepAlive 组件的生命周期钩子
onActivated(() => {
  // 组件被激活时（从缓存恢复）
  refreshData()
})

onDeactivated(() => {
  // 组件被停用时（进入缓存）
  pauseTimers()
})
</script>
```

### 虚拟列表

```vue
<!-- ✅ 大型列表使用虚拟滚动 -->
<script setup lang="ts">
import { useVirtualList } from '@vueuse/core'

const { list, containerProps, wrapperProps } = useVirtualList(
  items,
  { itemHeight: 50 }
)
</script>
<template>
  <div v-bind="containerProps" style="height: 400px; overflow: auto">
    <div v-bind="wrapperProps">
      <div v-for="item in list" :key="item.data.id" style="height: 50px">
        {{ item.data.name }}
      </div>
    </div>
  </div>
</template>
```

---

## 审查检查清单

### 响应性系统
- [ ] ref 用于基本类型，reactive 用于对象（或统一用 ref）
- [ ] 没有解构 reactive 对象（或使用了 toRefs）
- [ ] props 传递给 composable 时保持了响应性
- [ ] shallowRef/shallowReactive 用于大型对象优化
- [ ] computed 中没有副作用

### Props 与 Emits
- [ ] defineProps 使用 TypeScript 类型声明
- [ ] 复杂默认值使用 withDefaults + 工厂函数
- [ ] defineEmits 有完整的类型定义
- [ ] 没有直接修改 props
- [ ] 考虑使用 defineModel 简化 v-model（Vue 3.4+）

### Vue 3.5 新特性（如适用）
- [ ] 使用 Reactive Props Destructure 简化 props 访问
- [ ] 使用 useTemplateRef 替代 ref 属性
- [ ] 表单使用 useId 生成 SSR 安全的 ID
- [ ] 使用 onWatcherCleanup 处理复杂清理逻辑

### 观察器（Watchers）
- [ ] watch/watchEffect 有适当的清理函数
- [ ] 异步 watch 处理了竞态条件
- [ ] flush: 'post' 用于 DOM 操作的 watcher
- [ ] 避免过度使用 watcher（优先用 computed）
- [ ] 考虑 once: true 用于一次性监听

### 模板
- [ ] v-for 使用唯一且稳定的 key
- [ ] v-if 和 v-for 没有在同一元素上
- [ ] 事件处理使用方法而非内联复杂逻辑
- [ ] 大型列表使用虚拟滚动

### 组合式函数（Composables）
- [ ] 相关逻辑提取到 composables
- [ ] composables 返回响应式引用（不是 .value）
- [ ] 纯函数不要包装成 composable
- [ ] 副作用在组件卸载时清理
- [ ] 使用 effectScope 管理复杂副作用

### 性能
- [ ] 大型组件拆分为小组件
- [ ] 使用 defineAsyncComponent 懒加载
- [ ] 避免不必要的响应式转换
- [ ] v-memo 用于昂贵的列表渲染
- [ ] KeepAlive 用于缓存动态组件