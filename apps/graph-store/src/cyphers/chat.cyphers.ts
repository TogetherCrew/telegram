export const CREATE_OR_UPDATE_CHAT = `
    MERGE(chat:TGChat { id: $chatId })
    ON CREATE SET chat.title = $chatTitle, chat.type = $chatType, chat.timestamp = $timestamp
    ON MATCH SET chat.title = $chatTitle, chat.type = $chatType, chat.timestamp = $timestamp
  `;
