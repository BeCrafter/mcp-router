## ADDED Requirements

### Requirement: Request Logging
The system SHALL log all MCP requests to JSONL format files, with one JSON object per line.

#### Scenario: Log tool call request
- **WHEN** tool call request is processed
- **THEN** system logs request to current date's log file
- **AND** log entry contains: timestamp, request type, parameters, response, execution duration, status
- **AND** log is written in JSONL format (one JSON object per line)

#### Scenario: Log tools/list request
- **WHEN** tools/list request is received
- **THEN** system logs request with timestamp and response summary
- **AND** log entry includes request metadata (token, project ID if applicable)

#### Scenario: Log error requests
- **WHEN** request fails with error
- **THEN** system logs error details including error message and stack trace
- **AND** error is marked with status: "error" in log entry

### Requirement: Date-Based Log File Organization
The system SHALL organize log files by date, with format `request-logs-YYYY-MM-DD.jsonl`.

#### Scenario: Create daily log file
- **WHEN** first request of the day is processed
- **THEN** system creates new log file: `request-logs-YYYY-MM-DD.jsonl`
- **AND** log file is created in workspace-specific directory: `logs/workspace-{id}/`
- **AND** subsequent requests on same day append to same file

#### Scenario: Switch to new day log file
- **WHEN** date changes (midnight)
- **THEN** system automatically switches to new day's log file
- **AND** previous day's log file is closed
- **AND** new requests are written to new file

### Requirement: Log File Automatic Cleanup
The system SHALL automatically delete log files older than 3 days.

#### Scenario: Cleanup on application startup
- **WHEN** application starts
- **THEN** system scans log directories for files older than 3 days
- **AND** files older than 3 days are deleted
- **AND** cleanup operation is logged

#### Scenario: Daily cleanup task
- **WHEN** daily cleanup task runs
- **THEN** system checks all workspace log directories
- **AND** files older than 3 days are deleted
- **AND** cleanup preserves files from last 3 days

#### Scenario: Cleanup preserves recent logs
- **WHEN** cleanup runs
- **THEN** system preserves logs from last 3 days (including today)
- **AND** only files older than 3 days are deleted
- **AND** cleanup does not affect current day's log file

### Requirement: Log Reading and Querying
The system SHALL support reading and querying logs from log files.

#### Scenario: Read logs from current day
- **WHEN** user views logs in UI
- **THEN** system reads from current day's log file
- **AND** logs are displayed in chronological order
- **AND** new log entries are automatically appended to view

#### Scenario: Read logs from specific date
- **WHEN** user selects a date in log viewer
- **THEN** system reads from that date's log file
- **AND** if file does not exist, empty list is displayed
- **AND** logs are displayed in chronological order

#### Scenario: Search logs
- **WHEN** user searches logs with query
- **THEN** system searches across last 3 days of log files
- **AND** matching log entries are returned
- **AND** search includes request parameters, responses, and error messages

### Requirement: Log Filtering
The system SHALL support filtering logs by server, request type, time range, and status.

#### Scenario: Filter by server
- **WHEN** user filters logs by server name
- **THEN** system returns only logs from that server
- **AND** filter is applied across all available log files

#### Scenario: Filter by request type
- **WHEN** user filters logs by request type (tools/call, tools/list, etc.)
- **THEN** system returns only logs matching that request type
- **AND** filter is applied to search results

#### Scenario: Filter by time range
- **WHEN** user filters logs by time range
- **THEN** system returns only logs within specified time range
- **AND** time range can span multiple days (within 3-day retention)

#### Scenario: Filter by status
- **WHEN** user filters logs by status (success/error)
- **THEN** system returns only logs matching that status
- **AND** filter helps identify failed requests

### Requirement: Log Statistics
The system SHALL provide statistics about logged requests.

#### Scenario: Display request statistics
- **WHEN** user views log statistics
- **THEN** system displays: total requests, success rate, average execution time, requests per server
- **AND** statistics are calculated from last 3 days of logs
- **AND** statistics update in real-time as new requests are logged

#### Scenario: Tool usage statistics
- **WHEN** user views tool usage
- **THEN** system displays frequency of each tool call
- **AND** statistics show most used tools
- **AND** statistics help identify tool usage patterns

### Requirement: Workspace Log Isolation
The system SHALL store logs in workspace-specific directories.

#### Scenario: Log to workspace directory
- **WHEN** request is logged
- **THEN** log is written to `logs/workspace-{id}/request-logs-YYYY-MM-DD.jsonl`
- **AND** logs from different workspaces are completely isolated
- **AND** workspace ID is determined from current workspace context

#### Scenario: Switch workspace logs
- **WHEN** user switches workspace
- **THEN** log viewer automatically switches to new workspace's log directory
- **AND** logs from previous workspace are no longer visible
- **AND** new workspace's logs are loaded

