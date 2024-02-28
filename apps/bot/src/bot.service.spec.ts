// bot.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ClientProxy } from '@nestjs/microservices';
import { BotService } from './bot.service';
import { Events, Services } from '@app/common';
import { Message, Update } from 'grammy/types';

describe('BotService', () => {
  let service: BotService;
  let clientProxyMock: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotService,
        {
          provide: Services.EventStore,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BotService>(BotService);
    clientProxyMock = module.get(Services.EventStore);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should emit message event', async () => {
    const message = {} as Message;
    await service.message(message);
    expect(clientProxyMock.emit).toHaveBeenCalledWith(Events.Message, message);
  });

  it('should emit edited message event', async () => {
    const editedMessage = {} as Update;
    await service.edited_message(editedMessage as Update);
    expect(clientProxyMock.emit).toHaveBeenCalledWith(
      Events.EditedMessage,
      editedMessage,
    );
  });

  it('should emit message reaction event', async () => {
    const messageReaction = {} as Update;
    await service.message_reaction(messageReaction);
    expect(clientProxyMock.emit).toHaveBeenCalledWith(
      Events.MessageReaction,
      messageReaction,
    );
  });

  it('should emit chat member updated event', async () => {
    const chatMember = {} as Update;
    await service.chat_member(chatMember);
    expect(clientProxyMock.emit).toHaveBeenCalledWith(
      Events.ChatMemberUpdated,
      chatMember,
    );
  });
});
