# 👨‍💻 日常开发工作流程

## 🎯 修改代码后的标准流程

---

## 📝 完整流程（推荐）

### 1️⃣ 修改代码
```bash
# 在你喜欢的编辑器中修改代码
# 例如：修改 app/workspace/page.tsx
```

---

### 2️⃣ 本地测试（重要！）

```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:3000 测试修改
# 确保功能正常后再继续
```

**测试检查清单**：
- [ ] 页面能正常加载
- [ ] 没有控制台错误
- [ ] 修改的功能工作正常
- [ ] 没有破坏其他功能

---

### 3️⃣ 提交到 Git

```bash
# 查看修改了哪些文件
git status

# 查看具体改动（可选）
git diff

# 添加修改的文件
git add .

# 提交（写清楚改了什么）
git commit -m "描述你的修改"
```

**提交信息示例**：
```bash
git commit -m "feat: 添加工作流导出功能"
git commit -m "fix: 修复版本对比时的节点ID冲突"
git commit -m "style: 优化工作区页面布局"
git commit -m "docs: 更新 README"
```

---

### 4️⃣ 推送到 GitHub

```bash
# 推送到远程仓库
git push
```

---

### 5️⃣ Vercel 自动部署（无需操作）

**推送后，Vercel 会自动：**
1. 检测到代码更新
2. 自动开始构建
3. 自动部署到生产环境
4. 大约 1-2 分钟后生效

**查看部署状态**：
- 访问 https://vercel.com/dashboard
- 或者检查邮箱（Vercel 会发送部署通知）

---

### 6️⃣ 验证线上部署

```bash
# 访问你的 Vercel 域名
# https://你的项目.vercel.app

# 测试修改是否生效
```

---

## ⚡ 快速流程（熟练后使用）

```bash
# 修改代码后...

# 1. 本地测试
pnpm dev

# 2. 提交并推送
git add .
git commit -m "简短描述"
git push

# 3. 等待 Vercel 自动部署（1-2分钟）
# 4. 访问网站验证
```

---

## 🔄 常见开发场景

### 场景 1: 修复一个小 Bug

```bash
# 1. 修改代码
vim app/workspace/page.tsx

# 2. 本地测试
pnpm dev

# 3. 提交
git add app/workspace/page.tsx
git commit -m "fix: 修复工作流保存时的空指针错误"
git push

# Vercel 自动部署 ✅
```

---

### 场景 2: 添加新功能

```bash
# 1. 创建功能分支（可选，推荐）
git checkout -b feature/export-workflow

# 2. 开发功能
# ... 修改多个文件 ...

# 3. 频繁提交
git add .
git commit -m "feat: 添加导出按钮 UI"

git add .
git commit -m "feat: 实现导出为 JSON 功能"

# 4. 本地测试
pnpm dev

# 5. 测试通过后，合并到主分支
git checkout main
git merge feature/export-workflow

# 6. 推送
git push

# Vercel 自动部署 ✅
```

---

### 场景 3: 重大更新（里程碑）

```bash
# 1. 完成所有改动并测试

# 2. 创建里程碑提交
git commit -m "🎉 Milestone 2: 导出功能完成

## 新功能
✅ 工作流导出为 JSON
✅ 支持多种导出格式
✅ 导出前验证

## 优化
- 改进 UI 布局
- 优化性能

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 3. 打标签
git tag -a milestone-2 -m "Milestone 2: Export Feature"

# 4. 推送（包含标签）
git push --tags

# Vercel 自动部署 ✅
```

---

### 场景 4: 紧急回滚（修改有问题）

```bash
# 方法 1: 回退到上一个提交
git reset --hard HEAD~1
git push --force

# 方法 2: 回退到某个里程碑
git reset --hard milestone-1
git push --force

# 方法 3: 在 Vercel Dashboard 回滚
# Deployments > 选择之前的成功部署 > Promote to Production
```

**⚠️ 注意**: `git push --force` 会覆盖远程历史，谨慎使用！

---

## 🧪 本地开发建议

### 开发前检查

```bash
# 1. 确保代码是最新的
git pull

# 2. 确保依赖已安装
pnpm install

# 3. 确保环境变量配置正确
cat .env.local
```

### 开发中

```bash
# 启动开发服务器（支持热重载）
pnpm dev

# 新开一个终端窗口，随时查看 Git 状态
git status

# 频繁保存并提交
# 每完成一个小功能就提交一次
```

### 开发后

```bash
# 生产构建测试（推送前）
pnpm build

# 如果构建失败，修复后再推送
# 如果构建成功，推送到 GitHub
git push
```

---

## 📊 Git 工作流程图

```
本地修改
   ↓
本地测试 (pnpm dev)
   ↓
提交到本地 Git (git commit)
   ↓
推送到 GitHub (git push)
   ↓
Vercel 自动检测
   ↓
Vercel 自动构建
   ↓
Vercel 自动部署
   ↓
生产环境更新 ✅
```

---

## 🎯 最佳实践

### ✅ 推荐做法

1. **频繁提交**
   - 每个小功能都提交
   - 提交信息清晰明确

2. **本地测试**
   - 推送前一定要测试
   - 运行 `pnpm build` 确保能构建

3. **使用分支**
   - 大功能在单独分支开发
   - 测试通过后再合并到 main

4. **清晰的提交信息**
   ```bash
   git commit -m "feat: 新功能描述"
   git commit -m "fix: Bug 修复描述"
   git commit -m "refactor: 重构描述"
   ```

5. **定期创建里程碑**
   - 重要功能完成后打标签
   - 方便回退

### ❌ 避免做法

1. **不要直接在生产环境测试**
   - 先本地测试
   - 再推送部署

2. **不要提交未测试的代码**
   - 可能导致生产环境崩溃

3. **不要提交敏感信息**
   - API keys
   - 密码
   - .env.local 文件

4. **不要频繁 force push**
   - 除非紧急回滚
   - 会覆盖历史记录

---

## 🛠️ 常用命令速查

### Git 操作

```bash
# 查看状态
git status

# 查看改动
git diff

# 添加所有文件
git add .

# 提交
git commit -m "描述"

# 推送
git push

# 查看历史
git log --oneline -10

# 回退（保留改动）
git reset --soft HEAD~1

# 回退（丢弃改动）
git reset --hard HEAD~1

# 创建分支
git checkout -b feature/new-feature

# 切换分支
git checkout main

# 合并分支
git merge feature/new-feature
```

### 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 生产构建
pnpm build

# 启动生产服务器（本地）
pnpm start

# 检查部署准备
./check-deploy-ready.sh
```

---

## 🔍 故障排查

### 问题 1: Vercel 部署失败

**查看步骤**：
1. 访问 Vercel Dashboard
2. Deployments > 点击失败的部署
3. 查看 Build Logs

**常见原因**：
- 环境变量缺失
- TypeScript 错误
- 依赖安装失败

**解决方法**：
```bash
# 本地测试构建
pnpm build

# 修复错误后重新推送
git add .
git commit -m "fix: 修复构建错误"
git push
```

---

### 问题 2: 本地开发服务器错误

```bash
# 1. 清除缓存
rm -rf .next
rm -rf node_modules/.cache

# 2. 重新安装依赖
pnpm install

# 3. 重启开发服务器
pnpm dev
```

---

### 问题 3: Git 推送失败

```bash
# 先拉取远程更新
git pull

# 解决冲突后再推送
git push
```

---

## 📚 相关文档

- `docs/GIT_WORKFLOW.md` - 详细的 Git 工作流程
- `MILESTONES.md` - 里程碑管理
- `docs/ROLLBACK_EXAMPLE.md` - 回退示例
- `VERCEL_DEPLOY_CHECKLIST.md` - 部署检查清单

---

## 💡 小提示

1. **使用 VS Code**
   - 安装 GitLens 插件
   - 可视化 Git 操作

2. **配置 Git 别名**
   ```bash
   git config --global alias.st status
   git config --global alias.co checkout
   git config --global alias.cm commit
   ```

3. **Vercel 预览部署**
   - 推送到非 main 分支会创建预览部署
   - 可以先测试再合并到 main

---

**Happy Coding! 🚀**
