import { Events, Services } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Message, Update } from 'grammy/types';

@Injectable()
export class BotService {
  constructor(@Inject(Services.EventStore) private client: ClientProxy) {}

  async message(message: Message) {
    this.client.emit(Events.Message, message);
  }

  async edited_message(editedMessage: Update) {
    this.client.emit(Events.EditedMessage, editedMessage);
  }

  async message_reaction(messageReaction: Update) {
    this.client.emit(Events.MessageReaction, messageReaction);
  }

  async chat_member(chatMember: Update) {
    this.client.emit(Events.ChatMemberUpdated, chatMember);
  }
}
