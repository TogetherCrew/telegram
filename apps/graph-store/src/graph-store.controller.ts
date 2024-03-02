import { Controller, Inject, Logger, UseInterceptors } from '@nestjs/common';
import { GraphStoreService } from './graph-store.service';
import { ClientProxy, MessagePattern } from '@nestjs/microservices';
import { Events, Services } from '@app/common';
import { RmqInterceptor } from './interceptors/rmq.interceptor';
import { User } from './decorators/user.decorator';
import { Mentions } from './decorators/mentions.decorator';

@Controller()
@UseInterceptors(RmqInterceptor)
export class GraphStoreController {
  private readonly logger = new Logger(GraphStoreController.name);

  constructor(
    private readonly graphStoreService: GraphStoreService,
    @Inject(Services.Bot) private client: ClientProxy,
  ) {}

  @MessagePattern(Events.Message)
  async message(
    @User() user,
    @Mentions() mentions,
    // @Chat() chat,
  ): Promise<void> {
    // Get user ids
    this.client.emit('get_chat', mentions[0]);
    this.logger.log(user);
    this.logger.log(mentions);
  }

  @MessagePattern(Events.EditedMessage)
  async edited_message(@User() user): Promise<void> {
    this.logger.log(user);
  }

  @MessagePattern(Events.MessageReaction)
  async message_reaction(@User() user): Promise<void> {
    this.logger.log(user);
  }
}
