import { IgnoreEvent, UpdateEvent } from '@app/common';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { API_CONSTANTS, Bot, Context, RawApi } from 'grammy';
import { Other } from 'grammy/out/core/api';
import { Message } from 'grammy/types';
import { QuestionHandler } from './handlers/question.handler';
import { UpdateHandler } from './handlers/update.handler';
import { VerifyHandler } from './handlers/verify.handler';
import { SummaryHandler } from './handlers/summary.handler';

function escapeMarkdownV2(text: string): string {
  const links: string[] = [];
  let linkIndex = 0;

  // Replace links with placeholders
  const withPlaceholders = text.replace(
    /\[([^\]]*)\]\(([^)]*)\)/g,
    (match, linkText, url) => {
      const escapedText = linkText.replace(/[_*\[\]~`>#+=|{}.!-]/g, '\\$&');
      const escapedUrl = url.replace(/[_*~`>#+=|{}.!-]/g, '\\$&');
      links[linkIndex] = `[${escapedText}](${escapedUrl})`;
      return `LINKPLACEHOLDER${linkIndex++}LINKPLACEHOLDER`;
    },
  );

  // Escape remaining characters
  const escaped = withPlaceholders.replace(/[_*\[\]()~`>#+=|{}.!-]/g, '\\$&');

  // Restore links
  return escaped.replace(
    /LINKPLACEHOLDER(\d+)LINKPLACEHOLDER/g,
    (match, index) => links[parseInt(index)],
  );
}

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Bot;
  private readonly logger = new Logger(BotService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly questionHandler: QuestionHandler,
    private readonly updateHandler: UpdateHandler,
    private readonly verifyHandler: VerifyHandler,
    private readonly summaryHandler: SummaryHandler,
  ) {
    this.bot = new Bot(this.configService.get<string>('telegram.token'));

    this.bot.command('start', this.start);
    this.bot.command(
      'verify',
      this.isAdmin,
      this.verifyHandler.handle.bind(this.verifyHandler),
    );
    this.bot.command(
      'summary',
      this.summaryHandler.handle.bind(this.summaryHandler),
    );

    Object.values(IgnoreEvent).map((event) => {
      this.bot.on(event, () => {
        this.logger.warn(`Ignoring ${event} event.`);
      });
    });

    Object.values(UpdateEvent).map((event) => {
      this.bot.on(event, (ctx: Context) => {
        this.logger.log(`Received ${event} from ${ctx.chat.id}`);
        this.updateHandler.handle(ctx, event);
        this.questionHandler.handle(ctx);

        // const text = `No, there is no specific report provided that is more recent than the request made on June 11, 2025\\. [\\[1\\]](https://t\\.me/c/1997495218/1073) [\\[2\\]](https://t\\.me/c/1997495218/1090) [\\[3\\]](https://t\\.me/c/1997495218/763)\n\n*This message was generated using the [TogetherCrew Q&A Agent](https://togethercrew\\.com)\\.*`;
        const originalText = `No, there is no specific report provided that is more recent than the request made on June 11, 2025. [[1]](https://t.me/c/1997495218/1073) [[2]](https://t.me/c/1997495218/1090) [[3]](https://t.me/c/1997495218/763)

*This message was generated using the [TogetherCrew Q&A Agent](https://togethercrew.com).*`;

        ctx.reply(escapeMarkdownV2(originalText), { parse_mode: 'MarkdownV2' });

        return;
      });
    });
  }

  async onModuleInit() {
    await this.bot.start({
      allowed_updates: API_CONSTANTS.ALL_UPDATE_TYPES,
    });
    await this.bot.api.setMyCommands([
      { command: 'start', description: 'Get started with the TogetherCrewBot' },
      { command: 'verify', description: 'Verify your group.' },
      { command: 'summary', description: 'Summary of the last 24 hours.' },
    ]);
  }

  async sendMessage(
    chat_id: number | string,
    text: string,
    other?: Other<RawApi, 'sendMessage', 'text' | 'chat_id'>,
  ): Promise<Message.TextMessage | null> {
    try {
      const receipt = await this.bot.api.sendMessage(chat_id, text, other);
      this.logger.log(
        `Message ${receipt.message_id} sent to ${receipt.chat.id}`,
      );
      return receipt;
    } catch (error) {
      console.error(error.message);
    }
  }

  // Middleware to check if a user is an admin
  protected isAdmin = async (ctx: Context, next: () => Promise<void>) => {
    if (!ctx.from || !ctx.chat) {
      return ctx.reply('This command can only be used in a group or channel.');
    }

    try {
      const chatMember = await ctx.api.getChatMember(ctx.chat.id, ctx.from.id);
      if (['administrator', 'creator'].includes(chatMember.status)) {
        // Proceed to the next middleware or handler
        return next();
      } else {
        // If not an admin, send an error message
        return ctx.reply('You must be an admin to use this command.');
      }
    } catch (error) {
      console.error('Error fetching chat member info:', error);
      return ctx.reply('An error occurred while checking permissions.');
    }
  };

  protected start = async (ctx: Context) => {
    const text = [
      '<b>Welcome!</b>',
      '<u><b>Get Started</b></u>',
      '<b>1. Add me to your group or channel</b>',
      [
        'Tap on my username (top of the screen) and select <i>Add to Group or Channel</i>.',
        'Select the group or channel you want and enable <b>Admin Rights</b>.',
        'You can disable all additional privileges.',
      ].join('\n'),
      '<b>2. Verify me</b>',
      [
        'Head over to <a href="https://app.togethercrew.com">https://app.togethercrew.com</a>.',
        'In your community settings, add Telegram.',
        'Copy-paste the verify command into your group and send it.',
      ].join('\n'),
      'I will take care of the rest.',
    ].join('\n\n');

    await ctx.reply(text, { parse_mode: 'HTML' });
  };
}
