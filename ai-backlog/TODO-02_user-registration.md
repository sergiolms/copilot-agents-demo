# TODO-02 User Registration

## Description (Jira Style)
As a prospective user, I want to register an account so that I can log in and manage my Todos securely.

## Scope
- POST /api/auth/register endpoint.
- Accept email (or username) + password (and optional displayName placeholder for future profile).
- Input validation (email format, password minimum length & complexity rules baseline, trimming).
- Ensure uniqueness of email.
- Store hashed password only.
- Return minimal safe response (id + email + createdAt) without password.
- Unit tests (service + validation) and integration tests (endpoint).

## Out of Scope
- Email verification workflow.
- Rate limiting (future hardening task).
- Frontend UI changes (separate task if needed).

## Acceptance Criteria
Given a unique email and valid password, When I call POST /api/auth/register, Then I receive 201 with the new user id and email.
Given a duplicate email, When I register again, Then I receive 409 conflict.
Given a password below minimum length, When I register, Then I receive 400 with validation error.
Given an invalid email format, When I register, Then I receive 400 with validation error.
Given extra unexpected fields, When I register, Then they are ignored or cause validation failure (decide and test: default = reject unknown fields with 400).

## Gherkin Scenarios
```gherkin
Scenario: Successful registration
  Given a unique email "new@example.com" and password "StrongPass123!"
  When I POST to /api/auth/register
  Then the response status is 201
  And the response body contains the user id and email without password

Scenario: Duplicate email registration
  Given an existing user with email "dup@example.com"
  When I POST to /api/auth/register with the same email
  Then the response status is 409
  And the error indicates the email is already in use

Scenario: Weak password
  Given a password shorter than the minimum length
  When I attempt registration
  Then the response status is 400
  And the error references password requirements

Scenario: Invalid email
  Given an email without an '@'
  When I attempt registration
  Then the response status is 400
  And an email format error is returned

Scenario: Unknown fields provided
  Given I include a field "admin": true in the payload
  When I attempt registration
  Then the response status is 400
  And an unknown field error is returned
```

## Risks
- Timing attacks on uniqueness check (mitigate with uniform error messages—decision needed).
- User enumeration via different error messages.
- Storing plaintext or insufficiently hashed passwords.

## Mitigations
- Use consistent error wording for invalid credentials vs existing user (log precise cause internally).
- Enforce secure password hashing using foundation util.
- Centralize validation logic via DTO / schema.

## Roadmap Steps
1. Define registration DTO + validation (reuse core hashing util from foundation).
2. Extend in-memory user repository with findByEmail() uniqueness check.
3. Implement registration service (validate, hash, store, return sanitized user object).
4. Implement controller/route (POST /api/auth/register) mapping service errors to HTTP codes.
5. Add unit tests: validation, service success/failure paths.
6. Add integration tests: endpoint scenarios including conflicts, invalid input.
7. Documentation update in auth README/backlog referencing uniqueness logic.

## Definition of Done
- All Gherkin scenarios covered by automated tests.
- No password or hash leaked in responses or logs.
- Duplicate email returns correct HTTP 409.
- Unknown fields handling implemented per acceptance criteria.

## Linked tasks
- TODO-01_authentication-foundation (prerequisite)
- TODO-03_login-and-session-management (depends on registration to supply a user)
