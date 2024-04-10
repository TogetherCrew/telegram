export const CREATED_OR_UPDATE_MENTION = `
  MATCH (message:TGMessage { id: $message_id })-[:SENT_IN]->(chat:TGChat { id: $chat_id })
  OPTIONAL MATCH (message)-[r:MENTIONED]->(user:TGUser)
  DELETE r
  WITH message, $mentions AS mentions
  UNWIND mentions AS username
    MATCH (user:TGUser { username: username })
    MERGE (message)-[r:MENTIONED]->(user)
  RETURN collect(r)
  `;
