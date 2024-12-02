import { UpdateEvent } from '@app/common';
import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Chat, MessageReactionUpdated, User } from 'grammy/types';
import { Neo4jService } from 'nest-neo4j/dist';
import { ChatService } from '../chat/chat.service';
import { DChat } from '../decorators/chat.decorator';
import { DMessageReactionUpdated } from '../decorators/reaction.decorator';
import { DUser } from '../decorators/user.decorator';
import { JoinedService } from '../joined/joined.service';
import { UserService } from '../user/user.service';
import { MessageReactionService } from './message_reaction.service';
import { EventsInterceptor } from '@app/common/rmq/interceptors/events.interceptor';

@Controller('message-reaction')
@UseInterceptors(EventsInterceptor)
export class MessageReactionController {
  private readonly logger = new Logger(MessageReactionController.name);

  constructor(
    private readonly neo4jService: Neo4jService,
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly joinedService: JoinedService,
    private readonly messageReactionService: MessageReactionService,
  ) {}

  @MessagePattern(UpdateEvent.MESSAGE_REACTION)
  async message(
    @DChat() chat: Chat,
    @DUser() user: User,
    @DMessageReactionUpdated() reaction: MessageReactionUpdated,
  ): Promise<void> {
    try {
      this.logger.log(`Received ${reaction.message_id} in ${chat.id}.`);
      const tx = this.neo4jService.beginTransaction();

      this.chatService.createOrUpdate(chat, tx);
      this.userService.createOrUpdate(user, tx);
      this.messageReactionService.create(chat, user, reaction, tx);

      const joinedCount = await this.joinedService.count(chat, user);
      if (joinedCount == 0) {
        this.joinedService.create(chat, user, 0, tx);
      }
      await tx.commit();
      this.logger.log('Commited tx.');
    } catch (error) {
      this.logger.error(error);
    }
  }
}
