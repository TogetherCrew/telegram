import { Injectable, Logger } from '@nestjs/common';
import { Chat, Message } from 'grammy/types';
import { Neo4jService, Transaction } from 'nest-neo4j';

const CREATE_REPLIED = `
MATCH (chat:TGChat { id: $chat.id })
MATCH (message:TGMessage { id: $message.message_id })-[:SENT_IN]->(chat)
WHERE NOT EXISTS (()-[:EDITED]->(message))
MATCH (reply_to_message:TGMessage { id: $reply_to_message.message_id })-[:SENT_IN]->(chat)
WHERE NOT EXISTS (()-[:EDITED]->(reply_to_message))
MERGE (message)-[r:REPLIED]->(reply_to_message)
RETURN r
`;

@Injectable()
export class RepliedService {
  private readonly logger = new Logger(RepliedService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async create(
    chat: Chat,
    message: Message,
    reply_to_message: Message,
    tx?: Transaction,
  ): Promise<any> {
    try {
      if (tx) {
        tx.run(CREATE_REPLIED, { chat, message, reply_to_message });
      } else {
        await this.neo4jService.write(CREATE_REPLIED, {
          chat,
          message,
          reply_to_message,
        });
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
