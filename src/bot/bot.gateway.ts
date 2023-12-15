import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from '@grammyjs/nestjs';
import { Bot, Context } from 'grammy';

const groupTextMessageMetaKeyPrefix = 'GroupTextMessage';
const generateTextMessageMetaKey = (text?: string) => {
  if (text) return `${groupTextMessageMetaKeyPrefix}-${text}`;
  else return groupTextMessageMetaKeyPrefix;
};
function OnGroupTextMessage(text?: string) {
  return function (_target: any, propertyKey: string) {
    Reflect.defineMetadata(
      generateTextMessageMetaKey(text),
      propertyKey,
      TelegramBotGateway,
    );
  };
}

@Injectable()
export class TelegramBotGateway {
  constructor(
    @InjectBot('TogetherCrew')
    private readonly bot: Bot<Context>,
  ) {
    this.bot
      .chatType(['group', 'supergroup'])
      .on('message:text', (ctx: Context) => {
        const textMessage = ctx.update.message.text;

        const specificFunctionName = Reflect.getMetadata(
          generateTextMessageMetaKey(textMessage),
          TelegramBotGateway,
        );

        const globalFunctionName = Reflect.getMetadata(
          groupTextMessageMetaKeyPrefix,
          TelegramBotGateway,
        );

        if (specificFunctionName) this[specificFunctionName](ctx);
        else if (globalFunctionName) this[globalFunctionName](ctx);
        else Logger.error('No Function was implemented for OnGroupTextMessage');
      });
  }
}
