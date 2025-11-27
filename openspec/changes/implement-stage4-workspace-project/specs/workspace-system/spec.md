## ADDED Requirements

### Requirement: Workspace Creation
The system SHALL support creating multiple workspaces, each with independent data storage, similar to browser profiles.

#### Scenario: Create local workspace
- **WHEN** user creates a new local workspace with a name
- **THEN** system creates a new workspace database file (`workspace-{id}.db`)
- **AND** workspace metadata is stored in main database (`mcprouter.db`)
- **AND** workspace is immediately available for use

#### Scenario: Create remote workspace
- **WHEN** user creates a new remote workspace with API address and authentication
- **THEN** system stores remote workspace configuration
- **AND** workspace metadata includes remote API endpoint
- **AND** workspace can connect to remote API for data synchronization

### Requirement: Workspace Switching
The system SHALL support switching between workspaces with complete data isolation.

#### Scenario: Switch workspace
- **WHEN** user switches to a different workspace
- **THEN** system closes current workspace database
- **AND** opens new workspace database
- **AND** all Repository instances are reinitialized with new database context
- **AND** UI automatically refreshes to show new workspace data

#### Scenario: Data isolation
- **WHEN** user switches between workspaces
- **THEN** servers, projects, and logs from previous workspace are not visible
- **AND** each workspace maintains independent server configurations
- **AND** log files are stored in workspace-specific directories (`logs/workspace-{id}/`)

### Requirement: Workspace Data Storage
The system SHALL store workspace data in separate database files and log directories.

#### Scenario: Database separation
- **WHEN** workspace is created
- **THEN** system creates `workspace-{id}.db` file in application data directory
- **AND** workspace-specific data (servers, projects, settings) is stored in workspace database
- **AND** workspace metadata is stored in main database (`mcprouter.db`)

#### Scenario: Log file organization
- **WHEN** logs are written for a workspace
- **THEN** logs are stored in `logs/workspace-{id}/` directory
- **AND** log files are named with date format: `request-logs-YYYY-MM-DD.jsonl`
- **AND** log files are isolated per workspace

### Requirement: Workspace Metadata
The system SHALL track workspace metadata including name, type (local/remote), last used time, and configuration.

#### Scenario: Display workspace list
- **WHEN** user views workspace list
- **THEN** system displays workspace name, type (local/remote), and last used time
- **AND** current active workspace is highlighted
- **AND** workspace list is sorted by last used time (most recent first)

#### Scenario: Update last used time
- **WHEN** user switches to a workspace
- **THEN** system updates workspace last used timestamp
- **AND** timestamp is persisted to main database

### Requirement: Workspace Configuration
The system SHALL support configuring remote workspace API endpoints and authentication.

#### Scenario: Configure remote workspace
- **WHEN** user configures remote workspace API address and credentials
- **THEN** configuration is validated
- **AND** configuration is stored securely
- **AND** workspace can connect to remote API

#### Scenario: Test remote workspace connection
- **WHEN** user tests remote workspace connection
- **THEN** system attempts to connect to remote API
- **AND** connection result is displayed to user
- **AND** test does not affect existing workspace state

