# TODO-05 Password Reset Flow

## Description (Jira Style)

As a user who has forgotten my password, I want a secure reset mechanism so that I can regain access to my account without compromising security.

## Scope

- POST /api/auth/password/request (accepts email) — always responds 202 (accepted) to avoid enumeration.
- POST /api/auth/password/reset (token + newPassword).
- Generate time-limited, single-use reset token (in-memory store with expiry & used flag).
- Token complexity: unguessable (>= 32 bytes base64 or UUIDv4 + HMAC).
- Validation on password complexity (reuse registration rules).
- Unit + integration tests.

## Out of Scope

- Email delivery (mock only / placeholder comment).
- Frontend UI.
- Rate limiting.

## Acceptance Criteria

Given an existing user email, When I request password reset, Then I receive 202 regardless of email validity.
Given a valid unused reset token and strong password, When I submit reset, Then the password is updated and token invalidated.
Given an invalid or expired token, When I submit reset, Then I receive 400 or 410 (decision: 400 generic invalid token) and password is unchanged.
Given a reused token, When I submit again, Then it fails with 400.

## Gherkin Scenarios

```gherkin
Scenario: Request reset for existing email
  Given a registered user with email "user@example.com"
  When I POST /api/auth/password/request with that email
  Then the response status is 202

Scenario: Request reset for unknown email
  Given no user with email "nouser@example.com"
  When I POST /api/auth/password/request
  Then the response status is 202

Scenario: Successful password reset
  Given a valid reset token for user@example.com
  When I POST /api/auth/password/reset with the token and a strong new password
  Then the response status is 200
  And subsequent login with the new password succeeds

Scenario: Expired token
  Given an expired reset token
  When I POST /api/auth/password/reset
  Then the response status is 400

Scenario: Reused token
  Given a reset token already used once
  When I POST /api/auth/password/reset again
  Then the response status is 400
```

## Risks

- Token leakage enabling unauthorized reset.
- Timing for token validity not enforced properly.
- Enumeration via different responses.

## Mitigations

- Generic 202 for request endpoint.
- Store hashed reset tokens (optional hardening) — decision: store raw for in-memory simplicity, upgrade later.
- Enforce single-use by marking token consumed.

## Roadmap Steps

1. Define reset token model & repository (in-memory array/Map with expiry timestamp).
2. Implement request endpoint (generate token, store, log placeholder send action).
3. Implement reset endpoint (validate token, complexity check, update password hash, invalidate token).
4. Add unit tests (repository + service logic + token expiry logic).
5. Add integration tests (request, reset success/failure paths).
6. Document token format & security considerations.

## Definition of Done

- All scenarios tested.
- Tokens invalid after use or expiry.
- No user enumeration via responses.

## Linked tasks

- TODO-01_authentication-foundation (prerequisite)
- TODO-02_user-registration (requires existing users)
- TODO-03_login-and-session-management (login after reset)
