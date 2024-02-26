import { Controller } from '@nestjs/common';
import { EventsService } from './event-store.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Events } from '@app/common';
import { Message, Update } from 'grammy/types';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @MessagePattern(Events.Message)
  async message(
    @Payload() data: Message,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    await this.eventsService.createEvent(
      data.date,
      data.chat.id,
      Events.Message,
      data,
    );

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  @MessagePattern(Events.EditedMessage)
  async edited_message(
    @Payload() data: Update,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const { edited_message } = data;

    await this.eventsService.createEvent(
      edited_message.date,
      edited_message.chat.id,
      Events.EditedMessage,
      data,
    );

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  @MessagePattern(Events.MessageReaction)
  async message_reaction(
    @Payload() data: Update,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const { message_reaction } = data;

    await this.eventsService.createEvent(
      message_reaction.date,
      message_reaction.chat.id,
      Events.MessageReaction,
      data,
    );

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  @MessagePattern(Events.ChatMemberUpdated)
  async chat_member(
    @Payload() data: Update,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    const { chat_member } = data;

    await this.eventsService.createEvent(
      chat_member.date,
      chat_member.chat.id,
      Events.ChatMemberUpdated,
      data,
    );

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
