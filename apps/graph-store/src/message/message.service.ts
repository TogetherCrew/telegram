import { Injectable, Logger } from '@nestjs/common';
import { Chat, User, Message, MessageEntity } from 'grammy/types';
import { Neo4jService, Transaction } from 'nest-neo4j';
import { ChatService } from '../chat/chat.service';
import { UserService } from '../user/user.service';
import { JoinedService } from '../joined/joined.service';
import { RepliedService } from '../replied/replied.service';
import { MentionedService } from '../mentioned/mentioned.service';

const CREATE_OR_UPDATE_MESSAGE = `
MATCH (user:TGUser { id: $user.id })
MATCH (chat:TGChat { id: $chat.id })
MERGE (user)-[:CREATED_MESSAGE]->(message:TGMessage { id: $message.message_id })-[:SENT_IN]->(chat)
  ON CREATE
    SET message = apoc.map.merge(message, apoc.map.clean($message, ['id'], [null])),
        message.created_at = timestamp(),
        message.updated_at = timestamp()
  ON MATCH
    SET message = apoc.map.merge(message, apoc.map.clean($message, ['id'], [null])),
      message.updated_at = timestamp()
RETURN message
`;

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly joinedService: JoinedService,
    private readonly repliedService: RepliedService,
    private readonly mentionedService: MentionedService,
  ) {}

  async create(
    chat: Chat,
    user: User,
    message: Message,
    mentions: MessageEntity[],
    tx?: Transaction,
  ): Promise<void> {
    try {
      if (tx) {
        this.createMessage(chat, user, message, mentions, tx);
      } else {
        tx = this.neo4jService.beginTransaction();
        await this.createMessage(chat, user, message, mentions, tx);
        await tx.commit();
        this.logger.log('Commited tx.');
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async createMessage(
    chat: Chat,
    user: User,
    message: Message,
    mentions: MessageEntity[],
    tx: Transaction,
  ) {
    this.chatService.createOrUpdate(chat, tx);
    this.userService.createOrUpdate(user, tx);

    const joinedCount = await this.joinedService.count(chat, user);
    if (joinedCount == 0) {
      this.joinedService.create(chat, user, 0, tx);
    }

    tx.run(CREATE_OR_UPDATE_MESSAGE, {
      chat,
      user,
      message: this.transformMessage(message),
    });

    const { reply_to_message } = message;
    if (reply_to_message) {
      const { from } = reply_to_message;
      await this.createMessage(chat, from, reply_to_message, [], tx);
      this.repliedService.create(chat, message, reply_to_message, tx);
    }

    if (mentions && mentions.length > 0) {
      this.mentionedService.create(chat, message, mentions, tx);
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
