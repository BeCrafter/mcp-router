# MCP Router

一个强大的 Model Context Protocol (MCP) 路由和管理工具，支持聚合多个 MCP 服务器，提供统一的管理界面和 API。

## 功能特性

- 🚀 **多服务器聚合** - 统一管理多个 MCP 服务器
- 📁 **工作区管理** - 支持多个独立的工作环境
- 📦 **项目管理** - 将服务器组织到项目中
- 🔄 **工作流系统** - 自动化 MCP 操作流程
- 📊 **日志系统** - 完整的请求日志和监控
- 🔐 **客户端管理** - Token 管理和访问控制
- 🎨 **现代化 UI** - 基于 Vue 3 的响应式界面

## 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/BeCrafter/mcp-router.git
cd mcp-router

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 构建

```bash
# 构建应用
pnpm build

# 打包应用
cd apps/electron
pnpm package
```

## 项目结构

```
mcp-router/
├── apps/
│   ├── electron/          # Electron 桌面应用
│   └── cli/              # CLI 工具
├── packages/
│   └── shared/           # 共享类型和工具
├── docs/                 # 文档
└── openspec/             # OpenSpec 规范
```

## 开发指南

### 技术栈

- **前端**: Vue 3 + TypeScript + Pinia + Vue Router
- **后端**: Electron + Node.js + Express
- **数据库**: SQLite (better-sqlite3)
- **构建工具**: Electron Forge + Webpack

### 开发流程

1. 设计接口（Platform API）
2. 实现 Repository（数据库操作）
3. 实现 Service（业务逻辑）
4. 添加 IPC Handler
5. 更新 Preload
6. 创建 Store
7. 创建 UI 组件
8. 测试验证

详细开发指南请参考 [docs/AI_AGENT_DEVELOPMENT_GUIDE.md](docs/AI_AGENT_DEVELOPMENT_GUIDE.md)

## API 文档

### Platform API

Platform API 是 Renderer Process 与 Main Process 通信的接口层。

#### 服务器管理

```typescript
// 获取服务器列表
const servers = await window.platformAPI.servers.list();

// 创建服务器
const server = await window.platformAPI.servers.create({
  name: 'My Server',
  transport: 'stdio',
  config: { ... }
});

// 更新服务器
await window.platformAPI.servers.update(id, updates);

// 删除服务器
await window.platformAPI.servers.delete(id);
```

#### 工作区管理

```typescript
// 获取工作区列表
const workspaces = await window.platformAPI.workspaces.list();

// 创建工作区
const workspace = await window.platformAPI.workspaces.create({
  name: 'My Workspace',
  type: 'local'
});

// 切换工作区
await window.platformAPI.workspaces.switch(id);
```

#### 项目管理

```typescript
// 获取项目列表
const projects = await window.platformAPI.projects.list();

// 创建项目
const project = await window.platformAPI.projects.create({
  name: 'My Project'
});

// 添加服务器到项目
await window.platformAPI.projects.addServer(projectId, serverId);
```

### HTTP API

MCP Router 提供 HTTP 端点用于外部客户端连接：

```
POST http://localhost:3282/mcp
Headers:
  Authorization: Bearer <token>
  X-MCPR-Project: <project-id> (可选)
```

## 配置

### 环境变量

- `NODE_ENV`: 运行环境（development/production）
- `MCPR_PROJECT`: 默认项目 ID
- `MCPR_TOKEN`: 认证 Token

### 应用设置

应用设置存储在 SQLite 数据库中，可通过 Settings 页面或 API 进行配置。

## 测试

```bash
# 运行所有测试
pnpm test

# 运行特定测试
pnpm test tests/stage3-*.test.ts

# 类型检查
pnpm typecheck
```

## 贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解详细信息。

## 许可证

MIT License

## 相关链接

- [Model Context Protocol 规范](https://modelcontextprotocol.io)
- [Electron 文档](https://www.electronjs.org)
- [Vue 3 文档](https://vuejs.org)

