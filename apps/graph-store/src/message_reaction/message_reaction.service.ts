import { Injectable, Logger } from '@nestjs/common';
import { Chat, MessageReactionUpdated, User } from 'grammy/types';
import { Neo4jService, Transaction } from 'nest-neo4j/dist';
import { MessageService } from '../message/message.service';

export const CREATE_REACTION = `
MATCH (chat:TGChat { id: $chat.id })
MATCH (message:TGMessage { id: $reaction.message_id })-[:SENT_IN]->(chat)
WHERE NOT EXISTS (()-[:EDITED]->(message))
MATCH (user:TGUser { id: $user.id })
MERGE (user)-[r:REACTED_TO { date: $reaction.date }]->(message)
  ON CREATE
    SET r = apoc.map.merge(r, $reaction),
      r.created_at = timestamp(),
      r.updated_at = timestamp()
  RETURN r
`;

@Injectable()
export class MessageReactionService {
  private readonly logger = new Logger(MessageService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async create(
    chat: Chat,
    user: User,
    reaction: MessageReactionUpdated,
    tx?: Transaction,
  ): Promise<void> {
    if (tx) {
      tx.run(CREATE_REACTION, {
        chat,
        user,
        reaction: this.transformReaction(reaction),
      });
    } else {
      this.neo4jService.write(CREATE_REACTION, {
        chat,
        user,
        reaction: this.transformReaction(reaction),
      });
    }
  }

  private transformReaction(reaction: MessageReactionUpdated): any {
    const obj: any = { ...reaction };
    delete obj.actor_chat;
    delete obj.chat;
    delete obj.user;

    obj.new_reaction = JSON.stringify(obj.new_reaction);
    obj.old_reaction = JSON.stringify(obj.old_reaction);
    return obj;
  }
}
