# 🔄 Git 回退实战示例

## 场景：发现新功能有问题，需要回退到 Milestone 1

假设你在 Milestone 1 之后添加了一些新功能，但发现这些功能有严重 bug，想要回退到稳定的 Milestone 1 版本。

### 📊 当前状态示例
```
* a1b2c3d (HEAD -> main) feat: 添加导出功能（有 bug）
* d4e5f6g fix: 尝试修复导出问题（仍有问题）
* 60db5f8 docs: 添加里程碑快速参考指南
* 98ce326 docs: 添加 Git 版本控制工作流程文档
* e7f5585 (tag: milestone-1) 🎉 Milestone 1: Initial MVP Implementation
```

---

## 方法 1: 软回退（推荐 - 保留代码以便分析）

### 步骤
```bash
# 1. 查看当前状态
git log --oneline

# 2. 创建备份分支（重要！）
git branch backup-before-rollback

# 3. 软回退到 Milestone 1
git reset --soft milestone-1

# 4. 查看状态（所有改动都在暂存区）
git status

# 5. 可以查看被回退的改动
git diff --staged

# 6. 如果确定要丢弃，清空暂存区
git reset HEAD .

# 7. 查看现在的提交历史
git log --oneline
```

### 结果
```
* e7f5585 (HEAD -> main, tag: milestone-1) 🎉 Milestone 1: Initial MVP Implementation
```

所有 Milestone 1 之后的改动都被回退，但代码文件保留在暂存区，可以查看和分析。

---

## 方法 2: 硬回退（彻底删除）

### ⚠️ 警告
这会**永久删除**所有 Milestone 1 之后的改动！使用前务必备份！

### 步骤
```bash
# 1. 创建备份分支（必须！）
git branch backup-emergency

# 2. 硬回退到 Milestone 1
git reset --hard milestone-1

# 3. 查看状态（工作区和暂存区都被清空）
git status

# 4. 查看提交历史
git log --oneline
```

### 结果
所有 Milestone 1 之后的提交和代码改动都被删除，项目回到完全干净的 Milestone 1 状态。

---

## 方法 3: 创建新分支测试（最安全）

### 步骤
```bash
# 1. 基于 Milestone 1 创建新测试分支
git checkout -b test-milestone-1 milestone-1

# 2. 你现在在一个全新的分支，可以自由测试
git log --oneline

# 3. 测试完成后，回到主分支
git checkout main

# 4. 如果测试通过，想要让主分支也回退
git reset --hard milestone-1

# 5. 删除测试分支
git branch -d test-milestone-1
```

### 优点
- 不影响主分支
- 可以随时切换回去
- 安全无风险

---

## 方法 4: Revert（创建反向提交）

### 适用场景
当你已经推送到远程仓库，不想改变历史记录时。

### 步骤
```bash
# 1. 查看要回退的提交
git log --oneline

# 2. 逐个 revert（从最新到最旧）
git revert a1b2c3d  # 最新的提交
git revert d4e5f6g  # 第二个提交

# 3. 查看历史（注意：提交还在，但有反向提交）
git log --oneline
```

### 结果
```
* z9y8x7w (HEAD -> main) Revert "feat: 添加导出功能"
* w6v5u4t Revert "fix: 尝试修复导出问题"
* a1b2c3d feat: 添加导出功能（有 bug）
* d4e5f6g fix: 尝试修复导出问题（仍有问题）
* 60db5f8 docs: 添加里程碑快速参考指南
* 98ce326 docs: 添加 Git 版本控制工作流程文档
* e7f5585 (tag: milestone-1) 🎉 Milestone 1: Initial MVP Implementation
```

功能上等同于回退，但保留了完整的历史记录。

---

## 🎯 实战演练

### 练习 1: 安全测试回退
```bash
# 创建测试分支
git checkout -b test-rollback milestone-1

# 确认工作正常
pnpm dev

# 回到主分支
git checkout main
```

### 练习 2: 对比两个版本
```bash
# 查看当前版本和 Milestone 1 的差异
git diff milestone-1 HEAD

# 只看文件列表
git diff --name-only milestone-1 HEAD

# 查看特定文件的差异
git diff milestone-1 HEAD -- app/workspace/page.tsx
```

### 练习 3: 从备份恢复
```bash
# 假设你错误地硬回退了
# 但之前创建了 backup 分支

# 查看所有分支
git branch -a

# 从备份恢复
git reset --hard backup-before-rollback

# 或者合并备份的改动
git merge backup-before-rollback
```

---

## 🛡️ 最佳实践

1. **永远先备份**
   ```bash
   git branch backup-$(date +%Y%m%d-%H%M%S)
   ```

2. **使用测试分支**
   ```bash
   git checkout -b test-version milestone-1
   ```

3. **查看差异再决定**
   ```bash
   git diff milestone-1 HEAD
   ```

4. **如果不确定，使用 soft reset**
   ```bash
   git reset --soft milestone-1
   ```

5. **记录回退原因**
   ```bash
   echo "$(date): 回退到 milestone-1，原因：导出功能有严重 bug" >> rollback-log.txt
   ```

---

## 🔍 故障排查

### 问题 1: 回退后发现还需要某些改动
```bash
# 查看 reflog（Git 的"后悔药"）
git reflog

# 找到回退前的提交哈希（例如 a1b2c3d）
git reset --hard a1b2c3d

# 或者只恢复特定文件
git checkout a1b2c3d -- path/to/file.ts
```

### 问题 2: 回退后无法启动项目
```bash
# 确保安装了依赖
pnpm install

# 清除缓存
rm -rf .next
rm -rf node_modules/.cache

# 重新启动
pnpm dev
```

### 问题 3: 不知道该回退到哪个版本
```bash
# 查看所有里程碑
git log --grep="Milestone" --oneline

# 查看标签
git tag -l

# 查看某个提交的详细信息
git show milestone-1
```

---

**提示**: 在进行任何重大回退操作前，建议先在测试分支上尝试！

**相关文档**: 
- `docs/GIT_WORKFLOW.md` - 完整工作流程
- `MILESTONES.md` - 里程碑快速参考
