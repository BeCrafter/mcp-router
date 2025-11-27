# Change: 实现阶段0 - 项目骨架搭建

## Why

在开始实现具体功能之前，需要建立完整的项目基础结构。这个阶段将创建 Monorepo 架构、共享包、Electron 应用骨架和 CLI 应用骨架，为后续所有开发工作提供基础。

## What Changes

- 创建 Monorepo 项目结构（使用 pnpm workspace + Turbo）
- 配置开发工具（TypeScript、ESLint、Prettier）
- 创建共享包（@mcp_router/shared、@mcp_router/ui、@mcp_router/tailwind-config、@mcp_router/remote-api-types）
- 创建 Electron 应用骨架（main process、renderer process、preload）
- 创建 CLI 应用骨架
- 配置构建工具（Webpack、Electron Forge）

## Impact

- Affected specs: 无（这是基础设施搭建，不涉及功能规范）
- Affected code: 项目根目录结构、所有应用和包的初始文件
- 为后续所有阶段的开发提供基础架构

## Dependencies

- 无前置依赖（这是第一个实现阶段）

