# TODO-03 Login and Session Management

## Description (Jira Style)

As a registered user, I want to log in securely so that I can obtain tokens to access protected endpoints.

## Scope

- POST /api/auth/login endpoint.
- Accept email + password.
- Validate credentials (constant-time password comparison via foundation util).
- Issue short-lived access token (JWT) and longer-lived refresh token.
- Decide transport: access token returned in JSON body; refresh token set as HttpOnly, Secure cookie (future HTTPS assumption) OR returned alongside (decision = cookie for security, fallback header disabled).
- Standard error for invalid credentials (no indication whether email or password incorrect).
- Optional configuration for token lifetimes (e.g., ACCESS=15m, REFRESH=7d – via env vars).
- Integration & unit tests.

## Out of Scope

- Refresh endpoint implementation (handled in TODO-06).
- Logout / revocation logic.
- Frontend UI.

## Acceptance Criteria

Given valid email/password pair, When I POST to /api/auth/login, Then I receive 200 with an access token and a refresh cookie.
Given invalid password, When I POST to /api/auth/login, Then I receive 401 with a generic invalid credentials error.
Given non-existing email, When I POST to /api/auth/login, Then I receive 401 with a generic invalid credentials error.
Given missing fields, When I POST to /api/auth/login, Then I receive 400 validation error.
Given a successful login, When I decode the access token, Then it contains user id and standard claims (iat, exp) and no password.

## Gherkin Scenarios

```gherkin
Scenario: Successful login
  Given a registered user with email "user@example.com" and password "StrongPass123!"
  When I POST to /api/auth/login with correct credentials
  Then the response status is 200
  And the body contains an access token
  And a refresh token cookie is set

Scenario: Invalid password
  Given a registered user with email "user@example.com" and password "StrongPass123!"
  When I POST to /api/auth/login with password "BadPass!"
  Then the response status is 401
  And the error message is generic

Scenario: Non-existent user
  Given no user with email "nouser@example.com"
  When I POST to /api/auth/login with any password
  Then the response status is 401
  And the error message is generic

Scenario: Missing fields
  When I POST to /api/auth/login with only email
  Then the response status is 400
  And the error references required fields

Scenario: Token claim validation
  Given a successful login
  When I decode the access token
  Then it contains a user id and an expiry claim
```

## Risks

- Brute force attempts without rate limiting.
- Leaking credential mismatch reason (user enumeration).
- Insecure cookie configuration in non-HTTPS dev.

## Mitigations

- Generic error responses.
- Document recommended rate limiting (future task).
- Set cookie with HttpOnly and Secure (allow override in dev via config flag).

## Roadmap Steps

1. Define login DTO + validation.
2. Implement service: authenticate(email, password) -> tokens or failure.
3. Add token generation (access + refresh) using foundation util.
4. Implement controller & route with proper HTTP codes.
5. Set refresh token cookie with correct attributes.
6. Add unit tests (service success/failure, token payload).
7. Add integration tests for each scenario.
8. Update auth documentation referencing token issuance.

## Definition of Done

- All Gherkin scenarios tested automatically.
- No differentiation in error messages for email vs password mismatch.
- Refresh token cookie present on success and not on failures.
- Access token verifies successfully with foundation public logic.

## Linked tasks

- TODO-01_authentication-foundation (prerequisite)
- TODO-02_user-registration (prerequisite)
- TODO-06_token-refresh-and-revocation (depends on issued refresh tokens)
- TODO-08_logout-and-token-invalidation (depends on login issuing refresh token)
