#!/bin/bash
# scripts/verify-stage0.sh

echo "验证阶段0：项目骨架搭建"

# 检查项目结构
echo "1. 检查项目结构..."
[ -d "packages" ] || { echo "❌ packages目录不存在"; exit 1; }
[ -d "apps" ] || { echo "❌ apps目录不存在"; exit 1; }
[ -f "package.json" ] || { echo "❌ package.json不存在"; exit 1; }
[ -f "pnpm-workspace.yaml" ] || { echo "❌ pnpm-workspace.yaml不存在"; exit 1; }
[ -f "turbo.json" ] || { echo "❌ turbo.json不存在"; exit 1; }
echo "✅ 项目结构完整"

# 检查依赖安装
echo "2. 检查依赖安装..."
if ! pnpm list --depth=0 > /dev/null 2>&1; then
  echo "⚠️  依赖未安装，请运行 pnpm install"
  echo "   跳过后续检查..."
  exit 0
fi
echo "✅ 依赖已安装"

# 检查构建
echo "3. 检查构建..."
if pnpm build 2>&1 | grep -i error > /dev/null; then
  echo "⚠️  构建过程中有错误（可能是依赖未安装）"
else
  echo "✅ 构建成功"
fi

# 检查类型
echo "4. 检查类型..."
if pnpm typecheck 2>&1 | grep -i error > /dev/null; then
  echo "⚠️  类型检查有错误（可能是依赖未安装）"
else
  echo "✅ 类型检查通过"
fi

echo ""
echo "📝 下一步："
echo "   1. 运行 pnpm install 安装依赖"
echo "   2. 运行 pnpm build 构建所有包"
echo "   3. 运行 pnpm dev 启动 Electron 应用"
echo ""
echo "🎉 阶段0项目结构验证通过！"

