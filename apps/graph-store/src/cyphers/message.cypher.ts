export const CREATE_OR_UPDATE_MESSAGE = `
  MATCH (user:TGUser { id: $user_id })-[:JOINED]->(chat:TGChat { id: $chat_id })
  MERGE (user)-[:CREATED_MESSAGE]->(message:TGMessage { id: $message_id })-[:SENT_IN]->(chat)
    ON CREATE
      SET message = apoc.map.merge(message, $params),
        message.created_at = timestamp(),
        message.updated_at = timestamp()
    ON MATCH
      SET message = apoc.map.merge(message, apoc.map.clean($params, ['id'], [null])),
        message.updated_at = timestamp()
  RETURN message
  `;
