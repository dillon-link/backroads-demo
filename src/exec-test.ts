// Direct executor test: runs the real tabs against a real BackroadSession,
// capturing render payloads instead of sending them over a socket.
import { BackroadSession } from '@backroad/backroad/src/lib/server/sessions/session';
import { learnTab } from './tabs/learn';
import { playgroundTab } from './tabs/playground';

const seen: { type: string; args?: { body?: string } }[] = [];

async function main() {
  const session = new BackroadSession('exec-test');
  session.renderQueue.addToQueue = ((payload: string) => {
    const raw = JSON.parse(payload);
    seen.push(raw && typeof raw === 'object' && 'json' in raw ? raw.json : raw);
  }) as typeof session.renderQueue.addToQueue;

  const br = session.mainPageNodeManager;
  const [learn, play] = br.tabs({ labels: ['Learn', 'Playground'] });
  learnTab(learn);
  await playgroundTab(br as never, play);

  console.log('nodes:', seen.length);
  console.log('types:', [...new Set(seen.map((n) => n.type))].sort().join(', '));
  for (const n of seen.filter((n) => n.type === 'markdown').slice(0, 10))
    console.log(' -', JSON.stringify(String(n.args?.body).slice(0, 80)));
  if (!seen.length) {
    console.error('EXEC FAIL: empty tree');
    process.exit(1);
  }
  console.log('EXEC OK');
}

main().catch((e) => {
  console.error('EXEC FAIL', e);
  process.exit(1);
});
