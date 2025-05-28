import { Context } from 'grammy';
import { BaseHandler } from './base.handler';

export class UpdateHandler extends BaseHandler {
  async handle(ctx: Context): Promise<void> {
    try {
      const update = ctx.update;
      await this.temporalClient.start('TelegramUpdateWorkflow', {
        taskQueue: 'TEMPORAL_QUEUE_LIGHT',
        args: [{ update }],
        workflowId: `telegram:update:${update.update_id}`,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
