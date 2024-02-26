import { Update, Ctx, Start, On, Message } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotService } from './bot.service';
import { EditedMessage } from './decorators/editedMessage.decorator';
import { ChatMemberUpdated } from './decorators/chatMemberUpdated.decorator';
import { MessageReaction } from './decorators/messageReaction.decorator';

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply('Hello');
  }

  @On('message')
  async message(@Message() message) {
    this.botService.message(message);
  }

  @On('edited_message')
  async edited_message(@EditedMessage() editedMessage) {
    this.botService.edited_message(editedMessage);
  }

  @On('message_reaction')
  async message_reaction(@MessageReaction() messageReaction) {
    this.botService.message_reaction(messageReaction);
  }

  @On('chat_member')
  async chat_member(@ChatMemberUpdated() chatMember) {
    console.log(chatMember);
    this.botService.chat_member(chatMember);
  }
}
