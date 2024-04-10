import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Context } from 'grammy';

export const Message = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context: Context = ctx.getArgs()[0] as Context;
    const { update } = context;
    return update.message || update.edited_message;
  },
);
