## 1. 工作区系统（1.5天）

### 1.1 后端实现
- [x] 1.1.1 创建 WorkspaceRepository（继承BaseRepository）
- [x] 1.1.2 创建数据库Schema（workspaces表在主数据库）
- [x] 1.1.3 实现 WorkspaceService（CRUD操作）
- [x] 1.1.4 实现工作区切换逻辑（关闭当前数据库，打开新数据库）
- [x] 1.1.5 实现数据库上下文切换（Repository重新初始化）
- [x] 1.1.6 实现工作区数据库文件管理（workspace-{id}.db）
- [x] 1.1.7 创建 Workspace IPC Handlers（workspaces:list, workspaces:create, workspaces:switch, workspaces:update, workspaces:delete）
- [x] 1.1.8 在 main.ts 中注册 Workspace Handlers

### 1.2 前端实现
- [x] 1.2.1 创建 WorkspaceStore（Pinia store）
- [x] 1.2.2 实现 Workspace Platform API（list, create, switch, update, delete）
- [x] 1.2.3 更新 Preload 暴露 Workspace 接口
- [x] 1.2.4 创建工作区管理UI（WorkspaceList组件）
- [x] 1.2.5 实现工作区切换功能
- [x] 1.2.6 实现工作区创建表单

## 2. 项目系统（1.5天）

### 2.1 后端实现
- [x] 2.1.1 创建 ProjectRepository（继承BaseRepository）
- [x] 2.1.2 创建数据库Schema（projects表、server_projects关联表）
- [x] 2.1.3 实现 ProjectService（CRUD操作）
- [x] 2.1.4 实现服务器-项目关联（addServerToProject, removeServerFromProject）
- [x] 2.1.5 实现项目过滤逻辑（在聚合器中使用）
- [x] 2.1.6 创建 Project IPC Handlers（projects:list, projects:create, projects:update, projects:delete, projects:addServer, projects:removeServer）
- [x] 2.1.7 在 main.ts 中注册 Project Handlers

### 2.2 前端实现
- [x] 2.2.1 创建 ProjectStore（Pinia store）
- [x] 2.2.2 实现 Project Platform API（list, create, update, delete, addServer, removeServer）
- [x] 2.2.3 更新 Preload 暴露 Project 接口
- [x] 2.2.4 创建项目管理UI（ProjectList组件）
- [ ] 2.2.5 实现项目-服务器关联UI（拖拽支持，后续实现）
- [x] 2.2.6 实现项目切换功能
- [x] 2.2.7 实现项目创建/编辑表单

## 3. 集成与测试

- [ ] 3.1 编写工作区隔离测试 tests/stage4-workspace-isolation.test.ts（后续实现）
- [ ] 3.2 编写项目功能测试 tests/stage4-project.test.ts（后续实现）
- [ ] 3.3 编写E2E测试 tests/e2e/stage4-workspace-project.e2e.test.ts（后续实现）
- [x] 3.4 创建验证脚本 scripts/verify-stage4.sh

## 4. 验证

- [ ] 4.1 创建工作区，验证数据隔离（需要手动验证）
- [ ] 4.2 切换工作区，验证数据完全隔离（需要手动验证）
- [ ] 4.3 创建项目，验证项目功能（需要手动验证）
- [ ] 4.4 将服务器添加到项目，验证关联（需要手动验证）
- [ ] 4.5 使用X-MCPR-Project header测试项目过滤（需要手动验证）
- [ ] 4.6 检查控制台无错误（需要手动验证）
