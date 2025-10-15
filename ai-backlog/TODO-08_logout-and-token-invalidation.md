# TODO-08 Logout and Token Invalidation

## Description (Jira Style)

As a logged-in user, I want to log out so that my refresh token can no longer be used to obtain new access tokens.

## Scope

- POST /api/auth/logout endpoint.
- Clear refresh token cookie.
- Revoke (invalidate) the current refresh token (and optionally its family if security posture demands — decision: only specific token unless reuse flagged before).
- Idempotent: multiple logout calls succeed with 200 (even if already logged out).
- Unit + integration tests.

## Out of Scope

- Device/session management UI.
- Access token immediate blacklisting (access tokens simply expire naturally).

## Acceptance Criteria

Given a valid session, When I POST /api/auth/logout, Then my refresh token is revoked and cookie cleared.
Given a second logout attempt with same (now revoked) token, When I POST /api/auth/logout, Then I still receive 200.
Given no refresh token cookie, When I POST /api/auth/logout, Then I receive 200 (idempotent behavior).

## Gherkin Scenarios

```gherkin
Scenario: Successful logout
  Given an authenticated session with a refresh token
  When I POST /api/auth/logout
  Then the response status is 200
  And the refresh token is revoked
  And the cookie is cleared

Scenario: Repeated logout
  Given I have already logged out
  When I POST /api/auth/logout again
  Then the response status is 200

Scenario: Logout without cookie
  Given no refresh token cookie is present
  When I POST /api/auth/logout
  Then the response status is 200
```

## Risks

- Failing to revoke token leaves session active.
- Clearing cookie but not store entry enables reuse.

## Mitigations

- Always revoke before clearing cookie.
- Add test verifying revoked token cannot refresh.

## Roadmap Steps

1. Implement revokeRefreshToken(token) in refresh store.
2. Implement logout controller (parse cookie, revoke, clear cookie, return 200).
3. Add unit tests for revocation logic.
4. Add integration tests (logout success, repeated logout, logout without cookie).
5. Ensure audit logger (TODO-07) captures LOGOUT event when integrated.

## Definition of Done

- All Gherkin scenarios tested.
- Revoked token cannot obtain new access token.
- Cookie cleared consistently.

## Linked tasks

- TODO-06_token-refresh-and-revocation (shares store logic)
- TODO-07_audit-logging-and-security-monitoring (emits logout event)
