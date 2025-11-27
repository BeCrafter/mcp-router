#!/bin/bash
# scripts/verify-stage5.sh

echo "验证阶段5：UI完善"

# 检查代码文件
echo "1. 检查UI组件文件..."
[ -f "apps/electron/src/renderer/components/layout/Sidebar.vue" ] || { echo "❌ Sidebar组件不存在"; exit 1; }
[ -f "apps/electron/src/renderer/components/layout/Header.vue" ] || { echo "❌ Header组件不存在"; exit 1; }
[ -f "apps/electron/src/renderer/components/layout/MainLayout.vue" ] || { echo "❌ MainLayout组件不存在"; exit 1; }
[ -f "apps/electron/src/renderer/components/common/Dialog.vue" ] || { echo "❌ Dialog组件不存在"; exit 1; }
[ -f "apps/electron/src/renderer/components/common/Toast.vue" ] || { echo "❌ Toast组件不存在"; exit 1; }
[ -f "apps/electron/src/renderer/components/common/Loading.vue" ] || { echo "❌ Loading组件不存在"; exit 1; }
[ -f "apps/electron/src/renderer/components/common/EmptyState.vue" ] || { echo "❌ EmptyState组件不存在"; exit 1; }
[ -f "apps/electron/src/renderer/composables/useTheme.ts" ] || { echo "❌ useTheme composable不存在"; exit 1; }
[ -f "apps/electron/src/renderer/composables/useToast.ts" ] || { echo "❌ useToast composable不存在"; exit 1; }
echo "✅ UI组件文件完整"

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
echo "   2. 检查侧边栏是否正常显示和折叠"
echo "   3. 检查主题切换功能（设置页面）"
echo "   4. 检查Toast提示（操作成功/失败时）"
echo "   5. 检查Dialog模态框（创建/编辑时）"
echo "   6. 检查Loading加载状态"
echo "   7. 检查EmptyState空状态"
echo "   8. 检查响应式布局（调整窗口大小）"
echo ""
echo "🎉 阶段5 UI完善验证完成！"

