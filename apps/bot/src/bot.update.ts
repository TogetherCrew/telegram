import { Update, Ctx, Start, On, Message } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotService } from './bot.service';
import { EditedMessage } from './decorators/editedMessage.decorator';
import { MessageReaction } from './decorators/messageReaction.decorator';

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply('Hello');
  }

  @On('message_reaction')
  async message_reaction(@MessageReaction() reaction) {
    console.log('message_reaction', reaction);
  }

  @On('message')
  async message(@Message() message) {
    console.log('message', message);
  }

  @On('edited_message')
  async edited_message(@EditedMessage() message) {
    console.log('edited_message', message);
  }
}
