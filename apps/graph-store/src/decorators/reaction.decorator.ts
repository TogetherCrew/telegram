import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Context } from 'grammy';
import { MessageReactionUpdated } from 'grammy/types';

export const DMessageReactionUpdated = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): MessageReactionUpdated => {
    const context: Context = ctx.getArgs()[0] as Context;
    const { update } = context;
    return update.message_reaction;
  },
);
