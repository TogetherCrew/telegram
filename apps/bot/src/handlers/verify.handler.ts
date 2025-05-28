import { Context } from 'grammy';
import { BaseHandler } from './base.handler';

export class VerifyHandler extends BaseHandler {
  async handle(ctx: Context): Promise<void> {
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
      this.logger.error(error);
      await ctx.reply(
        'Something unexpected happened. Reach out to our support team.',
      );
    }
  }
}
