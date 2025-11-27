## 1. Monorepo初始化

- [x] 1.1 创建项目根目录结构
- [x] 1.2 配置根目录 package.json（包含 scripts、workspace 配置）
- [x] 1.3 创建 pnpm-workspace.yaml
- [x] 1.4 创建 turbo.json（配置构建管道）
- [x] 1.5 配置 TypeScript（tsconfig.json）
- [x] 1.6 配置 ESLint（.eslintrc.js）
- [x] 1.7 配置 Prettier（.prettierrc）
- [x] 1.8 创建 .gitignore

## 2. 共享包创建

- [x] 2.1 创建 packages/shared 目录
- [x] 2.2 配置 @mcp_router/shared 包（package.json、tsconfig.json）
- [x] 2.3 创建基础类型定义文件
- [x] 2.4 创建 packages/ui 目录（空包，后续使用）
- [x] 2.5 配置 @mcp_router/ui 包
- [x] 2.6 创建 packages/tailwind-config 目录
- [x] 2.7 配置 @mcp_router/tailwind-config 包
- [x] 2.8 创建 packages/remote-api-types 目录（空包，后续使用）
- [x] 2.9 配置 @mcp_router/remote-api-types 包

## 3. Electron应用骨架

- [x] 3.1 创建 apps/electron 目录结构
- [x] 3.2 配置 apps/electron/package.json
- [x] 3.3 创建 apps/electron/src/main/main.ts（最小实现，创建窗口）
- [x] 3.4 创建 apps/electron/src/main/preload.ts（最小实现）
- [x] 3.5 创建 apps/electron/src/renderer 目录
- [x] 3.6 创建 apps/electron/src/renderer/index.html（最小HTML）
- [x] 3.7 创建 apps/electron/src/renderer/main.ts（最小Vue应用）
- [x] 3.8 创建 apps/electron/src/renderer/App.vue（最小组件）
- [x] 3.9 配置 Webpack（webpack.config.js）
- [x] 3.10 配置 Electron Forge（forge.config.js）
- [x] 3.11 创建 apps/electron/tsconfig.json

## 4. CLI应用骨架

- [x] 4.1 创建 apps/cli 目录结构
- [x] 4.2 配置 apps/cli/package.json
- [x] 4.3 创建 apps/cli/src/index.ts（最小实现，显示帮助信息）
- [x] 4.4 创建 apps/cli/tsconfig.json

## 5. 验证

- [ ] 5.1 运行 `pnpm install` 验证依赖安装
- [ ] 5.2 运行 `pnpm build` 验证所有包可以构建
- [ ] 5.3 运行 `pnpm typecheck` 验证无TypeScript错误
- [ ] 5.4 运行 `pnpm dev` 验证Electron应用可以启动（显示空白窗口）
- [x] 5.5 创建验证脚本 scripts/verify-stage0.sh
- [x] 5.6 创建基础测试文件 tests/stage0-verification.test.ts

