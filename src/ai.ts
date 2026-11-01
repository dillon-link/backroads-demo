import OpenAI from 'openai';

export type Msg = { by: 'human' | 'ai'; content: string };

const SYSTEM =
  'You explain Backroad, a server-driven UI framework for Node.js. ' +
  'One script calling br methods renders a React UI; every interaction re-runs the script. ' +
  'No useState, no fetch, no API routes. Same idea as Streamlit, but TypeScript. ' +
  'Answer briefly in markdown.';

// Async iterable of reply chunks. Falls back to a canned stream without a key.
export async function* answer(history: Msg[], prompt: string): AsyncGenerator<string> {
  if (!process.env.OPENAI_API_KEY) {
    yield* demoReply();
    return;
  }
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const stream = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM },
        ...history.map(
          (m): { role: 'user' | 'assistant'; content: string } => ({
            role: m.by === 'human' ? 'user' : 'assistant',
            content: m.content,
          }),
        ),
        { role: 'user', content: prompt },
      ],
      stream: true,
    });
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  } catch (err) {
    yield `AI error: ${err instanceof Error ? err.message : 'request failed'}`;
  }
}

async function* demoReply(): AsyncGenerator<string> {
  const text =
    'Demo mode — no `OPENAI_API_KEY` set, so I reply with canned text. ' +
    'Set the key and restart to get real answers. Either way, this bubble streams ' +
    'token-by-token via `br.chatMessage(...).writeStream(...)`, while your script owns the history.';
  for (const word of text.split(' ')) {
    await new Promise((r) => setTimeout(r, 30));
    yield word + ' ';
  }
}
