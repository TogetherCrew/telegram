import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Context } from 'grammy';

export const Chat = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const context: Context = ctx.getArgs()[0] as Context;
    const { update } = context;

    return (
      update.message?.chat ||
      update.edited_message?.chat ||
      update.message_reaction?.chat
    );
  },
);
