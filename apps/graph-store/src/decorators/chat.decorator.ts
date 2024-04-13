import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Context } from 'grammy';
import { Chat } from 'grammy/types';

export const DChat = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Chat => {
    const context: Context = ctx.getArgs()[0] as Context;
    const { update } = context;

    return (
      update.message?.chat ||
      update.edited_message?.chat ||
      update.message_reaction?.chat ||
      update.chat_member?.chat
    );
  },
);
