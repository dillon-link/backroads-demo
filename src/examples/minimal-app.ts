import type { BackroadNodeManager } from '@backroad/backroad';

type Br = BackroadNodeManager<any>;

export function minimalAppExample(br: Br, play: Br) {
  play.write({ body: '### 2 · Minimal app — button + state' });
  const [live, code] = play.columns({ columns: 2 });
  let count = br.getOrDefault('count', 0);
  if (live.button({ id: 'inc', label: `Clicked ${count}×` })) {
    count += 1;
    br.setValue('count', count);
  }
  code.write({
    body: [
      '```ts',
      'import { run }',
      "  from '@backroad/backroad';",
      'run((br) => {',
      '  const name =',
      '    br.textInput({',
      "      label: 'Your name',",
      '    });',
      '  if (name) br.write({',
      '    body: `Hello!`,',
      '  });',
      '  let count =',
      '    br.getOrDefault(',
      "      'count', 0);",
      '  if (br.button({',
      "    label: 'Click',",
      '  })) {',
      '    br.setValue(',
      "      'count', count + 1);",
      '  }',
      '});',
      '```',
    ].join('\n'),
  });
}
