import { Injectable, Logger } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Chat, Message, User, MessageReactionUpdated } from 'grammy/types';
import { CREATE_OR_UPDATE_CHAT } from './cyphers/chat.cypher';
import { CREATE_OR_UPDATE_USER } from './cyphers/user.cypher';
import { CREATE_OR_UPDATE_MESSAGE } from './cyphers/message.cypher';
import { CREATE_OR_UPDATE_REACTION } from './cyphers/reaction.cypher';
import { CREATE_OR_UPDATE_JOINED } from './cyphers/joined.cypher';
import { CREATED_OR_UPDATE_MENTION } from './cyphers/mentioned.cypher';
import { CREATE_OR_UPDATE_REPLIED } from './cyphers/replied.cypher';

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
        thread_id: message.message_thread_id,
        params: this.transformMessage(message),
      });

      if (message.reply_to_message?.message_id) {
        tx.run(CREATE_OR_UPDATE_REPLIED, {
          chat_id: chat.id,
          message_id: message.message_id,
          origin_id: message.reply_to_message?.message_id,
        });
      }

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

  private transformMessage(message: Message): any {
    const obj: any = { ...message };
    delete obj.from;
    delete obj.chat;
    delete obj.reply_to_message;

    const optional_dict = [
      'sender_business_bot',
      'forward_origin',
      'external_reply',
      'quote',
      'reply_to_story',
      'via_bot',
      'entities',
      'link_preview_options',
      'animation',
      'audio',
      'document',
      'photo',
      'sticker',
      'story',
      'video',
      'video_note',
      'voice',
      'caption_entities',
      'contact',
      'dice',
      'game',
      'poll',
      'venue',
      'location',
      'new_chat_members',
      'left_chat_member',
      'new_chat_photo',
      'message_auto_delete_timer_changed',
      'pinned_message',
      'invoice',
      'successful_payment',
      'users_shared',
      'chat_shared',
      'write_access_allowed',
      'passport_data',
      'proximity_alert_triggered',
      'boost_added',
      'forum_topic_created',
      'forum_topic_edited',
      'forum_topic_closed',
      'forum_topic_reopened',
      'general_forum_topic_hidden',
      'general_forum_topic_unhidden',
      'giveaway_created',
      'giveaway',
      'giveaway_winners',
      'giveaway_completed',
      'video_chat_scheduled',
      'video_chat_started',
      'video_chat_ended',
      'video_chat_participants_invited',
      'web_app_data',
      'reply_markup',
    ];

    optional_dict.forEach((dict_name) => {
      if (obj[dict_name]) {
        obj[dict_name] = JSON.stringify(obj[dict_name]);
      }
    });

    return obj;
  }

  private transformReaction(reaction: MessageReactionUpdated): any {
    return {
      old_reaction: JSON.stringify(reaction.old_reaction),
      new_reaction: JSON.stringify(reaction.new_reaction),
    };
  }
}
