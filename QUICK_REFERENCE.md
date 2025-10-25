# ⚡ 快速参考指南

## 🎯 最常用的 3 个流程

---

## 1️⃣ 修改代码并部署（标准流程）

```bash
# 步骤 1: 修改代码
# 在编辑器中修改文件...

# 步骤 2: 本地测试
pnpm dev
# 访问 http://localhost:3000 测试

# 步骤 3: 提交并推送
git add .
git commit -m "描述你的修改"
git push

# 步骤 4: 等待 Vercel 自动部署（1-2分钟）
# ✅ 完成！
```

**预计时间**: 5 分钟

---

## 2️⃣ 紧急回滚（代码有问题）

```bash
# 方法 1: 回退到上一个提交
git reset --hard HEAD~1
git push --force

# 方法 2: 在 Vercel 回滚
# 访问 https://vercel.com/dashboard
# Deployments > 选择之前的部署 > Promote to Production
```

**预计时间**: 1 分钟

---

## 3️⃣ 创建重要里程碑

```bash
# 完成重要功能后
git commit -m "🎉 Milestone X: 功能名称

## 新功能
- 功能 1
- 功能 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)
Co-Authored-By: Claude <noreply@anthropic.com>"

git tag -a milestone-X -m "描述"
git push --tags
```

**预计时间**: 2 分钟

---

## 🔧 常用命令

### Git 基础
```bash
git status              # 查看状态
git diff                # 查看改动
git add .               # 添加所有文件
git commit -m "描述"    # 提交
git push                # 推送
git log --oneline -10   # 查看历史
```

### 开发
```bash
pnpm dev                # 启动开发服务器
pnpm build              # 生产构建
pnpm start              # 启动生产服务器
```

### 检查
```bash
./check-deploy-ready.sh # 检查部署准备
```

---

## 🚨 紧急情况处理

| 问题 | 解决方案 |
|------|---------|
| **部署失败** | 查看 Vercel Logs，本地运行 `pnpm build` |
| **网站崩溃** | Vercel Dashboard 回滚到之前版本 |
| **功能损坏** | `git reset --hard HEAD~1` + `git push --force` |
| **开发服务器错误** | `rm -rf .next` + `pnpm dev` |

---

## 📂 重要文件位置

| 文件 | 用途 |
|------|------|
| `app/workspace/page.tsx` | 主工作区页面 |
| `lib/openrouter.ts` | AI API 调用 |
| `lib/workflow-diff.ts` | 版本对比逻辑 |
| `components/workspace-navbar.tsx` | 导航栏 |
| `.env.local` | 本地环境变量（不要提交！） |

---

## 🎯 提交信息模板

```bash
# 新功能
git commit -m "feat: 添加工作流导出功能"

# Bug 修复
git commit -m "fix: 修复版本对比错误"

# 代码优化
git commit -m "refactor: 重构工作流生成逻辑"

# 样式调整
git commit -m "style: 优化页面布局"

# 文档更新
git commit -m "docs: 更新 README"
```

---

## 🔗 快速链接

| 链接 | 用途 |
|------|------|
| https://vercel.com/dashboard | Vercel 控制台 |
| https://github.com/0xmatchmaker/idea2prd | GitHub 仓库 |
| https://app.supabase.com | Supabase 控制台 |
| https://openrouter.ai | OpenRouter 控制台 |

---

## 📚 详细文档

- `DEVELOPMENT_WORKFLOW.md` - 完整开发流程
- `docs/GIT_WORKFLOW.md` - Git 工作流程
- `DEPLOY_NOW.md` - 部署指南
- `MILESTONES.md` - 里程碑管理

---

**打印这张卡片贴在显示器旁边！** 📌
