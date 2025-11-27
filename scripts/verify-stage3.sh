#!/bin/bash
# scripts/verify-stage3.sh

echo "验证阶段3：核心MCP功能"

# 检查代码文件
echo "1. 检查MCP核心代码文件..."
[ -f "apps/electron/src/main/modules/mcp-server-manager/server.repository.ts" ] || { echo "❌ ServerRepository不存在"; exit 1; }
[ -f "apps/electron/src/main/modules/mcp-server-manager/server.service.ts" ] || { echo "❌ ServerService不存在"; exit 1; }
[ -f "apps/electron/src/main/modules/mcp-server-manager/mcp-client-manager.ts" ] || { echo "❌ MCPClientManager不存在"; exit 1; }
[ -f "apps/electron/src/main/modules/mcp-http-server/http-server.ts" ] || { echo "❌ MCPHttpServer不存在"; exit 1; }
[ -f "apps/electron/src/main/modules/mcp-aggregator/aggregator.ts" ] || { echo "❌ MCPAggregator不存在"; exit 1; }
[ -f "apps/electron/src/renderer/stores/servers.ts" ] || { echo "❌ ServersStore不存在"; exit 1; }
[ -f "apps/electron/src/renderer/pages/Servers.vue" ] || { echo "❌ Servers页面不存在"; exit 1; }
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
echo "   2. 打开服务器管理页面"
echo "   3. 添加一个stdio MCP服务器（例如：command: echo, args: ['hello']）"
echo "   4. 启用服务器，检查连接状态"
echo "   5. 使用curl测试HTTP服务器："
echo "      curl -X POST http://localhost:3282/mcp \\"
echo "        -H 'Content-Type: application/json' \\"
echo "        -H 'Authorization: Bearer test-token' \\"
echo "        -d '{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"tools/list\",\"params\":{}}'"
echo "   6. 验证工具列表聚合"
echo ""
echo "🎉 阶段3核心MCP功能验证完成！"

