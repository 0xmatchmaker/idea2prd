# 部署指南

## 📋 前置要求

- [Supabase](https://supabase.com/) 账号
- [OpenRouter](https://openrouter.ai/) API key
- [Vercel](https://vercel.com/) 账号（用于部署）
- [GitHub](https://github.com/) 账号（用于代码托管）

## 🚀 快速开始

### 1. Supabase 设置

#### 1.1 创建项目
1. 访问 [Supabase Dashboard](https://app.supabase.com/)
2. 点击 "New Project"
3. 填写项目名称和数据库密码

#### 1.2 执行 SQL 脚本
1. 在 Supabase Dashboard，进入 "SQL Editor"
2. 复制 `docs/supabase-setup.sql` 的全部内容
3. 粘贴并执行

#### 1.3 启用 Email Auth
1. 进入 "Authentication" > "Providers"
2. 确保 "Email" 已启用
3. （可选）配置邮件模板

#### 1.4 获取 API Keys
1. 进入 "Settings" > "API"
2. 复制以下信息：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. OpenRouter 设置

1. 访问 [OpenRouter](https://openrouter.ai/)
2. 注册/登录
3. 进入 "API Keys"
4. 创建新的 API key
5. 复制 API key → `NEXT_PUBLIC_OPENROUTER_API_KEY`
6. 充值账户（建议至少 $5）

### 3. 本地开发

#### 3.1 安装依赖
```bash
pnpm install
```

#### 3.2 配置环境变量
创建 `.env.local` 文件：

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# OpenRouter
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-api-key

# 可选：指定模型
NEXT_PUBLIC_DEFAULT_AI_MODEL=anthropic/claude-3.5-sonnet
NEXT_PUBLIC_IMAGE_MODEL=openai/dall-e-3
```

#### 3.3 启动开发服务器
```bash
pnpm dev
```

访问 http://localhost:3000

### 4. Vercel 部署

#### 4.1 准备代码
```bash
# 初始化 Git 仓库（如果还没有）
git init
git add .
git commit -m "feat: workflow studio MVP"

# 推送到 GitHub
git remote add origin https://github.com/yourusername/idea2prd.git
git push -u origin main
```

#### 4.2 连接 Vercel
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." > "Project"
3. 选择你的 GitHub 仓库 `idea2prd`
4. 点击 "Import"

#### 4.3 配置环境变量
在 Vercel 项目设置中，添加环境变量：

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | 你的 Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 你的 Supabase anon key |
| `NEXT_PUBLIC_OPENROUTER_API_KEY` | 你的 OpenRouter API key |

#### 4.4 部署
点击 "Deploy"，等待部署完成（约 2-3 分钟）

#### 4.5 验证
1. 访问 Vercel 提供的域名（如 `your-app.vercel.app`）
2. 访问 `/login` 注册账号
3. 验证邮箱（检查收件箱）
4. 登录并访问 `/workspace`
5. 测试生成工作流功能

## 🧪 功能测试

### 测试用例 1：生成工作流
1. 登录后进入 Workspace
2. 在输入框输入：
   ```
   创建一个用户注册流程：
   1. 接收用户邮箱和密码
   2. 验证邮箱格式
   3. 检查用户是否已存在
   4. 创建用户记录
   5. 发送欢迎邮件
   ```
3. 点击"生成工作流"
4. 等待 AI 生成（约 10-20秒）
5. 查看右侧可视化节点图

### 测试用例 2：保存版本
1. 生成工作流后，点击"保存"
2. 查看版本号（应该是 v1）
3. 修改描述，再次生成
4. 再次保存（应该是 v2）

### 测试用例 3：版本对比
1. 在顶部选择"选择版本" = v2
2. 在"对比版本"选择 v1
3. 查看节点图，新增节点应为绿色，修改节点为黄色

### 测试用例 4：AI 对话
1. 在左侧"AI 助手"输入："这个工作流如何优化？"
2. 点击"发送"
3. 等待 AI 回复

### 测试用例 5：生成场景图
1. 点击顶部"生成图片"按钮
2. 等待图片生成（约 15-30秒）
3. 在左下角查看生成的场景图

## ⚙️ 自定义配置

### 修改 AI 模型
在 `.env.local` 中修改：

```env
# 使用不同的文本模型
NEXT_PUBLIC_DEFAULT_AI_MODEL=google/gemini-pro

# 使用不同的图片模型
NEXT_PUBLIC_IMAGE_MODEL=stability-ai/stable-diffusion-xl
```

支持的模型查看：[OpenRouter Models](https://openrouter.ai/models)

### 修改数据库表结构
如需添加字段：
1. 在 Supabase SQL Editor 执行 ALTER TABLE
2. 更新 `types/workspace.ts` 中的类型定义
3. 更新相关的 lib/db/* 文件

## 🐛 常见问题

### 1. 登录后跳转到空白页
- **原因**：环境变量未正确配置
- **解决**：检查 Vercel 环境变量是否正确，重新部署

### 2. AI 生成失败
- **原因**：OpenRouter API key 无效或余额不足
- **解决**：检查 API key，确保账户有余额

### 3. 版本保存失败
- **原因**：Supabase RLS 策略问题或未登录
- **解决**：检查 SQL 脚本是否正确执行，确保用户已登录

### 4. 图片生成很慢
- **原因**：DALL-E 3 生成速度较慢
- **解决**：正常现象，通常需要 15-30秒

### 5. 邮箱验证邮件未收到
- **原因**：Supabase 邮件发送延迟或进入垃圾箱
- **解决**：检查垃圾邮件，或在 Supabase 重新发送

## 📊 监控和日志

### Supabase 日志
- 进入 "Logs" 查看数据库查询
- 进入 "Auth" > "Users" 查看注册用户

### Vercel 日志
- 进入项目 > "Logs" 查看运行时日志
- 进入 "Analytics" 查看访问统计

## 🔒 安全建议

1. **API Keys**：绝不要将 API keys 提交到代码仓库
2. **RLS**：确保 Supabase RLS 策略已启用
3. **邮箱验证**：强制用户验证邮箱后才能使用
4. **速率限制**：在生产环境添加 API 调用速率限制

## 📈 下一步

- [ ] 添加用户使用统计
- [ ] 支持多项目管理
- [ ] 导出工作流为 n8n JSON
- [ ] 集成真实的 n8n 执行引擎
- [ ] 支持团队协作
- [ ] 添加工作流模板库

## 💬 支持

遇到问题？
- 查看 [GitHub Issues](https://github.com/yourusername/idea2prd/issues)
- 联系开发者

---

**祝部署顺利！🎉**
