import { FilterQuery } from 'grammy';

interface FilterQueryDictionary {
  [key: string]: FilterQuery;
}

export const UpdateEvent: FilterQueryDictionary = {
  CHAT_MEMBER: 'chat_member',
  MESSAGE_REACTION: 'message_reaction',
  EDITED_MESSAGE: 'edited_message',
  MESSAGE: 'message',
};

export const IgnoreEvent: FilterQueryDictionary = {
  MESSAGE_NEW_MEMBERS: 'message:new_chat_members',
  MESSAGE_LEFT_MEMBER: 'message:left_chat_member',
};

export const TelegramAction = {
  SEND_MESSAGE: 'SEND_MESSAGE',
};
