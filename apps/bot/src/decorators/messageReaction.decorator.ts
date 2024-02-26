import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';

export const MessageReaction = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    return TelegrafExecutionContext.create(ctx).getContext().update;
  },
);
