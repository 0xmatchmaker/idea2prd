# n8n 工作流方案调研报告

**创建时间**: 2025-10-26
**调研目标**: 评估使用 n8n 节点对比替代文本 diff 的可行性

---

## 一、核心发现

### 1.1 什么是 n8n-MCP？

**n8n-MCP** 是一个 Model Context Protocol (MCP) 服务器，主要功能：
- 让 AI 助手能够构建和修改 n8n 工作流
- 支持 525+ n8n 节点，99% 属性覆盖
- 减少配置错误，加速工作流创建
- 官网：https://www.n8n-mcp.com/
- GitHub：https://github.com/nerding-io/n8n-nodes-mcp

**Model Context Protocol (MCP)**:
- Anthropic 开发的开源协议
- 让 AI 系统（Claude、ChatGPT等）安全连接外部数据和工具
- 客户端-服务器架构

### 1.2 n8n 工作流格式

n8n 使用 **JSON 格式** 保存工作流，核心结构：

```json
{
  "nodes": [
    {
      "id": "node-1",
      "type": "n8n-nodes-base.webhook",
      "name": "用户注册触发",
      "position": [250, 300],
      "parameters": { ... }
    },
    {
      "id": "node-2",
      "type": "n8n-nodes-base.function",
      "name": "验证邮箱",
      "position": [450, 300],
      "parameters": { ... }
    }
  ],
  "connections": {
    "node-1": {
      "main": [[{ "node": "node-2", "type": "main", "index": 0 }]]
    }
  }
}
```

**关键元素**:
- `nodes`: 节点数组（类型、名称、位置、参数）
- `connections`: 节点连接关系（数据流向）

### 1.3 n8n 已有的对比功能

✅ **内置 Workflow Diff**:
- 垂直堆叠显示两个版本
- 🟢 绿色 + "N" = 新增节点/连接
- 🟠 橙色 + "M" = 修改节点
- 🔴 红色 + "D" = 删除节点
- JSON 级别的详细 diff

✅ **Workflow History**:
- 版本历史管理
- 恢复旧版本
- 克隆到新工作流
- 并排对比版本

✅ **第三方工具**:
- `n8n-workflows-comparator` (GitHub)
- 工作流级别对比
- 节点详细分析
- 多种输出格式（控制台、JSON）

### 1.4 可视化工具

**N8N Viewer** (https://n8nviewer.com/):
- 上传 JSON 即可生成可视化流程图
- 交互式节点图表
- 无需安装 n8n

---

## 二、方案对比：文本 vs 节点

| 维度 | 文本 PRD（原方案） | n8n 工作流（新方案） | 评分 |
|------|-------------------|---------------------|------|
| **易用性** | 需要写文档，技术门槛较高 | 拖拽节点，可视化操作 | ✅ 节点 +2 |
| **直观性** | 文字描述，需要想象 | 流程图，一目了然 | ✅ 节点 +2 |
| **可执行性** | 静态文档，不可执行 | 可直接运行测试 | ✅ 节点 +2 |
| **对比效果** | 文本 diff，绿红高亮 | 节点 diff，颜色标记 | ✅ 节点 +1 |
| **适用场景** | 通用 PRD 描述 | 流程化业务逻辑 | ⚠️ 有局限 |
| **AI 生成** | 生成文本内容 | 通过 n8n-MCP 生成流程 | ✅ 节点 +2 |
| **学习成本** | 会写文档即可 | 需要了解 n8n 节点 | ⚠️ 文本 +1 |
| **灵活性** | 可以描述任何需求 | 受节点类型限制 | ⚠️ 文本 +1 |

**总分**: 节点方案 +9，文本方案 +2

---

## 三、核心价值分析

### 3.1 为什么节点对比更适合？

#### ✅ 优势

1. **降低认知门槛**
   - 不需要会写代码或文档
   - 拖拽节点比写 PRD 简单
   - 流程图比文字更容易理解

2. **强制结构化思考**
   - 必须定义输入/输出
   - 必须定义流程节点
   - 自动形成逻辑闭环

3. **可视化对比**
   - 一眼看出新增了哪些步骤（绿色）
   - 修改了哪些逻辑（橙色）
   - 删除了哪些流程（红色）

4. **可执行验证**
   - 流程图可以直接运行测试
   - 立即发现逻辑错误
   - PRD 变成可演示的原型

5. **AI 原生支持**
   - 通过 n8n-MCP，AI 可以直接生成流程图
   - 不需要手动转换
   - 迭代更高效

#### ⚠️ 局限性

1. **适用范围受限**
   - 适合：流程化、逻辑化的需求（订单、注册、数据同步）
   - 不适合：纯展示类需求（UI 设计、视觉风格）

2. **学习曲线**
   - 用户需要了解 n8n 节点类型
   - 需要理解数据流概念

3. **表达能力**
   - 某些抽象需求难以用节点表达
   - 非技术背景和细节描述受限

---

## 四、应用场景举例

### 4.1 用户注册流程（完美适配）

**传统 PRD 文本**:
```
用户点击注册 → 填写邮箱/密码 → 前端验证 → 后端验证 → 创建用户 → 发送欢迎邮件
```

**n8n 工作流节点**:
```
[Webhook 触发] → [验证邮箱格式] → [检查用户是否存在]
                                    ↓
                            [创建 Supabase 用户] → [发送邮件节点]
```

**版本对比示例**:
- V1: 只有基础注册
- V2: 🟢 新增"发送欢迎邮件"节点
- V3: 🟠 修改"验证逻辑"节点（增加密码强度检查）

### 4.2 订单处理流程（完美适配）

```
[订单创建] → [库存检查] → [IF: 库存充足?]
                              ↓ Yes          ↓ No
                        [扣减库存]        [通知补货]
                              ↓
                        [调用支付]
                              ↓
                        [生成发货单]
```

### 4.3 数据同步流程（完美适配）

```
[定时触发] → [HTTP 获取数据] → [转换格式] → [写入 Supabase]
                                                ↓
                                        [Slack 通知完成]
```

### 4.4 不适合的场景

❌ **UI/UX 设计需求**:
- "首页采用卡片式布局" - 难以用节点表达

❌ **视觉风格描述**:
- "品牌色为蓝色系，圆角8px" - 不适合节点

❌ **抽象战略规划**:
- "提升用户留存率" - 需要文字描述

---

## 五、技术实现方案

### 5.1 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│  用户界面                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐          ┌─────────────────────────┐ │
│  │  n8n 编辑器      │          │  版本对比视图           │ │
│  │  (嵌入或集成)    │          │  - 节点 diff            │ │
│  │                  │          │  - 可视化高亮           │ │
│  │  [拖拽节点]      │          │  - 并排对比             │ │
│  └──────────────────┘          └─────────────────────────┘ │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│  AI 助手 (OpenRouter + n8n-MCP)                             │
│  - 对话式生成工作流                                         │
│  - 修改和优化节点                                           │
│  - 生成场景图片                                             │
├─────────────────────────────────────────────────────────────┤
│  数据层 (Supabase)                                          │
│  - 存储工作流 JSON                                          │
│  - 版本历史管理                                             │
│  - 用户认证                                                 │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 核心功能模块

#### 1. n8n 编辑器集成

**选项 A: 嵌入 n8n 编辑器**
- 使用 iframe 嵌入 n8n 实例
- 优点：功能完整
- 缺点：需要部署 n8n 服务器

**选项 B: 自研轻量编辑器**
- 使用 React Flow 等图形库
- 模拟 n8n 节点样式
- 优点：轻量、可控
- 缺点：功能受限

**选项 C: 使用 n8n-MCP 纯 AI 生成** ⭐ 推荐
- 用户用自然语言描述流程
- AI 通过 n8n-MCP 生成 JSON
- 使用 N8N Viewer 可视化
- 优点：零学习成本，最简单
- 缺点：依赖 AI 理解准确性

#### 2. 版本对比逻辑

```typescript
// lib/workflow-diff.ts

export interface WorkflowDiff {
  addedNodes: Node[]      // 新增节点
  modifiedNodes: Node[]   // 修改节点
  deletedNodes: Node[]    // 删除节点
  addedConnections: Connection[]
  deletedConnections: Connection[]
}

export function compareWorkflows(
  oldWorkflow: WorkflowJSON,
  newWorkflow: WorkflowJSON
): WorkflowDiff {
  // 1. 对比节点
  const oldNodeIds = new Set(oldWorkflow.nodes.map(n => n.id))
  const newNodeIds = new Set(newWorkflow.nodes.map(n => n.id))

  const addedNodes = newWorkflow.nodes.filter(n => !oldNodeIds.has(n.id))
  const deletedNodes = oldWorkflow.nodes.filter(n => !newNodeIds.has(n.id))

  const modifiedNodes = newWorkflow.nodes.filter(newNode => {
    const oldNode = oldWorkflow.nodes.find(n => n.id === newNode.id)
    return oldNode && !_.isEqual(oldNode, newNode)
  })

  // 2. 对比连接
  // ...类似逻辑

  return { addedNodes, modifiedNodes, deletedNodes, ... }
}
```

#### 3. 可视化渲染

使用 **React Flow** 渲染 n8n 工作流：

```typescript
import ReactFlow from 'reactflow'

export function WorkflowViewer({ workflow, diff }: Props) {
  const nodes = workflow.nodes.map(node => ({
    id: node.id,
    type: node.type,
    data: { label: node.name },
    position: node.position,
    style: {
      // 根据 diff 设置颜色
      backgroundColor:
        diff.addedNodes.includes(node) ? '#22c55e' :  // 绿色
        diff.modifiedNodes.includes(node) ? '#f59e0b' : // 橙色
        '#fff'
    }
  }))

  const edges = extractConnections(workflow.connections)

  return <ReactFlow nodes={nodes} edges={edges} />
}
```

#### 4. AI 工作流生成（n8n-MCP）

```typescript
// lib/ai-workflow-generator.ts

export async function generateWorkflow(
  description: string
): Promise<WorkflowJSON> {
  // 调用支持 n8n-MCP 的 AI
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        {
          role: 'system',
          content: 'You are an n8n workflow expert. Use MCP tools to create workflows.'
        },
        {
          role: 'user',
          content: `Create an n8n workflow for: ${description}`
        }
      ],
      // 启用 MCP
      tools: [{ type: 'mcp', server: 'n8n-mcp' }]
    })
  })

  const result = await response.json()
  return result.workflow // n8n JSON 格式
}
```

### 5.3 数据库表结构（扩展）

```sql
-- 工作流版本表（替代原来的 versions 表）
create table workflow_versions (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects not null,
  version_number int not null,
  workflow_json jsonb not null,  -- 完整的 n8n JSON
  description text,               -- 版本描述
  created_at timestamp default now()
);

-- 工作流元数据
create table workflow_metadata (
  id uuid primary key default uuid_generate_v4(),
  version_id uuid references workflow_versions,
  node_count int,                 -- 节点数量
  connection_count int,           -- 连接数量
  complexity_score int            -- 复杂度评分
);
```

---

## 六、实施建议

### 6.1 MVP 方案（2.5小时）⭐ 推荐

**核心思路**: 用 AI 生成工作流 JSON，用可视化展示和对比

```
用户输入需求描述
    ↓
AI (通过 n8n-MCP) 生成 n8n JSON
    ↓
保存到 Supabase (workflow_versions)
    ↓
使用 React Flow 可视化渲染
    ↓
对比两个版本的 JSON，高亮差异
```

**功能清单**:
1. ✅ 用户认证（Supabase）
2. ✅ AI 对话生成工作流（OpenRouter + n8n-MCP）
3. ✅ 工作流可视化（React Flow）
4. ✅ 版本对比（JSON diff + 可视化高亮）
5. ✅ 保存/加载版本（Supabase）
6. ✅ 生成场景图片（现有功能）

**技术栈**:
- Next.js + TypeScript
- Supabase (Auth + DB)
- OpenRouter (AI + n8n-MCP)
- React Flow (可视化)
- difflib.js (JSON 对比)

**时间分配**:
- Supabase 设置: 10min
- 安装依赖: 5min
- AI 集成 (n8n-MCP): 30min ⭐ 核心
- React Flow 渲染: 30min
- 版本对比逻辑: 20min
- 保存/加载: 15min
- 用户认证: 15min
- 部署: 15min
- 测试: 20min

### 6.2 混合方案（3小时）

**同时支持文本和节点两种模式**:

- 用户选择"流程化需求" → n8n 节点模式
- 用户选择"描述性需求" → 文本模式

优点：适用范围更广
缺点：复杂度提升

### 6.3 进阶方案（未来迭代）

1. **嵌入真实 n8n 编辑器**
   - 用户可手动编辑节点
   - 完整的 n8n 功能

2. **工作流执行**
   - 在平台内直接运行工作流
   - 测试 PRD 逻辑

3. **多人协作编辑**
   - 实时同步节点修改
   - 冲突解决

---

## 七、风险和挑战

### 7.1 技术风险

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| n8n-MCP 稳定性 | AI 生成质量 | 人工审核 + 支持手动编辑 |
| React Flow 性能 | 大型工作流卡顿 | 虚拟化渲染 + 分页加载 |
| JSON 复杂度 | 对比算法复杂 | 使用成熟库（jsondiffpatch） |

### 7.2 用户体验风险

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| 学习成本 | 用户不理解节点概念 | 提供模板 + 教程 + AI 辅助 |
| 适用范围 | 部分需求无法表达 | 提供文本模式作为补充 |
| AI 理解偏差 | 生成的工作流不准确 | 支持迭代修正 + 用户反馈 |

---

## 八、最终建议

### 🎯 结论：**强烈推荐采用 n8n 节点方案**

**理由**:
1. ✅ **创新性**: 市面上没有类似产品，差异化竞争
2. ✅ **易用性**: 比写 PRD 文档简单 10 倍
3. ✅ **可视化**: 普通人也能看懂流程图
4. ✅ **可执行**: PRD 变成可运行的原型
5. ✅ **AI 原生**: n8n-MCP 天然支持，开发高效

### 📋 实施路径

**Phase 1 (MVP - 2.5小时)**:
- AI 生成 n8n JSON
- React Flow 可视化
- 版本对比高亮
- Supabase 存储
- 部署上线

**Phase 2 (迭代 - 1周)**:
- 优化 AI 生成质量
- 增加节点模板库
- 支持手动微调节点
- 增强对比功能

**Phase 3 (进阶 - 2周)**:
- 嵌入真实 n8n 编辑器
- 支持工作流执行
- 多人协作
- 导出到 n8n 平台

### 🚀 立即行动

建议修改原设计文档，将核心从"文本 PRD 对比"改为"n8n 工作流对比"。

---

**参考资料**:
- n8n-MCP: https://www.n8n-mcp.com/
- n8n Docs: https://docs.n8n.io/
- React Flow: https://reactflow.dev/
- N8N Viewer: https://n8nviewer.com/
