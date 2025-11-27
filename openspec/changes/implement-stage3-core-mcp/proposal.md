# Change: 实现阶段3 - 核心MCP功能

## Why

这是MCP Router的核心功能阶段，实现MCP服务器管理、HTTP服务器、聚合器等核心能力。这些功能是应用的核心价值所在，为AI客户端提供统一的MCP服务端点。

## What Changes

- 实现MCP服务器管理（注册、连接、生命周期管理、工具管理）
- 实现MCP HTTP服务器（Express服务器、Token认证、请求路由）
- 实现MCP聚合器（工具聚合、资源聚合、请求分发）
- 实现基础UI组件（服务器管理界面、布局组件）

## Impact

- Affected specs:
  - `specs/mcp-server-manager/spec.md` - 实现所有Requirements
  - `specs/mcp-http-server/spec.md` - 实现所有Requirements
  - `specs/mcp-aggregator/spec.md` - 实现所有Requirements
  - `specs/ui-foundation/spec.md` - 实现基础UI Requirements（布局、导航等）
- Affected code:
  - `main/modules/mcp-server-manager/` - 服务器管理模块
  - `main/modules/mcp-http-server/` - HTTP服务器模块
  - `main/modules/mcp-server-runtime/` - 聚合器模块
  - `renderer/stores/servers.ts` - 服务器Store
  - `renderer/components/servers/` - 服务器UI组件
  - `renderer/pages/Servers.vue` - 服务器管理页面

## Dependencies

- 依赖阶段2完成（需要Settings功能验证架构流程）

