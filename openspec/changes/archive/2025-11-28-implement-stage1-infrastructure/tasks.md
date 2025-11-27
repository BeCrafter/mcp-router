## 1. 数据库基础设施

- [x] 1.1 实现 SqliteManager 类（数据库连接管理）
- [x] 1.2 实现 BaseRepository 抽象类（通用CRUD操作）
- [x] 1.3 创建数据库Schema管理系统
- [x] 1.4 实现数据库初始化逻辑（主数据库和工作区数据库）
- [x] 1.5 实现数据库迁移机制
- [x] 1.6 编写数据库测试 tests/stage1-database.test.ts

## 2. IPC通信系统

- [x] 2.1 创建IPC Handler注册系统
- [x] 2.2 实现IPC消息验证机制
- [x] 2.3 实现统一错误处理机制
- [x] 2.4 创建IPC类型定义
- [x] 2.5 编写IPC测试 tests/stage1-ipc.test.ts

## 3. Platform API基础

- [x] 3.1 定义Platform API接口类型（IPlatformAPI）
- [x] 3.2 实现 ElectronPlatformAPI 类（骨架实现）
- [x] 3.3 实现Preload接口暴露（exposeInMainWorld）
- [x] 3.4 实现依赖注入系统
- [x] 3.5 创建所有API域的骨架（auth, servers, apps, packages, settings, logs, workspaces, workflows, projects）
- [x] 3.6 编写Platform API测试 tests/stage1-platform-api.test.ts

## 4. 类型系统

- [x] 4.1 完善共享类型定义（packages/shared）
- [x] 4.2 创建Settings类型定义
- [x] 4.3 创建Workspace类型定义
- [x] 4.4 创建Server类型定义
- [x] 4.5 创建Project类型定义
- [x] 4.6 创建Platform API类型定义
- [x] 4.7 创建IPC消息类型定义

## 5. 工具类

- [x] 5.1 创建错误类型（PlatformAPIError）
- [x] 5.2 创建工具函数库（utils/）
- [x] 5.3 创建常量定义（constants/）
- [x] 5.4 创建验证工具函数

## 6. 验证

- [x] 6.1 运行数据库测试验证数据库功能
- [x] 6.2 运行IPC测试验证IPC通信
- [x] 6.3 运行Platform API测试验证API框架
- [ ] 6.4 在DevTools中手动测试IPC调用（需要启动应用后手动验证）
- [ ] 6.5 检查数据库文件已正确创建（需要启动应用后验证）

