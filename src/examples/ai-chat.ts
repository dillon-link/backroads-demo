import type { BackroadNodeManager } from '@backroad/backroad';
import { answer, type Msg } from '../ai';

type Br = BackroadNodeManager<any>;

export async function aiChatExample(br: Br, play: Br) {
  play.write({ body: '### 6 · Real AI chat' });
  const [live, code] = play.columns({ columns: 2 });
  const hist = br.getOrDefault<Msg[]>('history', []);
  for (const m of hist) live.chatMessage({ by: m.by }).write({ body: m.content });
  if (live.button({ id: 'clear', label: 'Clear chat' })) br.setValue('history', []);
  if (!process.env.OPENAI_API_KEY)
    live.write({ body: '_Demo mode: set `OPENAI_API_KEY` for real answers._' });
  const next = live.chatInput({ id: 'chat', placeholder: 'Ask about Backroad…' });
  if (next) {
    live.chatMessage({ by: 'human' }).write({ body: next });
    const text = await live.chatMessage({ by: 'ai' }).writeStream(answer(hist, next));
    br.setValue('history', [...hist, { by: 'human', content: next }, { by: 'ai', content: text }]);
  }
  code.write({
    body: [
      '```ts',
      "import { answer }",
      "  from './ai';",
      'const text = await br',
      "  .chatMessage({ by: 'ai' })",
      '  .writeStream(',
      '    answer(history,',
      '      next));',
      '```',
    ].join('\n'),
  });
}
