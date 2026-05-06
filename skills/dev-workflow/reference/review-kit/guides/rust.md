# Rust 代码审查指南

> Rust 代码审查指南。编译器能捕获内存安全问题，但审查者需要关注编译器无法检测的问题——业务逻辑、API 设计、性能、取消安全性和可维护性。

## 目录

- [所有权与借用](#所有权与借用)
- [Unsafe 代码审查（最关键）](#unsafe-代码审查最关键)
- [异步代码](#异步代码)
- [取消安全性](#取消安全性)
- [spawn 与 await](#spawn-与-await)
- [错误处理](#错误处理)
- [性能](#性能)
- [特征（Trait）设计](#特征trait-设计)
- [Rust 代码审查清单](#rust-代码审查清单)

---

## 所有权与借用

### 避免不必要的 clone()

```rust
// ❌ clone() 是"Rust 的胶带"——用于绕过借用检查器
fn bad_process(data: &Data) -> Result<()> {
    let owned = data.clone();  // 为什么需要 clone？
    expensive_operation(owned)
}

// ✅ 审查时问：clone 是否必要？能否用借用？
fn good_process(data: &Data) -> Result<()> {
    expensive_operation(data)  // 传递引用
}

// ✅ 如果确实需要 clone，添加注释说明原因
fn justified_clone(data: &Data) -> Result<()> {
    // Clone needed: data will be moved to spawned task
    let owned = data.clone();
    tokio::spawn(async move {
        process(owned).await
    });
    Ok(())
}
```

### Arc<Mutex<T>> 的使用

```rust
// ❌ Arc<Mutex<T>> 可能隐藏不必要的共享状态
struct BadService {
    cache: Arc<Mutex<HashMap<String, Data>>>,  // 真的需要共享？
}

// ✅ 考虑是否需要共享，或者设计可以避免
struct GoodService {
    cache: HashMap<String, Data>,  // 单一所有者
}

// ✅ 如果确实需要并发访问，考虑更好的数据结构
use dashmap::DashMap;

struct ConcurrentService {
    cache: DashMap<String, Data>,  // 更细粒度的锁
}
```

### Cow (Copy-on-Write) 模式

```rust
use std::borrow::Cow;

// ❌ 总是分配新字符串
fn bad_process_name(name: &str) -> String {
    if name.is_empty() {
        "Unknown".to_string()  // 分配
    } else {
        name.to_string()  // 不必要的分配
    }
}

// ✅ 使用 Cow 避免不必要的分配
fn good_process_name(name: &str) -> Cow<'_, str> {
    if name.is_empty() {
        Cow::Borrowed("Unknown")  // 静态字符串，无分配
    } else {
        Cow::Borrowed(name)  // 借用原始数据
    }
}

// ✅ 只在需要修改时才分配
fn normalize_name(name: &str) -> Cow<'_, str> {
    if name.chars().any(|c| c.is_uppercase()) {
        Cow::Owned(name.to_lowercase())  // 需要修改，分配
    } else {
        Cow::Borrowed(name)  // 无需修改，借用
    }
}
```

---

## Unsafe 代码审查（最关键！）

### 基本要求

```rust
// ❌ unsafe 没有安全文档——这是红旗
unsafe fn bad_transmute<T, U>(t: T) -> U {
    std::mem::transmute(t)
}

// ✅ 每个 unsafe 必须解释：为什么安全？什么不变量？
/// Transmutes `T` to `U`.
///
/// # Safety
///
/// - `T` and `U` must have the same size and alignment
/// - `T` must be a valid bit pattern for `U`
/// - The caller ensures no references to `t` exist after this call
unsafe fn documented_transmute<T, U>(t: T) -> U {
    // SAFETY: Caller guarantees size/alignment match and bit validity
    std::mem::transmute(t)
}
```

### Unsafe 块注释

```rust
// ❌ 没有解释的 unsafe 块
fn bad_get_unchecked(slice: &[u8], index: usize) -> u8 {
    unsafe { *slice.get_unchecked(index) }
}

// ✅ 每个 unsafe 块必须有 SAFETY 注释
fn good_get_unchecked(slice: &[u8], index: usize) -> u8 {
    debug_assert!(index < slice.len(), "index out of bounds");
    // SAFETY: We verified index < slice.len() via debug_assert.
    // In release builds, callers must ensure valid index.
    unsafe { *slice.get_unchecked(index) }
}

// ✅ 封装 unsafe 提供安全 API
pub fn checked_get(slice: &[u8], index: usize) -> Option<u8> {
    if index < slice.len() {
        // SAFETY: bounds check performed above
        Some(unsafe { *slice.get_unchecked(index) })
    } else {
        None
    }
}
```

### 常见 unsafe 模式

```rust
// ✅ FFI 边界
extern "C" {
    fn external_function(ptr: *const u8, len: usize) -> i32;
}

pub fn safe_wrapper(data: &[u8]) -> Result<i32, Error> {
    // SAFETY: data.as_ptr() is valid for data.len() bytes,
    // and external_function only reads from the buffer.
    let result = unsafe {
        external_function(data.as_ptr(), data.len())
    };
    if result < 0 {
        Err(Error::from_code(result))
    } else {
        Ok(result)
    }
}

// ✅ 性能关键路径的 unsafe
pub fn fast_copy(src: &[u8], dst: &mut [u8]) {
    assert_eq!(src.len(), dst.len(), "slices must be equal length");
    // SAFETY: src and dst are valid slices of equal length,
    // and dst is mutable so no aliasing.
    unsafe {
        std::ptr::copy_nonoverlapping(
            src.as_ptr(),
            dst.as_mut_ptr(),
            src.len()
        );
    }
}
```

---

## 异步代码

### 避免阻塞操作

```rust
// ❌ 在 async 上下文中阻塞——会饿死其他任务
async fn bad_async() {
    let data = std::fs::read_to_string("file.txt").unwrap();  // 阻塞！
    std::thread::sleep(Duration::from_secs(1));  // 阻塞！
}

// ✅ 使用异步 API
async fn good_async() -> Result<String> {
    let data = tokio::fs::read_to_string("file.txt").await?;
    tokio::time::sleep(Duration::from_secs(1)).await;
    Ok(data)
}

// ✅ 如果必须使用阻塞操作，用 spawn_blocking
async fn with_blocking() -> Result<Data> {
    let result = tokio::task::spawn_blocking(|| {
        // 这里可以安全地进行阻塞操作
        expensive_cpu_computation()
    }).await?;
    Ok(result)
}
```

### Mutex 和 .await

```rust
// ❌ 跨 .await 持有 std::sync::Mutex——可能死锁
async fn bad_lock(mutex: &std::sync::Mutex<Data>) {
    let guard = mutex.lock().unwrap();
    async_operation().await;  // 持锁等待！
    process(&guard);
}

// ✅ 方案1：最小化锁范围
async fn good_lock_scoped(mutex: &std::sync::Mutex<Data>) {
    let data = {
        let guard = mutex.lock().unwrap();
        guard.clone()  // 立即释放锁
    };
    async_operation().await;
    process(&data);
}

// ✅ 方案2：使用 tokio::sync::Mutex（可跨 await）
async fn good_lock_tokio(mutex: &tokio::sync::Mutex<Data>) {
    let guard = mutex.lock().await;
    async_operation().await;  // OK: tokio Mutex 设计为可跨 await
    process(&guard);
}

// 💡 选择指南：
// - std::sync::Mutex：低竞争、短临界区、不跨 await
// - tokio::sync::Mutex：需要跨 await、高竞争场景
```

### 异步 trait 方法

```rust
// ❌ async trait 方法的陷阱（旧版本）
#[async_trait]
trait BadRepository {
    async fn find(&self, id: i64) -> Option<Entity>;  // 隐式 Box
}

// ✅ Rust 1.75+：原生 async trait 方法
trait Repository {
    async fn find(&self, id: i64) -> Option<Entity>;

    // 返回具体 Future 类型以避免 allocation
    fn find_many(&self, ids: &[i64]) -> impl Future<Output = Vec<Entity>> + Send;
}

// ✅ 对于需要 dyn 的场景
trait DynRepository: Send + Sync {
    fn find(&self, id: i64) -> Pin<Box<dyn Future<Output = Option<Entity>> + Send + '_>>;
}
```

---

## 取消安全性

### 什么是取消安全

```rust
// 当一个 Future 在 .await 点被 drop 时，它处于什么状态？
// 取消安全的 Future：可以在任何 await 点安全取消
// 取消不安全的 Future：取消可能导致数据丢失或不一致状态

// ❌ 取消不安全的例子
async fn cancel_unsafe(conn: &mut Connection) -> Result<()> {
    let data = receive_data().await;  // 如果这里被取消...
    conn.send_ack().await;  // ...确认永远不会发送，数据可能丢失
    Ok(())
}

// ✅ 取消安全的版本
async fn cancel_safe(conn: &mut Connection) -> Result<()> {
    // 使用事务或原子操作确保一致性
    let transaction = conn.begin_transaction().await?;
    let data = receive_data().await;
    transaction.commit_with_ack(data).await?;  // 原子操作
    Ok(())
}
```

### select! 中的取消安全

```rust
use tokio::select;

// ❌ 在 select! 中使用取消不安全的 Future
async fn bad_select(stream: &mut TcpStream) {
    let mut buffer = vec![0u8; 1024];
    loop {
        select! {
            // 如果 timeout 先完成，read 被取消
            // 部分读取的数据可能丢失！
            result = stream.read(&mut buffer) => {
                handle_data(&buffer[..result?]);
            }
            _ = tokio::time::sleep(Duration::from_secs(5)) => {
                println!("Timeout");
            }
        }
    }
}

// ✅ 使用取消安全的 API
async fn good_select(stream: &mut TcpStream) {
    let mut buffer = vec![0u8; 1024];
    loop {
        select! {
            // tokio::io::AsyncReadExt::read 是取消安全的
            // 取消时，未读取的数据留在流中
            result = stream.read(&mut buffer) => {
                match result {
                    Ok(0) => break,  // EOF
                    Ok(n) => handle_data(&buffer[..n]),
                    Err(e) => return Err(e),
                }
            }
            _ = tokio::time::sleep(Duration::from_secs(5)) => {
                println!("Timeout, retrying...");
            }
        }
    }
}

// ✅ 使用 tokio::pin! 确保 Future 可以安全重用
async fn pinned_select() {
    let sleep = tokio::time::sleep(Duration::from_secs(10));
    tokio::pin!(sleep);

    loop {
        select! {
            _ = &mut sleep => {
                println!("Timer elapsed");
                break;
            }
            data = receive_data() => {
                process(data).await;
                // sleep 继续倒计时，不会重置
            }
        }
    }
}
```

### 文档化取消安全性

```rust
/// Reads a complete message from the stream.
///
/// # Cancel Safety
///
/// This method is **not** cancel safe. If cancelled while reading,
/// partial data may be lost and the stream state becomes undefined.
/// Use `read_message_cancel_safe` if cancellation is expected.
async fn read_message(stream: &mut TcpStream) -> Result<Message> {
    let len = stream.read_u32().await?;
    let mut buffer = vec![0u8; len as usize];
    stream.read_exact(&mut buffer).await?;
    Ok(Message::from_bytes(&buffer))
}

/// Reads a message with cancel safety.
///
/// # Cancel Safety
///
/// This method is cancel safe. If cancelled, any partial data
/// is preserved in the internal buffer for the next call.
async fn read_message_cancel_safe(reader: &mut BufferedReader) -> Result<Message> {
    reader.read_message_buffered().await
}
```

---

## spawn 与 await

### 何时使用 spawn

```rust
// ❌ 不必要的 spawn——增加开销，失去结构化并发
async fn bad_unnecessary_spawn() {
    let handle = tokio::spawn(async {
        simple_operation().await
    });
    handle.await.unwrap();  // 为什么不直接 await？
}

// ✅ 直接 await 简单操作
async fn good_direct_await() {
    simple_operation().await;
}

// ✅ spawn 用于真正的并行执行
async fn good_parallel_spawn() {
    let task1 = tokio::spawn(fetch_from_service_a());
    let task2 = tokio::spawn(fetch_from_service_b());

    // 两个请求并行执行
    let (result1, result2) = tokio::try_join!(task1, task2)?;
}

// ✅ spawn 用于后台任务（fire-and-forget）
async fn good_background_spawn() {
    // 启动后台任务，不等待完成
    tokio::spawn(async {
        cleanup_old_sessions().await;
        log_metrics().await;
    });

    // 继续执行其他工作
    handle_request().await;
}
```

### spawn 的 'static 要求

```rust
// ❌ spawn 的 Future 必须是 'static
async fn bad_spawn_borrow(data: &Data) {
    tokio::spawn(async {
        process(data).await;  // Error: `data` 不是 'static
    });
}

// ✅ 方案1：克隆数据
async fn good_spawn_clone(data: &Data) {
    let owned = data.clone();
    tokio::spawn(async move {
        process(&owned).await;
    });
}

// ✅ 方案2：使用 Arc 共享
async fn good_spawn_arc(data: Arc<Data>) {
    let data = Arc::clone(&data);
    tokio::spawn(async move {
        process(&data).await;
    });
}

// ✅ 方案3：使用作用域任务（tokio-scoped 或 async-scoped）
async fn good_scoped_spawn(data: &Data) {
    // 假设使用 async-scoped crate
    async_scoped::scope(|s| async {
        s.spawn(async {
            process(data).await;  // 可以借用
        });
    }).await;
}
```

### JoinHandle 错误处理

```rust
// ❌ 忽略 spawn 的错误
async fn bad_ignore_spawn_error() {
    let handle = tokio::spawn(async {
        risky_operation().await
    });
    let _ = handle.await;  // 忽略了 panic 和错误
}

// ✅ 正确处理 JoinHandle 结果
async fn good_handle_spawn_error() -> Result<()> {
    let handle = tokio::spawn(async {
        risky_operation().await
    });

    match handle.await {
        Ok(Ok(result)) => {
            // 任务成功完成
            process_result(result);
            Ok(())
        }
        Ok(Err(e)) => {
            // 任务内部错误
            Err(e.into())
        }
        Err(join_err) => {
            // 任务 panic 或被取消
            if join_err.is_panic() {
                error!("Task panicked: {:?}", join_err);
            }
            Err(anyhow!("Task failed: {}", join_err))
        }
    }
}
```

### 结构化并发 vs spawn

```rust
// ✅ 优先使用 join!（结构化并发）
async fn structured_concurrency() -> Result<(A, B, C)> {
    // 所有任务在同一个作用域内
    // 如果任何一个失败，其他的会被取消
    tokio::try_join!(
        fetch_a(),
        fetch_b(),
        fetch_c()
    )
}

// ✅ 使用 spawn 时考虑任务生命周期
struct TaskManager {
    handles: Vec<JoinHandle<()>>,
}

impl TaskManager {
    async fn shutdown(self) {
        // 优雅关闭：等待所有任务完成
        for handle in self.handles {
            if let Err(e) = handle.await {
                error!("Task failed during shutdown: {}", e);
            }
        }
    }

    async fn abort_all(self) {
        // 强制关闭：取消所有任务
        for handle in self.handles {
            handle.abort();
        }
    }
}
```

---

## 错误处理

### 库 vs 应用的错误类型

```rust
// ❌ 库代码用 anyhow——调用者无法 match 错误
pub fn parse_config(s: &str) -> anyhow::Result<Config> { ... }

// ✅ 库用 thiserror，应用用 anyhow
#[derive(Debug, thiserror::Error)]
pub enum ConfigError {
    #[error("invalid syntax at line {line}: {message}")]
    Syntax { line: usize, message: String },
    #[error("missing required field: {0}")]
    MissingField(String),
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

pub fn parse_config(s: &str) -> Result<Config, ConfigError> { ... }
```

### 保留错误上下文

```rust
// ❌ 吞掉错误上下文
fn bad_error() -> Result<()> {
    operation().map_err(|_| anyhow!("failed"))?;  // 原始错误丢失
    Ok(())
}

// ✅ 使用 context 保留错误链
fn good_error() -> Result<()> {
    operation().context("failed to perform operation")?;
    Ok(())
}

// ✅ 使用 with_context 进行懒计算
fn good_error_lazy() -> Result<()> {
    operation()
        .with_context(|| format!("failed to process file: {}", filename))?;
    Ok(())
}
```

### 错误类型设计

```rust
// ✅ 使用 #[source] 保留错误链
#[derive(Debug, thiserror::Error)]
pub enum ServiceError {
    #[error("database error")]
    Database(#[source] sqlx::Error),

    #[error("network error: {message}")]
    Network {
        message: String,
        #[source]
        source: reqwest::Error,
    },

    #[error("validation failed: {0}")]
    Validation(String),
}

// ✅ 为常见转换实现 From
impl From<sqlx::Error> for ServiceError {
    fn from(err: sqlx::Error) -> Self {
        ServiceError::Database(err)
    }
}
```

---

## 性能

### 避免不必要的 collect()

```rust
// ❌ 不必要的 collect——中间分配
fn bad_sum(items: &[i32]) -> i32 {
    items.iter()
        .filter(|x| **x > 0)
        .collect::<Vec<_>>()  // 不必要！
        .iter()
        .sum()
}

// ✅ 惰性迭代
fn good_sum(items: &[i32]) -> i32 {
    items.iter().filter(|x| **x > 0).copied().sum()
}
```

### 字符串拼接

```rust
// ❌ 字符串拼接在循环中重复分配
fn bad_concat(items: &[&str]) -> String {
    let mut s = String::new();
    for item in items {
        s = s + item;  // 每次都重新分配！
    }
    s
}

// ✅ 预分配或用 join
fn good_concat(items: &[&str]) -> String {
    items.join("")
}

// ✅ 使用 with_capacity 预分配
fn good_concat_capacity(items: &[&str]) -> String {
    let total_len: usize = items.iter().map(|s| s.len()).sum();
    let mut result = String::with_capacity(total_len);
    for item in items {
        result.push_str(item);
    }
    result
}

// ✅ 使用 write! 宏
use std::fmt::Write;

fn good_concat_write(items: &[&str]) -> String {
    let mut result = String::new();
    for item in items {
        write!(result, "{}", item).unwrap();
    }
    result
}
```

### 避免不必要的分配

```rust
// ❌ 不必要的 Vec 分配
fn bad_check_any(items: &[Item]) -> bool {
    let filtered: Vec<_> = items.iter()
        .filter(|i| i.is_valid())
        .collect();
    !filtered.is_empty()
}

// ✅ 使用迭代器方法
fn good_check_any(items: &[Item]) -> bool {
    items.iter().any(|i| i.is_valid())
}

// ❌ String::from 用于静态字符串
fn bad_static() -> String {
    String::from("error message")  // 运行时分配
}

// ✅ 返回 &'static str
fn good_static() -> &'static str {
    "error message"  // 无分配
}
```

---

## 特征（Trait）设计

### 避免过度抽象

```rust
// ❌ 过度抽象——不是 Java，不需要 Interface 一切
trait Processor { fn process(&self); }
trait Handler { fn handle(&self); }
trait Manager { fn manage(&self); }  // Trait 过多

// ✅ 只在需要多态时创建 trait
// 具体类型通常更简单、更快
struct DataProcessor {
    config: Config,
}

impl DataProcessor {
    fn process(&self, data: &Data) -> Result<Output> {
        // 直接实现
    }
}
```

### Trait 对象 vs 泛型

```rust
// ❌ 不必要的 trait 对象（动态分发）
fn bad_process(handler: &dyn Handler) {
    handler.handle();  // 虚表调用
}

// ✅ 使用泛型（静态分发，可内联）
fn good_process<H: Handler>(handler: &H) {
    handler.handle();  // 可能被内联
}

// ✅ trait 对象适用场景：异构集合
fn store_handlers(handlers: Vec<Box<dyn Handler>>) {
    // 需要存储不同类型的 handlers
}

// ✅ 使用 impl Trait 返回类型
fn create_handler() -> impl Handler {
    ConcreteHandler::new()
}
```

---

## Rust 代码审查清单

### 编译器不能捕获的问题

**业务逻辑正确性**
- [ ] 边界条件处理正确
- [ ] 状态机转换完整
- [ ] 并发场景下的竞态条件

**API 设计**
- [ ] 公共 API 难以误用
- [ ] 类型签名清晰表达意图
- [ ] 错误类型粒度合适

### 所有权与借用

- [ ] clone() 是有意为之，文档说明了原因
- [ ] Arc<Mutex<T>> 真的需要共享状态吗？
- [ ] RefCell 的使用有正当理由
- [ ] 生命周期不过度复杂
- [ ] 考虑使用 Cow 避免不必要的分配

### Unsafe 代码（最重要）

- [ ] 每个 unsafe 块有 SAFETY 注释
- [ ] unsafe fn 有 # Safety 文档节
- [ ] 解释了为什么是安全的，不只是做什么
- [ ] 列出了必须维护的不变量
- [ ] unsafe 边界尽可能小
- [ ] 考虑过是否有 safe 替代方案

### 异步/并发

- [ ] 没有在 async 中阻塞（std::fs、thread::sleep）
- [ ] 没有跨 .await 持有 std::sync 锁
- [ ] spawn 的任务满足 'static
- [ ] 锁的获取顺序一致
- [ ] Channel 缓冲区大小合理

### 取消安全性

- [ ] select! 中的 Future 是取消安全的
- [ ] 文档化了 async 函数的取消安全性
- [ ] 取消不会导致数据丢失或不一致状态
- [ ] 使用 tokio::pin! 正确处理需要重用的 Future

### spawn 与 await

- [ ] spawn 只用于真正需要并行的场景
- [ ] 简单操作直接 await，不要 spawn
- [ ] spawn 的 JoinHandle 结果被正确处理
- [ ] 考虑任务的生命周期和关闭策略
- [ ] 优先使用 join!/try_join! 进行结构化并发

### 错误处理

- [ ] 库：thiserror 定义结构化错误
- [ ] 应用：anyhow + context
- [ ] 没有生产代码 unwrap/expect
- [ ] 错误消息对调试有帮助
- [ ] must_use 返回值被处理
- [ ] 使用 #[source] 保留错误链

### 性能

- [ ] 避免不必要的 collect()
- [ ] 大数据传引用
- [ ] 字符串用 with_capacity 或 write!
- [ ] impl Trait vs Box<dyn Trait> 选择合理
- [ ] 热路径避免分配
- [ ] 考虑使用 Cow 减少克隆

### 代码质量

- [ ] cargo clippy 零警告
- [ ] cargo fmt 格式化
- [ ] 文档注释完整
- [ ] 测试覆盖边界条件
- [ ] 公共 API 有文档示例