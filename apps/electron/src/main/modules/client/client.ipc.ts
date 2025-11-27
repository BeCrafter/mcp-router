import { ipcMain } from 'electron';
import Database from 'better-sqlite3';
import { ClientService } from './client.service';
import type { Client } from '@mcp_router/shared/types';

/**
 * 设置客户端相关的IPC Handlers
 */
export function setupClientHandlers(db: Database.Database): ClientService {
  const service = new ClientService(db);

  ipcMain.handle('clients:list', async () => {
    return service.listClients();
  });

  ipcMain.handle('clients:get', async (_, { id }: { id: string }) => {
    return service.getClientById(id);
  });

  ipcMain.handle(
    'clients:create',
    async (_, input: { name: string; type: 'predefined' | 'custom' }) => {
      return service.createClient(input);
    }
  );

  ipcMain.handle(
    'clients:update',
    async (_, { id, updates }: { id: string; updates: Partial<Client> }) => {
      return service.updateClient(id, updates);
    }
  );

  ipcMain.handle('clients:delete', async (_, { id }: { id: string }) => {
    return service.deleteClient(id);
  });

  ipcMain.handle('clients:generate-token', async (_, { id }: { id: string }) => {
    return service.generateTokenForClient(id);
  });

  ipcMain.handle('clients:revoke-token', async (_, { id }: { id: string }) => {
    return service.revokeToken(id);
  });

  return service;
}

