import { run } from '@backroad/backroad';
import 'dotenv/config';
import { learnTab } from './tabs/learn';
import { playgroundTab } from './tabs/playground';

run(
  async (br) => {
    br.title({ label: 'Backroad in 5 minutes' });
    br.write({ body: 'Server-driven React UI. You write one Node script — no React `useState`, no `fetch`, no API routes.' });

    const sb = br.sidebar({});
    sb.write({ body: '**Backroad demo**' });
    sb.link({ label: 'Docs', href: 'https://backroad.sudomakes.art/docs' });

    const [learn, play] = br.tabs({ labels: ['Learn', 'Playground'] });

    learnTab(learn);
    await playgroundTab(br, play);

    br.write({ body: '---\nBuilt with [`@backroad/backroad`](https://backroad.sudomakes.art/docs) · one Node process.' });
  },
  { server: { port: 3333 }, appearance: { theme: 'default', mode: 'light' } },
);
