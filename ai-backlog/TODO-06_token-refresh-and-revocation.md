# TODO-06 Token Refresh and Revocation

## Description (Jira Style)

As an authenticated user, I want to seamlessly refresh my session so that I can stay logged in without frequent re-authentication, while allowing the system to revoke compromised tokens.

## Scope

- POST /api/auth/refresh endpoint (reads refresh token from HttpOnly cookie).
- Validate refresh token (signature + presence in allowlist + not revoked + not expired + matches rotation family).
- Rotate refresh tokens (issue new refresh + access, invalidate old refresh).
- Maintain in-memory refresh store (userId, tokenId, expiry, revoked flag, parent chain id for rotation integrity).
- Revoke on detection of reuse (compromised scenario) -> invalidate family.
- Return new access token + set new refresh cookie.

## Out of Scope

- Persistent storage of refresh tokens.
- Device/session listing UI.

## Acceptance Criteria

Given a valid refresh token, When I POST /api/auth/refresh, Then I receive 200 with a new access token and a new refresh cookie.
Given an expired refresh token, When I refresh, Then I receive 401 and cookie cleared.
Given a revoked refresh token, When I refresh, Then I receive 401 and cookie cleared.
Given a reused (already rotated) refresh token, When I refresh, Then the entire token family is revoked and future refresh attempts fail.

## Gherkin Scenarios

```gherkin
Scenario: Successful refresh
  Given a valid refresh token
  When I POST /api/auth/refresh
  Then I receive a new access token and refresh cookie

Scenario: Expired refresh token
  Given an expired refresh token
  When I POST /api/auth/refresh
  Then the response status is 401

Scenario: Revoked token
  Given a revoked refresh token
  When I POST /api/auth/refresh
  Then the response status is 401

Scenario: Refresh token reuse (token theft)
  Given a refresh token already rotated
  When I POST /api/auth/refresh with that token
  Then the response status is 401
  And the token family is revoked
```

## Risks

- Token family tracking bugs enabling reuse.
- Memory growth without cleanup.
- Race conditions during rotation.

## Mitigations

- Include simple cleanup job for expired tokens (on access or periodic).
- Use atomic replacement pattern (mark old token revoked before issuing new one).
- Comprehensive tests for rotation & reuse detection.

## Roadmap Steps

1. Define refresh token store model.
2. Implement generation + persistence on login (update TODO-03 usage notes if needed).
3. Implement refresh endpoint logic (validate, rotate, detect reuse).
4. Add unit tests for store operations & reuse detection.
5. Add integration tests for successful & failure scenarios.
6. Add cleanup logic (lazy removal on access of expired tokens).
7. Document rotation & revocation strategy.

## Definition of Done

- All Gherkin scenarios implemented & tested.
- Reuse triggers family revocation.
- Expired/revoked tokens never issue new access tokens.

## Linked tasks

- TODO-03_login-and-session-management (prerequisite issuing refresh tokens)
- TODO-08_logout-and-token-invalidation (revocation overlaps)
