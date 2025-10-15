# TODO-04 Protect Todo Endpoints

## Description (Jira Style)

As an authenticated user, I want my Todo operations to be restricted to my own data so that other users cannot access or modify my Todos.

## Scope

- Middleware to authenticate access tokens on protected routes.
- Associate Todos with a userId (extend in-memory model + service adaptation).
- Update CRUD operations to filter by requesting user's userId.
- Return 401 when token missing/invalid; 403 not required if ownership check returns empty result.
- Update integration tests to cover authorization gating.
- Backfill existing tests to create a user + token where needed.

## Out of Scope

- Role-based access control (RBAC).
- Soft delete (separate refinement task if added later).

## Acceptance Criteria

Given a valid access token belonging to a user, When I GET /api/todos, Then only that user's todos are returned.
Given a request without a token, When I GET /api/todos, Then the response status is 401.
Given a token for user A, When I try to GET/PUT/DELETE a todo created by user B, Then the response is 404 (resource not found) and doesn't leak existence.
Given a valid token, When I POST /api/todos, Then the created todo is associated with my userId.

## Gherkin Scenarios

```gherkin
Scenario: Listing only own todos
  Given user A has 2 todos and user B has 1 todo
  And I authenticate as user A
  When I GET /api/todos
  Then I see only 2 todos

Scenario: Missing token
  When I GET /api/todos without an Authorization header
  Then the response status is 401

Scenario: Accessing another user's todo
  Given a todo owned by user B
  And I authenticate as user A
  When I GET /api/todos/{id}
  Then the response status is 404

Scenario: Creating a todo attaches ownership
  Given I authenticate as user A
  When I POST /api/todos with a valid payload
  Then the stored todo's userId equals user A's id
```

## Risks

- Security bypass if middleware not applied to all routes.
- Performance overhead if filtering implemented inefficiently (minor for in-memory now).

## Mitigations

- Add regression test verifying all /api/todos routes require auth.
- Centralize route protection via router-level middleware.

## Roadmap Steps

1. Extend Todo model with userId.
2. Add auth middleware (verify, attach req.user).
3. Update service methods to enforce user scoping.
4. Adjust controller tests for new auth requirement.
5. Add new integration tests for ownership and denial cases.
6. Document protection strategy in backlog.

## Definition of Done

- All todo routes require valid token.
- Ownership enforcement tested (positive & negative paths).
- No cross-user data exposure in responses.

## Linked tasks

- TODO-01_authentication-foundation (prerequisite)
- TODO-03_login-and-session-management (provides tokens)
- TODO-06_token-refresh-and-revocation (tokens impact protected routes)
