import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Context } from 'grammy';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context: Context = ctx.getArgs()[0] as Context;
    const { update } = context;

    return (
      update.message?.from ||
      update.edited_message?.from ||
      update.message_reaction?.user
    );
  },
);
