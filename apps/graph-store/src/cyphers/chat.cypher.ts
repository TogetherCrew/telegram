export const CREATE_OR_UPDATE_CHAT = `
  MERGE(chat:TGChat { id: $chat_id })
    ON CREATE
      SET chat = apoc.map.merge(chat, $chat_params),
        chat.created_at = timestamp(),
        chat.updated_at = timestamp()
    ON MATCH
        SET chat = apoc.map.merge(chat, apoc.map.clean($chat_params, ['id'], [null])),
          chat.updated_at = timestamp()
  RETURN chat
`;
