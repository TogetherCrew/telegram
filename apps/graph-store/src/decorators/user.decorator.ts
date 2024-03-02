import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { event_data } = ctx.switchToRpc().getData();

    return (
      event_data.from ||
      event_data.edited_message?.from ||
      event_data.message_reaction?.user
    );
  },
);
