# Foundry Wiki

## What Foundry does

Foundry is a private, workspace-based catalog for AI-agent skills. A skill is a reusable capability described by a `SKILL.md` file and its frontmatter. Foundry provides the lifecycle around that file: connect a source, index it, review it, publish it, and download it.

## First-time setup

1. Open the web app and choose **Create one**.
2. Register with your name, email, and password.
3. Give the workspace a name. The registering account becomes the owner.
4. Use the top-right avatar to confirm the active account and sign out.
5. Open **Admin controls** to configure visibility, Git sources, direct uploads, and members.

## Adding skills

### Git repositories

Choose **Add a skill → Connect a Git repository**. Select GitHub, GitLab, Bitbucket, or Self-hosted / Generic Git. Enter the repository URL, branch, and sync frequency. Foundry stores the source in the current workspace.

The sync worker performs a shallow clone on first sync and a fast-forward pull on later syncs. It searches for `SKILL.md`, reads the frontmatter, and creates or updates a pending skill record.

### Direct publishing

Choose **Add a skill → Upload a skill directly**. Add a name, description, category, and comma-separated tags. Tags are used by search and category filtering. Direct submissions also enter pending review.

## Review and approval

Every new direct skill and every skill discovered by Git sync starts as `pending`. Pending skills are intentionally excluded from the marketplace and cannot be downloaded.

Owners and admins open **Admin controls → Reviews** to inspect the submitter, category, tags, and description. They can:

- **Approve**: changes the status to `approved`; the skill becomes visible and downloadable.
- **Reject**: changes the status to `rejected`; the skill remains out of the marketplace.

Review is workspace-scoped. An admin can only review skills belonging to their workspace.

## Roles and access

- **Owner**: full workspace control and member removal.
- **Admin**: settings, member roles, reviews, sources, and skills.
- **Editor**: add skills and connect or sync Git sources, but cannot approve submissions.
- **Viewer**: read approved skills and workspace documentation.

## Using the marketplace

Approved cards can be filtered by category and searched by skill name, description, tag, or author. Click a card to open its detail view. The detail view renders the frontmatter and provides a `SKILL.md` download.

## Documentation and wiki

The **Documentation** section stores workspace-specific guidance. The top-right `?` button opens this wiki view. Teams can use Documentation for conventions such as required frontmatter, naming, security expectations, and review standards.

## Sync and source management

The top-right sync button queues all connected sources. The **Git repositories connected to Foundry** panel lists provider, branch, status, Sync, and Delete actions. Deleting a source removes its database record and its local sync directory.

## Storage

Storage is calculated from the filesystem hosting Foundry's data directory. In Docker, this is the mounted `foundry-data` volume. It includes the SQLite database and cloned repository workspaces.

## Troubleshooting

- If the API is unavailable, check `GET /api/health` and confirm the API is running on port `8787`.
- If a skill is missing, check Admin controls → Reviews; it may still be pending.
- If sync fails, inspect the source status and `last_error`, then verify the URL, branch, credentials, and repository access.
- If storage does not change after deleting a source, restart the API process and confirm the source's sync directory has been removed from the data volume.
