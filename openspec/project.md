# Project Context

## Purpose

MCP Router 是一个跨平台桌面应用程序，用于统一管理多个 Model Context Protocol (MCP) 服务器。它充当一个聚合器，将多个MCP服务器整合为单一端点，提供：

- **统一连接**：支持远程和本地MCP服务器
- **项目管理**：将MCP服务器组织到项目中
- **工作区管理**：类似浏览器配置文件的工作区系统，实现数据隔离
- **工具控制**：按服务器粒度启用/禁用工具
- **日志与分析**：完整的请求日志和统计信息（按日期分割，自动清理超过3天的日志）
- **数据本地化**：所有数据存储在本地，确保隐私和安全

## Tech Stack

### 核心技术
- **Node.js** >=20.0.0 - 后端运行时
- **TypeScript** ^5.9.2 - 类型安全
- **Electron** ^36.9.0 - 跨平台桌面应用框架
- **Vue** ^3.5.0 - 前端UI框架（使用 Composition API）
- **Pinia** ^2.2.0 - 状态管理
- **better-sqlite3** ^11.10.0 - 本地SQLite数据库
- **Express** ^5.1.0 - MCP HTTP服务器（端口3282）
- **@modelcontextprotocol/sdk** ^1.18.0 - MCP协议实现
- **Tailwind CSS** ^3.4.17 - CSS框架

### 开发工具
- **pnpm** >=8.0.0 - 包管理和workspace
- **Turbo** ^2.5.6 - Monorepo构建编排
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Knip** - 未使用代码检测
- **Vitest** - 单元测试框架
- **Playwright** - E2E测试

### 构建工具
- **Electron Forge** - Electron应用打包
- **Webpack** - 模块打包
- **ts-loader** - TypeScript编译

## Project Conventions

### Code Style

**TypeScript规范**：
- 使用明确的类型，避免`any`
- 使用接口定义对象结构
- 使用类型别名简化复杂类型
- 导出类型供其他模块使用

**Vue组件规范**：
- 组件命名：PascalCase（如 `ServerCard.vue`）
- 使用 `<script setup>` 语法
- 使用 `defineProps` 和类型定义Props
- 复杂逻辑提取为Composable

**命名约定**：
- 文件命名：kebab-case（如 `mcp-server-manager.ts`）
- 类命名：PascalCase（如 `MCPServerManager`）
- 函数/变量命名：camelCase（如 `getServerList`）
- 常量命名：UPPER_SNAKE_CASE（如 `DEFAULT_PORT`）

**代码格式化**：
- 使用 Prettier 自动格式化
- 使用 ESLint 进行代码检查
- 提交前自动运行格式化

### Architecture Patterns

**Monorepo架构**：
- 使用 pnpm workspace + Turbo
- 结构：`apps/`（应用）、`packages/`（共享包）、`docs/`（文档）、`tools/`（工具脚本）

**模块化架构（Main Process）**：
- 每个模块自包含：`*.service.ts`（业务逻辑）、`*.repository.ts`（数据访问）、`*.ipc.ts`（IPC通信）
- 模块目录：`main/modules/[module-name]/`

**Repository Pattern**：
- 数据访问层抽象
- `BaseRepository` 提供通用CRUD操作
- 每个模块有自己的Repository实现

**数据库架构**：
- 主数据库（`mcprouter.db`）：存储工作区元数据、全局设置
- 工作区数据库（`workspace-{id}.db`）：存储服务器、项目等
- 日志文件（`logs/workspace-{id}/request-logs-YYYY-MM-DD.jsonl`）：按日期分割的请求日志文件，自动清理超过3天的日志

**IPC通信模式**：
- Renderer Process ↔ Main Process 通过 IPC
- 使用 Platform API 抽象层，避免直接调用 IPC
- 统一的错误处理机制

**前端架构**：
- Vue 3 Composition API
- Pinia 状态管理
- 原子设计原则（Atomic Design）：原子组件、分子组件、组织组件、页面组件

### Testing Strategy

**测试金字塔**：
- **单元测试**（大量）：使用 Vitest 测试 Service 层和工具函数
- **集成测试**（中等）：测试 IPC Handler 和模块间交互
- **E2E测试**（少量）：使用 Playwright 测试关键用户流程

**测试要求**：
- 核心业务逻辑（Service层）必须有测试覆盖
- IPC Handler 需要集成测试
- 关键UI流程需要E2E测试
- 提交前运行测试：`pnpm test`

**测试文件位置**：
- 单元测试：`__tests__/*.test.ts`（与源文件同目录）
- E2E测试：`e2e/specs/*.spec.ts`

### Git Workflow

**分支策略**：
- `main` - 主分支，稳定版本
- `develop` - 开发分支（如使用）
- 功能分支：`feature/xxx`、`fix/xxx`

**提交约定**：
- 使用清晰的提交信息
- 提交前运行：`pnpm typecheck`、`pnpm lint`、`pnpm test`
- 遵循 Conventional Commits 格式（如使用）

**变更管理**：
- 使用 OpenSpec 进行规范驱动开发
- 重大变更需要创建 Change Proposal（`openspec/changes/[change-id]/`）
- 变更归档：`openspec archive <change-id>`

## Domain Context

**MCP (Model Context Protocol)**：
- 标准化的协议，用于AI客户端与上下文服务器之间的通信
- 支持工具（tools）、资源（resources）、提示词（prompts）三种能力
- 传输方式：stdio、HTTP、SSE

**核心概念**：
- **服务器（Server）**：一个MCP服务器实例，可以是一个本地进程或远程HTTP服务
- **工具（Tool）**：MCP服务器提供的可调用功能
- **项目（Project）**：MCP服务器的分组，用于组织和管理
- **工作区（Workspace）**：独立的数据环境，类似浏览器配置文件，实现数据隔离
- **聚合器（Aggregator）**：将多个MCP服务器的能力聚合为单一端点

**数据流**：
```
AI客户端 → HTTP请求 → MCP Router (端口3282) → 聚合器 → MCP服务器 → 返回结果
```

**日志系统**：
- 日志格式：JSONL（每行一个JSON对象）
- 存储位置：`logs/workspace-{id}/request-logs-YYYY-MM-DD.jsonl`
- 自动清理：仅保留最近3天的日志文件
- 日志内容：时间戳、请求类型、参数、响应、执行时长、状态

## Important Constraints

**技术约束**：
- 必须支持 Windows 和 macOS 平台
- 所有数据必须本地存储（隐私和安全要求）
- 日志文件自动清理，避免磁盘空间占用
- 支持工作区切换，数据完全隔离

**性能约束**：
- 应用启动时间：< 3秒
- 服务器连接时间：< 2秒（本地服务器）
- 请求延迟：< 100ms（本地服务器）
- 内存占用：约100-200MB（基础运行）

**架构约束**：
- Renderer Process 不能直接访问 Node.js API（必须通过 Platform API）
- Main Process 不能直接操作 DOM（通过 IPC 通信）
- 所有数据操作必须考虑当前工作区上下文
- 数据库操作必须通过 Repository 层

**安全约束**：
- Token 验证：所有HTTP请求必须包含有效的 Bearer Token
- 项目过滤：支持通过 `X-MCPR-Project` header 过滤项目
- 敏感信息加密存储

## External Dependencies

**MCP SDK**：
- `@modelcontextprotocol/sdk` - 官方MCP协议实现
- 用于连接和管理MCP服务器
- 支持 stdio、HTTP、SSE 传输方式

**Electron生态系统**：
- Electron Forge - 应用打包和分发
- Electron IPC - 进程间通信

**数据库**：
- better-sqlite3 - 本地SQLite数据库
- 无需外部数据库服务，完全本地化

**HTTP服务器**：
- Express - MCP HTTP服务器（端口3282）
- 提供统一的HTTP端点供AI客户端连接

**无外部服务依赖**：
- 所有功能完全本地化
- 不依赖任何外部API或云服务
- 支持远程工作区（可选），但默认使用本地工作区
