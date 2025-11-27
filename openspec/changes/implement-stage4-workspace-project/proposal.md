# Change: 实现阶段4 - 工作区与项目管理

## Why

工作区和项目系统是MCP Router的核心组织功能，允许用户将MCP服务器组织到不同的工作区和项目中，实现数据隔离和逻辑分组。这个阶段将实现完整的工作区切换和项目管理功能。

## What Changes

- 实现工作区系统（创建、切换、数据隔离、数据库上下文管理）
- 实现项目系统（创建、编辑、删除、服务器关联、项目过滤）
- 实现工作区管理UI（工作区列表、切换界面）
- 实现项目管理UI（项目列表、服务器分配、项目切换）

## Impact

- Affected specs:
  - `specs/workspace-system/spec.md` - 实现所有Requirements
  - `specs/project-system/spec.md` - 实现所有Requirements
- Affected code:
  - `main/modules/workspace/` - 工作区管理模块
  - `main/modules/project/` - 项目管理模块
  - `main/infrastructure/database/` - 数据库上下文切换逻辑
  - `renderer/stores/workspace.ts` - 工作区Store
  - `renderer/stores/project.ts` - 项目Store
  - `renderer/components/workspaces/` - 工作区UI组件
  - `renderer/components/projects/` - 项目UI组件

## Dependencies

- 依赖阶段3完成（需要MCP服务器管理功能）

