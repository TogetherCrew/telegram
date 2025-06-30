import { Context } from 'grammy';
import { BaseHandler } from './base.handler';

export class SummaryHandler extends BaseHandler {
  async handle(ctx: Context): Promise<void> {
    try {
      console.log('SummaryHandler', ctx.update.update_id);
      const update = ctx.update;

      const result = await this.temporalClient.execute(
        'TelegramSummaryWorkflow',
        {
          taskQueue: 'TEMPORAL_QUEUE_HEAVY',
          args: [{ update }],
          workflowId: `telegram:summary:${update.update_id}`,
        },
      );

      if (!result || result.length === 0) {
        // this.logger.log(`No reply from hivemind. Skipping question.`);
        return;
      }

      const other = {
        reply_parameters: {
          message_id: update.message.message_id,
        },
      };

      // this.logger.log('Reply from hivemind:', result);
      await ctx.reply(result, other);
    } catch (error) {
      // this.logger.error(error);
      console.error('SummaryHandler error', error);
      // await ctx.reply('Something unexpected happened. Please try again later.');
    }
  }
}
