# Foundry

Foundry is a workspace-based marketplace for reusable AI-agent skills. Teams can connect Git repositories or publish skills directly, review new submissions, and let authenticated users inspect and download approved `SKILL.md` files.

## Features

- Workspace registration and cookie-based authentication
- Role-based access: `owner`, `admin`, `editor`, and `viewer`
- Git sources for GitHub, GitLab, Bitbucket, and generic/self-hosted Git
- Repository clone/pull sync with `SKILL.md` indexing
- Direct skill publishing with categories and comma-separated tags
- Admin review queue for new direct and Git-synced skills
- Approved skill detail pages with frontmatter and `SKILL.md` download
- Workspace documentation/wiki, settings, member management, and source deletion
- Filesystem-backed storage reporting for the API data volume
- SQLite persistence for local development

## Local development

Requirements: Node.js 24+.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:8787`.

`npm run dev` starts both the API and frontend. There are no default credentials; choose **Create one** on the first launch to register the workspace owner.

## Workflow

1. Register an account. Foundry creates a private workspace and makes the account its owner.
2. Connect a Git repository or publish a skill directly.
3. New skills enter `pending` review status. They are not visible in the marketplace yet.
4. An owner or admin opens Admin controls → Reviews and approves or rejects the submission.
5. Approved skills appear in the marketplace. Authenticated users can open a card, inspect its frontmatter, and download `SKILL.md`.

## API

Authentication: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`

Workspace: `GET/PATCH /api/workspace/settings`, `GET/PUT /api/workspace/docs`, `GET /api/workspace/members`

Sources: `GET/POST /api/sources`, `POST /api/sources/:id/sync`, `DELETE /api/sources/:id`

Skills and review: `GET/POST /api/skills`, `GET /api/skills/:id`, `GET /api/reviews`, `PATCH /api/reviews/:id`

System: `GET /api/health`, `GET /api/system/storage`

## Docker

```bash
docker compose up --build
```

The container serves the built frontend and API on `http://localhost:8787`, with SQLite and synced repositories persisted in the `foundry-data` volume.

## Tests

```bash
npm run build
npm run test:e2e
```

The E2E suite covers registration, access control, workspace settings, docs, pending review, admin approval, skills, and source creation.

## Security notes

Passwords are hashed with Node `scrypt` and sessions use HTTP-only cookies. Production deployments should add HTTPS, CSRF protection, rate limiting, provider token/SSH secret storage, email invitations, scheduled jobs, and a managed database.
