import { IgnoreEvent, UpdateEvent } from '@app/common';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WorkflowClient } from '@temporalio/client';
import { API_CONSTANTS, Bot, Context, RawApi } from 'grammy';
import { Other } from 'grammy/out/core/api';
import { Message, Update } from 'grammy/types';
import { InjectTemporalClient } from 'nestjs-temporal';

const HIVEMIND_BLOCKLIST = ['-1002141367711'];

@Injectable()
export class BotService implements OnModuleInit {
  private bot: Bot;
  private readonly logger = new Logger(BotService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectTemporalClient()
    private readonly temporalClient: WorkflowClient,
  ) {
    this.bot = new Bot(configService.get<string>('telegram.token'));

    this.bot.command('start', this.start);
    this.bot.command('verify', this.isAdmin, this.verify);

    Object.values(IgnoreEvent).map((event) => {
      this.bot.on(event, () => {
        this.logger.warn(`Ignoring ${event} event.`);
      });
    });

    Object.values(UpdateEvent).map((event) => {
      this.bot.on(event, (ctx: Context) => {
        this.logger.log(`Received ${event} from ${ctx.chat.id}`);
        this.processEvent(event, ctx.update);
        try {
          if (
            event != UpdateEvent.CHAT_MEMBER &&
            !ctx.update.message.from.is_bot
          ) {
            this.processQuestion(ctx);
          }
        } catch (error) {
          this.logger.error(error);
        }

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

  protected verify = async (ctx: Context) => {
    const token = ctx.match;
    const chat = ctx.chat;
    const from = ctx.from;

    if (!token || !chat || !from) {
      await ctx.reply(
        'Not enough data to complete this request. Reach out to our support team.',
      );
      return;
    }

    try {
      const handle = await this.temporalClient.start('TelegramVerifyWorkflow', {
        taskQueue: this.configService.get<string>('temporal.queue'),
        args: [{ token, chat, from }],
        workflowId: `telegram:verify:${token}`,
      });

      const result = await handle.result();
      await ctx.reply(result);
    } catch (error) {
      console.error(error);
      await ctx.reply(
        'Something unexpected happened. Reach out to our support team.',
      );
    }
  };

  protected processEvent = async (event: string, update: Update) => {
    try {
      await this.temporalClient.start('TelegramEventWorkflow', {
        taskQueue: this.configService.get<string>('temporal.queue'),
        args: [{ event, update }],
        workflowId: `telegram:event:${update.update_id}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  protected processQuestion = async (ctx: Context) => {
    try {
      if (HIVEMIND_BLOCKLIST.includes(ctx.chat.id.toString())) {
        console.log('Skipping question from HIVEMIND for', ctx.chat.id);
        return;
      }

      const community = await this.temporalClient.execute(
        'TelegramGetCommunityWorkflow',
        {
          taskQueue: 'TEMPORAL_QUEUE_LIGHT',
          args: [{ chatId: ctx.chat.id }],
          workflowId: `telegram:getcommunity:${ctx.update.update_id}`,
        },
      );
      if (!community) {
        console.log('No community found for', ctx.chat.id);
        return;
      }

      const reply = await this.temporalClient.execute(
        'AgenticHivemindTemporalWorkflow',
        {
          taskQueue: 'HIVEMIND_AGENT_QUEUE',
          args: [
            {
              community_id: community.id,
              query: ctx.update.message.text,
              enable_answer_skipping: true,
            },
          ],
          workflowId: `telegram:hivemind:${ctx.update.update_id}`,
        },
      );

      if (!reply || reply.length === 0) {
        console.log('No reply from hivemind.');
        return;
      }

      const other = {
        reply_parameters: {
          message_id: ctx.update.message.message_id,
        },
      };

      console.log('Reply from hivemind:', reply);
      await ctx.reply(reply, other);
    } catch (error) {
      console.error(error);
    }
  };
}
