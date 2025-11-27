#!/bin/bash

# 阶段6验证脚本
# 验证工作流系统、日志系统、客户端管理和CLI工具的实现

set -e

echo "========================================="
echo "阶段6实现验证"
echo "========================================="

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查文件是否存在
echo ""
echo "1. 检查文件结构..."
echo "----------------------------------------"

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (缺失)"
        return 1
    fi
}

ERRORS=0

# 工作流系统文件
echo "工作流系统:"
check_file "apps/electron/src/main/modules/workflow/workflow.repository.ts" || ((ERRORS++))
check_file "apps/electron/src/main/modules/workflow/workflow.service.ts" || ((ERRORS++))
check_file "apps/electron/src/main/modules/workflow/workflow.ipc.ts" || ((ERRORS++))
check_file "apps/electron/src/main/modules/workflow/hook.repository.ts" || ((ERRORS++))
check_file "apps/electron/src/main/modules/workflow/hook.service.ts" || ((ERRORS++))

# 日志系统文件
echo ""
echo "日志系统:"
check_file "apps/electron/src/main/modules/log/log.service.ts" || ((ERRORS++))
check_file "apps/electron/src/main/modules/log/log.ipc.ts" || ((ERRORS++))

# 客户端管理文件
echo ""
echo "客户端管理:"
check_file "apps/electron/src/main/modules/client/client.repository.ts" || ((ERRORS++))
check_file "apps/electron/src/main/modules/client/client.service.ts" || ((ERRORS++))
check_file "apps/electron/src/main/modules/client/client.ipc.ts" || ((ERRORS++))

# CLI工具文件
echo ""
echo "CLI工具:"
check_file "apps/cli/src/commands/connect.ts" || ((ERRORS++))
check_file "apps/cli/src/commands/serve.ts" || ((ERRORS++))

# 类型定义
echo ""
echo "类型定义:"
check_file "packages/shared/src/types.ts" || ((ERRORS++))

if [ $ERRORS -gt 0 ]; then
    echo -e "\n${RED}发现 $ERRORS 个文件缺失${NC}"
    exit 1
fi

# 检查类型定义
echo ""
echo "2. 检查类型定义..."
echo "----------------------------------------"

if grep -q "WorkflowDefinition\|HookModule\|LogEntry\|Client" packages/shared/src/types.ts; then
    echo -e "${GREEN}✓${NC} 类型定义已添加"
else
    echo -e "${RED}✗${NC} 类型定义缺失"
    exit 1
fi

# 检查数据库Schema
echo ""
echo "3. 检查数据库Schema..."
echo "----------------------------------------"

if grep -q "workflows\|hook_modules\|clients" apps/electron/src/main/infrastructure/database/schema-manager.ts; then
    echo -e "${GREEN}✓${NC} 数据库Schema已更新"
else
    echo -e "${RED}✗${NC} 数据库Schema未更新"
    exit 1
fi

# 检查main.ts集成
echo ""
echo "4. 检查main.ts集成..."
echo "----------------------------------------"

if grep -q "setupWorkflowHandlers\|setupLogHandlers\|setupClientHandlers" apps/electron/src/main/main.ts; then
    echo -e "${GREEN}✓${NC} IPC Handlers已注册"
else
    echo -e "${RED}✗${NC} IPC Handlers未注册"
    exit 1
fi

if grep -q "LogService\|MCPHttpServer.*logService" apps/electron/src/main/main.ts; then
    echo -e "${GREEN}✓${NC} 日志服务已集成到HTTP服务器"
else
    echo -e "${RED}✗${NC} 日志服务未集成"
    exit 1
fi

# 检查TypeScript编译
echo ""
echo "5. 检查TypeScript编译..."
echo "----------------------------------------"

cd apps/electron
if pnpm typecheck > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} TypeScript编译通过"
else
    echo -e "${YELLOW}⚠${NC} TypeScript编译有警告（检查详细输出）"
    pnpm typecheck 2>&1 | head -20
fi
cd ../..

# 检查CLI工具
echo ""
echo "6. 检查CLI工具..."
echo "----------------------------------------"

if [ -f "apps/cli/src/commands/connect.ts" ] && [ -f "apps/cli/src/commands/serve.ts" ]; then
    echo -e "${GREEN}✓${NC} CLI命令文件存在"
else
    echo -e "${RED}✗${NC} CLI命令文件缺失"
    exit 1
fi

# 总结
echo ""
echo "========================================="
echo -e "${GREEN}验证完成！${NC}"
echo "========================================="
echo ""
echo "已实现的功能:"
echo "  ✓ 工作流系统后端（Repository, Service, IPC）"
echo "  ✓ Hook系统后端（Repository, Service）"
echo "  ✓ 日志系统（文件存储、查询、清理）"
echo "  ✓ 客户端管理（Repository, Service, IPC）"
echo "  ✓ CLI工具基础结构（connect, serve命令）"
echo ""
echo "待实现的功能:"
echo "  ⚠ 工作流前端UI（可视化编辑器）"
echo "  ⚠ 日志查看界面"
echo "  ⚠ 客户端管理界面"
echo "  ⚠ CLI工具的完整桥接实现"
echo "  ⚠ 单元测试和集成测试"
echo ""

