import { FilterQuery } from 'grammy';

interface FilterQueryDictionary {
  [key: string]: FilterQuery;
}

export const UpdateEvent: FilterQueryDictionary = {
  MESSAGE_TEXT: 'message:text',
  CHAT_MEMBER: 'chat_member',
  EDITED_MESSAGE: 'edited_message',
};
