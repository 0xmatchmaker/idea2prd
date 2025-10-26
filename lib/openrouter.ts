import type { N8nWorkflow, GenerateWorkflowResponse, GenerateImageResponse, Blueprint, UserStory } from '@/types/workspace'

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1'
const DEFAULT_MODEL = process.env.NEXT_PUBLIC_DEFAULT_AI_MODEL || 'anthropic/claude-3.5-sonnet'
const IMAGE_MODEL = process.env.NEXT_PUBLIC_IMAGE_MODEL || 'openai/dall-e-3'

function getApiKey(): string {
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OpenRouter API key is not configured')
  }
  return apiKey
}

/**
 * 使用 AI 生成需求流程图
 * @param description 用户的自然语言描述
 * @param context 可选的上下文信息
 */
export async function generateWorkflow(
  description: string,
  context?: string
): Promise<GenerateWorkflowResponse> {
  const apiKey = getApiKey()

  // 检测输入语言（简单判断：包含中文字符则为中文）
  const isChinese = /[\u4e00-\u9fa5]/.test(description)

  const systemPrompt = isChinese
    ? `你是一个专业的需求分析师和流程设计专家。你的任务是将自然语言需求描述转换为可视化的需求流程图（使用 n8n 格式的 JSON）。

需求流程图结构：
{
  "nodes": [
    {
      "id": "unique-id",
      "type": "n8n-nodes-base.webhook",
      "name": "接收请求",
      "position": [250, 300],
      "parameters": { /* 节点配置 */ }
    }
  ],
  "connections": {
    "node-id": {
      "main": [[{ "node": "next-node-id", "type": "main", "index": 0 }]]
    }
  }
}

常用节点类型（请使用中文名称）：
- n8n-nodes-base.webhook: "接收请求" / "触发器"
- n8n-nodes-base.httpRequest: "API调用" / "HTTP请求"
- n8n-nodes-base.function: "数据处理" / "业务逻辑"
- n8n-nodes-base.if: "条件判断" / "分支判断"
- n8n-nodes-base.set: "数据转换" / "设置数据"
- n8n-nodes-base.switch: "多条件分支"
- n8n-nodes-base.code: "代码执行"

重要规则：
1. 只返回有效的 JSON（不要用 markdown 代码块，不要有额外说明）
2. 使用顺序 ID："node-1", "node-2" 等
3. 节点横向排列：[250, 300], [450, 300], [650, 300] 等
4. 按顺序连接节点
5. 节点名称必须使用中文，简洁清晰地描述功能
6. 保持简单实用，突出需求要点`
    : `You are an expert requirements analyst and process designer. Your task is to convert natural language requirement descriptions into visual requirement flow diagrams (using n8n format JSON).

Requirement flow diagram structure:
{
  "nodes": [
    {
      "id": "unique-id",
      "type": "n8n-nodes-base.webhook",
      "name": "Receive Request",
      "position": [250, 300],
      "parameters": { /* node config */ }
    }
  ],
  "connections": {
    "node-id": {
      "main": [[{ "node": "next-node-id", "type": "main", "index": 0 }]]
    }
  }
}

Common node types (use English names):
- n8n-nodes-base.webhook: "Receive Request" / "Trigger"
- n8n-nodes-base.httpRequest: "API Call" / "HTTP Request"
- n8n-nodes-base.function: "Process Data" / "Business Logic"
- n8n-nodes-base.if: "Conditional Check" / "Branch Decision"
- n8n-nodes-base.set: "Transform Data" / "Set Data"
- n8n-nodes-base.switch: "Multiple Branches"
- n8n-nodes-base.code: "Execute Code"

IMPORTANT:
1. Return ONLY valid JSON (no markdown, no explanations outside JSON)
2. Use sequential IDs like "node-1", "node-2", etc.
3. Position nodes horizontally: [250, 300], [450, 300], [650, 300], etc.
4. Connect nodes in sequence
5. Node names must be in English, clearly describing the function
6. Keep it simple and practical, highlighting key requirements`

  const userPrompt = context
    ? `Context: ${context}\n\n${isChinese ? '生成需求流程图' : 'Generate requirement flow diagram'}: ${description}`
    : `${isChinese ? '生成需求流程图' : 'Generate requirement flow diagram'}: ${description}`

  try {
    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
        'X-Title': 'idea2prd'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenRouter API error: ${error}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from AI')
    }

    // 尝试从响应中提取 JSON
    let workflow: N8nWorkflow
    try {
      // 如果响应包含 markdown 代码块，提取 JSON
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/)
      const jsonString = jsonMatch ? jsonMatch[1] : content
      workflow = JSON.parse(jsonString.trim())
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      throw new Error('AI returned invalid workflow JSON')
    }

    // 验证基本结构
    if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
      throw new Error('Invalid workflow: missing nodes array')
    }

    return {
      workflow,
      explanation: `Generated workflow with ${workflow.nodes.length} nodes`
    }
  } catch (error) {
    console.error('Error generating workflow:', error)
    throw error
  }
}

/**
 * 使用 AI 对话优化工作流
 */
export async function chatWithAI(
  message: string,
  currentWorkflow?: N8nWorkflow
): Promise<string> {
  const apiKey = getApiKey()

  const systemPrompt = 'You are an expert n8n workflow assistant. Help users improve and understand their workflows.'

  const context = currentWorkflow
    ? `Current workflow has ${currentWorkflow.nodes.length} nodes: ${currentWorkflow.nodes.map(n => n.name).join(', ')}`
    : 'No current workflow'

  const userPrompt = `${context}\n\nUser question: ${message}`

  try {
    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
        'X-Title': 'idea2prd'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || 'No response from AI'
  } catch (error) {
    console.error('Error chatting with AI:', error)
    throw error
  }
}

/**
 * 生成场景图片
 * 使用 OpenRouter 的图片生成功能（通过支持图片生成的模型）
 */
export async function generateSceneImage(
  prompt: string
): Promise<GenerateImageResponse> {
  const apiKey = getApiKey()

  // OpenRouter 支持图片生成的模型
  // Gemini 2.5 Flash Image Preview (代号 "Nano Banana")
  // 文档：https://openrouter.ai/announcements/the-first-ever-image-model-is-up-on-openrouter
  const imageGenerationModel = 'google/gemini-2.5-flash-preview-image'

  try {
    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
        'X-Title': 'idea2prd'
      },
      body: JSON.stringify({
        model: imageGenerationModel,
        messages: [
          {
            role: 'user',
            content: `Generate a professional, clean illustration of this business workflow scenario: ${prompt}. Make it visually clear and suitable for a PRD document.`
          }
        ],
        // 关键：指定输出模态包含图片
        modalities: ['image', 'text'],
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Image generation API error:', response.status, errorText)

      // 如果模型不支持，使用占位图
      if (response.status === 400 || response.status === 404) {
        console.warn('Model does not support image generation, using placeholder')
        return {
          url: `https://placehold.co/1024x1024/3b82f6/white?text=${encodeURIComponent('Workflow Scene\n\n' + prompt.slice(0, 50))}`,
          prompt
        }
      }

      throw new Error(`Image generation error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    console.log('Image generation response:', data)

    // OpenRouter 返回的图片在 choices[0].message.images 中
    const images = data.choices?.[0]?.message?.images

    if (!images || images.length === 0) {
      console.warn('No images in response, using placeholder')
      return {
        url: `https://placehold.co/1024x1024/3b82f6/white?text=${encodeURIComponent('Workflow Scene\n\n' + prompt.slice(0, 50))}`,
        prompt
      }
    }

    // 图片通常是 base64 data URL 格式
    const imageUrl = images[0]

    return {
      url: imageUrl,
      prompt
    }
  } catch (error: any) {
    console.error('Error generating image:', error)

    // 出错时返回占位图，不中断用户流程
    return {
      url: `https://placehold.co/1024x1024/3b82f6/white?text=${encodeURIComponent('Workflow Scene\n\n' + prompt.slice(0, 50))}`,
      prompt
    }
  }
}

/**
 * 分析需求描述并提取关键信息
 * 用于需求澄清功能
 */
export async function analyzeRequirement(description: string): Promise<any> {
  const apiKey = getApiKey()

  const isChinese = /[\u4e00-\u9fa5]/.test(description)

  const systemPrompt = isChinese
    ? `你是一个专业的需求分析师。分析用户的需求描述，提取关键角色和功能特性。

请以 JSON 格式返回分析结果：
{
  "analysis": {
    "roles": [
      { "name": "角色名称", "confidence": "high|medium|low" }
    ],
    "features": [
      { "name": "功能特性", "confidence": "high|medium|low" }
    ]
  }
}

置信度说明：
- high: 需求中明确提到的
- medium: 可以合理推断的
- low: 可能需要但不确定的

只返回 JSON，不要额外说明。`
    : `You are a professional requirements analyst. Analyze the user's requirement description and extract key roles and features.

Return the analysis in JSON format:
{
  "analysis": {
    "roles": [
      { "name": "role name", "confidence": "high|medium|low" }
    ],
    "features": [
      { "name": "feature name", "confidence": "high|medium|low" }
    ]
  }
}

Confidence levels:
- high: explicitly mentioned in the requirement
- medium: can be reasonably inferred
- low: might be needed but uncertain

Return ONLY JSON, no additional explanations.`

  try {
    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
        'X-Title': 'idea2prd'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: description }
        ],
        temperature: 0.5,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenRouter API error: ${error}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from AI')
    }

    // 提取 JSON
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/)
    const jsonString = jsonMatch ? jsonMatch[1] : content
    const result = JSON.parse(jsonString.trim())

    return {
      analysis: result.analysis,
      rawResponse: content
    }
  } catch (error) {
    console.error('Error analyzing requirement:', error)
    throw error
  }
}

/**
 * 基于用户故事生成产品蓝图
 */
export async function generateBlueprint(
  description: string,
  userStories?: UserStory[]
): Promise<{ blueprint: Blueprint; explanation?: string }> {
  const apiKey = getApiKey()

  const isChinese = /[\u4e00-\u9fa5]/.test(description)

  const systemPrompt = isChinese
    ? `你是一个专业的产品架构师。根据需求描述和用户故事，生成详细的产品蓝图（增强版 n8n 格式）。

蓝图结构：
{
  "nodes": [
    {
      "id": "node-1",
      "type": "n8n-nodes-base.webhook",
      "name": "接收请求",
      "position": [250, 300],
      "parameters": {},
      "priority": "P0",  // P0=MVP必需，P1=重要，P2=增强，P3=未来
      "groupId": "group-1",  // 所属模块
      "userStoryIds": ["story-0", "story-1"],  // 关联的用户故事
      "technicalNotes": "使用 REST API，需要验证 token"
    }
  ],
  "connections": {
    "node-1": {
      "main": [[{ "node": "node-2", "type": "main", "index": 0 }]]
    }
  },
  "groups": [
    {
      "id": "group-1",
      "name": "用户模块",
      "type": "module",
      "color": "#10b981",
      "nodeIds": ["node-1", "node-2"]
    }
  ],
  "stickyNotes": [
    {
      "id": "note-1",
      "content": "这个模块负责用户认证和授权",
      "position": [100, 200],
      "color": "#fef3c7"
    }
  ]
}

重要规则：
1. 只返回有效的 JSON
2. 为每个节点标记优先级（MVP功能标记为P0）
3. 使用分组组织相关节点
4. 添加便签说明关键设计决策
5. 在 technicalNotes 中添加技术细节
6. 使用 userStoryIds 关联用户故事

只返回 JSON，不要额外说明。`
    : `You are a professional product architect. Generate a detailed product blueprint (enhanced n8n format) based on requirements and user stories.

Blueprint structure:
{
  "nodes": [
    {
      "id": "node-1",
      "type": "n8n-nodes-base.webhook",
      "name": "Receive Request",
      "position": [250, 300],
      "parameters": {},
      "priority": "P0",  // P0=MVP, P1=Important, P2=Enhancement, P3=Future
      "groupId": "group-1",
      "userStoryIds": ["story-0", "story-1"],
      "technicalNotes": "Use REST API, token validation required"
    }
  ],
  "connections": {
    "node-1": {
      "main": [[{ "node": "node-2", "type": "main", "index": 0 }]]
    }
  },
  "groups": [
    {
      "id": "group-1",
      "name": "User Module",
      "type": "module",
      "color": "#10b981",
      "nodeIds": ["node-1", "node-2"]
    }
  ],
  "stickyNotes": [
    {
      "id": "note-1",
      "content": "This module handles user authentication",
      "position": [100, 200],
      "color": "#fef3c7"
    }
  ]
}

IMPORTANT:
1. Return ONLY valid JSON
2. Mark priority for each node (MVP features as P0)
3. Use groups to organize related nodes
4. Add sticky notes for key design decisions
5. Add technical details in technicalNotes
6. Link user stories with userStoryIds

Return ONLY JSON, no additional explanations.`

  const userPrompt = userStories
    ? `需求：${description}\n\n用户故事：\n${userStories.map((s, i) => `${i}. 作为${s.role}，我想要${s.feature}，以便${s.value}`).join('\n')}`
    : description

  try {
    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
        'X-Title': 'idea2prd'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 6000
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenRouter API error: ${error}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from AI')
    }

    // 提取 JSON
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/)
    const jsonString = jsonMatch ? jsonMatch[1] : content
    const blueprint = JSON.parse(jsonString.trim())

    // 验证结构
    if (!blueprint.nodes || !Array.isArray(blueprint.nodes)) {
      throw new Error('Invalid blueprint: missing nodes array')
    }

    return {
      blueprint,
      explanation: `Generated blueprint with ${blueprint.nodes.length} nodes, ${blueprint.groups?.length || 0} groups, ${blueprint.stickyNotes?.length || 0} notes`
    }
  } catch (error) {
    console.error('Error generating blueprint:', error)
    throw error
  }
}

/**
 * 根据角色和功能生成用户故事
 */
export async function generateUserStories(
  roles: string[],
  features: string[]
): Promise<any> {
  const apiKey = getApiKey()

  const isChinese = /[\u4e00-\u9fa5]/.test(roles.join('') + features.join(''))

  const systemPrompt = isChinese
    ? `你是一个敏捷开发专家。根据提供的角色和功能特性，生成用户故事。

用户故事格式：作为【角色】，我想要【功能】，以便【价值】

请以 JSON 格式返回：
{
  "stories": [
    {
      "role": "角色",
      "feature": "功能",
      "value": "价值"
    }
  ]
}

只返回 JSON，不要额外说明。`
    : `You are an agile development expert. Generate user stories based on the provided roles and features.

User story format: As a [role], I want to [feature], so that [value]

Return in JSON format:
{
  "stories": [
    {
      "role": "role",
      "feature": "feature",
      "value": "value"
    }
  ]
}

Return ONLY JSON, no additional explanations.`

  const userPrompt = isChinese
    ? `角色：${roles.join('、')}\n功能：${features.join('、')}`
    : `Roles: ${roles.join(', ')}\nFeatures: ${features.join(', ')}`

  try {
    const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
        'X-Title': 'idea2prd'
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenRouter API error: ${error}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from AI')
    }

    // 提取 JSON
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/)
    const jsonString = jsonMatch ? jsonMatch[1] : content
    const result = JSON.parse(jsonString.trim())

    return {
      stories: result.stories,
      formatted: result.stories.map((s: any) =>
        isChinese
          ? `作为${s.role}，我想要${s.feature}，以便${s.value}`
          : `As a ${s.role}, I want to ${s.feature}, so that ${s.value}`
      )
    }
  } catch (error) {
    console.error('Error generating user stories:', error)
    throw error
  }
}
