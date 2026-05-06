# Qt 代码审查指南

> 专注于对象模型、信号/槽、事件循环和 GUI 性能的 Qt 代码审查指南。示例基于 Qt 5.15 / Qt 6。

## 目录

- [对象模型与内存管理](#对象模型与内存管理)
- [信号与槽](#信号与槽)
- [容器与字符串](#容器与字符串)
- [线程与并发](#线程与并发)
- [图形界面与控件](#图形界面与控件)
- [元对象系统](#元对象系统)
- [审查清单](#审查清单)

---

## 对象模型与内存管理

### 使用父子对象所有权机制
Qt 的 `QObject` 层次结构会自动管理内存。对于 `QObject`，优先设置父对象，而不是手动 `delete` 或使用智能指针。

```cpp
// ❌ 手动管理容易导致内存泄漏
QWidget* w = new QWidget();
QLabel* l = new QLabel();
l->setParent(w);
// ... 如果 w 被删除，l 会自动被删除。但如果 w 泄漏，l 也会泄漏。

// ✅ 在构造函数中指定父对象
QWidget* w = new QWidget(this); // 归 'this' 所有
QLabel* l = new QLabel(w);      // 归 'w' 所有
```

### 配合 QObject 使用智能指针
如果 `QObject` 没有父对象，使用 `QScopedPointer` 或带有自定义删除器的 `std::unique_ptr`（如果需要跨线程，则用于 `deleteLater`）。除非必要，否则避免对 `QObject` 使用 `std::shared_ptr`，因为它会混淆父子系统的所有权。

```cpp
// ✅ 用于没有父对象的局部/成员 QObject 的作用域指针
QScopedPointer<MyObject> obj(new MyObject());

// ✅ 防止悬空指针的安全指针
QPointer<MyObject> safePtr = obj.data();
if (safePtr) {
    safePtr->doSomething();
}
```

### 使用 `deleteLater()`
对于异步删除，尤其是在槽或事件处理程序中，请使用 `deleteLater()` 而不是 `delete`，以确保存储在事件循环中的待处理事件能够处理完毕。

---

## 信号与槽

### 优先使用函数指针语法
使用编译时检查的语法（Qt 5+）。

```cpp
// ❌ 基于字符串（仅运行时检查，速度较慢）
connect(sender, SIGNAL(valueChanged(int)), receiver, SLOT(updateValue(int)));

// ✅ 编译时检查
connect(sender, &Sender::valueChanged, receiver, &Receiver::updateValue);
```

### 连接类型
跨线程时要明确或注意连接类型。
- `Qt::AutoConnection`（默认）：如果同线程则直连，不同线程则队列连接。
- `Qt::QueuedConnection`: 始终投递事件（跨线程安全）。
- `Qt::DirectConnection`: 立即调用（如果跨线程访问非线程安全数据则很危险）。

### 避免循环
检查可能导致无限信号循环的逻辑（例如 `valueChanged` -> `setValue` -> `valueChanged`）。在设置值之前阻塞信号或检查相等性。

```cpp
void MyClass::setValue(int v) {
    if (m_value == v) return; // ? Good: 打破循环
    m_value = v;
    emit valueChanged(v);
}
```

---

## 容器与字符串

### QString 效率
- 使用 `QStringLiteral("...")` 进行编译时字符串创建，避免运行时分配。
- 使用 `QLatin1String` 与 ASCII 字面量进行比较（在 Qt 5 中）。
- 优先使用 `arg()` 进行格式化（或 `QStringBuilder` 的 `%` 运算符）。

```cpp
// ❌ 运行时转换
if (str == "test") ...

// ✅ 优先使用 QLatin1String 与 ASCII 字面量进行比较（在 Qt 5 中）
if (str == QLatin1String("test")) ... // Qt 5
if (str == u"test"_s) ...             // Qt 6
```

### 容器选择
- **Qt 6**: `QList` 现在是默认选择（与 `QVector` 统一）。
- **Qt 5**: 优先使用 `QVector` 而不是 `QList`，以获得连续内存和缓存性能，除非需要稳定的引用。
- 注意隐式共享（写时复制）。按值传递容器很便宜，*直到*发生修改。只读访问优先使用 `const &`。

```cpp
// ❌ 如果函数修改 'list'，则强制深拷贝
void process(QVector<int> list) {
    list[0] = 1; 
}

// ✅ 只读引用
void process(const QVector<int>& list) { ... }
```

---

## 线程与并发

### 子类化 QThread 与 Worker 对象
优先使用 "Worker 对象" 模式，而不是子类化 `QThread` 的实现细节。

```cpp
// ❌ 业务逻辑在 QThread::run() 内部
class MyThread : public QThread {
    void run() override { ... } 
};

// ✅ Worker 对象移动到线程 
QThread* thread = new QThread;
Worker* worker = new Worker;
worker->moveToThread(thread);
connect(thread, &QThread::started, worker, &Worker::process);
thread->start();
```

### GUI 线程安全
**切勿** 从后台线程访问 UI 控件（`QWidget` 及其子类）。使用信号/槽将更新通信到主线程。

---

## 图形界面与控件

### 逻辑分离
将业务逻辑保留在 UI 类（`MainWindow`, `Dialog`）之外。UI 类应仅处理显示和用户输入转发。

### 布局
避免固定大小（`setGeometry`, `resize`）。使用布局（`QVBoxLayout`, `QGridLayout`）来优雅地处理不同的 DPI 和窗口大小调整。

### 阻塞事件循环
切勿在主线程中执行长时间运行的操作（导致 GUI 冻结）。
- **Bad**: `Sleep()`, `while(busy)`, 同步网络调用。
- **Good**: `QProcess`, `QThread`, `QtConcurrent`, 或异步 API（`QNetworkAccessManager`）。

---

## 元对象系统

### 属性与枚举
对暴露给 QML 或需要内省的值使用 `Q_PROPERTY`。
使用 `Q_ENUM` 启用枚举的字符串转换。

```cpp
class MyObject : public QObject {
    Q_OBJECT
    Q_PROPERTY(int value READ value WRITE setValue NOTIFY valueChanged)
public:
    enum State { Idle, Running };
    Q_ENUM(State)
    // ...
};
```

### qobject_cast
对 QObject 使用 `qobject_cast<T*>` 而不是 `dynamic_cast`。它更快且不需要 RTTI。

---

## 审查清单

- [ ] **内存**: 父子关系是否正确？是否避免了悬空指针（使用 `QPointer`）？
- [ ] **信号**: 连接是否已检查？Lambda 表达式是否使用了安全的捕获（上下文对象）？
- [ ] **线程**: UI 是否仅从主线程访问？长任务是否已卸载？
- [ ] **字符串**: 是否适当地使用了 `QStringLiteral` 或 `tr()`？
- [ ] **风格**: 命名约定（方法使用 camelCase，类使用 PascalCase）。
- [ ] **资源**: 资源（图像、样式）是否从 `.qrc` 加载？