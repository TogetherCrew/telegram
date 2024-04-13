import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Context } from 'grammy';
import { User } from 'grammy/types';

export const DUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const context: Context = ctx.getArgs()[0] as Context;
    const { update } = context;

    return (
      update.message?.from ||
      update.edited_message?.from ||
      update.message_reaction?.user ||
      update.chat_member?.new_chat_member.user
    );
  },
);
