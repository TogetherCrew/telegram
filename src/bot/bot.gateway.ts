import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BotService } from './bot.service';

const groupNewTextMessageMetaKeyPrefix = 'GroupNewTextMessage';
const generateTextMessageMetaKey = (text?: string) => {
  if (text) return `${groupNewTextMessageMetaKeyPrefix}-${text}`;
  else return groupNewTextMessageMetaKeyPrefix;
};
function OnGroupNewTextMessage(text?: string) {
  return function (_target: any, propertyKey: string) {
    Reflect.defineMetadata(
      generateTextMessageMetaKey(text),
      propertyKey,
      BotGateway,
    );
  };
}

const groupEditedTextMessageMetaKeyPrefix = 'GroupEditedTextMessage';
const generateEditedTextMessageMetaKey = (text?: string) => {
  if (text) return `${groupEditedTextMessageMetaKeyPrefix}-${text}`;
  else return groupEditedTextMessageMetaKeyPrefix;
};
function OnGroupEditedTextMessage(text?: string) {
  return function (_target: any, propertyKey: string) {
    Reflect.defineMetadata(
      generateEditedTextMessageMetaKey(text),
      propertyKey,
      BotGateway,
    );
  };
}

@Injectable()
export class BotGateway {
  constructor(
    private botService: BotService,
    private configService: ConfigService,
  ) {}
}
