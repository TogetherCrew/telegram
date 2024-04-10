import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Chat, Message, User, MessageReactionUpdated } from 'grammy/types';
import { CREATE_OR_UPDATE_CHAT } from './cyphers/chat.cypher';
import { CREATE_OR_UPDATE_USER } from './cyphers/user.cypher';
import { CREATE_OR_UPDATE_MESSAGE } from './cyphers/message.cypher';
import { CREATE_OR_UPDATE_REACTION } from './cyphers/reaction.cypher';
import { CREATE_OR_UPDATE_JOINED } from './cyphers/joined.cypher';
import { CREATED_OR_UPDATE_MENTION } from './cyphers/mentioned.cypher';

@Injectable()
export class GraphStoreService {
  private readonly logger = new Logger(GraphStoreService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async message(
    chat: Chat,
    user: User,
    message: Message,
    mentions: string[],
  ): Promise<void> {
    try {
      const tx = this.neo4jService.beginTransaction();
      tx.run(CREATE_OR_UPDATE_CHAT, { chat_id: chat.id, chat_params: chat });
      tx.run(CREATE_OR_UPDATE_USER, {
        chat_id: chat.id,
        user_id: user.id,
        user_params: user,
      });
      tx.run(CREATE_OR_UPDATE_JOINED, {
        chat_id: chat.id,
        user_id: user.id,
        joined_params: {},
      });
      tx.run(CREATE_OR_UPDATE_MESSAGE, {
        chat_id: chat.id,
        user_id: user.id,
        message_id: message.message_id,
        params: this.transformMessage(message),
      });
      tx.run(CREATED_OR_UPDATE_MENTION, {
        chat_id: chat.id,
        message_id: message.message_id,
        mentions,
      });
      await tx.commit();
      this.logger.log(`Commited message ${message.message_id} for ${chat.id}.`);
    } catch (error) {
      this.logger.log(error);
    }
  }

  async reaction(
    chat: Chat,
    user: User,
    reaction: MessageReactionUpdated,
  ): Promise<void> {
    try {
      const tx = this.neo4jService.beginTransaction();
      tx.run(CREATE_OR_UPDATE_CHAT, { chat_id: chat.id, chat_params: chat });
      tx.run(CREATE_OR_UPDATE_USER, {
        chat_id: chat.id,
        user_id: user.id,
        user_params: user,
      });
      tx.run(CREATE_OR_UPDATE_JOINED, {
        chat_id: chat.id,
        user_id: user.id,
        joined_params: {},
      });
      tx.run(CREATE_OR_UPDATE_REACTION, {
        chat_id: chat.id,
        user_id: user.id,
        message_id: reaction.message_id,
        params: this.transformReaction(reaction),
      });
      await tx.commit();
      this.logger.log(
        `Commited reaction to ${reaction.message_id} for ${chat.id}.`,
      );
    } catch (error) {
      this.logger.log(error);
    }
  }

  private transformMessage(message: Message): Partial<Message> {
    delete message.from;
    delete message.chat;
    delete message.entities;
    return message;
  }

  private transformReaction(reaction: MessageReactionUpdated): any {
    return {
      old_reaction: JSON.stringify(reaction.old_reaction),
      new_reaction: JSON.stringify(reaction.new_reaction),
    };
  }
}
