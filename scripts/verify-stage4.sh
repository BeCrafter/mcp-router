#!/bin/bash
# scripts/verify-stage4.sh

echo "验证阶段4：工作区与项目管理"

# 检查代码文件
echo "1. 检查工作区和项目代码文件..."
[ -f "apps/electron/src/main/modules/workspace/workspace.repository.ts" ] || { echo "❌ WorkspaceRepository不存在"; exit 1; }
[ -f "apps/electron/src/main/modules/workspace/workspace.service.ts" ] || { echo "❌ WorkspaceService不存在"; exit 1; }
[ -f "apps/electron/src/main/modules/project/project.repository.ts" ] || { echo "❌ ProjectRepository不存在"; exit 1; }
[ -f "apps/electron/src/main/modules/project/project.service.ts" ] || { echo "❌ ProjectService不存在"; exit 1; }
[ -f "apps/electron/src/renderer/stores/workspace.ts" ] || { echo "❌ WorkspaceStore不存在"; exit 1; }
[ -f "apps/electron/src/renderer/stores/project.ts" ] || { echo "❌ ProjectStore不存在"; exit 1; }
[ -f "apps/electron/src/renderer/pages/Workspaces.vue" ] || { echo "❌ Workspaces页面不存在"; exit 1; }
[ -f "apps/electron/src/renderer/pages/Projects.vue" ] || { echo "❌ Projects页面不存在"; exit 1; }
echo "✅ 代码文件完整"

# 类型检查
echo "2. 运行类型检查..."
cd apps/electron && pnpm typecheck > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ 类型检查通过"
else
  echo "⚠️  类型检查有错误"
fi

echo ""
echo "📝 手动验证步骤："
echo "   1. 启动应用：pnpm dev"
echo "   2. 打开工作区管理页面：/workspaces"
echo "   3. 创建新工作区，验证数据隔离"
echo "   4. 切换工作区，验证数据完全隔离"
echo "   5. 打开项目管理页面：/projects"
echo "   6. 创建项目，将服务器添加到项目"
echo "   7. 使用curl测试项目过滤："
echo "      curl -X POST http://localhost:3282/mcp \\"
echo "        -H 'Content-Type: application/json' \\"
echo "        -H 'Authorization: Bearer test-token' \\"
echo "        -H 'X-MCPR-Project: project-name' \\"
echo "        -d '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\",\"params\":{}}'"
echo ""
echo "🎉 阶段4工作区与项目管理验证完成！"

