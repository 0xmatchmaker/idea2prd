import type { N8nWorkflow, GenerateWorkflowResponse, GenerateImageResponse } from '@/types/workspace'

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
 * 使用 AI 生成 n8n 工作流
 * @param description 用户的自然语言描述
 * @param context 可选的上下文信息
 */
export async function generateWorkflow(
  description: string,
  context?: string
): Promise<GenerateWorkflowResponse> {
  const apiKey = getApiKey()

  const systemPrompt = `You are an expert n8n workflow designer. Your task is to convert natural language descriptions into valid n8n workflow JSON.

n8n workflow structure:
{
  "nodes": [
    {
      "id": "unique-id",
      "type": "n8n-nodes-base.webhook",
      "name": "Webhook",
      "position": [250, 300],
      "parameters": { /* node-specific config */ }
    }
  ],
  "connections": {
    "node-id": {
      "main": [[{ "node": "next-node-id", "type": "main", "index": 0 }]]
    }
  }
}

Common n8n node types:
- n8n-nodes-base.webhook: HTTP triggers
- n8n-nodes-base.httpRequest: Make HTTP requests
- n8n-nodes-base.function: JavaScript code
- n8n-nodes-base.if: Conditional logic
- n8n-nodes-base.set: Transform data
- n8n-nodes-base.switch: Multiple conditions
- n8n-nodes-base.code: Advanced code execution

IMPORTANT:
1. Return ONLY valid JSON (no markdown, no explanations outside JSON)
2. Use sequential IDs like "node-1", "node-2", etc.
3. Position nodes horizontally: [250, 300], [450, 300], [650, 300], etc.
4. Connect nodes in sequence
5. Keep it simple and practical`

  const userPrompt = context
    ? `Context: ${context}\n\nGenerate an n8n workflow for: ${description}`
    : `Generate an n8n workflow for: ${description}`

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
