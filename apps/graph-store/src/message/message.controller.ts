import { UpdateEvent } from '@app/common';
import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { DChat } from '../decorators/chat.decorator';
import { RmqInterceptor } from '../interceptors/rmq.interceptor';
import { MessageService } from './message.service';
import { DMessage } from '../decorators/message.decorator';
import { Chat, Message, MessageEntity, User } from 'grammy/types';
import { DUser } from '../decorators/user.decorator';
import { DMentions } from '../decorators/mentions.decorator';

@Controller('message')
@UseInterceptors(RmqInterceptor)
export class MessageController {
  private readonly logger = new Logger(MessageController.name);

  constructor(private readonly messageService: MessageService) {}

  @MessagePattern(UpdateEvent.MESSAGE_TEXT)
  async chat_member(
    @DChat() chat: Chat,
    @DUser() user: User,
    @DMessage() message: Message,
    @DMentions() mentions: MessageEntity[],
  ): Promise<void> {
    this.logger.log(`Received ${message.message_id} in ${chat.id}`);
    this.messageService.create(chat, user, message, mentions);
  }
}
