import {
  Update as UpdateControllerDecorator,
  Ctx,
  Start,
  On,
  Message as MessageDecorator,
} from '@grammyjs/nestjs';
import { BotService } from './bot.service';
import { UpdateDecorator } from './decorators/update.decorator';
import { Events } from '@app/common';
import { Message, Update } from 'grammy/types';
import { Context } from 'grammy';
import { Logger } from '@nestjs/common';

@UpdateControllerDecorator()
export class BotUpdate {
  private readonly logger = new Logger(BotUpdate.name);

  constructor(private readonly botService: BotService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply('Hello');
  }

  @On(Events.Message)
  async message(@MessageDecorator() message: Message) {
    this.logger.log(message);
    this.botService.message(message);
  }

  @On(Events.EditedMessage)
  async edited_message(@UpdateDecorator() editedMessage: Update) {
    this.logger.log(editedMessage);
    this.botService.edited_message(editedMessage);
  }

  @On(Events.MessageReaction)
  async message_reaction(@UpdateDecorator() messageReaction: Update) {
    this.logger.log(messageReaction);
    this.botService.message_reaction(messageReaction);
  }

  @On(Events.ChatMemberUpdated)
  async chat_member(@UpdateDecorator() chatMember: Update) {
    this.logger.log(chatMember);
    this.botService.chat_member(chatMember);
  }
}
