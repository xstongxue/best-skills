# 安全审查指南

基于 OWASP Top 10 与工程最佳实践的安全代码审查清单。

## 认证与授权

### 身份认证
- [ ] 密码使用强哈希算法（bcrypt、argon2）
- [ ] 启用密码复杂度要求
- [ ] 连续失败后有账户锁定策略
- [ ] 密码重置流程安全
- [ ] 敏感操作启用多因素认证
- [ ] 会话令牌具备密码学随机性
- [ ] 已实现会话超时

### 权限控制
- [ ] 每个请求都进行权限校验
- [ ] 遵循最小权限原则
- [ ] 基于角色的访问控制（RBAC）实现正确
- [ ] 不存在权限提升路径
- [ ] 已防护 IDOR（不安全的直接对象引用）
- [ ] API 端点按权限进行保护

### JWT 安全
```typescript
// ❌ 不安全的 JWT 配置
jwt.sign(payload, 'weak-secret');

// ✅ 安全的 JWT 配置
jwt.sign(payload, process.env.JWT_SECRET, {
  algorithm: 'RS256',
  expiresIn: '15m',
  issuer: 'your-app',
  audience: 'your-api'
});

// ❌ 仅 decode 未校验签名
const decoded = jwt.decode(token);  // No signature verification!

// ✅ 校验签名与声明
const decoded = jwt.verify(token, publicKey, {
  algorithms: ['RS256'],
  issuer: 'your-app',
  audience: 'your-api'
});
```

## 输入校验

### 防 SQL 注入
```python
# ❌ 存在 SQL 注入风险
query = f"SELECT * FROM users WHERE id = {user_id}"

# ✅ 参数化查询
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))

# ✅ 使用 ORM 自动转义
User.objects.filter(id=user_id)
```

### 防 XSS
```typescript
// ❌ 存在 XSS 风险
element.innerHTML = userInput;

// ✅ 纯文本使用 textContent
element.textContent = userInput;

// ✅ HTML 使用 DOMPurify
element.innerHTML = DOMPurify.sanitize(userInput);

// ✅ React 默认会转义（需警惕 dangerouslySetInnerHTML）
return <div>{userInput}</div>;  // Safe
return <div dangerouslySetInnerHTML={{__html: userInput}} />;  // Dangerous!
```

### 防命令注入
```python
# ❌ 存在命令注入风险
os.system(f"convert {filename} output.png")

# ✅ subprocess + 列表参数
subprocess.run(['convert', filename, 'output.png'], check=True)

# ✅ 输入校验与清洗
import shlex
safe_filename = shlex.quote(filename)
```

### 防路径穿越
```typescript
// ❌ 存在路径穿越风险
const filePath = `./uploads/${req.params.filename}`;

// ✅ 校验并清洗路径
const path = require('path');
const safeName = path.basename(req.params.filename);
const filePath = path.join('./uploads', safeName);

// 确认路径仍在 uploads 目录内
if (!filePath.startsWith(path.resolve('./uploads'))) {
  throw new Error('Invalid path');
}
```

## 数据保护

### 敏感数据处理
- [ ] 源码中无密钥/凭证
- [ ] 密钥存储在环境变量或密钥管理系统
- [ ] 敏感数据静态加密
- [ ] 敏感数据传输加密（HTTPS）
- [ ] 个人信息处理符合合规要求（如 GDPR）
- [ ] 日志不记录敏感数据
- [ ] 按要求支持安全删除

### 配置安全
```yaml
# ❌ 配置文件中明文保存密钥
database:
  password: "super-secret-password"

# ✅ 使用环境变量引用
database:
  password: ${DATABASE_PASSWORD}
```

### 错误信息
```typescript
// ❌ 泄露内部敏感信息
catch (error) {
  return res.status(500).json({
    error: error.stack,  // Exposes internal details
    query: sqlQuery      // Exposes database structure
  });
}

// ✅ 对外返回通用错误，对内记录详情
catch (error) {
  logger.error('Database error', { error, userId });  // Log internally
  return res.status(500).json({
    error: 'An unexpected error occurred'
  });
}
```

## API 安全

### 限流
- [ ] 公共端点均有限流
- [ ] 认证相关端点有更严格限流
- [ ] 同时支持按用户与按 IP 限流
- [ ] 超限返回有友好降级

### CORS 配置
```typescript
// ❌ 过于宽松的 CORS
app.use(cors({ origin: '*' }));

// ✅ 收敛的 CORS 策略
app.use(cors({
  origin: ['https://your-app.com'],
  methods: ['GET', 'POST'],
  credentials: true
}));
```

### HTTP 安全头
```typescript
// 建议设置的安全头
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  noSniff: true,
  xssFilter: true,
  frameguard: { action: 'deny' }
}));
```

## 密码学

### 安全实践
- [ ] 使用成熟算法（AES-256、RSA-2048+）
- [ ] 不自行实现密码算法
- [ ] 使用密码学安全随机数
- [ ] 做好密钥管理与轮换
- [ ] 密钥安全存储（HSM、KMS）

### 常见错误
```typescript
// ❌ 弱随机
const token = Math.random().toString(36);

// ✅ 密码学安全随机
const crypto = require('crypto');
const token = crypto.randomBytes(32).toString('hex');

// ❌ 用 MD5/SHA1 处理密码
const hash = crypto.createHash('md5').update(password).digest('hex');

// ✅ 用 bcrypt 或 argon2
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash(password, 12);
```

## 依赖安全

### 检查清单
- [ ] 依赖仅来自可信来源
- [ ] 无已知漏洞（npm audit、cargo audit）
- [ ] 依赖保持更新
- [ ] 已提交锁文件（package-lock.json、Cargo.lock）
- [ ] 依赖最小化
- [ ] 许可证合规已核查

### 审计命令
```bash
# Node.js
npm audit
npm audit fix

# Python
pip-audit
safety check

# Rust
cargo audit

# 通用
snyk test
```

## 日志与监控

### 安全日志
- [ ] 日志中不包含敏感信息（密码、Token、PII）
- [ ] 日志具备防篡改能力
- [ ] 日志保留策略合理
- [ ] 关键安全事件有日志（登录失败、权限变更）
- [ ] 已防护日志注入

```typescript
// ❌ 日志包含敏感信息
logger.info(`User login: ${email}, password: ${password}`);

// ✅ 安全日志
logger.info('User login attempt', { email, success: true });
```

## 安全问题分级

| 级别 | 描述 | 处理动作 |
|------|------|----------|
| **严重（Critical）** | 可被立即利用，存在数据泄露风险 | 阻断合并，立即修复 |
| **高（High）** | 漏洞影响显著，需特定条件触发 | 阻断合并，发布前修复 |
| **中（Medium）** | 中等风险，属于纵深防御薄弱点 | 建议修复，可带跟踪项合并 |
| **低（Low）** | 轻微问题，偏最佳实践违规 | 可后续修复，不阻断 |
| **信息（Info）** | 改进建议 | 可选优化 |