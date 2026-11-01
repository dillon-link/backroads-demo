import type { BackroadNodeManager } from '@backroad/backroad';

type Br = BackroadNodeManager<any>;

export function selectExample(play: Br) {
  play.write({ body: '### 3 · Select' });
  const [live, code] = play.columns({ columns: 2 });
  const fw = live.select({
    id: 'fw',
    label: 'Pick one',
    defaultValue: 'backroad',
    options: [
      { value: 'backroad', label: 'Backroad' },
      { value: 'streamlit', label: 'Streamlit' },
    ],
  });
  if (fw) live.write({ body: `You picked **${fw}**.` });
  code.write({
    body: [
      '```ts',
      'const fw = br.select({',
      "  label: 'Pick one',",
      '  options: [',
      "    { value: 'backroad',",
      "      label: 'Backroad' },",
      '  ],',
      '});',
      '```',
    ].join('\n'),
  });
}
