import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Mentions = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string[] => {
    const { event_data } = ctx.switchToRpc().getData();

    const message = event_data || event_data.edited_message;

    const mentions = message.entities?.filter(
      (entity) => entity.type === 'mention',
    );

    const usernames = [];
    if (mentions) {
      for (const mention of mentions) {
        usernames.push(
          message.text.slice(mention.offset, mention.offset + mention.length),
        );
      }
    }

    return usernames;
  },
);
