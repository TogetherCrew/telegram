import { Injectable, Logger } from '@nestjs/common';
import { Chat, User, Message } from 'grammy/types';
import { Neo4jService, Transaction } from 'nest-neo4j';

const CREATE_MESSAGE = `
MATCH (user:TGUser { id: $user.id })
MATCH (chat:TGChat { id: $chat.id })
MERGE (user)-[:CREATED_MESSAGE]->(message:TGMessage { id: $message.message_id })-[:SENT_IN]->(chat)
  ON CREATE
    SET message = apoc.map.merge(message, apoc.map.clean($message, ['id'], [null])),
        message.created_at = timestamp(),
        message.updated_at = timestamp()
RETURN message
`;

const UPDATE_MESSAGE = `
MATCH (user:TGUser { id: $user.id })
MATCH (chat:TGChat { id: $chat.id })
MATCH (latest:TGMessage { id: $message.message_id })-[:SENT_IN]->(chat)
WHERE NOT EXISTS ((latest)-[:EDITED]->())
MERGE (user)-[:CREATED_MESSAGE]->(message:TGMessage { id: $message.message_id, edit_date: $message.edit_date })-[:SENT_IN]->(chat)
  ON CREATE
    SET message = apoc.map.merge(message, apoc.map.clean($message, ['id'], [null])),
        message.created_at = timestamp(),
        message.updated_at = timestamp()
MERGE (message)-[:EDITED]->(latest)
RETURN message
`;

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async create(
    chat: Chat,
    user: User,
    message: Message,
    tx?: Transaction,
  ): Promise<void> {
    if (tx) {
      tx.run(CREATE_MESSAGE, {
        chat,
        user,
        message: this.transformMessage(message),
      });
    } else {
      this.neo4jService.write(CREATE_MESSAGE, {
        chat,
        user,
        message: this.transformMessage(message),
      });
    }
  }

  async update(
    chat: Chat,
    user: User,
    message: Message,
    tx?: Transaction,
  ): Promise<void> {
    if (tx) {
      tx.run(UPDATE_MESSAGE, {
        chat,
        user,
        message: this.transformMessage(message),
      });
    } else {
      this.neo4jService.write(UPDATE_MESSAGE, {
        chat,
        user,
        message: this.transformMessage(message),
      });
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
}
