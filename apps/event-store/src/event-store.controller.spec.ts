// events.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { EventStoreController } from './event-store.controller';
import { EventStoreService } from './event-store.service';
import { UpdateEvent } from '@app/common';
import { Message, Update } from 'grammy/types';
import { RmqService } from '@app/common';

// Mock RmqService
class RmqServiceMock {
  ack = jest.fn();
}

describe('EventStoreController', () => {
  let controller: EventStoreController;
  let eventsService: EventStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventStoreController],
      providers: [
        {
          provide: EventStoreService,
          useValue: {
            createEvent: jest.fn(),
          },
        },
        { provide: RmqService, useClass: RmqServiceMock },
      ],
    }).compile();

    controller = module.get<EventStoreController>(EventStoreController);
    eventsService = module.get<EventStoreService>(EventStoreService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('message', () => {
    it('should call createEvent with correct parameters', async () => {
      const mockMessage = {
        date: 1234,
        chat: { id: 1234 },
      } as Message;
      const mockUpdate = { message: mockMessage };
      await controller.message({ update: mockUpdate });
      expect(eventsService.createEvent).toHaveBeenCalledWith(
        mockMessage.date,
        mockMessage.chat.id,
        UpdateEvent.MESSAGE,
        mockUpdate,
      );
    });
  });

  describe('edited_message', () => {
    it('should call createEvent with correct parameters', async () => {
      const mockUpdate = {
        edited_message: {
          date: 1234,
          chat: { id: 1234 },
        },
      } as Update;
      await controller.edited_message({ update: mockUpdate });
      expect(eventsService.createEvent).toHaveBeenCalledWith(
        mockUpdate.edited_message.date,
        mockUpdate.edited_message.chat.id,
        UpdateEvent.EDITED_MESSAGE,
        mockUpdate,
      );
    });
  });

  describe('message_reaction', () => {
    it('should call createEvent with correct parameters', async () => {
      const mockUpdate = {
        message_reaction: {
          date: 1234,
          chat: { id: 1234 },
        },
      } as Update;
      await controller.message_reaction({ update: mockUpdate });
      expect(eventsService.createEvent).toHaveBeenCalledWith(
        mockUpdate.message_reaction.date,
        mockUpdate.message_reaction.chat.id,
        UpdateEvent.MESSAGE_REACTION,
        mockUpdate,
      );
    });
  });

  describe('chat_member', () => {
    it('should call createEvent with correct parameters', async () => {
      const mockUpdate = {
        chat_member: {
          date: 1234,
          chat: { id: 1234 },
        },
      } as Update;
      await controller.chat_member({ update: mockUpdate });
      expect(eventsService.createEvent).toHaveBeenCalledWith(
        mockUpdate.chat_member.date,
        mockUpdate.chat_member.chat.id,
        UpdateEvent.CHAT_MEMBER,
        mockUpdate,
      );
    });
  });
});
