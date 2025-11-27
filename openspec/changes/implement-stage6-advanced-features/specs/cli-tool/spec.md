## ADDED Requirements

### Requirement: Connect Command
The system SHALL provide a `connect` command that bridges stdio to MCP Router HTTP server.

#### Scenario: Connect to MCP Router
- **WHEN** user runs `npx -y @mcp_router/cli connect`
- **THEN** CLI creates stdio MCP server bridge
- **AND** bridge connects to `http://localhost:3282/mcp`
- **AND** stdio requests are forwarded to HTTP server
- **AND** responses are returned via stdio

#### Scenario: Connect with project parameter
- **WHEN** user runs `connect --project project-name`
- **THEN** CLI passes project name via `X-MCPR-Project` header
- **AND** only tools from specified project are available
- **AND** project filtering is applied to all requests

#### Scenario: Connect with token authentication
- **WHEN** user sets `MCPR_TOKEN` environment variable
- **THEN** CLI uses token for authentication
- **AND** token is sent in `Authorization: Bearer` header
- **AND** authentication is validated by HTTP server

#### Scenario: Connect error handling
- **WHEN** HTTP server is not available
- **THEN** CLI displays error message
- **AND** connection attempt fails gracefully
- **AND** user is informed of connection issue

### Requirement: Serve Command
The system SHALL provide a `serve` command that aggregates multiple stdio MCP servers and exposes them via HTTP.

#### Scenario: Serve multiple stdio servers
- **WHEN** user runs `serve --server name1 cmd1 --server name2 cmd2`
- **THEN** CLI starts HTTP server (default port 3283)
- **AND** each stdio server is connected via `StdioClientTransport`
- **AND** tools from all servers are aggregated
- **AND** aggregated tools are available via HTTP endpoint

#### Scenario: Serve with custom port
- **WHEN** user runs `serve --port 8080 --server name cmd`
- **THEN** HTTP server listens on specified port
- **AND** clients can connect to custom port
- **AND** port conflict is handled gracefully

#### Scenario: Serve server connection failure
- **WHEN** stdio server fails to start
- **THEN** CLI displays error for that specific server
- **AND** other servers continue to work
- **AND** failed server is excluded from aggregation

### Requirement: Stdio to HTTP Bridge
The system SHALL bridge stdio MCP protocol to HTTP MCP protocol.

#### Scenario: Bridge stdio request to HTTP
- **WHEN** stdio client sends MCP request
- **THEN** bridge converts request to HTTP POST
- **AND** request is sent to HTTP server
- **AND** HTTP response is converted back to stdio format
- **AND** response is returned to stdio client

#### Scenario: Bridge maintains protocol compatibility
- **WHEN** bridging requests
- **THEN** MCP protocol format is preserved
- **AND** request/response structure matches MCP specification
- **AND** no protocol information is lost in translation

### Requirement: HTTP to Stdio Aggregation
The system SHALL aggregate multiple stdio MCP servers and expose via HTTP.

#### Scenario: Aggregate stdio servers
- **WHEN** multiple stdio servers are specified
- **THEN** CLI creates `MCPAggregator` instance
- **AND** aggregator maintains `clients: Map<string, ServerClient>` mapping
- **AND** aggregator maintains `toolToServerMap: Map<string, string>` mapping
- **AND** all tools are combined into single HTTP endpoint

#### Scenario: Route tool calls to correct server
- **WHEN** HTTP client calls a tool
- **THEN** aggregator looks up tool in tool-to-server map
- **AND** request is routed to correct stdio server
- **AND** response is returned to HTTP client

#### Scenario: Aggregate tools list
- **WHEN** HTTP client requests tools/list
- **THEN** aggregator collects tools from all stdio servers
- **AND** combined tool list is returned
- **AND** tool names are unique (with server prefix if needed)

### Requirement: CLI Error Handling
The system SHALL handle errors gracefully and provide helpful error messages.

#### Scenario: Connection error
- **WHEN** connection to HTTP server fails
- **THEN** CLI displays clear error message
- **AND** error includes server address and port
- **AND** user is provided with troubleshooting suggestions

#### Scenario: Server startup error
- **WHEN** stdio server fails to start
- **THEN** CLI displays error for that server
- **AND** error includes command and error details
- **AND** other servers continue to work

#### Scenario: Protocol error
- **WHEN** MCP protocol error occurs
- **THEN** CLI displays protocol error message
- **AND** error is logged for debugging
- **AND** operation fails gracefully

