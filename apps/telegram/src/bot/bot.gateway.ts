import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BotService } from './bot.service';
import input from 'input';
import { StringSession } from 'telegram/sessions';
import { NewMessage, NewMessageEvent } from 'telegram/events/NewMessage';
import {
  EditedMessage,
  EditedMessageEvent,
} from 'telegram/events/EditedMessage';
import { TelegramClient, sessions } from 'telegram';

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
  ) {
    const environment = configService.get('base.environment');
    if (environment != 'development' && environment != 'production') return;
    const apiId = configService.get('telegram.apiId');
    const apiHash = configService.get('telegram.apiHash');
    const session = configService.get('telegram.session');
    const sessionString = new StringSession(session); // fill this later with the value from session.save()

    const client = new TelegramClient(sessionString, apiId, apiHash, {
      connectionRetries: 5,
    });
    // TODO: refactor this part later
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this; // since we are using a callback, this will be undefined inside the callback, so we need to store it in a variable
    client
      .start({
        phoneNumber: async () => await input.text('Please enter your number: '),
        password: async () => await input.text('Please enter your password: '),
        phoneCode: async () =>
          await input.text('Please enter the code you received: '),
        onError: (err) => console.log(err),
      })
      .then(() => {
        Logger.verbose(
          '✅ Now you should be connected to the TELEGRAM servers ✅',
        );
        if (session == '') {
          Logger.verbose(`Client session: ${client.session.save()}`);
        }

        async function onNewMessageHandler(event: NewMessageEvent) {
          if (event.message.photo) {
            console.log('-> New PHOTO message');
          } else if (event.message.video) {
            console.log('-> New VIDEO message');
          } else if (event.message.audio) {
            console.log('-> New AUDIO message');
          } else if (event.message.sticker) {
            console.log('-> New STICKER message');
          } else if (event.message.document) {
            console.log('-> New DOCUMENT message');
          } else if (event.message.text) {
            console.log(`-> New TEXT message`);
            const textMessage = event.message.text;

            if (event.message.isChannel) {
              const specificFunctionName = Reflect.getMetadata(
                generateTextMessageMetaKey(textMessage),
                BotGateway,
              );

              const globalFunctionName = Reflect.getMetadata(
                groupNewTextMessageMetaKeyPrefix,
                BotGateway,
              );

              if (specificFunctionName) that[specificFunctionName](event);
              else if (globalFunctionName) that[globalFunctionName](event);
              else
                Logger.warn(
                  'No Function was implemented for OnGroupTextMessage',
                );
            }
          } else {
            console.log('⚠️  ⚠️  ⚠️  Other type of message ⚠️  ⚠️  ⚠️');
          }
        }
        client.addEventHandler(onNewMessageHandler, new NewMessage({}));

        async function onEditedMessageHandler(event: EditedMessageEvent) {
          if (event.message.photo) {
            console.log('-> Edited PHOTO message');
          } else if (event.message.video) {
            console.log('-> Edited VIDEO message');
          } else if (event.message.audio) {
            console.log('-> Edited AUDIO message');
          } else if (event.message.sticker) {
            console.log('-> Edited STICKER message');
          } else if (event.message.document) {
            console.log('-> Edited DOCUMENT message');
          } else if (event.message.text) {
            const textMessage = event.message.text;
            console.log(`-> Edited TEXT message`, textMessage);

            if (event.message.isChannel) {
              const specificFunctionName = Reflect.getMetadata(
                generateEditedTextMessageMetaKey(textMessage),
                BotGateway,
              );

              const globalFunctionName = Reflect.getMetadata(
                groupEditedTextMessageMetaKeyPrefix,
                BotGateway,
              );

              if (specificFunctionName) that[specificFunctionName](event);
              else if (globalFunctionName) that[globalFunctionName](event);
              else
                Logger.warn(
                  'No Function was implemented for OnGroupTextMessage',
                );
            }
          } else {
            console.log('⚠️  ⚠️  ⚠️  Other type of message ⚠️  ⚠️  ⚠️');
          }
        }
        client.addEventHandler(onEditedMessageHandler, new EditedMessage({}));
      });
  }

  @OnGroupNewTextMessage()
  onGroupNewTextMessage(update: NewMessageEvent) {
    console.log('onGroupNewTextMessage', update.message.text);
  }

  @OnGroupEditedTextMessage()
  onGroupEditedTextMessage(update: NewMessageEvent) {
    console.log('onGroupEditedTextMessage', update.message.text);
  }
}
