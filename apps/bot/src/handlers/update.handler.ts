import { Context, FilterQuery } from 'grammy';
import { BaseHandler } from './base.handler';

export class UpdateHandler extends BaseHandler {
  async handle(ctx: Context, event: FilterQuery): Promise<void> {
    try {
      const update = ctx.update;
      await this.temporalClient.start('TelegramEventWorkflow', {
        taskQueue: 'TEMPORAL_QUEUE_LIGHT',
        args: [{ update, event }],
        workflowId: `telegram:update:${update.update_id}`,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
