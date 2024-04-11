export const CREATE_OR_UPDATE_REPLIED = `
  MATCH (chat:TGChat { id: $chat_id })
  MATCH (message:TGMessage { id: $message_id })-[:SENT_IN]->(chat)
  MATCH (origin:TGMessage { id: $origin_id })-[:SENT_IN]->(chat)
  MERGE (message)-[r:REPLIED]->(origin)
  RETURN r
  `;
