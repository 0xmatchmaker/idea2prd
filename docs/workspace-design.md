# Workspace 工作台设计文档

> 从 Idea 到 PRD 的多版本迭代工作台

**创建时间**: 2025-10-26
**最后更新**: 2025-10-26
**状态**: MVP开发中

## 🚀 2小时 MVP 方案

**目标**: 2小时内完成可用的最小版本
**对标**: diffchecker.com 的简洁风格
**核心功能**:
1. ✅ 双栏文本编辑器（左右对比）
2. ✅ 实时 diff 高亮显示
3. ✅ 多版本保存和切换
4. ✅ AI 对话（OpenRouter API）
5. ✅ AI 生成场景图片
6. ✅ 简洁的质量可视化

**界面布局**（参考 diffchecker）:
```
┌────────────────────────────────────────────────────────────┐
│  [Logo]  Version: [v1 ▼]  [💾 Save]  [🎨 Generate Image]  │
├──────────────────────┬─────────────────────────────────────┤
│                      │                                     │
│   Version 1 (Old)    │      Version 2 (New)                │
│   ┌────────────────┐ │   ┌────────────────────────────┐   │
│   │                │ │   │                            │   │
│   │  Text Editor   │ │   │  Text Editor               │   │
│   │                │ │   │  (with diff highlighting)  │   │
│   │                │ │   │                            │   │
│   └────────────────┘ │   └────────────────────────────┘   │
│                      │                                     │
├──────────────────────┴─────────────────────────────────────┤
│  AI Assistant [💬]                                         │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Chat with AI to improve your PRD...                  │ │
│  └──────────────────────────────────────────────────────┘ │
├────────────────────────────────────────────────────────────┤
│  📊 Quality: 75/100  |  📝 Changes: +240  -15  |  🎨 Images │
└────────────────────────────────────────────────────────────┤
```

**技术栈（最小化）**:
- Next.js + TypeScript
- shadcn/ui 基础组件
- diff-match-patch（复用 index.html）
- OpenRouter API（文本 + 图片生成）
- **Supabase（数据库 + 用户认证）**
- **Vercel（部署上线）**

**包含（MVP必需）**:
- ✅ 用户登录/注册（Supabase Auth）
- ✅ 云端版本存储（Supabase Database）
- ✅ 生产环境部署（Vercel）
- ✅ 环境变量配置

**不包含（后续迭代）**:
- ❌ 复杂的PRD章节分析
- ❌ 多维度质量评分算法
- ❌ Monaco编辑器（用简单textarea）
- ❌ 多人协作编辑

---

## 一、项目背景

### 1.1 项目目标
将现有的"论文改写对比工具"（index.html）改造成一个专门用于**从 Idea 到 PRD 文档**的迭代工作台。

### 1.2 核心问题
- 从想法到标准化PRD需求文档需要多轮讨论和迭代
- 需要追踪每次修改的内容和进步
- 需要AI辅助来帮助完善需求、识别问题
- 需要按PRD标准维度进行质量分析

### 1.3 相似性分析
论文改写过程和PRD迭代过程的相似之处：
- ✅ 都是多轮迭代完善的过程
- ✅ 需要对比不同版本的变化
- ✅ 需要识别进步和待改进点
- ✅ 有标准的结构和章节要求

---

## 二、需求确认

### 2.1 集成方式
- **决定**: 集成到现有 Next.js 项目中
- **路由**: `/workspace`
- **技术栈**: React + TypeScript + shadcn/ui

### 2.2 分析维度
- **决定**: 按 PRD 标准章节进行分析
- **覆盖章节**:
  - 项目背景 (Background)
  - 产品目标 (Goals)
  - 目标用户 (Target Users)
  - 用户场景 (User Scenarios)
  - 核心功能 (Core Features)
  - 功能需求 (Feature Requirements)
  - 非功能需求 (Non-functional Requirements)
  - 数据指标 (Success Metrics)
  - 技术方案 (Technical Solution)
  - 风险评估 (Risk Assessment)
  - 里程碑 (Milestones)

### 2.3 版本管理
- **决定**: 支持多版本追踪（v1 → v2 → v3...）
- **功能**:
  - 保存任意数量的版本
  - 选择任意两个版本进行对比
  - 显示版本演进时间线

### 2.4 AI 辅助
- **决定**: 集成 AI 辅助功能
- **功能方向**:
  - 从 Idea 生成 PRD 框架
  - 对话式完善需求
  - 智能分析矛盾和遗漏
  - 生成用户场景、测试用例等

---

## 三、方案设计

### 3.1 页面布局

采用**三栏式可调节布局**：

```
┌─────────────────────────────────────────────────────────────┐
│  Header: Idea2PRD Workspace                                 │
├──────────────┬──────────────────┬────────────────────────────┤
│              │                  │                            │
│  左侧        │     中间         │        右侧                │
│  版本管理    │   AI 对话助手    │    版本对比 + 质量分析     │
│              │                  │                            │
│  [时间线]    │  ┌────────────┐  │  ┌──────────┬──────────┐  │
│  • v3 (now) │  │ AI Chat    │  │  │  v2      │   v3     │  │
│  • v2        │  │ Interface  │  │  │  (old)   │  (new)   │  │
│  • v1        │  │            │  │  │          │          │  │
│              │  │            │  │  └──────────┴──────────┘  │
│  [编辑器]    │  │            │  │                            │
│  ┌────────┐  │  └────────────┘  │  [质量报告]                │
│  │ Editor │  │                  │  📋 完整性: 85%            │
│  │        │  │  [快捷指令]      │  🎯 清晰度: 70%            │
│  │        │  │  • 生成框架      │  📊 指标性: 60%            │
│  │        │  │  • 完善章节      │  ⚡ 优先级: 75%            │
│  └────────┘  │  • 风险分析      │  📈 总分: 73/100           │
│              │                  │                            │
│  [保存版本]  │                  │  [改进亮点]                │
│              │                  │  • 新增用户场景描述...     │
└──────────────┴──────────────────┴────────────────────────────┘
```

### 3.2 核心功能模块

#### 3.2.1 版本管理模块
**组件**: `VersionTimeline.tsx`, `DocumentEditor.tsx`

**功能**:
- 显示所有保存的版本（时间线形式）
- 切换和查看不同版本
- 保存当前内容为新版本
- 为版本添加标签/备注（如"初稿"、"讨论后v2"）
- 删除/导出特定版本

**数据结构**:
```typescript
interface Version {
  id: string              // 唯一ID
  number: number          // 版本号 1, 2, 3...
  content: string         // PRD文档内容
  timestamp: Date         // 创建时间
  label?: string          // 可选标签
  aiContext?: AIMessage[] // 关联的AI对话历史
}
```

#### 3.2.2 AI 对话助手
**组件**: `AIAssistant.tsx`

**功能**:
- ChatGPT式的对话界面
- 快捷指令按钮
- 上下文理解（知道当前PRD内容）
- 插入AI生成的内容到编辑器

**快捷指令**:
| 指令 | 功能 | Prompt 模板 |
|------|------|------------|
| 🎯 生成框架 | 从一句话Idea生成完整PRD框架 | "根据这个想法生成PRD框架：{idea}" |
| 📝 完善章节 | 深入完善某个章节 | "请帮我完善【{章节名}】部分" |
| 🔍 识别问题 | 找出需求矛盾、遗漏、不清晰的地方 | "分析当前PRD的问题" |
| 👥 生成用户场景 | 生成具体的用户故事 | "为{功能}生成3个用户场景" |
| ⚠️ 风险评估 | 识别技术风险和业务风险 | "评估这个PRD的潜在风险" |
| 📊 生成指标 | 提供可量化的成功指标 | "为这些功能设计衡量指标" |

#### 3.2.3 版本对比模块
**组件**: `DiffViewer.tsx`

**功能**:
- 选择两个版本进行对比
- 双栏显示（左：旧版本，右：新版本）
- 高亮显示：
  - 🟢 新增内容（绿色高亮）
  - 🔴 删除内容（红色删除线）
  - 🟡 修改内容（黄色高亮）

**技术**:
- 复用 `diff-match-patch` 库
- 按行或按段落进行diff

#### 3.2.4 质量分析模块
**组件**: `QualityReport.tsx`

**功能**:
- 实时分析当前PRD质量
- 多维度评分
- 具体改进建议

**质量维度**:
```typescript
interface QualityScore {
  completeness: number    // 📋 需求完整性 0-100
  clarity: number         // 🎯 场景清晰度 0-100
  metrics: number         // 📊 指标明确性 0-100
  feasibility: number     // 🛠️ 方案可行性 0-100
  priority: number        // ⚡ 优先级排序 0-100
  overall: number         // 📈 总体评分 0-100
  insights: string[]      // 改进亮点列表
  suggestions: string[]   // 待改进建议
}
```

**评分算法**（参考论文工具的逻辑）:
1. **需求完整性**: 检测是否包含必需章节（背景、目标、场景、功能等）
2. **场景清晰度**: 检测用户场景描述的具体性
   - 关键词："作为...用户"、"我想要"、"以便于"
3. **指标明确性**: 检测数字、百分比、KPI描述
   - 正则：`/\d+%|\d+[万千百]|DAU|MAU|转化率/`
4. **方案可行性**: 检测技术方案、实现细节、风险评估章节
5. **优先级排序**: 检测 P0/P1/P2、必须/重要/可选等标记

---

## 四、技术实现

### 4.1 文件结构

```
app/
  workspace/
    page.tsx                      # 主工作台页面
    components/
      VersionTimeline.tsx         # 版本时间线组件
      VersionItem.tsx             # 单个版本项
      DocumentEditor.tsx          # 文档编辑器
      AIAssistant.tsx             # AI对话助手
      QuickActions.tsx            # 快捷指令按钮组
      DiffViewer.tsx              # 差异对比视图
      QualityReport.tsx           # 质量分析报告
      ScoreCard.tsx               # 单个评分卡片

lib/
  prd/
    analyzer.ts                   # PRD分析引擎（章节识别、质量评分）
    differ.ts                     # 版本对比（diff算法）
    sections.ts                   # PRD章节定义和模板
    quality-metrics.ts            # 质量指标计算逻辑
    templates.ts                  # PRD模板库

  ai/
    prompts.ts                    # AI提示词模板
    client.ts                     # AI API调用封装
    types.ts                      # AI相关类型定义

hooks/
  useVersions.ts                  # 版本管理hook
  useAIChat.ts                    # AI对话hook
  useDiff.ts                      # 版本对比hook
  useQualityScore.ts              # 质量分析hook
  useLocalStorage.ts              # localStorage封装

types/
  workspace.ts                    # Workspace相关类型定义
```

### 4.2 数据存储

#### 阶段1：本地存储（MVP）
```typescript
// localStorage keys
const STORAGE_KEYS = {
  VERSIONS: 'prd_versions',           // 所有版本
  CURRENT_VERSION: 'prd_current',     // 当前选中版本ID
  AI_HISTORY: 'prd_ai_history',       // AI对话历史
  USER_SETTINGS: 'prd_settings'       // 用户设置
}
```

#### 阶段2：云端存储（未来）
- 后端API + 数据库
- 支持多人协作
- 版本冲突解决

### 4.3 核心算法

#### 4.3.1 章节识别算法
```typescript
// lib/prd/analyzer.ts

const PRD_SECTIONS = [
  { name: '项目背景', keywords: ['背景', 'background', 'context'], required: true },
  { name: '产品目标', keywords: ['目标', 'goals', 'objectives'], required: true },
  { name: '目标用户', keywords: ['用户', 'target users', '受众'], required: true },
  { name: '用户场景', keywords: ['场景', 'scenarios', 'user stories'], required: true },
  // ... 更多章节
]

function detectSections(content: string): Section[] {
  // 1. 按行分割
  // 2. 识别标题（# ## ### 或 1. 2. 3. 或 一、二、三、）
  // 3. 匹配关键词
  // 4. 返回章节列表
}
```

#### 4.3.2 质量评分算法
```typescript
// lib/prd/quality-metrics.ts

function calculateCompletenessScore(sections: Section[]): number {
  const requiredSections = PRD_SECTIONS.filter(s => s.required)
  const foundCount = requiredSections.filter(req =>
    sections.some(sec => sec.matches(req))
  ).length
  return (foundCount / requiredSections.length) * 100
}

function calculateClarityScore(content: string): number {
  // 检测用户场景模式："作为...我想要...以便于..."
  const userStoryPattern = /(作为|as a).*?(我想要|I want).*?(以便于|so that)/gi
  const matches = content.match(userStoryPattern) || []

  // 检测具体案例："例如"、"比如"
  const examplePattern = /(例如|比如|举例|for example|such as)/gi
  const examples = content.match(examplePattern) || []

  // 综合评分
  const baseScore = Math.min(matches.length * 15, 50)
  const exampleBonus = Math.min(examples.length * 5, 30)
  return Math.min(baseScore + exampleBonus, 100)
}

// 类似地实现其他评分函数...
```

### 4.4 UI 组件库

使用现有的 shadcn/ui 组件：
- `ResizablePanelGroup` / `ResizablePanel` - 三栏布局
- `Card` - 质量报告卡片
- `Button` - 各种按钮
- `Textarea` - 编辑器（或使用 Monaco Editor）
- `Badge` - 版本标签、评分标签
- `Tabs` - 切换不同视图
- `ScrollArea` - 滚动区域
- `Separator` - 分隔线
- `Tooltip` - 提示信息

### 4.5 第三方库

| 库 | 用途 | 原因 |
|----|------|------|
| `diff-match-patch` | 文本对比 | 从 index.html 复用，成熟稳定 |
| `react-resizable-panels` | 可调节布局 | 已在项目中使用 |
| `@monaco-editor/react` | 代码编辑器（可选） | 更好的编辑体验 |
| `date-fns` | 日期格式化 | 已在项目中使用 |
| `lucide-react` | 图标 | 已在项目中使用 |

---

## 五、实施步骤

### Phase 1: 基础框架（预计2-3小时）
- [ ] 创建 `/workspace` 路由和基础布局
- [ ] 实现三栏可调节布局
- [ ] 添加导航链接
- [ ] 创建基础组件文件

### Phase 2: 版本管理（预计3-4小时）
- [ ] 实现版本数据结构和 localStorage 存储
- [ ] 创建版本时间线组件
- [ ] 实现文档编辑器（简单 textarea）
- [ ] 保存/加载/切换版本功能
- [ ] 版本删除和导出功能

### Phase 3: 版本对比（预计2-3小时）
- [ ] 移植 diff-match-patch 逻辑到 React
- [ ] 创建双栏对比视图组件
- [ ] 实现高亮显示（新增/删除/修改）
- [ ] 添加版本选择器

### Phase 4: PRD 分析器（预计4-5小时）
- [ ] 实现章节识别算法
- [ ] 实现质量评分算法
  - [ ] 完整性评分
  - [ ] 清晰度评分
  - [ ] 指标性评分
  - [ ] 可行性评分
  - [ ] 优先级评分
- [ ] 创建质量报告组件
- [ ] 生成改进建议

### Phase 5: AI 助手（预计5-6小时）
- [ ] 设计 AI 提示词模板
- [ ] 实现 AI API 调用（需要API key配置）
- [ ] 创建对话界面组件
- [ ] 实现快捷指令功能
- [ ] 将 AI 回复插入到编辑器
- [ ] 保存 AI 对话历史

### Phase 6: 优化体验（预计2-3小时）
- [ ] 响应式布局适配
- [ ] 快捷键支持（Ctrl+S 保存等）
- [ ] 加载动画和错误处理
- [ ] 导出功能（Markdown/PDF）
- [ ] 主题适配（暗色/亮色）

### Phase 7: 测试和完善（预计2小时）
- [ ] 功能测试
- [ ] 边界情况处理
- [ ] 性能优化
- [ ] 文档完善

**总预计时间**: 20-26小时

---

## 六、待讨论问题

### 6.1 编辑器选择
**问题**: 使用简单的 `<textarea>` 还是集成 Monaco Editor？

**选项对比**:
| 方案 | 优点 | 缺点 |
|------|------|------|
| Textarea | 简单快速，轻量级 | 功能有限，无语法高亮 |
| Monaco Editor | 强大的编辑功能，语法高亮，快捷键 | 体积较大，配置复杂 |

**建议**: MVP阶段先用 textarea，后期根据需要升级

### 6.2 AI API 选择
**问题**: 使用哪个 AI API？

**选项**:
- OpenAI GPT-4 / GPT-3.5
- Anthropic Claude
- 本地模型（如 Ollama）
- 用户自带 API key

**建议**: 支持用户配置自己的 API key，默认提供多个选项

### 6.3 数据导出格式
**问题**: 除了 Markdown，还需要支持哪些格式？

**选项**:
- [ ] Markdown (.md)
- [ ] PDF
- [ ] Word (.docx)
- [ ] 飞书/Notion 格式

### 6.4 协作功能
**问题**: 未来是否需要支持多人协作？

如果需要，需要考虑：
- 实时同步
- 冲突解决
- 评论功能
- 权限管理

---

## 七、后续迭代方向

### 7.1 短期（1-2周）
- [ ] 完成 MVP 核心功能
- [ ] 用户反馈收集
- [ ] Bug 修复和性能优化

### 7.2 中期（1个月）
- [ ] 升级编辑器（Monaco）
- [ ] 增强 AI 能力（更多指令）
- [ ] PRD 模板库
- [ ] 导出更多格式

### 7.3 长期（2-3个月）
- [ ] 云端存储和同步
- [ ] 多人协作功能
- [ ] PRD 质量评分系统优化
- [ ] 与项目管理工具集成（Jira、Notion等）

---

## 八、参考资料

### 8.1 现有资源
- `index.html` - 论文对比工具（diff算法参考）
- 项目现有组件库（shadcn/ui）

### 8.2 技术文档
- [diff-match-patch 文档](https://github.com/google/diff-match-patch)
- [Monaco Editor 文档](https://microsoft.github.io/monaco-editor/)
- [Next.js 文档](https://nextjs.org/docs)

### 8.3 PRD 标准
- [产品需求文档模板](https://www.productplan.com/glossary/product-requirements-document/)
- [用户故事格式](https://www.atlassian.com/agile/project-management/user-stories)

---

## 变更历史

| 日期 | 变更内容 | 作者 |
|------|----------|------|
| 2025-10-26 | 初始版本，完成需求分析和方案设计 | Claude |

---

## 九、2.5小时 MVP 实施计划（含上线部署）

### 总体时间分配
- **前置准备**: 15分钟 - Supabase设置、依赖安装
- **核心开发**: 100分钟 - 主要功能实现
- **部署上线**: 15分钟 - Vercel部署和配置
- **测试调整**: 20分钟 - 测试和bug修复

### 详细步骤

#### Step 0: Supabase 项目设置（10分钟）
- [ ] 在 Supabase 创建新项目
- [ ] 创建数据库表结构：
  ```sql
  -- projects 表（PRD项目）
  create table projects (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users not null,
    name text not null,
    created_at timestamp default now(),
    updated_at timestamp default now()
  );

  -- versions 表（版本历史）
  create table versions (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references projects not null,
    version_number int not null,
    content text not null,
    images jsonb default '[]',
    created_at timestamp default now()
  );

  -- 启用 RLS（行级安全）
  alter table projects enable row level security;
  alter table versions enable row level security;

  -- 策略：用户只能访问自己的数据
  create policy "Users can only access their own projects"
    on projects for all
    using (auth.uid() = user_id);

  create policy "Users can only access their own versions"
    on versions for all
    using (
      exists (
        select 1 from projects
        where projects.id = versions.project_id
        and projects.user_id = auth.uid()
      )
    );
  ```
- [ ] 配置 Auth 提供商（Email + Password）
- [ ] 获取 API keys（anon key + URL）

#### Step 1: 环境准备（5分钟）
- [ ] 安装依赖:
  ```bash
  pnpm add diff-match-patch @types/diff-match-patch
  pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
  ```
- [ ] 创建 `.env.local`:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  NEXT_PUBLIC_OPENROUTER_API_KEY=your-openrouter-key
  ```
- [ ] 创建基础文件结构

#### Step 2: 页面框架（15分钟）
- [ ] 创建 `app/workspace/page.tsx`
- [ ] 实现双栏布局（grid或flex）
- [ ] 添加顶部工具栏
- [ ] 添加底部状态栏

#### Step 3: 编辑器和Diff（25分钟）
- [ ] 左右两个 textarea 组件
- [ ] 集成 diff-match-patch 库
- [ ] 实现实时 diff 计算
- [ ] 添加高亮显示（绿色新增、红色删除）
- [ ] 显示改动统计（+X -Y）

#### Step 3.5: 用户认证（15分钟）
- [ ] 创建 `lib/supabase.ts` - Supabase 客户端
- [ ] 创建登录/注册组件
- [ ] 实现登录逻辑
- [ ] 实现注册逻辑
- [ ] 添加登出功能
- [ ] 保护 workspace 路由（需登录才能访问）

#### Step 4: 版本管理（20分钟）
- [ ] 创建版本数据结构（对接 Supabase）
- [ ] 创建项目（第一次使用时）
- [ ] 保存版本到 Supabase（versions 表）
- [ ] 从 Supabase 加载版本列表
- [ ] 版本下拉选择器
- [ ] 切换版本功能

#### Step 5: AI 集成（25分钟）
- [ ] 创建 OpenRouter API 调用函数
- [ ] AI 对话界面（简单的输入框+消息列表）
- [ ] 发送当前文档内容给 AI
- [ ] 显示 AI 回复
- [ ] "插入到右侧编辑器"功能

#### Step 6: AI 图片生成（10分钟）
- [ ] 添加"生成场景图片"按钮
- [ ] 调用 OpenRouter 图片生成 API
- [ ] 显示生成的图片
- [ ] 保存图片到版本历史

#### Step 7: 质量可视化（10分钟）
- [ ] 简单的质量评分（基于文档长度、新增内容）
- [ ] 底部状态栏显示
- [ ] 进度条或评分徽章

#### Step 8: 部署到 Vercel（15分钟）
- [ ] 提交代码到 Git 仓库
- [ ] 连接 Vercel（import repository）
- [ ] 配置环境变量：
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_OPENROUTER_API_KEY`
- [ ] 部署到生产环境
- [ ] 验证上线后的功能

#### Step 9: 测试和优化（20分钟）
- [ ] 生产环境功能测试
- [ ] 用户认证流程测试
- [ ] 版本保存/加载测试
- [ ] AI 对话和图片生成测试
- [ ] 样式调整
- [ ] 错误处理
- [ ] 加载状态

### 文件清单

**需要创建的文件**:
```
app/workspace/page.tsx                 # 主页面
app/login/page.tsx                     # 登录页面
components/auth/                       # 认证相关组件
  LoginForm.tsx                        # 登录表单
  SignupForm.tsx                       # 注册表单
lib/supabase.ts                        # Supabase 客户端初始化
lib/diff-utils.ts                      # diff 计算工具
lib/openrouter.ts                      # OpenRouter API 封装
lib/db/                                # 数据库操作
  projects.ts                          # 项目相关操作
  versions.ts                          # 版本相关操作
types/workspace.ts                     # 类型定义
```

**配置文件**:
```
.env.local                             # API key配置
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-...
```

### 简化策略

为了在2.5小时内完成，采用以下简化：

1. **最小化组件拆分**: 核心逻辑集中，只拆分必要的认证组件
2. **最小化样式**: 使用 Tailwind 内联样式，不单独写 CSS
3. **简单的AI**: 只实现基础对话，不做复杂的上下文管理
4. **基础认证**: 只用 Email + Password，不做 OAuth
5. **基础diff**: 只做文本diff，不做语义分析
6. **简单评分**: 基于字数和改动量的简单算法
7. **单项目模式**: MVP 阶段每个用户只有一个默认项目

### 关键代码片段

#### OpenRouter API 调用示例
```typescript
// lib/openrouter.ts
export async function chatWithAI(message: string, context: string) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-3.5-sonnet',
      messages: [
        { role: 'system', content: 'You are a PRD assistant.' },
        { role: 'user', content: `Context: ${context}\n\nQuestion: ${message}` }
      ]
    })
  })
  return await response.json()
}

export async function generateImage(prompt: string) {
  const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024'
    })
  })
  return await response.json()
}
```

#### Supabase 客户端初始化
```typescript
// lib/supabase.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function createClient() {
  return createClientComponentClient()
}
```

#### 认证示例
```typescript
// components/auth/LoginForm.tsx
import { createClient } from '@/lib/supabase'

export async function login(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

export async function signup(email: string, password: string) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })
  if (error) throw error
  return data
}
```

#### 版本存储示例（Supabase）
```typescript
// lib/db/versions.ts
import { createClient } from '@/lib/supabase'

export interface Version {
  id: string
  project_id: string
  version_number: number
  content: string
  images: string[]
  created_at: string
}

export async function saveVersion(
  projectId: string,
  content: string,
  images: string[] = []
): Promise<Version> {
  const supabase = createClient()

  // 获取当前最大版本号
  const { data: versions } = await supabase
    .from('versions')
    .select('version_number')
    .eq('project_id', projectId)
    .order('version_number', { ascending: false })
    .limit(1)

  const nextVersion = (versions?.[0]?.version_number || 0) + 1

  const { data, error } = await supabase
    .from('versions')
    .insert({
      project_id: projectId,
      version_number: nextVersion,
      content,
      images
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getVersions(projectId: string): Promise<Version[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('versions')
    .select('*')
    .eq('project_id', projectId)
    .order('version_number', { ascending: false })

  if (error) throw error
  return data || []
}
```

#### 项目管理示例
```typescript
// lib/db/projects.ts
import { createClient } from '@/lib/supabase'

export async function getOrCreateDefaultProject(userId: string) {
  const supabase = createClient()

  // 查找用户的项目
  const { data: existing } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .limit(1)
    .single()

  if (existing) return existing

  // 创建默认项目
  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      name: 'My PRD Project'
    })
    .select()
    .single()

  if (error) throw error
  return data
}
```

---

**下一步行动**: 用户确认后立即开始 MVP 开发（预计2.5小时，含 Supabase 集成和 Vercel 部署）

---

## 十、部署清单

### 前置条件
- [ ] Supabase 账号并创建项目
- [ ] OpenRouter API key
- [ ] GitHub 仓库
- [ ] Vercel 账号

### Supabase 设置
- [ ] 创建 `projects` 和 `versions` 表
- [ ] 配置 RLS 策略
- [ ] 启用 Email Auth
- [ ] 获取 API keys

### Vercel 部署
- [ ] Push 代码到 GitHub
- [ ] 连接 Vercel
- [ ] 配置环境变量
- [ ] 部署
- [ ] 验证功能

### 上线后验证
- [ ] 用户注册/登录功能正常
- [ ] 版本保存到数据库
- [ ] 版本加载和切换正常
- [ ] Diff 高亮显示正常
- [ ] AI 对话功能正常
- [ ] AI 图片生成功能正常
- [ ] 质量统计显示正常
