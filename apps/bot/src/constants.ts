import { Types } from 'telegraf';

export const allowedUpdates: Types.UpdateType[] = [
  'message',
  'edited_message',
  'channel_post',
  'edited_channel_post',
  'message_reaction',
  'message_reaction_count',
  'inline_query',
  'chosen_inline_result',
  'callback_query',
  'shipping_query',
  'pre_checkout_query',
  'poll',
  'poll_answer',
  'my_chat_member',
  'chat_member',
  'chat_join_request',
  'chat_boost',
  'removed_chat_boost',
];
