# 🚀 5 分钟快速部署到 Vercel

## 前提条件（必须完成）

✅ 已有 Supabase 项目和 API keys
✅ 已有 OpenRouter API key（账户有余额）
✅ 已有 GitHub 账号

---

## 步骤 1: 推送代码到 GitHub（2 分钟）

```bash
# 如果还没有 GitHub 仓库，创建一个
# 在 GitHub 网站创建新仓库，然后：

# 添加远程仓库
git remote add origin https://github.com/你的用户名/idea2prd.git

# 推送代码
git push -u origin main
```

---

## 步骤 2: 连接 Vercel（1 分钟）

1. 访问 https://vercel.com
2. 点击 "Add New..." > "Project"
3. 选择 "Import Git Repository"
4. 选择你的 `idea2prd` 仓库
5. 点击 "Import"

---

## 步骤 3: 配置环境变量（1 分钟）

在 Vercel 导入页面，点击 "Environment Variables"，添加：

```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase公开密钥
NEXT_PUBLIC_OPENROUTER_API_KEY=你的OpenRouter密钥
```

**重要**: 变量名必须完全一致！

---

## 步骤 4: 部署（1 分钟）

1. 点击 "Deploy"
2. 等待构建完成（约 1-2 分钟）
3. 看到 "Congratulations" 页面即部署成功！

---

## 步骤 5: 配置 Supabase 重定向（30 秒）

1. 访问 Supabase Dashboard
2. 进入你的项目 > Authentication > URL Configuration
3. 在 "Redirect URLs" 添加：
   ```
   https://你的项目名.vercel.app/**
   ```
4. 点击 Save

---

## 🎉 完成！测试你的应用

访问：`https://你的项目名.vercel.app`

### 快速测试：

1. 访问 `/login` 注册账号
2. 验证邮箱
3. 登录并访问 `/workspace`
4. 输入需求生成工作流

---

## 🆘 如果遇到问题

### 构建失败
```bash
# 本地测试构建
pnpm build

# 如果本地成功，检查 Vercel 日志
```

### 登录失败
- 检查 Supabase 环境变量是否正确
- 检查 Redirect URLs 是否添加

### AI 生成失败
- 检查 OpenRouter API key
- 检查账户余额

---

## 📚 详细文档

- 完整部署检查清单: `VERCEL_DEPLOY_CHECKLIST.md`
- 详细部署指南: `docs/DEPLOYMENT.md`
- Git 工作流程: `docs/GIT_WORKFLOW.md`

---

**预计总时间: 5 分钟**
**难度: ⭐ 非常简单**
