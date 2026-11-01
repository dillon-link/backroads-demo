import type { BackroadNodeManager } from '@backroad/backroad';

type Br = BackroadNodeManager<any>;

export function textInputExample(play: Br) {
  play.write({ body: '### 1 · Text input' });
  const [live, code] = play.columns({ columns: 2 });
  const name = live.textInput({ id: 'name', label: 'Your name', placeholder: 'Ada' });
  if (name) live.write({ body: `Hello, **${name}** — typed, re-ran, rendered. No hooks.` });
  code.write({
    body: [
      '```ts',
      'const name = br.textInput({',
      "  label: 'Your name',",
      '});',
      'if (name) br.write({',
      '  body: `Hello, **${name}**!`,',
      '});',
      '```',
    ].join('\n'),
  });
}
