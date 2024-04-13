import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Context } from 'grammy';
import { ChatMemberUpdated } from 'grammy/types';

export const DChatMemberUpdated = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ChatMemberUpdated => {
    const context: Context = ctx.getArgs()[0] as Context;
    const { update } = context;
    return update.chat_member;
  },
);
