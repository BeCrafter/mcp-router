#!/bin/bash
# scripts/verify-stage1.sh

echo "验证阶段1：基础设施层"

# 检查代码文件
echo "1. 检查基础设施代码文件..."
[ -f "apps/electron/src/main/infrastructure/database/sqlite-manager.ts" ] || { echo "❌ SqliteManager不存在"; exit 1; }
[ -f "apps/electron/src/main/infrastructure/database/base-repository.ts" ] || { echo "❌ BaseRepository不存在"; exit 1; }
[ -f "apps/electron/src/main/infrastructure/ipc/ipc-handler.ts" ] || { echo "❌ IpcHandlerRegistry不存在"; exit 1; }
[ -f "apps/electron/src/renderer/platform-api/electron-platform-api.ts" ] || { echo "❌ ElectronPlatformAPI不存在"; exit 1; }
[ -f "packages/shared/src/platform-api.ts" ] || { echo "❌ Platform API类型定义不存在"; exit 1; }
echo "✅ 代码文件完整"

# 运行测试
echo "2. 运行数据库测试..."
pnpm test tests/stage1-database.test.ts > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ 数据库测试通过"
else
  echo "❌ 数据库测试失败"
  exit 1
fi

echo "3. 运行IPC测试..."
pnpm test tests/stage1-ipc.test.ts > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ IPC测试通过"
else
  echo "❌ IPC测试失败"
  exit 1
fi

echo "4. 运行Platform API测试..."
pnpm test tests/stage1-platform-api.test.ts > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Platform API测试通过"
else
  echo "❌ Platform API测试失败"
  exit 1
fi

echo ""
echo "📝 手动验证步骤："
echo "   1. 启动应用：pnpm dev"
echo "   2. 在DevTools中测试：window.platformAPI.settings.get()"
echo "   3. 检查数据库文件：应用数据目录/data/mcprouter.db"
echo ""
echo "🎉 阶段1基础设施层验证通过！"

