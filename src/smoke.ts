// Headless smoke test: boots the app server (if needed), then connects like
// the React client — per-tab namespace, run_script, collect render events.
import { io } from 'socket.io-client';
import { randomUUID } from 'crypto';
import { spawn, type ChildProcess } from 'child_process';

const PORT = 3333;
const URL = `http://localhost:${PORT}`;

async function healthOk(): Promise<boolean> {
  try {
    const r = await fetch(`${URL}/api/health`);
    return r.ok;
  } catch {
    return false;
  }
}

async function main() {
  let child: ChildProcess | null = null;
  if (!(await healthOk())) {
    child = spawn('npx', ['tsx', 'src/app.ts'], { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    child.stdout?.on('data', (d) => { out += String(d); });
    child.stderr?.on('data', (d) => { out += String(d); });
    const start = Date.now();
    while (!(await healthOk())) {
      if (Date.now() - start > 30000) {
        console.error('SMOKE FAIL: server did not start\n' + out);
        child.kill();
        process.exit(1);
      }
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  const done = (code: number) => {
    child?.kill();
    process.exit(code);
  };

  const tab = randomUUID();
  const socket = io(`${URL}/${tab}`, { path: '/api/socket.io' });
  const nodes: { type: string; args?: { body?: string } }[] = [];
  let idle: NodeJS.Timeout;

  socket.on('backroad_config', () => socket.emit('run_script', { pathname: '/' }));
  socket.on('render', (args: { nodes: string[] }) => {
    for (const n of args.nodes) {
      const raw = JSON.parse(n);
      nodes.push(raw && typeof raw === 'object' && 'json' in raw ? raw.json : raw);
    }
    clearTimeout(idle);
    idle = setTimeout(report, 1200);
  });
  socket.on('connect_error', (e) => {
    console.error('connect fail:', e.message);
    done(1);
  });

  function report() {
    console.log('nodes:', nodes.length);
    console.log('types:', [...new Set(nodes.map((n) => n.type))].sort().join(', '));
    for (const n of nodes.filter((n) => n.type === 'markdown').slice(0, 8))
      console.log(' -', JSON.stringify(String(n.args?.body).slice(0, 80)));
    if (!nodes.length) {
      console.error('SMOKE FAIL');
      done(1);
    }
    console.log('SMOKE OK');
    done(0);
  }
  setTimeout(() => {
    console.error('SMOKE TIMEOUT, nodes:', nodes.length);
    done(1);
  }, 30000);
}

main();
