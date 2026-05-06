# Go 代码审查指南

基于 Go 官方指南、Effective Go 和社区最佳实践的代码审查清单。

## 快速审查清单

### 必查项
- [ ] 错误是否正确处理（不忽略、有上下文）
- [ ] goroutine 是否有退出机制（避免泄漏）
- [ ] context 是否正确传递和取消
- [ ] 接收器类型选择是否合理（值/指针）
- [ ] 是否使用 `gofmt` 格式化代码

### 高频问题
- [ ] 循环变量捕获问题（Go < 1.22）
- [ ] nil 检查是否完整
- [ ] map 是否初始化后使用
- [ ] defer 在循环中的使用
- [ ] 变量遮蔽（shadowing）

---

## 1. 错误处理

### 1.1 永远不要忽略错误

```go
// ❌ 错误：忽略错误
result, _ := SomeFunction()

// ✅ 正确：处理错误
result, err := SomeFunction()
if err != nil {
    return fmt.Errorf("some function failed: %w", err)
}
```

### 1.2 错误包装与上下文

```go
// ❌ 错误：丢失上下文
if err != nil {
    return err
}

// ❌ 错误：使用 %v 丢失错误链
if err != nil {
    return fmt.Errorf("failed: %v", err)
}

// ✅ 正确：使用 %w 保留错误链
if err != nil {
    return fmt.Errorf("failed to process user %d: %w", userID, err)
}
```

### 1.3 使用 errors.Is 和 errors.As

```go
// ❌ 错误：直接比较（无法处理包装错误）
if err == sql.ErrNoRows {
    // ...
}

// ✅ 正确：使用 errors.Is（支持错误链）
if errors.Is(err, sql.ErrNoRows) {
    return nil, ErrNotFound
}

// ✅ 正确：使用 errors.As 提取特定类型
var pathErr *os.PathError
if errors.As(err, &pathErr) {
    log.Printf("path error: %s", pathErr.Path)
}
```

### 1.4 自定义错误类型

```go
// ✅ 推荐：定义 sentinel 错误
var (
    ErrNotFound     = errors.New("not found")
    ErrUnauthorized = errors.New("unauthorized")
)

// ✅ 推荐：带上下文的自定义错误
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation error on %s: %s", e.Field, e.Message)
}
```

### 1.5 错误处理只做一次

```go
// ❌ 错误：既记录又返回（重复处理）
if err != nil {
    log.Printf("error: %v", err)
    return err
}

// ✅ 正确：只返回，让调用者决定
if err != nil {
    return fmt.Errorf("operation failed: %w", err)
}

// ✅ 或者：只记录并处理（不返回）
if err != nil {
    log.Printf("non-critical error: %v", err)
    // 继续执行备用逻辑
}
```

---

## 2. 并发与 Goroutine

### 2.1 避免 Goroutine 泄漏

```go
// ❌ 错误：goroutine 永远无法退出
func bad() {
    ch := make(chan int)
    go func() {
        val := <-ch // 永远阻塞，无人发送
        fmt.Println(val)
    }()
    // 函数返回，goroutine 泄漏
}

// ✅ 正确：使用 context 或 done channel
func good(ctx context.Context) {
    ch := make(chan int)
    go func() {
        select {
        case val := <-ch:
            fmt.Println(val)
        case <-ctx.Done():
            return // 优雅退出
        }
    }()
}
```

### 2.2 Channel 使用规范

```go
// ❌ 错误：向 nil channel 发送（永久阻塞）
var ch chan int
ch <- 1 // 永久阻塞

// ❌ 错误：向已关闭的 channel 发送（panic）
close(ch)
ch <- 1 // panic!

// ✅ 正确：发送方关闭 channel
func producer(ch chan<- int) {
    defer close(ch) // 发送方负责关闭
    for i := 0; i < 10; i++ {
        ch <- i
    }
}

// ✅ 正确：接收方检测关闭
for val := range ch {
    process(val)
}
// 或者
val, ok := <-ch
if !ok {
    // channel 已关闭
}
```

### 2.3 使用 sync.WaitGroup

```go
// ❌ 错误：Add 在 goroutine 内部
var wg sync.WaitGroup
for i := 0; i < 10; i++ {
    go func() {
        wg.Add(1) // 竞态条件！
        defer wg.Done()
        work()
    }()
}
wg.Wait()

// ✅ 正确：Add 在 goroutine 启动前
var wg sync.WaitGroup
for i := 0; i < 10; i++ {
    wg.Add(1)
    go func() {
        defer wg.Done()
        work()
    }()
}
wg.Wait()
```

### 2.4 避免在循环中捕获变量（Go < 1.22）

```go
// ❌ 错误（Go < 1.22）：捕获循环变量
for _, item := range items {
    go func() {
        process(item) // 所有 goroutine 可能使用同一个 item
    }()
}

// ✅ 正确：传递参数
for _, item := range items {
    go func(it Item) {
        process(it)
    }(item)
}

// ✅ Go 1.22+：默认行为已修复，每次迭代创建新变量
```

### 2.5 Worker Pool 模式

```go
// ✅ 推荐：限制并发数量
func processWithWorkerPool(ctx context.Context, items []Item, workers int) error {
    jobs := make(chan Item, len(items))
    results := make(chan error, len(items))

    // 启动 worker
    for w := 0; w < workers; w++ {
        go func() {
            for item := range jobs {
                results <- process(item)
            }
        }()
    }

    // 发送任务
    for _, item := range items {
        jobs <- item
    }
    close(jobs)

    // 收集结果
    for range items {
        if err := <-results; err != nil {
            return err
        }
    }
    return nil
}
```

---

## 3. Context 使用

### 3.1 Context 作为第一个参数

```go
// ❌ 错误：context 不是第一个参数
func Process(data []byte, ctx context.Context) error

// ❌ 错误：context 存储在 struct 中
type Service struct {
    ctx context.Context // 不要这样做！
}

// ✅ 正确：context 作为第一个参数，命名为 ctx
func Process(ctx context.Context, data []byte) error
```

### 3.2 传播而非创建新的根 Context

```go
// ❌ 错误：在调用链中创建新的根 context
func middleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        ctx := context.Background() // 丢失了请求的 context！
        process(ctx)
        next.ServeHTTP(w, r)
    })
}

// ✅ 正确：从请求中获取并传播
func middleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        ctx := r.Context()
        ctx = context.WithValue(ctx, key, value)
        process(ctx)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

### 3.3 始终调用 cancel 函数

```go
// ❌ 错误：未调用 cancel
ctx, cancel := context.WithTimeout(parentCtx, 5*time.Second)
// 缺少 cancel() 调用，可能资源泄漏

// ✅ 正确：使用 defer 确保调用
ctx, cancel := context.WithTimeout(parentCtx, 5*time.Second)
defer cancel() // 即使超时也要调用
```

### 3.4 响应 Context 取消

```go
// ✅ 推荐：在长时间操作中检查 context
func LongRunningTask(ctx context.Context) error {
    for {
        select {
        case <-ctx.Done():
            return ctx.Err() // 返回 context.Canceled 或 context.DeadlineExceeded
        default:
            // 执行一小部分工作
            if err := doChunk(); err != nil {
                return err
            }
        }
    }
}
```

### 3.5 区分取消原因

```go
// ✅ 根据 ctx.Err() 区分取消原因
if err := ctx.Err(); err != nil {
    switch {
    case errors.Is(err, context.Canceled):
        log.Println("operation was canceled")
    case errors.Is(err, context.DeadlineExceeded):
        log.Println("operation timed out")
    }
    return err
}
```

---

## 4. 接口设计

### 4.1 接受接口，返回结构体

```go
// ❌ 不推荐：接受具体类型
func SaveUser(db *sql.DB, user User) error

// ✅ 推荐：接受接口（解耦、易测试）
type UserStore interface {
    Save(ctx context.Context, user User) error
}

func SaveUser(store UserStore, user User) error

// ❌ 不推荐：返回接口
func NewUserService() UserServiceInterface

// ✅ 推荐：返回具体类型
func NewUserService(store UserStore) *UserService
```

### 4.2 在消费者处定义接口

```go
// ❌ 不推荐：在实现包中定义接口
// package database
type Database interface {
    Query(ctx context.Context, query string) ([]Row, error)
    // ... 20 个方法
}

// ✅ 推荐：在消费者包中定义所需的最小接口
// package userservice
type UserQuerier interface {
    QueryUsers(ctx context.Context, filter Filter) ([]User, error)
}
```

### 4.3 保持接口小而专注

```go
// ❌ 不推荐：大而全的接口
type Repository interface {
    GetUser(id int) (*User, error)
    CreateUser(u *User) error
    UpdateUser(u *User) error
    DeleteUser(id int) error
    GetOrder(id int) (*Order, error)
    CreateOrder(o *Order) error
    // ... 更多方法
}

// ✅ 推荐：小而专注的接口
type UserReader interface {
    GetUser(ctx context.Context, id int) (*User, error)
}

type UserWriter interface {
    CreateUser(ctx context.Context, u *User) error
    UpdateUser(ctx context.Context, u *User) error
}

// 组合接口
type UserRepository interface {
    UserReader
    UserWriter
}
```

### 4.4 避免空接口滥用

```go
// ❌ 不推荐：过度使用 interface{}
func Process(data interface{}) interface{}

// ✅ 推荐：使用泛型（Go 1.18+）
func Process[T any](data T) T

// ✅ 推荐：定义具体接口
type Processor interface {
    Process() Result
}
```

---

## 5. 接收器类型选择

### 5.1 使用指针接收器的情况

```go
// ✅ 需要修改接收器时
func (u *User) SetName(name string) {
    u.Name = name
}

// ✅ 接收器包含 sync.Mutex 等同步原语
type SafeCounter struct {
    mu    sync.Mutex
    count int
}

func (c *SafeCounter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.count++
}

// ✅ 接收器是大型结构体（避免复制开销）
type LargeStruct struct {
    Data [1024]byte
    // ...
}

func (l *LargeStruct) Process() { /* ... */ }
```

### 5.2 使用值接收器的情况

```go
// ✅ 接收器是小型不可变结构体
type Point struct {
    X, Y float64
}

func (p Point) Distance(other Point) float64 {
    return math.Sqrt(math.Pow(p.X-other.X, 2) + math.Pow(p.Y-other.Y, 2))
}

// ✅ 接收器是基本类型的别名
type Counter int

func (c Counter) String() string {
    return fmt.Sprintf("%d", c)
}

// ✅ 接收器是 map、func、chan（本身是引用类型）
type StringSet map[string]struct{}

func (s StringSet) Contains(key string) bool {
    _, ok := s[key]
    return ok
}
```

### 5.3 一致性原则

```go
// ❌ 不推荐：混合使用接收器类型
func (u User) GetName() string   // 值接收器
func (u *User) SetName(n string) // 指针接收器

// ✅ 推荐：如果有任何方法需要指针接收器，全部使用指针
func (u *User) GetName() string { return u.Name }
func (u *User) SetName(n string) { u.Name = n }
```

---

## 6. 性能优化

### 6.1 预分配 Slice

```go
// ❌ 不推荐：动态增长
var result []int
for i := 0; i < 10000; i++ {
    result = append(result, i) // 多次分配和复制
}

// ✅ 推荐：预分配已知大小
result := make([]int, 0, 10000)
for i := 0; i < 10000; i++ {
    result = append(result, i)
}

// ✅ 或者直接初始化
result := make([]int, 10000)
for i := 0; i < 10000; i++ {
    result[i] = i
}
```

### 6.2 避免不必要的堆分配

```go
// ❌ 可能逃逸到堆
func NewUser() *User {
    return &User{} // 逃逸到堆
}

// ✅ 考虑返回值（如果适用）
func NewUser() User {
    return User{} // 可能在栈上分配
}

// 检查逃逸分析
// go build -gcflags '-m -m' ./...
```

### 6.3 使用 sync.Pool 复用对象

```go
// ✅ 推荐：高频创建/销毁的对象使用 sync.Pool
var bufferPool = sync.Pool{
    New: func() interface{} {
        return new(bytes.Buffer)
    },
}

func ProcessData(data []byte) string {
    buf := bufferPool.Get().(*bytes.Buffer)
    defer func() {
        buf.Reset()
        bufferPool.Put(buf)
    }()

    buf.Write(data)
    return buf.String()
}
```

### 6.4 字符串拼接优化

```go
// ❌ 不推荐：循环中使用 + 拼接
var result string
for _, s := range strings {
    result += s // 每次创建新字符串
}

// ✅ 推荐：使用 strings.Builder
var builder strings.Builder
for _, s := range strings {
    builder.WriteString(s)
}
result := builder.String()

// ✅ 或者使用 strings.Join
result := strings.Join(strings, "")
```

### 6.5 避免 interface{} 转换开销

```go
// ❌ 热路径中使用 interface{}
func process(data interface{}) {
    switch v := data.(type) { // 类型断言有开销
    case int:
        // ...
    }
}

// ✅ 热路径中使用泛型或具体类型
func process[T int | int64 | float64](data T) {
    // 编译时确定类型，无运行时开销
}
```

---

## 7. 测试

### 7.1 表驱动测试

```go
// ✅ 推荐：表驱动测试
func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive numbers", 1, 2, 3},
        {"with zero", 0, 5, 5},
        {"negative numbers", -1, -2, -3},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Add(%d, %d) = %d; want %d",
                    tt.a, tt.b, result, tt.expected)
            }
        })
    }
}
```

### 7.2 并行测试

```go
// ✅ 推荐：独立测试用例并行执行
func TestParallel(t *testing.T) {
    tests := []struct {
        name  string
        input string
    }{
        {"test1", "input1"},
        {"test2", "input2"},
    }

    for _, tt := range tests {
        tt := tt // Go < 1.22 需要复制
        t.Run(tt.name, func(t *testing.T) {
            t.Parallel() // 标记为可并行
            result := Process(tt.input)
            // assertions...
        })
    }
}
```

### 7.3 使用接口进行 Mock

```go
// ✅ 定义接口以便测试
type EmailSender interface {
    Send(to, subject, body string) error
}

// 生产实现
type SMTPSender struct { /* ... */ }

// 测试 Mock
type MockEmailSender struct {
    SendFunc func(to, subject, body string) error
}

func (m *MockEmailSender) Send(to, subject, body string) error {
    return m.SendFunc(to, subject, body)
}

func TestUserRegistration(t *testing.T) {
    mock := &MockEmailSender{
        SendFunc: func(to, subject, body string) error {
            if to != "test@example.com" {
                t.Errorf("unexpected recipient: %s", to)
            }
            return nil
        },
    }

    service := NewUserService(mock)
    // test...
}
```

### 7.4 测试辅助函数

```go
// ✅ 使用 t.Helper() 标记辅助函数
func assertEqual(t *testing.T, got, want interface{}) {
    t.Helper() // 错误报告时显示调用者位置
    if got != want {
        t.Errorf("got %v, want %v", got, want)
    }
}

// ✅ 使用 t.Cleanup() 清理资源
func TestWithTempFile(t *testing.T) {
    f, err := os.CreateTemp("", "test")
    if err != nil {
        t.Fatal(err)
    }
    t.Cleanup(func() {
        os.Remove(f.Name())
    })
    // test...
}
```

---

## 8. 常见陷阱

### 8.1 Nil Slice vs Empty Slice

```go
var nilSlice []int     // nil, len=0, cap=0
emptySlice := []int{}  // not nil, len=0, cap=0
made := make([]int, 0) // not nil, len=0, cap=0

// ✅ JSON 编码差异
json.Marshal(nilSlice)   // null
json.Marshal(emptySlice) // []

// ✅ 推荐：需要空数组 JSON 时显式初始化
if slice == nil {
    slice = []int{}
}
```

### 8.2 Map 初始化

```go
// ❌ 错误：未初始化的 map
var m map[string]int
m["key"] = 1 // panic: assignment to entry in nil map

// ✅ 正确：使用 make 初始化
m := make(map[string]int)
m["key"] = 1

// ✅ 或者使用字面量
m := map[string]int{}
```

### 8.3 Defer 在循环中

```go
// ❌ 潜在问题：defer 在函数结束时才执行
func processFiles(files []string) error {
    for _, file := range files {
        f, err := os.Open(file)
        if err != nil {
            return err
        }
        defer f.Close() // 所有文件在函数结束时才关闭！
        // process...
    }
    return nil
}

// ✅ 正确：使用闭包或提取函数
func processFiles(files []string) error {
    for _, file := range files {
        if err := processFile(file); err != nil {
            return err
        }
    }
    return nil
}

func processFile(file string) error {
    f, err := os.Open(file)
    if err != nil {
        return err
    }
    defer f.Close()
    // process...
    return nil
}
```

### 8.4 Slice 底层数组共享

```go
// ❌ 潜在问题：切片共享底层数组
original := []int{1, 2, 3, 4, 5}
slice := original[1:3] // [2, 3]
slice[0] = 100         // 修改了 original！
// original 变成 [1, 100, 3, 4, 5]

// ✅ 正确：需要独立副本时显式复制
slice := make([]int, 2)
copy(slice, original[1:3])
slice[0] = 100 // 不影响 original
```

### 8.5 字符串子串内存泄漏

```go
// ❌ 潜在问题：子串持有整个底层数组
func getPrefix(s string) string {
    return s[:10] // 仍引用整个 s 的底层数组
}

// ✅ 正确：创建独立副本（Go 1.18+）
func getPrefix(s string) string {
    return strings.Clone(s[:10])
}

// ✅ Go 1.18 之前
func getPrefix(s string) string {
    return string([]byte(s[:10]))
}
```

### 8.6 Interface Nil 陷阱

```go
// ❌ 陷阱：interface 的 nil 判断
type MyError struct{}
func (e *MyError) Error() string { return "error" }

func returnsError() error {
    var e *MyError = nil
    return e // 返回的 error 不是 nil！
}

func main() {
    err := returnsError()
    if err != nil { // true! interface{type: *MyError, value: nil}
        fmt.Println("error:", err)
    }
}

// ✅ 正确：显式返回 nil
func returnsError() error {
    var e *MyError = nil
    if e == nil {
        return nil // 显式返回 nil
    }
    return e
}
```

### 8.7 Time 比较

```go
// ❌ 不推荐：直接使用 == 比较 time.Time
if t1 == t2 { // 可能因为单调时钟差异而失败
    // ...
}

// ✅ 推荐：使用 Equal 方法
if t1.Equal(t2) {
    // ...
}

// ✅ 比较时间范围
if t1.Before(t2) || t1.After(t2) {
    // ...
}
```

---

## 9. 代码组织

### 9.1 包命名

```go
// ❌ 不推荐
package common   // 过于宽泛
package utils    // 过于宽泛
package helpers  // 过于宽泛
package models   // 按类型分组

// ✅ 推荐：按功能命名
package user     // 用户相关功能
package order    // 订单相关功能
package postgres // PostgreSQL 实现
```

### 9.2 避免循环依赖

```go
// ❌ 循环依赖
// package a imports package b
// package b imports package a

// ✅ 解决方案1：提取共享类型到独立包
// package types (共享类型)
// package a imports types
// package b imports types

// ✅ 解决方案2：使用接口解耦
// package a 定义接口
// package b 实现接口
```

### 9.3 导出标识符规范

```go
// ✅ 只导出必要的标识符
type UserService struct {
    db *sql.DB // 私有
}

func (s *UserService) GetUser(id int) (*User, error) // 公开
func (s *UserService) validate(u *User) error         // 私有

// ✅ 内部包限制访问
// internal/database/... 只能被同项目代码导入
```

---

## 10. 工具与检查

### 10.1 必须使用的工具

```bash
# 格式化（必须）
gofmt -w .
goimports -w .

# 静态分析
go vet ./...

# 竞态检测
go test -race ./...

# 逃逸分析
go build -gcflags '-m -m' ./...
```

### 10.2 推荐的 Linter

```bash
# golangci-lint（集成多个 linter）
golangci-lint run

# 常用检查项
# - errcheck: 检查未处理的错误
# - gosec: 安全检查
# - ineffassign: 无效赋值
# - staticcheck: 静态分析
# - unused: 未使用的代码
```

### 10.3 Benchmark 测试

```go
// ✅ 性能基准测试
func BenchmarkProcess(b *testing.B) {
    data := prepareData()
    b.ResetTimer() // 重置计时器

    for i := 0; i < b.N; i++ {
        Process(data)
    }
}

// 运行 benchmark
// go test -bench=. -benchmem ./...
```

---

## 参考资源

- [Effective Go](https://go.dev/doc/effective_go)
- [Go Code Review Comments](https://go.dev/wiki/CodeReviewComments)
- [Go Common Mistakes](https://go.dev/wiki/CommonMistakes)
- [100 Go Mistakes](https://100go.co/)
- [Go Proverbs](https://go-proverbs.github.io/)
- [Uber Go Style Guide](https://github.com/uber-go/guide/blob/master/style.md)