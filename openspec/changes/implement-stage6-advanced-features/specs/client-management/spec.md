## ADDED Requirements

### Requirement: Client Application Management
The system SHALL support managing client applications (Claude Desktop, Cursor, Cline, etc.) that connect to MCP Router.

#### Scenario: Add predefined client
- **WHEN** user adds a predefined client application (Claude Desktop, Cursor, etc.)
- **THEN** system creates client record with application name and icon
- **AND** client is stored in database
- **AND** client appears in client list

#### Scenario: Add custom client
- **WHEN** user adds custom client with name and optional icon
- **THEN** system creates client record
- **AND** client is stored in database
- **AND** client appears in client list with custom name

### Requirement: Token Generation
The system SHALL generate unique tokens for client applications.

#### Scenario: Generate token for client
- **WHEN** user generates token for a client
- **THEN** system creates unique token (format: `mcpr_xxxxx`)
- **AND** token is associated with client application
- **AND** token is stored securely in database
- **AND** token is displayed to user for copying

#### Scenario: Token uniqueness
- **WHEN** token is generated
- **THEN** system ensures token is unique
- **AND** token does not conflict with existing tokens
- **AND** token format follows specified pattern

### Requirement: Token Management
The system SHALL support viewing, revoking, and managing tokens.

#### Scenario: View client tokens
- **WHEN** user views client list
- **THEN** system displays token information for each client
- **AND** token is masked for security (showing only last few characters)
- **AND** user can reveal full token when needed

#### Scenario: Revoke token
- **WHEN** user revokes a token
- **THEN** token is invalidated in database
- **AND** token can no longer be used for authentication
- **AND** user is prompted for confirmation before revocation

#### Scenario: Regenerate token
- **WHEN** user regenerates token for client
- **THEN** old token is invalidated
- **AND** new token is generated and associated with client
- **AND** user is notified of token change

### Requirement: Connection Information
The system SHALL provide connection information for clients to connect to MCP Router.

#### Scenario: Display connection information
- **WHEN** user views client connection info
- **THEN** system displays:
  - HTTP endpoint: `http://localhost:3282/mcp`
  - Token: `Bearer mcpr_xxxxx`
  - Example configuration (JSON format)
- **AND** information can be copied to clipboard

#### Scenario: Copy connection command
- **WHEN** user copies connection information
- **THEN** system copies formatted configuration to clipboard
- **AND** configuration is ready to paste into client application config
- **AND** format matches client's expected configuration format

### Requirement: Connection Testing
The system SHALL support testing client connections.

#### Scenario: Test client connection
- **WHEN** user tests client connection
- **THEN** system attempts to authenticate with client's token
- **AND** connection result is displayed to user
- **AND** test verifies token validity and HTTP server availability

#### Scenario: Connection status display
- **WHEN** client is connected
- **THEN** system displays connection status in client list
- **AND** status updates in real-time
- **AND** last connection time is tracked

### Requirement: Client Configuration Export
The system SHALL support exporting client configuration in various formats.

#### Scenario: Export Claude Desktop configuration
- **WHEN** user exports configuration for Claude Desktop
- **THEN** system generates JSON configuration matching Claude Desktop format
- **AND** configuration includes endpoint URL and token
- **AND** configuration can be copied or saved to file

#### Scenario: Export Cursor configuration
- **WHEN** user exports configuration for Cursor
- **THEN** system generates configuration matching Cursor's expected format
- **AND** configuration includes all necessary connection details

