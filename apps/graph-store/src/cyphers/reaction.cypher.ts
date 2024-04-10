export const CREATE_OR_UPDATE_REACTION = `
  MATCH (message:TGMessage { id: $message_id })-[:SENT_IN]->(chat:TGChat { id: $chat_id })
  MATCH (user:TGUser { id: $user_id })
  MERGE (user)-[r:REACTED_TO]->(message)
    ON CREATE
      SET r = apoc.map.merge(r, $params),
        r.created_at = timestamp(),
        r.updated_at = timestamp()
    ON MATCH
      SET r = apoc.map.merge(r, apoc.map.clean($params, ['id'], [null])),
        r.updated_at = timestamp()
  RETURN r
  `;
