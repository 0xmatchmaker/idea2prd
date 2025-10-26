import type { PRDData } from "./types"

// 模板定义接口
export interface TemplateData {
  id: string
  description: string // 用于填充到 workspace 的需求描述
}

// 简短模板数据（用于 workspace 自动填充）
export const templates: Record<string, { zh: TemplateData; en: TemplateData }> = {
  ecommerce: {
    zh: {
      id: "ecommerce",
      description: "我想做一个电商系统，用户可以浏览商品、加入购物车、完成支付。需要包含商品列表展示、购物车管理、订单结算、支付集成（支付宝/微信）、订单查询等功能。用户体验要流畅，支付要安全可靠。"
    },
    en: {
      id: "ecommerce",
      description: "I want to build an e-commerce system where users can browse products, add to cart, and complete payment. Need features like product listing, cart management, checkout, payment integration (Alipay/WeChat), and order tracking. User experience should be smooth and payment secure."
    }
  },
  education: {
    zh: {
      id: "education",
      description: "我想做一个在线教育平台，教师可以创建课程、上传资料，学生可以学习课程、提交作业、查看成绩。需要课程管理、视频播放、作业系统、成绩统计、学习进度追踪等功能。"
    },
    en: {
      id: "education",
      description: "I want to build an online education platform where teachers can create courses and upload materials, students can learn, submit homework, and check grades. Need course management, video playback, homework system, grade statistics, and learning progress tracking."
    }
  },
  social: {
    zh: {
      id: "social",
      description: "我想做一个社交应用，用户可以发布动态、点赞评论、关注好友、私信聊天。需要动态发布、图片上传、评论互动、关注系统、消息通知、个人主页等功能。界面要简洁美观，互动要实时流畅。"
    },
    en: {
      id: "social",
      description: "I want to build a social app where users can post updates, like and comment, follow friends, and chat privately. Need post publishing, image upload, comment interaction, follow system, message notifications, and personal profiles. UI should be clean and interactions real-time."
    }
  },
  saas: {
    zh: {
      id: "saas",
      description: "我想做一个 SaaS 团队协作工具，支持团队管理、成员邀请、权限控制、数据仪表盘。需要组织架构管理、角色权限配置、数据统计图表、API 访问控制等功能。要支持多租户隔离，数据安全可靠。"
    },
    en: {
      id: "saas",
      description: "I want to build a SaaS team collaboration tool with team management, member invitations, permission control, and data dashboard. Need org structure management, role-based access control, data analytics charts, API access control. Multi-tenant isolation and data security required."
    }
  },
  payment: {
    zh: {
      id: "payment",
      description: "我想做一个支付订阅系统，用户可以订阅服务、管理订阅、查看账单。需要订单创建、支付处理（接入 Creem/Stripe）、订阅管理、自动续费、退款流程、发票生成等功能。支付要安全，订阅管理要清晰。"
    },
    en: {
      id: "payment",
      description: "I want to build a payment subscription system where users can subscribe to services, manage subscriptions, and view bills. Need order creation, payment processing (Creem/Stripe integration), subscription management, auto-renewal, refund flow, invoice generation. Payment must be secure and subscription management clear."
    }
  },
  ai: {
    zh: {
      id: "ai",
      description: "我想做一个 AI 助手工具，用户输入需求，AI 生成内容（文案/代码/图片等）。需要需求输入、AI 模型调用、结果展示、历史记录、导出功能、效果优化迭代。要支持多种 AI 模型选择，生成速度要快。"
    },
    en: {
      id: "ai",
      description: "I want to build an AI assistant tool where users input requirements and AI generates content (copy/code/images). Need requirement input, AI model invocation, result display, history, export function, and iterative optimization. Support multiple AI models and fast generation speed."
    }
  }
}

export const examples: Record<string, { zh: PRDData; en: PRDData }> = {
  "boss-simulator": {
    zh: {
      oneliner: "为职场人提供高情商回复生成器，帮助应对老板的批评和要求",
      users: "职场新人或中层员工，需要回复老板的批评邮件、微信消息或当面沟通时的即时回应",
      value: "生成高情商、专业且得体的回复，避免职场冲突，维护良好的上下级关系",
      keypath:
        "打开页面 → 选择场景类型（批评/要求/表扬） → 输入老板原话 → AI生成3个回复选项 → 选择并复制 → （可选）升级Pro解锁更多场景",
      features: "场景选择器、文本输入框、AI生成按钮、3个回复选项展示、一键复制功能、历史记录（本地存储）",
      nongoals: "不做语音输入、不做实时对话、不做多语言翻译、不做团队协作功能",
      success: "上线后2周内达到500个独立用户使用，平均每用户生成3次回复，Pro版转化率达到5%",
      dependencies: "OpenAI API（GPT-4）、Vercel部署、Stripe支付集成（Pro版）",
      risks: "API限流风险→使用备用模型或限制免费用户次数；生成内容不当→增加内容审核机制；支付失败→提供免费额度作为备选",
    },
    en: {
      oneliner: "High-EQ reply generator for professionals to handle boss criticism and requests",
      users:
        "Junior or mid-level employees who need to reply to critical emails, WeChat messages, or face-to-face communication from bosses",
      value:
        "Generate high-EQ, professional, and appropriate replies to avoid workplace conflicts and maintain good superior-subordinate relationships",
      keypath:
        "Open page → Select scenario type (criticism/request/praise) → Input boss's words → AI generates 3 reply options → Select and copy → (Optional) Upgrade Pro for more scenarios",
      features:
        "Scenario selector, text input box, AI generate button, 3 reply options display, one-click copy, history (local storage)",
      nongoals: "No voice input, no real-time conversation, no multi-language translation, no team collaboration",
      success: "500 unique users within 2 weeks after launch, average 3 generations per user, 5% Pro conversion rate",
      dependencies: "OpenAI API (GPT-4), Vercel deployment, Stripe payment integration (Pro)",
      risks:
        "API rate limit→Use backup model or limit free users; Inappropriate content→Add content moderation; Payment failure→Provide free quota",
    },
  },
  "argument-winner": {
    zh: {
      oneliner: "为需要应对冲突的人提供冷静、有理有据的回应模板",
      users: "情侣吵架、家庭矛盾、朋友争执等场景中需要快速组织语言的人",
      value: "提供冷静、逻辑清晰的回应话术，帮助用户在冲突中保持理性，避免情绪化升级",
      keypath:
        "打开页面 → 选择冲突类型（情侣/家庭/朋友） → 输入对方的话 → AI生成3个回应策略 → 选择并查看详细话术 → 复制使用",
      features: "冲突类型选择、对方话语输入、AI生成回应策略、详细话术展示、情绪分析标签、复制功能",
      nongoals: "不做情感咨询、不做心理治疗、不做法律建议、不做语音通话功能",
      success: "上线后2周内300个用户使用，平均每用户生成2次回应，用户满意度评分4.5/5",
      dependencies: "OpenAI API（GPT-4）、Vercel部署、无需支付集成（初期免费）",
      risks: "AI生成内容可能加剧矛盾→增加免责声明和人工审核；用户过度依赖→提示仅供参考；API成本过高→限制免费次数",
    },
    en: {
      oneliner: "Calm, well-reasoned response templates for people dealing with conflicts",
      users:
        "People in couple arguments, family conflicts, or friend disputes who need to quickly organize their words",
      value:
        "Provide calm, logically clear response scripts to help users stay rational in conflicts and avoid emotional escalation",
      keypath:
        "Open page → Select conflict type (couple/family/friend) → Input opponent's words → AI generates 3 response strategies → Select and view detailed scripts → Copy and use",
      features:
        "Conflict type selector, opponent's words input, AI response strategy generation, detailed script display, emotion analysis tags, copy function",
      nongoals: "No emotional counseling, no psychological therapy, no legal advice, no voice call features",
      success: "300 users within 2 weeks after launch, average 2 generations per user, 4.5/5 user satisfaction rating",
      dependencies: "OpenAI API (GPT-4), Vercel deployment, no payment integration needed (free initially)",
      risks:
        "AI content may escalate conflicts→Add disclaimers and manual review; Over-reliance→Remind for reference only; High API costs→Limit free uses",
    },
  },
}
