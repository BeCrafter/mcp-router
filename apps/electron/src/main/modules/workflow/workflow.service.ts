import { randomUUID } from 'crypto';
import Database from 'better-sqlite3';
import { WorkflowRepository } from './workflow.repository';
import type { WorkflowDefinition, WorkflowNode } from '@mcp_router/shared/types';

/**
 * Workflow Service
 * 业务逻辑层，处理工作流的CRUD操作和执行
 */
export class WorkflowService {
  private repository: WorkflowRepository;

  constructor(db: Database.Database) {
    this.repository = new WorkflowRepository(db);
  }

  /**
   * 获取所有工作流
   */
  listWorkflows(): WorkflowDefinition[] {
    return this.repository.findAll();
  }

  /**
   * 根据ID获取工作流
   */
  getWorkflowById(id: string): WorkflowDefinition | null {
    return this.repository.findById(id);
  }

  /**
   * 创建新工作流
   */
  createWorkflow(input: {
    name: string;
    description?: string;
    triggerType: 'tools/list' | 'tools/call' | 'manual';
    nodes?: WorkflowNode[];
    edges?: any[];
  }): WorkflowDefinition {
    const now = Math.floor(Date.now() / 1000);
    const workflow: WorkflowDefinition = {
      id: randomUUID(),
      name: input.name,
      description: input.description,
      triggerType: input.triggerType,
      enabled: false,
      nodes: input.nodes || [],
      edges: input.edges || [],
      createdAt: now,
      updatedAt: now,
    };

    return this.repository.create(workflow);
  }

  /**
   * 更新工作流
   */
  updateWorkflow(id: string, updates: Partial<WorkflowDefinition>): WorkflowDefinition | null {
    return this.repository.update(id, updates);
  }

  /**
   * 删除工作流
   */
  deleteWorkflow(id: string): boolean {
    return this.repository.delete(id);
  }

  /**
   * 启用/禁用工作流
   */
  toggleWorkflow(id: string, enabled: boolean): WorkflowDefinition | null {
    return this.repository.update(id, { enabled });
  }

  /**
   * 根据触发类型获取启用的工作流
   */
  getEnabledWorkflowsByTrigger(triggerType: string): WorkflowDefinition[] {
    return this.repository.findByTriggerType(triggerType);
  }

  /**
   * 执行工作流（简化版，实际执行逻辑需要更复杂的实现）
   */
  async executeWorkflow(
    workflowId: string,
    context: Record<string, unknown>
  ): Promise<unknown> {
    const workflow = this.repository.findById(workflowId);
    if (!workflow || !workflow.enabled) {
      throw new Error(`工作流 ${workflowId} 不存在或未启用`);
    }

    // TODO: 实现工作流执行引擎
    // 1. 找到Start节点
    // 2. 按edges顺序执行节点
    // 3. 处理Hook节点（在沙箱中执行）
    // 4. 处理MCP Call节点
    // 5. 返回结果

    console.log('[WorkflowService] 执行工作流:', workflowId, context);
    return { success: true, workflowId };
  }
}

