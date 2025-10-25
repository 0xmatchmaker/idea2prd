# ✅ Vercel 部署前检查清单

## 📋 部署前准备（按顺序执行）

### 1️⃣ Supabase 配置 ✅ / ❌

- [ ] 已创建 Supabase 项目
- [ ] 已执行 `docs/supabase-setup.sql` 脚本
- [ ] 已启用 Email 认证
- [ ] 已复制 `NEXT_PUBLIC_SUPABASE_URL`
- [ ] 已复制 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**测试方法**:
```bash
# 在浏览器测试 Supabase 连接
curl https://your-project.supabase.co/rest/v1/
```

---

### 2️⃣ OpenRouter 配置 ✅ / ❌

- [ ] 已注册 OpenRouter 账号
- [ ] 已创建 API key
- [ ] 账户余额充足（建议 $5+）
- [ ] 已复制 `NEXT_PUBLIC_OPENROUTER_API_KEY`

**测试方法**:
```bash
# 测试 API key 是否有效
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer $YOUR_API_KEY"
```

---

### 3️⃣ 本地环境变量检查 ✅ / ❌

- [ ] 已创建 `.env.local` 文件
- [ ] 包含所有必需的环境变量
- [ ] 环境变量值正确无误

**检查方法**:
```bash
cat .env.local
```

应该包含：
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-...
```

---

### 4️⃣ 本地构建测试 ✅ / ❌

- [ ] 依赖安装成功
- [ ] 本地开发服务器运行正常
- [ ] 生产构建成功
- [ ] 无 TypeScript 错误（或已忽略）

**测试命令**:
```bash
# 安装依赖
pnpm install

# 开发模式测试
pnpm dev
# 访问 http://localhost:3000

# 生产构建测试（重要！）
pnpm build

# 启动生产服务器
pnpm start
# 访问 http://localhost:3000
```

---

### 5️⃣ Git 仓库准备 ✅ / ❌

- [ ] 代码已提交到 Git
- [ ] 已推送到 GitHub/GitLab/Bitbucket
- [ ] `.env.local` 已在 `.gitignore` 中
- [ ] 仓库访问权限正确

**检查命令**:
```bash
# 查看 Git 状态
git status

# 查看远程仓库
git remote -v

# 确认 .env.local 被忽略
git status | grep .env.local  # 应该没有输出
```

---

### 6️⃣ Vercel 项目配置 ✅ / ❌

- [ ] 已连接 GitHub 仓库
- [ ] 已添加环境变量（见下方）
- [ ] 构建命令设置正确：`pnpm build`
- [ ] 输出目录设置正确：`.next`

**Vercel 环境变量（必须添加）**:

| 变量名 | 示例值 | 说明 |
|--------|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase 项目 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase 公开密钥 |
| `NEXT_PUBLIC_OPENROUTER_API_KEY` | `sk-or-v1-...` | OpenRouter API 密钥 |

**可选环境变量**:
| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `NEXT_PUBLIC_DEFAULT_AI_MODEL` | `anthropic/claude-3.5-sonnet` | 文本生成模型 |
| `NEXT_PUBLIC_IMAGE_MODEL` | `google/gemini-2.5-flash-preview-image` | 图片生成模型 |

---

### 7️⃣ 首次部署 ✅ / ❌

- [ ] Vercel 构建成功（无错误）
- [ ] 部署成功并获得 URL
- [ ] 可以访问首页
- [ ] 可以访问 `/login` 页面

**部署后验证**:
```bash
# 访问你的 Vercel 域名
https://your-app.vercel.app
https://your-app.vercel.app/login
https://your-app.vercel.app/workspace
```

---

## 🧪 部署后功能测试

### 测试 1: 用户注册和登录 ✅ / ❌

1. [ ] 访问 `/login`
2. [ ] 点击"注册"
3. [ ] 输入邮箱和密码
4. [ ] 提交注册
5. [ ] 检查邮箱收到验证邮件（可能在垃圾邮件中）
6. [ ] 点击验证链接
7. [ ] 使用邮箱和密码登录
8. [ ] 成功跳转到 `/workspace`

**如果失败**:
- 检查 Supabase Email Auth 是否启用
- 检查 Supabase URL 和 API key 是否正确

---

### 测试 2: AI 工作流生成 ✅ / ❌

1. [ ] 登录后在 Workspace 页面
2. [ ] 在左侧输入框输入需求描述
3. [ ] 点击"生成工作流"
4. [ ] 等待 10-20 秒
5. [ ] 右侧显示工作流节点图
6. [ ] 没有错误提示

**如果失败**:
- 检查 OpenRouter API key 是否正确
- 检查 OpenRouter 账户余额是否充足
- 打开浏览器控制台查看错误信息

---

### 测试 3: 版本保存 ✅ / ❌

1. [ ] 生成工作流后
2. [ ] 点击顶部"保存"按钮
3. [ ] Toast 提示"保存成功"
4. [ ] 版本选择器显示"v1"
5. [ ] 刷新页面，工作流仍然存在

**如果失败**:
- 检查 Supabase 数据库连接
- 检查 RLS 策略是否正确
- 查看 Vercel 日志

---

### 测试 4: 版本对比 ✅ / ❌

1. [ ] 修改需求描述
2. [ ] 重新生成工作流
3. [ ] 保存为 v2
4. [ ] 在"选择版本"选 v2
5. [ ] 在"对比版本"选 v1
6. [ ] 新增节点显示为绿色
7. [ ] 修改节点显示为黄色
8. [ ] 删除节点显示为红色虚线

**如果失败**:
- 检查工作流 JSON 结构
- 查看浏览器控制台错误

---

### 测试 5: AI 助手 ✅ / ❌

1. [ ] 在左侧"AI 助手"输入问题
2. [ ] 点击"发送"
3. [ ] 等待 AI 回复
4. [ ] 回复内容相关且有帮助

**如果失败**:
- 检查 OpenRouter API 调用
- 查看浏览器控制台

---

### 测试 6: 场景图生成 ✅ / ❌

1. [ ] 点击顶部"生成图片"按钮
2. [ ] 等待 15-30 秒
3. [ ] 左下角显示生成的图片
4. [ ] 图片与工作流主题相关

**如果失败**:
- 检查 OpenRouter 图片生成配额
- 如果使用占位图，说明 API 调用失败但降级成功

---

## 🔍 常见部署问题排查

### 问题 1: 构建失败

**错误信息**: `Build failed` 或 `Type error`

**解决方案**:
```bash
# 本地测试构建
pnpm build

# 查看具体错误
# 如果是 TypeScript 错误，检查 next.config.mjs
# 确保有 ignoreBuildErrors: true
```

---

### 问题 2: 环境变量未生效

**症状**: 部署成功但功能不工作

**解决方案**:
1. 检查 Vercel 环境变量拼写
2. 确保以 `NEXT_PUBLIC_` 开头
3. 重新部署（环境变量修改后需要重新部署）

```bash
# 在 Vercel 项目设置中：
Settings > Environment Variables > 检查所有变量
```

---

### 问题 3: 页面 500 错误

**解决方案**:
1. 查看 Vercel Runtime Logs
2. 检查 Supabase 连接
3. 检查环境变量是否正确

```bash
# Vercel Dashboard > 项目 > Logs > Runtime Logs
```

---

### 问题 4: 登录后重定向失败

**解决方案**:
```bash
# 检查 Supabase 项目设置
# Authentication > URL Configuration
# 添加你的 Vercel 域名到 Redirect URLs:
https://your-app.vercel.app/**
```

---

## 📊 部署成功标准

✅ **所有测试通过**
✅ **无控制台错误**
✅ **页面加载速度 < 3 秒**
✅ **AI 生成响应时间 < 30 秒**
✅ **移动端显示正常**

---

## 🎯 部署后优化（可选）

### 1. 自定义域名
- Vercel 项目 > Settings > Domains
- 添加你的域名
- 配置 DNS 记录

### 2. 性能监控
- Vercel Analytics（自动启用）
- Supabase Dashboard > Logs

### 3. 错误追踪
- 集成 Sentry（可选）
- 监控 Vercel Runtime Logs

### 4. SEO 优化
- 添加 `metadata` 到各页面
- 生成 sitemap
- 配置 robots.txt

---

## 📝 部署记录模板

```
部署日期: 2025-10-26
Vercel URL: https://your-app.vercel.app
Git Commit: 7b2873f
Milestone: Milestone 1

✅ 功能测试结果:
- 用户注册: 通过
- 登录: 通过
- 工作流生成: 通过
- 版本保存: 通过
- 版本对比: 通过
- AI 助手: 通过
- 场景图生成: 通过

📝 备注:
- 首次部署
- 所有功能正常
```

---

**准备好了吗？开始部署吧！🚀**
