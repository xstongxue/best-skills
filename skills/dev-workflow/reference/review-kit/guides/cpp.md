# C++ 代码审查指南

> 面向 C++ 的代码审查指南，重点关注内存安全、生命周期、API 设计与性能。示例默认基于 C++17/20。

## 目录

- [所有权与 RAII](#所有权与-raii)
- [生命周期与引用](#生命周期与引用)
- [拷贝与移动语义](#拷贝与移动语义)
- [const-correctness 与 API 设计](#const-correctness-与-api-设计)
- [错误处理与异常安全](#错误处理与异常安全)
- [并发](#并发)
- [性能与分配](#性能与分配)
- [模板与类型安全](#模板与类型安全)
- [工具链与构建检查](#工具链与构建检查)
- [审查检查清单](#审查检查清单)

---

## 所有权与 RAII

### 优先使用 RAII 与智能指针

用 RAII 表达所有权。默认使用 `std::unique_ptr`；只有在确实需要共享生命周期时才使用 `std::shared_ptr`。

```cpp
// ❌ Bad: 手工 new/delete，且有早返回
Foo* make_foo() {
    Foo* foo = new Foo();
    if (!foo->Init()) {
        delete foo;
        return nullptr;
    }
    return foo;
}

// ✅ Good: 用 unique_ptr 表达 RAII
std::unique_ptr<Foo> make_foo() {
    auto foo = std::make_unique<Foo>();
    if (!foo->Init()) {
        return {};
    }
    return foo;
}
```

### 包装 C 资源

```cpp
// ✅ Good: 用 unique_ptr 包装 FILE*
using FilePtr = std::unique_ptr<FILE, decltype(&fclose)>;

FilePtr open_file(const char* path) {
    return FilePtr(fopen(path, "rb"), &fclose);
}
```

---

## 生命周期与引用

### 避免悬垂引用与悬空视图

`std::string_view` 和 `std::span` 不拥有数据，必须保证数据所有者生命周期长于视图。

```cpp
// ❌ Bad: 返回指向临时对象的 string_view
std::string_view bad_view() {
    std::string s = make_name();
    return s; // dangling
}

// ✅ Good: 返回拥有所有权的 string
std::string good_name() {
    return make_name();
}

// ✅ Good: 视图绑定调用方持有的数据
std::string_view good_view(const std::string& s) {
    return s;
}
```

### Lambda 捕获

```cpp
// ❌ Bad: 捕获会逃逸的引用
std::function<void()> make_task() {
    int value = 42;
    return [&]() { use(value); }; // dangling
}

// ✅ Good: 按值捕获
std::function<void()> make_task() {
    int value = 42;
    return [value]() { use(value); };
}
```

---

## 拷贝与移动语义

### Rule of 0/3/5

优先用 RAII 类型遵循 Rule of 0。若类型自己持有资源，则必须显式定义或禁用拷贝/移动操作。

```cpp
// ❌ Bad: 原始资源所有权 + 默认拷贝
struct Buffer {
    int* data;
    size_t size;
    explicit Buffer(size_t n) : data(new int[n]), size(n) {}
    ~Buffer() { delete[] data; }
    // copy ctor/assign 隐式生成 -> double delete
};

// ✅ Good: 用 std::vector 实现 Rule of 0
struct Buffer {
    std::vector<int> data;
    explicit Buffer(size_t n) : data(n) {}
};
```

### 禁止不需要的拷贝

```cpp
struct Socket {
    Socket() = default;
    ~Socket() { close(); }

    Socket(const Socket&) = delete;
    Socket& operator=(const Socket&) = delete;
    Socket(Socket&&) noexcept = default;
    Socket& operator=(Socket&&) noexcept = default;
};
```

---

## const-correctness 与 API 设计

### 使用 const 与 explicit

```cpp
class User {
public:
    const std::string& name() const { return name_; }
    void set_name(std::string name) { name_ = std::move(name); }

private:
    std::string name_;
};

struct Millis {
    explicit Millis(int v) : value(v) {}
    int value;
};
```

### 避免对象切片

```cpp
struct Shape { virtual ~Shape() = default; };
struct Circle : Shape { void draw() const; };

// ❌ Bad: Circle 被切片成 Shape
void draw(Shape shape);

// ✅ Good: 通过引用传递
void draw(const Shape& shape);
```

### 使用 override 和 final

```cpp
struct Base {
    virtual void run() = 0;
};

struct Worker final : Base {
    void run() override {}
};
```

---

## 错误处理与异常安全

### 用 RAII 兜底清理

```cpp
// ✅ Good: 异常发生时 RAII 自动清理
void process() {
    std::vector<int> data = load_data(); // safe cleanup
    do_work(data);
}
```

### 析构函数不要抛异常

```cpp
struct File {
    ~File() noexcept { close(); }
    void close();
};
```

### 正常失败优先返回期望值类型

```cpp
// ✅ 预期失败：使用 optional 或 expected
std::optional<int> parse_int(const std::string& s) {
    try {
        return std::stoi(s);
    } catch (...) {
        return std::nullopt;
    }
}
```

---

## 并发

### 保护共享数据

```cpp
// ❌ Bad: 数据竞争
int counter = 0;
void inc() { counter++; }

// ✅ Good: 原子操作
std::atomic<int> counter{0};
void inc() { counter.fetch_add(1, std::memory_order_relaxed); }
```

### 使用 RAII 锁

```cpp
std::mutex mu;
std::vector<int> data;

void add(int v) {
    std::lock_guard<std::mutex> lock(mu);
    data.push_back(v);
}
```

---

## 性能与分配

### 避免重复分配

```cpp
// ❌ Bad: 多次触发重分配
std::vector<int> build(int n) {
    std::vector<int> out;
    for (int i = 0; i < n; ++i) {
        out.push_back(i);
    }
    return out;
}

// ✅ Good: 预留容量
std::vector<int> build(int n) {
    std::vector<int> out;
    out.reserve(static_cast<size_t>(n));
    for (int i = 0; i < n; ++i) {
        out.push_back(i);
    }
    return out;
}
```

### 字符串拼接

```cpp
// ❌ Bad: 反复分配
std::string join(const std::vector<std::string>& parts) {
    std::string out;
    for (const auto& p : parts) {
        out += p;
    }
    return out;
}

// ✅ Good: 先计算总长度并 reserve
std::string join(const std::vector<std::string>& parts) {
    size_t total = 0;
    for (const auto& p : parts) {
        total += p.size();
    }
    std::string out;
    out.reserve(total);
    for (const auto& p : parts) {
        out += p;
    }
    return out;
}
```

---

## 模板与类型安全

### 优先使用受约束模板（C++20）

```cpp
// ❌ Bad: 泛型过宽
template <typename T>
T add(T a, T b) {
    return a + b;
}

// ✅ Good: 添加约束
template <typename T>
requires std::is_integral_v<T>
T add(T a, T b) {
    return a + b;
}
```

### 使用 static_assert 约束不变量

```cpp
template <typename T>
struct Packet {
    static_assert(std::is_trivially_copyable_v<T>,
        "Packet payload must be trivially copyable");
    T payload;
};
```

---

## 工具链与构建检查

```bash
# 警告
clang++ -Wall -Wextra -Werror -Wconversion -Wshadow -std=c++20 ...

# Sanitizer（调试构建）
clang++ -fsanitize=address,undefined -fno-omit-frame-pointer -g ...
clang++ -fsanitize=thread -fno-omit-frame-pointer -g ...

# 静态分析
clang-tidy src/*.cpp -- -std=c++20

# 格式化
clang-format -i src/*.cpp include/*.h
```

---

## 审查检查清单

### 安全与生命周期
- [ ] 所有权表达明确（RAII，默认 unique_ptr）
- [ ] 不存在悬垂引用或悬空视图
- [ ] 资源持有类型遵循 Rule of 0/3/5
- [ ] 业务代码中没有裸 `new/delete`
- [ ] 析构函数是 `noexcept` 且不会抛异常

### API 与设计
- [ ] const-correctness 应用一致
- [ ] 需要的构造函数均加 `explicit`
- [ ] 虚函数使用 override/final
- [ ] 不存在对象切片（按引用或指针传递）

### 并发
- [ ] 共享数据有保护（mutex 或 atomics）
- [ ] 加锁顺序一致
- [ ] 持锁期间不做阻塞操作

### 性能
- [ ] 避免不必要的分配（reserve、move）
- [ ] 热路径避免不必要拷贝
- [ ] 算法复杂度合理

### 工具与测试
- [ ] 开启警告后可干净构建
- [ ] 关键路径已运行 Sanitizer
- [ ] 静态分析（clang-tidy）结果已处理
