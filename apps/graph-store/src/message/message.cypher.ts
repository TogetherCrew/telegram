import { createOrUpdateChat, createOrUpdateUser } from '../helpers/cyphers';

const createMessage = `
MERGE (user)-[:CREATED_MESSAGE]->(message:TGMessage { id: $message.message_id })-[:SENT_IN]->(chat)
  ON CREATE
    SET message = apoc.map.merge(message, $message),
        message.created_at = timestamp(),
        message.updated_at = timestamp()
  ON MATCH
    SET message = apoc.map.merge(message, apoc.map.clean($message, ['id'], [null])),
      message.updated_at = timestamp()
RETURN message
`;

export const CREATE_MESSAGE = [
  createOrUpdateChat,
  createOrUpdateUser,
  createMessage,
].join('\n');

export const REPLIED = `
MATCH (chat:TGChat { id: chat.id })
MATCH (message:TGMessage { id: $message.message_id })-[:SENT_IN]->(chat)
MATCH (reply_to_message:TGMessage { id: $reply_to_message.message_id })-[:SENT_IN]->(chat)
MERGE (message)-[r:REPLIED]->(reply_to_message)
RETURN r
`;

export type MessageCypher = typeof CREATE_MESSAGE;
