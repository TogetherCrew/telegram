import { UpdateEvent } from '@app/common';
import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DChat } from '../decorators/chat.decorator';
import { MessageService } from './message.service';
import { DMessage } from '../decorators/message.decorator';
import { Chat, Message, MessageEntity, User } from 'grammy/types';
import { DUser } from '../decorators/user.decorator';
import { DMentions } from '../decorators/mentions.decorator';
import { ChatService } from '../chat/chat.service';
import { JoinedService } from '../joined/joined.service';
import { MentionedService } from '../mentioned/mentioned.service';
import { RepliedService } from '../replied/replied.service';
import { UserService } from '../user/user.service';
import { Neo4jService } from 'nest-neo4j/dist';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';

@Controller('message')
@UseInterceptors(EventsInterceptor)
export class MessageController {
  private readonly logger = new Logger(MessageController.name);

  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly joinedService: JoinedService,
    private readonly repliedService: RepliedService,
    private readonly mentionedService: MentionedService,
  ) {}

  @MessagePattern(UpdateEvent.MESSAGE)
  async message(
    @DChat() chat: Chat,
    @DUser() user: User,
    @DMessage() message: Message,
    @DMentions() mentions: MessageEntity[],
  ): Promise<void> {
    try {
      this.logger.log(`Received ${message.message_id} in ${chat.id}.`);

      const tx = this.neo4jService.beginTransaction();

      this.chatService.createOrUpdate(chat, tx);
      this.userService.createOrUpdate(user, tx);
      this.messageService.create(chat, user, message, tx);

      const joinedCount = await this.joinedService.count(chat, user);
      if (joinedCount == 0) {
        this.joinedService.create(chat, user, 0, tx);
      }
      const { reply_to_message } = message;
      if (reply_to_message) {
        this.repliedService.create(chat, message, reply_to_message, tx);
      }
      if (mentions && mentions.length > 0) {
        this.mentionedService.create(chat, message, mentions, tx);
      }
      await tx.commit();
      this.logger.log('Commited tx.');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
