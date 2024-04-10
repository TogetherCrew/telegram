export const CREATE_OR_UPDATE_USER = `
  MATCH (chat:TGChat { id: $chat_id })
  MERGE (user:TGUser { id: $user_id })
    ON CREATE
      SET user = apoc.map.merge(user, $user_params),
        user.created_at = timestamp(),
        user.updated_at = timestamp()
    ON MATCH
      SET user = apoc.map.merge(user, apoc.map.clean($user_params, ['id'], [null])),
        user.updated_at = timestamp()
  RETURN user
`;
