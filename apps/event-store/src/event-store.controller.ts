import { Controller } from '@nestjs/common';
import { EventsService } from './event-store.service';
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
    const chat_id = data.chat.id;
    const ts = data.date;

    await this.eventsService.createEvent(ts, chat_id, Events.Message, data);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  @MessagePattern(Events.EditedMessage)
  async edited_message(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const chat_id = data.edited_message.chat.id;
    const ts = data.edited_message.date;

    await this.eventsService.createEvent(
      ts,
      chat_id,
      Events.EditedMessage,
      data,
    );

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  @MessagePattern(Events.MessageReaction)
  async message_reaction(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const chat_id = data.message_reaction.chat.id;
    const ts = data.message_reaction.date;

    await this.eventsService.createEvent(
      ts,
      chat_id,
      Events.MessageReaction,
      data,
    );

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  @MessagePattern(Events.ChatMemberUpdated)
  async chat_member(
    @Payload() data: any,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    console.log(data);
    const chat_id = data.chat_member.chat.id;
    const ts = data.chat_member.date;

    await this.eventsService.createEvent(
      ts,
      chat_id,
      Events.ChatMemberUpdated,
      data,
    );

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
