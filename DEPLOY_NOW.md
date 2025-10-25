# 🚀 立即部署到 Vercel - 详细步骤

## ⏱️ 预计时间：5 分钟

---

## 第 1 步：访问 Vercel 导入页面（30 秒）

### 打开浏览器，访问：
```
https://vercel.com/new
```

如果还没登录 Vercel，先登录（支持 GitHub 登录）

---

## 第 2 步：导入 GitHub 仓库（1 分钟）

### 在页面上：

1. **找到 "Import Git Repository" 区域**
2. **搜索或选择仓库**：`0xmatchmaker/idea2prd`
3. **点击 "Import"**

---

## 第 3 步：配置项目（1 分钟）

### 项目设置（通常不需要修改）：

- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（默认）
- **Build Command**: `pnpm build`（自动检测）
- **Output Directory**: `.next`（自动检测）
- **Install Command**: `pnpm install`（自动检测）

---

## 第 4 步：添加环境变量（2 分钟）⚠️ 最重要！

### 点击 "Environment Variables" 展开

### 添加以下 3 个环境变量：

#### 变量 1: Supabase URL
```
Name:  NEXT_PUBLIC_SUPABASE_URL
Value: 你的 Supabase 项目 URL
```
**获取方式**：
- 打开 Supabase Dashboard
- 进入你的项目
- Settings > API
- 复制 "Project URL"

---

#### 变量 2: Supabase Anon Key
```
Name:  NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: 你的 Supabase anon public key
```
**获取方式**：
- 同样在 Settings > API
- 复制 "anon public" key

---

#### 变量 3: OpenRouter API Key
```
Name:  NEXT_PUBLIC_OPENROUTER_API_KEY
Value: 你的 OpenRouter API 密钥
```
**获取方式**：
- 访问 https://openrouter.ai/keys
- 复制你的 API key（sk-or-v1-...）

---

### 环境变量示例：

| Name | Value (示例) |
|------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://abcdefgh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_OPENROUTER_API_KEY` | `sk-or-v1-1234567890abcdef...` |

⚠️ **重要**：
- 变量名必须完全一致（包括大小写）
- 确保以 `NEXT_PUBLIC_` 开头
- 不要有多余的空格

---

## 第 5 步：开始部署（1 分钟）

1. **检查环境变量**：确保 3 个变量都已添加
2. **点击 "Deploy" 按钮**
3. **等待部署完成**（约 1-2 分钟）

### 部署过程中你会看到：
```
Building...
  ▲ Vercel CLI
  Installing dependencies...
  ✓ Installing...
  Building...
  ✓ Compiled successfully
  Uploading...
  ✓ Deployed
```

---

## 第 6 步：获取部署 URL（10 秒）

部署成功后，你会看到：

```
🎉 Congratulations!
Your project is now live at:
https://idea2prd-xxx.vercel.app
```

**复制这个 URL！** 你需要它来配置 Supabase。

---

## 第 7 步：配置 Supabase 重定向（1 分钟）⚠️ 必须做！

### 1. 打开 Supabase Dashboard
```
https://app.supabase.com/project/你的项目ID
```

### 2. 进入 Authentication 设置
- 左侧菜单点击 "Authentication"
- 点击 "URL Configuration"

### 3. 添加 Redirect URL
在 "Redirect URLs" 区域，添加：
```
https://你的vercel域名.vercel.app/**
```

例如：
```
https://idea2prd-abc123.vercel.app/**
```

⚠️ **注意**：末尾的 `/**` 不要漏掉！

### 4. 点击 "Save"

---

## 🧪 第 8 步：测试部署（2 分钟）

### 1. 访问你的网站
```
https://你的域名.vercel.app
```

### 2. 测试注册登录
- 点击右上角 "开始使用"
- 注册一个账号（使用真实邮箱）
- 检查邮箱验证邮件（可能在垃圾邮件中）
- 点击验证链接
- 登录

### 3. 测试工作流生成
- 登录后进入 Workspace
- 输入需求描述，例如：
  ```
  创建一个用户注册流程：
  1. 接收用户信息
  2. 验证邮箱
  3. 创建账户
  4. 发送欢迎邮件
  ```
- 点击 "生成工作流"
- 等待 10-20 秒
- 查看生成的节点图

### 4. 测试保存版本
- 点击顶部 "保存" 按钮
- 应该看到 "保存成功" 提示
- 版本选择器显示 "v1"

---

## ✅ 部署成功标志

如果你看到以下内容，说明部署成功：

- ✅ 可以访问首页
- ✅ 可以注册和登录
- ✅ 可以生成工作流
- ✅ 可以保存版本
- ✅ 没有控制台错误

---

## 🐛 常见问题

### 问题 1: 部署失败 "Build Error"
**解决方案**：
- 检查是否所有环境变量都已添加
- 检查环境变量名是否正确（区分大小写）
- 在 Vercel 项目 > Settings > Environment Variables 中重新检查

### 问题 2: 登录后跳转到空白页
**解决方案**：
- 检查 Supabase Redirect URLs 是否已添加
- 确保 URL 末尾有 `/**`
- 重新部署 Vercel 项目

### 问题 3: "AI 生成失败"
**解决方案**：
- 检查 OpenRouter API key 是否正确
- 访问 https://openrouter.ai/credits 确认账户有余额
- 重新部署

### 问题 4: 无法收到验证邮件
**解决方案**：
- 检查垃圾邮件文件夹
- 在 Supabase > Authentication > Users 中手动验证用户邮箱

---

## 📊 部署后检查清单

- [ ] 网站可以访问
- [ ] 首页正常显示
- [ ] 可以注册账号
- [ ] 收到验证邮件
- [ ] 可以登录
- [ ] Workspace 页面正常
- [ ] AI 可以生成工作流
- [ ] 可以保存版本
- [ ] 版本对比功能正常

---

## 🎯 下一步

部署成功后，你可以：

1. **自定义域名**
   - Vercel 项目 > Settings > Domains
   - 添加你的域名

2. **监控使用情况**
   - Vercel > Analytics
   - Supabase > Database > Logs

3. **邀请团队成员**
   - Vercel > Settings > Team

---

## 📝 部署信息记录

完成后填写：

```
部署日期: _______________
Vercel URL: https://_____________________.vercel.app
Supabase 项目: ___________________
OpenRouter 账户余额: $_______
测试账号: ___________________@gmail.com
```

---

## 🆘 需要帮助？

遇到问题可以：
1. 查看 `VERCEL_DEPLOY_CHECKLIST.md` 详细检查清单
2. 查看 Vercel 部署日志（项目 > Deployments > 点击部署 > Build Logs）
3. 查看浏览器控制台错误（F12 > Console）

---

**准备好了吗？开始部署吧！** 🚀

预计总时间：**5 分钟**
