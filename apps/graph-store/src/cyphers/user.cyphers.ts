export const CREATE_OR_UPDATE_USER = `
    MERGE(user:TGUser { id: $userId })
    ON CREATE SET chat.title = $chatTitle, chat.type = $chatType, chat.timestamp = $timestamp
    ON MATCH SET chat.title = $chatTitle, chat.type = $chatType, chat.timestamp = $timestamp
  `;
