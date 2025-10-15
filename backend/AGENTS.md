# AGENTS.md — Backend

- Use modular Express with routes and controllers.
- Place business logic in `src/services`.
- Controllers should only validate and delegate logic.
- Centralized error handling.
- Use Vitest and Supertest for testing.

## CORS

The server enables CORS via the `cors` middleware. To restrict allowed origins set the environment variable `FRONTEND_ORIGIN` to a comma-separated list of origins, e.g.:

```bash
FRONTEND_ORIGIN=http://localhost:5173,http://localhost:4173
```

If `FRONTEND_ORIGIN` is unset, `*` is used (public access). Preflight `OPTIONS` requests are handled automatically.
