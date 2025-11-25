# 示例 Spec - database-infrastructure

这是一个示例 spec 文件，展示如何为 capability 定义规范。你可以参考这个格式创建其他 capability 的 spec。

文件位置：`openspec/specs/database-infrastructure/spec.md`

```markdown
# Database Infrastructure

## ADDED Requirements

### Requirement: SQLite Database Initialization
The system SHALL initialize SQLite databases for workspace management.

#### Scenario: Main database initialization
- **WHEN** the application starts for the first time
- **THEN** a main database file `mcprouter.db` is created in the application data directory
- **AND** the database contains a `workspaces` table for workspace metadata

#### Scenario: Workspace database initialization
- **WHEN** a new workspace is created
- **THEN** a workspace-specific database file `workspace-{id}.db` is created
- **AND** the database is initialized with required tables (servers, projects, settings, etc.)

### Requirement: Database Context Management
The system SHALL provide a database context mechanism for workspace isolation.

#### Scenario: Workspace database switching
- **WHEN** the user switches to a different workspace
- **THEN** the current database connection is closed
- **AND** the new workspace's database is opened
- **AND** all repository instances are reinitialized with the new database context

#### Scenario: Multiple workspace databases
- **WHEN** multiple workspaces exist
- **THEN** each workspace has its own isolated database file
- **AND** data from one workspace is not accessible from another workspace

### Requirement: BaseRepository Pattern
The system SHALL provide a BaseRepository abstract class for data access.

#### Scenario: Repository CRUD operations
- **WHEN** a repository extends BaseRepository
- **THEN** it automatically has create, read, update, and delete methods
- **AND** all operations use the current workspace database context

#### Scenario: Repository table initialization
- **WHEN** a repository is instantiated
- **THEN** it automatically initializes its table schema if it doesn't exist
- **AND** it creates required indexes

### Requirement: Schema Management
The system SHALL manage database schemas and migrations.

#### Scenario: Schema version tracking
- **WHEN** the application starts
- **THEN** it checks the current schema version
- **AND** applies any pending migrations automatically

#### Scenario: Schema migration
- **WHEN** a schema change is required
- **THEN** a migration script is executed
- **AND** the schema version is updated
- **AND** existing data is preserved

### Requirement: Database File Locations
The system SHALL store database files in platform-specific locations.

#### Scenario: macOS database location
- **WHEN** running on macOS
- **THEN** databases are stored in `~/Library/Application Support/mcp-router/`

#### Scenario: Windows database location
- **WHEN** running on Windows
- **THEN** databases are stored in `%APPDATA%/mcp-router/`

### Requirement: Database Separation
The system SHALL separate main database and workspace databases.

#### Scenario: Main database content
- **WHEN** the main database exists
- **THEN** it contains only workspace metadata (workspaces table)
- **AND** it does not contain workspace-specific data

#### Scenario: Workspace database content
- **WHEN** a workspace database exists
- **THEN** it contains workspace-specific data (servers, projects, settings, tokens, hooks)
- **AND** it does not contain workspace metadata
```

---

## 如何创建其他 Specs

1. **创建目录**：`openspec/specs/{capability-name}/`
2. **创建 spec.md 文件**：参考上面的格式
3. **使用 ADDED Requirements**：因为是新功能，使用 `## ADDED Requirements`
4. **每个 Requirement 至少一个 Scenario**：使用 `#### Scenario:` 格式
5. **Scenario 格式**：
   - 使用 `- **WHEN**` 描述触发条件
   - 使用 `- **THEN**` 描述预期结果
   - 使用 `- **AND**` 描述附加条件

## 验证 Spec

创建完 spec 后，运行：
```bash
openspec validate database-infrastructure --strict
```

