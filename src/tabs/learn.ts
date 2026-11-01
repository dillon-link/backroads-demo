import type { BackroadNodeManager } from '@backroad/backroad';

type Br = BackroadNodeManager<any>;

export function learnTab(learn: Br) {
  learn.write({
    body: [
      '## What is Backroad?',
      'One TypeScript script → a real web page. No frontend project.',
      '',
      '```ts',
      "const name = br.textInput({ label: 'Your name' });",
      '// User types "Alex" → `name` is "Alex". No callbacks, no state.',
      '```',
      '',
      '### You write',
      '- One script, top to bottom — like a CLI script.',
      '- Ask with `br`, use the answer on the next line, show with `br.write()`.',
      '',
      '### You skip',
      '- No React, `useState`, `useEffect`.',
      '- No `fetch`, no API routes.',
      '- No spinners, no socket code.',
    ].join('\n'),
  });
  learn.collapse({ label: 'How re-run works' }).write({
    body: [
      'Every action re-runs your script from the top.',
      '',
      '1. Script runs → shows an empty input.',
      '2. You type "Alex" → sent back to the server.',
      '3. Script runs again → `name` is "Alex" → shows "Hello, Alex!".',
      '',
      'Inputs are remembered, only changes update.',
    ].join('\n'),
  });
}
