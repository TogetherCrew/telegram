import { Injectable, Logger } from '@nestjs/common';
import { Chat, Message, MessageEntity } from 'grammy/types';
import { Neo4jService, Transaction } from 'nest-neo4j';

const CREATE_MENTIONED = `
MATCH (message:TGMessage { id: $message.message_id })-[:SENT_IN]->(chat:TGChat { id: $chat.id })
WHERE NOT EXISTS (()-[:EDITED]->(message))
WITH message, $mentions AS mentions
  UNWIND mentions AS username
    MATCH (user:TGUser { username: username })
    MERGE (message)-[r:MENTIONED]->(user)
  RETURN collect(r)
`;

@Injectable()
export class MentionedService {
  private readonly logger = new Logger(MentionedService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async create(
    chat: Chat,
    message: Message,
    mentions: MessageEntity[],
    tx?: Transaction,
  ): Promise<any> {
    if (tx) {
      tx.run(CREATE_MENTIONED, { chat, message, mentions });
    } else {
      await this.neo4jService.write(CREATE_MENTIONED, {
        chat,
        message,
        mentions,
      });
    }
  }
}
