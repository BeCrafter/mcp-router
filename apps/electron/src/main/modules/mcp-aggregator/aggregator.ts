import type {
  MCPTool,
  MCPListToolsRequest,
  MCPCallToolRequest,
  MCPListResourcesRequest,
  MCPReadResourceRequest,
  MCPListPromptsRequest,
  MCPGetPromptRequest,
  MCPRequestMetadata,
} from '@mcp_router/shared/mcp-types';
import { MCPClientManager } from '../mcp-server-manager/mcp-client-manager';
import { ServerService } from '../mcp-server-manager/server.service';
import { ProjectService } from '../project/project.service';
import type { Server } from '@mcp_router/shared/types';

/**
 * MCP聚合器
 * 聚合多个MCP服务器的工具、资源和提示词
 */
export class MCPAggregator {
  private clientManager: MCPClientManager;
  private serverService: ServerService;
  private projectService: ProjectService | null = null;

  constructor(
    clientManager: MCPClientManager,
    serverService: ServerService,
    projectService?: ProjectService
  ) {
    this.clientManager = clientManager;
    this.serverService = serverService;
    this.projectService = projectService || null;
  }

  /**
   * 获取启用的服务器（支持项目过滤）
   */
  private getEnabledServers(projectId?: string | null): Server[] {
    const allServers = this.serverService.getEnabledServers();
    if (!projectId || !this.projectService) {
      return allServers;
    }

    // 项目过滤：只返回属于指定项目的服务器
    const projectServerIds = this.projectService.getProjectServerIds(projectId);
    return allServers.filter((server) => projectServerIds.includes(server.id));
  }

  /**
   * 聚合工具列表
   */
  async listTools(metadata?: MCPRequestMetadata): Promise<MCPTool[]> {
    const servers = this.getEnabledServers(metadata?.projectId);
    const allTools: MCPTool[] = [];

    for (const server of servers) {
      const client = this.clientManager.getClient(server.id);
      if (!client) {
        continue;
      }

      try {
        const response = await client.listTools();
        const tools = (response.tools || []).map((tool) => ({
          ...tool,
          // 标准化工具名称（添加服务器前缀以避免冲突）
          name: `${server.name}:${tool.name}`,
        }));
        allTools.push(...tools);
      } catch (error) {
        console.error(`获取服务器 ${server.name} 的工具列表失败:`, error);
      }
    }

    return allTools;
  }

  /**
   * 调用工具
   */
  async callTool(
    request: MCPCallToolRequest,
    metadata?: MCPRequestMetadata
  ): Promise<unknown> {
    const toolName = request.params.name;
    const servers = this.getEnabledServers(metadata?.projectId);

    // 查找工具所属的服务器
    for (const server of servers) {
      const client = this.clientManager.getClient(server.id);
      if (!client) {
        continue;
      }

      // 检查工具是否属于此服务器
      const clientInfo = this.clientManager.getAllClients().get(server.id);
      const serverToolName = toolName.startsWith(`${server.name}:`)
        ? toolName.substring(server.name.length + 1)
        : toolName;

      const hasTool = clientInfo?.tools.some((t) => t.name === serverToolName && t.enabled);
      if (!hasTool) {
        continue;
      }

      try {
        const response = await client.callTool({
          name: serverToolName,
          arguments: request.params.arguments,
        });
        return response;
      } catch (error) {
        console.error(`调用服务器 ${server.name} 的工具 ${serverToolName} 失败:`, error);
        throw error;
      }
    }

    throw new Error(`工具 ${toolName} 未找到`);
  }

  /**
   * 聚合资源列表
   */
  async listResources(metadata?: MCPRequestMetadata): Promise<Array<{ uri: string; name: string }>> {
    const servers = this.getEnabledServers(metadata?.projectId);
    const allResources: Array<{ uri: string; name: string }> = [];

    for (const server of servers) {
      const client = this.clientManager.getClient(server.id);
      if (!client) {
        continue;
      }

      try {
        const response = await client.listResources();
        const resources = (response.resources || []).map((resource) => ({
          uri: `resource://${server.name}/${resource.uri}`,
          name: resource.name,
        }));
        allResources.push(...resources);
      } catch (error) {
        console.error(`获取服务器 ${server.name} 的资源列表失败:`, error);
      }
    }

    return allResources;
  }

  /**
   * 读取资源
   */
  async readResource(
    request: MCPReadResourceRequest,
    metadata?: MCPRequestMetadata
  ): Promise<unknown> {
    const uri = request.params.uri;
    // 解析资源URI: resource://serverName/path
    const match = uri.match(/^resource:\/\/([^/]+)\/(.+)$/);
    if (!match) {
      throw new Error(`无效的资源URI: ${uri}`);
    }

    const [, serverName, path] = match;
    const servers = this.getEnabledServers(metadata?.projectId);
    const server = servers.find((s) => s.name === serverName);

    if (!server) {
      throw new Error(`服务器 ${serverName} 未找到或未启用`);
    }

    const client = this.clientManager.getClient(server.id);
    if (!client) {
      throw new Error(`服务器 ${serverName} 未连接`);
    }

    try {
      const response = await client.readResource({ uri: path });
      return response;
    } catch (error) {
      console.error(`读取服务器 ${server.name} 的资源 ${path} 失败:`, error);
      throw error;
    }
  }

  /**
   * 聚合提示词列表
   */
  async listPrompts(metadata?: MCPRequestMetadata): Promise<Array<{ name: string; description?: string }>> {
    const servers = this.getEnabledServers(metadata?.projectId);
    const allPrompts: Array<{ name: string; description?: string }> = [];

    for (const server of servers) {
      const client = this.clientManager.getClient(server.id);
      if (!client) {
        continue;
      }

      try {
        const response = await client.listPrompts();
        const prompts = (response.prompts || []).map((prompt) => ({
          name: `${server.name}:${prompt.name}`,
          description: prompt.description,
        }));
        allPrompts.push(...prompts);
      } catch (error) {
        console.error(`获取服务器 ${server.name} 的提示词列表失败:`, error);
      }
    }

    return allPrompts;
  }

  /**
   * 获取提示词
   */
  async getPrompt(
    request: MCPGetPromptRequest,
    metadata?: MCPRequestMetadata
  ): Promise<unknown> {
    const promptName = request.params.name;
    const servers = this.getEnabledServers(metadata?.projectId);

    // 查找提示词所属的服务器
    for (const server of servers) {
      const client = this.clientManager.getClient(server.id);
      if (!client) {
        continue;
      }

      const serverPromptName = promptName.startsWith(`${server.name}:`)
        ? promptName.substring(server.name.length + 1)
        : promptName;

      try {
        const response = await client.getPrompt({
          name: serverPromptName,
          arguments: request.params.arguments,
        });
        return response;
      } catch (error) {
        // 如果提示词不存在，继续查找下一个服务器
        continue;
      }
    }

    throw new Error(`提示词 ${promptName} 未找到`);
  }
}

