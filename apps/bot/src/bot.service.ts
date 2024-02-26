import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class BotService {
  constructor(@Inject('EVENT_SERVICE') private client: ClientProxy) {}

  async message(message) {
    console.log('message', message);
    this.client.emit('message', message);
  }

  async edited_message(editedMessage) {
    console.log('editedMessage', editedMessage);
    this.client.emit('edited_message', editedMessage);
  }

  async message_reaction(messageReaction) {
    console.log('messageReaction', messageReaction);
    this.client.emit('message_reaction', messageReaction);
  }
}
