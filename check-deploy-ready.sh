#!/bin/bash

echo "🔍 检查 Vercel 部署准备情况..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 1. 检查 Git 状态
echo "📦 检查 Git 状态..."
if git status > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Git 仓库已初始化"
    
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${GREEN}✓${NC} 工作区干净（所有更改已提交）"
    else
        echo -e "${YELLOW}⚠${NC} 工作区有未提交的更改"
        WARNINGS=$((WARNINGS+1))
        git status --short
    fi
else
    echo -e "${RED}✗${NC} Git 仓库未初始化"
    ERRORS=$((ERRORS+1))
fi
echo ""

# 2. 检查环境变量文件
echo "🔐 检查环境变量..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local 文件存在"
    
    # 检查必需的环境变量
    required_vars=("NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "NEXT_PUBLIC_OPENROUTER_API_KEY")
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env.local; then
            echo -e "${GREEN}  ✓${NC} ${var} 已配置"
        else
            echo -e "${RED}  ✗${NC} ${var} 未配置"
            ERRORS=$((ERRORS+1))
        fi
    done
else
    echo -e "${YELLOW}⚠${NC} .env.local 文件不存在（本地开发需要）"
    WARNINGS=$((WARNINGS+1))
fi
echo ""

# 3. 检查 .gitignore
echo "🙈 检查 .gitignore..."
if [ -f ".gitignore" ]; then
    echo -e "${GREEN}✓${NC} .gitignore 文件存在"
    
    if grep -q ".env.local" .gitignore; then
        echo -e "${GREEN}  ✓${NC} .env.local 已被忽略"
    else
        echo -e "${RED}  ✗${NC} .env.local 未在 .gitignore 中"
        ERRORS=$((ERRORS+1))
    fi
else
    echo -e "${RED}✗${NC} .gitignore 文件不存在"
    ERRORS=$((ERRORS+1))
fi
echo ""

# 4. 检查依赖安装
echo "📚 检查依赖..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules 存在"
else
    echo -e "${RED}✗${NC} node_modules 不存在，请运行 pnpm install"
    ERRORS=$((ERRORS+1))
fi
echo ""

# 5. 检查构建
echo "🏗️ 检查构建..."
if [ -d ".next" ]; then
    echo -e "${GREEN}✓${NC} 已有构建输出"
else
    echo -e "${YELLOW}⚠${NC} 未找到构建输出，建议先运行 pnpm build 测试"
    WARNINGS=$((WARNINGS+1))
fi
echo ""

# 6. 检查关键文件
echo "📄 检查关键文件..."
required_files=("package.json" "next.config.mjs" "tsconfig.json")
for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}  ✓${NC} ${file}"
    else
        echo -e "${RED}  ✗${NC} ${file} 缺失"
        ERRORS=$((ERRORS+1))
    fi
done
echo ""

# 7. 检查部署文档
echo "📖 检查部署文档..."
if [ -f "QUICK_DEPLOY.md" ]; then
    echo -e "${GREEN}✓${NC} 快速部署指南存在"
else
    echo -e "${YELLOW}⚠${NC} 快速部署指南不存在"
    WARNINGS=$((WARNINGS+1))
fi
echo ""

# 8. 总结
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 完美！准备就绪，可以部署到 Vercel！${NC}"
    echo ""
    echo "下一步："
    echo "1. 推送代码到 GitHub"
    echo "2. 在 Vercel 导入项目"
    echo "3. 配置环境变量"
    echo "4. 部署！"
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ 有 ${WARNINGS} 个警告，但可以部署${NC}"
    echo "建议修复警告后再部署"
else
    echo -e "${RED}❌ 发现 ${ERRORS} 个错误，${WARNINGS} 个警告${NC}"
    echo "请修复所有错误后再部署"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
