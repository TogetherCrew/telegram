import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TelegrafExecutionContext } from 'nestjs-telegraf';

export const EditedMessage = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    return TelegrafExecutionContext.create(ctx).getContext().update;
  },
);
