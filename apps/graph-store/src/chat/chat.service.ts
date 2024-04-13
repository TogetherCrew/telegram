import { Injectable, Logger } from '@nestjs/common';
import { Chat } from 'grammy/types';
import { Neo4jService, Transaction } from 'nest-neo4j';

const CREATE_OR_UPDATE_CHAT = `
MERGE (chat:TGChat { id: $chat.id })
  ON CREATE
    SET chat = apoc.map.merge(chat, apoc.map.clean($chat, ['id'], [null])),
      chat.created_at = timestamp(),
      chat.updated_at = timestamp()
  ON MATCH
    SET chat = apoc.map.merge(chat, apoc.map.clean($chat, ['id'], [null])),
      chat.updated_at = timestamp()
RETURN chat
` as const;

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async createOrUpdate(chat: Chat, tx?: Transaction): Promise<void> {
    try {
      if (tx) {
        tx.run(CREATE_OR_UPDATE_CHAT, { chat });
      } else {
        await this.neo4jService.write(CREATE_OR_UPDATE_CHAT, { chat });
      }
    } catch (error) {
      this.logger.error(error);
    }
  }
}
