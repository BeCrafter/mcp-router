## ADDED Requirements

### Requirement: HTTP Server Startup
The system SHALL start an HTTP server on port 3282 to receive MCP requests from clients.

#### Scenario: Server startup on application launch
- **WHEN** application starts
- **THEN** HTTP server starts listening on port 3282
- **AND** server is ready to accept MCP requests
- **AND** if port is already in use, error is displayed to user

#### Scenario: Server startup failure handling
- **WHEN** port 3282 is already occupied
- **THEN** system displays error message with port conflict information
- **AND** user is provided with options to change port or stop conflicting process

### Requirement: Token Authentication
The system SHALL authenticate all HTTP requests using Bearer token from Authorization header.

#### Scenario: Valid token authentication
- **WHEN** client sends request with valid Bearer token in Authorization header
- **THEN** request is authenticated and processed
- **AND** token is validated against stored tokens in database

#### Scenario: Invalid token authentication
- **WHEN** client sends request with invalid or missing token
- **THEN** request is rejected with 401 Unauthorized status
- **AND** error message indicates authentication failure

#### Scenario: Token validation
- **WHEN** token is validated
- **THEN** system checks token against database
- **AND** token metadata (client app, creation time) is retrieved
- **AND** token can be associated with specific client application

### Requirement: Project Header Filtering
The system SHALL support filtering tools by project using X-MCPR-Project header.

#### Scenario: Request with project header
- **WHEN** client sends request with `X-MCPR-Project` header
- **THEN** system extracts project name from header
- **AND** project name is added to request metadata
- **AND** aggregator filters tools by specified project

#### Scenario: Request without project header
- **WHEN** client sends request without `X-MCPR-Project` header
- **THEN** system processes request without project filtering
- **AND** all enabled tools from all projects are available

#### Scenario: Invalid project header
- **WHEN** client sends request with non-existent project name
- **THEN** system processes request but returns empty tool list
- **AND** no error is returned (graceful degradation)

### Requirement: Request Metadata Injection
The system SHALL inject metadata into request body before forwarding to aggregator.

#### Scenario: Metadata injection
- **WHEN** request is received
- **THEN** system adds `_meta` object to request body
- **AND** `_meta` contains token information and project ID
- **AND** modified request is forwarded to aggregator

#### Scenario: Metadata structure
- **WHEN** metadata is injected
- **THEN** `_meta` object contains:
  - `token`: string (token value)
  - `projectId`: string | null (project ID if project header provided)

### Requirement: MCP Endpoint Handling
The system SHALL handle MCP protocol requests on `/mcp` endpoint.

#### Scenario: POST request to /mcp
- **WHEN** client sends POST request to `/mcp` endpoint
- **THEN** request is routed to aggregator for processing
- **AND** response is returned to client in MCP protocol format

#### Scenario: Request routing
- **WHEN** MCP request is received
- **THEN** request type is determined (tools/list, tools/call, resources/list, etc.)
- **AND** request is routed to appropriate handler in aggregator
- **AND** response is formatted according to MCP protocol

### Requirement: Error Handling
The system SHALL handle errors gracefully and return appropriate HTTP status codes.

#### Scenario: Internal server error
- **WHEN** error occurs during request processing
- **THEN** system returns 500 Internal Server Error
- **AND** error details are logged for troubleshooting
- **AND** client receives generic error message (no sensitive information)

#### Scenario: Request timeout
- **WHEN** request processing exceeds timeout (default 60 minutes, configurable)
- **THEN** system returns timeout error
- **AND** request is cancelled
- **AND** error is logged

