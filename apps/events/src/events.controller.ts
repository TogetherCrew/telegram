import { Controller } from '@nestjs/common';
import { EventsService } from './events.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { MESSAGE_EVENT } from '@app/common';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @MessagePattern(MESSAGE_EVENT)
  async message(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    console.log(data);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
