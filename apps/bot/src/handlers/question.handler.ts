import { Context, FilterQuery } from 'grammy';
import { BaseHandler } from './base.handler';
import { UpdateEvent } from '@app/common';

const HIVEMIND_BLOCKLIST = ['-1002141367711', '-1002477739609']; // TODO: Move this to config

export class QuestionHandler extends BaseHandler {
  async handle(ctx: Context, event?: FilterQuery): Promise<void> {
    try {
      if (
        event !== UpdateEvent.CHAT_MEMBER &&
        ctx.update.message?.from &&
        !ctx.update.message.from.is_bot &&
        ctx.update.message.text?.trim().length > 0
      ) {
        const update = ctx.update;

        if (HIVEMIND_BLOCKLIST.includes(update.message?.chat.id.toString())) {
          this.logger.log(
            `${update.message?.chat.id} is on a blocklist. Skipping question.`,
          );
          return;
        }

        const result = await this.temporalClient.execute(
          'TelegramQuestionWorkflow',
          {
            taskQueue: 'TEMPORAL_QUEUE_HEAVY',
            args: [{ update }],
            workflowId: `telegram:question:${update.update_id}`,
          },
        );

        if (!result || result.length === 0) {
          this.logger.log(`No reply from hivemind. Skipping question.`);
          return;
        }

        const other = {
          reply_parameters: {
            message_id: update.message.message_id,
          },
          // parse_mode: 'MarkdownV2' as const,
        };

        this.logger.log('Reply from hivemind:', result);
        await ctx.reply(result, other);
      }
    } catch (error) {
      this.logger.error(error);
      // await ctx.reply('Something unexpected happened. Please try again later.');
    }
  }
}
