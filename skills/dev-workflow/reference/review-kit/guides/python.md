# Python 代码审查指南

> Python 代码审查指南，覆盖类型注解、async/await、测试、异常处理、性能优化等核心主题。

## 目录

- [类型注解](#类型注解)
- [异步编程](#异步编程)
- [异常处理](#异常处理)
- [常见陷阱](#常见陷阱)
- [测试最佳实践](#测试最佳实践)
- [性能优化](#性能优化)
- [代码风格](#代码风格)
- [审查检查清单](#审查检查清单)

---

## 类型注解

### 基础类型注解

```python
# ❌ 没有类型注解，IDE 无法提供帮助
def process_data(data, count):
    return data[:count]

# ✅ 使用类型注解
def process_data(data: str, count: int) -> str:
    return data[:count]

# ✅ 复杂类型使用 typing 模块
from typing import Optional, Union

def find_user(user_id: int) -> Optional[User]:
    """返回用户或 None"""
    return db.get(user_id)

def handle_input(value: Union[str, int]) -> str:
    """接受字符串或整数"""
    return str(value)
```

### 容器类型注解

```python
from typing import List, Dict, Set, Tuple, Sequence

# ❌ 不精确的类型
def get_names(users: list) -> list:
    return [u.name for u in users]

# ✅ 精确的容器类型（Python 3.9+ 可直接用 list[User]）
def get_names(users: List[User]) -> List[str]:
    return [u.name for u in users]

# ✅ 只读序列用 Sequence（更灵活）
def process_items(items: Sequence[str]) -> int:
    return len(items)

# ✅ 字典类型
def count_words(text: str) -> Dict[str, int]:
    words: Dict[str, int] = {}
    for word in text.split():
        words[word] = words.get(word, 0) + 1
    return words

# ✅ 元组（固定长度和类型）
def get_point() -> Tuple[float, float]:
    return (1.0, 2.0)

# ✅ 可变长度元组
def get_scores() -> Tuple[int, ...]:
    return (90, 85, 92, 88)
```

### 泛型与 TypeVar

```python
from typing import TypeVar, Generic, List, Callable

T = TypeVar('T')
K = TypeVar('K')
V = TypeVar('V')

# ✅ 泛型函数
def first(items: List[T]) -> T | None:
    return items[0] if items else None

# ✅ 有约束的 TypeVar
from typing import Hashable
H = TypeVar('H', bound=Hashable)

def dedupe(items: List[H]) -> List[H]:
    return list(set(items))

# ✅ 泛型类
class Cache(Generic[K, V]):
    def __init__(self) -> None:
        self._data: Dict[K, V] = {}

    def get(self, key: K) -> V | None:
        return self._data.get(key)

    def set(self, key: K, value: V) -> None:
        self._data[key] = value
```

### Callable 与回调函数

```python
from typing import Callable, Awaitable

# ✅ 函数类型注解
Handler = Callable[[str, int], bool]

def register_handler(name: str, handler: Handler) -> None:
    handlers[name] = handler

# ✅ 异步回调
AsyncHandler = Callable[[str], Awaitable[dict]]

async def fetch_with_handler(
    url: str,
    handler: AsyncHandler
) -> dict:
    return await handler(url)

# ✅ 返回函数的函数
def create_multiplier(factor: int) -> Callable[[int], int]:
    def multiplier(x: int) -> int:
        return x * factor
    return multiplier
```

### TypedDict 与结构化数据

```python
from typing import TypedDict, Required, NotRequired

# ✅ 定义字典结构
class UserDict(TypedDict):
    id: int
    name: str
    email: str
    age: NotRequired[int]  # Python 3.11+

def create_user(data: UserDict) -> User:
    return User(**data)

# ✅ 部分必需字段
class ConfigDict(TypedDict, total=False):
    debug: bool
    timeout: int
    host: Required[str]  # 这个必须有
```

### Protocol 与结构化子类型

```python
from typing import Protocol, runtime_checkable

# ✅ 定义协议（鸭子类型的类型检查）
class Readable(Protocol):
    def read(self, size: int = -1) -> bytes: ...

class Closeable(Protocol):
    def close(self) -> None: ...

# 组合协议
class ReadableCloseable(Readable, Closeable, Protocol):
    pass

def process_stream(stream: Readable) -> bytes:
    return stream.read()

# ✅ 运行时可检查的协议
@runtime_checkable
class Drawable(Protocol):
    def draw(self) -> None: ...

def render(obj: object) -> None:
    if isinstance(obj, Drawable):  # 运行时检查
        obj.draw()
```

---

## 异步编程

### async/await 基础

```python
import asyncio

# ❌ 同步阻塞调用
def fetch_all_sync(urls: list[str]) -> list[str]:
    results = []
    for url in urls:
        results.append(requests.get(url).text)  # 串行执行
    return results

# ✅ 异步并发调用
async def fetch_url(url: str) -> str:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()

async def fetch_all(urls: list[str]) -> list[str]:
    tasks = [fetch_url(url) for url in urls]
    return await asyncio.gather(*tasks)  # 并发执行
```

### 异步上下文管理器

```python
from contextlib import asynccontextmanager
from typing import AsyncIterator

# ✅ 异步上下文管理器类
class AsyncDatabase:
    async def __aenter__(self) -> 'AsyncDatabase':
        await self.connect()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb) -> None:
        await self.disconnect()

# ✅ 使用装饰器
@asynccontextmanager
async def get_connection() -> AsyncIterator[Connection]:
    conn = await create_connection()
    try:
        yield conn
    finally:
        await conn.close()

async def query_data():
    async with get_connection() as conn:
        return await conn.fetch("SELECT * FROM users")
```

### 异步迭代器

```python
from typing import AsyncIterator

# ✅ 异步生成器
async def fetch_pages(url: str) -> AsyncIterator[dict]:
    page = 1
    while True:
        data = await fetch_page(url, page)
        if not data['items']:
            break
        yield data
        page += 1

# ✅ 使用异步迭代
async def process_all_pages():
    async for page in fetch_pages("https://api.example.com"):
        await process_page(page)
```

### 任务管理与取消

```python
import asyncio

# ❌ 忘记处理取消
async def bad_worker():
    while True:
        await do_work()  # 无法正常取消

# ✅ 正确处理取消
async def good_worker():
    try:
        while True:
            await do_work()
    except asyncio.CancelledError:
        await cleanup()  # 清理资源
        raise  # 重新抛出，让调用者知道已取消

# ✅ 超时控制
async def fetch_with_timeout(url: str) -> str:
    try:
        async with asyncio.timeout(10):  # Python 3.11+
            return await fetch_url(url)
    except asyncio.TimeoutError:
        return ""

# ✅ 任务组（Python 3.11+）
async def fetch_multiple():
    async with asyncio.TaskGroup() as tg:
        task1 = tg.create_task(fetch_url("url1"))
        task2 = tg.create_task(fetch_url("url2"))
    # 所有任务完成后自动等待，异常会传播
    return task1.result(), task2.result()
```

### 同步与异步混合

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor

# ✅ 在异步代码中运行同步函数
async def run_sync_in_async():
    loop = asyncio.get_event_loop()
    # 使用线程池执行阻塞操作
    result = await loop.run_in_executor(
        None,  # 默认线程池
        blocking_io_function,
        arg1, arg2
    )
    return result

# ✅ 在同步代码中运行异步函数
def run_async_in_sync():
    return asyncio.run(async_function())

# ❌ 不要在异步代码中使用 time.sleep
async def bad_delay():
    time.sleep(1)  # 会阻塞整个事件循环！

# ✅ 使用 asyncio.sleep
async def good_delay():
    await asyncio.sleep(1)
```

### 信号量与限流

```python
import asyncio

# ✅ 使用信号量限制并发
async def fetch_with_limit(urls: list[str], max_concurrent: int = 10):
    semaphore = asyncio.Semaphore(max_concurrent)

    async def fetch_one(url: str) -> str:
        async with semaphore:
            return await fetch_url(url)

    return await asyncio.gather(*[fetch_one(url) for url in urls])

# ✅ 使用 asyncio.Queue 实现生产者-消费者
async def producer_consumer():
    queue: asyncio.Queue[str] = asyncio.Queue(maxsize=100)

    async def producer():
        for item in items:
            await queue.put(item)
        await queue.put(None)  # 结束信号

    async def consumer():
        while True:
            item = await queue.get()
            if item is None:
                break
            await process(item)
            queue.task_done()

    await asyncio.gather(producer(), consumer())
```

---

## 异常处理

### 异常捕获最佳实践

```python
# ❌ Catching too broad
try:
    result = risky_operation()
except:  # Catches everything, even KeyboardInterrupt!
    pass

# ❌ 捕获 Exception 但不处理
try:
    result = risky_operation()
except Exception:
    pass  # 吞掉所有异常，难以调试

# ✅ Catch specific exceptions
try:
    result = risky_operation()
except ValueError as e:
    logger.error(f"Invalid value: {e}")
    raise
except IOError as e:
    logger.error(f"IO error: {e}")
    return default_value

# ✅ 多个异常类型
try:
    result = parse_and_process(data)
except (ValueError, TypeError, KeyError) as e:
    logger.error(f"Data error: {e}")
    raise DataProcessingError(str(e)) from e
```

### 异常链

```python
# ❌ 丢失原始异常信息
try:
    result = external_api.call()
except APIError as e:
    raise RuntimeError("API failed")  # 丢失了原因

# ✅ 使用 from 保留异常链
try:
    result = external_api.call()
except APIError as e:
    raise RuntimeError("API failed") from e

# ✅ 显式断开异常链（少见情况）
try:
    result = external_api.call()
except APIError:
    raise RuntimeError("API failed") from None
```

### 自定义异常

```python
# ✅ 定义业务异常层次结构
class AppError(Exception):
    """应用基础异常"""
    pass

class ValidationError(AppError):
    """数据验证错误"""
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

class NotFoundError(AppError):
    """资源未找到"""
    def __init__(self, resource: str, id: str | int):
        self.resource = resource
        self.id = id
        super().__init__(f"{resource} with id {id} not found")

# 使用
def get_user(user_id: int) -> User:
    user = db.get(user_id)
    if not user:
        raise NotFoundError("User", user_id)
    return user
```

### 上下文管理器中的异常

```python
from contextlib import contextmanager

# ✅ 正确处理上下文管理器中的异常
@contextmanager
def transaction():
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

# ✅ 使用 ExceptionGroup（Python 3.11+）
def process_batch(items: list) -> None:
    errors = []
    for item in items:
        try:
            process(item)
        except Exception as e:
            errors.append(e)

    if errors:
        raise ExceptionGroup("Batch processing failed", errors)
```

---

## 常见陷阱

### 可变默认参数

```python
# ❌ Mutable default arguments
def add_item(item, items=[]):  # Bug! Shared across calls
    items.append(item)
    return items

# 问题演示
add_item(1)  # [1]
add_item(2)  # [1, 2] 而不是 [2]！

# ✅ Use None as default
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items

# ✅ 或使用 dataclass 的 field
from dataclasses import dataclass, field

@dataclass
class Container:
    items: list = field(default_factory=list)
```

### 可变类属性

```python
# ❌ Using mutable class attributes
class User:
    permissions = []  # Shared across all instances!

# 问题演示
u1 = User()
u2 = User()
u1.permissions.append("admin")
print(u2.permissions)  # ["admin"] - 被意外共享！

# ✅ Initialize in __init__
class User:
    def __init__(self):
        self.permissions = []

# ✅ 使用 dataclass
@dataclass
class User:
    permissions: list = field(default_factory=list)
```

### 循环中的闭包

```python
# ❌ 闭包捕获循环变量
funcs = []
for i in range(3):
    funcs.append(lambda: i)

print([f() for f in funcs])  # [2, 2, 2] 而不是 [0, 1, 2]！

# ✅ 使用默认参数捕获值
funcs = []
for i in range(3):
    funcs.append(lambda i=i: i)

print([f() for f in funcs])  # [0, 1, 2]

# ✅ 使用 functools.partial
from functools import partial

funcs = [partial(lambda x: x, i) for i in range(3)]
```

### is vs ==

```python
# ❌ 用 is 比较值
if x is 1000:  # 可能不工作！
    pass

# Python 会缓存小整数 (-5 到 256)
a = 256
b = 256
a is b  # True

a = 257
b = 257
a is b  # False！

# ✅ 用 == 比较值
if x == 1000:
    pass

# ✅ is 只用于 None 和单例
if x is None:
    pass

if x is True:  # 严格检查布尔值
    pass
```

### 字符串拼接性能

```python
# ❌ 循环中拼接字符串
result = ""
for item in large_list:
    result += str(item)  # O(n²) 复杂度

# ✅ 使用 join
result = "".join(str(item) for item in large_list)  # O(n)

# ✅ 使用 StringIO 构建大字符串
from io import StringIO

buffer = StringIO()
for item in large_list:
    buffer.write(str(item))
result = buffer.getvalue()
```

---

## 测试最佳实践

### pytest 基础

```python
import pytest

# ✅ 清晰的测试命名
def test_user_creation_with_valid_email():
    user = User(email="test@example.com")
    assert user.email == "test@example.com"

def test_user_creation_with_invalid_email_raises_error():
    with pytest.raises(ValidationError):
        User(email="invalid")

# ✅ 使用参数化测试
@pytest.mark.parametrize("input,expected", [
    ("hello", "HELLO"),
    ("World", "WORLD"),
    ("", ""),
    ("123", "123"),
])
def test_uppercase(input: str, expected: str):
    assert input.upper() == expected

# ✅ 测试异常
def test_division_by_zero():
    with pytest.raises(ZeroDivisionError) as exc_info:
        1 / 0
    assert "division by zero" in str(exc_info.value)
```

### Fixtures

```python
import pytest
from typing import Generator

# ✅ 基础 fixture
@pytest.fixture
def user() -> User:
    return User(name="Test User", email="test@example.com")

def test_user_name(user: User):
    assert user.name == "Test User"

# ✅ 带清理的 fixture
@pytest.fixture
def database() -> Generator[Database, None, None]:
    db = Database()
    db.connect()
    yield db
    db.disconnect()  # 测试后清理

# ✅ 异步 fixture
@pytest.fixture
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient() as client:
        yield client

# ✅ 共享 fixture（conftest.py）
# conftest.py
@pytest.fixture(scope="session")
def app():
    """整个测试会话共享的 app 实例"""
    return create_app()

@pytest.fixture(scope="module")
def db(app):
    """每个测试模块共享的数据库连接"""
    return app.db
```

### Mock 与 Patch

```python
from unittest.mock import Mock, patch, AsyncMock

# ✅ Mock 外部依赖
def test_send_email():
    mock_client = Mock()
    mock_client.send.return_value = True

    service = EmailService(client=mock_client)
    result = service.send_welcome_email("user@example.com")

    assert result is True
    mock_client.send.assert_called_once_with(
        to="user@example.com",
        subject="Welcome!",
        body=ANY,
    )

# ✅ Patch 模块级函数
@patch("myapp.services.external_api.call")
def test_with_patched_api(mock_call):
    mock_call.return_value = {"status": "ok"}

    result = process_data()

    assert result["status"] == "ok"

# ✅ 异步 Mock
async def test_async_function():
    mock_fetch = AsyncMock(return_value={"data": "test"})

    with patch("myapp.client.fetch", mock_fetch):
        result = await get_data()

    assert result == {"data": "test"}
```

### 测试组织

```python
# ✅ 使用类组织相关测试
class TestUserAuthentication:
    """用户认证相关测试"""

    def test_login_with_valid_credentials(self, user):
        assert authenticate(user.email, "password") is True

    def test_login_with_invalid_password(self, user):
        assert authenticate(user.email, "wrong") is False

    def test_login_locks_after_failed_attempts(self, user):
        for _ in range(5):
            authenticate(user.email, "wrong")
        assert user.is_locked is True

# ✅ 使用 mark 标记测试
@pytest.mark.slow
def test_large_data_processing():
    pass

@pytest.mark.integration
def test_database_connection():
    pass

# 运行特定标记的测试：pytest -m "not slow"
```

### 覆盖率与质量

```python
# pytest.ini 或 pyproject.toml
[tool.pytest.ini_options]
addopts = "--cov=myapp --cov-report=term-missing --cov-fail-under=80"
testpaths = ["tests"]

# ✅ 测试边界情况
def test_empty_input():
    assert process([]) == []

def test_none_input():
    with pytest.raises(TypeError):
        process(None)

def test_large_input():
    large_data = list(range(100000))
    result = process(large_data)
    assert len(result) == 100000
```

---

## 性能优化

### 数据结构选择

```python
# ❌ 列表查找 O(n)
if item in large_list:  # 慢
    pass

# ✅ 集合查找 O(1)
large_set = set(large_list)
if item in large_set:  # 快
    pass

# ✅ 使用 collections 模块
from collections import Counter, defaultdict, deque

# 计数
word_counts = Counter(words)
most_common = word_counts.most_common(10)

# 默认字典
graph = defaultdict(list)
graph[node].append(neighbor)

# 双端队列（两端操作 O(1)）
queue = deque()
queue.appendleft(item)  # O(1) vs list.insert(0, item) O(n)
```

### 生成器与迭代器

```python
# ❌ 一次性加载所有数据
def get_all_users():
    return [User(row) for row in db.fetch_all()]  # 内存占用大

# ✅ 使用生成器
def get_all_users():
    for row in db.fetch_all():
        yield User(row)  # 懒加载

# ✅ 生成器表达式
sum_of_squares = sum(x**2 for x in range(1000000))  # 不创建列表

# ✅ itertools 模块
from itertools import islice, chain, groupby

# 只取前 10 个
first_10 = list(islice(infinite_generator(), 10))

# 链接多个迭代器
all_items = chain(list1, list2, list3)

# 分组
for key, group in groupby(sorted(items, key=get_key), key=get_key):
    process_group(key, list(group))
```

### 缓存

```python
from functools import lru_cache, cache

# ✅ LRU 缓存
@lru_cache(maxsize=128)
def expensive_computation(n: int) -> int:
    return sum(i**2 for i in range(n))

# ✅ 无限缓存（Python 3.9+）
@cache
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# ✅ 手动缓存（需要更多控制时）
class DataService:
    def __init__(self):
        self._cache: dict[str, Any] = {}
        self._cache_ttl: dict[str, float] = {}

    def get_data(self, key: str) -> Any:
        if key in self._cache:
            if time.time() < self._cache_ttl[key]:
                return self._cache[key]

        data = self._fetch_data(key)
        self._cache[key] = data
        self._cache_ttl[key] = time.time() + 300  # 5 分钟
        return data
```

### 并行处理

```python
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

# ✅ IO 密集型使用线程池
def fetch_all_urls(urls: list[str]) -> list[str]:
    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(fetch_url, urls))
    return results

# ✅ CPU 密集型使用进程池
def process_large_dataset(data: list) -> list:
    with ProcessPoolExecutor() as executor:
        results = list(executor.map(heavy_computation, data))
    return results

# ✅ 使用 as_completed 获取最先完成的结果
from concurrent.futures import as_completed

with ThreadPoolExecutor() as executor:
    futures = {executor.submit(fetch, url): url for url in urls}
    for future in as_completed(futures):
        url = futures[future]
        try:
            result = future.result()
        except Exception as e:
            print(f"{url} failed: {e}")
```

---

## 代码风格

### PEP 8 要点

```python
# ✅ 命名规范
class MyClass:  # 类名 PascalCase
    MAX_SIZE = 100  # 常量 UPPER_SNAKE_CASE

    def method_name(self):  # 方法 snake_case
        local_var = 1  # 变量 snake_case

# ✅ 导入顺序
# 1. 标准库
import os
import sys
from typing import Optional

# 2. 第三方库
import numpy as np
import pandas as pd

# 3. 本地模块
from myapp import config
from myapp.utils import helper

# ✅ 行长度限制（79 或 88 字符）
# 长表达式的换行
result = (
    long_function_name(arg1, arg2, arg3)
    + another_long_function(arg4, arg5)
)

# ✅ 空行规范
class MyClass:
    """类文档字符串"""

    def method_one(self):
        pass

    def method_two(self):  # 方法间一个空行
        pass


def top_level_function():  # 顶层定义间两个空行
    pass
```

### 文档字符串

```python
# ✅ Google 风格文档字符串
def calculate_area(width: float, height: float) -> float:
    """计算矩形面积。

    Args:
        width: 矩形的宽度（必须为正数）。
        height: 矩形的高度（必须为正数）。

    Returns:
        矩形的面积。

    Raises:
        ValueError: 如果 width 或 height 为负数。

    Example:
        >>> calculate_area(3, 4)
        12.0
    """
    if width < 0 or height < 0:
        raise ValueError("Dimensions must be positive")
    return width * height

# ✅ 类文档字符串
class DataProcessor:
    """处理和转换数据的工具类。

    Attributes:
        source: 数据来源路径。
        format: 输出格式（'json' 或 'csv'）。

    Example:
        >>> processor = DataProcessor("data.csv")
        >>> processor.process()
    """
```

### 现代 Python 特性

```python
# ✅ f-string（Python 3.6+）
name = "World"
print(f"Hello, {name}!")

# 带表达式
print(f"Result: {1 + 2 = }")  # "Result: 1 + 2 = 3"

# ✅ 海象运算符（Python 3.8+）
if (n := len(items)) > 10:
    print(f"List has {n} items")

# ✅ 位置参数分隔符（Python 3.8+）
def greet(name, /, greeting="Hello", *, punctuation="!"):
    """name 只能位置传参，punctuation 只能关键字传参"""
    return f"{greeting}, {name}{punctuation}"

# ✅ 模式匹配（Python 3.10+）
def handle_response(response: dict):
    match response:
        case {"status": "ok", "data": data}:
            return process_data(data)
        case {"status": "error", "message": msg}:
            raise APIError(msg)
        case _:
            raise ValueError("Unknown response format")
```

---

## 审查检查清单

### 类型安全
- [ ] 函数有类型注解（参数和返回值）
- [ ] 使用 `Optional` 明确可能为 None
- [ ] 泛型类型正确使用
- [ ] mypy 检查通过（无错误）
- [ ] 避免使用 `Any`，必要时添加注释说明

### 异步代码
- [ ] async/await 正确配对使用
- [ ] 没有在异步代码中使用阻塞调用
- [ ] 正确处理 `CancelledError`
- [ ] 使用 `asyncio.gather` 或 `TaskGroup` 并发执行
- [ ] 资源正确清理（async context manager）

### 异常处理
- [ ] 捕获特定异常类型，不使用裸 `except:`
- [ ] 异常链使用 `from` 保留原因
- [ ] 自定义异常继承自合适的基类
- [ ] 异常信息有意义，便于调试

### 数据结构
- [ ] 没有使用可变默认参数（list、dict、set）
- [ ] 类属性不是可变对象
- [ ] 选择正确的数据结构（set vs list 查找）
- [ ] 大数据集使用生成器而非列表

### 测试
- [ ] 测试覆盖率达标（建议 ≥80%）
- [ ] 测试命名清晰描述测试场景
- [ ] 边界情况有测试覆盖
- [ ] Mock 正确隔离外部依赖
- [ ] 异步代码有对应的异步测试

### 代码风格
- [ ] 遵循 PEP 8 风格指南
- [ ] 函数和类有 docstring
- [ ] 导入顺序正确（标准库、第三方、本地）
- [ ] 命名一致且有意义
- [ ] 使用现代 Python 特性（f-string、海象运算符等）

### 性能
- [ ] 避免循环中重复创建对象
- [ ] 字符串拼接使用 join
- [ ] 合理使用缓存（@lru_cache）
- [ ] IO/CPU 密集型使用合适的并行方式
