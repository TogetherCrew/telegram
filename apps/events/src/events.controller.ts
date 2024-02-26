import { Controller } from '@nestjs/common';
import { EventsService } from './events.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Events } from '@app/common';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @MessagePattern(Events.Message)
  async message(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    console.log('message', data);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  @MessagePattern(Events.EditedMessage)
  async edited_message(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    console.log('edited_message', data);
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  @MessagePattern(Events.MessageReaction)
  async message_reaction(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    console.log('message_reaction', JSON.stringify(data));
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
