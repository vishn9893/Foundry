# Foundry API

The local backend provides the first access-controlled vertical slice for the marketplace.

## Run

```bash
npm run server
```

The API listens on `http://localhost:8787`. The SQLite database is created at `data/foundry.sqlite`.

## Current API surface

- `POST /api/auth/register` — creates a user and private workspace
- `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- `GET/PATCH /api/workspace/settings` — owner/admin settings
- `GET/PUT /api/workspace/docs` — shared workspace documentation
- `GET /api/workspace/members` — list members
- `POST /api/workspace/members/invite` — add an existing account to a workspace
- `PATCH/DELETE /api/workspace/members/:userId` — change role/status or remove a member
- `GET/POST /api/sources` — list or add Git sources
- `POST /api/sources/:sourceId/sync` — queue a real `git clone`/`git pull`
- `GET/POST /api/skills` — list workspace skills or create a persisted skill
- `GET /api/health`

Roles are `owner`, `admin`, `editor`, and `viewer`. Passwords are hashed with Node's built-in `scrypt`; sessions are stored in SQLite and returned as HTTP-only cookies.

The sync worker fetches repositories and indexes `SKILL.md` frontmatter into the workspace skills table. Private-repository credential storage, scheduled jobs, and email invitations are the next production-hardening steps.
