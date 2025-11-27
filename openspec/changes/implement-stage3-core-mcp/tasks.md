## 1. MCP Server Manager（2天）

### 1.1 服务器管理
- [x] 1.1.1 创建 ServerRepository（继承BaseRepository）
- [x] 1.1.2 创建数据库Schema（servers表已在schema-manager中创建）
- [x] 1.1.3 实现 ServerService（CRUD操作）
- [x] 1.1.4 实现服务器启用/禁用功能
- [x] 1.1.5 创建 Server IPC Handlers（servers:list, servers:create, servers:update, servers:delete, servers:toggle）
- [x] 1.1.6 在 main.ts 中注册 Server Handlers

### 1.2 MCP客户端连接
- [x] 1.2.1 安装并集成 @modelcontextprotocol/sdk
- [x] 1.2.2 实现 stdio 传输连接
- [ ] 1.2.3 实现 HTTP 传输连接（后续实现）
- [ ] 1.2.4 实现 SSE 传输连接（后续实现）
- [x] 1.2.5 实现连接状态管理（connected, disconnected, error）
- [ ] 1.2.6 实现连接重试机制（后续实现）
- [x] 1.2.7 实现连接错误处理

### 1.3 工具管理
- [x] 1.3.1 实现工具列表获取（从MCP服务器）
- [ ] 1.3.2 实现工具启用/禁用功能（基础实现，UI待完善）
- [ ] 1.3.3 实现工具权限管理（后续实现）
- [x] 1.3.4 创建 Tool IPC Handlers（servers:tools）

## 2. MCP HTTP服务器（1天）

### 2.1 HTTP服务器
- [x] 2.1.1 创建 Express 服务器（端口3282）
- [x] 2.1.2 实现 MCP 请求路由（POST /mcp）
- [x] 2.1.3 实现 Token 认证（Bearer Token验证，完整验证待阶段6）
- [x] 2.1.4 实现项目过滤（X-MCPR-Project header）
- [x] 2.1.5 实现 CORS 配置
- [x] 2.1.6 实现请求日志记录

### 2.2 请求处理
- [x] 2.2.1 实现请求验证（JSON-RPC 2.0格式）
- [x] 2.2.2 实现错误处理（统一错误响应格式）
- [x] 2.2.3 实现请求转发到聚合器
- [x] 2.2.4 实现响应处理

## 3. Aggregator Server（1天）

### 3.1 聚合逻辑
- [x] 3.1.1 实现工具聚合（合并多个服务器的工具列表）
- [x] 3.1.2 实现资源聚合（合并多个服务器的资源列表）
- [x] 3.1.3 实现提示词聚合（合并多个服务器的提示词列表）
- [x] 3.1.4 实现请求分发（根据工具名路由到对应服务器）

### 3.2 请求处理
- [x] 3.2.1 实现 ListTools 聚合（tools/list）
- [x] 3.2.2 实现 CallTool 分发（tools/call）
- [x] 3.2.3 实现 ListResources 聚合（resources/list）
- [x] 3.2.4 实现 GetResource 分发（resources/read）
- [x] 3.2.5 实现 ListPrompts 聚合（prompts/list）
- [x] 3.2.6 实现 GetPrompt 分发（prompts/get）

## 4. 前端UI（1天）

### 4.1 服务器管理UI
- [x] 4.1.1 创建 ServerList 组件（在Servers.vue中实现）
- [x] 4.1.2 创建 ServerCard 组件（在Servers.vue中实现）
- [x] 4.1.3 创建 ServerForm 组件（添加/编辑服务器，在Servers.vue中实现）
- [ ] 4.1.4 创建 ToolToggle 组件（后续实现）
- [x] 4.1.5 实现服务器状态显示（运行中/已停止/错误，基础实现）
- [ ] 4.1.6 实现服务器拖拽排序（后续实现）

### 4.2 服务器Store
- [x] 4.2.1 创建 ServerStore（Pinia store）
- [x] 4.2.2 实现服务器列表获取
- [x] 4.2.3 实现服务器操作（create, update, delete, toggle）
- [ ] 4.2.4 实现服务器状态实时更新（后续实现）

### 4.3 基础UI组件
- [ ] 4.3.1 创建 Sidebar 组件（导航栏，后续实现）
- [ ] 4.3.2 创建 Header 组件（顶部栏，后续实现）
- [ ] 4.3.3 创建 MainLayout 组件（主布局，后续实现）
- [x] 4.3.4 创建 Card 组件（卡片容器）

## 5. 测试验证

- [ ] 5.1 编写服务器管理测试 tests/stage3-server-management.test.ts（后续实现）
- [ ] 5.2 编写MCP连接测试 tests/stage3-mcp-connection.test.ts（后续实现）
- [ ] 5.3 编写HTTP服务器测试 tests/stage3-http-server.test.ts（后续实现）
- [ ] 5.4 编写聚合器测试 tests/stage3-aggregator.test.ts（后续实现）
- [ ] 5.5 编写UI测试 tests/e2e/stage3-server-ui.e2e.test.ts（后续实现）
- [x] 5.6 创建验证脚本 scripts/verify-stage3.sh

## 6. 验证

- [ ] 6.1 打开应用，添加一个MCP服务器（需要手动验证）
- [ ] 6.2 启用服务器，检查连接状态（需要手动验证）
- [ ] 6.3 使用curl测试HTTP服务器（需要手动验证）
- [ ] 6.4 验证工具列表聚合（需要手动验证）
- [ ] 6.5 验证工具调用分发（需要手动验证）
- [ ] 6.6 检查控制台无错误（需要手动验证）
