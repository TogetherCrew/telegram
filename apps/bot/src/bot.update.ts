import { Update, Ctx, Start, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotService } from './bot.service';

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply('Hello');
  }

  @On('message_reaction')
  async message_reaction(@Ctx() ctx: Context) {
    console.log('message_reaction', ctx);
  }

  @On('message')
  async message(@Ctx() ctx: Context) {
    console.log('message', ctx);
  }

  @On('edited_message')
  async edited_message(@Ctx() ctx: Context) {
    console.log('edited_message', ctx);
  }
}
