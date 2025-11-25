# MCP Router AI Agent 开发指南

> 本文档旨在指导任何AI代理理解并实现与当前MCP Router代码库相同的功能，同时支持技术栈和实现思路的灵活调整。

## 📋 目录

1. [项目概述](#项目概述)
2. [软件实现效果](#软件实现效果)
3. [架构设计](#架构设计)
4. [技术栈](#技术栈)
5. [核心模块详解](#核心模块详解)
6. [快速开始指南](#快速开始指南)
7. [开发流程](#开发流程)
8. [代码模板与脚手架](#代码模板与脚手架)
9. [常见开发任务](#常见开发任务)
10. [调试与故障排查](#调试与故障排查)
11. [测试指南](#测试指南)
12. [代码规范与最佳实践](#代码规范与最佳实践)
13. [构建与部署](#构建与部署)
14. [扩展指南](#扩展指南)
15. [技术栈替换指南](#技术栈替换指南)
16. [AI开发提示](#ai开发提示)

---

## 项目概述

### 什么是 MCP Router？

MCP Router 是一个桌面应用程序，用于统一管理多个 Model Context Protocol (MCP) 服务器。它充当一个聚合器，将多个MCP服务器整合为单一端点，提供：

- **统一连接**：支持远程和本地MCP服务器
- **项目管理**：将MCP服务器组织到项目中
- **工作区管理**：类似浏览器配置文件的工作区系统
- **工具控制**：按服务器粒度启用/禁用工具
- **日志与分析**：完整的请求日志和统计信息

### 核心价值主张

1. **数据本地化**：所有数据存储在本地，确保隐私和安全
2. **跨平台支持**：Windows 和 macOS
3. **灵活的组织方式**：项目和工作区双重组织系统
4. **可扩展性**：支持自定义MCP服务器和工具

---

## 软件实现效果

### 用户界面与交互

#### 主界面布局

应用启动后呈现现代化的桌面应用界面：

1. **侧边栏导航**：
   - 默认展开状态，包含主要功能入口
   - 图标化导航：服务器管理、客户端管理、日志查看、工作流管理、设置等
   - 响应式设计，可折叠以节省空间

2. **主内容区**：
   - 顶部标题栏（macOS隐藏式，Windows自定义）
   - 内容区域采用卡片式布局
   - 支持深色/浅色主题切换

3. **系统托盘**：
   - 后台运行时显示托盘图标
   - 右键菜单快速访问：显示窗口、退出应用
   - 显示服务器状态摘要

#### 核心功能界面效果

##### 1. 服务器管理界面

**视觉效果**：
- 服务器列表以卡片形式展示
- 每个服务器卡片显示：
  - 服务器名称和图标
  - 连接状态指示器（绿色=运行中，灰色=已停止）
  - 启用/禁用开关（Toggle Switch）
  - 工具数量统计
  - 所属项目标签

**交互效果**：
- **一键启用/禁用**：点击开关即时生效，无需保存按钮
- **工具管理**：展开服务器卡片显示工具列表，每个工具可单独启用/禁用
- **实时状态更新**：服务器连接状态实时反映在界面上
- **拖拽排序**：支持拖拽调整服务器顺序

**用户体验流程**：
```
用户打开应用 → 看到服务器列表 → 点击开关启用服务器 
→ 服务器状态变为"运行中"（绿色） → 工具列表自动加载 
→ 用户可选择性地启用/禁用工具 → 更改立即生效
```

##### 2. 添加服务器界面

**支持三种添加方式**：

1. **DXT配置导入**：
   - 支持从Claude Desktop等应用导入DXT配置
   - 自动检测并解析配置文件
   - 一键导入多个服务器

2. **JSON配置**：
   - 提供JSON编辑器（CodeMirror）
   - 语法高亮和错误提示
   - 实时验证配置格式

3. **手动配置**：
   - 表单式配置界面
   - 支持多种传输方式：stdio、HTTP、SSE
   - 环境变量配置
   - 参数验证和错误提示

**交互效果**：
- 配置验证：输入时实时检查格式
- 测试连接：添加前可测试服务器连接
- 智能提示：根据配置类型提供建议

##### 3. 项目管理界面

**视觉效果**：
- 项目列表视图，每个项目显示：
  - 项目名称和描述
  - 包含的服务器数量
  - 项目图标/颜色标识

**交互效果**：
- **创建项目**：点击"新建项目"，输入名称和描述
- **添加服务器**：拖拽服务器到项目，或通过选择器添加
- **项目切换**：快速切换活动项目，只显示该项目下的服务器
- **项目过滤**：在CLI连接时可通过`--project`参数指定项目

**实际效果**：
- 用户创建"开发环境"项目，添加开发相关的MCP服务器
- 创建"生产环境"项目，添加生产相关的服务器
- 通过项目切换，快速在不同环境间切换，避免工具冲突

##### 4. 工作区管理界面

**视觉效果**：
- 工作区列表，类似浏览器配置文件
- 显示工作区类型：本地/远程
- 显示最后使用时间

**交互效果**：
- **切换工作区**：点击工作区，应用自动切换数据库
- **创建新工作区**：创建独立的数据环境
- **工作区设置**：配置远程工作区的API地址和认证

**实际效果**：
- 用户创建"个人"工作区，用于个人项目
- 创建"团队"工作区，连接到远程API，共享团队配置
- 切换工作区时，所有数据（服务器、日志、项目）完全隔离

##### 5. 日志查看界面

**视觉效果**：
- 时间线式日志列表
- 每条日志显示：
  - 时间戳
  - 请求类型（tools/list, tools/call等）
  - 请求参数
  - 响应结果
  - 执行时长
  - 状态（成功/失败）

**交互效果**：
- **实时更新**：新请求自动追加到列表（从当前日志文件读取）
- **过滤功能**：按服务器、请求类型、时间范围过滤
- **详情查看**：点击日志展开查看完整请求/响应
- **搜索功能**：全文搜索日志内容（搜索最近3天的日志文件）
- **统计图表**：显示请求量、成功率等统计信息
- **日期选择**：可选择查看不同日期的日志文件

**实际效果**：
- 用户可以看到最近3天内的MCP请求详细信息
- 快速定位失败的请求
- 分析工具使用频率
- 监控系统性能
- 日志按日期自动分割，便于管理和查看

##### 6. 客户端管理界面

**视觉效果**：
- 客户端应用列表（Claude, Cursor, Cline等）
- 每个客户端显示：
  - 应用图标
  - 应用名称
  - 连接状态
  - Token信息

**交互效果**：
- **添加客户端**：选择预定义应用或添加自定义应用
- **生成Token**：一键生成连接Token
- **复制连接信息**：复制Token和连接命令
- **测试连接**：验证客户端连接

**实际效果**：
- 用户添加"Claude Desktop"客户端
- 生成Token：`mcpr_xxxxx`
- 在Claude Desktop配置中使用该Token
- Claude Desktop通过HTTP连接到MCP Router，获得所有聚合的工具

##### 7. 工作流管理界面

**视觉效果**：
- React Flow可视化编辑器
- 节点类型：
  - Start节点（开始）
  - End节点（结束）
  - MCP Call节点（MCP调用）
  - Hook节点（JavaScript执行）

**交互效果**：
- **拖拽创建**：从节点面板拖拽节点到画布
- **连接节点**：拖拽连接线连接节点
- **编辑代码**：双击Hook节点打开代码编辑器
- **保存工作流**：保存为可复用的工作流定义
- **启用/禁用**：一键启用或禁用工作流

**实际效果**：
- 用户创建"请求日志记录"工作流
- 在tools/call请求时自动执行
- Hook节点修改请求参数，添加日志标记
- 所有工具调用自动记录到日志系统

### 运行时行为

#### 应用启动流程

1. **启动阶段**（用户视角）：
   - 双击应用图标
   - 显示启动画面（可选）
   - 主窗口出现，显示加载状态
   - 自动加载上次的工作区
   - 恢复服务器连接状态

2. **后台初始化**（技术实现）：
   - 初始化SQLite数据库
   - 加载工作区配置
   - 启动MCP HTTP服务器（端口3282）
   - 初始化聚合器
   - 从数据库加载服务器配置
   - 自动连接已启用的服务器

#### 服务器连接流程

**用户操作**：点击服务器开关启用

**系统行为**：
1. UI立即更新开关状态
2. Main Process启动MCP客户端连接
3. 连接成功后，获取服务器工具列表
4. UI显示工具列表，每个工具可单独控制
5. 工具自动注册到聚合器
6. 客户端可通过HTTP访问这些工具

**错误处理**：
- 连接失败时显示错误提示
- 自动重试机制（可配置）
- 错误日志记录

#### 请求处理流程

**用户视角**：在Claude Desktop中使用工具

**系统行为**：
1. Claude Desktop发送HTTP请求到`http://localhost:3282/mcp`
2. MCP Router验证Token和Project
3. 聚合器接收请求，路由到对应服务器
4. 执行工具调用
5. 返回结果给Claude Desktop
6. 记录请求日志到文件（按日期分割）
7. UI实时更新日志列表（从当前日志文件读取）
8. 自动清理超过3天的日志文件

**性能表现**：
- 请求延迟：< 100ms（本地服务器）
- 并发处理：支持多个并发请求
- 超时处理：60分钟超时（可配置）

### 数据持久化效果

#### 本地存储

**存储位置**：
- macOS: `~/Library/Application Support/mcp-router/`
- Windows: `%APPDATA%/mcp-router/`

**存储内容**：
- `mcprouter.db` - 主数据库（工作区元数据）
- `workspace-{id}.db` - 工作区数据库
- `logs/` - 日志文件目录
  - `request-logs-YYYY-MM-DD.jsonl` - 按日期分割的日志文件（JSONL格式）
  - 仅保留最近3天的日志文件，自动清理旧文件
- 配置文件等

**数据安全**：
- 所有数据加密存储（敏感信息）
- 本地访问控制
- 不向外部传输数据

#### 数据同步

**工作区切换**：
- 切换工作区时，自动关闭当前数据库
- 打开新工作区的数据库
- 所有Repository实例重新初始化
- UI自动刷新显示新工作区数据

**数据隔离**：
- 不同工作区的数据完全隔离
- 服务器配置、项目互不影响
- 日志文件按工作区ID组织：`logs/workspace-{id}/request-logs-YYYY-MM-DD.jsonl`
- 支持同时运行多个工作区（通过不同实例）

### 跨平台体验

#### macOS体验

- **原生外观**：使用macOS设计语言
- **菜单栏集成**：应用菜单符合macOS规范
- **Dock集成**：支持Dock图标和通知
- **快捷键**：支持macOS标准快捷键
- **代码签名**：支持Apple代码签名和公证

#### Windows体验

- **Windows风格**：使用Windows 11设计语言
- **任务栏集成**：支持任务栏图标和跳转列表
- **系统托盘**：Windows系统托盘集成
- **自动更新**：支持Windows自动更新机制

### 性能指标

#### 响应时间

- **应用启动**：< 3秒（首次启动可能稍慢）
- **服务器连接**：< 2秒（本地服务器）
- **工具列表加载**：< 500ms
- **日志查询**：< 200ms（从文件读取，支持最近3天的日志）

#### 资源占用

- **内存占用**：约100-200MB（基础运行）
- **CPU占用**：< 5%（空闲状态）
- **磁盘占用**：约50MB（应用本身）+ 数据库大小

#### 并发能力

- **同时连接服务器数**：理论上无限制，实际受系统资源限制
- **并发请求处理**：支持多客户端同时连接
- **工具调用并发**：每个服务器独立处理

### 错误处理与用户反馈

#### 错误提示

- **连接失败**：显示具体错误信息（服务器地址、端口、认证等）
- **配置错误**：JSON格式错误时高亮显示错误位置
- **权限错误**：文件访问权限不足时提供解决建议
- **网络错误**：HTTP服务器启动失败时显示端口占用信息

#### 成功反馈

- **操作成功**：使用Toast通知（Sonner）
- **状态更新**：实时更新UI状态指示器
- **自动保存**：配置更改自动保存，无需手动保存

### 集成效果

#### 与AI客户端的集成

**Claude Desktop集成**：
```json
{
  "mcpServers": {
    "mcp-router": {
      "url": "http://localhost:3282/mcp",
      "headers": {
        "Authorization": "Bearer mcpr_xxxxx"
      }
    }
  }
}
```

**效果**：
- Claude Desktop启动时自动连接到MCP Router
- 在Claude Desktop中可以看到所有聚合的工具
- 使用工具时，请求自动路由到对应的MCP服务器
- 支持项目过滤，只显示特定项目的工具

#### CLI工具集成

**连接效果**：
```bash
$ npx -y @mcp_router/cli connect
# 连接到MCP Router，通过stdio暴露聚合的工具
# AI客户端可以通过stdio连接到CLI，获得所有工具
```

**服务效果**：
```bash
$ npx -y @mcp_router/cli serve --server github github-server npx -- @modelcontextprotocol/server-github
# 启动HTTP服务器，聚合多个stdio MCP服务器
# 客户端通过HTTP连接到聚合服务器
```

### 用户体验亮点

1. **零配置启动**：安装后即可使用，无需复杂配置
2. **即时生效**：所有更改立即生效，无需重启
3. **可视化操作**：图形界面操作，无需编写配置文件
4. **实时反馈**：所有操作都有即时视觉反馈
5. **错误恢复**：自动重试和错误恢复机制
6. **数据安全**：所有数据本地存储，完全控制
7. **灵活组织**：项目和工作区双重组织，适应各种场景

---

## 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                    Electron Application                  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐         ┌──────────────┐            │
│  │  Renderer     │  ◄──►   │  Main Process │            │
│  │  (Vue UI)     │  IPC    │  (Business)   │            │
│  └──────────────┘         └──────────────┘            │
│         │                        │                      │
│         │                        ▼                      │
│         │              ┌──────────────────┐            │
│         │              │  MCP HTTP Server  │            │
│         │              │   (Port 3282)     │            │
│         │              └──────────────────┘            │
│         │                        │                      │
│         │                        ▼                      │
│         │              ┌──────────────────┐            │
│         │              │ Aggregator Server │            │
│         │              └──────────────────┘            │
│         │                        │                      │
│         │                        ▼                      │
│         │         ┌──────────────────────────┐         │
│         │         │   MCP Server Manager     │         │
│         │         │  (Multiple MCP Servers)  │         │
│         │         └──────────────────────────┘         │
│         │                                                │
│         ▼                                                │
│  ┌──────────────────────────────────────────┐          │
│  │         SQLite Database (Local)           │          │
│  │  - Workspaces                            │          │
│  │  - Servers                               │          │
│  │  - Log Files (File System)               │          │
│  │  - Settings                              │          │
│  └──────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────┘
```

### Monorepo 结构

项目采用 pnpm workspace + Turbo 的 monorepo 架构：

```
mcp-router/
├── apps/
│   ├── cli/              # CLI工具（连接MCP Router）
│   └── electron/         # Electron桌面应用
├── packages/
│   ├── shared/           # 共享类型和工具
│   ├── remote-api-types/ # 远程API类型定义
│   ├── tailwind-config/  # Tailwind CSS配置
│   └── ui/               # UI组件库
├── docs/                 # 文档
└── tools/                # 工具脚本
```

### 模块化架构（Main Process）

Main Process 采用模块化架构，每个模块自包含：

```
main/modules/
├── mcp-server-manager/    # MCP服务器管理
├── mcp-server-runtime/   # MCP运行时（HTTP服务器、聚合器）
├── workspace/            # 工作区管理
├── projects/             # 项目管理
├── mcp-logger/           # 日志管理
├── settings/             # 设置管理
├── workflow/             # 工作流和Hook系统
├── mcp-apps-manager/     # MCP应用管理
└── system/               # 系统功能（更新、包管理等）
```

每个模块通常包含：
- `*.service.ts` - 业务逻辑
- `*.repository.ts` - 数据访问层
- `*.ipc.ts` - IPC通信处理器

---

## 技术栈

### 核心技术

| 类别 | 技术 | 版本要求 | 用途 |
|------|------|---------|------|
| **运行时** | Node.js | >=20.0.0 | 后端运行时 |
| **包管理** | pnpm | >=8.0.0 | 包管理和workspace |
| **构建工具** | Turbo | ^2.5.6 | Monorepo构建编排 |
| **桌面框架** | Electron | ^36.9.0 | 跨平台桌面应用 |
| **前端框架** | Vue | ^3.5.0 | UI框架 |
| **状态管理** | Pinia | ^2.2.0 | 状态管理 |
| **数据库** | better-sqlite3 | ^11.10.0 | 本地SQLite数据库 |
| **HTTP框架** | Express | ^5.1.0 | MCP HTTP服务器 |
| **MCP SDK** | @modelcontextprotocol/sdk | ^1.18.0 | MCP协议实现 |
| **样式** | Tailwind CSS | ^3.4.17 | CSS框架 |
| **类型系统** | TypeScript | ^5.9.2 | 类型安全 |

### 开发工具

- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Knip** - 未使用代码检测
- **Playwright** - E2E测试

### 构建工具

- **Electron Forge** - Electron应用打包
- **Webpack** - 模块打包
- **ts-loader** - TypeScript编译

---

## 前端架构详解

### Vue 3 + Composition API 架构

**核心特性**：
- **Composition API**：使用`<script setup>`语法，逻辑更清晰
- **响应式系统**：基于Proxy的响应式系统，性能优秀
- **组件化**：按功能模块拆分组件，提高可维护性
- **TypeScript支持**：完整的TypeScript类型支持

### 组件拆分策略

采用**原子设计**（Atomic Design）原则，将组件分为四个层级：

#### 1. 原子组件（Atomic Components）
**位置**：`components/common/atoms/`
**特点**：
- 最小可复用单元
- 无业务逻辑
- 纯UI展示和基础交互

**示例**：
- `Button.vue` - 按钮组件
- `Input.vue` - 输入框组件
- `Badge.vue` - 徽章组件
- `Icon.vue` - 图标组件

#### 2. 分子组件（Molecular Components）
**位置**：`components/common/molecules/`
**特点**：
- 组合多个原子组件
- 包含简单交互逻辑
- 可跨模块复用

**示例**：
- `FormField.vue` - 表单字段（Label + Input + Error）
- `Card.vue` - 卡片容器
- `ToggleSwitch.vue` - 开关组件
- `SearchBox.vue` - 搜索框

#### 3. 组织组件（Organism Components）
**位置**：`components/{module}/`
**特点**：
- 业务功能组件
- 使用Pinia Store
- 包含完整业务逻辑

**示例**：
- `ServerCard.vue` - 服务器卡片（包含状态、工具列表）
- `LogItem.vue` - 日志项（包含详情展开）
- `ProjectForm.vue` - 项目表单（包含验证和提交）

#### 4. 页面组件（Page Components）
**位置**：`components/pages/`或路由对应目录
**特点**：
- 完整页面
- 组合多个组织组件
- 处理路由和页面级逻辑

**示例**：
- `HomePage.vue` - 首页
- `ServerManagementPage.vue` - 服务器管理页
- `LogViewerPage.vue` - 日志查看页

### Pinia 状态管理架构

**Store组织**：
```
stores/
├── index.ts              # Store入口，配置Pinia实例
├── servers.ts            # 服务器管理Store
├── projects.ts           # 项目管理Store
├── logs.ts               # 日志管理Store
├── workflows.ts          # 工作流Store
├── theme.ts              # 主题Store
└── settings.ts           # 设置Store
```

**Store模式**（Composition API风格）：
```typescript
// stores/servers.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useServerStore = defineStore('servers', () => {
  // State
  const servers = ref<Server[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const enabledServers = computed(() => 
    servers.value.filter(s => s.enabled)
  );

  const serverById = computed(() => (id: string) =>
    servers.value.find(s => s.id === id)
  );

  // Actions
  async function fetchServers() {
    loading.value = true;
    error.value = null;
    try {
      servers.value = await ipcRenderer.invoke('servers:list');
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  async function toggleServer(id: string, enabled: boolean) {
    await ipcRenderer.invoke('servers:toggle', { id, enabled });
    await fetchServers();
  }

  return {
    // State
    servers,
    loading,
    error,
    // Getters
    enabledServers,
    serverById,
    // Actions
    fetchServers,
    toggleServer,
  };
});
```

### Vue Router 路由配置

**路由结构**：
```typescript
// router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/servers',
  },
  {
    path: '/servers',
    component: () => import('@/components/pages/ServerManagementPage.vue'),
  },
  {
    path: '/projects',
    component: () => import('@/components/pages/ProjectManagementPage.vue'),
  },
  {
    path: '/logs',
    component: () => import('@/components/pages/LogViewerPage.vue'),
  },
  {
    path: '/workflows',
    component: () => import('@/components/pages/WorkflowManagementPage.vue'),
  },
  {
    path: '/settings',
    component: () => import('@/components/pages/SettingsPage.vue'),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
```

### Composables（可复用逻辑）

**位置**：`composables/`
**用途**：提取可复用的组合式函数

**示例**：
```typescript
// composables/useIpc.ts
import { ipcRenderer } from 'electron';

export function useIpc() {
  const invoke = async <T = any>(
    channel: string,
    ...args: any[]
  ): Promise<T> => {
    return await ipcRenderer.invoke(channel, ...args);
  };

  const send = (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  };

  const on = (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (_, ...args) => callback(...args));
  };

  return { invoke, send, on };
}

// composables/useServer.ts
import { useServerStore } from '@/stores/servers';
import { useIpc } from './useIpc';

export function useServer(serverId: string) {
  const serverStore = useServerStore();
  const { invoke } = useIpc();

  const server = computed(() => 
    serverStore.serverById(serverId)
  );

  const toggle = async (enabled: boolean) => {
    await serverStore.toggleServer(serverId, enabled);
  };

  return {
    server,
    toggle,
  };
}
```

---

## 分段实现策略

> **重要**：由于项目复杂度较高，建议按照以下阶段逐步实现。每个阶段都有明确的目标、任务清单和验收标准。

### 实现阶段总览

```
阶段0: 项目骨架 (1-2天)
  ↓
阶段1: 基础设施 (2-3天)
  ↓
阶段2: 第一个完整功能 (1-2天)
  ↓
阶段3: 核心MCP功能 (3-5天)
  ↓
阶段4: 工作区与项目 (2-3天)
  ↓
阶段5: UI完善 (2-3天)
  ↓
阶段6: 高级功能 (3-5天)
  ↓
阶段7: 优化与完善 (2-3天)
```

### 阶段0：项目骨架搭建

**目标**：创建项目基础结构，确保开发环境可用

**时间估算**：1-2天

**任务清单**：

1. **Monorepo初始化**
   - [ ] 创建项目根目录
   - [ ] 配置package.json、pnpm-workspace.yaml、turbo.json
   - [ ] 配置TypeScript、ESLint、Prettier
   - [ ] 创建.gitignore

2. **共享包创建**
   - [ ] 创建@mcp_router/shared包（基础类型）
   - [ ] 创建@mcp_router/ui包（空包）
   - [ ] 创建@mcp_router/tailwind-config包
   - [ ] 创建@mcp_router/remote-api-types包（空包）

3. **Electron应用骨架**
   - [ ] 创建应用目录结构
   - [ ] 配置package.json
   - [ ] 创建main.ts（最小实现）
   - [ ] 创建preload.ts（最小实现）
   - [ ] 创建renderer入口（最小Vue应用）
   - [ ] 配置Webpack
   - [ ] 配置Electron Forge

4. **CLI应用骨架**
   - [ ] 创建CLI目录结构
   - [ ] 配置package.json
   - [ ] 创建入口文件（最小实现）

5. **验证**
   - [ ] `pnpm install` 成功
   - [ ] `pnpm build` 成功
   - [ ] `pnpm dev` 能启动Electron窗口（即使空白）

**验收标准**：
- ✅ 项目结构完整
- ✅ 所有包可以构建
- ✅ Electron应用可以启动
- ✅ 无TypeScript错误
- ✅ 无构建错误

**验证机制**：

1. **自动化验证脚本**：
```bash
#!/bin/bash
# scripts/verify-stage0.sh

echo "验证阶段0：项目骨架搭建"

# 检查项目结构
echo "1. 检查项目结构..."
[ -d "packages" ] || { echo "❌ packages目录不存在"; exit 1; }
[ -d "apps" ] || { echo "❌ apps目录不存在"; exit 1; }
[ -f "package.json" ] || { echo "❌ package.json不存在"; exit 1; }
[ -f "pnpm-workspace.yaml" ] || { echo "❌ pnpm-workspace.yaml不存在"; exit 1; }
[ -f "turbo.json" ] || { echo "❌ turbo.json不存在"; exit 1; }
echo "✅ 项目结构完整"

# 检查依赖安装
echo "2. 检查依赖安装..."
pnpm list --depth=0 > /dev/null 2>&1 || { echo "❌ 依赖未安装，请运行 pnpm install"; exit 1; }
echo "✅ 依赖已安装"

# 检查构建
echo "3. 检查构建..."
pnpm build 2>&1 | grep -i error && { echo "❌ 构建失败"; exit 1; }
echo "✅ 构建成功"

# 检查类型
echo "4. 检查类型..."
pnpm typecheck 2>&1 | grep -i error && { echo "❌ 类型检查失败"; exit 1; }
echo "✅ 类型检查通过"

# 检查Electron启动（超时10秒）
echo "5. 检查Electron启动..."
timeout 10s pnpm dev > /dev/null 2>&1 &
PID=$!
sleep 3
kill $PID 2>/dev/null
echo "✅ Electron可以启动"

echo "🎉 阶段0验证通过！"
```

2. **手动验证清单**：
- [ ] 运行 `pnpm install` 无错误
- [ ] 运行 `pnpm build` 所有包构建成功
- [ ] 运行 `pnpm dev` Electron窗口可以打开
- [ ] 检查控制台无严重错误
- [ ] 检查文件结构符合预期

3. **功能验证**：
```typescript
// tests/stage0-verification.test.ts
import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';

describe('阶段0验证', () => {
  it('项目结构应该完整', () => {
    expect(existsSync('package.json')).toBe(true);
    expect(existsSync('pnpm-workspace.yaml')).toBe(true);
    expect(existsSync('turbo.json')).toBe(true);
    expect(existsSync('packages')).toBe(true);
    expect(existsSync('apps')).toBe(true);
  });

  it('共享包应该存在', () => {
    expect(existsSync('packages/shared')).toBe(true);
    expect(existsSync('packages/shared/package.json')).toBe(true);
  });

  it('Electron应用应该存在', () => {
    expect(existsSync('apps/electron')).toBe(true);
    expect(existsSync('apps/electron/package.json')).toBe(true);
    expect(existsSync('apps/electron/src/main/main.ts')).toBe(true);
  });
});
```

**可交付成果**：
- 完整的项目结构
- 可运行的空白Electron应用
- 验证脚本和测试用例

---

### 阶段1：基础设施层

**目标**：实现数据库、IPC通信、Platform API等基础设施

**时间估算**：2-3天

**前置条件**：阶段0完成

**任务清单**：

1. **数据库基础设施**
   - [ ] 实现SqliteManager类
   - [ ] 实现BaseRepository抽象类
   - [ ] 创建数据库Schema管理系统
   - [ ] 实现数据库初始化逻辑
   - [ ] 测试数据库连接和基本操作

2. **IPC通信系统**
   - [ ] 创建IPC Handler注册系统
   - [ ] 实现IPC消息验证
   - [ ] 实现错误处理机制
   - [ ] 测试IPC通信

3. **Platform API基础**
   - [ ] 定义Platform API接口类型
   - [ ] 实现ElectronPlatformAPI类（骨架）
   - [ ] 实现Preload接口暴露
   - [ ] 实现依赖注入系统

4. **类型系统**
   - [ ] 完善共享类型定义
   - [ ] 创建所有领域类型（Settings, Workspace, Server等）
   - [ ] 创建Platform API类型定义

5. **工具类**
   - [ ] 创建错误类型（PlatformAPIError）
   - [ ] 创建工具函数库
   - [ ] 创建常量定义

**验收标准**：
- ✅ 数据库可以创建表和查询数据
- ✅ IPC消息可以正常传递
- ✅ Platform API可以调用（即使返回空数据）
- ✅ 所有类型定义完整

**验证机制**：

1. **数据库验证**：
```typescript
// tests/stage1-database.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SqliteManager } from '@/main/infrastructure/database/sqlite-manager';
import { BaseRepository } from '@/main/infrastructure/database/base-repository';
import { unlinkSync } from 'fs';

describe('数据库系统验证', () => {
  let db: SqliteManager;
  const testDbPath = './test.db';

  beforeEach(() => {
    db = new SqliteManager(testDbPath);
  });

  afterEach(() => {
    db.close();
    try { unlinkSync(testDbPath); } catch {}
  });

  it('应该可以创建数据库连接', () => {
    const database = db.getDatabase();
    expect(database).toBeDefined();
  });

  it('应该可以创建表', () => {
    const database = db.getDatabase();
    database.exec(`
      CREATE TABLE IF NOT EXISTS test_table (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    
    const result = database.prepare('SELECT name FROM sqlite_master WHERE type="table" AND name="test_table"').get();
    expect(result).toBeDefined();
  });

  it('应该可以插入和查询数据', () => {
    const database = db.getDatabase();
    database.exec(`
      CREATE TABLE IF NOT EXISTS test_table (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);
    
    database.prepare('INSERT INTO test_table (id, name) VALUES (?, ?)').run('1', 'Test');
    const result = database.prepare('SELECT * FROM test_table WHERE id = ?').get('1') as any;
    
    expect(result).toBeDefined();
    expect(result.name).toBe('Test');
  });
});
```

2. **IPC通信验证**：
```typescript
// tests/stage1-ipc.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { ipcMain } from 'electron';

describe('IPC通信验证', () => {
  beforeEach(() => {
    ipcMain.removeAllListeners();
  });

  it('应该可以注册IPC Handler', () => {
    ipcMain.handle('test:ping', async () => 'pong');
    expect(ipcMain.listenerCount('test:ping')).toBe(1);
  });

  it('应该可以调用IPC Handler', async () => {
    ipcMain.handle('test:echo', async (_, message) => message);
    
    // 模拟调用
    const result = await new Promise((resolve) => {
      const handler = ipcMain.listeners('test:echo')[0] as any;
      handler(null, 'hello', resolve);
    });
    
    expect(result).toBe('hello');
  });
});
```

3. **Platform API验证**：
```typescript
// tests/stage1-platform-api.test.ts
import { describe, it, expect } from 'vitest';
import { ElectronPlatformAPI } from '@/renderer/platform-api/electron-platform-api';

describe('Platform API验证', () => {
  it('应该可以创建Platform API实例', () => {
    const api = new ElectronPlatformAPI();
    expect(api).toBeDefined();
    expect(api.settings).toBeDefined();
  });

  it('应该包含所有必需的API域', () => {
    const api = new ElectronPlatformAPI();
    expect(api.auth).toBeDefined();
    expect(api.servers).toBeDefined();
    expect(api.apps).toBeDefined();
    expect(api.packages).toBeDefined();
    expect(api.settings).toBeDefined();
    expect(api.logs).toBeDefined();
    expect(api.workspaces).toBeDefined();
    expect(api.workflows).toBeDefined();
    expect(api.projects).toBeDefined();
  });
});
```

4. **手动验证清单**：
- [ ] 运行数据库测试：`pnpm test tests/stage1-database.test.ts`
- [ ] 运行IPC测试：`pnpm test tests/stage1-ipc.test.ts`
- [ ] 运行Platform API测试：`pnpm test tests/stage1-platform-api.test.ts`
- [ ] 在DevTools中测试IPC调用
- [ ] 检查数据库文件已创建

**可交付成果**：
- 可用的数据库系统
- 可用的IPC通信系统
- Platform API基础框架
- 完整的测试用例

---

### 阶段2：第一个完整功能（Settings）

**目标**：实现Settings模块，验证整个架构流程

**时间估算**：1-2天

**前置条件**：阶段1完成

**任务清单**：

1. **后端实现**
   - [ ] 创建SettingsRepository
   - [ ] 创建SettingsService
   - [ ] 创建Settings IPC Handlers
   - [ ] 在main.ts中注册Handlers

2. **前端实现**
   - [ ] 创建Settings Store
   - [ ] 实现Settings Platform API
   - [ ] 更新Preload暴露Settings接口
   - [ ] 创建Settings页面组件
   - [ ] 添加路由配置

3. **UI实现**
   - [ ] 创建基础Button组件
   - [ ] 创建基础Input组件
   - [ ] 创建Settings表单UI
   - [ ] 实现主题切换功能

4. **测试验证**
   - [ ] 测试设置保存和读取
   - [ ] 测试数据持久化
   - [ ] 测试UI交互

**验收标准**：
- ✅ 可以保存和读取设置
- ✅ 设置数据持久化到数据库
- ✅ UI可以正常显示和修改设置
- ✅ 主题切换功能正常

**验证机制**：

1. **后端功能验证**：
```typescript
// tests/stage2-settings-backend.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SettingsService } from '@/main/modules/settings/settings.service';
import { SettingsRepository } from '@/main/modules/settings/settings.repository';
import { getMainDatabase } from '@/main/infrastructure/database/sqlite-manager';

describe('Settings后端验证', () => {
  let service: SettingsService;

  beforeEach(() => {
    service = new SettingsService();
  });

  it('应该可以获取默认设置', () => {
    const settings = service.getSettings();
    expect(settings).toBeDefined();
    expect(settings.theme).toBeDefined();
    expect(settings.showWindowOnStartup).toBeDefined();
  });

  it('应该可以保存设置', () => {
    const newSettings = {
      theme: 'dark' as const,
      showWindowOnStartup: false,
      language: 'zh',
    };
    
    const saved = service.saveSettings(newSettings);
    expect(saved.theme).toBe('dark');
    expect(saved.showWindowOnStartup).toBe(false);
  });

  it('应该可以持久化设置', () => {
    const newSettings = {
      theme: 'light' as const,
      showWindowOnStartup: true,
      language: 'en',
    };
    
    service.saveSettings(newSettings);
    const retrieved = service.getSettings();
    
    expect(retrieved.theme).toBe('light');
    expect(retrieved.showWindowOnStartup).toBe(true);
  });
});
```

2. **IPC通信验证**：
```typescript
// tests/stage2-settings-ipc.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { ipcMain } from 'electron';
import { setupSettingsHandlers } from '@/main/modules/settings/settings.ipc';

describe('Settings IPC验证', () => {
  beforeEach(() => {
    ipcMain.removeAllListeners();
    setupSettingsHandlers();
  });

  it('应该可以调用settings:get', async () => {
    const handler = ipcMain.listeners('settings:get')[0] as any;
    const result = await new Promise((resolve) => {
      handler(null, null, resolve);
    });
    
    expect(result).toBeDefined();
    expect(result.theme).toBeDefined();
  });

  it('应该可以调用settings:save', async () => {
    const handler = ipcMain.listeners('settings:save')[0] as any;
    const newSettings = {
      theme: 'dark' as const,
      showWindowOnStartup: false,
      language: 'zh',
    };
    
    const result = await new Promise((resolve) => {
      handler(null, newSettings, resolve);
    });
    
    expect(result).toBeDefined();
    expect(result.theme).toBe('dark');
  });
});
```

3. **前端功能验证**：
```typescript
// tests/stage2-settings-frontend.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useSettingsStore } from '@/renderer/stores/settings';

// Mock Platform API
const mockPlatformAPI = {
  settings: {
    get: async () => ({
      theme: 'system',
      showWindowOnStartup: true,
      language: 'en',
    }),
    save: async (settings: any) => settings,
  },
};

describe('Settings前端验证', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // 注入mock API
  });

  it('Store应该可以获取设置', async () => {
    const store = useSettingsStore();
    await store.fetchSettings();
    
    expect(store.settings).toBeDefined();
    expect(store.settings.theme).toBe('system');
  });

  it('Store应该可以保存设置', async () => {
    const store = useSettingsStore();
    const newSettings = {
      theme: 'dark' as const,
      showWindowOnStartup: false,
      language: 'zh',
    };
    
    await store.saveSettings(newSettings);
    expect(store.settings.theme).toBe('dark');
  });
});
```

4. **E2E验证**：
```typescript
// tests/e2e/stage2-settings.e2e.test.ts
import { test, expect } from '@playwright/test';
import { launchElectronApp } from '../fixtures/electron-app';

test.describe('Settings E2E验证', () => {
  test('应该可以打开设置页面', async () => {
    const app = await launchElectronApp();
    const page = await app.firstWindow();
    
    // 导航到设置页面
    await page.goto('/settings');
    
    // 检查设置页面元素
    await expect(page.locator('h1')).toContainText('Settings');
    await expect(page.locator('select[name="theme"]')).toBeVisible();
  });

  test('应该可以修改并保存设置', async () => {
    const app = await launchElectronApp();
    const page = await app.firstWindow();
    
    await page.goto('/settings');
    
    // 修改主题
    await page.selectOption('select[name="theme"]', 'dark');
    
    // 等待保存（如果有保存按钮）
    await page.waitForTimeout(500);
    
    // 刷新页面验证持久化
    await page.reload();
    const themeValue = await page.locator('select[name="theme"]').inputValue();
    expect(themeValue).toBe('dark');
  });
});
```

5. **手动验证清单**：
- [ ] 打开应用，导航到设置页面
- [ ] 修改主题设置，刷新页面验证是否保存
- [ ] 修改"启动时显示窗口"设置，重启应用验证
- [ ] 检查数据库文件，确认设置已保存
- [ ] 检查控制台无错误
- [ ] 测试所有设置项

6. **验证脚本**：
```bash
#!/bin/bash
# scripts/verify-stage2.sh

echo "验证阶段2：Settings功能"

# 运行后端测试
echo "1. 运行后端测试..."
pnpm test tests/stage2-settings-backend.test.ts || exit 1

# 运行IPC测试
echo "2. 运行IPC测试..."
pnpm test tests/stage2-settings-ipc.test.ts || exit 1

# 运行前端测试
echo "3. 运行前端测试..."
pnpm test tests/stage2-settings-frontend.test.ts || exit 1

# 运行E2E测试
echo "4. 运行E2E测试..."
pnpm test:e2e tests/e2e/stage2-settings.e2e.test.ts || exit 1

echo "🎉 阶段2验证通过！"
```

**可交付成果**：
- 完整的Settings功能
- 验证架构流程正确
- 完整的测试套件

---

### 阶段3：核心MCP功能

**目标**：实现MCP服务器管理、HTTP服务器、聚合器等核心功能

**时间估算**：3-5天

**前置条件**：阶段2完成

**任务清单**：

#### 3.1 MCP Server Manager（2天）

1. **服务器管理**
   - [ ] 创建ServerRepository
   - [ ] 创建ServerService
   - [ ] 实现服务器CRUD操作
   - [ ] 实现服务器启用/禁用
   - [ ] 创建Server IPC Handlers

2. **MCP客户端连接**
   - [ ] 集成@modelcontextprotocol/sdk
   - [ ] 实现stdio传输
   - [ ] 实现HTTP传输
   - [ ] 实现SSE传输
   - [ ] 实现连接状态管理

3. **工具管理**
   - [ ] 实现工具列表获取
   - [ ] 实现工具启用/禁用
   - [ ] 实现工具权限管理

#### 3.2 MCP HTTP服务器（1天）

1. **HTTP服务器**
   - [ ] 创建Express服务器
   - [ ] 实现MCP请求路由
   - [ ] 实现Token认证
   - [ ] 实现项目过滤
   - [ ] 实现CORS配置

2. **请求处理**
   - [ ] 实现请求日志记录
   - [ ] 实现错误处理
   - [ ] 实现请求转发

#### 3.3 Aggregator Server（1天）

1. **聚合逻辑**
   - [ ] 实现工具聚合
   - [ ] 实现资源聚合
   - [ ] 实现提示词聚合
   - [ ] 实现请求分发

2. **请求处理**
   - [ ] 实现ListTools聚合
   - [ ] 实现CallTool分发
   - [ ] 实现ListResources聚合

#### 3.4 前端UI（1天）

1. **服务器管理UI**
   - [ ] 创建ServerList组件
   - [ ] 创建ServerCard组件
   - [ ] 创建ServerForm组件
   - [ ] 创建ToolToggle组件
   - [ ] 实现服务器状态显示

2. **服务器Store**
   - [ ] 创建ServerStore
   - [ ] 实现服务器列表获取
   - [ ] 实现服务器操作

**验收标准**：
- ✅ 可以添加、编辑、删除服务器
- ✅ 可以启用/禁用服务器
- ✅ 服务器可以连接到MCP服务器
- ✅ HTTP服务器可以接收请求
- ✅ 聚合器可以聚合多个服务器
- ✅ UI可以显示服务器状态

**验证机制**：

1. **服务器管理验证**：
```typescript
// tests/stage3-server-management.test.ts
import { describe, it, expect } from 'vitest';
import { ServerService } from '@/main/modules/mcp-server-manager/server.service';

describe('服务器管理验证', () => {
  it('应该可以创建服务器', async () => {
    const service = new ServerService();
    const server = await service.createServer({
      name: 'Test Server',
      config: {
        id: 'test-1',
        name: 'Test Server',
        transport: 'stdio',
        command: 'echo',
        args: ['hello'],
      },
    });
    
    expect(server).toBeDefined();
    expect(server.name).toBe('Test Server');
  });

  it('应该可以启用/禁用服务器', async () => {
    const service = new ServerService();
    const server = await service.createServer({ /* ... */ });
    
    await service.toggleServer(server.id, true);
    const enabled = await service.getServerById(server.id);
    expect(enabled?.enabled).toBe(true);
    
    await service.toggleServer(server.id, false);
    const disabled = await service.getServerById(server.id);
    expect(disabled?.enabled).toBe(false);
  });
});
```

2. **MCP连接验证**：
```typescript
// tests/stage3-mcp-connection.test.ts
import { describe, it, expect } from 'vitest';
import { MCPServerManager } from '@/main/modules/mcp-server-manager/mcp-server-manager';

describe('MCP连接验证', () => {
  it('应该可以连接到stdio MCP服务器', async () => {
    const manager = new MCPServerManager();
    const serverId = await manager.addServer({
      name: 'Test Server',
      config: {
        transport: 'stdio',
        command: 'echo',
        args: ['test'],
      },
    });
    
    await manager.startServer(serverId);
    const status = await manager.getServerStatus(serverId);
    
    expect(status.connected).toBe(true);
  });
});
```

3. **HTTP服务器验证**：
```typescript
// tests/stage3-http-server.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fetch from 'node-fetch';

describe('HTTP服务器验证', () => {
  const baseUrl = 'http://localhost:3282';
  
  beforeAll(async () => {
    // 启动HTTP服务器
  });
  
  afterAll(async () => {
    // 停止HTTP服务器
  });

  it('应该可以接收MCP请求', async () => {
    const response = await fetch(`${baseUrl}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list',
        params: {},
      }),
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.jsonrpc).toBe('2.0');
  });
});
```

4. **聚合器验证**：
```typescript
// tests/stage3-aggregator.test.ts
import { describe, it, expect } from 'vitest';
import { MCPAggregator } from '@/main/modules/mcp-server-runtime/aggregator-server';

describe('聚合器验证', () => {
  it('应该可以聚合多个服务器的工具', async () => {
    const aggregator = new MCPAggregator();
    
    // 添加多个服务器
    await aggregator.addServer('server1', mockServer1);
    await aggregator.addServer('server2', mockServer2);
    
    // 获取聚合的工具列表
    const tools = await aggregator.listTools();
    
    expect(tools.length).toBeGreaterThan(0);
    // 验证工具来自不同服务器
  });
});
```

5. **UI验证**：
```typescript
// tests/e2e/stage3-server-ui.e2e.test.ts
import { test, expect } from '@playwright/test';

test.describe('服务器管理UI验证', () => {
  test('应该可以显示服务器列表', async () => {
    const app = await launchElectronApp();
    const page = await app.firstWindow();
    
    await page.goto('/servers');
    await expect(page.locator('[data-testid="server-list"]')).toBeVisible();
  });

  test('应该可以添加服务器', async () => {
    const app = await launchElectronApp();
    const page = await app.firstWindow();
    
    await page.goto('/servers');
    await page.click('[data-testid="add-server-button"]');
    await page.fill('[name="server-name"]', 'Test Server');
    await page.click('[data-testid="save-button"]');
    
    await expect(page.locator('text=Test Server')).toBeVisible();
  });
});
```

6. **集成验证脚本**：
```bash
#!/bin/bash
# scripts/verify-stage3.sh

echo "验证阶段3：核心MCP功能"

# 1. 后端功能测试
echo "1. 测试服务器管理..."
pnpm test tests/stage3-server-management.test.ts || exit 1

# 2. MCP连接测试
echo "2. 测试MCP连接..."
pnpm test tests/stage3-mcp-connection.test.ts || exit 1

# 3. HTTP服务器测试
echo "3. 测试HTTP服务器..."
pnpm test tests/stage3-http-server.test.ts || exit 1

# 4. 聚合器测试
echo "4. 测试聚合器..."
pnpm test tests/stage3-aggregator.test.ts || exit 1

# 5. UI测试
echo "5. 测试UI..."
pnpm test:e2e tests/e2e/stage3-server-ui.e2e.test.ts || exit 1

# 6. 手动验证提示
echo ""
echo "请手动验证："
echo "- 打开应用，添加一个MCP服务器"
echo "- 启用服务器，检查连接状态"
echo "- 使用curl测试HTTP服务器："
echo "  curl -X POST http://localhost:3282/mcp \\"
echo "    -H 'Content-Type: application/json' \\"
echo "    -H 'Authorization: Bearer YOUR_TOKEN' \\"
echo "    -d '{\"jsonrpc\":\"2.0\",\"method\":\"tools/list\",\"id\":1}'"

echo "🎉 阶段3验证通过！"
```

**可交付成果**：
- 完整的MCP服务器管理功能
- 可用的HTTP服务器
- 可用的聚合器
- 完整的测试套件

---

### 阶段4：工作区与项目管理

**目标**：实现工作区和项目管理系统

**时间估算**：2-3天

**前置条件**：阶段3完成

**任务清单**：

#### 4.1 工作区系统（1.5天）

1. **后端实现**
   - [ ] 创建WorkspaceRepository
   - [ ] 创建WorkspaceService
   - [ ] 实现工作区CRUD
   - [ ] 实现工作区切换
   - [ ] 实现数据库上下文切换
   - [ ] 创建Workspace IPC Handlers

2. **前端实现**
   - [ ] 创建WorkspaceStore
   - [ ] 实现Workspace Platform API
   - [ ] 创建工作区管理UI
   - [ ] 实现工作区切换功能

#### 4.2 项目系统（1.5天）

1. **后端实现**
   - [ ] 创建ProjectRepository
   - [ ] 创建ProjectService
   - [ ] 实现项目CRUD
   - [ ] 实现服务器-项目关联
   - [ ] 创建Project IPC Handlers

2. **前端实现**
   - [ ] 创建ProjectStore
   - [ ] 实现Project Platform API
   - [ ] 创建项目管理UI
   - [ ] 实现项目-服务器关联UI

**验收标准**：
- ✅ 可以创建和管理工作区
- ✅ 可以切换工作区
- ✅ 工作区数据隔离正确
- ✅ 可以创建和管理项目
- ✅ 可以将服务器添加到项目
- ✅ 项目过滤功能正常

**验证机制**：

1. **工作区隔离验证**：
```typescript
// tests/stage4-workspace-isolation.test.ts
import { describe, it, expect } from 'vitest';
import { WorkspaceService } from '@/main/modules/workspace/workspace.service';

describe('工作区隔离验证', () => {
  it('切换工作区后数据应该隔离', async () => {
    const service = new WorkspaceService();
    
    // 创建工作区1
    const ws1 = await service.createWorkspace({ name: 'Workspace 1', type: 'local' });
    await service.switchWorkspace(ws1.id);
    await service.createServer({ name: 'Server 1', /* ... */ });
    
    // 创建工作区2
    const ws2 = await service.createWorkspace({ name: 'Workspace 2', type: 'local' });
    await service.switchWorkspace(ws2.id);
    
    // 工作区2应该没有工作区1的服务器
    const servers = await service.getAllServers();
    expect(servers.find(s => s.name === 'Server 1')).toBeUndefined();
  });
});
```

2. **项目功能验证**：
```typescript
// tests/stage4-project.test.ts
import { describe, it, expect } from 'vitest';
import { ProjectService } from '@/main/modules/project/project.service';

describe('项目管理验证', () => {
  it('应该可以将服务器添加到项目', async () => {
    const projectService = new ProjectService();
    const serverService = new ServerService();
    
    const project = await projectService.createProject({ name: 'Test Project' });
    const server = await serverService.createServer({ /* ... */ });
    
    await projectService.addServerToProject(project.id, server.id);
    const projectServers = await projectService.getProjectServers(project.id);
    
    expect(projectServers).toContainEqual(expect.objectContaining({ id: server.id }));
  });
});
```

3. **E2E验证**：
```typescript
// tests/e2e/stage4-workspace-project.e2e.test.ts
test('应该可以切换工作区', async () => {
  const app = await launchElectronApp();
  const page = await app.firstWindow();
  
  await page.goto('/workspaces');
  await page.click('[data-testid="create-workspace"]');
  await page.fill('[name="workspace-name"]', 'New Workspace');
  await page.click('[data-testid="save"]');
  
  await page.click('[data-testid="switch-workspace"]');
  await expect(page.locator('text=New Workspace')).toBeVisible();
});
```

4. **验证脚本**：
```bash
#!/bin/bash
# scripts/verify-stage4.sh
echo "验证阶段4：工作区与项目管理"
pnpm test tests/stage4-*.test.ts || exit 1
pnpm test:e2e tests/e2e/stage4-*.e2e.test.ts || exit 1
echo "🎉 阶段4验证通过！"
```

**可交付成果**：
- 完整的工作区管理功能
- 完整的项目管理功能
- 完整的测试套件

---

### 阶段5：UI完善

**目标**：完善用户界面，提升用户体验

**时间估算**：2-3天

**前置条件**：阶段4完成

**任务清单**：

1. **布局组件**
   - [ ] 创建Sidebar组件
   - [ ] 创建Header组件
   - [ ] 创建MainLayout组件
   - [ ] 实现响应式布局

2. **通用组件**
   - [ ] 创建Card组件
   - [ ] 创建Dialog组件
   - [ ] 创建Toast组件
   - [ ] 创建Loading组件
   - [ ] 创建EmptyState组件

3. **日志查看UI**
   - [ ] 创建LogViewer组件
   - [ ] 创建LogItem组件
   - [ ] 创建LogFilter组件
   - [ ] 实现日志文件读取
   - [ ] 实现日志搜索和过滤

4. **主题系统**
   - [ ] 实现深色/浅色主题
   - [ ] 实现主题切换动画
   - [ ] 实现系统主题跟随

5. **交互优化**
   - [ ] 添加加载状态
   - [ ] 添加错误提示
   - [ ] 添加成功反馈
   - [ ] 优化动画效果

**验收标准**：
- ✅ UI美观且易用
- ✅ 所有功能都有对应的UI
- ✅ 交互流畅
- ✅ 主题切换正常
- ✅ 错误提示友好

**验证机制**：

1. **组件渲染验证**：
```typescript
// tests/stage5-ui-components.test.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '@/renderer/components/common/Button.vue';

describe('UI组件验证', () => {
  it('Button组件应该可以渲染', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click Me' },
    });
    expect(wrapper.text()).toContain('Click Me');
  });
});
```

2. **主题切换验证**：
```typescript
// tests/stage5-theme.test.ts
import { describe, it, expect } from 'vitest';
import { useSettingsStore } from '@/renderer/stores/settings';

describe('主题切换验证', () => {
  it('应该可以切换主题', async () => {
    const store = useSettingsStore();
    await store.saveSettings({ ...store.settings, theme: 'dark' });
    expect(store.settings.theme).toBe('dark');
    
    // 验证DOM类名变化
    const html = document.documentElement;
    expect(html.classList.contains('dark')).toBe(true);
  });
});
```

3. **可访问性验证**：
```typescript
// tests/stage5-accessibility.test.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '@/renderer/components/common/Button.vue';

describe('可访问性验证', () => {
  it('按钮应该有关键属性', () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
    });
    const button = wrapper.find('button');
    expect(button.attributes('disabled')).toBeDefined();
  });
});
```

4. **E2E UI验证**：
```typescript
// tests/e2e/stage5-ui.e2e.test.ts
test('应该可以切换主题', async () => {
  const app = await launchElectronApp();
  const page = await app.firstWindow();
  
  await page.goto('/settings');
  await page.selectOption('select[name="theme"]', 'dark');
  await page.waitForTimeout(500);
  
  const bodyClass = await page.locator('body').getAttribute('class');
  expect(bodyClass).toContain('dark');
});
```

5. **性能验证**：
```typescript
// tests/stage5-performance.test.ts
import { describe, it, expect } from 'vitest';

describe('UI性能验证', () => {
  it('大量数据渲染应该在合理时间内', async () => {
    const start = performance.now();
    // 渲染1000个列表项
    // ...
    const end = performance.now();
    expect(end - start).toBeLessThan(1000); // 应该在1秒内
  });
});
```

6. **验证脚本**：
```bash
#!/bin/bash
# scripts/verify-stage5.sh
echo "验证阶段5：UI完善"
pnpm test tests/stage5-*.test.ts || exit 1
pnpm test:e2e tests/e2e/stage5-*.e2e.test.ts || exit 1
echo "🎉 阶段5验证通过！"
```

**可交付成果**：
- 完整的用户界面
- 良好的用户体验
- 完整的测试套件

---

### 阶段6：高级功能

**目标**：实现工作流、Hook、CLI等高级功能

**时间估算**：3-5天

**前置条件**：阶段5完成

**任务清单**：

#### 6.1 工作流系统（2天）

1. **后端实现**
   - [ ] 创建WorkflowRepository
   - [ ] 创建WorkflowService
   - [ ] 实现工作流CRUD
   - [ ] 实现工作流执行引擎
   - [ ] 创建Workflow IPC Handlers

2. **Hook系统**
   - [ ] 创建HookModuleRepository
   - [ ] 创建HookService
   - [ ] 实现JavaScript沙箱执行
   - [ ] 实现Hook执行逻辑

3. **前端实现**
   - [ ] 集成可视化编辑器（Vue Flow）
   - [ ] 创建工作流编辑器UI
   - [ ] 创建Hook编辑器UI
   - [ ] 实现工作流可视化

#### 6.2 CLI工具（1天）

1. **Connect命令**
   - [ ] 实现stdio到HTTP桥接
   - [ ] 实现Token认证
   - [ ] 实现项目过滤

2. **Serve命令**
   - [ ] 实现HTTP服务器
   - [ ] 实现MCP服务器聚合
   - [ ] 实现请求转发

#### 6.3 日志文件系统（1天）

1. **日志写入**
   - [ ] 实现JSONL格式写入
   - [ ] 实现按日期分割
   - [ ] 实现追加写入

2. **日志读取**
   - [ ] 实现日志文件读取
   - [ ] 实现日志查询
   - [ ] 实现日志过滤

3. **日志清理**
   - [ ] 实现自动清理（保留3天）
   - [ ] 实现手动清理

#### 6.4 其他功能（1天）

1. **Token管理**
   - [ ] 实现Token生成
   - [ ] 实现Token验证
   - [ ] 实现Token管理UI

2. **应用管理**
   - [ ] 实现MCP App管理
   - [ ] 实现服务器访问控制

**验收标准**：
- ✅ 可以创建和执行工作流
- ✅ Hook系统可以执行自定义逻辑
- ✅ CLI工具可以正常使用
- ✅ 日志系统正常工作
- ✅ Token管理功能正常

**验证机制**：

1. **工作流执行验证**：
```typescript
// tests/stage6-workflow.test.ts
import { describe, it, expect } from 'vitest';
import { WorkflowService } from '@/main/modules/workflow/workflow.service';

describe('工作流验证', () => {
  it('应该可以执行工作流', async () => {
    const service = new WorkflowService();
    const workflow = await service.createWorkflow({
      name: 'Test Workflow',
      workflowType: 'tools/list',
      nodes: [/* ... */],
      edges: [/* ... */],
    });
    
    const result = await service.executeWorkflow(workflow.id, {});
    expect(result).toBeDefined();
  });
});
```

2. **Hook执行验证**：
```typescript
// tests/stage6-hook.test.ts
import { describe, it, expect } from 'vitest';
import { HookService } from '@/main/modules/workflow/hook.service';

describe('Hook验证', () => {
  it('应该可以在沙箱中执行Hook', async () => {
    const service = new HookService();
    const hook = await service.createHook({
      name: 'Test Hook',
      script: 'return { ...context, modified: true };',
    });
    
    const result = await service.executeHook(hook.id, { test: 'data' });
    expect(result.modified).toBe(true);
  });
});
```

3. **CLI工具验证**：
```typescript
// tests/stage6-cli.test.ts
import { describe, it, expect } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('CLI工具验证', () => {
  it('connect命令应该可以运行', async () => {
    const { stdout } = await execAsync('mcpr connect --help');
    expect(stdout).toContain('connect');
  });
  
  it('serve命令应该可以启动服务器', async () => {
    // 启动serve命令并测试
  });
});
```

4. **日志系统验证**：
```typescript
// tests/stage6-logs.test.ts
import { describe, it, expect } from 'vitest';
import { LogService } from '@/main/modules/log/log.service';
import { readFileSync, existsSync } from 'fs';

describe('日志系统验证', () => {
  it('应该可以写入日志文件', async () => {
    const service = new LogService();
    await service.writeLog({
      id: '1',
      timestamp: Date.now(),
      clientId: 'test',
      /* ... */
    });
    
    const logFile = service.getLogFilePath(new Date());
    expect(existsSync(logFile)).toBe(true);
  });
  
  it('应该可以读取日志', async () => {
    const service = new LogService();
    const logs = await service.getLogs({
      startDate: new Date(Date.now() - 86400000),
      endDate: new Date(),
    });
    
    expect(Array.isArray(logs)).toBe(true);
  });
  
  it('应该自动清理旧日志', async () => {
    const service = new LogService();
    await service.cleanOldLogs(3); // 保留3天
    
    const oldLogFile = service.getLogFilePath(new Date(Date.now() - 4 * 86400000));
    expect(existsSync(oldLogFile)).toBe(false);
  });
});
```

5. **验证脚本**：
```bash
#!/bin/bash
# scripts/verify-stage6.sh
echo "验证阶段6：高级功能"
pnpm test tests/stage6-*.test.ts || exit 1
pnpm test:e2e tests/e2e/stage6-*.e2e.test.ts || exit 1
echo "🎉 阶段6验证通过！"
```

**可交付成果**：
- 完整的工作流系统
- 可用的CLI工具
- 完整的日志系统
- 完整的测试套件

---

### 阶段7：优化与完善

**目标**：性能优化、错误处理、测试、文档

**时间估算**：2-3天

**前置条件**：阶段6完成

**任务清单**：

1. **性能优化**
   - [ ] 优化数据库查询（添加索引）
   - [ ] 优化Vue组件渲染
   - [ ] 优化IPC调用频率
   - [ ] 优化内存使用

2. **错误处理**
   - [ ] 完善错误处理机制
   - [ ] 添加错误日志
   - [ ] 改进错误提示
   - [ ] 实现错误恢复

3. **测试**
   - [ ] 编写单元测试
   - [ ] 编写集成测试
   - [ ] 编写E2E测试
   - [ ] 测试覆盖率 > 60%

4. **文档**
   - [ ] 更新README
   - [ ] 编写用户文档
   - [ ] 编写API文档
   - [ ] 更新开发文档

5. **打包发布**
   - [ ] 配置代码签名
   - [ ] 配置自动更新
   - [ ] 测试打包流程
   - [ ] 准备发布

**验收标准**：
- ✅ 应用性能良好
- ✅ 错误处理完善
- ✅ 测试覆盖充分
- ✅ 文档完整
- ✅ 可以成功打包

**验证机制**：

1. **性能验证**：
```typescript
// tests/stage7-performance.test.ts
import { describe, it, expect } from 'vitest';

describe('性能验证', () => {
  it('数据库查询应该在100ms内', async () => {
    const start = performance.now();
    await service.getAllServers();
    const end = performance.now();
    expect(end - start).toBeLessThan(100);
  });
  
  it('IPC调用应该在50ms内', async () => {
    const start = performance.now();
    await ipcRenderer.invoke('servers:list');
    const end = performance.now();
    expect(end - start).toBeLessThan(50);
  });
});
```

2. **错误处理验证**：
```typescript
// tests/stage7-error-handling.test.ts
import { describe, it, expect } from 'vitest';

describe('错误处理验证', () => {
  it('应该正确处理数据库错误', async () => {
    // 模拟数据库错误
    await expect(service.getServerById('invalid-id')).rejects.toThrow();
  });
  
  it('应该返回用户友好的错误消息', async () => {
    try {
      await service.getServerById('invalid-id');
    } catch (error) {
      expect(error.message).not.toContain('SQL');
      expect(error.message).toContain('not found');
    }
  });
});
```

3. **测试覆盖率验证**：
```bash
#!/bin/bash
# scripts/verify-stage7-coverage.sh
echo "检查测试覆盖率..."
pnpm test:coverage

COVERAGE=$(pnpm test:coverage | grep -oP 'All files\s+\|\s+\K\d+\.\d+')
THRESHOLD=60

if (( $(echo "$COVERAGE < $THRESHOLD" | bc -l) )); then
  echo "❌ 测试覆盖率 $COVERAGE% 低于阈值 $THRESHOLD%"
  exit 1
fi

echo "✅ 测试覆盖率 $COVERAGE% 达到要求"
```

4. **打包验证**：
```bash
#!/bin/bash
# scripts/verify-stage7-build.sh
echo "验证打包..."

# 构建
pnpm build || exit 1

# 打包
pnpm package || exit 1

# 检查输出文件
if [ ! -f "apps/electron/out/make/*.dmg" ] && [ ! -f "apps/electron/out/make/*.exe" ]; then
  echo "❌ 打包文件不存在"
  exit 1
fi

echo "✅ 打包成功"
```

5. **完整回归测试**：
```bash
#!/bin/bash
# scripts/verify-all-stages.sh
echo "运行完整回归测试..."

# 运行所有阶段的测试
for stage in 0 1 2 3 4 5 6 7; do
  echo "验证阶段 $stage..."
  ./scripts/verify-stage${stage}.sh || exit 1
done

echo "🎉 所有阶段验证通过！"
```

6. **验证脚本**：
```bash
#!/bin/bash
# scripts/verify-stage7.sh
echo "验证阶段7：优化与完善"

# 性能测试
echo "1. 性能测试..."
pnpm test tests/stage7-performance.test.ts || exit 1

# 错误处理测试
echo "2. 错误处理测试..."
pnpm test tests/stage7-error-handling.test.ts || exit 1

# 测试覆盖率
echo "3. 测试覆盖率..."
./scripts/verify-stage7-coverage.sh || exit 1

# 打包验证
echo "4. 打包验证..."
./scripts/verify-stage7-build.sh || exit 1

# 完整回归测试
echo "5. 完整回归测试..."
./scripts/verify-all-stages.sh || exit 1

echo "🎉 阶段7验证通过！"
```

**可交付成果**：
- 优化后的应用
- 完整的测试套件（覆盖率>60%）
- 完整的文档
- 可发布的安装包

---

### 分段实现检查清单

**每个阶段完成后检查**：

- [ ] 所有任务清单已完成
- [ ] 验收标准已通过
- [ ] 代码已提交到Git
- [ ] 文档已更新
- [ ] 无严重Bug
- [ ] 可以进入下一阶段

**阶段间依赖关系**：

```
阶段0 → 阶段1 → 阶段2 → 阶段3 → 阶段4 → 阶段5 → 阶段6 → 阶段7
  ↓       ↓       ↓       ↓       ↓       ↓       ↓       ↓
骨架    基础    验证    核心    组织    UI    高级    完善
```

**建议的工作流程**：

1. **按阶段顺序实现**：不要跳过阶段
2. **完成一个阶段再开始下一个**：确保基础稳固
3. **每个阶段都要测试**：确保功能正常
4. **及时提交代码**：每个阶段完成后提交
5. **记录问题和解决方案**：便于后续参考

**时间管理建议**：

- **每天专注一个阶段**：避免同时进行多个阶段
- **设置里程碑**：每个阶段都是里程碑
- **定期回顾**：检查进度和问题
- **灵活调整**：根据实际情况调整计划

### 验证机制使用指南

#### 何时运行验证

**每个阶段完成后必须运行**：
1. 完成所有任务清单
2. 运行验证脚本：`./scripts/verify-stage{N}.sh`
3. 检查所有测试通过
4. 手动验证关键功能
5. 确认无回归问题

**开发过程中建议运行**：
- 实现新功能后立即运行相关测试
- 修改代码后运行类型检查和代码检查
- 提交代码前运行完整验证

#### 验证脚本组织

**目录结构**：
```
scripts/
├── verify-stage0.sh      # 阶段0验证
├── verify-stage1.sh      # 阶段1验证
├── verify-stage2.sh      # 阶段2验证
├── verify-stage3.sh      # 阶段3验证
├── verify-stage4.sh      # 阶段4验证
├── verify-stage5.sh      # 阶段5验证
├── verify-stage6.sh      # 阶段6验证
├── verify-stage7.sh      # 阶段7验证
├── verify-all-stages.sh  # 完整回归测试
└── verify-stage.sh       # 通用验证脚本模板

tests/
├── stage0-verification.test.ts
├── stage1-*.test.ts
├── stage2-*.test.ts
├── stage3-*.test.ts
├── stage4-*.test.ts
├── stage5-*.test.ts
├── stage6-*.test.ts
├── stage7-*.test.ts
└── e2e/
    ├── stage2-*.e2e.test.ts
    ├── stage3-*.e2e.test.ts
    └── ...
```

#### 验证失败处理

**当验证失败时**：

1. **分析失败原因**：
   - 查看测试输出
   - 检查错误日志
   - 定位问题代码

2. **修复问题**：
   - 修复代码错误
   - 更新测试用例（如果测试有误）
   - 重新运行验证

3. **记录问题**：
   - 记录问题和解决方案
   - 更新文档（如有必要）

4. **不要跳过验证**：
   - ❌ 不要因为验证失败就跳过
   - ✅ 必须修复所有问题才能进入下一阶段

#### 验证最佳实践

1. **测试驱动开发**：
   - 先写测试，再写实现
   - 确保测试覆盖关键路径

2. **持续验证**：
   - 频繁运行测试
   - 使用watch模式：`pnpm test --watch`

3. **自动化验证**：
   - 使用CI/CD自动运行验证
   - 提交前自动运行验证脚本

4. **文档化验证**：
   - 记录验证步骤
   - 记录已知问题
   - 更新验证清单

#### 验证检查表模板

**每个阶段完成后填写**：

```
阶段 {N} 验证报告
日期：{date}
验证人：{name}

功能验证：
- [ ] 所有任务完成
- [ ] 验收标准通过
- [ ] 手动测试通过

代码质量：
- [ ] 类型检查通过
- [ ] 代码检查通过
- [ ] 构建成功

测试覆盖：
- [ ] 单元测试通过
- [ ] 集成测试通过
- [ ] E2E测试通过
- [ ] 测试覆盖率 > 60%

回归测试：
- [ ] 之前阶段功能正常
- [ ] 无功能回退

问题记录：
- 问题1：{description} - 已解决/待解决
- 问题2：{description} - 已解决/待解决

结论：
- [ ] 可以进入下一阶段
- [ ] 需要修复问题后再继续
```

#### 快速验证命令

**添加到package.json**：
```json
{
  "scripts": {
    "verify:stage0": "./scripts/verify-stage0.sh",
    "verify:stage1": "./scripts/verify-stage1.sh",
    "verify:stage2": "./scripts/verify-stage2.sh",
    "verify:stage3": "./scripts/verify-stage3.sh",
    "verify:stage4": "./scripts/verify-stage4.sh",
    "verify:stage5": "./scripts/verify-stage5.sh",
    "verify:stage6": "./scripts/verify-stage6.sh",
    "verify:stage7": "./scripts/verify-stage7.sh",
    "verify:all": "./scripts/verify-all-stages.sh"
  }
}
```

**使用方式**：
```bash
# 验证特定阶段
pnpm verify:stage2

# 验证所有阶段（回归测试）
pnpm verify:all
```

---

## 从零开始创建项目

> **重要**：本章节提供从零开始创建MCP Router应用的完整步骤。如果已有代码库，可跳过此章节。

### 步骤1：初始化Monorepo项目

#### 1.1 创建项目根目录

```bash
mkdir mcp-router
cd mcp-router
git init
```

#### 1.2 创建根package.json

```json
{
  "name": "mcp-router",
  "version": "0.6.1",
  "private": true,
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@10.22.0",
  "scripts": {
    "dev": "turbo run dev --filter=@mcp_router/shared --filter=@mcp_router/ui --filter=@mcp_router/electron",
    "build": "turbo run build",
    "publish": "turbo run publish --filter=@mcp_router/electron",
    "make": "turbo run make",
    "make:x64": "turbo run make:x64 --filter=@mcp_router/electron",
    "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx,.mjs,.cjs --fix",
    "typecheck": "turbo run typecheck",
    "knip": "knip",
    "test:e2e": "pnpm --filter @mcp_router/electron run test:e2e",
    "postinstall": "electron-rebuild"
  },
  "devDependencies": {
    "@electron/rebuild": "^4.0.1",
    "@eslint/js": "^9.35.0",
    "@types/node": "^22.18.5",
    "@typescript-eslint/eslint-plugin": "^8.44.0",
    "@typescript-eslint/parser": "^8.44.0",
    "eslint": "^9.35.0",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-prettier": "^5.5.4",
    "globals": "^16.4.0",
    "knip": "^5.63.1",
    "prettier": "^3.6.2",
    "turbo": "^2.5.6",
    "typescript": "^5.9.2"
  },
  "pnpm": {
    "overrides": {
      "webpack-dev-server": "^5.2.1",
      "electron@>=36.0.0-alpha.1 <36.8.1": ">=36.8.1"
    },
    "onlyBuiltDependencies": [
      "better-sqlite3",
      "core-js",
      "electron",
      "electron-winstaller",
      "esbuild",
      "fs-xattr",
      "macos-alias"
    ]
  }
}
```

#### 1.3 创建pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

#### 1.4 创建turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"],
      "cache": true
    },
    "dev": {
      "persistent": true,
      "cache": false,
      "dependsOn": ["@mcp_router/remote-api-types#build"]
    },
    "lint": {
      "dependsOn": ["^lint"],
      "cache": true
    },
    "format": {
      "cache": false
    },
    "format:check": {
      "cache": true
    },
    "typecheck": {
      "dependsOn": ["^build", "^typecheck"],
      "cache": true
    },
    "start": {
      "dependsOn": ["build"],
      "cache": false
    },
    "package*": {
      "dependsOn": ["build"],
      "cache": false
    },
    "make*": {
      "dependsOn": ["build"],
      "cache": false
    },
    "publish": {
      "dependsOn": ["build"],
      "cache": false
    },
    "knip": {
      "cache": true,
      "outputs": [],
      "inputs": [
        "src/**/*.{ts,tsx,js,jsx}",
        "*.config.{js,ts,mjs}",
        "package.json",
        "knip.json",
        "tsconfig.json"
      ],
      "dependsOn": ["^build"],
      "env": ["NODE_ENV"],
      "passThroughEnv": ["CI"]
    },
    "test:e2e": {
      "dependsOn": ["package"],
      "cache": false,
      "env": ["CI", "NODE_ENV"],
      "passThroughEnv": ["DISPLAY", "XAUTHORITY"]
    }
  }
}
```

#### 1.5 创建TypeScript根配置

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "exclude": ["node_modules", "dist", ".webpack", "out"]
}
```

#### 1.6 创建ESLint配置

```javascript
// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  }
);
```

#### 1.7 创建Prettier配置

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

#### 1.8 创建.gitignore

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Build outputs
/build/
/dist/
**/dist/
**/build/

# Electron
/apps/electron/out/
/apps/electron/dist/
.webpack/

# TypeScript
*.tsbuildinfo
tsconfig.tsbuildinfo

# Logs
*.log
pnpm-debug.log*

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Turbo
.turbo/

# Testing
coverage/
.nyc_output/
```

### 步骤2：创建共享包（packages）

#### 2.1 创建shared包

```bash
mkdir -p packages/shared/src/types
cd packages/shared
```

**package.json**：
```json
{
  "name": "@mcp_router/shared",
  "version": "0.6.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./types": "./src/types/index.ts"
  },
  "scripts": {
    "build": "tsc --build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --ext .ts"
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "^5.9.2"
  }
}
```

**tsconfig.json**：
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

**src/index.ts**（初始）：
```typescript
// Export all shared types
export * from './types';
```

**src/types/index.ts**（初始）：
```typescript
// Re-export all domain types
export * from './mcp-types';
export * from './workspace';
export * from './project-types';
export * from './workflow-types';
export * from './settings-types';
export * from './token-types';
export * from './log-types';
export * from './platform-api';
```

**创建基础类型文件**：

```typescript
// src/types/mcp-types.ts
export interface MCPServerConfig {
  id: string;
  name: string;
  transport: 'stdio' | 'http' | 'sse';
  command?: string;
  args?: string[];
  url?: string;
  env?: Record<string, string>;
}

export interface Server {
  id: string;
  name: string;
  config: MCPServerConfig;
  enabled: boolean;
  projectId?: string;
  workspaceId: string;
  createdAt: number;
  updatedAt: number;
}
```

```typescript
// src/types/workspace.ts
export interface Workspace {
  id: string;
  name: string;
  type: 'local' | 'remote';
  isActive: boolean;
  createdAt: Date;
  lastUsedAt: Date;
  localConfig?: {
    databasePath: string;
  };
  remoteConfig?: {
    apiUrl: string;
    authToken?: string;
  };
}
```

```typescript
// src/types/project-types.ts
export interface Project {
  id: string;
  name: string;
  workspaceId: string;
  serverIds: string[];
  createdAt: number;
  updatedAt: number;
}
```

```typescript
// src/types/log-types.ts
export interface RequestLogEntry {
  id: string;
  timestamp: number;
  clientId: string;
  clientName: string;
  serverId: string;
  serverName: string;
  requestType: string;
  requestParams: any;
  responseStatus: 'success' | 'error';
  responseData?: any;
  duration: number;
  errorMessage?: string;
}
```

```typescript
// src/types/settings-types.ts
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  showWindowOnStartup: boolean;
  language: string;
}
```

```typescript
// src/types/token-types.ts
export interface Token {
  id: string;
  name: string;
  token: string;
  serverAccess: TokenServerAccess;
  createdAt: number;
}

export interface TokenServerAccess {
  type: 'all' | 'selected';
  serverIds?: string[];
}
```

```typescript
// src/types/workflow-types.ts
export interface WorkflowNode {
  id: string;
  type: 'start' | 'end' | 'mcp-call' | 'hook';
  position: { x: number; y: number };
  data: any;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  workflowType: 'tools/list' | 'tools/call';
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface HookModule {
  id: string;
  name: string;
  description?: string;
  script: string;
}
```

**创建Platform API类型**：

```typescript
// src/types/platform-api/platform-api.ts
import { AuthAPI } from './domains/auth-api';
import { ServerAPI } from './domains/server-api';
import { AppAPI } from './domains/app-api';
import { PackageAPI } from './domains/package-api';
import { SettingsAPI } from './domains/settings-api';
import { LogAPI } from './domains/log-api';
import { WorkspaceAPI } from './domains/workspace-api';
import { WorkflowAPI } from './domains/workflow-api';
import { ProjectsAPI } from './domains/projects-api';

export interface PlatformAPI {
  auth: AuthAPI;
  servers: ServerAPI;
  apps: AppAPI;
  packages: PackageAPI;
  settings: SettingsAPI;
  logs: LogAPI;
  workspaces: WorkspaceAPI;
  workflows: WorkflowAPI;
  projects: ProjectsAPI;
}
```

```typescript
// src/types/platform-api/domains/server-api.ts
import { Server, MCPServerConfig } from '../../mcp-types';

export interface CreateServerInput {
  name: string;
  config: MCPServerConfig;
  dxtFile?: Uint8Array;
}

export interface ServerStatus {
  id: string;
  enabled: boolean;
  connected: boolean;
  tools: any[];
  error?: string;
}

export interface ServerAPI {
  list(): Promise<Server[]>;
  get(id: string): Promise<Server | null>;
  create(input: CreateServerInput): Promise<Server>;
  update(id: string, updates: Partial<Server>): Promise<Server | null>;
  delete(id: string): Promise<boolean>;
  toggle(id: string, enabled: boolean): Promise<boolean>;
  toggleTool(serverId: string, toolName: string, enabled: boolean): Promise<boolean>;
  getStatus(id: string): Promise<ServerStatus>;
  onStatusChange(callback: (status: ServerStatus) => void): () => void;
}
```

（其他领域API类似定义...）

#### 2.2 创建ui包

```bash
cd ../..
mkdir -p packages/ui/src/components packages/ui/src/lib
cd packages/ui
```

**package.json**：
```json
{
  "name": "@mcp_router/ui",
  "version": "0.6.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc --build",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "vue": "^3.5.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.6.0"
  },
  "devDependencies": {
    "@types/node": "^22.18.5",
    "typescript": "^5.9.2"
  }
}
```

**src/index.ts**（初始）：
```typescript
export * from './components';
```

#### 2.3 创建tailwind-config包

```bash
cd ../tailwind-config
```

**package.json**：
```json
{
  "name": "@mcp_router/tailwind-config",
  "version": "0.6.1",
  "private": true,
  "main": "./index.js",
  "scripts": {
    "build": "echo 'No build needed'"
  },
  "dependencies": {
    "tailwindcss": "^3.4.17"
  }
}
```

**tailwind.config.js**：
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '../../apps/electron/src/renderer/**/*.{vue,js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

#### 2.4 创建remote-api-types包

```bash
cd ../remote-api-types
```

**package.json**：
```json
{
  "name": "@mcp_router/remote-api-types",
  "version": "0.6.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc --build",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.9.2"
  }
}
```

### 步骤3：创建Electron应用

#### 3.1 创建应用目录结构

```bash
cd ../../apps
mkdir -p electron/src/{main,renderer,preload}
mkdir -p electron/src/main/{modules,infrastructure,ui,utils}
mkdir -p electron/src/renderer/{components,stores,composables,router,utils}
mkdir -p electron/public/images/icon
```

#### 3.2 创建Electron package.json

```json
{
  "name": "@mcp_router/electron",
  "productName": "MCP Router",
  "version": "0.6.1",
  "private": true,
  "main": ".webpack/main",
  "scripts": {
    "start": "electron-forge start",
    "dev": "electron-forge start --enable-logging",
    "package": "cross-env NODE_ENV=production electron-forge package",
    "package:x64": "cross-env NODE_ENV=production npm_config_target_arch=x64 electron-forge package",
    "make": "cross-env NODE_ENV=production electron-forge make",
    "make:x64": "cross-env NODE_ENV=production npm_config_target_arch=x64 electron-forge make",
    "build": "tsc --build",
    "typecheck": "tsc --noEmit",
    "lint": "eslint --ext .ts,.tsx ."
  },
  "dependencies": {
    "@mcp_router/remote-api-types": "workspace:*",
    "@mcp_router/shared": "workspace:*",
    "@mcp_router/tailwind-config": "workspace:*",
    "@mcp_router/ui": "workspace:*",
    "@modelcontextprotocol/sdk": "^1.18.0",
    "better-sqlite3": "^11.10.0",
    "cors": "^2.8.5",
    "electron-squirrel-startup": "^1.0.1",
    "express": "^5.1.0",
    "pinia": "^2.2.0",
    "vue": "^3.5.0",
    "vue-router": "^4.5.0",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@electron-forge/cli": "^7.9.0",
    "@electron-forge/maker-dmg": "^7.9.0",
    "@electron-forge/maker-squirrel": "^7.9.0",
    "@electron-forge/maker-zip": "^7.9.0",
    "@electron-forge/plugin-auto-unpack-natives": "^7.9.0",
    "@electron-forge/plugin-fuses": "^7.9.0",
    "@electron-forge/plugin-webpack": "^7.9.0",
    "@electron/rebuild": "^3.7.2",
    "@types/express": "^5.0.5",
    "cross-env": "^7.0.3",
    "electron": "^36.9.0",
    "typescript": "^5.9.2",
    "vue-loader": "^17.4.2"
  }
}
```

#### 3.3 创建Main Process入口

```typescript
// apps/electron/src/main/main.ts
import { app, BrowserWindow } from 'electron';
import path from 'node:path';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
```

#### 3.4 创建Preload脚本

```typescript
// apps/electron/src/preload/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // 初始接口，后续逐步添加
  ping: () => ipcRenderer.invoke('ping'),
});
```

#### 3.5 创建Renderer入口

```typescript
// apps/electron/src/renderer/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './styles/main.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

app.mount('#app');
```

```vue
<!-- apps/electron/src/renderer/App.vue -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
// App component
</script>
```

#### 3.6 创建Webpack配置

```typescript
// apps/electron/webpack.main.config.ts
import type { Configuration } from 'webpack';
import * as path from 'path';

export const mainConfig: Configuration = {
  entry: './src/main/main.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@mcp_router/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  output: {
    path: path.resolve(__dirname, '.webpack/main'),
    filename: 'index.js',
  },
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false,
  },
};
```

```typescript
// apps/electron/webpack.renderer.config.ts
import type { Configuration } from 'webpack';
import * as path from 'path';
import { VueLoaderPlugin } from 'vue-loader';

export const rendererConfig: Configuration = {
  entry: './src/renderer/main.ts',
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts', '.vue'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/renderer/components'),
      '@stores': path.resolve(__dirname, 'src/renderer/stores'),
      '@mcp_router/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  plugins: [new VueLoaderPlugin()],
  output: {
    path: path.resolve(__dirname, '.webpack/renderer'),
    filename: 'index.js',
  },
  target: 'electron-renderer',
};
```

#### 3.7 创建Electron Forge配置

```typescript
// apps/electron/forge.config.ts
import type { ForgeConfig } from '@electron-forge/shared-types';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer/main.ts',
            name: 'main_window',
            preload: {
              js: './src/preload/preload.ts',
            },
          },
        ],
      },
    }),
  ],
};

export default config;
```

### 步骤4：创建CLI应用

```bash
cd ../cli
mkdir -p src/commands
```

**package.json**：
```json
{
  "name": "@mcp_router/cli",
  "version": "0.2.0",
  "main": "dist/mcpr.js",
  "bin": {
    "mcpr": "dist/mcpr.js"
  },
  "type": "module",
  "scripts": {
    "build": "tsc --build",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.18.0",
    "node-fetch": "^3.3.2"
  },
  "devDependencies": {
    "@types/node": "^22.18.5",
    "typescript": "^5.9.2"
  }
}
```

**src/mcpr.ts**（初始）：
```typescript
#!/usr/bin/env node
import { executeConnect } from './commands/connect.js';

const args = process.argv.slice(2);
const command = args[0] || 'connect';

async function main() {
  try {
    switch (command) {
      case 'connect':
        await executeConnect(args.slice(1));
        break;
      default:
        await executeConnect(args);
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
```

### 步骤5：创建基础设施层

#### 5.1 数据库基础设施

```typescript
// apps/electron/src/main/infrastructure/database/sqlite-manager.ts
import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

export class SqliteManager {
  private db: Database.Database | null = null;
  private dbPath: string;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  public getDatabase(): Database.Database {
    if (!this.db) {
      this.db = new Database(this.dbPath);
      this.db.pragma('journal_mode = WAL');
    }
    return this.db;
  }

  public close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  public getDbPath(): string {
    return this.dbPath;
  }
}

let mainDatabase: SqliteManager | null = null;

export function getMainDatabase(): SqliteManager {
  if (!mainDatabase) {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'mcprouter.db');
    mainDatabase = new SqliteManager(dbPath);
  }
  return mainDatabase;
}
```

```typescript
// apps/electron/src/main/infrastructure/database/base-repository.ts
import { SqliteManager } from './sqlite-manager';

export abstract class BaseRepository<T> {
  protected db: SqliteManager;
  protected tableName: string;

  constructor(db: SqliteManager, tableName: string) {
    this.db = db;
    this.tableName = tableName;
    this.initializeTable();
  }

  protected abstract initializeTable(): void;
  protected abstract mapRowToEntity(row: any): T;
  protected abstract mapEntityToRow(entity: T): Record<string, any>;

  public create(entity: T): T {
    const row = this.mapEntityToRow(entity);
    const columns = Object.keys(row).join(', ');
    const placeholders = Object.keys(row).map(() => '?').join(', ');
    const values = Object.values(row);

    const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
    this.db.getDatabase().prepare(sql).run(...values);
    return entity;
  }

  public findById(id: string): T | null {
    const row = this.db.getDatabase()
      .prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`)
      .get(id) as any;
    
    return row ? this.mapRowToEntity(row) : null;
  }

  public findAll(): T[] {
    const rows = this.db.getDatabase()
      .prepare(`SELECT * FROM ${this.tableName}`)
      .all() as any[];
    
    return rows.map(row => this.mapRowToEntity(row));
  }

  public update(id: string, updates: Partial<T>): T | null {
    const existing = this.findById(id);
    if (!existing) return null;

    const updated = { ...existing, ...updates };
    const row = this.mapEntityToRow(updated);
    const setClause = Object.keys(row)
      .filter(key => key !== 'id')
      .map(key => `${key} = ?`)
      .join(', ');
    const values = Object.keys(row)
      .filter(key => key !== 'id')
      .map(key => row[key]);

    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    this.db.getDatabase().prepare(sql).run(...values, id);
    return updated;
  }

  public delete(id: string): void {
    this.db.getDatabase()
      .prepare(`DELETE FROM ${this.tableName} WHERE id = ?`)
      .run(id);
  }
}
```

### 步骤6：创建第一个模块（示例：Settings）

#### 6.1 创建Settings模块

```typescript
// apps/electron/src/main/modules/settings/settings.repository.ts
import { BaseRepository } from '@/main/infrastructure/database/base-repository';
import { getMainDatabase } from '@/main/infrastructure/database/sqlite-manager';
import { AppSettings } from '@mcp_router/shared';

export class SettingsRepository extends BaseRepository<AppSettings> {
  private static instance: SettingsRepository | null = null;

  private constructor() {
    super(getMainDatabase(), 'settings');
  }

  public static getInstance(): SettingsRepository {
    if (!SettingsRepository.instance) {
      SettingsRepository.instance = new SettingsRepository();
    }
    return SettingsRepository.instance;
  }

  protected initializeTable(): void {
    const sql = `
      CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY,
        theme TEXT NOT NULL DEFAULT 'system',
        showWindowOnStartup INTEGER NOT NULL DEFAULT 1,
        language TEXT NOT NULL DEFAULT 'en'
      )
    `;
    this.db.getDatabase().exec(sql);
    
    // 插入默认设置
    const existing = this.findById('app');
    if (!existing) {
      this.create({
        id: 'app',
        theme: 'system',
        showWindowOnStartup: true,
        language: 'en',
      } as any);
    }
  }

  protected mapRowToEntity(row: any): AppSettings {
    return {
      theme: row.theme,
      showWindowOnStartup: Boolean(row.showWindowOnStartup),
      language: row.language,
    };
  }

  protected mapEntityToRow(entity: AppSettings): Record<string, any> {
    return {
      id: 'app',
      theme: entity.theme,
      showWindowOnStartup: entity.showWindowOnStartup ? 1 : 0,
      language: entity.language,
    };
  }

  public getSettings(): AppSettings {
    const settings = this.findById('app');
    return settings || {
      theme: 'system',
      showWindowOnStartup: true,
      language: 'en',
    };
  }

  public saveSettings(settings: AppSettings): AppSettings {
    return this.update('app', settings) || settings;
  }
}
```

```typescript
// apps/electron/src/main/modules/settings/settings.service.ts
import { SettingsRepository } from './settings.repository';
import { AppSettings } from '@mcp_router/shared';

export class SettingsService {
  private repository: SettingsRepository;

  constructor() {
    this.repository = SettingsRepository.getInstance();
  }

  getSettings(): AppSettings {
    return this.repository.getSettings();
  }

  saveSettings(settings: AppSettings): AppSettings {
    return this.repository.saveSettings(settings);
  }
}
```

```typescript
// apps/electron/src/main/modules/settings/settings.ipc.ts
import { ipcMain } from 'electron';
import { SettingsService } from './settings.service';

export function setupSettingsHandlers(): void {
  const service = new SettingsService();

  ipcMain.handle('settings:get', async () => {
    return service.getSettings();
  });

  ipcMain.handle('settings:save', async (_, settings: AppSettings) => {
    return service.saveSettings(settings);
  });
}
```

### 步骤7：创建Vue应用基础

#### 7.1 创建路由

```typescript
// apps/electron/src/renderer/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/servers',
  },
  {
    path: '/servers',
    component: () => import('@components/pages/ServerManagementPage.vue'),
  },
  {
    path: '/settings',
    component: () => import('@components/pages/SettingsPage.vue'),
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
```

#### 7.2 创建Platform API实现

```typescript
// apps/electron/src/renderer/platform-api/electron-platform-api.ts
import type { PlatformAPI } from '@mcp_router/shared';

declare global {
  interface Window {
    electronAPI: any;
  }
}

export class ElectronPlatformAPI implements PlatformAPI {
  private get electronAPI() {
    return window.electronAPI;
  }

  settings = {
    get: () => this.electronAPI.getSettings(),
    save: (settings: any) => this.electronAPI.saveSettings(settings),
  };

  // 其他API接口初始化为空实现，后续逐步添加
  auth = {} as any;
  servers = {} as any;
  apps = {} as any;
  packages = {} as any;
  logs = {} as any;
  workspaces = {} as any;
  workflows = {} as any;
  projects = {} as any;
}
```

#### 7.3 创建第一个Store

```typescript
// apps/electron/src/renderer/stores/settings.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usePlatformAPI } from '@/composables/usePlatformAPI';
import type { AppSettings } from '@mcp_router/shared';

export const useSettingsStore = defineStore('settings', () => {
  const api = usePlatformAPI();
  const settings = ref<AppSettings>({
    theme: 'system',
    showWindowOnStartup: true,
    language: 'en',
  });

  async function fetchSettings() {
    settings.value = await api.settings.get();
  }

  async function saveSettings(newSettings: AppSettings) {
    settings.value = await api.settings.save(newSettings);
  }

  return {
    settings,
    fetchSettings,
    saveSettings,
  };
});
```

#### 7.4 创建Composable

```typescript
// apps/electron/src/renderer/composables/usePlatformAPI.ts
import { inject } from 'vue';
import type { PlatformAPI } from '@mcp_router/shared';

export function usePlatformAPI(): PlatformAPI {
  const api = inject<PlatformAPI>('platformAPI');
  if (!api) {
    throw new Error('PlatformAPI not provided');
  }
  return api;
}
```

#### 7.5 创建HTML入口文件

```html
<!-- apps/electron/src/index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MCP Router</title>
</head>
<body>
  <div id="app"></div>
  <script src="./renderer/index.js"></script>
</body>
</html>
```

#### 7.6 创建基础样式

```css
/* apps/electron/src/renderer/styles/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
```

#### 7.7 创建基础UI组件

```vue
<!-- apps/electron/src/renderer/components/common/Button.vue -->
<template>
  <button
    :class="buttonClass"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClass = computed(() => [
  'px-4 py-2 rounded font-medium transition-colors',
  {
    'bg-blue-600 text-white hover:bg-blue-700': props.variant === 'primary',
    'bg-gray-200 text-gray-800 hover:bg-gray-300': props.variant === 'secondary',
    'bg-red-600 text-white hover:bg-red-700': props.variant === 'danger',
    'opacity-50 cursor-not-allowed': props.disabled,
  },
]);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>
```

```vue
<!-- apps/electron/src/renderer/components/pages/SettingsPage.vue -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Settings</h1>
    <div class="space-y-4">
      <div>
        <label class="block mb-2">Theme</label>
        <select v-model="localSettings.theme" @change="save">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>
      <div>
        <label class="block mb-2">
          <input
            type="checkbox"
            v-model="localSettings.showWindowOnStartup"
            @change="save"
          />
          Show window on startup
        </label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();
const localSettings = ref({
  theme: 'system',
  showWindowOnStartup: true,
  language: 'en',
});

onMounted(async () => {
  await settingsStore.fetchSettings();
  localSettings.value = { ...settingsStore.settings };
});

const save = async () => {
  await settingsStore.saveSettings(localSettings.value);
};
</script>
```

```vue
<!-- apps/electron/src/renderer/components/pages/ServerManagementPage.vue -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Servers</h1>
    <div v-if="loading">Loading...</div>
    <div v-else-if="servers.length === 0" class="text-gray-500">
      No servers configured. Add a server to get started.
    </div>
    <div v-else class="space-y-4">
      <!-- 服务器列表将在这里显示 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const servers = ref([]);
const loading = ref(false);

onMounted(() => {
  // 后续实现
});
</script>
```

### 步骤8：完善Main Process初始化

#### 8.1 更新main.ts添加模块初始化

```typescript
// apps/electron/src/main/main.ts
import { app, BrowserWindow } from 'electron';
import path from 'node:path';
import { setupSettingsHandlers } from './modules/settings/settings.ipc';

let mainWindow: BrowserWindow | null = null;

async function initApplication() {
  // 初始化IPC Handlers
  setupSettingsHandlers();
  
  // 创建窗口
  createWindow();
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(initApplication);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
```

#### 8.2 更新Preload添加Settings接口

```typescript
// apps/electron/src/preload/preload.ts
import { contextBridge, ipcRenderer } from 'electron';
import type { AppSettings } from '@mcp_router/shared';

contextBridge.exposeInMainWorld('electronAPI', {
  settings: {
    get: (): Promise<AppSettings> => ipcRenderer.invoke('settings:get'),
    save: (settings: AppSettings): Promise<AppSettings> => 
      ipcRenderer.invoke('settings:save', settings),
  },
});
```

#### 8.3 更新Platform API实现

```typescript
// apps/electron/src/renderer/platform-api/electron-platform-api.ts
import type { PlatformAPI, SettingsAPI } from '@mcp_router/shared';

declare global {
  interface Window {
    electronAPI: {
      settings: {
        get: () => Promise<any>;
        save: (settings: any) => Promise<any>;
      };
    };
  }
}

export class ElectronPlatformAPI implements PlatformAPI {
  private get electronAPI() {
    return window.electronAPI;
  }

  settings: SettingsAPI = {
    get: () => this.electronAPI.settings.get(),
    save: (settings) => this.electronAPI.settings.save(settings),
  };

  // 其他API初始化为空实现，后续逐步添加
  auth = {} as any;
  servers = {} as any;
  apps = {} as any;
  packages = {} as any;
  logs = {} as any;
  workspaces = {} as any;
  workflows = {} as any;
  projects = {} as any;
}
```

#### 8.4 在main.ts中提供Platform API

```typescript
// apps/electron/src/renderer/main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { ElectronPlatformAPI } from './platform-api/electron-platform-api';
import type { PlatformAPI } from '@mcp_router/shared';
import './styles/main.css';

const app = createApp(App);
const pinia = createPinia();

// 创建并提供Platform API
const platformAPI: PlatformAPI = new ElectronPlatformAPI();
app.provide('platformAPI', platformAPI);

app.use(pinia);
app.use(router);

app.mount('#app');
```

### 步骤9：创建PostCSS配置

```javascript
// apps/electron/postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 步骤10：初始化安装和验证

```bash
# 1. 在项目根目录安装依赖
pnpm install

# 2. 构建共享包（必须先构建，其他包依赖它）
pnpm --filter @mcp_router/shared build

# 3. 构建UI包
pnpm --filter @mcp_router/ui build

# 4. 类型检查
pnpm typecheck

# 5. 尝试启动（开发模式）
pnpm dev
```

**预期结果**：
- Electron窗口应该打开
- 应该能看到基础的Settings页面
- 控制台应该没有严重错误

### 步骤11：实现顺序建议

**阶段1：基础设施（必须首先完成）**
1. ✅ Monorepo结构
2. ✅ 共享类型定义
3. ✅ 数据库基础设施
4. ✅ IPC通信基础
5. ✅ Platform API基础

**阶段2：第一个完整功能（验证架构）**
1. ✅ Settings模块（最简单）
2. ✅ Settings UI页面
3. ✅ 验证数据持久化
4. ✅ 验证IPC通信

**阶段3：核心功能**
1. Workspace模块
2. Server Manager模块
3. MCP HTTP服务器
4. Aggregator Server

**阶段4：UI功能**
1. 服务器管理UI
2. 项目管理UI
3. 日志查看UI
4. 工作流管理UI

**阶段5：完善和优化**
1. 错误处理
2. 性能优化
3. 测试覆盖
4. 文档完善

### 步骤12：常见初始化问题

**问题1：依赖安装失败**
```bash
# 清理并重新安装
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**问题2：类型错误**
```bash
# 确保共享包已构建
pnpm --filter @mcp_router/shared build

# 重新构建所有包
pnpm build
```

**问题3：Webpack配置错误**
- 检查路径别名是否正确
- 检查loader配置
- 检查entry和output路径

**问题4：Electron无法启动**
- 检查main.ts路径
- 检查preload路径
- 检查webpack输出路径

---

## 核心模块详解

### 1. MCP Server Manager

**职责**：管理所有MCP服务器的生命周期

**核心类**：
- `MCPServerManager` - 主管理器
- `ServerService` - 服务器业务逻辑
- `McpServerManagerRepository` - 数据持久化

**关键功能**：
- 服务器注册/注销
- 服务器启动/停止
- 服务器配置管理
- DXT配置处理

**数据流**：
```
用户操作 → IPC Handler → ServerService → Repository → Database
                                    ↓
                            MCPServerManager → MCP Client
```

**实现要点**：
- 使用 `@modelcontextprotocol/sdk` 的 `Client` 连接MCP服务器
- 支持多种传输方式：stdio、HTTP、SSE
- 服务器配置存储在SQLite数据库中
- 支持动态启用/禁用服务器和工具

### 2. MCP Server Runtime

**职责**：提供MCP HTTP服务器和请求聚合

**核心组件**：
- `MCPHttpServer` - Express HTTP服务器（端口3282）
- `AggregatorServer` - MCP请求聚合器
- `RequestHandlers` - 请求处理逻辑

**请求流程**：
```
Client Request (HTTP POST /mcp)
    ↓
MCPHttpServer (验证token、解析project)
    ↓
attachRequestMetadata (添加_meta信息)
    ↓
AggregatorServer.getTransport().handleRequest()
    ↓
RequestHandlers (根据请求类型路由)
    ↓
MCPServerManager (执行实际MCP调用)
    ↓
Response (返回聚合结果)
```

**关键实现细节**：

1. **Token验证**：
   - 从 `Authorization: Bearer <token>` header读取
   - 支持自定义应用token验证
   - Token存储在数据库中

2. **Project过滤**：
   - 从 `X-MCPR-Project` header读取项目名称
   - 只返回属于指定项目的服务器工具
   - 支持本地和远程工作区

3. **请求元数据注入**：
   ```typescript
   // 在MCPHttpServer中注入
   modifiedBody._meta = {
     token: string,
     projectId: string | null
   }
   ```

4. **聚合逻辑**：
   - `RequestHandlers` 负责聚合多个服务器的响应
   - 工具调用路由到对应的服务器（通过toolToServerMap）
   - 资源URI标准化为 `resource://serverName/path` 格式

### 3. Workspace System

**职责**：多工作区管理，类似浏览器配置文件

**核心概念**：
- **Workspace**：独立的数据环境
- **Project**：MCP服务器的分组
- **Database Context**：每个工作区有独立的数据库

**数据库结构**：
- `mcprouter.db` - 主数据库（工作区元数据）
- `workspace-{id}.db` - 工作区数据库（服务器、项目等）
- `logs/workspace-{id}/` - 工作区日志文件目录（按日期分割）

### 4. Database Architecture

**设计模式**：
- **Repository Pattern** - 数据访问抽象
- **BaseRepository** - 通用CRUD操作
- **Database Context** - 工作区数据库切换

**核心表**：
- `workspaces` - 工作区信息
- `servers` - MCP服务器配置
- `settings` - 应用设置
- `tokens` - API令牌
- `hooks` - Hook脚本

**日志文件存储**：
- 日志以JSONL格式存储在文件系统中
- 文件命名：`request-logs-YYYY-MM-DD.jsonl`（按日期分割）
- 存储路径：`logs/workspace-{id}/request-logs-YYYY-MM-DD.jsonl`
- 自动清理：仅保留最近3天的日志文件，超过3天的文件自动删除
- 文件格式：每行一个JSON对象，包含完整的请求日志信息

**迁移策略**：
- 自动迁移（应用启动时）
- 版本管理（migrations表）
- 向后兼容

### 5. CLI Tool

**职责**：提供命令行接口连接MCP Router

**核心功能**：
- `connect` - 连接到MCP Router HTTP服务器
- `serve` - 本地MCP服务器模式（聚合多个stdio服务器）

**实现架构**：

#### Connect命令
```
CLI (stdio) → HttpMcpBridgeServer → HTTP Client → MCP Router (HTTP Server)
```

**关键实现**：
1. 创建 `StreamableHTTPClientTransport` 连接到 `http://localhost:3282/mcp`
2. 使用 `Server` (stdio) 作为桥接，将stdio请求转发到HTTP
3. 支持 `--project` 参数，通过 `X-MCPR-Project` header传递
4. 支持 `MCPR_TOKEN` 环境变量进行认证

#### Serve命令
```
HTTP Client → StdioMcpBridgeServer → MCPAggregator → Multiple Stdio Servers
```

**关键实现**：
1. 创建HTTP服务器（默认端口3283）
2. 使用 `MCPAggregator` 聚合多个stdio MCP服务器
3. 支持 `--server` 参数指定多个服务器
4. 每个服务器通过 `StdioClientTransport` 连接

**MCPAggregator核心逻辑**：
- 维护 `clients: Map<string, ServerClient>` 映射
- 维护 `toolToServerMap: Map<string, string>` 工具到服务器的映射
- 聚合所有服务器的工具、资源、提示词
- 工具调用时路由到对应服务器

### 6. 数据库架构详解

**数据库分离策略**：
- **主数据库** (`mcprouter.db`)：存储工作区元数据、全局设置
- **工作区数据库** (`workspace-{id}.db`)：存储服务器、项目等
- **日志文件** (`logs/workspace-{id}/request-logs-YYYY-MM-DD.jsonl`)：按日期分割的请求日志文件

**Repository模式**：
```typescript
// 基础Repository
export abstract class BaseRepository<T> {
  protected db: Database;
  
  protected abstract initializeTable(): void;
  
  async create(entity: T): Promise<T> { ... }
  async findById(id: string): Promise<T | null> { ... }
  async findAll(): Promise<T[]> { ... }
  async update(id: string, updates: Partial<T>): Promise<T> { ... }
  async delete(id: string): Promise<void> { ... }
}
```

**Schema管理**：
- 所有表定义在 `schema/tables/` 目录
- 使用 `DatabaseTableSchema` 类型统一管理
- 自动创建索引
- 迁移脚本处理表结构变更

**关键表结构**：

1. **servers表**：
   - `id`, `name`, `config` (JSON), `enabled`, `projectId`, `workspaceId`
   - 存储MCP服务器配置

2. **日志文件系统**：
   - 文件格式：JSONL（每行一个JSON对象）
   - 文件命名：`request-logs-YYYY-MM-DD.jsonl`
   - 存储位置：`logs/workspace-{id}/`
   - 保留策略：仅保留最近3天的日志文件
   - 自动清理：应用启动时和每天定时清理超过3天的文件
   - 日志内容：包含完整的请求信息（时间戳、请求类型、参数、响应、执行时长等）

3. **workspaces表**：
   - `id`, `name`, `type` (local/remote), `config`
   - 工作区元数据

4. **projects表**：
   - `id`, `name`, `workspaceId`, `serverIds` (JSON数组)
   - 项目定义

### 7. 接口定义与边界划分

#### 7.1 架构边界

**三层架构边界**：

```
┌─────────────────────────────────────────────────┐
│           Renderer Process (UI Layer)           │
│  ┌──────────────────────────────────────────┐  │
│  │  Vue Components (UI展示)                   │  │
│  │  ↓                                        │  │
│  │  Pinia Stores (UI状态管理)                │  │
│  │  ↓                                        │  │
│  │  Platform API (接口抽象层)                │  │
│  └──────────────────────────────────────────┘  │
└───────────────────┬─────────────────────────────┘
                    │ IPC (接口边界)
┌───────────────────▼─────────────────────────────┐
│        Main Process (Business Layer)            │
│  ┌──────────────────────────────────────────┐  │
│  │  IPC Handlers (接口实现)                  │  │
│  │  ↓                                        │  │
│  │  Services (业务逻辑)                      │  │
│  │  ↓                                        │  │
│  │  Repositories (数据访问)                  │  │
│  └──────────────────────────────────────────┘  │
└───────────────────┬─────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────┐
│         Infrastructure Layer                    │
│  - Database (SQLite)                            │
│  - File System (Logs)                           │
│  - Network (MCP Servers)                        │
└─────────────────────────────────────────────────┘
```

#### 7.2 Platform API 接口定义

**核心接口**：`PlatformAPI`

```typescript
// packages/shared/src/types/platform-api/platform-api.ts
export interface PlatformAPI {
  // 认证域
  auth: AuthAPI;
  
  // 服务器管理域
  servers: ServerAPI;
  
  // 应用管理域（包含Token管理）
  apps: AppAPI;
  
  // 包管理域
  packages: PackageAPI;
  
  // 设置管理域
  settings: SettingsAPI;
  
  // 日志管理域
  logs: LogAPI;
  
  // 工作区管理域
  workspaces: WorkspaceAPI;
  
  // 工作流管理域
  workflows: WorkflowAPI;
  
  // 项目管理域
  projects: ProjectsAPI;
}
```

**接口实现位置**：
- **Electron环境**：`apps/electron/src/renderer/platform-api/electron-platform-api.ts`
- **远程环境**：`apps/electron/src/renderer/platform-api/remote-platform-api.ts`

#### 7.3 领域API接口定义

##### ServerAPI（服务器管理）

```typescript
// packages/shared/src/types/platform-api/domains/server-api.ts
export interface ServerAPI {
  // 服务器列表
  list(): Promise<Server[]>;
  
  // 获取单个服务器
  get(id: string): Promise<Server | null>;
  
  // 创建服务器
  create(input: CreateServerInput): Promise<Server>;
  
  // 更新服务器
  update(id: string, updates: Partial<Server>): Promise<Server | null>;
  
  // 删除服务器
  delete(id: string): Promise<boolean>;
  
  // 启用/禁用服务器
  toggle(id: string, enabled: boolean): Promise<boolean>;
  
  // 启用/禁用工具
  toggleTool(serverId: string, toolName: string, enabled: boolean): Promise<boolean>;
  
  // 获取服务器状态
  getStatus(id: string): Promise<ServerStatus>;
  
  // 监听服务器状态变化
  onStatusChange(
    callback: (status: ServerStatus) => void
  ): Unsubscribe;
}

export interface CreateServerInput {
  name: string;
  config: MCPServerConfig;
  dxtFile?: Uint8Array;
}

export interface ServerStatus {
  id: string;
  enabled: boolean;
  connected: boolean;
  tools: Tool[];
  error?: string;
}
```

##### WorkspaceAPI（工作区管理）

```typescript
// packages/shared/src/types/platform-api/domains/workspace-api.ts
export interface WorkspaceAPI {
  // 工作区列表
  list(): Promise<Workspace[]>;
  
  // 获取当前工作区
  getCurrent(): Promise<Workspace | null>;
  
  // 切换工作区
  switch(id: string): Promise<Workspace>;
  
  // 创建工作区
  create(config: WorkspaceCreateConfig): Promise<Workspace>;
  
  // 更新工作区
  update(id: string, updates: Partial<Workspace>): Promise<Workspace | null>;
  
  // 删除工作区
  delete(id: string): Promise<boolean>;
  
  // 监听工作区变化
  onWorkspaceChange(
    callback: (workspace: Workspace) => void
  ): Unsubscribe;
}
```

##### ProjectsAPI（项目管理）

```typescript
// packages/shared/src/types/platform-api/domains/projects-api.ts
export interface ProjectsAPI {
  // 项目列表
  list(): Promise<Project[]>;
  
  // 获取单个项目
  get(id: string): Promise<Project | null>;
  
  // 创建项目
  create(input: CreateProjectInput): Promise<Project>;
  
  // 更新项目
  update(id: string, updates: Partial<Project>): Promise<Project | null>;
  
  // 删除项目
  delete(id: string): Promise<boolean>;
  
  // 添加服务器到项目
  addServer(projectId: string, serverId: string): Promise<boolean>;
  
  // 从项目移除服务器
  removeServer(projectId: string, serverId: string): Promise<boolean>;
}
```

##### LogAPI（日志管理）

```typescript
// packages/shared/src/types/platform-api/domains/log-api.ts
export interface LogAPI {
  // 查询日志
  query(options: LogQueryOptions): Promise<LogQueryResult>;
  
  // 清空日志
  clear(): Promise<boolean>;
  
  // 导出日志
  export(options: LogExportOptions): Promise<string>;
  
  // 监听新日志
  onLogUpdate(
    callback: (log: LogEntry) => void
  ): Unsubscribe;
}

export interface LogQueryOptions {
  clientId?: string;
  serverId?: string;
  requestType?: string;
  startDate?: Date;
  endDate?: Date;
  responseStatus?: 'success' | 'error';
  cursor?: string;
  limit?: number;
}
```

##### WorkflowAPI（工作流管理）

```typescript
// packages/shared/src/types/platform-api/domains/workflow-api.ts
export interface WorkflowAPI {
  // 工作流操作
  workflows: {
    list(): Promise<WorkflowDefinition[]>;
    get(id: string): Promise<WorkflowDefinition | null>;
    create(workflow: Omit<WorkflowDefinition, 'id' | 'createdAt' | 'updatedAt'>): Promise<WorkflowDefinition>;
    update(id: string, updates: Partial<WorkflowDefinition>): Promise<WorkflowDefinition | null>;
    delete(id: string): Promise<boolean>;
    setActive(id: string): Promise<boolean>;
    disable(id: string): Promise<boolean>;
  };
  
  // Hook模块操作
  hooks: {
    list(): Promise<HookModule[]>;
    get(id: string): Promise<HookModule | null>;
    create(module: Omit<HookModule, 'id'>): Promise<HookModule>;
    update(id: string, updates: Partial<HookModule>): Promise<HookModule | null>;
    delete(id: string): Promise<boolean>;
    execute(id: string, context: any): Promise<any>;
  };
}
```

#### 7.4 IPC通道接口定义

**IPC通道命名规范**：
- 格式：`{domain}:{action}`
- 示例：`servers:list`, `servers:toggle`, `workspaces:switch`

##### 服务器管理IPC通道

```typescript
// Main Process IPC Handlers
// apps/electron/src/main/modules/mcp-server-manager/mcp-server-manager.ipc.ts

// 通道：servers:list
// 请求：无参数
// 响应：Server[]
ipcMain.handle('servers:list', async () => {
  return await serverService.getAllServers();
});

// 通道：servers:get
// 请求：{ id: string }
// 响应：Server | null
ipcMain.handle('servers:get', async (_, { id }) => {
  return await serverService.getServerById(id);
});

// 通道：servers:create
// 请求：CreateServerInput
// 响应：Server
ipcMain.handle('servers:create', async (_, input: CreateServerInput) => {
  return await serverService.createServer(input);
});

// 通道：servers:update
// 请求：{ id: string, updates: Partial<Server> }
// 响应：Server | null
ipcMain.handle('servers:update', async (_, { id, updates }) => {
  return await serverService.updateServer(id, updates);
});

// 通道：servers:delete
// 请求：{ id: string }
// 响应：boolean
ipcMain.handle('servers:delete', async (_, { id }) => {
  return await serverService.deleteServer(id);
});

// 通道：servers:toggle
// 请求：{ id: string, enabled: boolean }
// 响应：boolean
ipcMain.handle('servers:toggle', async (_, { id, enabled }) => {
  return await serverService.toggleServer(id, enabled);
});

// 通道：servers:toggle-tool
// 请求：{ serverId: string, toolName: string, enabled: boolean }
// 响应：boolean
ipcMain.handle('servers:toggle-tool', async (_, { serverId, toolName, enabled }) => {
  return await serverService.toggleTool(serverId, toolName, enabled);
});

// 事件：servers:status-changed
// 发送：ServerStatus
ipcMain.emit('servers:status-changed', status);
```

##### 工作区管理IPC通道

```typescript
// 通道：workspaces:list
// 请求：无参数
// 响应：Workspace[]
ipcMain.handle('workspaces:list', async () => {
  return await workspaceService.getAllWorkspaces();
});

// 通道：workspaces:get-current
// 请求：无参数
// 响应：Workspace | null
ipcMain.handle('workspaces:get-current', async () => {
  return await workspaceService.getActiveWorkspace();
});

// 通道：workspaces:switch
// 请求：{ id: string }
// 响应：Workspace
ipcMain.handle('workspaces:switch', async (_, { id }) => {
  return await workspaceService.switchWorkspace(id);
});

// 事件：workspaces:changed
// 发送：Workspace
ipcMain.emit('workspaces:changed', workspace);
```

##### 项目管理IPC通道

```typescript
// 通道：projects:list
// 请求：无参数
// 响应：Project[]
ipcMain.handle('projects:list', async () => {
  return await projectService.getAllProjects();
});

// 通道：projects:create
// 请求：CreateProjectInput
// 响应：Project
ipcMain.handle('projects:create', async (_, input: CreateProjectInput) => {
  return await projectService.createProject(input);
});

// 通道：projects:add-server
// 请求：{ projectId: string, serverId: string }
// 响应：boolean
ipcMain.handle('projects:add-server', async (_, { projectId, serverId }) => {
  return await projectService.addServerToProject(projectId, serverId);
});
```

##### 日志管理IPC通道

```typescript
// 通道：logs:query
// 请求：LogQueryOptions
// 响应：LogQueryResult
ipcMain.handle('logs:query', async (_, options: LogQueryOptions) => {
  return await logService.getRequestLogs(options);
});

// 通道：logs:clear
// 请求：无参数
// 响应：boolean
ipcMain.handle('logs:clear', async () => {
  return await logService.clearLogs();
});

// 事件：logs:new-entry
// 发送：LogEntry
ipcMain.emit('logs:new-entry', logEntry);
```

#### 7.5 UI层接口调用规范

##### 在Vue组件中使用Platform API

```typescript
// composables/usePlatformAPI.ts
import { inject } from 'vue';
import type { PlatformAPI } from '@mcp_router/shared';

export function usePlatformAPI(): PlatformAPI {
  const api = inject<PlatformAPI>('platformAPI');
  if (!api) {
    throw new Error('PlatformAPI not provided');
  }
  return api;
}

// 在组件中使用
<script setup lang="ts">
import { usePlatformAPI } from '@/composables/usePlatformAPI';
import { ref, onMounted } from 'vue';

const api = usePlatformAPI();
const servers = ref<Server[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  try {
    servers.value = await api.servers.list();
  } finally {
    loading.value = false;
  }
});

const handleToggle = async (id: string, enabled: boolean) => {
  await api.servers.toggle(id, enabled);
  // 重新获取列表
  servers.value = await api.servers.list();
};
</script>
```

##### 在Pinia Store中使用Platform API

```typescript
// stores/servers.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { PlatformAPI } from '@mcp_router/shared';

export const useServerStore = defineStore('servers', () => {
  // 通过依赖注入获取Platform API
  const api: PlatformAPI = inject('platformAPI')!;
  
  const servers = ref<Server[]>([]);
  const loading = ref(false);
  
  async function fetchServers() {
    loading.value = true;
    try {
      servers.value = await api.servers.list();
    } finally {
      loading.value = false;
    }
  }
  
  async function toggleServer(id: string, enabled: boolean) {
    await api.servers.toggle(id, enabled);
    await fetchServers();
  }
  
  return {
    servers,
    loading,
    fetchServers,
    toggleServer,
  };
});
```

#### 7.6 接口边界规则

**UI层（Renderer Process）职责**：
- ✅ 用户界面展示和交互
- ✅ 本地状态管理（Pinia Stores）
- ✅ 调用Platform API接口
- ✅ 处理UI逻辑和验证
- ❌ 直接访问数据库
- ❌ 直接调用Main Process的Service
- ❌ 直接操作文件系统

**业务层（Main Process）职责**：
- ✅ 实现IPC Handlers
- ✅ 业务逻辑处理
- ✅ 数据访问（Repository）
- ✅ 与外部系统交互（MCP Servers）
- ❌ 直接操作DOM
- ❌ 直接访问Vue组件

**接口契约**：
1. **类型安全**：所有接口都有TypeScript类型定义
2. **错误处理**：统一使用Promise，错误通过异常抛出
3. **参数验证**：Main Process端验证所有输入参数
4. **响应格式**：统一返回格式，包含数据和错误信息

#### 7.7 接口版本管理

**当前版本**：v1.0

**版本策略**：
- 向后兼容：新版本保持旧接口可用
- 废弃标记：使用`@deprecated`标记即将废弃的接口
- 迁移指南：提供接口迁移文档

**接口变更流程**：
1. 在`packages/shared/src/types/platform-api/`中定义新接口
2. 更新Main Process的IPC Handler
3. 更新Platform API实现
4. 更新文档和类型定义
5. 标记旧接口为`@deprecated`

#### 7.8 错误处理规范

**错误类型定义**：

```typescript
// packages/shared/src/types/errors.ts
export class PlatformAPIError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PlatformAPIError';
  }
}

// 错误代码
export enum ErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}
```

**错误处理示例**：

```typescript
// Main Process
ipcMain.handle('servers:get', async (_, { id }) => {
  try {
    const server = await serverService.getServerById(id);
    if (!server) {
      throw new PlatformAPIError(
        ErrorCode.NOT_FOUND,
        `Server with id ${id} not found`
      );
    }
    return server;
  } catch (error) {
    if (error instanceof PlatformAPIError) {
      throw error;
    }
    throw new PlatformAPIError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to get server',
      { originalError: error.message }
    );
  }
});

// Renderer Process
try {
  const server = await api.servers.get(id);
} catch (error) {
  if (error instanceof PlatformAPIError) {
    // 处理特定错误
    if (error.code === ErrorCode.NOT_FOUND) {
      // 显示未找到提示
    }
  }
}
```

### 8. IPC通信机制（已迁移到7.7节）

#### 7.9 Preload接口暴露

**Preload脚本职责**：
- 在安全上下文中暴露有限的IPC接口
- 提供类型安全的接口包装
- 防止直接访问Node.js API

**Preload接口定义**：

```typescript
// apps/electron/src/preload.ts
import { contextBridge, ipcRenderer } from 'electron';

// 暴露给渲染进程的API接口
contextBridge.exposeInMainWorld('electronAPI', {
  // 服务器管理接口
  servers: {
    list: () => ipcRenderer.invoke('servers:list'),
    get: (id: string) => ipcRenderer.invoke('servers:get', { id }),
    create: (input: CreateServerInput) => ipcRenderer.invoke('servers:create', input),
    update: (id: string, updates: Partial<Server>) => 
      ipcRenderer.invoke('servers:update', { id, updates }),
    delete: (id: string) => ipcRenderer.invoke('servers:delete', { id }),
    toggle: (id: string, enabled: boolean) => 
      ipcRenderer.invoke('servers:toggle', { id, enabled }),
    toggleTool: (serverId: string, toolName: string, enabled: boolean) =>
      ipcRenderer.invoke('servers:toggle-tool', { serverId, toolName, enabled }),
    onStatusChange: (callback: (status: ServerStatus) => void) => {
      ipcRenderer.on('servers:status-changed', (_, status) => callback(status));
      return () => ipcRenderer.removeAllListeners('servers:status-changed');
    },
  },
  
  // 工作区管理接口
  workspaces: {
    list: () => ipcRenderer.invoke('workspaces:list'),
    getCurrent: () => ipcRenderer.invoke('workspaces:get-current'),
    switch: (id: string) => ipcRenderer.invoke('workspaces:switch', { id }),
    create: (config: WorkspaceCreateConfig) => 
      ipcRenderer.invoke('workspaces:create', config),
    onChanged: (callback: (workspace: Workspace) => void) => {
      ipcRenderer.on('workspaces:changed', (_, workspace) => callback(workspace));
      return () => ipcRenderer.removeAllListeners('workspaces:changed');
    },
  },
  
  // 其他接口...
});

// 类型定义（供TypeScript使用）
declare global {
  interface Window {
    electronAPI: {
      servers: ServerAPI;
      workspaces: WorkspaceAPI;
      // ... 其他接口
    };
  }
}
```

**在Renderer中使用Preload接口**：

```typescript
// renderer/platform-api/electron-platform-api.ts
export class ElectronPlatformAPI implements PlatformAPI {
  private get electronAPI() {
    return window.electronAPI;
  }
  
  servers: ServerAPI = {
    list: () => this.electronAPI.servers.list(),
    get: (id: string) => this.electronAPI.servers.get(id),
    // ... 其他方法
  };
}
```

#### 7.10 接口调用流程

**完整调用链路**：

```
┌─────────────────────────────────────────────────────────┐
│ Vue Component (UI Layer)                               │
│                                                          │
│  <script setup>                                         │
│  const api = usePlatformAPI();                          │
│  await api.servers.list();                              │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Pinia Store (State Management)                         │
│                                                          │
│  const api: PlatformAPI = inject('platformAPI')!;       │
│  servers.value = await api.servers.list();              │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Platform API (Interface Abstraction)                   │
│                                                          │
│  class ElectronPlatformAPI implements PlatformAPI {    │
│    servers: ServerAPI = {                               │
│      list: () => window.electronAPI.servers.list()      │
│    }                                                     │
│  }                                                       │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Preload Script (Security Bridge)                        │
│                                                          │
│  contextBridge.exposeInMainWorld('electronAPI', {      │
│    servers: {                                            │
│      list: () => ipcRenderer.invoke('servers:list')     │
│    }                                                     │
│  })                                                      │
└───────────────────┬─────────────────────────────────────┘
                    │ IPC (进程间通信)
                    ▼
┌─────────────────────────────────────────────────────────┐
│ IPC Handler (Main Process)                             │
│                                                          │
│  ipcMain.handle('servers:list', async () => {           │
│    return await serverService.getAllServers();          │
│  })                                                      │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Service (Business Logic)                                │
│                                                          │
│  async getAllServers(): Promise<Server[]> {             │
│    return await this.repository.findAll();              │
│  }                                                       │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────┐
│ Repository (Data Access)                                │
│                                                          │
│  async findAll(): Promise<Server[]> {                   │
│    return this.db.all('SELECT * FROM servers');         │
│  }                                                       │
└─────────────────────────────────────────────────────────┘
```

#### 7.11 接口测试规范

**接口测试策略**：

1. **单元测试**（Service层）：
   ```typescript
   describe('ServerService', () => {
     it('should get all servers', async () => {
       const servers = await serverService.getAllServers();
       expect(servers).toBeInstanceOf(Array);
     });
   });
   ```

2. **集成测试**（IPC层）：
   ```typescript
   describe('IPC Handlers', () => {
     it('should handle servers:list', async () => {
       const result = await ipcMain.emit('servers:list');
       expect(result).toBeInstanceOf(Array);
     });
   });
   ```

3. **E2E测试**（完整流程）：
   ```typescript
   describe('Server Management E2E', () => {
     it('should create and list servers', async () => {
       // 通过UI操作测试完整流程
       await page.click('[data-testid="add-server"]');
       await page.fill('[name="server-name"]', 'Test Server');
       await page.click('[data-testid="save"]');
       
       const servers = await page.$$('[data-testid="server-card"]');
       expect(servers.length).toBeGreaterThan(0);
     });
   });
   ```

#### 7.12 接口文档生成

**使用TypeDoc生成接口文档**：

```typescript
/**
 * 服务器管理API接口
 * 
 * @interface ServerAPI
 * @description 提供MCP服务器的完整管理功能，包括CRUD操作、状态管理和工具控制
 * 
 * @example
 * ```typescript
 * const api = usePlatformAPI();
 * const servers = await api.servers.list();
 * await api.servers.toggle(serverId, true);
 * ```
 */
export interface ServerAPI {
  /**
   * 获取所有服务器列表
   * 
   * @returns {Promise<Server[]>} 服务器数组
   * @throws {PlatformAPIError} 当获取失败时抛出错误
   * 
   * @example
   * ```typescript
   * const servers = await api.servers.list();
   * ```
   */
  list(): Promise<Server[]>;
  
  // ... 其他方法
}
```

#### 7.13 接口清单

**完整IPC通道清单**：

| 领域 | IPC通道 | 请求参数 | 响应类型 | 说明 |
|------|---------|---------|---------|------|
| **服务器管理** | | | | |
| | `mcp:list` | 无 | `Server[]` | 获取所有服务器 |
| | `mcp:add` | `CreateServerInput` | `Server` | 添加服务器 |
| | `mcp:remove` | `{ id: string }` | `boolean` | 删除服务器 |
| | `mcp:start` | `{ id: string }` | `boolean` | 启动服务器 |
| | `mcp:stop` | `{ id: string }` | `boolean` | 停止服务器 |
| | `mcp:update-config` | `{ id: string, config: any }` | `Server` | 更新配置 |
| | `mcp:list-tools` | `{ id: string }` | `Tool[]` | 获取工具列表 |
| | `mcp:update-tool-permissions` | `{ id: string, permissions: Record<string, boolean> }` | `boolean` | 更新工具权限 |
| | `servers:status-changed` | 事件 | `ServerStatus` | 服务器状态变化事件 |
| **工作区管理** | | | | |
| | `workspace:list` | 无 | `Workspace[]` | 获取工作区列表 |
| | `workspace:create` | `WorkspaceCreateConfig` | `Workspace` | 创建工作区 |
| | `workspace:update` | `{ id: string, updates: any }` | `Workspace` | 更新工作区 |
| | `workspace:delete` | `{ id: string }` | `boolean` | 删除工作区 |
| | `workspace:switch` | `{ id: string }` | `Workspace` | 切换工作区 |
| | `workspace:current` | 无 | `Workspace \| null` | 获取当前工作区 |
| | `workspace:switched` | 事件 | `Workspace` | 工作区切换事件 |
| **项目管理** | | | | |
| | `project:list` | 无 | `Project[]` | 获取项目列表 |
| | `project:create` | `{ name: string }` | `Project` | 创建项目 |
| | `project:update` | `{ id: string, updates: { name?: string } }` | `Project` | 更新项目 |
| | `project:delete` | `{ id: string }` | `boolean` | 删除项目 |
| **日志管理** | | | | |
| | `requestLogs:get` | `LogQueryOptions` | `LogQueryResult` | 查询日志 |
| **工作流管理** | | | | |
| | `workflow:list` | 无 | `WorkflowDefinition[]` | 获取工作流列表 |
| | `workflow:get` | `{ id: string }` | `WorkflowDefinition` | 获取工作流 |
| | `workflow:create` | `WorkflowDefinition` | `WorkflowDefinition` | 创建工作流 |
| | `workflow:update` | `{ id: string, updates: any }` | `WorkflowDefinition` | 更新工作流 |
| | `workflow:delete` | `{ id: string }` | `boolean` | 删除工作流 |
| | `workflow:setActive` | `{ id: string }` | `boolean` | 设置活动工作流 |
| | `workflow:disable` | `{ id: string }` | `boolean` | 禁用工作流 |
| | `workflow:execute` | `{ id: string, context?: any }` | `any` | 执行工作流 |
| **Hook模块管理** | | | | |
| | `hook-module:list` | 无 | `HookModule[]` | 获取Hook模块列表 |
| | `hook-module:get` | `{ id: string }` | `HookModule` | 获取Hook模块 |
| | `hook-module:create` | `HookModule` | `HookModule` | 创建Hook模块 |
| | `hook-module:update` | `{ id: string, updates: any }` | `HookModule` | 更新Hook模块 |
| | `hook-module:delete` | `{ id: string }` | `boolean` | 删除Hook模块 |
| | `hook-module:execute` | `{ id: string, context: any }` | `any` | 执行Hook模块 |
| | `hook-module:validate` | `{ script: string }` | `{ valid: boolean, error?: string }` | 验证Hook脚本 |
| **设置管理** | | | | |
| | `settings:get` | 无 | `AppSettings` | 获取设置 |
| | `settings:save` | `AppSettings` | `boolean` | 保存设置 |
| **认证管理** | | | | |
| | `auth:login` | `{ idp?: string }` | `AuthStatus` | 登录 |
| | `auth:logout` | 无 | `boolean` | 登出 |
| | `auth:status` | `{ forceRefresh?: boolean }` | `AuthStatus` | 获取认证状态 |
| | `auth:status-changed` | 事件 | `AuthStatus` | 认证状态变化事件 |
| **应用管理** | | | | |
| | `mcp-apps:list` | 无 | `McpApp[]` | 获取MCP应用列表 |
| | `mcp-apps:add` | `{ appName: string }` | `McpApp` | 添加MCP应用 |
| | `mcp-apps:delete` | `{ appName: string }` | `boolean` | 删除MCP应用 |
| | `mcp-apps:update-server-access` | `{ appName: string, serverAccess: TokenServerAccess }` | `boolean` | 更新服务器访问权限 |
| **系统管理** | | | | |
| | `system:getPlatform` | 无 | `Platform` | 获取平台信息 |
| | `system:commandExists` | `{ command: string }` | `boolean` | 检查命令是否存在 |
| | `system:checkForUpdates` | 无 | `UpdateInfo` | 检查更新 |
| | `system:installUpdate` | 无 | `boolean` | 安装更新 |
| | `system:restartApp` | 无 | `boolean` | 重启应用 |
| | `update:downloaded` | 事件 | `boolean` | 更新下载完成事件 |
| | `protocol:url` | 事件 | `string` | 协议URL事件 |

**接口调用约定**：

1. **请求格式**：
   - 所有请求通过 `ipcRenderer.invoke(channel, ...args)` 发送
   - 参数按顺序传递，最后一个参数可以是对象（包含多个字段）

2. **响应格式**：
   - 成功：直接返回数据
   - 失败：抛出 `PlatformAPIError` 异常

3. **事件监听**：
   - 使用 `ipcRenderer.on(channel, callback)` 监听
   - 返回取消监听的函数

4. **类型安全**：
   - 所有接口都有TypeScript类型定义
   - 使用 `@mcp_router/shared` 中的类型

**安全考虑**：
- 使用 `contextIsolation: true`
- 通过 `preload.ts` 暴露有限的API
- 验证所有IPC消息
- 类型安全的接口调用
- 接口参数验证
- 错误统一处理

### 8. 日志文件管理系统

**职责**：管理请求日志的文件存储、读取和清理

**核心功能**：
- **日志写入**：将请求日志以JSONL格式追加到当日日志文件
- **日志读取**：从日志文件读取日志，支持按日期、时间范围、条件过滤
- **文件分割**：按日期自动分割日志文件（每天一个文件）
- **自动清理**：定期清理超过3天的日志文件

**实现要点**：

1. **文件存储结构**：
   ```
   logs/
   └── workspace-{id}/
       ├── request-logs-2025-01-25.jsonl
       ├── request-logs-2025-01-26.jsonl
       └── request-logs-2025-01-27.jsonl
   ```

2. **日志文件格式（JSONL）**：
   ```json
   {"id":"xxx","timestamp":1706140800000,"clientId":"claude","requestType":"tools/call","params":{...},"response":{...},"duration":150,"status":"success"}
   {"id":"yyy","timestamp":1706140801000,"clientId":"cursor","requestType":"tools/list","params":{...},"response":{...},"duration":50,"status":"success"}
   ```

3. **写入流程**：
   ```
   请求完成 → 构建日志对象 → 获取当日日志文件路径 
   → 追加写入JSONL格式 → 文件系统写入
   ```

4. **读取流程**：
   ```
   查询请求 → 确定日期范围（最多3天） → 读取对应日志文件 
   → 逐行解析JSON → 应用过滤条件 → 返回结果
   ```

5. **清理策略**：
   - **启动时清理**：应用启动时检查并删除超过3天的文件
   - **定时清理**：每天凌晨执行清理任务
   - **清理逻辑**：计算文件日期，删除超过3天的文件

6. **性能优化**：
   - 使用流式写入（追加模式）
   - 读取时使用流式读取，避免一次性加载大文件
   - 支持按需读取，只读取需要的日期范围

### 9. 工作流和Hook系统

**架构**：
- 使用Vue Flow（或类似的可视化库）进行可视化编辑
- Hook作为工作流节点执行
- JavaScript代码在安全沙箱中运行

**工作流类型**：
- `tools/list` - 工具列表请求时触发
- `tools/call` - 工具调用时触发

**Hook执行流程**：
```
MCP Request → Workflow Executor → Hook Node → JavaScript Execution → Modified Request
```

### 10. 共享包架构

**packages/shared** 提供跨应用共享的类型定义和工具：

**核心类型模块**：
- `mcp-types.ts` - MCP服务器配置类型
- `workspace.ts` - 工作区类型
- `project-types.ts` - 项目类型
- `workflow-types.ts` - 工作流和Hook类型
- `platform-api/` - Platform API接口定义（领域驱动）

**Platform API设计**：
- 按领域组织（auth, servers, apps, packages, settings, logs, workspaces, workflows, projects）
- 统一的异步接口
- 类型安全的API调用

**使用方式**：
```typescript
// Main Process
import { PlatformAPI } from '@mcp_router/shared';

// Renderer Process
import { PlatformAPI } from '@mcp_router/shared';
// 通过IPC调用
```

### 11. 构建系统详解

**Webpack配置**：
- **Main Process** (`webpack.main.config.ts`)：
  - 入口：`src/main.ts`
  - 输出：`.webpack/main`
  - 支持TypeScript、Node.js模块

- **Renderer Process** (`webpack.renderer.config.ts`)：
  - 入口：`src/renderer/main.ts`（Vue应用入口）
  - 输出：`.webpack/renderer`
  - 支持Vue、CSS、Tailwind
  - 使用vue-loader处理.vue文件

**路径别名**：
```typescript
{
  "@": "src",
  "@mcp_router/shared": "../../packages/shared/src",
  "@components": "src/renderer/components",
  "@stores": "src/renderer/stores",
  "@utils": "src/renderer/utils"
}
```

**Electron Forge配置**：
- **Packager**：asar打包、图标设置、代码签名
- **Makers**：DMG (macOS)、Squirrel (Windows)、ZIP
- **Plugins**：
  - AutoUnpackNativesPlugin - 原生模块自动解包
  - WebpackPlugin - Webpack集成
  - FusesPlugin - Electron安全功能

**Turbo配置**：
- 任务依赖管理（`dependsOn`）
- 缓存策略（`cache: true/false`）
- 输出目录配置
- 环境变量传递

---

## 快速开始指南

### 前置要求

**必需软件**：
- Node.js >= 20.0.0
- pnpm >= 8.0.0
- Git

**推荐工具**：
- VS Code 或 Cursor
- TypeScript 扩展
- ESLint 扩展
- Vue Language Features (Volar)

### 从零开始搭建

#### 步骤1：克隆和安装

```bash
# 克隆仓库
git clone https://github.com/mcp-router/mcp-router.git
cd mcp-router

# 安装依赖（使用pnpm，不要用npm或yarn）
pnpm install

# 验证安装
pnpm --version  # 应该 >= 8.0.0
node --version  # 应该 >= 20.0.0
```

#### 步骤2：开发环境配置

**环境变量配置**（可选）：
```bash
# 创建 .env 文件（如果需要）
# .env
ELECTRON_ENV=development
NODE_ENV=development
```

**IDE配置**：
- 安装推荐扩展（VS Code）
- 配置TypeScript路径别名（已在tsconfig.json中配置）
- 启用ESLint自动修复

#### 步骤3：首次运行

```bash
# 开发模式启动
pnpm dev

# 应该看到：
# - Electron窗口打开
# - 控制台显示启动日志
# - 应用正常运行
```

#### 步骤4：验证安装

1. **检查数据库**：
   - 应用启动后，检查 `~/Library/Application Support/mcp-router/` (macOS)
   - 或 `%APPDATA%/mcp-router/` (Windows)
   - 应该看到 `mcprouter.db` 文件

2. **检查HTTP服务器**：
   ```bash
   # 在另一个终端
   curl http://localhost:3282/mcp
   # 应该返回JSON-RPC错误（这是正常的，因为没有发送有效请求）
   ```

3. **检查类型**：
   ```bash
   pnpm typecheck
   # 应该没有类型错误
   ```

### 项目结构快速导航

**关键入口文件**：
- `apps/electron/src/main.ts` - Electron主进程入口
- `apps/electron/src/renderer/main.ts` - Vue应用入口
- `apps/electron/src/preload.ts` - Preload脚本
- `apps/cli/src/mcpr.ts` - CLI工具入口

**关键配置文件**：
- `package.json` - 根package.json，定义workspace
- `turbo.json` - Turbo构建配置
- `pnpm-workspace.yaml` - pnpm workspace配置
- `tsconfig.json` - TypeScript根配置

**类型定义位置**：
- `packages/shared/src/types/` - 所有共享类型
- `packages/shared/src/types/platform-api/` - Platform API接口定义

---

## 开发流程

### 环境设置

#### 前置检查

```bash
# 检查Node.js版本
node --version  # 需要 >= 20.0.0

# 检查pnpm版本
pnpm --version  # 需要 >= 8.0.0

# 如果pnpm未安装
npm install -g pnpm@latest
```

#### 安装步骤

```bash
# 1. 克隆仓库（如果还没有）
git clone https://github.com/mcp-router/mcp-router.git
cd mcp-router

# 2. 安装依赖
pnpm install

# 3. 验证安装
pnpm list --depth=0  # 检查主要依赖

# 4. 开发模式启动
pnpm dev

# 5. 构建（验证构建系统）
pnpm build

# 6. 类型检查
pnpm typecheck

# 7. 代码检查
pnpm lint
```

#### 环境变量配置

**开发环境变量**（可选，创建`.env`文件）：

```bash
# .env
ELECTRON_ENV=development
NODE_ENV=development

# 可选：调试配置
DEBUG=electron:*
ELECTRON_DEBUG=1
```

**生产环境变量**（打包时）：

```bash
# 代码签名（macOS）
PUBLIC_IDENTIFIER=Developer ID Application: Your Name

# 公证（macOS）
APPLE_API_KEY=xxx
APPLE_API_KEY_ID=xxx
APPLE_API_ISSUER=xxx

# GitHub发布
GITHUB_TOKEN=ghp_xxx
```

#### 依赖管理

**添加新依赖**：

```bash
# 添加到根目录（所有workspace共享）
pnpm add -w <package>

# 添加到特定应用
pnpm --filter @mcp_router/electron add <package>

# 添加到特定包
pnpm --filter @mcp_router/shared add <package>

# 添加开发依赖
pnpm add -D <package>
```

**更新依赖**：

```bash
# 检查过时的包
pnpm outdated

# 更新所有依赖
pnpm update

# 更新特定包
pnpm update <package>
```

**依赖版本管理**：
- 使用`workspace:*`引用workspace内的包
- 使用精确版本号（避免`^`和`~`）确保一致性
- 定期运行`pnpm audit`检查安全漏洞

#### IDE配置

**VS Code推荐扩展**：
- Vue Language Features (Volar)
- TypeScript Vue Plugin (Volar)
- ESLint
- Prettier
- GitLens

**VS Code设置**（`.vscode/settings.json`）：
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ]
}
```

### 添加新功能模块

1. **创建模块目录**
   ```
   apps/electron/src/main/modules/your-module/
   ├── your-module.service.ts
   ├── your-module.repository.ts
   ├── your-module.ipc.ts
   └── your-module.types.ts
   ```

2. **实现Repository**（如果需要数据库）
   ```typescript
   export class YourModuleRepository extends BaseRepository<YourEntity> {
     protected initializeTable(): void {
       // 使用schema定义
       this.db.execute(YOUR_SCHEMA.createSQL);
     }
   }
   ```

3. **实现Service**
   ```typescript
   export class YourModuleService {
     constructor(private repository: YourModuleRepository) {}
     
     async doSomething(): Promise<void> {
       // 业务逻辑
     }
   }
   ```

4. **注册IPC Handler**
   ```typescript
   // your-module.ipc.ts
   export function registerYourModuleHandlers(
     service: YourModuleService
   ) {
     ipcMain.handle('your-module:action', async (_, params) => {
       return await service.doSomething();
     });
   }
   ```

5. **在main.ts中初始化**
   ```typescript
   import { registerYourModuleHandlers } from './modules/your-module/your-module.ipc';
   
   // 在initApplication中
   const yourModuleService = new YourModuleService(repository);
   registerYourModuleHandlers(yourModuleService);
   ```

### 前端组件开发

#### Vue组件架构

前端采用Vue 3 + Composition API，组件按功能模块拆分：

1. **组件目录结构**
   ```
   apps/electron/src/renderer/components/
   ├── common/              # 通用组件
   │   ├── Button.vue
   │   ├── Input.vue
   │   ├── Card.vue
   │   └── Dialog.vue
   ├── layout/              # 布局组件
   │   ├── Sidebar.vue
   │   ├── Header.vue
   │   └── MainLayout.vue
   ├── servers/              # 服务器管理模块
   │   ├── ServerList.vue
   │   ├── ServerCard.vue
   │   ├── ServerForm.vue
   │   └── ToolToggle.vue
   ├── projects/            # 项目管理模块
   │   ├── ProjectList.vue
   │   ├── ProjectCard.vue
   │   └── ProjectForm.vue
   ├── logs/                # 日志查看模块
   │   ├── LogViewer.vue
   │   ├── LogItem.vue
   │   └── LogFilter.vue
   └── workflows/           # 工作流管理模块
       ├── WorkflowEditor.vue
       ├── WorkflowNode.vue
       └── HookEditor.vue
   ```

2. **组件拆分原则**
   - **单一职责**：每个组件只负责一个功能
   - **可复用性**：通用组件放在`common/`目录
   - **模块化**：按业务模块组织组件
   - **组合式API**：使用Vue 3 Composition API编写逻辑

3. **组件示例**
   ```vue
   <!-- ServerCard.vue -->
   <template>
     <div class="server-card">
       <div class="server-header">
         <h3>{{ server.name }}</h3>
         <ToggleSwitch 
           :value="server.enabled" 
           @update:value="handleToggle"
         />
       </div>
       <ServerStatus :status="server.status" />
       <ToolList 
         v-if="server.enabled" 
         :tools="server.tools"
         @toggle-tool="handleToolToggle"
       />
     </div>
   </template>

   <script setup lang="ts">
   import { defineProps, defineEmits } from 'vue';
   import ToggleSwitch from '@/components/common/ToggleSwitch.vue';
   import ServerStatus from './ServerStatus.vue';
   import ToolList from './ToolList.vue';
   import { useServerStore } from '@/stores/servers';

   const props = defineProps<{
     server: Server;
   }>();

   const emit = defineEmits<{
     toggle: [id: string];
     toggleTool: [serverId: string, toolName: string];
   }>();

   const serverStore = useServerStore();

   const handleToggle = async (enabled: boolean) => {
     await serverStore.toggleServer(props.server.id, enabled);
     emit('toggle', props.server.id);
   };

   const handleToolToggle = (toolName: string) => {
     emit('toggleTool', props.server.id, toolName);
   };
   </script>
   ```

4. **使用Pinia Store**（状态管理）
   ```typescript
   // stores/servers.ts
   import { defineStore } from 'pinia';
   import { ref, computed } from 'vue';
   import { ipcRenderer } from 'electron';

   export const useServerStore = defineStore('servers', () => {
     const servers = ref<Server[]>([]);
     const loading = ref(false);

     const enabledServers = computed(() => 
       servers.value.filter(s => s.enabled)
     );

     async function fetchServers() {
       loading.value = true;
       try {
         servers.value = await ipcRenderer.invoke('servers:list');
       } finally {
         loading.value = false;
       }
     }

     async function toggleServer(id: string, enabled: boolean) {
       await ipcRenderer.invoke('servers:toggle', { id, enabled });
       await fetchServers();
     }

     return {
       servers,
       loading,
       enabledServers,
       fetchServers,
       toggleServer,
     };
   });
   ```

5. **在组件中使用Store**
   ```vue
   <script setup lang="ts">
   import { onMounted } from 'vue';
   import { useServerStore } from '@/stores/servers';

   const serverStore = useServerStore();

   onMounted(() => {
     serverStore.fetchServers();
   });
   </script>

   <template>
     <div v-if="serverStore.loading">Loading...</div>
     <ServerList v-else :servers="serverStore.servers" />
   </template>
   ```

6. **IPC通信**
   ```typescript
   import { ipcRenderer } from 'electron';
   
   // 在组件或Store中使用
   const result = await ipcRenderer.invoke('your-module:action', params);
   ```

#### 组件拆分最佳实践

1. **原子组件（Atomic Components）**
   - 最小可复用单元：Button、Input、Badge等
   - 位置：`components/common/`
   - 特点：无业务逻辑，纯UI展示

2. **分子组件（Molecular Components）**
   - 组合原子组件：Form、Card、List等
   - 位置：`components/common/`或各模块目录
   - 特点：包含简单交互逻辑

3. **组织组件（Organism Components）**
   - 业务功能组件：ServerCard、LogViewer等
   - 位置：各模块目录（`components/servers/`等）
   - 特点：包含业务逻辑，使用Store

4. **页面组件（Page Components）**
   - 完整页面：Home、Settings等
   - 位置：`components/pages/`或路由对应目录
   - 特点：组合多个组织组件，处理路由逻辑

---

## 代码模板与脚手架

### Main Process模块模板

**完整模块模板**：

```typescript
// apps/electron/src/main/modules/your-module/your-module.types.ts
export interface YourEntity {
  id: string;
  name: string;
  // 其他字段
}

export interface CreateYourEntityInput {
  name: string;
  // 其他必需字段
}
```

```typescript
// apps/electron/src/main/modules/your-module/your-module.repository.ts
import { BaseRepository } from '@/main/infrastructure/database/base-repository';
import { getSqliteManager } from '@/main/infrastructure/database/sqlite-manager';
import { YourEntity } from './your-module.types';
import { YOUR_TABLE_SCHEMA } from '@/main/infrastructure/database/schema/tables/your-table';

export class YourModuleRepository extends BaseRepository<YourEntity> {
  private static instance: YourModuleRepository | null = null;

  private constructor(db: SqliteManager) {
    super(db, 'yourTable');
  }

  public static getInstance(): YourModuleRepository {
    const db = getSqliteManager();
    if (!YourModuleRepository.instance || 
        YourModuleRepository.instance.db !== db) {
      YourModuleRepository.instance = new YourModuleRepository(db);
    }
    return YourModuleRepository.instance;
  }

  protected initializeTable(): void {
    try {
      this.db.execute(YOUR_TABLE_SCHEMA.createSQL);
      if (YOUR_TABLE_SCHEMA.indexes) {
        YOUR_TABLE_SCHEMA.indexes.forEach(indexSQL => {
          this.db.execute(indexSQL);
        });
      }
      console.log('[YourModuleRepository] テーブルの初期化が完了しました');
    } catch (error) {
      console.error('[YourModuleRepository] テーブルの初期化中にエラー:', error);
      throw error;
    }
  }

  protected mapRowToEntity(row: any): YourEntity {
    return {
      id: row.id,
      name: row.name,
      // 映射其他字段
    };
  }

  protected mapEntityToRow(entity: YourEntity): Record<string, any> {
    return {
      id: entity.id,
      name: entity.name,
      // 映射其他字段
    };
  }
}
```

```typescript
// apps/electron/src/main/modules/your-module/your-module.service.ts
import { YourModuleRepository } from './your-module.repository';
import { YourEntity, CreateYourEntityInput } from './your-module.types';

export class YourModuleService {
  private repository: YourModuleRepository;

  constructor() {
    this.repository = YourModuleRepository.getInstance();
  }

  async getAll(): Promise<YourEntity[]> {
    return this.repository.findAll();
  }

  async getById(id: string): Promise<YourEntity | null> {
    return this.repository.findById(id);
  }

  async create(input: CreateYourEntityInput): Promise<YourEntity> {
    // 业务逻辑验证
    if (!input.name || input.name.trim().length === 0) {
      throw new Error('Name is required');
    }

    const entity: YourEntity = {
      id: crypto.randomUUID(),
      name: input.name,
      // 其他字段
    };

    return this.repository.create(entity);
  }

  async update(id: string, updates: Partial<YourEntity>): Promise<YourEntity | null> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return null;
    }

    const updated = { ...existing, ...updates };
    return this.repository.update(id, updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.repository.delete(id);
      return true;
    } catch (error) {
      console.error('Failed to delete:', error);
      return false;
    }
  }
}
```

```typescript
// apps/electron/src/main/modules/your-module/your-module.ipc.ts
import { ipcMain } from 'electron';
import { YourModuleService } from './your-module.service';
import { CreateYourEntityInput } from './your-module.types';

export function setupYourModuleHandlers(): void {
  const service = new YourModuleService();

  ipcMain.handle('your-module:list', async () => {
    return await service.getAll();
  });

  ipcMain.handle('your-module:get', async (_, { id }: { id: string }) => {
    return await service.getById(id);
  });

  ipcMain.handle('your-module:create', async (_, input: CreateYourEntityInput) => {
    return await service.create(input);
  });

  ipcMain.handle('your-module:update', async (_, { id, updates }: { 
    id: string; 
    updates: Partial<YourEntity> 
  }) => {
    return await service.update(id, updates);
  });

  ipcMain.handle('your-module:delete', async (_, { id }: { id: string }) => {
    return await service.delete(id);
  });
}
```

### Vue组件模板

**原子组件模板**：

```vue
<!-- apps/electron/src/renderer/components/common/Button.vue -->
<template>
  <button
    :class="buttonClass"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClass = computed(() => [
  'btn',
  `btn-${props.variant}`,
  `btn-${props.size}`,
  { 'btn-disabled': props.disabled },
]);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<style scoped>
.btn {
  /* 样式 */
}
</style>
```

**组织组件模板**：

```vue
<!-- apps/electron/src/renderer/components/servers/ServerCard.vue -->
<template>
  <div class="server-card">
    <div class="server-header">
      <h3>{{ server.name }}</h3>
      <ToggleSwitch 
        :value="server.enabled" 
        @update:value="handleToggle"
      />
    </div>
    <ServerStatus :status="server.status" />
    <ToolList 
      v-if="server.enabled" 
      :tools="server.tools"
      @toggle-tool="handleToolToggle"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import ToggleSwitch from '@/components/common/ToggleSwitch.vue';
import ServerStatus from './ServerStatus.vue';
import ToolList from './ToolList.vue';
import { useServerStore } from '@/stores/servers';
import type { Server } from '@mcp_router/shared';

const props = defineProps<{
  server: Server;
}>();

const emit = defineEmits<{
  toggle: [id: string];
  toggleTool: [serverId: string, toolName: string];
}>();

const serverStore = useServerStore();

const handleToggle = async (enabled: boolean) => {
  await serverStore.toggleServer(props.server.id, enabled);
  emit('toggle', props.server.id);
};

const handleToolToggle = (toolName: string) => {
  emit('toggleTool', props.server.id, toolName);
};
</script>
```

### Pinia Store模板

```typescript
// apps/electron/src/renderer/stores/your-module.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { usePlatformAPI } from '@/composables/usePlatformAPI';
import type { YourEntity } from '@mcp_router/shared';

export const useYourModuleStore = defineStore('yourModule', () => {
  const api = usePlatformAPI();
  
  // State
  const items = ref<YourEntity[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedId = ref<string | null>(null);

  // Getters
  const selectedItem = computed(() => 
    items.value.find(item => item.id === selectedId.value) || null
  );

  const itemCount = computed(() => items.value.length);

  // Actions
  async function fetchItems() {
    loading.value = true;
    error.value = null;
    try {
      items.value = await api.yourModule.list();
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch items';
      console.error('Error fetching items:', err);
    } finally {
      loading.value = false;
    }
  }

  async function createItem(input: CreateYourEntityInput) {
    try {
      const newItem = await api.yourModule.create(input);
      items.value.push(newItem);
      return newItem;
    } catch (err: any) {
      error.value = err.message || 'Failed to create item';
      throw err;
    }
  }

  async function updateItem(id: string, updates: Partial<YourEntity>) {
    try {
      const updated = await api.yourModule.update(id, updates);
      if (updated) {
        const index = items.value.findIndex(item => item.id === id);
        if (index !== -1) {
          items.value[index] = updated;
        }
      }
      return updated;
    } catch (err: any) {
      error.value = err.message || 'Failed to update item';
      throw err;
    }
  }

  async function deleteItem(id: string) {
    try {
      const success = await api.yourModule.delete(id);
      if (success) {
        items.value = items.value.filter(item => item.id !== id);
        if (selectedId.value === id) {
          selectedId.value = null;
        }
      }
      return success;
    } catch (err: any) {
      error.value = err.message || 'Failed to delete item';
      throw err;
    }
  }

  function setSelected(id: string | null) {
    selectedId.value = id;
  }

  return {
    // State
    items,
    loading,
    error,
    selectedId,
    // Getters
    selectedItem,
    itemCount,
    // Actions
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setSelected,
  };
});
```

### 数据库Schema模板

```typescript
// apps/electron/src/main/infrastructure/database/schema/tables/your-table.ts
import { DatabaseTableSchema } from '@mcp_router/shared';

export const YOUR_TABLE_SCHEMA: DatabaseTableSchema = {
  createSQL: `
    CREATE TABLE IF NOT EXISTS yourTable (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `,
  indexes: [
    'CREATE INDEX IF NOT EXISTS idx_your_table_name ON yourTable(name)',
    'CREATE INDEX IF NOT EXISTS idx_your_table_created_at ON yourTable(created_at)',
  ],
};

export const YOUR_TABLE_REQUIRED_COLUMNS = ['id', 'name', 'created_at', 'updated_at'];
```

---

## 常见开发任务

### 任务1：添加新的服务器配置类型

**步骤**：
1. 在 `mcp-server-manager` 中添加配置解析器
2. 更新 `MCPServerConfig` 类型定义
3. 实现配置验证逻辑
4. 更新UI以支持新类型

**代码位置**：
- `apps/electron/src/main/modules/mcp-server-manager/`
- `packages/shared/src/types/mcp-types.ts`

### 任务2：添加新的数据库表

**步骤**：
1. 创建Schema文件：`schema/tables/your-table.ts`
2. 创建Repository：`repositories/your-module/your-module.repository.ts`
3. 在 `database-schema.ts` 中注册
4. 创建迁移脚本（如果需要）

### 任务3：添加新的IPC通道

**步骤**：
1. 在模块的 `*.ipc.ts` 中添加handler
2. 在 `main/infrastructure/ipc.ts` 中注册
3. 在 `preload.ts` 中暴露接口
4. 在Platform API中添加类型定义
5. 在前端Store中使用

### 任务4：添加新的Vue页面

**步骤**：
1. 创建页面组件：`components/pages/YourPage.vue`
2. 创建对应的Store：`stores/your-module.ts`
3. 在路由中注册：`router/index.ts`
4. 在侧边栏添加导航项

### 任务5：添加新的日志文件格式

**步骤**：
1. 更新日志写入逻辑（支持新格式）
2. 更新日志读取逻辑（解析新格式）
3. 保持向后兼容（支持旧格式）
4. 更新日志查看UI

---

## 调试与故障排查

### 调试技巧

#### Main Process调试

**使用VS Code调试配置**：

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Main Process",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}",
      "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron",
      "windows": {
        "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/electron.cmd"
      },
      "args": [
        ".",
        "--inspect=5858"
      ],
      "outputCapture": "std",
      "console": "integratedTerminal"
    }
  ]
}
```

**使用Chrome DevTools**：
```bash
# 启动应用时添加调试参数
pnpm dev -- --inspect=5858

# 然后在Chrome中打开 chrome://inspect
```

#### Renderer Process调试

**自动打开DevTools**：
- 开发模式下自动打开
- 或使用快捷键：`Cmd+Option+I` (macOS) / `Ctrl+Shift+I` (Windows)

**Vue DevTools**：
- 安装Vue DevTools浏览器扩展
- 在DevTools中可以看到Vue组件树和Pinia状态

#### IPC调试

**添加日志**：
```typescript
// Main Process
ipcMain.handle('servers:list', async () => {
  console.log('[IPC] servers:list called');
  const result = await serverService.getAllServers();
  console.log('[IPC] servers:list result:', result);
  return result;
});

// Renderer Process
const result = await ipcRenderer.invoke('servers:list');
console.log('[Renderer] Received:', result);
```

### 常见问题排查

#### 问题1：应用无法启动

**检查清单**：
- [ ] Node.js版本 >= 20.0.0
- [ ] pnpm版本 >= 8.0.0
- [ ] 依赖安装完整：`pnpm install`
- [ ] 端口3282未被占用
- [ ] 数据库文件权限正确

**解决方案**：
```bash
# 清理并重新安装
rm -rf node_modules .webpack
pnpm install
pnpm dev
```

#### 问题2：IPC调用失败

**检查清单**：
- [ ] IPC Handler已注册
- [ ] Preload脚本已正确加载
- [ ] 通道名称拼写正确
- [ ] 参数类型匹配

**调试方法**：
```typescript
// 检查Handler是否注册
console.log(ipcMain.listenerCount('servers:list')); // 应该 > 0

// 检查Preload是否加载
console.log(window.electronAPI); // 应该存在
```

#### 问题3：数据库连接失败

**检查清单**：
- [ ] 数据库文件路径正确
- [ ] 文件权限允许读写
- [ ] 工作区已正确初始化
- [ ] 数据库未损坏

**解决方案**：
```bash
# 检查数据库文件
ls -la ~/Library/Application\ Support/mcp-router/

# 如果损坏，可以删除让应用重新创建（会丢失数据）
rm ~/Library/Application\ Support/mcp-router/mcprouter.db
```

#### 问题4：Vue组件不更新

**检查清单**：
- [ ] 响应式数据使用正确（ref/reactive）
- [ ] Store状态已更新
- [ ] 组件已正确订阅Store
- [ ] 没有缓存问题

**解决方案**：
```typescript
// 确保使用响应式
const servers = ref([]); // ✅ 正确
const servers = []; // ❌ 错误

// 在Store中确保返回响应式
return {
  servers, // ✅ 正确
  servers: servers.value, // ❌ 错误
};
```

#### 问题5：构建失败

**检查清单**：
- [ ] TypeScript类型错误已修复
- [ ] 所有依赖已安装
- [ ] Webpack配置正确
- [ ] 路径别名配置正确

**解决方案**：
```bash
# 检查类型错误
pnpm typecheck

# 清理构建缓存
rm -rf .webpack .turbo

# 重新构建
pnpm build
```

### 性能问题排查

**检查点**：
1. **内存泄漏**：使用Chrome DevTools Memory Profiler
2. **IPC调用延迟**：添加时间戳记录
3. **数据库查询性能**：检查索引是否创建
4. **Vue渲染性能**：使用Vue DevTools Performance

---

## 测试指南

### 测试策略

**测试金字塔**：
```
        /\
       /  \  E2E Tests (少量)
      /____\
     /      \  Integration Tests (中等)
    /________\
   /          \  Unit Tests (大量)
  /____________\
```

### 单元测试

**测试Service层**：

```typescript
// apps/electron/src/main/modules/your-module/__tests__/your-module.service.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { YourModuleService } from '../your-module.service';
import { YourModuleRepository } from '../your-module.repository';

describe('YourModuleService', () => {
  let service: YourModuleService;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
    };
    service = new YourModuleService();
    // 注入mock repository
  });

  it('should get all items', async () => {
    const mockItems = [{ id: '1', name: 'Test' }];
    mockRepository.findAll.mockResolvedValue(mockItems);

    const result = await service.getAll();

    expect(result).toEqual(mockItems);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });
});
```

### 集成测试

**测试IPC Handler**：

```typescript
// apps/electron/src/main/modules/your-module/__tests__/your-module.ipc.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { ipcMain } from 'electron';
import { setupYourModuleHandlers } from '../your-module.ipc';

describe('YourModule IPC Handlers', () => {
  beforeEach(() => {
    // 清理所有handlers
    ipcMain.removeAllListeners();
    setupYourModuleHandlers();
  });

  it('should handle your-module:list', async () => {
    const result = await new Promise((resolve) => {
      ipcMain.emit('your-module:list', null, resolve);
    });

    expect(Array.isArray(result)).toBe(true);
  });
});
```

### E2E测试

**使用Playwright**：

```typescript
// apps/electron/e2e/specs/your-feature.spec.ts
import { test, expect } from '@playwright/test';
import { launchElectronApp } from '../fixtures/electron-app';

test.describe('Your Feature', () => {
  test('should create new item', async () => {
    const app = await launchElectronApp();
    const page = await app.firstWindow();

    // 点击添加按钮
    await page.click('[data-testid="add-button"]');

    // 填写表单
    await page.fill('[name="name"]', 'Test Item');

    // 提交
    await page.click('[data-testid="submit-button"]');

    // 验证
    await expect(page.locator('[data-testid="item-list"]')).toContainText('Test Item');
  });
});
```

### 运行测试

```bash
# 运行所有测试
pnpm test

# 运行单元测试
pnpm test:unit

# 运行E2E测试
pnpm test:e2e

# 查看覆盖率
pnpm test:coverage
```

---

## 代码规范与最佳实践

### TypeScript规范

**类型定义**：
- ✅ 使用明确的类型，避免`any`
- ✅ 使用接口定义对象结构
- ✅ 使用类型别名简化复杂类型
- ✅ 导出类型供其他模块使用

**示例**：
```typescript
// ✅ 好的做法
interface ServerConfig {
  name: string;
  url: string;
  timeout?: number;
}

function createServer(config: ServerConfig): Server {
  // ...
}

// ❌ 避免
function createServer(config: any): any {
  // ...
}
```

### Vue组件规范

**组件命名**：
- PascalCase：`ServerCard.vue`
- 描述性名称：避免`Component1.vue`

**Props定义**：
```typescript
// ✅ 使用defineProps和类型
interface Props {
  server: Server;
  showTools?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showTools: false,
});
```

**Composition API**：
- 使用`<script setup>`语法
- 逻辑按功能分组（使用注释分隔）
- 复杂逻辑提取为Composable

### 错误处理规范

**统一错误类型**：
```typescript
// ✅ 使用自定义错误类
throw new PlatformAPIError(
  ErrorCode.NOT_FOUND,
  'Server not found',
  { serverId: id }
);

// ❌ 避免
throw new Error('Server not found');
```

**错误传播**：
```typescript
// ✅ 在Service层捕获并转换
try {
  return await repository.findById(id);
} catch (error) {
  if (error instanceof DatabaseError) {
    throw new PlatformAPIError(ErrorCode.INTERNAL_ERROR, 'Database error');
  }
  throw error;
}
```

### 性能最佳实践

**数据库查询**：
- ✅ 使用索引加速查询
- ✅ 避免N+1查询
- ✅ 使用分页处理大量数据

**Vue性能**：
- ✅ 使用`v-show`代替`v-if`（频繁切换）
- ✅ 使用`key`优化列表渲染
- ✅ 避免在模板中使用复杂计算

**IPC调用**：
- ✅ 批量操作使用单个IPC调用
- ✅ 避免频繁的小IPC调用
- ✅ 使用事件代替轮询

---

## 依赖管理与环境配置

### 依赖结构

**Workspace依赖关系**：

```
mcp-router (root)
├── apps/electron
│   ├── @mcp_router/shared (workspace:*)
│   ├── @mcp_router/ui (workspace:*)
│   ├── @mcp_router/tailwind-config (workspace:*)
│   └── @mcp_router/remote-api-types (workspace:*)
├── apps/cli
│   └── @modelcontextprotocol/sdk
└── packages/
    ├── shared (无workspace依赖)
    ├── ui (依赖 tailwind-config)
    └── tailwind-config (无依赖)
```

### 添加依赖的决策树

**判断依赖位置**：

```
需要添加依赖？
  ↓
是共享类型/工具？
  ├─ 是 → packages/shared
  └─ 否 ↓
是UI组件？
  ├─ 是 → packages/ui
  └─ 否 ↓
是Electron应用需要？
  ├─ 是 → apps/electron
  └─ 否 ↓
是CLI工具需要？
  └─ 是 → apps/cli
```

### 环境变量说明

**开发环境变量**（`.env`）：
- `ELECTRON_ENV=development` - Electron环境
- `NODE_ENV=development` - Node环境
- `DEBUG=electron:*` - 调试日志

**构建环境变量**：
- `PUBLIC_IDENTIFIER` - macOS代码签名标识
- `APPLE_API_KEY` - Apple API密钥
- `APPLE_API_KEY_ID` - Apple API密钥ID
- `APPLE_API_ISSUER` - Apple API Issuer
- `GITHUB_TOKEN` - GitHub发布Token

**运行时环境变量**：
- `MCPR_TOKEN` - CLI连接Token（用户设置）
- `ELECTRON_ENV` - 环境类型（development/production）

---

## 构建与部署

### 开发构建

```bash
# 开发模式（热重载）
pnpm dev

# 生产构建
pnpm build
```

### 打包应用

```bash
# 打包（当前平台）
pnpm package

# 打包（指定架构）
pnpm package:x64
pnpm package:arm64

# 制作安装包
pnpm make
pnpm make:x64
```

### 发布流程

#### 版本管理

**版本号规则**（语义化版本）：
- `MAJOR.MINOR.PATCH`（例如：0.6.1）
- MAJOR：不兼容的API变更
- MINOR：向后兼容的功能新增
- PATCH：向后兼容的问题修复

**更新版本**：
```bash
# 更新Electron应用版本
cd apps/electron
pnpm version patch  # 或 minor, major

# 更新CLI版本（如需要）
cd apps/cli
pnpm version patch
```

#### 发布前检查清单

- [ ] 所有测试通过
- [ ] 类型检查通过：`pnpm typecheck`
- [ ] 代码检查通过：`pnpm lint`
- [ ] 构建成功：`pnpm build`
- [ ] 版本号已更新
- [ ] CHANGELOG已更新
- [ ] 代码已提交到Git

#### 发布步骤

```bash
# 1. 确保在main分支
git checkout main
git pull origin main

# 2. 构建所有包
pnpm build

# 3. 打包应用
pnpm make

# 4. 测试打包的应用
# 在out目录中找到安装包并测试

# 5. 发布（使用Electron Forge）
pnpm publish

# 6. 创建Git标签
git tag v0.6.1
git push origin v0.6.1
```

#### Git工作流

**分支策略**：
- `main` - 主分支，稳定版本
- `develop` - 开发分支
- `feature/*` - 功能分支
- `fix/*` - 修复分支
- `pr/*` - Pull Request分支

**提交规范**：
```
<type>(<scope>): <subject>

<body>

<footer>
```

**类型**：
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

**示例**：
```
feat(servers): add server status indicator

Add real-time status indicator for MCP servers.
Shows green when connected, gray when disconnected.

Closes #123
```

---

## 扩展指南

### 添加新的MCP服务器类型

1. 在 `mcp-server-manager` 中添加服务器类型处理
2. 实现对应的配置解析器
3. 更新UI以支持新类型

### 添加新的数据库表

1. **定义Schema**
   ```typescript
   // schema/tables/your-table.ts
   export const YOUR_TABLE_SCHEMA: DatabaseTableSchema = {
     createSQL: `CREATE TABLE IF NOT EXISTS your_table (...)`,
     indexes: [...]
   };
   ```

2. **创建Repository**
   ```typescript
   export class YourTableRepository extends BaseRepository<YourEntity> {
     protected initializeTable(): void {
       this.db.execute(YOUR_TABLE_SCHEMA.createSQL);
     }
   }
   ```

3. **添加到Schema集合**
   ```typescript
   // database-schema.ts
   export const DATABASE_SCHEMA = {
     // ...
     yourTable: YOUR_TABLE_SCHEMA,
   };
   ```

### 数据库迁移

**何时需要迁移**：
- 表结构变更（添加/删除/修改列）
- 索引变更
- 数据格式变更

**迁移步骤**：

1. **创建迁移文件**：
   ```typescript
   // migrations/001-add-your-table.ts
   export async function migrate001(db: Database): Promise<void> {
     // 执行迁移SQL
     db.execute(`
       ALTER TABLE existing_table 
       ADD COLUMN new_column TEXT
     `);
     
     // 更新migrations表
     db.execute(`
       INSERT INTO migrations (version, applied_at)
       VALUES ('001', datetime('now'))
     `);
   }
   ```

2. **在初始化时执行**：
   ```typescript
   // 在数据库初始化时检查并执行迁移
   const currentVersion = getCurrentMigrationVersion();
   const migrations = getPendingMigrations(currentVersion);
   
   for (const migration of migrations) {
     await migration.execute(db);
   }
   ```

3. **测试迁移**：
   - 在测试数据库中测试迁移
   - 验证数据完整性
   - 测试回滚（如支持）

### 添加新的IPC通道

1. 在模块的 `*.ipc.ts` 中添加handler
2. 在 `main/infrastructure/ipc.ts` 中注册
3. 在前端使用 `ipcRenderer.invoke()`

---

## 技术栈替换指南

### 替换前端框架（Vue → React/Svelte等）

**当前实现**：Vue 3 + Composition API + Pinia

**如果需要替换为React**：
1. `apps/electron/src/renderer/` - 所有Vue组件改为React组件
2. `packages/ui/` - UI组件库改为React组件
3. Webpack配置 - 更新loader（vue-loader → babel-loader）
4. 状态管理 - 替换Pinia为Redux/Zustand等
5. 路由系统 - Vue Router → React Router

**如果需要替换为Svelte**：
1. 组件语法改为Svelte格式（.svelte文件）
2. 状态管理使用Svelte stores
3. Webpack配置更新为svelte-loader

**保持的部分**：
- IPC通信机制
- Main Process逻辑
- 数据库层
- 组件拆分原则（原子/分子/组织/页面）

### 替换数据库（SQLite → PostgreSQL/MySQL等）

**需要修改的部分**：
1. `main/infrastructure/database/` - 数据库连接层
2. Repository实现 - SQL语法调整
3. 迁移脚本 - 数据库特定语法

**考虑事项**：
- 连接池管理
- 事务处理
- 工作区数据库分离策略（可能需要schema前缀）

### 替换构建工具（Webpack → Vite/esbuild等）

**需要修改的部分**：
1. `webpack.*.config.ts` - 构建配置
2. Electron Forge配置 - 更新plugin
3. 开发服务器配置

**保持的部分**：
- 源代码结构
- 模块系统

### 替换状态管理（Pinia → Redux/Vuex等）

**当前实现**：Pinia（Vue 3官方推荐）

**如果需要替换为Redux**：
1. `renderer/stores/` - 所有Pinia store改为Redux store
2. 组件中使用`useSelector`和`useDispatch`
3. 需要添加Redux Toolkit简化开发

**如果需要替换为Vuex**：
1. Pinia和Vuex API类似，迁移相对简单
2. 注意Vuex需要模块化组织

**保持的部分**：
- 业务逻辑
- IPC通信
- Store的组织结构（按模块划分）

---

## 关键设计决策

### 1. 为什么使用SQLite？

- **本地优先**：数据完全本地存储，保护隐私
- **零配置**：无需外部数据库服务器
- **高性能**：better-sqlite3提供同步API，性能优秀
- **轻量级**：适合Electron应用

### 2. 为什么采用模块化架构？

- **可维护性**：功能模块独立，易于理解和修改
- **可测试性**：每个模块可独立测试
- **可扩展性**：新功能作为新模块添加
- **团队协作**：减少代码冲突

### 3. 为什么使用Monorepo？

- **代码共享**：类型定义和工具函数共享
- **统一构建**：Turbo提供高效的构建编排
- **版本一致性**：依赖版本统一管理

### 4. 为什么使用工作区系统？

- **隔离性**：不同项目的数据隔离
- **灵活性**：用户可以快速切换工作环境
- **可扩展性**：未来支持团队协作的基础

---

## 常见问题

### Q: 如何添加新的MCP协议支持？

A: 在 `mcp-server-manager` 中添加新的配置解析器，处理新的配置格式，然后集成到服务器启动流程中。

### Q: 如何实现自定义Hook？

A: 使用 `workflow` 模块的Hook系统，通过Vue Flow（或类似可视化库）定义工作流，JavaScript代码在安全沙箱中执行。

### Q: 如何扩展CLI功能？

A: 在 `apps/cli/src/commands/` 中添加新命令，在 `mcpr.ts` 中注册。

### Q: 数据库迁移失败怎么办？

A: 检查 `migrations` 表，查看已执行的迁移，手动修复或回滚。

---

## 下一步

本文档将持续更新。如需添加新内容或修正错误，请提交PR。

## 实现检查清单

当AI代理需要实现类似功能时，可以使用以下检查清单：

### 核心功能
- [ ] MCP服务器管理（添加、删除、启用/禁用）
- [ ] MCP HTTP服务器（端口3282）
- [ ] 请求聚合器（聚合多个MCP服务器）
- [ ] 工具路由（工具名到服务器的映射）
- [ ] 资源URI标准化
- [ ] 工作区系统（多数据库支持）
- [ ] 项目系统（服务器分组）
- [ ] 请求日志记录（文件存储，按日期分割，保留3天）
- [ ] Token认证
- [ ] Project过滤

### CLI功能
- [ ] Connect命令（stdio → HTTP桥接）
- [ ] Serve命令（HTTP → stdio聚合）
- [ ] 项目参数支持
- [ ] Token认证支持

### 数据库
- [ ] SQLite数据库初始化
- [ ] 工作区数据库分离
- [ ] Repository模式实现
- [ ] Schema管理
- [ ] 迁移系统

### 日志系统
- [ ] 日志文件存储（JSONL格式）
- [ ] 按日期分割日志文件
- [ ] 日志文件自动清理（保留3天）
- [ ] 日志读取和查询功能
- [ ] 多工作区日志隔离

### IPC通信
- [ ] Main ↔ Renderer通信
- [ ] 安全隔离（contextIsolation）
- [ ] Preload脚本

### 构建系统
- [ ] Monorepo配置（pnpm workspace）
- [ ] Turbo构建编排
- [ ] Webpack配置
- [ ] Electron Forge打包

---

## AI开发提示

### 给AI代理的开发指南

当AI代理协助开发时，请遵循以下原则：

#### 1. 理解上下文

**在开始编码前**：
- ✅ 仔细阅读相关模块的现有代码
- ✅ 理解架构边界（UI层、业务层、数据层）
- ✅ 查看接口定义和类型
- ✅ 了解数据流和调用链

**不要**：
- ❌ 直接开始编写代码而不理解上下文
- ❌ 忽略现有的代码模式和约定
- ❌ 创建重复的功能

#### 2. 代码生成原则

**生成代码时**：
- ✅ 使用提供的代码模板
- ✅ 遵循现有的命名约定
- ✅ 保持代码风格一致
- ✅ 添加必要的类型定义
- ✅ 包含错误处理

**代码质量检查清单**：
- [ ] TypeScript类型完整
- [ ] 错误处理完善
- [ ] 符合ESLint规则
- [ ] 注释清晰（复杂逻辑）
- [ ] 遵循单一职责原则

#### 3. 模块化开发流程

**添加新功能的标准流程**：

```
1. 设计接口
   ↓ 定义Platform API接口类型
   
2. 实现Repository（如需要数据库）
   ↓ 创建Schema → 实现Repository
   
3. 实现Service
   ↓ 业务逻辑 → 调用Repository
   
4. 添加IPC Handler
   ↓ 注册Handler → 调用Service
   
5. 更新Preload
   ↓ 暴露接口给Renderer
   
6. 创建Store
   ↓ Pinia Store → 调用Platform API
   
7. 创建UI组件
   ↓ Vue组件 → 使用Store
   
8. 测试验证
   ↓ 单元测试 → 集成测试 → E2E测试
```

**不要跳过步骤**：
- ❌ 直接在UI层写业务逻辑
- ❌ 绕过接口层直接调用Service
- ❌ 忽略类型定义

#### 4. 错误处理规范

**始终包含**：
- ✅ 参数验证
- ✅ 错误捕获和转换
- ✅ 用户友好的错误消息
- ✅ 日志记录

**标准错误处理模式**：
```typescript
async function createItem(input: CreateInput): Promise<Item> {
  // 1. 参数验证
  if (!input.name?.trim()) {
    throw new PlatformAPIError(
      ErrorCode.VALIDATION_ERROR,
      'Name is required'
    );
  }

  try {
    // 2. 业务逻辑
    return await this.repository.create(item);
  } catch (error) {
    // 3. 错误转换和日志
    console.error('[YourModule] Create failed:', error);
    if (error instanceof DatabaseError) {
      throw new PlatformAPIError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to create item',
        { originalError: error.message }
      );
    }
    throw error;
  }
}
```

#### 5. 类型安全原则

**类型使用规范**：
- ✅ 所有函数参数和返回值都有类型
- ✅ 使用共享类型定义（`@mcp_router/shared`）
- ✅ 避免使用`any`，使用`unknown`代替
- ✅ 使用类型断言时添加注释说明原因

**类型定义位置**：
- 共享类型：`packages/shared/src/types/`
- 模块类型：`apps/electron/src/main/modules/{module}/{module}.types.ts`
- 组件Props：在组件文件内定义

#### 6. 测试意识

**编写可测试的代码**：
- ✅ 函数纯度高（输入输出明确）
- ✅ 依赖注入（便于mock）
- ✅ 避免全局状态
- ✅ 逻辑与UI分离

**测试优先级**：
1. **Service层**：核心业务逻辑必须测试
2. **IPC Handler**：接口层需要集成测试
3. **关键UI流程**：E2E测试覆盖

#### 7. 文档更新责任

**修改代码后必须更新**：
- ✅ 相关接口文档（如有变更）
- ✅ 类型定义（新增/修改类型）
- ✅ 本文档（架构变更时）
- ✅ 代码注释（复杂逻辑）

#### 8. 常见陷阱避免

**架构边界陷阱**：
- ❌ 在Renderer Process中直接访问Node.js API
  - ✅ 使用Platform API抽象层
- ❌ 在Main Process中直接操作DOM
  - ✅ 通过IPC发送消息给Renderer
- ❌ 绕过Platform API直接调用IPC
  - ✅ 始终使用Platform API接口
- ❌ 在组件中写业务逻辑
  - ✅ 业务逻辑在Service层，组件只负责展示

**工作区陷阱**：
- ❌ 忽略工作区切换的影响
  - ✅ 所有数据操作考虑当前工作区
- ❌ 硬编码数据库路径
  - ✅ 使用DatabaseContext获取当前数据库

**异步操作陷阱**：
- ❌ 忘记处理Promise错误
  - ✅ 始终使用try-catch或.catch()
- ❌ 忽略竞态条件
  - ✅ 使用适当的锁或状态管理

#### 9. 代码审查清单

**提交代码前必须检查**：

**功能完整性**：
- [ ] 功能按需求实现
- [ ] 边界情况已处理
- [ ] 错误处理完善

**代码质量**：
- [ ] 类型检查通过：`pnpm typecheck`
- [ ] 代码检查通过：`pnpm lint`
- [ ] 遵循代码规范
- [ ] 无控制台调试代码

**接口规范**：
- [ ] 接口定义清晰
- [ ] 类型定义完整
- [ ] 错误处理统一

**测试覆盖**：
- [ ] 核心逻辑有测试
- [ ] 测试用例通过
- [ ] 边界情况已测试

**文档更新**：
- [ ] 代码注释清晰
- [ ] 接口文档更新（如需要）
- [ ] 本文档更新（架构变更时）

#### 10. 迭代开发策略

**推荐开发流程**：

```
阶段1：设计
  ├─ 理解需求
  ├─ 设计接口
  └─ 定义数据结构

阶段2：实现核心功能
  ├─ 实现Repository（如需要）
  ├─ 实现Service
  └─ 添加IPC Handler

阶段3：实现UI
  ├─ 创建Store
  ├─ 创建组件
  └─ 连接数据流

阶段4：完善
  ├─ 错误处理
  ├─ 边界情况
  └─ 用户体验优化

阶段5：测试和优化
  ├─ 单元测试
  ├─ 集成测试
  └─ 性能优化
```

**不要一次性完成所有功能**：
- ✅ 先实现核心功能（MVP）
- ✅ 逐步添加特性
- ✅ 持续测试验证
- ✅ 及时重构优化

#### 11. 调试技巧

**当遇到问题时**：

1. **查看日志**：
   ```typescript
   // Main Process
   console.log('[ModuleName] Action:', params);
   
   // Renderer Process
   console.log('[Component] State:', state);
   ```

2. **使用断点**：
   - Main Process：VS Code调试器
   - Renderer Process：Chrome DevTools

3. **检查数据流**：
   - 验证IPC调用是否到达
   - 检查Store状态是否正确
   - 确认数据库操作是否成功

4. **隔离问题**：
   - 创建最小复现示例
   - 逐步添加代码定位问题

#### 12. 性能考虑

**开发时注意**：
- ✅ 避免不必要的重新渲染
- ✅ 使用分页处理大量数据
- ✅ 优化数据库查询（使用索引）
- ✅ 批量操作减少IPC调用

**性能检查点**：
- 组件渲染次数（Vue DevTools）
- IPC调用频率（控制台日志）
- 数据库查询时间（添加时间戳）
- 内存使用（Chrome DevTools Memory）

#### 性能优化建议

**数据库优化**：
- ✅ 为常用查询字段创建索引
- ✅ 使用分页避免一次性加载大量数据
- ✅ 使用事务批量操作
- ✅ 定期清理旧数据

**Vue性能优化**：
- ✅ 使用`v-memo`优化列表渲染
- ✅ 使用`shallowRef`处理大型对象
- ✅ 避免在模板中使用复杂计算，使用computed
- ✅ 使用`keep-alive`缓存组件

**IPC优化**：
- ✅ 批量操作合并为单个IPC调用
- ✅ 使用事件代替轮询
- ✅ 避免频繁的小IPC调用

**内存管理**：
- ✅ 及时清理事件监听器
- ✅ 使用WeakMap存储临时数据
- ✅ 定期检查内存泄漏

#### 13. 安全考虑

**必须遵守**：
- ✅ 永远不要在前端存储敏感信息
- ✅ 验证所有用户输入
- ✅ 使用参数化查询（防止SQL注入）
- ✅ 限制IPC通道的访问权限

**安全检查清单**：

**数据安全**：
- [ ] 敏感数据（API密钥、Token）仅存储在Main Process
- [ ] 数据库文件权限正确（仅应用可访问）
- [ ] 日志文件不包含敏感信息
- [ ] 传输数据使用HTTPS（远程工作区）

**输入验证**：
- [ ] 所有用户输入都经过验证
- [ ] 文件路径验证（防止路径遍历）
- [ ] SQL查询使用参数化（防止注入）
- [ ] JSON解析错误处理

**IPC安全**：
- [ ] 所有IPC消息都经过验证
- [ ] Preload只暴露必要的API
- [ ] 使用contextIsolation
- [ ] 禁用nodeIntegration

**代码安全**：
- [ ] 不执行用户提供的代码（除非在沙箱中）
- [ ] Hook脚本在安全沙箱中执行
- [ ] 文件操作验证路径
- [ ] 网络请求验证URL

#### 14. AI代理工作流程

**标准工作流**：

```
1. 理解任务
   ├─ 阅读需求描述
   ├─ 查看相关文档
   ├─ 理解业务逻辑
   └─ 查看"关键实现细节"章节
   
2. 分析现有代码
   ├─ 查找相似功能
   ├─ 理解代码模式
   ├─ 确定修改范围
   └─ 检查依赖关系
   
3. 设计解决方案
   ├─ 设计接口（参考Platform API定义）
   ├─ 设计数据结构（参考类型定义）
   ├─ 设计数据流（参考架构图）
   └─ 设计错误处理（参考错误处理模式）
   
4. 实现功能
   ├─ 按层实现（Repository → Service → IPC → Store → UI）
   ├─ 添加类型定义
   ├─ 实现错误处理
   ├─ 设置实现检查点
   └─ 参考代码模板
   
5. 测试验证
   ├─ 运行单元测试
   ├─ 运行集成测试
   ├─ 运行E2E测试
   ├─ 类型检查
   └─ 代码检查
   
6. 优化改进
   ├─ 代码审查
   ├─ 性能优化
   ├─ 文档更新
   └─ 记录问题和解决方案
```

**实现时的关键步骤**：

1. **开始实现前**：
   - ✅ 阅读"关键实现细节"章节
   - ✅ 查看相关模块的代码模板
   - ✅ 理解数据流和依赖关系
   - ✅ 确认实现顺序

2. **实现过程中**：
   - ✅ 在每个检查点验证
   - ✅ 参考实现模式
   - ✅ 避免常见陷阱
   - ✅ 及时测试

3. **实现完成后**：
   - ✅ 运行完整验证
   - ✅ 检查所有检查点
   - ✅ 更新文档
   - ✅ 记录经验教训

**遇到问题时的处理**：
1. 查看故障排查章节
2. 检查日志输出
3. 使用调试工具
4. 参考现有代码模式
5. 查阅相关文档
6. 如果仍无法解决，提供详细的错误信息和上下文

---

## 参考资源

### 官方文档
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Electron Documentation](https://www.electronjs.org/docs)
- [Turbo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspace](https://pnpm.io/workspaces)

### 项目文档
- `docs/adr/` - 架构决策记录
- `docs/design/` - 设计文档
- `README.md` - 项目说明

### 关键文件
- `apps/electron/src/main.ts` - 应用入口
- `apps/electron/src/main/modules/` - 业务模块
- `apps/cli/src/mcpr.ts` - CLI入口
- `packages/shared/src/types/` - 类型定义

---

**最后更新**：2025-01-25

