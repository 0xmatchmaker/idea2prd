export type Locale = "zh" | "en"

export const translations = {
  zh: {
    // Navigation
    "nav.brand": "Idea炼金术",
    "nav.features": "功能",
    "nav.examples": "示例",
    "nav.pricing": "定价",
    "nav.faq": "常见问题",
    "nav.getStarted": "开始使用",

    // Hero
    "hero.title": "把不完整的 idea 炼成可执行的一页PRD与用户流程图",
    "hero.subtitle": "为产品经理、创业者和独立开发者打造的快速结构化工具",
    "hero.cta": "开始炼金",

    // Features
    "features.title": "核心功能",
    "features.prd.title": "PRD生成",
    "features.prd.desc": "填空式表单，实时预览，快速生成结构化PRD文档",
    "features.visual.title": "用户流可视化",
    "features.visual.desc": "自动将关键路径转换为清晰的流程图",
    "features.export.title": "导出Markdown/PDF",
    "features.export.desc": "一键导出专业格式文档，随时分享",
    "features.template.title": "示例模板",
    "features.template.desc": "内置多个实战案例，快速上手",
    "features.share.title": "分享链接",
    "features.share.desc": "生成唯一链接，轻松与团队协作",

    // Process
    "process.title": "三步完成",
    "process.step1": "写点子",
    "process.step1.desc": "填写简单的表单字段",
    "process.step2": "生成PRD",
    "process.step2.desc": "实时预览结构化文档",
    "process.step3": "可视化",
    "process.step3.desc": "一键生成用户流程图",

    // Footer
    "footer.copyright": "© 2025 Idea炼金术. 保留所有权利。",
    "footer.privacy": "隐私政策",
    "footer.terms": "服务条款",

    // Create Page
    "create.title": "创建PRD",
    "create.form.title": "填写PRD信息",
    "create.preview.title": "实时预览",
    "create.field.oneliner": "产品一句话",
    "create.field.oneliner.placeholder": "为[谁]解决[什么问题]",
    "create.field.oneliner.example": "例如：为忙碌的职场人提供高情商回复生成器",
    "create.field.users": "目标用户与场景",
    "create.field.users.placeholder": "描述1-2个典型用户场景",
    "create.field.users.example": "例如：职场新人需要回复老板的批评邮件",
    "create.field.value": "核心价值",
    "create.field.value.placeholder": "动词 + 结果",
    "create.field.value.example": "例如：生成高情商回复，避免职场冲突",
    "create.field.keypath": "关键路径",
    "create.field.keypath.placeholder": "进入→输入→处理→输出→付费（可选）",
    "create.field.keypath.example": "例如：打开页面→输入场景→AI生成→显示结果→升级Pro",
    "create.field.features": "最小功能清单",
    "create.field.features.placeholder": "列出3-5个核心功能",
    "create.field.features.example": "例如：场景输入框、AI生成按钮、结果展示、复制功能",
    "create.field.nongoals": "非目标与暂不做",
    "create.field.nongoals.placeholder": "明确不做什么，避免功能膨胀",
    "create.field.nongoals.example": "例如：不做语音输入、不做多语言翻译",
    "create.field.success": "成功标准",
    "create.field.success.placeholder": "可量化的上线与2周指标",
    "create.field.success.example": "例如：上线后2周内100个用户使用，转化率5%",
    "create.field.dependencies": "依赖与约束",
    "create.field.dependencies.placeholder": "API/支付/部署/合规要求",
    "create.field.dependencies.example": "例如：需要OpenAI API、Stripe支付集成",
    "create.field.risks": "风险与预案",
    "create.field.risks.placeholder": "至少2个卡点与替代方案",
    "create.field.risks.example": "例如：API限流→使用备用模型；支付失败→提供免费额度",
    "create.action.visualize": "生成可视化",
    "create.action.export.md": "导出Markdown",
    "create.action.export.pdf": "导出PDF",
    "create.action.save": "保存草稿",
    "create.action.share": "生成分享链接",

    // Pricing
    "pricing.title": "选择适合你的方案",
    "pricing.free.title": "免费版",
    "pricing.free.price": "¥0",
    "pricing.free.feature1": "本地保存",
    "pricing.free.feature2": "导出Markdown",
    "pricing.free.feature3": "基础可视化（水印）",
    "pricing.pro.title": "Pro版",
    "pricing.pro.price": "¥99/月",
    "pricing.pro.feature1": "无水印导出",
    "pricing.pro.feature2": "SVG/PNG导出",
    "pricing.pro.feature3": "分享链接",
    "pricing.pro.feature4": "更多示例模板",
    "pricing.cta": "立即订阅",
    "pricing.comingSoon": "支付即将上线",

    // FAQ
    "faq.title": "常见问题",
    "faq.q1": '如何写好"一页PRD"？',
    "faq.a1": "聚焦单一核心价值，明确关键路径，列出最小功能清单，避免功能膨胀。",
    "faq.q2": "为什么先做关键路径？",
    "faq.a2": "关键路径是用户完成核心任务的最短路径，先定义它可以避免做无用功。",
    "faq.q3": "输出不等于代码？",
    "faq.a3": "PRD是产品需求文档，不是技术实现。它帮助你理清思路，而不是直接生成代码。",
  },
  en: {
    // Navigation
    "nav.brand": "Idea Alchemy",
    "nav.features": "Features",
    "nav.examples": "Examples",
    "nav.pricing": "Pricing",
    "nav.faq": "FAQ",
    "nav.getStarted": "Get Started",

    // Hero
    "hero.title": "Transform incomplete ideas into executable one-page PRDs with user flows",
    "hero.subtitle": "Fast structuring tool for product managers, entrepreneurs, and indie makers",
    "hero.cta": "Start Alchemy",

    // Features
    "features.title": "Core Features",
    "features.prd.title": "PRD Generation",
    "features.prd.desc": "Fill-in-the-blank form with real-time preview for structured PRD documents",
    "features.visual.title": "User Flow Visualization",
    "features.visual.desc": "Automatically convert key paths into clear flowcharts",
    "features.export.title": "Export Markdown/PDF",
    "features.export.desc": "One-click export to professional formats, share anytime",
    "features.template.title": "Example Templates",
    "features.template.desc": "Built-in practical cases for quick start",
    "features.share.title": "Share Links",
    "features.share.desc": "Generate unique links for easy team collaboration",

    // Process
    "process.title": "Three Simple Steps",
    "process.step1": "Write Idea",
    "process.step1.desc": "Fill simple form fields",
    "process.step2": "Generate PRD",
    "process.step2.desc": "Real-time preview of structured document",
    "process.step3": "Visualize",
    "process.step3.desc": "One-click user flow diagram",

    // Footer
    "footer.copyright": "© 2025 Idea Alchemy. All rights reserved.",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",

    // Create Page
    "create.title": "Create PRD",
    "create.form.title": "Fill PRD Information",
    "create.preview.title": "Live Preview",
    "create.field.oneliner": "Product One-liner",
    "create.field.oneliner.placeholder": "For [who] to solve [what problem]",
    "create.field.oneliner.example": "E.g.: High-EQ reply generator for busy professionals",
    "create.field.users": "Target Users & Scenarios",
    "create.field.users.placeholder": "Describe 1-2 typical user scenarios",
    "create.field.users.example": "E.g.: Junior employees need to reply to critical emails from bosses",
    "create.field.value": "Core Value",
    "create.field.value.placeholder": "Verb + Result",
    "create.field.value.example": "E.g.: Generate high-EQ replies to avoid workplace conflicts",
    "create.field.keypath": "Key Path",
    "create.field.keypath.placeholder": "Enter→Input→Process→Output→Payment (optional)",
    "create.field.keypath.example": "E.g.: Open page→Input scenario→AI generates→Show result→Upgrade Pro",
    "create.field.features": "Minimum Feature List",
    "create.field.features.placeholder": "List 3-5 core features",
    "create.field.features.example": "E.g.: Scenario input, AI generate button, result display, copy function",
    "create.field.nongoals": "Non-goals & Not Doing",
    "create.field.nongoals.placeholder": "Clarify what not to do to avoid feature bloat",
    "create.field.nongoals.example": "E.g.: No voice input, no multi-language translation",
    "create.field.success": "Success Criteria",
    "create.field.success.placeholder": "Quantifiable launch & 2-week metrics",
    "create.field.success.example": "E.g.: 100 users within 2 weeks after launch, 5% conversion rate",
    "create.field.dependencies": "Dependencies & Constraints",
    "create.field.dependencies.placeholder": "API/Payment/Deployment/Compliance requirements",
    "create.field.dependencies.example": "E.g.: Requires OpenAI API, Stripe payment integration",
    "create.field.risks": "Risks & Contingencies",
    "create.field.risks.placeholder": "At least 2 blockers & alternative solutions",
    "create.field.risks.example": "E.g.: API rate limit→Use backup model; Payment failure→Provide free quota",
    "create.action.visualize": "Generate Visualization",
    "create.action.export.md": "Export Markdown",
    "create.action.export.pdf": "Export PDF",
    "create.action.save": "Save Draft",
    "create.action.share": "Generate Share Link",

    // Pricing
    "pricing.title": "Choose Your Plan",
    "pricing.free.title": "Free",
    "pricing.free.price": "$0",
    "pricing.free.feature1": "Local save",
    "pricing.free.feature2": "Export Markdown",
    "pricing.free.feature3": "Basic visualization (watermark)",
    "pricing.pro.title": "Pro",
    "pricing.pro.price": "$12/mo",
    "pricing.pro.feature1": "Watermark-free export",
    "pricing.pro.feature2": "SVG/PNG export",
    "pricing.pro.feature3": "Share links",
    "pricing.pro.feature4": "More example templates",
    "pricing.cta": "Subscribe Now",
    "pricing.comingSoon": "Payment coming soon",

    // FAQ
    "faq.title": "Frequently Asked Questions",
    "faq.q1": 'How to write a good "one-page PRD"?',
    "faq.a1": "Focus on a single core value, define the key path, list minimum features, avoid feature bloat.",
    "faq.q2": "Why start with the key path?",
    "faq.a2":
      "The key path is the shortest path for users to complete core tasks. Defining it first avoids wasted effort.",
    "faq.q3": "Output is not code?",
    "faq.a3":
      "PRD is a product requirements document, not technical implementation. It helps clarify thinking, not generate code directly.",
  },
}

export function useTranslation(locale: Locale) {
  return {
    t: (key: string) => translations[locale][key] || key,
    locale,
  }
}
