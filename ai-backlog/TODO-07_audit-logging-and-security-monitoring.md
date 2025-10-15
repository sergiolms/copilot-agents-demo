# TODO-07 Audit Logging and Security Monitoring

## Description (Jira Style)

As a security-conscious stakeholder, I want authentication events captured so that suspicious activity can be detected and investigated.

## Scope

- Central audit logger utility (structured events: timestamp, userId (optional), type, metadata).
- Capture events: registration success, login success, login failure, refresh success/failure, password reset request, password reset success/failure, logout, token reuse detection.
- In-memory event sink (array) with size cap + FIFO eviction.
- Endpoint (temporary secure dev-only) GET /api/_debug/audit (optional, guarded by env flag) — can be excluded from production build later.
- Unit tests for logger (cap & eviction) and event emission in key flows (mock hooks for future persistence).

## Out of Scope

- Persistent log storage.
- SIEM integration.
- Alerting system.

## Acceptance Criteria

Given auth flows occur, When events fire, Then they are recorded with required fields.
Given more events than capacity, When the cap is exceeded, Then the oldest events are dropped.
Given a login failure, When the event logs, Then it excludes the plaintext password.
Given the debug endpoint is disabled via env, When I call it, Then I receive 404.

## Gherkin Scenarios

```gherkin
Scenario: Recording a login success
  Given a successful login
  When the audit logger is queried
  Then a LOGIN_SUCCESS event is present with userId

Scenario: Capacity eviction
  Given the audit log capacity is 100
  And 101 events have been recorded
  When I inspect the log
  Then only the 100 most recent events remain

Scenario: Debug endpoint disabled
  Given the audit debug endpoint flag is off
  When I GET /api/_debug/audit
  Then the response status is 404
```

## Risks

- Sensitive data accidentally logged (passwords, tokens).
- Memory growth if cap not enforced.

## Mitigations

- Explicit allowlist of event fields.
- Enforce max capacity with tests.
- Redact any token content longer than N chars.

## Roadmap Steps

1. Implement audit logger utility with ring buffer design.
2. Integrate emits in existing auth flows (registration, login, refresh, reset, logout).
3. Add optional debug endpoint behind env flag.
4. Add unit tests for logger capacity & field safety.
5. Add integration tests for sample events (login + refresh + reset + logout).
6. Document event types and fields.

## Definition of Done

- Events emitted for all scoped flows.
- No sensitive secrets in event data.
- Capacity respected with eviction.

## Linked tasks

- TODO-03_login-and-session-management (emits login events)
- TODO-06_token-refresh-and-revocation (emits refresh/reuse events)
- TODO-08_logout-and-token-invalidation (emits logout events)
