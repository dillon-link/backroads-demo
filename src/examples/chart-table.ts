import type { BackroadNodeManager } from '@backroad/backroad';

type Br = BackroadNodeManager<any>;

export function chartTableExample(play: Br) {
  play.write({ body: '### 4 · Chart + table' });
  const [live, code] = play.columns({ columns: 2 });
  live.bar({
    data: { labels: ['Backroad', 'Streamlit'], datasets: [{ label: 'Boilerplate (lines)', data: [8, 40] }] },
  });
  live.table({
    data: [
      { area: 'Language', backroad: 'TypeScript', streamlit: 'Python' },
      { area: 'State', backroad: 'server, by id', streamlit: 'server, by order' },
      { area: 'Frontend code', backroad: 'none', streamlit: 'none' },
    ],
    columns: { area: { header: 'Area' }, backroad: { header: 'Backroad' }, streamlit: { header: 'Streamlit' } },
  });
  code.write({
    body: [
      '```ts',
      'br.bar({',
      '  data: { labels, datasets },',
      '});',
      'br.table({',
      '  data: [{ area, ... }],',
      '  columns: { area, ... },',
      '});',
      '```',
    ].join('\n'),
  });
}
