import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GrammyExecutionContext } from '@grammyjs/nestjs';
import { Update } from 'grammy/types';

export const UpdateDecorator = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    return GrammyExecutionContext.create(ctx).getContext().update as Update;
  },
);
