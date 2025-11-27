## 1. 后端实现

- [x] 1.1 创建 SettingsRepository（继承BaseRepository）
- [x] 1.2 创建数据库Schema（settings表）
- [x] 1.3 实现 SettingsService（getSettings、saveSettings）
- [x] 1.4 创建 Settings IPC Handlers（settings:get、settings:save）
- [x] 1.5 在 main.ts 中注册 Settings Handlers
- [x] 1.6 编写后端测试 tests/stage2-settings-backend.test.ts

## 2. 前端实现

- [x] 2.1 创建 SettingsStore（Pinia store）
- [x] 2.2 实现 Settings Platform API（get、save方法）
- [x] 2.3 更新 Preload 暴露 Settings 接口
- [x] 2.4 创建 Settings 页面组件（Settings.vue）
- [x] 2.5 添加路由配置（/settings）
- [x] 2.6 编写前端测试 tests/stage2-settings-frontend.test.ts

## 3. UI实现

- [x] 3.1 创建基础 Button 组件
- [x] 3.2 创建基础 Input 组件
- [x] 3.3 创建 Select 组件（用于主题选择）
- [x] 3.4 创建 Settings 表单UI
- [x] 3.5 实现主题切换功能（深色/浅色/系统）
- [x] 3.6 实现设置项UI（主题、启动时显示窗口、语言等）

## 4. 测试验证

- [x] 4.1 测试设置保存和读取
- [ ] 4.2 测试数据持久化（重启应用后设置保留）- 需要手动验证
- [ ] 4.3 测试UI交互（修改设置、保存）- 需要手动验证
- [x] 4.4 编写IPC测试 tests/stage2-settings-ipc.test.ts
- [ ] 4.5 编写E2E测试 tests/e2e/stage2-settings.e2e.test.ts（可选，需要Playwright）
- [x] 4.6 创建验证脚本 scripts/verify-stage2.sh

## 5. 验证

- [ ] 5.1 打开应用，导航到设置页面
- [ ] 5.2 修改主题设置，刷新页面验证是否保存
- [ ] 5.3 修改"启动时显示窗口"设置，重启应用验证
- [ ] 5.4 检查数据库文件，确认设置已保存
- [ ] 5.5 检查控制台无错误
- [ ] 5.6 测试所有设置项

