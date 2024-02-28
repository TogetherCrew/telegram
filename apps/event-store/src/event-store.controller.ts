import { Controller, UseInterceptors } from '@nestjs/common';
import { EventStoreService } from './event-store.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Events } from '@app/common';
import { Message, Update } from 'grammy/types';
import { EventsInterceptor } from './interceptors/events.interceptor';

@Controller()
@UseInterceptors(EventsInterceptor)
export class EventStoreController {
  constructor(private readonly eventsService: EventStoreService) {}

  @MessagePattern(Events.Message)
  async message(@Payload() data: Message): Promise<void> {
    await this.eventsService.createEvent(
      data.date,
      data.chat.id,
      Events.Message,
      data,
    );
  }

  @MessagePattern(Events.EditedMessage)
  async edited_message(@Payload() data: Update): Promise<void> {
    const { edited_message } = data;

    await this.eventsService.createEvent(
      edited_message.date,
      edited_message.chat.id,
      Events.EditedMessage,
      data,
    );
  }

  @MessagePattern(Events.MessageReaction)
  async message_reaction(@Payload() data: Update): Promise<void> {
    const { message_reaction } = data;

    await this.eventsService.createEvent(
      message_reaction.date,
      message_reaction.chat.id,
      Events.MessageReaction,
      data,
    );
  }

  @MessagePattern(Events.ChatMemberUpdated)
  async chat_member(@Payload() data: Update): Promise<void> {
    const { chat_member } = data;

    await this.eventsService.createEvent(
      chat_member.date,
      chat_member.chat.id,
      Events.ChatMemberUpdated,
      data,
    );
  }
}
