import type { BackroadNodeManager } from '@backroad/backroad';
import { textInputExample } from '../examples/text-input';
import { minimalAppExample } from '../examples/minimal-app';
import { selectExample } from '../examples/select';
import { chartTableExample } from '../examples/chart-table';
import { echoChatExample } from '../examples/echo-chat';
import { aiChatExample } from '../examples/ai-chat';

type Br = BackroadNodeManager<any>;

export async function playgroundTab(br: Br, play: Br) {
  textInputExample(play);
  minimalAppExample(br, play);
  selectExample(play);
  chartTableExample(play);
  await echoChatExample(br, play);
  await aiChatExample(br, play);
}
