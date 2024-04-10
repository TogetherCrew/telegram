import { Controller, Logger, UseInterceptors } from '@nestjs/common';
import { EventStoreService } from './event-store.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventNames } from '@app/common';
import { EventsInterceptor } from './interceptors/events.interceptor';
import { API_CONSTANTS } from 'grammy';

@Controller()
@UseInterceptors(EventsInterceptor)
export class EventStoreController {
  private readonly logger = new Logger(EventStoreController.name);

  constructor(private readonly eventsService: EventStoreService) {}

  a = typeof API_CONSTANTS.ALL_UPDATE_TYPES;

  @MessagePattern(EventNames.MESSAGE)
  async message(@Payload() data): Promise<void> {
    const { update } = data;
    const { message } = update;
    await this.eventsService.createEvent(
      message.date,
      message.chat.id,
      EventNames.MESSAGE,
      update,
    );
  }

  @MessagePattern(EventNames.EDITED_MESSAGE)
  async edited_message(@Payload() data): Promise<void> {
    const { update } = data;
    const { edited_message } = update;

    await this.eventsService.createEvent(
      edited_message.date,
      edited_message.chat.id,
      EventNames.EDITED_MESSAGE,
      update,
    );
  }

  @MessagePattern(EventNames.MESSAGE_REACTION)
  async message_reaction(@Payload() data): Promise<void> {
    const { update } = data;
    const { message_reaction } = update;

    await this.eventsService.createEvent(
      message_reaction.date,
      message_reaction.chat.id,
      EventNames.MESSAGE_REACTION,
      update,
    );
  }

  @MessagePattern(EventNames.CHAT_MEMBER)
  async chat_member(@Payload() data): Promise<void> {
    const { update } = data;
    const { chat_member } = update;

    await this.eventsService.createEvent(
      chat_member.date,
      chat_member.chat.id,
      EventNames.CHAT_MEMBER,
      update,
    );
  }
}
