# MCP Router 功能拆解 - Capability 列表

本文档列出了所有需要实现的 capability，每个 capability 对应一个独立的 spec。

## Capability 详细说明

### 1. database-infrastructure
**职责**：数据库基础设施和Repository模式

**核心功能**：
- SQLite数据库初始化
- BaseRepository抽象类
- Database Context（工作区数据库切换）
- Schema管理和迁移系统
- 主数据库和工作区数据库分离

**依赖**：无

**相关表**：
- `workspaces` - 工作区信息（主数据库）
- 其他表在工作区数据库中

---

### 2. ipc-communication
**职责**：Main Process 和 Renderer Process 之间的IPC通信

**核心功能**：
- IPC Handler注册机制
- 安全隔离（contextIsolation）
- Preload脚本
- 统一的错误处理
- 类型安全的IPC接口

**依赖**：无（Electron基础功能）

---

### 3. platform-api
**职责**：Platform API抽象层，避免Renderer直接调用IPC

**核心功能**：
- Platform API接口定义
- 前端API封装
- 类型定义
- 错误处理封装

**依赖**：`ipc-communication`

---

### 4. workspace-management
**职责**：多工作区管理，类似浏览器配置文件

**核心功能**：
- 工作区创建/删除/切换
- 工作区数据库管理
- 工作区元数据存储（主数据库）
- 工作区日志目录管理
- 数据隔离

**依赖**：`database-infrastructure`

**相关表**：
- `workspaces` - 工作区信息

---

### 5. settings-management
**职责**：应用设置管理

**核心功能**：
- 设置读取/更新
- 设置持久化
- 默认值管理
- 设置验证

**依赖**：`database-infrastructure`, `workspace-management`

**相关表**：
- `settings` - 应用设置

---

### 6. mcp-server-management
**职责**：MCP服务器生命周期管理

**核心功能**：
- 服务器注册/注销
- 服务器启动/停止
- 服务器配置管理（stdio、HTTP、SSE）
- DXT配置导入
- 工具列表获取和管理
- 工具启用/禁用
- 服务器状态监控

**依赖**：`database-infrastructure`, `workspace-management`

**相关表**：
- `servers` - MCP服务器配置
- `server_tools` - 服务器工具配置

**外部依赖**：
- `@modelcontextprotocol/sdk` - MCP协议实现

---

### 7. mcp-server-runtime
**职责**：MCP HTTP服务器和请求聚合

**核心功能**：
- Express HTTP服务器（端口3282）
- Token验证
- Project过滤（X-MCPR-Project header）
- 请求元数据注入
- Aggregator Server（聚合多个MCP服务器）
- 工具路由（toolToServerMap）
- 资源URI标准化（resource://serverName/path）
- 请求处理（tools/list, tools/call, resources/*, prompts/*）

**依赖**：`mcp-server-management`

**外部依赖**：
- `express` - HTTP服务器
- `@modelcontextprotocol/sdk` - MCP协议实现

---

### 8. project-management
**职责**：MCP服务器分组管理

**核心功能**：
- 项目创建/删除/更新
- 服务器添加到项目/从项目移除
- 项目列表查询
- 项目过滤（在HTTP请求中）

**依赖**：`database-infrastructure`, `workspace-management`, `mcp-server-management`

**相关表**：
- `projects` - 项目信息
- `project_servers` - 项目和服务器关联

---

### 9. mcp-logging
**职责**：请求日志记录和管理

**核心功能**：
- 请求日志记录（JSONL格式）
- 按日期分割日志文件（request-logs-YYYY-MM-DD.jsonl）
- 日志文件存储（logs/workspace-{id}/）
- 日志自动清理（保留最近3天）
- 日志读取和查询
- 日志搜索（全文搜索最近3天的日志）
- 日志统计

**依赖**：`workspace-management`, `mcp-server-runtime`

**存储**：
- 文件系统：`logs/workspace-{id}/request-logs-YYYY-MM-DD.jsonl`

---

### 10. mcp-app-management
**职责**：MCP应用/客户端管理（Token管理）

**核心功能**：
- 客户端应用注册
- Token生成和管理
- Token验证
- 客户端连接信息管理

**依赖**：`database-infrastructure`, `workspace-management`

**相关表**：
- `tokens` - API令牌
- `mcp_apps` - MCP应用配置（可选）

---

### 11. workflow-system
**职责**：工作流和Hook系统

**核心功能**：
- Hook脚本管理
- 工作流定义（可视化编辑器）
- Hook执行（JavaScript）
- 工作流触发（在MCP请求时）
- 工作流启用/禁用

**依赖**：`database-infrastructure`, `workspace-management`, `mcp-server-runtime`

**相关表**：
- `hooks` - Hook脚本
- `workflows` - 工作流定义

---

### 12. electron-app-shell
**职责**：Electron应用外壳和系统集成

**核心功能**：
- 应用窗口管理
- 系统托盘集成
- 菜单栏（macOS/Windows）
- 应用生命周期管理
- 自动更新（可选）
- 深色/浅色主题支持

**依赖**：无（Electron基础功能）

---

### 13. ui-components
**职责**：前端UI组件和页面

**核心功能**：
- 侧边栏导航
- 服务器管理UI
- 项目管理UI
- 工作区管理UI
- 日志查看UI
- 客户端管理UI
- 工作流管理UI（React Flow）
- 设置UI
- 主题切换

**依赖**：`platform-api`, `electron-app-shell`

**技术栈**：
- Vue 3 + Composition API
- Pinia（状态管理）
- Tailwind CSS
- React Flow（工作流编辑器）

---

### 14. cli-tool
**职责**：命令行工具

**核心功能**：
- `connect` 命令（stdio → HTTP桥接）
- `serve` 命令（HTTP → stdio聚合）
- `--project` 参数支持
- Token认证支持（MCPR_TOKEN环境变量）

**依赖**：无（独立CLI应用）

**外部依赖**：
- `@modelcontextprotocol/sdk` - MCP协议实现

---

## 实现优先级

### P0（必须，核心功能）
1. `database-infrastructure`
2. `ipc-communication`
3. `platform-api`
4. `workspace-management`
5. `settings-management`
6. `mcp-server-management`
7. `mcp-server-runtime`

### P1（重要，完整用户体验）
8. `project-management`
9. `mcp-logging`
10. `electron-app-shell`
11. `ui-components`

### P2（增强功能）
12. `mcp-app-management`
13. `workflow-system`
14. `cli-tool`

---

## 依赖关系图

```
database-infrastructure
    ├── workspace-management
    │   ├── settings-management
    │   ├── mcp-server-management
    │   │   └── mcp-server-runtime
    │   │       ├── mcp-logging
    │   │       └── workflow-system
    │   ├── project-management
    │   └── mcp-app-management
    │
ipc-communication
    └── platform-api
        └── ui-components
            └── electron-app-shell

cli-tool (独立)
```

---

## 下一步行动

1. 为每个 capability 创建独立的 spec 文件
2. 按照依赖关系顺序实现
3. 每个 capability 实现后，创建对应的 change proposal 归档

