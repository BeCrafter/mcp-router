## ADDED Requirements

### Requirement: Project Creation
The system SHALL support creating projects to organize MCP servers into logical groups.

#### Scenario: Create project
- **WHEN** user creates a new project with name and description
- **THEN** project is created in current workspace database
- **AND** project is immediately available for use
- **AND** project appears in project list

#### Scenario: Project with description
- **WHEN** user creates project with optional description
- **THEN** description is stored with project metadata
- **AND** description is displayed in project list view

### Requirement: Server Assignment to Projects
The system SHALL support assigning servers to projects, with drag-and-drop support.

#### Scenario: Assign server to project
- **WHEN** user assigns a server to a project
- **THEN** server is associated with project in database
- **AND** server appears in project's server list
- **AND** server can be filtered by project in aggregator

#### Scenario: Drag server to project
- **WHEN** user drags server card to project
- **THEN** server is assigned to that project
- **AND** UI provides visual feedback during drag operation
- **AND** assignment is persisted immediately

#### Scenario: Remove server from project
- **WHEN** user removes server from project
- **THEN** server association is removed from database
- **AND** server no longer appears in project's server list
- **AND** server remains in system but unassigned

### Requirement: Project Filtering
The system SHALL support filtering servers and tools by project, both in UI and HTTP API.

#### Scenario: Filter by project in UI
- **WHEN** user selects a project in UI
- **THEN** only servers belonging to that project are displayed
- **AND** aggregator only exposes tools from selected project's servers
- **AND** project filter persists until user changes selection

#### Scenario: Filter by project via HTTP header
- **WHEN** client sends request with `X-MCPR-Project` header
- **THEN** aggregator only returns tools from servers in specified project
- **AND** tools from other projects are excluded from response
- **AND** if project does not exist, no tools are returned

#### Scenario: CLI project parameter
- **WHEN** CLI connects with `--project` parameter
- **THEN** project name is passed via `X-MCPR-Project` header
- **AND** only tools from specified project are available through CLI

### Requirement: Project Management
The system SHALL support viewing, editing, and deleting projects.

#### Scenario: View project details
- **WHEN** user views project
- **THEN** system displays project name, description, and server count
- **AND** list of servers in project is displayed
- **AND** project icon/color identifier is shown

#### Scenario: Edit project
- **WHEN** user edits project name or description
- **THEN** changes are validated
- **AND** changes are persisted to database
- **AND** UI reflects updated information immediately

#### Scenario: Delete project
- **WHEN** user deletes a project
- **THEN** system removes project from database
- **AND** servers are unassigned from project (but remain in system)
- **AND** user is prompted for confirmation before deletion

### Requirement: Project Switching
The system SHALL support quickly switching between active projects.

#### Scenario: Switch active project
- **WHEN** user switches to a different project
- **THEN** UI immediately filters to show only that project's servers
- **THEN** aggregator updates to only expose tools from active project
- **AND** project switch is instant with no server reconnection needed

