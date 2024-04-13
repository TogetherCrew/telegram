import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Context } from 'grammy';
import { Message } from 'grammy/types';

export const DMessage = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Message => {
    const context: Context = ctx.getArgs()[0] as Context;
    const { update } = context;
    return update.message || update.edited_message;
  },
);
