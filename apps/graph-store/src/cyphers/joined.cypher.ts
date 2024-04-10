export const CREATE_OR_UPDATE_JOINED = `
  MATCH (chat:TGChat { id: $chat_id })
  MATCH (user:TGUser { id: $user_id })
  MERGE (user)-[joined:JOINED]->(chat)
    ON CREATE
      SET joined = apoc.map.merge(joined, $joined_params),
      joined.created_at = timestamp(),
      joined.updated_at = timestamp()
    ON MATCH
      SET joined = apoc.map.merge(joined, apoc.map.clean($joined_params, ['id'], [null])),
      joined.updated_at = timestamp()
  RETURN joined
  `;
