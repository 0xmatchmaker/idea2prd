# Workflow Studio - 从 Idea 到 PRD 工作流

> 使用 AI 将自然语言描述转换为可视化的 n8n 工作流，支持多版本管理和智能对比

## ✨ 核心功能

### 🤖 AI 生成工作流
用自然语言描述需求，AI 自动生成 n8n 格式的工作流 JSON

**示例**：
```
创建一个订单处理流程：
1. 接收订单webhook
2. 检查库存
3. 如果库存充足，调用支付API
4. 创建发货单
5. 发送通知邮件
```

AI 会自动生成包含 5-6 个节点的完整工作流。

### 📊 可视化工作流
使用 React Flow 实时渲染工作流节点和连接：
- 🟢 绿色 = 新增节点
- 🟡 黄色 = 修改节点
- ⚪ 白色 = 未修改节点

### 🔄 版本管理
- 自动保存每个版本（v1, v2, v3...）
- 选择任意两个版本进行对比
- 显示新增、修改、删除的节点

### 💬 AI 助手
实时与 AI 对话，优化和完善工作流：
- "如何优化这个流程？"
- "添加错误处理逻辑"
- "生成测试数据"

### 🎨 场景图生成
为工作流生成配套的场景插图（DALL-E 3）

## 🏗️ 技术栈

| 技术 | 用途 |
|------|------|
| **Next.js 16** | 全栈框架 |
| **TypeScript** | 类型安全 |
| **Supabase** | 数据库 + 认证 |
| **OpenRouter** | AI API（Claude + DALL-E 3） |
| **React Flow** | 工作流可视化 |
| **shadcn/ui** | UI 组件 |
| **jsondiffpatch** | JSON 对比 |

## 🚀 快速开始

### 1. 克隆仓库
```bash
git clone https://github.com/yourusername/idea2prd.git
cd idea2prd
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 配置环境变量
复制 `.env.local.example` 为 `.env.local`：

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_OPENROUTER_API_KEY=your-openrouter-key
```

### 4. 设置 Supabase
在 Supabase SQL Editor 执行 `docs/supabase-setup.sql`

### 5. 启动开发服务器
```bash
pnpm dev
```

访问 http://localhost:3000

详细部署指南请查看 [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 📖 使用指南

### 生成你的第一个工作流

1. **注册/登录**
   - 访问 `/login`
   - 使用邮箱注册
   - 验证邮箱（检查收件箱）

2. **生成工作流**
   - 进入 `/workspace`
   - 在左侧输入需求描述
   - 点击"生成工作流"

3. **保存版本**
   - 点击顶部"保存"按钮
   - 版本号自动递增

4. **版本对比**
   - 修改需求，重新生成
   - 保存为新版本
   - 在顶部选择两个版本进行对比

5. **与 AI 对话**
   - 在左侧"AI 助手"输入问题
   - AI 会基于当前工作流给出建议

## 🎯 应用场景

### ✅ 适合的场景
- **流程化需求**：用户注册、订单处理、数据同步
- **自动化工作流**：定时任务、webhook 触发、API 集成
- **业务逻辑可视化**：将复杂逻辑转换为清晰的流程图

### ❌ 不适合的场景
- UI/UX 设计需求
- 纯前端交互逻辑
- 视觉风格描述

## 📁 项目结构

```
idea2prd/
├── app/
│   ├── workspace/          # 主工作台页面
│   └── login/              # 登录页面
├── lib/
│   ├── openrouter.ts       # AI API 调用
│   ├── supabase.ts         # Supabase 客户端
│   ├── workflow-diff.ts    # 版本对比逻辑
│   └── db/                 # 数据库操作
│       ├── projects.ts
│       └── versions.ts
├── types/
│   └── workspace.ts        # 类型定义
├── components/
│   └── ui/                 # shadcn/ui 组件
└── docs/
    ├── supabase-setup.sql  # 数据库初始化脚本
    ├── DEPLOYMENT.md       # 部署指南
    └── workspace-design.md # 设计文档
```

## 🔧 核心概念

### n8n 工作流格式

```typescript
interface N8nWorkflow {
  nodes: Array<{
    id: string
    type: string              // 节点类型，如 "n8n-nodes-base.webhook"
    name: string              // 显示名称
    position: [number, number] // [x, y] 坐标
    parameters: object        // 节点配置
  }>
  connections: {
    [nodeId: string]: {
      main: Array<Array<{
        node: string          // 目标节点 ID
        type: string
        index: number
      }>>
    }
  }
}
```

### 版本对比算法

使用 `jsondiffpatch` 对比两个工作流 JSON：
1. 检测新增/删除/修改的节点
2. 检测连接变化
3. 在可视化中高亮差异

## 🌟 亮点

- **零学习成本**：用自然语言描述需求，无需了解 n8n 语法
- **可视化对比**：直观看到每次迭代的变化
- **AI 原生**：从生成到优化，全程 AI 辅助
- **可执行原型**：生成的 JSON 可直接导入 n8n 运行

## 🛣️ Roadmap

- [ ] 支持导出为 n8n 可导入文件
- [ ] 集成真实 n8n 执行引擎
- [ ] 工作流模板库
- [ ] 团队协作编辑
- [ ] 工作流执行历史
- [ ] 性能监控面板

## 🤝 贡献

欢迎贡献！请查看 [Contributing Guide](./CONTRIBUTING.md)

## 📄 许可

MIT License

## 🙏 致谢

- [n8n](https://n8n.io/) - 工作流自动化平台
- [OpenRouter](https://openrouter.ai/) - AI API 聚合服务
- [Supabase](https://supabase.com/) - 开源 Firebase 替代品
- [React Flow](https://reactflow.dev/) - 流程图可视化库

---

**Made with ❤️ by [Your Name]**
