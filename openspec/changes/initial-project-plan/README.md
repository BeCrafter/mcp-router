# MCP Router 功能拆解规划

本目录包含了将 AI_AGENT_DEVELOPMENT_GUIDE.md 中所有功能拆解成 OpenSpec 规范的规划。

## 文件说明

- `proposal.md` - 变更提案概述
- `capability-breakdown.md` - 详细的 capability 列表和说明
- `tasks.md` - 任务清单
- `example-spec.md` - 示例 spec 文件格式
- `README.md` - 本文件

## 如何使用这个规划

### 步骤1：创建所有 Capability Specs

为每个 capability 创建独立的 spec 文件：

```bash
# 创建目录结构
mkdir -p openspec/specs/{capability-name}

# 创建 spec.md 文件
# 参考 example-spec.md 的格式
```

### 步骤2：按照依赖关系顺序实现

参考 `capability-breakdown.md` 中的依赖关系图，按照以下顺序实现：

1. **阶段0：基础设施**
   - `database-infrastructure`
   - `ipc-communication`
   - `platform-api`

2. **阶段1：第一个完整功能**
   - `workspace-management`
   - `settings-management`

3. **阶段2：核心MCP功能**
   - `mcp-server-management`
   - `mcp-server-runtime`

4. **阶段3：组织和日志**
   - `project-management`
   - `mcp-logging`

5. **阶段4：扩展功能**
   - `mcp-app-management`
   - `workflow-system`

6. **阶段5：用户界面和工具**
   - `electron-app-shell`
   - `ui-components`
   - `cli-tool`

### 步骤3：为每个 Capability 创建 Change Proposal

当准备实现某个 capability 时：

```bash
# 创建 change proposal
openspec change create add-{capability-name}

# 或者手动创建目录
mkdir -p openspec/changes/add-{capability-name}/specs/{capability-name}

# 创建 spec delta（从 specs/{capability-name}/spec.md 复制内容）
# 创建 proposal.md, tasks.md, design.md（如需要）
```

### 步骤4：实现和验证

1. 实现功能
2. 运行测试
3. 验证 spec：`openspec validate {capability-name} --strict`
4. 归档变更：`openspec archive add-{capability-name} --yes`

## Capability 列表

共 14 个 capability：

1. `database-infrastructure` - 数据库基础设施
2. `ipc-communication` - IPC通信层
3. `platform-api` - Platform API抽象层
4. `workspace-management` - 工作区管理
5. `settings-management` - 设置管理
6. `mcp-server-management` - MCP服务器管理
7. `mcp-server-runtime` - MCP运行时
8. `project-management` - 项目管理
9. `mcp-logging` - 日志管理
10. `mcp-app-management` - MCP应用管理
11. `workflow-system` - 工作流系统
12. `cli-tool` - CLI工具
13. `electron-app-shell` - Electron应用外壳
14. `ui-components` - 前端UI组件

详细说明请查看 `capability-breakdown.md`。

## 下一步

1. 阅读 `capability-breakdown.md` 了解每个 capability 的详细要求
2. 参考 `example-spec.md` 创建第一个 spec
3. 按照依赖关系顺序逐个实现

