import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Context } from 'grammy';

export const Mentions = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string[] => {
    const context: Context = ctx.getArgs()[0] as Context;
    const { update } = context;

    const message = update.message || update.edited_message;

    const mentions = message.entities?.filter(
      (entity) => entity.type === 'mention',
    );

    const usernames = [];
    if (mentions) {
      for (const mention of mentions) {
        usernames.push(
          message.text.slice(
            mention.offset + 1,
            mention.offset + mention.length,
          ),
        );
      }
    }
    return usernames;
  },
);
