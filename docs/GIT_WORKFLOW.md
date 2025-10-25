# Git 版本控制工作流程

## 📚 里程碑管理策略

本项目使用严格的里程碑管理，确保每一步开发都可以回溯和恢复。

## 🏷️ 里程碑列表

### ✅ Milestone 1: Initial MVP Implementation (当前)
**提交哈希**: `e7f5585`
**日期**: 2025-10-26

**包含功能**:
- ✅ AI 工作流生成（OpenRouter + Claude 3.5 Sonnet）
- ✅ 多版本管理（Supabase）
- ✅ 可视化工作流对比（React Flow）
- ✅ 颜色差异高亮（绿色新增 / 黄色修改 / 红色删除）
- ✅ 用户认证和项目管理
- ✅ 场景图生成（Gemini 2.5 Flash）
- ✅ 完整导航系统（WorkspaceNavbar）

**核心文件**:
- `app/workspace/page.tsx` - 主工作区
- `lib/openrouter.ts` - AI API 集成
- `lib/workflow-diff.ts` - 版本对比逻辑
- `components/workspace-navbar.tsx` - 导航栏
- `docs/supabase-setup.sql` - 数据库架构

### 📝 未来里程碑规划

#### Milestone 2: 性能优化和 Bug 修复（计划中）
- [ ] 优化大型工作流的渲染性能
- [ ] 修复已知 UI 问题
- [ ] 改进错误处理和用户提示
- [ ] 添加 loading 状态优化

#### Milestone 3: 高级功能（计划中）
- [ ] 工作流模板库
- [ ] 导出为 n8n 可导入 JSON
- [ ] 版本历史时间线视图
- [ ] 批量版本对比

#### Milestone 4: 协作功能（计划中）
- [ ] 工作流分享链接
- [ ] 评论和讨论功能
- [ ] 团队协作编辑

## 🔄 日常工作流程

### 1. 开始新功能
```bash
# 确保在主分支且是最新代码
git checkout main
git pull origin main

# 创建功能分支
git checkout -b feature/功能名称
```

### 2. 开发过程中频繁提交
```bash
# 查看修改
git status
git diff

# 添加文件
git add .

# 提交（使用清晰的提交信息）
git commit -m "描述: 具体做了什么改动"
```

### 3. 完成功能后合并到主分支
```bash
# 切回主分支
git checkout main

# 合并功能分支
git merge feature/功能名称

# 如果是重要功能，打标签
git tag -a v1.1.0 -m "新功能：描述"
```

### 4. 创建新的里程碑
```bash
# 重大更新时创建里程碑提交
git commit -m "🎉 Milestone X: 里程碑名称

## 新功能
- 功能 1
- 功能 2

## 修复
- Bug 1
- Bug 2

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 🚨 回退到之前的里程碑

### 查看所有里程碑
```bash
# 查看提交历史
git log --oneline --decorate

# 查看详细的里程碑信息
git log --grep="Milestone" --oneline
```

### 回退方式 1: 软回退（保留本地修改）
```bash
# 回退到 Milestone 1
git reset --soft e7f5585

# 查看回退后的状态
git status

# 如果需要，可以重新提交
git commit -m "新的提交信息"
```

### 回退方式 2: 硬回退（丢弃所有修改）
```bash
# ⚠️ 警告：这会删除所有未提交的修改！
git reset --hard e7f5585

# 查看当前状态
git status
```

### 回退方式 3: 创建新分支测试旧版本
```bash
# 基于里程碑创建新分支（推荐）
git checkout -b test-milestone-1 e7f5585

# 测试完成后回到主分支
git checkout main
```

## 📊 查看两个里程碑之间的差异
```bash
# 查看 Milestone 1 到当前的所有变更
git diff e7f5585 HEAD

# 查看特定文件的变更
git diff e7f5585 HEAD -- app/workspace/page.tsx

# 查看变更的文件列表
git diff --name-only e7f5585 HEAD
```

## 🏷️ 使用标签管理版本
```bash
# 为 Milestone 1 添加标签
git tag -a milestone-1 e7f5585 -m "Milestone 1: Initial MVP"

# 查看所有标签
git tag -l

# 查看标签详情
git show milestone-1

# 回退到标签
git checkout milestone-1
```

## 💡 最佳实践

1. **频繁提交**: 每完成一个小功能就提交，不要等到功能全部完成
2. **清晰的提交信息**: 使用格式 `类型: 简短描述`
   - 功能: `feat: 添加版本对比功能`
   - 修复: `fix: 修复节点 ID 冲突问题`
   - 优化: `refactor: 重构工作流对比逻辑`
   - 文档: `docs: 更新 README`
3. **使用分支**: 大功能在独立分支开发，测试通过后再合并
4. **里程碑标记**: 重要的功能节点使用里程碑提交
5. **备份重要分支**: 在做危险操作前先创建备份分支

## 🔍 常用命令速查

```bash
# 查看当前状态
git status

# 查看提交历史
git log --oneline --graph --all

# 查看某个提交的详情
git show <commit-hash>

# 回退单个文件
git checkout <commit-hash> -- <file-path>

# 放弃当前所有修改
git reset --hard HEAD

# 暂存当前修改（不提交）
git stash
git stash pop  # 恢复暂存

# 查看远程仓库
git remote -v

# 推送到远程
git push origin main

# 从远程拉取
git pull origin main
```

## 📝 提交信息模板

```
类型(范围): 简短描述（不超过 50 字符）

详细说明：
- 改动点 1
- 改动点 2
- 改动点 3

相关问题: #issue-number (如果有)

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

**类型标签**:
- `feat`: 新功能
- `fix`: Bug 修复
- `refactor`: 代码重构
- `docs`: 文档更新
- `style`: 代码格式调整
- `test`: 测试相关
- `chore`: 构建/工具链相关

## 🎯 示例：完整的功能开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/export-workflow

# 2. 开发过程中频繁提交
git add lib/export.ts
git commit -m "feat: 添加工作流导出为 JSON 的功能"

git add app/workspace/page.tsx
git commit -m "feat: 在 UI 添加导出按钮"

git add lib/export.ts
git commit -m "fix: 修复导出时的编码问题"

# 3. 功能完成，测试通过
git checkout main
git merge feature/export-workflow

# 4. 如果这是一个重要里程碑
git commit -m "🎉 Milestone 2: 导出功能完成

## 新功能
✅ 工作流导出为 JSON
✅ 支持多种导出格式
✅ 导出前验证工作流

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# 5. 打标签方便以后查找
git tag -a milestone-2 -m "Milestone 2: Export Feature"

# 6. 推送到远程（如果有）
git push origin main --tags
```

---

**最后更新**: 2025-10-26
**当前里程碑**: Milestone 1 (e7f5585)
