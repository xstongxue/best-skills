# C 代码审查指南

> 面向 C 的代码审查指南，重点关注内存安全、未定义行为（UB）与可移植性。示例默认基于 C11。

## 目录

- [指针与缓冲区安全](#指针与缓冲区安全)
- [所有权与资源管理](#所有权与资源管理)
- [未定义行为陷阱](#未定义行为陷阱)
- [整数类型与溢出](#整数类型与溢出)
- [错误处理](#错误处理)
- [并发](#并发)
- [宏与预处理器](#宏与预处理器)
- [API 设计与 const](#api-设计与-const)
- [工具链与构建检查](#工具链与构建检查)
- [审查检查清单](#审查检查清单)

---

## 指针与缓冲区安全

### 缓冲区必须携带长度

```c
// ❌ Bad: 忽略目标缓冲区大小
bool copy_name(char *dst, size_t dst_size, const char *src) {
    strcpy(dst, src);
    return true;
}

// ✅ Good: 校验长度并保证终止符
bool copy_name(char *dst, size_t dst_size, const char *src) {
    size_t len = strlen(src);
    if (len + 1 > dst_size) {
        return false;
    }
    memcpy(dst, src, len + 1);
    return true;
}
```

### 避免危险 API

优先使用 `snprintf`、`fgets` 和显式边界检查，避免使用 `gets`、`strcpy`、`sprintf`。

```c
// ❌ Bad: 无边界写入
sprintf(buf, "%s", input);

// ✅ Good: 有边界写入
snprintf(buf, buf_size, "%s", input);
```

### 使用正确的拷贝原语

```c
// ❌ Bad: 区域重叠时仍使用 memcpy
memcpy(dst, src, len);

// ✅ Good: memmove 可处理重叠
memmove(dst, src, len);
```

---

## 所有权与资源管理

### 一次分配，一次释放

明确所有权，并在每条错误路径上都做清理。

```c
// ✅ Good: cleanup 标签避免泄漏
int load_file(const char *path) {
    int rc = -1;
    FILE *f = NULL;
    char *buf = NULL;

    f = fopen(path, "rb");
    if (!f) {
        goto cleanup;
    }
    buf = malloc(4096);
    if (!buf) {
        goto cleanup;
    }

    if (fread(buf, 1, 4096, f) == 0) {
        goto cleanup;
    }

    rc = 0;

cleanup:
    free(buf);
    if (f) {
        fclose(f);
    }
    return rc;
}
```

---

## 未定义行为陷阱

### 常见 UB 模式

```c
// ❌ Bad: use after free
char *p = malloc(10);
free(p);
p[0] = 'a';

// ❌ Bad: 读取未初始化变量
int x;
if (x > 0) { /* UB */ }

// ❌ Bad: 有符号整数溢出
int sum = a + b;
```

### 避免越过对象边界的指针运算

```c
// ❌ Bad: 指针先越界再解引用
int arr[4];
int *p = arr + 4;
int v = *p; // UB
```

---

## 整数类型与溢出

### 避免有符号/无符号转换陷阱

```c
// ❌ Bad: 负数被转换为巨大的 size_t
int len = -1;
size_t n = len;

// ✅ Good: 先校验再转换
if (len < 0) {
    return -1;
}
size_t n = (size_t)len;
```

### 在大小计算中检查溢出

```c
// ❌ Bad: 乘法可能溢出
size_t bytes = count * sizeof(Item);

// ✅ Good: 乘法前先检查
if (count > SIZE_MAX / sizeof(Item)) {
    return NULL;
}
size_t bytes = count * sizeof(Item);
```

---

## 错误处理

### 始终检查返回值

```c
// ❌ Bad: 忽略错误
fread(buf, 1, size, f);

// ✅ Good: 正确处理错误
size_t read = fread(buf, 1, size, f);
if (read != size && ferror(f)) {
    return -1;
}
```

### 统一错误契约

- 使用明确约定：成功返回 0，失败返回负值。
- 说明成功与失败分支下的所有权规则。
- 若使用 `errno`，仅在真实失败时设置。

---

## 并发

### volatile 不是同步原语

```c
// ❌ Bad: 数据竞争
volatile int stop = 0;
void worker(void) {
    while (!stop) { /* ... */ }
}

// ✅ Good: 使用 C11 原子类型
_Atomic int stop = 0;
void worker(void) {
    while (!atomic_load(&stop)) { /* ... */ }
}
```

### 共享状态应使用互斥锁

共享数据应由 `pthread_mutex_t` 或同类机制保护。避免持锁执行 I/O。

---

## 宏与预处理器

### 宏参数要加括号

```c
// ❌ Bad: 宏遇到副作用参数会出问题
#define MIN(a, b) ((a) < (b) ? (a) : (b))
int x = MIN(i++, j++);

// ✅ Good: 优先 static inline 函数
static inline int min_int(int a, int b) {
    return a < b ? a : b;
}
```

---

## API 设计与 const

### const 正确性与长度参数

```c
// ✅ Good: 输入 const + 显式长度
int hash_bytes(const uint8_t *data, size_t len, uint8_t *out);
```

### 明确空指针语义

要清晰说明指针是否允许为 `NULL`。可行时优先返回错误码，而不是返回 `NULL`。

---

## 工具链与构建检查

```bash
# 警告
clang -Wall -Wextra -Werror -Wconversion -Wshadow -std=c11 ...

# Sanitizer（调试构建）
clang -fsanitize=address,undefined -fno-omit-frame-pointer -g ...
clang -fsanitize=thread -fno-omit-frame-pointer -g ...

# 静态分析
clang-tidy src/*.c -- -std=c11
cppcheck --enable=warning,performance,portability src/

# 格式化
clang-format -i src/*.c include/*.h
```

---

## 审查检查清单

### 内存与 UB
- [ ] 所有缓冲区接口都带显式长度参数
- [ ] 不存在越界访问或越过对象边界的指针运算
- [ ] 不存在 use after free 或未初始化读取
- [ ] 有符号溢出与位移规则被正确处理

### API 与设计
- [ ] 所有权规则有文档且保持一致
- [ ] 输入参数遵循 const-correctness
- [ ] 错误契约清晰且一致

### 并发
- [ ] 共享状态无数据竞争
- [ ] 未将 volatile 用作同步机制
- [ ] 锁持有时间尽可能短

### 工具与测试
- [ ] 开启警告后可干净构建
- [ ] 关键路径已运行 Sanitizer
- [ ] 静态分析告警已处理
