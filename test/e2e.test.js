import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const port = 8899;
const dataDir = await mkdtemp(join(tmpdir(), 'foundry-e2e-'));
const server = spawn(process.execPath, ['server/index.js'], { cwd: process.cwd(), env: { ...process.env, PORT: String(port), FOUNDRY_DATA_DIR: dataDir }, stdio: 'ignore' });
const base = `http://127.0.0.1:${port}`;
const waitForServer = async () => { for (let i = 0; i < 30; i++) { try { if ((await fetch(`${base}/api/health`)).ok) return; } catch {} await new Promise(resolve => setTimeout(resolve, 100)); } throw new Error('Test server did not start'); };
await waitForServer();

test.after(async () => { server.kill('SIGTERM'); await rm(dataDir, { recursive: true, force: true }); });

test('registration, access control, workspace settings, docs, skills, and source flow', async () => {
  const register = await fetch(`${base}/api/auth/register`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: 'E2E Owner', email: 'e2e@example.test', password: 'password123', workspaceName: 'E2E Workspace' }) });
  assert.equal(register.status, 201);
  const cookie = register.headers.get('set-cookie').split(';')[0];
  const auth = { headers: { cookie, 'content-type': 'application/json' } };
  const me = await (await fetch(`${base}/api/auth/me`, auth)).json(); assert.equal(me.workspace.role, 'owner');
  const storage = await (await fetch(`${base}/api/system/storage`, auth)).json(); assert.ok(storage.totalBytes > 0); assert.ok(storage.usedBytes >= 0);
  const settings = await (await fetch(`${base}/api/workspace/settings`, { ...auth, method: 'PATCH', body: JSON.stringify({ visibility: 'team' }) })).json(); assert.equal(settings.visibility, 'team');
  const docs = await (await fetch(`${base}/api/workspace/docs`, { ...auth, method: 'PUT', body: JSON.stringify({ welcome: 'E2E docs' }) })).json(); assert.equal(docs.welcome, 'E2E docs');
  const skill = await (await fetch(`${base}/api/skills`, { ...auth, method: 'POST', body: JSON.stringify({ name: 'E2E Skill', description: 'Indexed skill', tags: ['test'] }) })).json(); assert.equal(skill.slug, 'e2e-skill');
  const skills = await (await fetch(`${base}/api/skills`, auth)).json(); assert.equal(skills.length, 1);
  const source = await (await fetch(`${base}/api/sources`, { ...auth, method: 'POST', body: JSON.stringify({ provider: 'bitbucket', repoUrl: 'https://example.com/team/skill.git', branch: 'main' }) })).json(); assert.equal(source.provider, 'bitbucket');
  const members = await (await fetch(`${base}/api/workspace/members`, auth)).json(); assert.equal(members[0].role, 'owner');
});
