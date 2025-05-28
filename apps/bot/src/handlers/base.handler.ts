import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WorkflowClient } from '@temporalio/client';
import { Context, FilterQuery } from 'grammy';
import { InjectTemporalClient } from 'nestjs-temporal';

export abstract class BaseHandler {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectTemporalClient()
    protected readonly temporalClient: WorkflowClient,
    protected readonly configService: ConfigService,
  ) {}
  abstract handle(ctx: Context, event?: FilterQuery): Promise<void>;
}
