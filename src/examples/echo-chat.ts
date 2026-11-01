import type { BackroadNodeManager } from '@backroad/backroad';
import type { Msg } from '../ai';

type Br = BackroadNodeManager<any>;

async function* echoWords(prompt: string): AsyncGenerator<string> {
  for (const w of `Echo: ${prompt}`.split(' ')) {
    await new Promise((r) => setTimeout(r, 60));
    yield w + ' ';
  }
}

export async function echoChatExample(br: Br, play: Br) {
  play.write({ body: '### 5 · Streaming echo chat' });
  const [live, code] = play.columns({ columns: 2 });
  const hist = br.getOrDefault<Msg[]>('starter-hist', []);
  for (const m of hist) live.chatMessage({ by: m.by }).write({ body: m.content });
  const next = live.chatInput({ id: 'starter-chat', placeholder: 'Say something…' });
  if (next) {
    live.chatMessage({ by: 'human' }).write({ body: next });
    const text = await live.chatMessage({ by: 'ai' }).writeStream(echoWords(next));
    br.setValue('starter-hist', [...hist, { by: 'human', content: next }, { by: 'ai', content: text }]);
  }
  code.write({
    body: [
      '```ts',
      'const next = br.chatInput({',
      "  placeholder: 'Ask…',",
      '});',
      'if (next) {',
      '  br.chatMessage({',
      "    by: 'human',",
      '  }).write({',
      '    body: next,',
      '  });',
      '  const text = await br',
      "    .chatMessage({ by: 'ai' })",
      '    .writeStream(',
      '      tokens(next));',
      '  history.push(',
      "    { by: 'human', ... },",
      "    { by: 'ai', ... });",
      '}',
      '```',
    ].join('\n'),
  });
}
