import { UpdateEvent } from '@app/common';
import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Chat, User, Message, MessageEntity } from 'grammy/types';
import { DChat } from '../decorators/chat.decorator';
import { DMentions } from '../decorators/mentions.decorator';
import { DMessage } from '../decorators/message.decorator';
import { DUser } from '../decorators/user.decorator';
import { Neo4jService } from 'nest-neo4j';
import { ChatService } from '../chat/chat.service';
import { JoinedService } from '../joined/joined.service';
import { MentionedService } from '../mentioned/mentioned.service';
import { MessageService } from '../message/message.service';
import { RepliedService } from '../replied/replied.service';
import { UserService } from '../user/user.service';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';

@Controller('edited-message')
@UseInterceptors(EventsInterceptor)
export class EditedMessageController {
  private readonly logger = new Logger(EditedMessageController.name);

  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly messageService: MessageService,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly joinedService: JoinedService,
    private readonly repliedService: RepliedService,
    private readonly mentionedService: MentionedService,
  ) {}

  @MessagePattern(UpdateEvent.EDITED_MESSAGE)
  async chat_member(
    @DChat() chat: Chat,
    @DUser() user: User,
    @DMessage() message: Message,
    @DMentions() mentions: MessageEntity[],
  ): Promise<void> {
    this.logger.log(`Received ${message.message_id} in ${chat.id}`);
    try {
      const tx = this.neo4jService.beginTransaction();
      this.chatService.createOrUpdate(chat, tx);
      this.userService.createOrUpdate(user, tx);
      this.messageService.update(chat, user, message, tx);
      this.mentionedService.create(chat, message, mentions, tx);
      await tx.commit();
      this.logger.log('Commited tx.');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
