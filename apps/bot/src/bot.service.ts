import { Injectable } from '@nestjs/common';

@Injectable()
export class BotService {
  message(message) {
    console.log('message', message);
  }

  edited_message(editedMessage) {
    console.log('editedMessage', editedMessage);
  }

  message_reaction(messageReaction) {
    console.log('messageReaction', messageReaction);
  }
}
