/**
 * MCP协议类型定义
 * 基于 Model Context Protocol 规范
 */

// JSON-RPC 2.0 基础类型
export interface JsonRpcRequest {
  jsonrpc: '2.0';
  id: string | number | null;
  method: string;
  params?: unknown;
}

export interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: string | number | null;
  result?: unknown;
  error?: JsonRpcError;
}

export interface JsonRpcError {
  code: number;
  message: string;
  data?: unknown;
}

// MCP 工具类型
export interface MCPTool {
  name: string;
  description?: string;
  inputSchema: {
    type: string;
    properties?: Record<string, unknown>;
    required?: string[];
  };
}

// MCP 资源类型
export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

// MCP 提示词类型
export interface MCPPrompt {
  name: string;
  description?: string;
  arguments?: Array<{
    name: string;
    description?: string;
    required?: boolean;
  }>;
}

// MCP 请求类型
export interface MCPListToolsRequest extends JsonRpcRequest {
  method: 'tools/list';
  params?: Record<string, never>;
}

export interface MCPCallToolRequest extends JsonRpcRequest {
  method: 'tools/call';
  params: {
    name: string;
    arguments?: Record<string, unknown>;
  };
}

export interface MCPListResourcesRequest extends JsonRpcRequest {
  method: 'resources/list';
  params?: Record<string, never>;
}

export interface MCPReadResourceRequest extends JsonRpcRequest {
  method: 'resources/read';
  params: {
    uri: string;
  };
}

export interface MCPListPromptsRequest extends JsonRpcRequest {
  method: 'prompts/list';
  params?: Record<string, never>;
}

export interface MCPGetPromptRequest extends JsonRpcRequest {
  method: 'prompts/get';
  params: {
    name: string;
    arguments?: Record<string, unknown>;
  };
}

// MCP 响应类型
export interface MCPListToolsResponse extends JsonRpcResponse {
  result: {
    tools: MCPTool[];
  };
}

export interface MCPCallToolResponse extends JsonRpcResponse {
  result: {
    content: Array<{
      type: 'text' | 'resource';
      text?: string;
      resource?: {
        uri: string;
        mimeType?: string;
      };
    }>;
    isError?: boolean;
  };
}

export interface MCPListResourcesResponse extends JsonRpcResponse {
  result: {
    resources: MCPResource[];
  };
}

export interface MCPReadResourceResponse extends JsonRpcResponse {
  result: {
    contents: Array<{
      uri: string;
      mimeType?: string;
      text?: string;
      blob?: string;
    }>;
  };
}

export interface MCPListPromptsResponse extends JsonRpcResponse {
  result: {
    prompts: MCPPrompt[];
  };
}

export interface MCPGetPromptResponse extends JsonRpcResponse {
  result: {
    description?: string;
    messages: Array<{
      role: 'user' | 'assistant' | 'system';
      content: unknown;
    }>;
  };
}

// 请求元数据（内部使用）
export interface MCPRequestMetadata {
  token?: string;
  projectId?: string | null;
}

