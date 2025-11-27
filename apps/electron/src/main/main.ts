import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { SqliteManager } from './infrastructure/database/sqlite-manager';
import { SchemaManager } from './infrastructure/database/schema-manager';
import { setupSettingsHandlers } from './modules/settings/settings.ipc';
import { setupServerHandlers } from './modules/mcp-server-manager/server.ipc';
import { setupWorkspaceHandlers } from './modules/workspace/workspace.ipc';
import { setupProjectHandlers, ProjectService } from './modules/project/project.ipc';
import { setupWorkflowHandlers } from './modules/workflow/workflow.ipc';
import { setupLogHandlers } from './modules/log/log.ipc';
import { setupClientHandlers } from './modules/client/client.ipc';
import { MCPClientManager } from './modules/mcp-server-manager/mcp-client-manager';
import { ServerService } from './modules/mcp-server-manager/server.service';
import { MCPAggregator } from './modules/mcp-aggregator/aggregator';
import { MCPHttpServer } from './modules/mcp-http-server/http-server';
import { LogService } from './modules/log/log.service';

// 保持对窗口对象的全局引用，否则窗口会被自动关闭
let mainWindow: BrowserWindow | null = null;
let dbManager: SqliteManager;
let schemaManager: SchemaManager;
let clientManager: MCPClientManager;
let serverService: ServerService;
let projectService: ProjectService;
let aggregator: MCPAggregator;
let httpServer: MCPHttpServer;
let workspaceService: ReturnType<typeof setupWorkspaceHandlers>;
let logService: LogService;

/**
 * 初始化应用后端
 */
function initializeBackend(): void {
  // 初始化数据库和基础设施
  dbManager = new SqliteManager();
  schemaManager = new SchemaManager(dbManager);
  schemaManager.migrate();

  // 初始化MCP组件
  clientManager = new MCPClientManager();
  serverService = new ServerService(dbManager);
  projectService = new ProjectService(dbManager);
  aggregator = new MCPAggregator(clientManager, serverService, projectService);
  
  // 初始化日志服务
  logService = new LogService(null);
  logService.cleanupOldLogs(); // 启动时清理旧日志
  
  httpServer = new MCPHttpServer(aggregator, logService);

  // 注册IPC Handlers（基础模块）
  setupSettingsHandlers(dbManager);
  setupServerHandlers(dbManager, clientManager);
  workspaceService = setupWorkspaceHandlers(dbManager, schemaManager);
  setupProjectHandlers(dbManager);
  setupLogHandlers(logService);

  // 初始化默认工作区（必须在注册工作区相关Handlers之前）
  workspaceService.initializeDefaultWorkspace();
  
  // 切换日志服务到当前工作区
  const currentWorkspaceId = dbManager.getCurrentWorkspaceId();
  if (currentWorkspaceId) {
    logService.switchWorkspace(currentWorkspaceId);
  }

  // 注册需要工作区数据库的IPC Handlers（在默认工作区初始化之后）
  const workspaceDb = dbManager.getWorkspaceDatabase();
  if (workspaceDb) {
    setupWorkflowHandlers(workspaceDb);
    setupClientHandlers(workspaceDb);
  }

  // 启动HTTP服务器
  httpServer.start().catch((error) => {
    console.error('启动HTTP服务器失败:', error);
  });
}

function createWindow(): void {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      // 禁用一些不必要的功能以减少 DevTools 警告
      spellcheck: false,
    },
  });

  // 在开发模式下，抑制 DevTools 的 Autofill 相关错误
  // 这些是 Chrome DevTools Protocol 的内部警告，不影响应用功能
  if (process.env.NODE_ENV === 'development') {
    // 使用新的 console-message 事件 API（Electron 新版本）
    // 新 API 使用 Event<WebContentsConsoleMessageEventParams> 对象
    mainWindow.webContents.on('console-message', (event, details) => {
      // details 是一个对象，包含 level, message, line, sourceId 等属性
      const message = String(details.message || '');
      const sourceId = String(details.sourceId || '');
      
      // 过滤掉 DevTools 的 Autofill 相关错误
      if (
        message.includes('Autofill.enable') ||
        message.includes('Autofill.setAddresses') ||
        message.includes("'Autofill.") ||
        message.includes('Autofill.enable failed') ||
        message.includes('Autofill.setAddresses failed') ||
        message.includes('Request Autofill') ||
        sourceId.includes('devtools://')
      ) {
        // 阻止这些消息显示在控制台
        event.preventDefault();
      }
    });
  }

  // 加载应用的 index.html
  // Electron Forge的webpack插件会自动注入MAIN_WINDOW_WEBPACK_ENTRY环境变量
  if (process.env.NODE_ENV === 'development') {
    // 在开发模式下，使用webpack-dev-server的URL
    // Electron Forge会自动设置正确的URL
    const devUrl = process.env.MAIN_WINDOW_WEBPACK_ENTRY || 'http://localhost:3000';
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  // 先初始化后端
  initializeBackend();
  
  // 然后创建窗口
  createWindow();

  app.on('activate', () => {
    // 在 macOS 上，当单击 dock 图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 当所有窗口都被关闭时退出应用
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用程序及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    if (httpServer) {
      httpServer.stop().finally(() => {
        if (dbManager) {
          dbManager.close();
        }
        app.quit();
      });
    } else {
      app.quit();
    }
  }
});

// 应用退出时清理
app.on('before-quit', async () => {
  if (clientManager) {
    await clientManager.cleanup();
  }
  if (httpServer) {
    await httpServer.stop();
  }
  if (dbManager) {
    dbManager.close();
  }
});

