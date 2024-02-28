// bot.update.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { BotUpdate } from './bot.update';
import { BotService } from './bot.service';
import { Context } from 'grammy';
import { Message } from 'grammy/types';

describe('BotUpdate', () => {
  let botUpdate: BotUpdate;
  let botServiceMock: jest.Mocked<BotService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotUpdate,
        {
          provide: BotService,
          useValue: {
            message: jest.fn(),
            edited_message: jest.fn(),
            message_reaction: jest.fn(),
            chat_member: jest.fn(),
          },
        },
      ],
    }).compile();

    botUpdate = module.get<BotUpdate>(BotUpdate);
    botServiceMock = module.get(BotService);
  });

  it('should be defined', () => {
    expect(botUpdate).toBeDefined();
  });

  describe('start', () => {
    it('should reply with "Hello"', async () => {
      const ctx: Partial<Context> = {
        reply: jest.fn(),
      };
      await botUpdate.start(ctx as Context);
      expect(ctx.reply).toHaveBeenCalledWith('Hello');
    });
  });

  describe('message', () => {
    it('should call botService.message with the provided message', async () => {
      const message = {} as Message;
      await botUpdate.message(message);
      expect(botServiceMock.message).toHaveBeenCalledWith(message);
    });
  });

  describe('edited_message', () => {
    it('should call botService.edited_message with the provided update', async () => {
      const editedMessage: any = {
        /* mock edited message object */
      };
      await botUpdate.edited_message(editedMessage);
      expect(botServiceMock.edited_message).toHaveBeenCalledWith(editedMessage);
    });
  });

  describe('message_reaction', () => {
    it('should call botService.message_reaction with the provided update', async () => {
      const messageReaction: any = {
        /* mock message reaction object */
      };
      await botUpdate.message_reaction(messageReaction);
      expect(botServiceMock.message_reaction).toHaveBeenCalledWith(
        messageReaction,
      );
    });
  });

  describe('chat_member', () => {
    it('should call botService.chat_member with the provided update', async () => {
      const chatMember: any = {
        /* mock chat member object */
      };
      await botUpdate.chat_member(chatMember);
      expect(botServiceMock.chat_member).toHaveBeenCalledWith(chatMember);
    });
  });
});
