import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Chat = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { event_data } = ctx.switchToRpc().getData();

    return (
      event_data.chat ||
      event_data.edited_message?.chat ||
      event_data.message_reaction?.chat
    );
  },
);
