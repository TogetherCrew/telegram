import { Events, Services } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BotService {
  constructor(@Inject(Services.EventStore) private client: ClientProxy) {}

  async message(message) {
    this.client.emit(Events.Message, message);
  }

  async edited_message(editedMessage) {
    this.client.emit(Events.EditedMessage, editedMessage);
  }

  async message_reaction(messageReaction) {
    this.client.emit(Events.MessageReaction, messageReaction);
  }
}
