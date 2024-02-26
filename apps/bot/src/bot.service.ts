import { EVENT_SERVICE } from '@app/common';
import {
  EDITED_MESSAGE_EVENT,
  MESSAGE_EVENT,
  MESSAGE_REACTION_EVENT,
} from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BotService {
  constructor(@Inject(EVENT_SERVICE) private client: ClientProxy) {}

  async message(message) {
    console.log('message', message);
    this.client.emit(MESSAGE_EVENT, message);
  }

  async edited_message(editedMessage) {
    console.log('editedMessage', editedMessage);
    this.client.emit(EDITED_MESSAGE_EVENT, editedMessage);
  }

  async message_reaction(messageReaction) {
    console.log('messageReaction', messageReaction);
    this.client.emit(MESSAGE_REACTION_EVENT, messageReaction);
  }
}
