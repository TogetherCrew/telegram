import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { GraphStoreService } from './graph-store.service';
import { MessagePattern } from '@nestjs/microservices';
import { EventNames } from '@app/common';
import { RmqInterceptor } from './interceptors/rmq.interceptor';
import { User } from './decorators/user.decorator';
// import { Mentions } from './decorators/mentions.decorator';
import { Chat } from './decorators/chat.decorator';
import { Message } from './decorators/message.decorator';
import { Reaction } from './decorators/reaction.decorator';
import { Mentions } from './decorators/mentions.decorator';

@Controller()
@UseInterceptors(RmqInterceptor)
export class GraphStoreController {
  private readonly logger = new Logger(GraphStoreController.name);

  constructor(private readonly graphStoreService: GraphStoreService) {}

  @MessagePattern(EventNames.MESSAGE)
  async message(
    @Chat() chat,
    @User() user,
    @Message() message,
    @Mentions() mentions,
  ): Promise<void> {
    this.graphStoreService.message(chat, user, message, mentions);
  }

  @MessagePattern(EventNames.EDITED_MESSAGE)
  async edited_message(
    @Chat() chat,
    @User() user,
    @Message() message,
    @Mentions() mentions,
  ): Promise<void> {
    this.graphStoreService.message(chat, user, message, mentions);
  }

  @MessagePattern(EventNames.MESSAGE_REACTION)
  async message_reaction(
    @Chat() chat,
    @User() user,
    @Reaction() reaction,
  ): Promise<void> {
    this.graphStoreService.reaction(chat, user, reaction);
  }
}
